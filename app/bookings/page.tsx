"use client";

import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { AppShell } from "@/components/AppShell";
import { RouteGuard } from "@/components/RouteGuard";
import { useAuth } from "@/lib/auth-context";
import { UserMenu } from "@/components/UserMenu";
import { RoomAvatar } from "@/components/RoomAvatar";
import { StatusBadge } from "@/components/StatusBadge";
import { BookingFormModal } from "@/components/BookingFormModal";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { fetchUpcomingBookings, fetchRooms, cancelBooking } from "@/lib/bookings";
import { toDateKey, formatPrettyDate, minutesToLabel, toMinutes, getBookingStatus } from "@/lib/dates";
import { Booking, Room, CATEGORY_STYLES } from "@/lib/types";
import { Pencil, Trash2, CalendarX } from "lucide-react";

function BookingsContent() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingBooking, setEditingBooking] = useState<Booking | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [cancelTarget, setCancelTarget] = useState<Booking | null>(null);
  const [cancelling, setCancelling] = useState(false);
  const { user } = useAuth();

  const load = useCallback(async () => {
    setLoading(true);
    const [roomList, upcoming] = await Promise.all([
      fetchRooms(),
      fetchUpcomingBookings(toDateKey(new Date())),
    ]);
    setRooms(roomList);
    setBookings(
      upcoming.sort((a, b) => (a.date + a.startTime).localeCompare(b.date + b.startTime))
    );
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const grouped = bookings.reduce<Record<string, Booking[]>>((acc, b) => {
    (acc[b.date] ??= []).push(b);
    return acc;
  }, {});

  return (
    <AppShell>
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-ink-900">My Bookings</h1>
          <p className="text-sm text-ink-400 mt-0.5">All upcoming reservations across every room.</p>
        </div>
        <UserMenu />
      </header>

      {loading ? (
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-16 rounded-2xl bg-card shadow-card animate-pulse" />
          ))}
        </div>
      ) : bookings.length === 0 ? (
        <div className="bg-card rounded-3xl shadow-card py-20 text-center">
          <CalendarX className="mx-auto text-ink-300 mb-3" size={32} />
          <p className="text-sm text-ink-400">No upcoming bookings yet.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(grouped).map(([date, dayBookings]) => (
            <div key={date}>
              <p className="text-xs font-semibold uppercase tracking-wide text-ink-400 mb-2 px-1">
                {formatPrettyDate(date)}
              </p>
              <div className="bg-card rounded-3xl shadow-card divide-y divide-line overflow-hidden">
                {dayBookings.map((b, i) => {
                  const styles = CATEGORY_STYLES[b.category];
                  return (
                    <motion.div
                      key={b.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.03 }}
                      className="flex flex-wrap items-center gap-4 px-5 py-4"
                    >
                      <RoomAvatar name={b.roomName} />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-ink-900 truncate">{b.roomName}</p>
                        <p className="text-xs text-ink-400 truncate">
                          {b.name} · {minutesToLabel(toMinutes(b.startTime))}–{minutesToLabel(toMinutes(b.endTime))}
                        </p>
                      </div>
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${styles.bg} ${styles.text}`}>
                        {b.category}
                      </span>
                      <StatusBadge status={getBookingStatus(b)} />
                      {user?.uid === b.createdBy && (
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            aria-label="Edit booking"
                            onClick={() => {
                              setEditingBooking(b);
                              setFormOpen(true);
                            }}
                            className="focus-ring w-9 h-9 rounded-xl flex items-center justify-center text-ink-400 hover:bg-brand-light hover:text-brand"
                          >
                            <Pencil size={15} />
                          </button>
                          <button
                            type="button"
                            aria-label="Cancel booking"
                            onClick={() => setCancelTarget(b)}
                            className="focus-ring w-9 h-9 rounded-xl flex items-center justify-center text-ink-400 hover:bg-category-otherBg hover:text-category-other"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      <BookingFormModal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        rooms={rooms}
        defaultDate={toDateKey(new Date())}
        editingBooking={editingBooking}
        onSaved={load}
      />

      <ConfirmDialog
        open={!!cancelTarget}
        onClose={() => setCancelTarget(null)}
        onConfirm={async () => {
          if (!cancelTarget) return;
          setCancelling(true);
          await cancelBooking(cancelTarget.id);
          setCancelling(false);
          setCancelTarget(null);
          load();
        }}
        title="Cancel booking?"
        description={`This will free up ${cancelTarget?.roomName ?? "the room"} on ${
          cancelTarget ? formatPrettyDate(cancelTarget.date) : ""
        }. This can't be undone.`}
        confirmLabel="Cancel booking"
        loading={cancelling}
      />
    </AppShell>
  );
}

export default function BookingsPage() {
  return (
    <RouteGuard>
      <BookingsContent />
    </RouteGuard>
  );
}
