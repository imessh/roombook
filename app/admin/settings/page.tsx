"use client";

import { AppShell } from "@/components/AppShell";
import { AdminGuard } from "@/components/AdminGuard";

export default function AdminSettingsPage() {
  return (
    <AdminGuard>
      <AppShell>
        <div className="mb-6">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-sidebar-purple/80">Admin Settings</p>
          <h1 className="text-3xl font-semibold text-ink-900">Settings</h1>
          <p className="text-sm text-ink-500 mt-2">Configure admin behavior and available workspace controls.</p>
        </div>

        <div className="rounded-3xl border border-line bg-white/95 p-6 shadow-soft">
          <div className="grid gap-4 text-sm text-ink-500">
            <div className="rounded-3xl border border-line bg-slate-50 p-5">
              <h2 className="font-semibold text-ink-900">Admin configuration</h2>
              <p className="mt-2">You can add more settings here later, such as permissions, room defaults, or booking limits.</p>
            </div>
            <div className="rounded-3xl border border-line bg-slate-50 p-5">
              <h2 className="font-semibold text-ink-900">Audit and security</h2>
              <p className="mt-2">Admins can manage users, rooms, and bookings from this panel.</p>
            </div>
          </div>
        </div>
      </AppShell>
    </AdminGuard>
  );
}
