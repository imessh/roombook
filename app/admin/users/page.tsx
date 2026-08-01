"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AppShell } from "@/components/AppShell";
import { AdminGuard } from "@/components/AdminGuard";
import { useAuth } from "@/lib/auth-context";
import { fetchUsers, updateUserRole, deleteUser } from "@/lib/users";
import { UserProfile } from "@/lib/types";
import { Search, ChevronRight, ShieldCheck, Trash2 } from "lucide-react";

export default function AdminUsersPage() {
  const { isOwner } = useAuth();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    (async () => {
      setUsers(await fetchUsers());
    })();
  }, []);

  const filtered = users.filter((user) =>
    [user.name, user.email, user.role].some((value) =>
      value.toLowerCase().includes(search.trim().toLowerCase())
    )
  );

  async function promote(uid: string) {
    await updateUserRole(uid, "admin");
    setUsers(await fetchUsers());
  }

  async function demote(uid: string) {
    await updateUserRole(uid, "user");
    setUsers(await fetchUsers());
  }

  async function removeUser(uid: string) {
    await deleteUser(uid);
    setUsers(await fetchUsers());
  }

  return (
    <AdminGuard>
      <AppShell>
        <div className="mb-6 flex flex-col gap-4 items-center text-center sm:flex-row sm:items-center sm:justify-between sm:text-left">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-sidebar-purple/80">Manage Users</p>
            <h1 className="text-3xl font-semibold text-ink-900">User directory</h1>
          </div>
          <div className="relative w-full max-w-sm">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search users"
              className="focus-ring w-full rounded-2xl border border-line bg-bg/60 py-3 pl-10 pr-4 text-sm text-ink-900 outline-none transition focus:border-brand focus:bg-white"
            />
          </div>
        </div>

        <div className="overflow-x-auto rounded-3xl border border-line bg-white/95 shadow-soft">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-[0.18em] text-ink-400">
              <tr>
                <th className="px-5 py-3">Name</th>
                <th className="px-5 py-3">Email</th>
                <th className="px-5 py-3">Role</th>
                <th className="px-5 py-3">Registered</th>
                <th className="px-5 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {filtered.map((user) => (
                <tr key={user.uid}>
                  <td className="px-5 py-4 font-semibold text-ink-900">{user.name}</td>
                  <td className="px-5 py-4 text-ink-500">{user.email}</td>
                  <td className="px-5 py-4 uppercase tracking-[0.12em] text-sm text-ink-600">{user.role}</td>
                  <td className="px-5 py-4 text-ink-500">{new Date(user.registeredAt).toLocaleDateString()}</td>
                  <td className="px-5 py-4 text-right flex flex-wrap justify-end gap-2">
                    {user.role === "user" ? (
                      <button
                        onClick={() => promote(user.uid)}
                        className="inline-flex items-center gap-2 rounded-2xl bg-sidebar-purple px-3 py-2 text-xs font-semibold text-white"
                      >
                        <ShieldCheck size={14} /> Promote
                      </button>
                    ) : user.role === "admin" ? (
                      user.isOwner ? (
                        <span className="inline-flex items-center gap-2 rounded-2xl border border-line bg-slate-100 px-3 py-2 text-xs font-semibold text-ink-500">
                          Owner
                        </span>
                      ) : isOwner ? (
                        <button
                          onClick={() => demote(user.uid)}
                          className="inline-flex items-center gap-2 rounded-2xl border border-line bg-white px-3 py-2 text-xs font-semibold text-sidebar-purple"
                        >
                          Demote
                        </button>
                      ) : (
                        <span className="inline-flex items-center gap-2 rounded-2xl border border-line bg-slate-100 px-3 py-2 text-xs font-semibold text-ink-500">
                          Admin
                        </span>
                      )
                    ) : null}
                    <button
                      onClick={() => removeUser(user.uid)}
                      className="inline-flex items-center gap-2 rounded-2xl border border-line bg-white px-3 py-2 text-xs font-semibold text-ink-700"
                    >
                      <Trash2 size={14} /> Delete
                    </button>
                    <Link href={`/admin/users/${user.uid}`} className="inline-flex items-center gap-1 rounded-2xl bg-slate-100 px-3 py-2 text-xs font-semibold text-ink-700">
                      Details <ChevronRight size={14} />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </AppShell>
    </AdminGuard>
  );
}
