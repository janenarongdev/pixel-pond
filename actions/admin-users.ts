"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/profile";
import { roleSchema } from "@/lib/validation";

export async function updateUserRole(profileId: string, role: unknown) {
  const admin = await requireAdmin();
  const parsedRole = roleSchema.parse(role);

  if (admin.id === profileId) {
    throw new Error("You cannot change your own role.");
  }

  await prisma.profile.update({
    where: { id: profileId },
    data: { role: parsedRole },
  });

  revalidatePath("/admin/users");
}
