"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/profile";
import { fishSpeciesSchema } from "@/lib/validation";

export async function createFishSpecies(input: unknown) {
  await requireAdmin();
  const data = fishSpeciesSchema.parse(input);

  await prisma.fishSpecies.create({ data });

  revalidatePath("/admin/fish");
  revalidatePath("/collection");
  revalidatePath("/market");
}

export async function updateFishSpecies(id: string, input: unknown) {
  await requireAdmin();
  const data = fishSpeciesSchema.parse(input);

  await prisma.fishSpecies.update({ where: { id }, data });

  revalidatePath("/admin/fish");
  revalidatePath("/collection");
  revalidatePath("/inventory");
  revalidatePath("/market");
}

export async function deleteFishSpecies(id: string) {
  await requireAdmin();

  await prisma.fishSpecies.delete({ where: { id } });

  revalidatePath("/admin/fish");
  revalidatePath("/collection");
  revalidatePath("/inventory");
  revalidatePath("/market");
}
