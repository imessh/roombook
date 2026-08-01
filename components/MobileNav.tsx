"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, CalendarDays, DoorOpen, ListChecks } from "lucide-react";

const NAV_ITEMS = [
  { href: "/", label: "Home", icon: LayoutDashboard, color: "#8B5CF6" },
  { href: "/calendar", label: "Calendar", icon: CalendarDays, color: "#3B82F6" },
  { href: "/rooms", label: "Rooms", icon: DoorOpen, color: "#10B981" },
  { href: "/bookings", label: "Bookings", icon: ListChecks, color: "#F59E0B" },
];

export function MobileNav() {
  const pathname = usePathname();
  return (
    <nav
      className="md:hidden fixed bottom-3 left-3 right-3 glass rounded-2xl shadow-popover flex items-center justify-around py-2 pb-[calc(env(safe-area-inset-bottom)+0.75rem)] z-30"
      aria-label="Primary"
    >
      {NAV_ITEMS.map((item) => {
        const active = pathname === item.href;
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className="focus-ring flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl text-[11px] font-medium transition-colors"
            style={{ color: active ? item.color : "#9A9AA4" }}
          >
            <Icon size={19} />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
