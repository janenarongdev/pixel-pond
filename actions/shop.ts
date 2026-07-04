"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireProfile } from "@/lib/profile";

export async function buyRod(rodId: string) {
  const profile = await requireProfile();

  const rod = await prisma.rod.findUnique({ where: { id: rodId } });
  if (!rod) throw new Error("Rod not found.");

  const alreadyOwned = await prisma.playerRod.findUnique({
    where: { profileId_rodId: { profileId: profile.id, rodId } },
  });
  if (alreadyOwned) throw new Error("You already own this rod.");

  if (profile.gold < rod.price) throw new Error("Insufficient gold.");

  await prisma.$transaction([
    prisma.playerRod.create({
      data: { profileId: profile.id, rodId },
    }),
    prisma.profile.update({
      where: { id: profile.id },
      data: { gold: { decrement: rod.price } },
    }),
  ]);

  revalidatePath("/shop");
  revalidatePath("/dashboard");
}

export async function equipRod(rodId: string) {
  const profile = await requireProfile();

  const owned = await prisma.playerRod.findUnique({
    where: { profileId_rodId: { profileId: profile.id, rodId } },
  });
  if (!owned) throw new Error("You do not own this rod.");

  await prisma.profile.update({
    where: { id: profile.id },
    data: { equippedRodId: rodId },
  });

  revalidatePath("/shop");
  revalidatePath("/dashboard");
  revalidatePath("/fishing");
}
