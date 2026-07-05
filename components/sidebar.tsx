"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: "/assets/icons/gold.png" },
  { href: "/fishing", label: "Fishing", icon: "/assets/icons/fish.png" },
  {
    href: "/inventory",
    label: "Inventory",
    icon: "/assets/icons/inventory.png",
  },
  {
    href: "/collection",
    label: "Collection",
    icon: "/assets/icons/collection.png",
  },
  { href: "/shop", label: "Shop", icon: "/assets/icons/shop.png" },
  { href: "/market", label: "Market", icon: "/assets/icons/market.png" },
  { href: "/profile", label: "Profile", icon: "/assets/icons/profile.png" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <ul className="menu bg-base-100 border-base-300/60 min-h-full w-64 gap-1 border-r p-4">
      {NAV_ITEMS.map((item) => {
        const isActive = pathname.startsWith(item.href);
        return (
          <li key={item.href}>
            <Link
              href={item.href}
              className={`transition-colors ${isActive ? "active" : "hover:bg-base-200"}`}
            >
              <Image
                src={item.icon}
                alt=""
                width={50}
                height={50}
                unoptimized
              />
              {item.label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
