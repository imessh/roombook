"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, CalendarDays, DoorOpen, ListChecks } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const NAV_ITEMS = [
  {
    href: "/",
    label: "Home",
    icon: LayoutDashboard,
    color: "#8B5CF6",
    bg: "bg-sidebar-purpleBg",
  },
  {
    href: "/calendar",
    label: "Calendar",
    icon: CalendarDays,
    color: "#3B82F6",
    bg: "bg-sidebar-blueBg",
  },
  {
    href: "/rooms",
    label: "Rooms",
    icon: DoorOpen,
    color: "#10B981",
    bg: "bg-sidebar-greenBg",
  },
  {
    href: "/bookings",
    label: "My Bookings",
    icon: ListChecks,
    color: "#F59E0B",
    bg: "bg-sidebar-orangeBg",
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <aside
      className="hidden md:flex flex-col items-center gap-3 w-20 shrink-0 py-6 relative z-40"
      aria-label="Primary"
    >
      <div
        className="w-11 h-11 rounded-2xl text-white flex items-center justify-center font-bold text-lg shadow-soft mb-4"
        style={{ background: "linear-gradient(135deg, #8B5CF6, #6366F1)" }}
      >
        R
      </div>

      <nav className="flex flex-col gap-3" role="navigation">
        {NAV_ITEMS.map((item) => {
          const active = pathname === item.href;
          const Icon = item.icon;
          const isHovered = hovered === item.href;

          return (
            <div
              key={item.href}
              className="relative"
              onMouseEnter={() => setHovered(item.href)}
              onMouseLeave={() => setHovered(null)}
            >
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                className="focus-ring relative z-10 w-12 h-12 rounded-2xl flex items-center justify-center transition-colors"
                style={{
                  backgroundColor: active ? item.color : "transparent",
                  color: active ? "#fff" : item.color,
                }}
              >
                <Icon size={20} strokeWidth={2.2} aria-hidden="true" />
                <span className="sr-only">{item.label}</span>
              </Link>

              {/* Hover flyout — expands into a colored pill with the label,
                  positioned absolutely so it never shifts page layout */}
              <AnimatePresence>
                {isHovered && !active && (
                  <motion.div
                    initial={{ opacity: 0, width: 48, x: 0 }}
                    animate={{ opacity: 1, width: 176, x: 0 }}
                    exit={{ opacity: 0, width: 48 }}
                    transition={{ duration: 0.22, ease: "easeOut" }}
                    style={{ backgroundColor: item.color }}
                    className="absolute left-0 top-0 h-12 rounded-2xl shadow-popover flex items-center gap-2.5 pl-3.5 pr-4 overflow-hidden pointer-events-none z-0"
                  >
                    <Icon size={20} className="text-white shrink-0" strokeWidth={2.2} />
                    <span className="text-white text-sm font-semibold whitespace-nowrap">
                      {item.label}
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </nav>
    </aside>
  );
}
