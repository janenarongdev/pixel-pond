import Image from "next/image";

const RARITY_LABELS: Record<string, string> = {
  common: "Common",
  rare: "Rare",
  epic: "Epic",
  legendary: "Legendary",
};

// Common → gray, Rare → blue, Epic → purple, Legendary → gold.
const RARITY_STYLES: Record<string, { background: string; color: string }> = {
  common: { background: "#e5e7eb", color: "#374151" },
  rare: { background: "#dbeafe", color: "#1d4ed8" },
  epic: { background: "#f3e8ff", color: "#7e22ce" },
  legendary: { background: "#fef3c7", color: "#92400e" },
};

export function RarityBadge({ rarity }: { rarity: string }) {
  const label = RARITY_LABELS[rarity] ?? rarity;
  const style = RARITY_STYLES[rarity];

  return (
    <span className="badge gap-1 border-none font-semibold" style={style}>
      <Image
        src={`/assets/badges/${rarity}.png`}
        alt={label}
        width={14}
        height={14}
        unoptimized
      />
      {label}
    </span>
  );
}
