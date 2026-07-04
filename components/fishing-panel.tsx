"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import { goFishing, type FishingResult } from "@/actions/fishing";
import { RarityBadge } from "@/components/rarity-badge";

export function FishingPanel() {
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<FishingResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  function handleGoFishing() {
    setError(null);
    startTransition(async () => {
      try {
        const catchResult = await goFishing();
        setResult(catchResult);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong.");
      }
    });
  }

  return (
    <>
      <button
        className="btn btn-primary btn-lg"
        onClick={handleGoFishing}
        disabled={isPending}
      >
        {isPending ? (
          <span className="loading loading-spinner"></span>
        ) : (
          "Cast Fishing Line"
        )}
      </button>

      {error && <p className="text-error mt-2">{error}</p>}

      {result && (
        <dialog className="modal modal-open">
          <div className="modal-box text-center">
            <h3 className="text-lg font-bold">You Caught!</h3>
            <div className="my-4 flex justify-center">
              {result.fish.imageUrl && (
                <Image
                  src={result.fish.imageUrl}
                  alt={result.fish.name}
                  width={96}
                  height={96}
                  unoptimized
                />
              )}
            </div>
            <p className="text-xl font-semibold">{result.fish.name}</p>
            <div className="my-2 flex justify-center">
              <RarityBadge rarity={result.fish.rarity} />
            </div>
            <p className="text-success font-medium">
              Sell value: {result.fish.sellPrice} Gold
            </p>
            <p className="text-base-content/60 text-sm">
              You now own {result.quantityOwned}.
            </p>
            <div className="modal-action justify-center">
              <button
                className="btn btn-primary"
                onClick={() => setResult(null)}
              >
                OK
              </button>
            </div>
          </div>
        </dialog>
      )}
    </>
  );
}
