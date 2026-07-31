"use client";

import { Bell } from "lucide-react";
import { useAuth } from "@/lib/auth-context";

function initials(name: string | null | undefined, email: string | null | undefined) {
  if (name && name.trim()) {
    const parts = name.trim().split(" ");
    return (parts[0][0] + (parts[1]?.[0] ?? "")).toUpperCase();
  }
  return (email ?? "U").slice(0, 2).toUpperCase();
}

export function UserMenu() {
  const { user } = useAuth();

  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        aria-label="Notifications"
        className="focus-ring w-10 h-10 rounded-2xl bg-card shadow-soft flex items-center justify-center text-ink-400 hover:text-ink-900"
      >
        <Bell size={17} />
      </button>
      <div
        className="w-10 h-10 rounded-2xl bg-brand text-white flex items-center justify-center text-sm font-semibold shadow-soft"
        title={user?.displayName ?? user?.email ?? "Account"}
      >
        {initials(user?.displayName, user?.email)}
      </div>
    </div>
  );
}
