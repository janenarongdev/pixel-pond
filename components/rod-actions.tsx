"use client";

import { useState, useTransition } from "react";
import { buyRod, equipRod } from "@/actions/shop";

export function RodActions({
  rodId,
  owned,
  equipped,
  canAfford,
}: {
  rodId: string;
  owned: boolean;
  equipped: boolean;
  canAfford: boolean;
}) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleBuy() {
    setError(null);
    startTransition(async () => {
      try {
        await buyRod(rodId);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to buy.");
      }
    });
  }

  function handleEquip() {
    setError(null);
    startTransition(async () => {
      try {
        await equipRod(rodId);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to equip.");
      }
    });
  }

  return (
    <div>
      {equipped ? (
        <button className="btn btn-sm" disabled>
          Equipped
        </button>
      ) : owned ? (
        <button
          className="btn btn-secondary btn-sm"
          onClick={handleEquip}
          disabled={isPending}
        >
          Equip
        </button>
      ) : (
        <button
          className="btn btn-primary btn-sm"
          onClick={handleBuy}
          disabled={isPending || !canAfford}
        >
          Buy
        </button>
      )}
      {error && <p className="text-error text-xs">{error}</p>}
    </div>
  );
}
