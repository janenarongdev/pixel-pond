"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  fishSpeciesSchema,
  type FishSpeciesFormInput,
  type FishSpeciesFormOutput,
} from "@/lib/validation";
import {
  createFishSpecies,
  updateFishSpecies,
  deleteFishSpecies,
} from "@/actions/admin-fish";
import { RarityBadge } from "@/components/rarity-badge";

type FishRow = {
  id: string;
  name: string;
  rarity: string;
  dropRate: number;
  sellPrice: number;
  imageUrl: string | null;
};

export function FishTable({ fish }: { fish: FishRow[] }) {
  const [editing, setEditing] = useState<FishRow | "new" | null>(null);
  const [deleting, setDeleting] = useState<FishRow | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    if (!deleting) return;
    setError(null);
    startTransition(async () => {
      try {
        await deleteFishSpecies(deleting.id);
        setDeleting(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to delete.");
        setDeleting(null);
      }
    });
  }

  const totalDropRate = fish.reduce((sum, f) => sum + f.dropRate, 0);

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <p className="text-base-content/60 text-sm">
          Total drop rate: {totalDropRate.toFixed(1)}%
          {Math.abs(totalDropRate - 100) > 0.01 && (
            <span className="text-warning ml-2">should equal 100%</span>
          )}
        </p>
        <button
          className="btn btn-primary btn-sm"
          onClick={() => setEditing("new")}
        >
          + Add Fish
        </button>
      </div>

      {error && <p className="text-error mb-2">{error}</p>}

      <div className="overflow-x-auto">
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Rarity</th>
              <th>Drop Rate</th>
              <th>Sell Price</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {fish.map((f) => (
              <tr key={f.id}>
                <td>
                  <div className="flex items-center gap-2">
                    {f.imageUrl && (
                      <Image
                        src={f.imageUrl}
                        alt={f.name}
                        width={28}
                        height={28}
                        unoptimized
                      />
                    )}
                    {f.name}
                  </div>
                </td>
                <td>
                  <RarityBadge rarity={f.rarity} />
                </td>
                <td>{f.dropRate}%</td>
                <td>{f.sellPrice} Gold</td>
                <td className="flex gap-2">
                  <button
                    className="btn btn-ghost btn-xs"
                    onClick={() => setEditing(f)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-ghost btn-xs text-error"
                    onClick={() => setDeleting(f)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editing && (
        <FishFormModal
          initial={editing === "new" ? null : editing}
          onClose={() => setEditing(null)}
        />
      )}

      {deleting && (
        <dialog className="modal modal-open">
          <div className="modal-box">
            <h3 className="text-lg font-bold">Delete {deleting.name}?</h3>
            <p className="py-4">
              This permanently removes it from every player&apos;s inventory and
              catch history.
            </p>
            <div className="modal-action">
              <button className="btn" onClick={() => setDeleting(null)}>
                Cancel
              </button>
              <button
                className="btn btn-error"
                onClick={handleDelete}
                disabled={isPending}
              >
                {isPending ? (
                  <span className="loading loading-spinner"></span>
                ) : (
                  "Delete"
                )}
              </button>
            </div>
          </div>
        </dialog>
      )}
    </div>
  );
}

function FishFormModal({
  initial,
  onClose,
}: {
  initial: FishRow | null;
  onClose: () => void;
}) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FishSpeciesFormInput, unknown, FishSpeciesFormOutput>({
    resolver: zodResolver(fishSpeciesSchema),
    defaultValues: initial
      ? {
          name: initial.name,
          rarity: initial.rarity as FishSpeciesFormInput["rarity"],
          dropRate: initial.dropRate,
          sellPrice: initial.sellPrice,
          imageUrl: initial.imageUrl ?? "",
        }
      : {
          name: "",
          rarity: "common",
          dropRate: 0,
          sellPrice: 0,
          imageUrl: "",
        },
  });

  function onSubmit(values: FishSpeciesFormOutput) {
    setError(null);
    startTransition(async () => {
      try {
        if (initial) {
          await updateFishSpecies(initial.id, values);
        } else {
          await createFishSpecies(values);
        }
        onClose();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to save.");
      }
    });
  }

  return (
    <dialog className="modal modal-open">
      <div className="modal-box">
        <h3 className="text-lg font-bold">
          {initial ? "Edit Fish" : "Add Fish"}
        </h3>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mt-4 flex flex-col gap-3"
        >
          <label className="form-control">
            <span className="label-text">Name</span>
            <input className="input input-bordered" {...register("name")} />
            {errors.name && (
              <span className="text-error text-xs">{errors.name.message}</span>
            )}
          </label>
          <label className="form-control">
            <span className="label-text">Rarity</span>
            <select className="select select-bordered" {...register("rarity")}>
              <option value="common">Common</option>
              <option value="rare">Rare</option>
              <option value="epic">Epic</option>
              <option value="legendary">Legendary</option>
            </select>
          </label>
          <label className="form-control">
            <span className="label-text">Drop Rate (%)</span>
            <input
              type="number"
              step="0.1"
              className="input input-bordered"
              {...register("dropRate")}
            />
            {errors.dropRate && (
              <span className="text-error text-xs">
                {errors.dropRate.message}
              </span>
            )}
          </label>
          <label className="form-control">
            <span className="label-text">Sell Price (Gold)</span>
            <input
              type="number"
              className="input input-bordered"
              {...register("sellPrice")}
            />
            {errors.sellPrice && (
              <span className="text-error text-xs">
                {errors.sellPrice.message}
              </span>
            )}
          </label>
          <label className="form-control">
            <span className="label-text">Image URL</span>
            <input
              className="input input-bordered"
              placeholder="/assets/fish/common/example.png"
              {...register("imageUrl")}
            />
          </label>

          {error && <p className="text-error text-sm">{error}</p>}

          <div className="modal-action">
            <button type="button" className="btn" onClick={onClose}>
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isPending}
            >
              {isPending ? (
                <span className="loading loading-spinner"></span>
              ) : (
                "Save"
              )}
            </button>
          </div>
        </form>
      </div>
    </dialog>
  );
}
