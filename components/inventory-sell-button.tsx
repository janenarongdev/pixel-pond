"use client";

import { useState, useTransition } from "react";
import { sellFish } from "@/actions/inventory";

export function InventorySellButton({
  fishSpeciesId,
  quantity,
}: {
  fishSpeciesId: string;
  quantity: number;
}) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleSell() {
    setError(null);
    startTransition(async () => {
      try {
        await sellFish({ fishSpeciesId, quantity: 1 });
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to sell.");
      }
    });
  }

  return (
    <div>
      <button
        className="btn btn-secondary btn-sm"
        onClick={handleSell}
        disabled={isPending || quantity < 1}
      >
        Sell 1
      </button>
      {error && <p className="text-error text-xs">{error}</p>}
    </div>
  );
}
