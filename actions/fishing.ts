"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireProfile } from "@/lib/profile";

export type FishingResult = {
  fish: {
    id: string;
    name: string;
    rarity: string;
    sellPrice: number;
    imageUrl: string | null;
  };
  quantityOwned: number;
};

function pickWeightedFish<T extends { rarity: string; dropRate: unknown }>(
  species: T[],
  luckBonus: number,
): T {
  const weights = species.map((fish) => {
    const base = Number(fish.dropRate);
    return fish.rarity === "common" ? base : base * (1 + luckBonus / 100);
  });
  const total = weights.reduce((sum, weight) => sum + weight, 0);

  let roll = Math.random() * total;
  for (let i = 0; i < species.length; i++) {
    roll -= weights[i];
    if (roll <= 0) return species[i];
  }
  return species[species.length - 1];
}

export async function goFishing(): Promise<FishingResult> {
  const profile = await requireProfile();

  const species = await prisma.fishSpecies.findMany();
  if (species.length === 0) {
    throw new Error("No fish species are available yet.");
  }

  const luckBonus = profile.equippedRod?.luckBonus ?? 0;
  const selected = pickWeightedFish(species, luckBonus);

  const [, inventory] = await prisma.$transaction([
    prisma.catch.create({
      data: { profileId: profile.id, fishSpeciesId: selected.id },
    }),
    prisma.inventory.upsert({
      where: {
        profileId_fishSpeciesId: {
          profileId: profile.id,
          fishSpeciesId: selected.id,
        },
      },
      create: {
        profileId: profile.id,
        fishSpeciesId: selected.id,
        quantity: 1,
      },
      update: { quantity: { increment: 1 } },
    }),
  ]);

  revalidatePath("/dashboard");
  revalidatePath("/inventory");
  revalidatePath("/collection");

  return {
    fish: {
      id: selected.id,
      name: selected.name,
      rarity: selected.rarity,
      sellPrice: selected.sellPrice,
      imageUrl: selected.imageUrl,
    },
    quantityOwned: inventory.quantity,
  };
}
