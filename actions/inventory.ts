"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireProfile } from "@/lib/profile";

const sellFishSchema = z.object({
  fishSpeciesId: z.string().uuid(),
  quantity: z.coerce.number().int().min(1),
});

export type SellFishInput = z.infer<typeof sellFishSchema>;

export async function sellFish(input: SellFishInput) {
  const { fishSpeciesId, quantity } = sellFishSchema.parse(input);
  const profile = await requireProfile();

  const inventory = await prisma.inventory.findUnique({
    where: {
      profileId_fishSpeciesId: { profileId: profile.id, fishSpeciesId },
    },
    include: { fishSpecies: true },
  });

  if (!inventory || inventory.quantity < quantity) {
    throw new Error("You don't have enough of this fish to sell.");
  }

  const totalGold = inventory.fishSpecies.sellPrice * quantity;

  await prisma.$transaction([
    prisma.inventory.update({
      where: { id: inventory.id },
      data: { quantity: { decrement: quantity } },
    }),
    prisma.profile.update({
      where: { id: profile.id },
      data: { gold: { increment: totalGold } },
    }),
    prisma.transaction.create({
      data: {
        profileId: profile.id,
        fishSpeciesId,
        quantity,
        totalGold,
      },
    }),
  ]);

  revalidatePath("/inventory");
  revalidatePath("/market");
  revalidatePath("/dashboard");

  return { totalGold };
}
