import Image from "next/image";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { requireProfile } from "@/lib/profile";
import { AppShell } from "@/components/app-shell";

export default async function ProfilePage() {
  const session = await auth();
  const profile = await requireProfile();

  const [totalCaught, discoveredSpecies, totalSpeciesCount] = await Promise.all(
    [
      prisma.catch.count({ where: { profileId: profile.id } }),
      prisma.catch.findMany({
        where: { profileId: profile.id },
        distinct: ["fishSpeciesId"],
        select: { fishSpeciesId: true },
      }),
      prisma.fishSpecies.count(),
    ],
  );

  const username = session?.user?.name ?? "Player";
  const avatarUrl = session?.user?.image ?? null;

  return (
    <AppShell username={username} avatarUrl={avatarUrl} gold={profile.gold}>
      <h1 className="mb-6 text-2xl font-bold">Profile</h1>

      <div className="card bg-base-100 max-w-md shadow">
        <div className="card-body items-center text-center">
          {avatarUrl ? (
            <Image
              src={avatarUrl}
              alt={username}
              width={96}
              height={96}
              className="rounded-full"
            />
          ) : (
            <div className="bg-neutral text-neutral-content flex h-24 w-24 items-center justify-center rounded-full text-3xl">
              {username.charAt(0).toUpperCase()}
            </div>
          )}
          <h2 className="text-xl font-bold">{username}</h2>
          <p className="text-base-content/60 text-sm">
            Joined {profile.createdAt.toLocaleDateString()}
          </p>

          <div className="stats stats-vertical sm:stats-horizontal mt-4 shadow">
            <div className="stat">
              <div className="stat-title">Gold</div>
              <div className="stat-value text-primary text-xl">
                {profile.gold}
              </div>
            </div>
            <div className="stat">
              <div className="stat-title">Equipped Rod</div>
              <div className="stat-value text-lg">
                {profile.equippedRod?.name ?? "None"}
              </div>
            </div>
          </div>

          <div className="stats stats-vertical sm:stats-horizontal mt-2 shadow">
            <div className="stat">
              <div className="stat-title">Total Fish Caught</div>
              <div className="stat-value text-xl">{totalCaught}</div>
            </div>
            <div className="stat">
              <div className="stat-title">Collection Progress</div>
              <div className="stat-value text-lg">
                {discoveredSpecies.length} / {totalSpeciesCount}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
