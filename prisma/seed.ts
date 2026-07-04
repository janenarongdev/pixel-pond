import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const FISH_SPECIES = [
  // Common — 55% total
  {
    name: "Bluegill",
    rarity: "common",
    dropRate: 20,
    sellPrice: 12,
    imageUrl: "/assets/fish/common/bluegill.png",
  },
  {
    name: "Trout",
    rarity: "common",
    dropRate: 18,
    sellPrice: 15,
    imageUrl: "/assets/fish/common/trout.png",
  },
  {
    name: "Carp",
    rarity: "common",
    dropRate: 17,
    sellPrice: 10,
    imageUrl: "/assets/fish/common/carp.png",
  },
  // Rare — 30% total
  {
    name: "Bass",
    rarity: "rare",
    dropRate: 12,
    sellPrice: 45,
    imageUrl: "/assets/fish/rare/bass.png",
  },
  {
    name: "Catfish",
    rarity: "rare",
    dropRate: 10,
    sellPrice: 60,
    imageUrl: "/assets/fish/rare/catfish.png",
  },
  {
    name: "Salmon",
    rarity: "rare",
    dropRate: 8,
    sellPrice: 50,
    imageUrl: "/assets/fish/rare/salmon.png",
  },
  // Epic — 12% total
  {
    name: "Red Snapper",
    rarity: "epic",
    dropRate: 5,
    sellPrice: 120,
    imageUrl: "/assets/fish/epic/red-snapper.png",
  },
  {
    name: "Koi",
    rarity: "epic",
    dropRate: 4,
    sellPrice: 150,
    imageUrl: "/assets/fish/epic/koi.png",
  },
  {
    name: "Anglerfish",
    rarity: "epic",
    dropRate: 3,
    sellPrice: 180,
    imageUrl: "/assets/fish/epic/anglerfish.png",
  },
  // Legendary — 3% total
  {
    name: "Golden Carp",
    rarity: "legendary",
    dropRate: 1.5,
    sellPrice: 400,
    imageUrl: "/assets/fish/legendary/golden-carp.png",
  },
  {
    name: "Crystal Koi",
    rarity: "legendary",
    dropRate: 1,
    sellPrice: 500,
    imageUrl: "/assets/fish/legendary/crystal-koi.png",
  },
  {
    name: "Dragon Fish",
    rarity: "legendary",
    dropRate: 0.5,
    sellPrice: 750,
    imageUrl: "/assets/fish/legendary/dragon-fish.png",
  },
];

const RODS = [
  {
    name: "Wooden Rod",
    price: 0,
    luckBonus: 0,
    imageUrl: "/assets/rods/wooden-rod.png",
  },
  {
    name: "Bamboo Rod",
    price: 150,
    luckBonus: 5,
    imageUrl: "/assets/rods/bamboo-rod.png",
  },
  {
    name: "Iron Rod",
    price: 500,
    luckBonus: 10,
    imageUrl: "/assets/rods/iron-rod.png",
  },
  {
    name: "Golden Rod",
    price: 2000,
    luckBonus: 25,
    imageUrl: "/assets/rods/golden-rod.png",
  },
  {
    name: "Crystal Rod",
    price: 5000,
    luckBonus: 40,
    imageUrl: "/assets/rods/crystal-rod.png",
  },
];

async function main() {
  for (const fish of FISH_SPECIES) {
    await prisma.fishSpecies.upsert({
      where: { name: fish.name },
      create: fish,
      update: fish,
    });
  }

  for (const rod of RODS) {
    await prisma.rod.upsert({
      where: { name: rod.name },
      create: rod,
      update: rod,
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
