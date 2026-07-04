import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { requireProfile } from "@/lib/profile";
import { AppShell } from "@/components/app-shell";
import { CollectionGrid } from "@/components/collection-grid";

export default async function CollectionPage() {
  const session = await auth();
  const profile = await requireProfile();

  const [allSpecies, caught] = await Promise.all([
    prisma.fishSpecies.findMany({ orderBy: { sellPrice: "asc" } }),
    prisma.catch.findMany({
      where: { profileId: profile.id },
      distinct: ["fishSpeciesId"],
      select: { fishSpeciesId: true },
    }),
  ]);

  const discoveredIds = new Set(caught.map((c) => c.fishSpeciesId));

  const fish = allSpecies.map((species) => ({
    id: species.id,
    name: species.name,
    rarity: species.rarity,
    imageUrl: species.imageUrl,
    discovered: discoveredIds.has(species.id),
  }));

  const username = session?.user?.name ?? "Player";
  const avatarUrl = session?.user?.image ?? null;

  return (
    <AppShell username={username} avatarUrl={avatarUrl} gold={profile.gold}>
      <h1 className="mb-1 text-2xl font-bold">Fish Collection</h1>
      <p className="text-base-content/60 mb-6">
        {discoveredIds.size} / {allSpecies.length} Collected
      </p>
      <CollectionGrid fish={fish} />
    </AppShell>
  );
}
