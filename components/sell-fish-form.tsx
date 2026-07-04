"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { sellFish } from "@/actions/inventory";

export function SellFishForm({
  fishSpeciesId,
  maxQuantity,
  sellPrice,
}: {
  fishSpeciesId: string;
  maxQuantity: number;
  sellPrice: number;
}) {
  const schema = z.object({
    quantity: z.coerce
      .number()
      .int()
      .min(1, "Enter at least 1")
      .max(maxQuantity, `You only own ${maxQuantity}`),
  });
  type FormInput = z.input<typeof schema>;
  type FormOutput = z.output<typeof schema>;

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormInput, unknown, FormOutput>({
    resolver: zodResolver(schema),
    defaultValues: { quantity: 1 },
  });

  const [isPending, startTransition] = useTransition();
  const [pendingValues, setPendingValues] = useState<FormOutput | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);

  const quantity = Number(watch("quantity")) || 0;

  function confirmSell() {
    if (!pendingValues) return;
    startTransition(async () => {
      try {
        await sellFish({ fishSpeciesId, quantity: pendingValues.quantity });
        setPendingValues(null);
      } catch (err) {
        setServerError(err instanceof Error ? err.message : "Failed to sell.");
        setPendingValues(null);
      }
    });
  }

  return (
    <form
      onSubmit={handleSubmit((values) => {
        setServerError(null);
        setPendingValues(values);
      })}
      className="flex flex-wrap items-center gap-2"
    >
      <input
        type="number"
        min={1}
        max={maxQuantity}
        className="input input-bordered input-sm w-20"
        {...register("quantity")}
      />
      <span className="text-base-content/60 text-sm">
        Total: {quantity * sellPrice} Gold
      </span>
      <button
        type="submit"
        className="btn btn-secondary btn-sm"
        disabled={maxQuantity < 1}
      >
        Sell
      </button>
      {errors.quantity && (
        <span className="text-error text-xs">{errors.quantity.message}</span>
      )}
      {serverError && <span className="text-error text-xs">{serverError}</span>}

      {pendingValues && (
        <dialog className="modal modal-open">
          <div className="modal-box">
            <h3 className="text-lg font-bold">Confirm Sale</h3>
            <p className="py-4">
              Sell {pendingValues.quantity} for{" "}
              {pendingValues.quantity * sellPrice} Gold?
            </p>
            <div className="modal-action">
              <button
                type="button"
                className="btn"
                onClick={() => setPendingValues(null)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={confirmSell}
                disabled={isPending}
              >
                {isPending ? (
                  <span className="loading loading-spinner"></span>
                ) : (
                  "Confirm"
                )}
              </button>
            </div>
          </div>
        </dialog>
      )}
    </form>
  );
}
