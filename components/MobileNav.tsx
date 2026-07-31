"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, CalendarDays, DoorOpen, ListChecks } from "lucide-react";
import clsx from "clsx";

const NAV_ITEMS = [
  { href: "/", label: "Overview", icon: LayoutDashboard },
  { href: "/calendar", label: "Calendar", icon: CalendarDays },
  { href: "/rooms", label: "Rooms", icon: DoorOpen },
  { href: "/bookings", label: "Bookings", icon: ListChecks },
];

export function MobileNav() {
  const pathname = usePathname();
  return (
    <nav
      className="md:hidden fixed bottom-3 left-3 right-3 bg-card rounded-2xl shadow-popover flex items-center justify-around py-2 z-30"
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
            className={clsx(
              "focus-ring flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl text-[11px] font-medium",
              active ? "text-brand" : "text-ink-400"
            )}
          >
            <Icon size={19} />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
