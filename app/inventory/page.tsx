import Image from "next/image";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { requireProfile } from "@/lib/profile";
import { AppShell } from "@/components/app-shell";
import { RarityBadge } from "@/components/rarity-badge";
import { InventorySellButton } from "@/components/inventory-sell-button";

export default async function InventoryPage() {
  const session = await auth();
  const profile = await requireProfile();

  const inventory = await prisma.inventory.findMany({
    where: { profileId: profile.id, quantity: { gt: 0 } },
    include: { fishSpecies: true },
    orderBy: { fishSpecies: { name: "asc" } },
  });

  const username = session?.user?.name ?? "Player";
  const avatarUrl = session?.user?.image ?? null;

  return (
    <AppShell username={username} avatarUrl={avatarUrl} gold={profile.gold}>
      <h1 className="mb-6 text-2xl font-bold">
        Inventory
        <span className="text-base-content/60 ml-2 text-base font-normal">
          {inventory.length} slots used
        </span>
      </h1>

      {inventory.length === 0 ? (
        <p className="text-base-content/60">
          No fish collected yet. Go fishing to fill your inventory!
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {inventory.map((item) => (
            <div
              key={item.id}
              className="card bg-base-100 items-center p-4 text-center shadow"
            >
              {item.fishSpecies.imageUrl && (
                <Image
                  src={item.fishSpecies.imageUrl}
                  alt={item.fishSpecies.name}
                  width={56}
                  height={56}
                  unoptimized
                />
              )}
              <p className="mt-2 font-semibold">{item.fishSpecies.name}</p>
              <RarityBadge rarity={item.fishSpecies.rarity} />
              <p className="text-base-content/60 text-sm">
                Qty: {item.quantity}
              </p>
              <InventorySellButton
                fishSpeciesId={item.fishSpeciesId}
                quantity={item.quantity}
              />
            </div>
          ))}
        </div>
      )}
    </AppShell>
  );
}
