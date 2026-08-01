"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Bell, LogOut } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/lib/auth-context";
import { UserAvatar } from "./UserAvatar";

export function UserMenu() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const displayName = user?.displayName ?? "Guest";
  const seed = user?.email ?? user?.uid ?? "guest";

  return (
    <div className="flex items-center gap-3">
      <div className="relative" ref={ref}>
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-haspopup="true"
          aria-expanded={open}
          className="focus-ring flex items-center gap-2 rounded-2xl hover:bg-card hover:shadow-soft px-1.5 py-1.5 transition-all"
        >
          <UserAvatar seed={seed} size={40} ring />
        </button>

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.96 }}
              transition={{ duration: 0.16 }}
              className="glass absolute right-0 mt-2 w-60 rounded-2xl shadow-popover p-4 z-30"
            >
              <div className="flex items-center gap-3 mb-3">
                <UserAvatar seed={seed} size={44} />
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-ink-900 truncate">{displayName}</p>
                  <p className="text-xs text-ink-500 truncate">Employee</p>
                </div>
              </div>
              <button
                type="button"
                onClick={async () => {
                  await logout();
                  router.push("/login");
                }}
                className="focus-ring w-full flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-category-other hover:bg-category-otherBg transition-colors"
              >
                <LogOut size={15} /> Sign out
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
