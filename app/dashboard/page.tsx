import Link from "next/link";
import Image from "next/image";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { requireProfile } from "@/lib/profile";
import { AppShell } from "@/components/app-shell";
import { RarityBadge } from "@/components/rarity-badge";
import { formatRelativeTime } from "@/utils/format";

export default async function DashboardPage() {
  const session = await auth();
  const profile = await requireProfile();

  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  const [
    inventoryTotal,
    totalSpeciesCount,
    discoveredSpecies,
    todaysCatchCount,
    recentCatches,
    recentTransactions,
  ] = await Promise.all([
    prisma.inventory.aggregate({
      where: { profileId: profile.id },
      _sum: { quantity: true },
    }),
    prisma.fishSpecies.count(),
    prisma.catch.findMany({
      where: { profileId: profile.id },
      distinct: ["fishSpeciesId"],
      select: { fishSpeciesId: true },
    }),
    prisma.catch.count({
      where: { profileId: profile.id, caughtAt: { gte: startOfToday } },
    }),
    prisma.catch.findMany({
      where: { profileId: profile.id },
      orderBy: { caughtAt: "desc" },
      take: 5,
      include: { fishSpecies: true },
    }),
    prisma.transaction.findMany({
      where: { profileId: profile.id },
      orderBy: { createdAt: "desc" },
      take: 5,
      include: { fishSpecies: true },
    }),
  ]);

  const username = session?.user?.name ?? "Player";
  const avatarUrl = session?.user?.image ?? null;
  const totalFishOwned = inventoryTotal._sum.quantity ?? 0;

  return (
    <AppShell username={username} avatarUrl={avatarUrl} gold={profile.gold}>
      <h1 className="mb-6 text-2xl font-bold">Dashboard</h1>

      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-5">
        <div className="stat bg-base-100 rounded-box shadow">
          <div className="stat-title">Gold</div>
          <div className="stat-value text-primary text-2xl">
            {profile.gold}
          </div>
        </div>
        <div className="stat bg-base-100 rounded-box shadow">
          <div className="stat-title">Equipped Rod</div>
          <div className="stat-value text-lg">
            {profile.equippedRod?.name ?? "None"}
          </div>
        </div>
        <div className="stat bg-base-100 rounded-box shadow">
          <div className="stat-title">Total Fish Owned</div>
          <div className="stat-value text-2xl">{totalFishOwned}</div>
        </div>
        <div className="stat bg-base-100 rounded-box shadow">
          <div className="stat-title">Collection Progress</div>
          <div className="stat-value text-lg">
            {discoveredSpecies.length} / {totalSpeciesCount}
          </div>
        </div>
        <div className="stat bg-base-100 rounded-box shadow">
          <div className="stat-title">Today&apos;s Catch</div>
          <div className="stat-value text-2xl">{todaysCatchCount}</div>
        </div>
      </div>

      <Link href="/fishing" className="btn btn-primary btn-lg mb-8">
        Go Fishing
      </Link>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="card bg-base-100 shadow">
          <div className="card-body">
            <h2 className="card-title">Recent Catches</h2>
            {recentCatches.length === 0 ? (
              <p className="text-base-content/60">No catches yet.</p>
            ) : (
              <ul className="divide-base-300 divide-y">
                {recentCatches.map((c) => (
                  <li
                    key={c.id}
                    className="flex items-center justify-between py-2"
                  >
                    <div className="flex items-center gap-2">
                      {c.fishSpecies.imageUrl && (
                        <Image
                          src={c.fishSpecies.imageUrl}
                          alt={c.fishSpecies.name}
                          width={32}
                          height={32}
                          unoptimized
                        />
                      )}
                      <span>{c.fishSpecies.name}</span>
                      <RarityBadge rarity={c.fishSpecies.rarity} />
                    </div>
                    <span className="text-base-content/60 text-sm">
                      {formatRelativeTime(c.caughtAt)}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="card bg-base-100 shadow">
          <div className="card-body">
            <h2 className="card-title">Recent Transactions</h2>
            {recentTransactions.length === 0 ? (
              <p className="text-base-content/60">No transactions yet.</p>
            ) : (
              <ul className="divide-base-300 divide-y">
                {recentTransactions.map((t) => (
                  <li
                    key={t.id}
                    className="flex items-center justify-between py-2"
                  >
                    <span>
                      Sold {t.quantity}x {t.fishSpecies.name}
                    </span>
                    <span className="text-success font-medium">
                      +{t.totalGold} Gold
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
