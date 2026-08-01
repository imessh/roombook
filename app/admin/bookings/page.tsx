"use client";

import { useEffect, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { AdminGuard } from "@/components/AdminGuard";
import { fetchAllBookings, deleteBookingAdmin } from "@/lib/bookings-admin";
import { Booking } from "@/lib/types";
import { Search, Trash2 } from "lucide-react";

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    (async () => setBookings(await fetchAllBookings()))();
  }, []);

  const filtered = bookings.filter((booking) =>
    [booking.name, booking.roomName, booking.category, booking.date]
      .some((field) => field.toLowerCase().includes(search.trim().toLowerCase()))
  );

  async function cancelBooking(id: string) {
    await deleteBookingAdmin(id);
    setBookings(await fetchAllBookings());
  }

  return (
    <AdminGuard>
      <AppShell>
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-sidebar-purple/80">Manage Bookings</p>
            <h1 className="text-3xl font-semibold text-ink-900">Booking oversight</h1>
          </div>
          <div className="relative max-w-sm">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search bookings"
              className="focus-ring w-full rounded-2xl border border-line bg-bg/60 py-3 pl-10 pr-4 text-sm text-ink-900 outline-none transition focus:border-brand focus:bg-white"
            />
          </div>
        </div>

        <div className="overflow-x-auto rounded-3xl border border-line bg-white/95 shadow-soft">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-[0.18em] text-ink-400">
              <tr>
                <th className="px-5 py-3">Name</th>
                <th className="px-5 py-3">Room</th>
                <th className="px-5 py-3">Date</th>
                <th className="px-5 py-3">Time</th>
                <th className="px-5 py-3">Category</th>
                <th className="px-5 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {filtered.map((booking) => (
                <tr key={booking.id}>
                  <td className="px-5 py-4 font-semibold text-ink-900">{booking.name}</td>
                  <td className="px-5 py-4 text-ink-500">{booking.roomName}</td>
                  <td className="px-5 py-4 text-ink-500">{booking.date}</td>
                  <td className="px-5 py-4 text-ink-500">{booking.startTime}–{booking.endTime}</td>
                  <td className="px-5 py-4 text-ink-500">{booking.category}</td>
                  <td className="px-5 py-4 text-right">
                    <button
                      onClick={() => cancelBooking(booking.id)}
                      className="inline-flex items-center gap-2 rounded-2xl border border-line bg-white px-3 py-2 text-xs font-semibold text-ink-700"
                    >
                      <Trash2 size={14} /> Cancel
                    </button>
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
