"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AppShell } from "@/components/AppShell";
import { useAuth } from "@/lib/auth-context";
import { fetchUsers } from "@/lib/users";
import { UserProfile } from "@/lib/types";
import { Search } from "lucide-react";

export default function AdminPage() {
  const { user, loading, loadingProfile, isAdmin } = useAuth();
  const router = useRouter();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [search, setSearch] = useState("");
  const [filteredUsers, setFilteredUsers] = useState<UserProfile[]>([]);

  useEffect(() => {
    if (!loading && !loadingProfile && !isAdmin) {
      router.replace("/");
    }
  }, [loading, loadingProfile, isAdmin, router]);

  useEffect(() => {
    (async () => {
      if (isAdmin) {
        const allUsers = await fetchUsers();
        setUsers(allUsers);
      }
    })();
  }, [isAdmin]);

  useEffect(() => {
    setFilteredUsers(
      users.filter((user) =>
        [user.name, user.email, user.role].some((value) =>
          value.toLowerCase().includes(search.trim().toLowerCase())
        )
      )
    );
  }, [search, users]);

  if (loading || loadingProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg">
        <div className="w-8 h-8 rounded-full border-2 border-brand border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <AppShell>
      <div className="mb-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-sidebar-purple/80">Admin Panel</p>
            <h1 className="text-3xl font-semibold text-ink-900">Team administration</h1>
            <p className="text-sm text-ink-500 mt-2">Manage users, rooms, and bookings from one place.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/admin/users" className="rounded-2xl bg-sidebar-purple px-4 py-2 text-sm font-semibold text-white">
              Manage Users
            </Link>
            <Link href="/admin/rooms" className="rounded-2xl border border-line bg-white px-4 py-2 text-sm font-semibold text-sidebar-purple">
              Manage Rooms
            </Link>
            <Link href="/admin/bookings" className="rounded-2xl border border-line bg-white px-4 py-2 text-sm font-semibold text-sidebar-purple">
              Manage Bookings
            </Link>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-3xl border border-line bg-white/90 p-6 shadow-soft">
          <p className="text-sm font-semibold text-ink-500">Users</p>
          <p className="mt-2 text-3xl font-semibold text-ink-900">{users.length}</p>
          <p className="text-sm text-ink-400 mt-1">Registered accounts</p>
        </div>
        <div className="rounded-3xl border border-line bg-white/90 p-6 shadow-soft">
          <p className="text-sm font-semibold text-ink-500">Rooms</p>
          <p className="mt-2 text-3xl font-semibold text-ink-900">Manage room inventory</p>
          <p className="text-sm text-ink-400 mt-1">Add, edit, enable, or disable rooms.</p>
        </div>
        <div className="rounded-3xl border border-line bg-white/90 p-6 shadow-soft">
          <p className="text-sm font-semibold text-ink-500">Bookings</p>
          <p className="mt-2 text-3xl font-semibold text-ink-900">View all bookings</p>
          <p className="text-sm text-ink-400 mt-1">Cancel or filter bookings across the team.</p>
        </div>
      </div>

      <div className="mt-8 rounded-3xl border border-line bg-white/95 p-5 shadow-soft">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-ink-900">Manage users</h2>
            <p className="text-sm text-ink-500">Search users by name, email or role.</p>
          </div>
          <div className="relative max-w-sm">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search users"
              className="focus-ring w-full rounded-2xl border border-line bg-bg/60 py-3 pl-10 pr-4 text-sm text-ink-900 outline-none transition focus:border-brand focus:bg-white"
            />
          </div>
        </div>

        <div className="mt-5 overflow-x-auto">
          <table className="min-w-full border-separate border-spacing-y-3">
            <thead>
              <tr className="text-left text-xs uppercase tracking-[0.18em] text-ink-400">
                <th className="pb-3 pl-5">Name</th>
                <th className="pb-3">Email</th>
                <th className="pb-3">Role</th>
                <th className="pb-3">Registered</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.uid} className="rounded-3xl bg-slate-50">
                  <td className="px-5 py-4 text-sm font-semibold text-ink-900">{user.name}</td>
                  <td className="py-4 text-sm text-ink-500">{user.email}</td>
                  <td className="py-4 text-sm uppercase tracking-[0.18em] text-ink-600">{user.role}</td>
                  <td className="py-4 text-sm text-ink-500">{new Date(user.registeredAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AppShell>
  );
}
