"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils"; // optional helper for class merging

const navItems = [
  { name: "Dashboard", href: "/" },
  { name: "Campaigns", href: "/campaigns" },
  { name: "Customers", href: "/customers" },
  { name: "Messages", href: "/messages" },
  { name: "Teams", href: "/teams" },
  { name: "Users", href: "/users" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-gray-900 text-gray-100 min-h-screen p-4 flex flex-col">
      <h1 className="text-2xl font-bold mb-8">LinkNest</h1>
      <nav className="flex flex-col space-y-2">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "rounded px-3 py-2 hover:bg-gray-700 transition",
              pathname === item.href ? "bg-gray-700 font-semibold" : ""
            )}
          >
            {item.name}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
