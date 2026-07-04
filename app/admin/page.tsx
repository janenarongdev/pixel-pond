import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/profile";
import { AdminShell } from "@/components/admin/admin-shell";

export default async function AdminDashboardPage() {
  const session = await auth();
  const profile = await requireAdmin();

  const [
    playerCount,
    fishSpeciesCount,
    rodCount,
    totalGold,
    totalCatches,
    totalTransactions,
  ] = await Promise.all([
    prisma.profile.count(),
    prisma.fishSpecies.count(),
    prisma.rod.count(),
    prisma.profile.aggregate({ _sum: { gold: true } }),
    prisma.catch.count(),
    prisma.transaction.count(),
  ]);

  const username = session?.user?.name ?? "Admin";
  const avatarUrl = session?.user?.image ?? null;

  return (
    <AdminShell username={username} avatarUrl={avatarUrl} gold={profile.gold}>
      <h1 className="mb-6 text-2xl font-bold">Admin Dashboard</h1>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
        <div className="stat bg-base-100 rounded-box shadow">
          <div className="stat-title">Players</div>
          <div className="stat-value text-2xl">{playerCount}</div>
        </div>
        <div className="stat bg-base-100 rounded-box shadow">
          <div className="stat-title">Fish Species</div>
          <div className="stat-value text-2xl">{fishSpeciesCount}</div>
        </div>
        <div className="stat bg-base-100 rounded-box shadow">
          <div className="stat-title">Rods</div>
          <div className="stat-value text-2xl">{rodCount}</div>
        </div>
        <div className="stat bg-base-100 rounded-box shadow">
          <div className="stat-title">Gold in Economy</div>
          <div className="stat-value text-2xl">{totalGold._sum.gold ?? 0}</div>
        </div>
        <div className="stat bg-base-100 rounded-box shadow">
          <div className="stat-title">Total Catches</div>
          <div className="stat-value text-2xl">{totalCatches}</div>
        </div>
        <div className="stat bg-base-100 rounded-box shadow">
          <div className="stat-title">Total Transactions</div>
          <div className="stat-value text-2xl">{totalTransactions}</div>
        </div>
      </div>
    </AdminShell>
  );
}
