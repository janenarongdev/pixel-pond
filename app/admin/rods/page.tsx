import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/profile";
import { AdminShell } from "@/components/admin/admin-shell";
import { RodTable } from "@/components/admin/rod-table";

export default async function AdminRodsPage() {
  const session = await auth();
  const profile = await requireAdmin();

  const rods = await prisma.rod.findMany({ orderBy: { price: "asc" } });

  const username = session?.user?.name ?? "Admin";
  const avatarUrl = session?.user?.image ?? null;

  return (
    <AdminShell username={username} avatarUrl={avatarUrl} gold={profile.gold}>
      <h1 className="mb-6 text-2xl font-bold">Rod Management</h1>
      <RodTable
        rods={rods.map((r) => ({
          id: r.id,
          name: r.name,
          price: r.price,
          luckBonus: r.luckBonus,
          imageUrl: r.imageUrl,
        }))}
      />
    </AdminShell>
  );
}
