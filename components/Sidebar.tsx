"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  CalendarDays,
  DoorOpen,
  ListChecks,
  LogOut,
} from "lucide-react";
import clsx from "clsx";
import { useAuth } from "@/lib/auth-context";

const NAV_ITEMS = [
  { href: "/", label: "Overview", icon: LayoutDashboard },
  { href: "/calendar", label: "Calendar", icon: CalendarDays },
  { href: "/rooms", label: "Rooms", icon: DoorOpen },
  { href: "/bookings", label: "My Bookings", icon: ListChecks },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuth();

  return (
    <aside
      className="hidden md:flex flex-col items-center gap-3 w-20 shrink-0 py-6"
      aria-label="Primary"
    >
      <div className="w-11 h-11 rounded-2xl bg-brand text-white flex items-center justify-center font-bold text-lg shadow-soft mb-4">
        R
      </div>

      <nav className="flex flex-col gap-2" role="navigation">
        {NAV_ITEMS.map((item) => {
          const active = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              title={item.label}
              className={clsx(
                "focus-ring w-12 h-12 rounded-2xl flex items-center justify-center transition-colors",
                active
                  ? "bg-brand text-white shadow-soft"
                  : "bg-card text-ink-400 hover:text-brand hover:bg-brand-light"
              )}
            >
              <Icon size={20} strokeWidth={2} aria-hidden="true" />
              <span className="sr-only">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto">
        <button
          type="button"
          title="Sign out"
          onClick={async () => {
            await logout();
            router.push("/login");
          }}
          className="focus-ring w-12 h-12 rounded-2xl flex items-center justify-center bg-card text-ink-400 hover:text-category-other hover:bg-category-otherBg transition-colors"
        >
          <LogOut size={20} strokeWidth={2} aria-hidden="true" />
          <span className="sr-only">Sign out</span>
        </button>
      </div>
    </aside>
  );
}
