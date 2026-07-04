"use client";

import { useState } from "react";
import Image from "next/image";
import { RarityBadge } from "@/components/rarity-badge";

export type CollectionFish = {
  id: string;
  name: string;
  rarity: string;
  imageUrl: string | null;
  discovered: boolean;
};

const FILTERS = ["all", "common", "rare", "epic", "legendary"] as const;

export function CollectionGrid({ fish }: { fish: CollectionFish[] }) {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("all");

  const visible = fish.filter((f) => filter === "all" || f.rarity === filter);

  return (
    <div>
      <div className="tabs tabs-boxed mb-4 w-fit">
        {FILTERS.map((f) => (
          <button
            key={f}
            className={`tab ${filter === f ? "tab-active" : ""}`}
            onClick={() => setFilter(f)}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
        {visible.map((f) => (
          <div
            key={f.id}
            className="card bg-base-100 items-center p-4 text-center shadow"
          >
            <div className="flex h-16 w-16 items-center justify-center">
              {f.discovered && f.imageUrl ? (
                <Image
                  src={f.imageUrl}
                  alt={f.name}
                  width={64}
                  height={64}
                  unoptimized
                />
              ) : (
                <div className="bg-base-300 flex h-16 w-16 items-center justify-center rounded text-2xl">
                  ?
                </div>
              )}
            </div>
            <p className="mt-2 font-semibold">
              {f.discovered ? f.name : "???"}
            </p>
            {f.discovered ? (
              <RarityBadge rarity={f.rarity} />
            ) : (
              <span className="badge badge-ghost">???</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
