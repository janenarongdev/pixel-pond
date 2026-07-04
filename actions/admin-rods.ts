"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/profile";
import { rodSchema } from "@/lib/validation";

export async function createRod(input: unknown) {
  await requireAdmin();
  const data = rodSchema.parse(input);

  await prisma.rod.create({ data });

  revalidatePath("/admin/rods");
  revalidatePath("/shop");
}

export async function updateRod(id: string, input: unknown) {
  await requireAdmin();
  const data = rodSchema.parse(input);

  await prisma.rod.update({ where: { id }, data });

  revalidatePath("/admin/rods");
  revalidatePath("/shop");
  revalidatePath("/fishing");
}

export async function deleteRod(id: string) {
  await requireAdmin();

  const equippedCount = await prisma.profile.count({
    where: { equippedRodId: id },
  });
  if (equippedCount > 0) {
    throw new Error(
      "Cannot delete: this rod is currently equipped by one or more players.",
    );
  }

  await prisma.rod.delete({ where: { id } });

  revalidatePath("/admin/rods");
  revalidatePath("/shop");
}
