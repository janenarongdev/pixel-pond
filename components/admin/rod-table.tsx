"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  rodSchema,
  type RodFormInput,
  type RodFormOutput,
} from "@/lib/validation";
import { createRod, updateRod, deleteRod } from "@/actions/admin-rods";

type RodRow = {
  id: string;
  name: string;
  price: number;
  luckBonus: number;
  imageUrl: string | null;
};

export function RodTable({ rods }: { rods: RodRow[] }) {
  const [editing, setEditing] = useState<RodRow | "new" | null>(null);
  const [deleting, setDeleting] = useState<RodRow | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    if (!deleting) return;
    setError(null);
    startTransition(async () => {
      try {
        await deleteRod(deleting.id);
        setDeleting(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to delete.");
        setDeleting(null);
      }
    });
  }

  return (
    <div>
      <div className="mb-4 flex justify-end">
        <button
          className="btn btn-primary btn-sm"
          onClick={() => setEditing("new")}
        >
          + Add Rod
        </button>
      </div>

      {error && <p className="text-error mb-2">{error}</p>}

      <div className="overflow-x-auto">
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Price</th>
              <th>Luck Bonus</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {rods.map((r) => (
              <tr key={r.id}>
                <td>
                  <div className="flex items-center gap-2">
                    {r.imageUrl && (
                      <Image
                        src={r.imageUrl}
                        alt={r.name}
                        width={28}
                        height={28}
                        unoptimized
                      />
                    )}
                    {r.name}
                  </div>
                </td>
                <td>{r.price === 0 ? "Free" : `${r.price} Gold`}</td>
                <td>+{r.luckBonus}%</td>
                <td className="flex gap-2">
                  <button
                    className="btn btn-ghost btn-xs"
                    onClick={() => setEditing(r)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-ghost btn-xs text-error"
                    onClick={() => setDeleting(r)}
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
        <RodFormModal
          initial={editing === "new" ? null : editing}
          onClose={() => setEditing(null)}
        />
      )}

      {deleting && (
        <dialog className="modal modal-open">
          <div className="modal-box">
            <h3 className="text-lg font-bold">Delete {deleting.name}?</h3>
            <p className="py-4">
              This removes the rod from the shop. Players who already own it
              keep it unless it is currently equipped.
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

function RodFormModal({
  initial,
  onClose,
}: {
  initial: RodRow | null;
  onClose: () => void;
}) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RodFormInput, unknown, RodFormOutput>({
    resolver: zodResolver(rodSchema),
    defaultValues: initial
      ? {
          name: initial.name,
          price: initial.price,
          luckBonus: initial.luckBonus,
          imageUrl: initial.imageUrl ?? "",
        }
      : {
          name: "",
          price: 0,
          luckBonus: 0,
          imageUrl: "",
        },
  });

  function onSubmit(values: RodFormOutput) {
    setError(null);
    startTransition(async () => {
      try {
        if (initial) {
          await updateRod(initial.id, values);
        } else {
          await createRod(values);
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
          {initial ? "Edit Rod" : "Add Rod"}
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
            <span className="label-text">Price (Gold)</span>
            <input
              type="number"
              className="input input-bordered"
              {...register("price")}
            />
            {errors.price && (
              <span className="text-error text-xs">{errors.price.message}</span>
            )}
          </label>
          <label className="form-control">
            <span className="label-text">Luck Bonus (%)</span>
            <input
              type="number"
              className="input input-bordered"
              {...register("luckBonus")}
            />
            {errors.luckBonus && (
              <span className="text-error text-xs">
                {errors.luckBonus.message}
              </span>
            )}
          </label>
          <label className="form-control">
            <span className="label-text">Image URL</span>
            <input
              className="input input-bordered"
              placeholder="/assets/rods/example-rod.png"
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
