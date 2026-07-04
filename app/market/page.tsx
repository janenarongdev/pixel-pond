import Image from "next/image";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { requireProfile } from "@/lib/profile";
import { AppShell } from "@/components/app-shell";
import { RarityBadge } from "@/components/rarity-badge";
import { SellFishForm } from "@/components/sell-fish-form";

export default async function MarketPage() {
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
      <h1 className="mb-6 text-2xl font-bold">Market</h1>

      {inventory.length === 0 ? (
        <p className="text-base-content/60">
          You have no fish to sell. Go fishing first!
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th>Fish</th>
                <th>You Own</th>
                <th>Market Price</th>
                <th>Sell</th>
              </tr>
            </thead>
            <tbody>
              {inventory.map((item) => (
                <tr key={item.id}>
                  <td>
                    <div className="flex items-center gap-2">
                      {item.fishSpecies.imageUrl && (
                        <Image
                          src={item.fishSpecies.imageUrl}
                          alt={item.fishSpecies.name}
                          width={32}
                          height={32}
                          unoptimized
                        />
                      )}
                      <span>{item.fishSpecies.name}</span>
                      <RarityBadge rarity={item.fishSpecies.rarity} />
                    </div>
                  </td>
                  <td>{item.quantity}</td>
                  <td>{item.fishSpecies.sellPrice} Gold</td>
                  <td>
                    <SellFishForm
                      fishSpeciesId={item.fishSpeciesId}
                      maxQuantity={item.quantity}
                      sellPrice={item.fishSpecies.sellPrice}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AppShell>
  );
}
