import Image from "next/image";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { requireProfile } from "@/lib/profile";
import { AppShell } from "@/components/app-shell";
import { RodActions } from "@/components/rod-actions";

export default async function ShopPage() {
  const session = await auth();
  const profile = await requireProfile();

  const [rods, ownedRods] = await Promise.all([
    prisma.rod.findMany({ orderBy: { price: "asc" } }),
    prisma.playerRod.findMany({ where: { profileId: profile.id } }),
  ]);

  const ownedRodIds = new Set(ownedRods.map((r) => r.rodId));

  const username = session?.user?.name ?? "Player";
  const avatarUrl = session?.user?.image ?? null;

  return (
    <AppShell username={username} avatarUrl={avatarUrl} gold={profile.gold}>
      <h1 className="mb-6 text-2xl font-bold">Rod Shop</h1>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {rods.map((rod) => (
          <div key={rod.id} className="card bg-base-100 shadow">
            <div className="card-body items-center text-center">
              {rod.imageUrl && (
                <Image
                  src={rod.imageUrl}
                  alt={rod.name}
                  width={64}
                  height={64}
                  unoptimized
                />
              )}
              <h2 className="card-title">{rod.name}</h2>
              <p className="text-base-content/60">
                Luck Bonus: +{rod.luckBonus}%
              </p>
              <p className="font-semibold">
                {rod.price === 0 ? "Free" : `${rod.price} Gold`}
              </p>
              <RodActions
                rodId={rod.id}
                owned={ownedRodIds.has(rod.id)}
                equipped={profile.equippedRodId === rod.id}
                canAfford={profile.gold >= rod.price}
              />
            </div>
          </div>
        ))}
      </div>
    </AppShell>
  );
}
