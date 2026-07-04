import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/profile";
import { AdminShell } from "@/components/admin/admin-shell";
import { FishTable } from "@/components/admin/fish-table";

export default async function AdminFishPage() {
  const session = await auth();
  const profile = await requireAdmin();

  const fish = await prisma.fishSpecies.findMany({
    orderBy: { rarity: "asc" },
  });

  const username = session?.user?.name ?? "Admin";
  const avatarUrl = session?.user?.image ?? null;

  return (
    <AdminShell username={username} avatarUrl={avatarUrl} gold={profile.gold}>
      <h1 className="mb-6 text-2xl font-bold">Fish Management</h1>
      <FishTable
        fish={fish.map((f) => ({
          id: f.id,
          name: f.name,
          rarity: f.rarity,
          dropRate: Number(f.dropRate),
          sellPrice: f.sellPrice,
          imageUrl: f.imageUrl,
        }))}
      />
    </AdminShell>
  );
}
