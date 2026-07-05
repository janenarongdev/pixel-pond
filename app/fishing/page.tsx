import Image from "next/image";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { requireProfile } from "@/lib/profile";
import { AppShell } from "@/components/app-shell";
import { FishingPanel } from "@/components/fishing-panel";
import { RarityBadge } from "@/components/rarity-badge";

export default async function FishingPage() {
  const session = await auth();
  const profile = await requireProfile();

  const recentCatches = await prisma.catch.findMany({
    where: { profileId: profile.id },
    orderBy: { caughtAt: "desc" },
    take: 5,
    include: { fishSpecies: true },
  });

  const username = session?.user?.name ?? "Player";
  const avatarUrl = session?.user?.image ?? null;

  return (
    <AppShell username={username} avatarUrl={avatarUrl} gold={profile.gold}>
      <h1 className="mb-1 text-2xl font-bold">Fishing Spot</h1>
      <p className="mb-6 text-2xl text-base-content/70">Pixel Lake</p>

      <div className="mb-6 flex flex-wrap gap-4">
        <div className="stat bg-base-100 rounded-box shadow">
          <div className="stat-title">Current Rod</div>
          <div className="stat-value text-lg">
            {profile.equippedRod?.name ?? "None"}
          </div>
        </div>
        <div className="stat bg-base-100 rounded-box shadow">
          <div className="stat-title">Luck Bonus</div>
          <div className="stat-value text-lg">
            +{profile.equippedRod?.luckBonus ?? 0}%
          </div>
        </div>
      </div>

      <div className="card bg-base-100 mb-8 shadow">
        <figure className="relative h-64 w-full">
          <Image
            src="/assets/background/tranquil-alpine-lake-view.png"
            alt="Pixel Lake"
            fill
            sizes="100vw"
            unoptimized
            className="object-cover"
          />
        </figure>
        <div className="card-body items-center">
          <FishingPanel />
        </div>
      </div>

      <div className="card bg-base-100 shadow">
        <div className="card-body">
          <h2 className="card-title">Recent Catches</h2>
          {recentCatches.length === 0 ? (
            <p className="text-base-content/60">No catches yet.</p>
          ) : (
            <div className="flex flex-wrap gap-4">
              {recentCatches.map((c) => (
                <div key={c.id} className="flex flex-col items-center gap-1">
                  {c.fishSpecies.imageUrl && (
                    <Image
                      src={c.fishSpecies.imageUrl}
                      alt={c.fishSpecies.name}
                      width={40}
                      height={40}
                      unoptimized
                    />
                  )}
                  <span className="text-sm">{c.fishSpecies.name}</span>
                  <RarityBadge rarity={c.fishSpecies.rarity} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
