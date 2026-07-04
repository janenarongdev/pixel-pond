"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { href: "/admin", label: "Dashboard", icon: "/assets/icons/collection.png" },
  { href: "/admin/fish", label: "Fish", icon: "/assets/icons/fish.png" },
  { href: "/admin/rods", label: "Rods", icon: "/assets/icons/rod.png" },
  { href: "/admin/users", label: "Users", icon: "/assets/icons/profile.png" },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <ul className="menu bg-base-100 border-base-300/60 min-h-full w-64 gap-1 border-r p-4">
      <li className="menu-title font-heading">Admin Panel</li>
      {NAV_ITEMS.map((item) => {
        const isActive =
          item.href === "/admin"
            ? pathname === "/admin"
            : pathname.startsWith(item.href);
        return (
          <li key={item.href}>
            <Link
              href={item.href}
              className={`transition-colors ${isActive ? "active" : "hover:bg-base-200"}`}
            >
              <Image
                src={item.icon}
                alt=""
                width={18}
                height={18}
                unoptimized
              />
              {item.label}
            </Link>
          </li>
        );
      })}
      <li className="menu-title font-heading mt-4">Player View</li>
      <li>
        <Link href="/dashboard" className="hover:bg-base-200 transition-colors">
          Back to Dashboard
        </Link>
      </li>
    </ul>
  );
}
