"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { CalendarDays, DoorOpen, Clock, ArrowRight } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { RouteGuard } from "@/components/RouteGuard";
import { UserMenu } from "@/components/UserMenu";
import { RoomAvatar } from "@/components/RoomAvatar";
import { StatusBadge } from "@/components/StatusBadge";
import { CATEGORY_STYLES } from "@/lib/types";
import { fetchRooms, fetchBookingsForDate } from "@/lib/bookings";
import { toDateKey, formatPrettyDate, minutesToLabel, toMinutes, getBookingStatus } from "@/lib/dates";
import { Room, Booking } from "@/lib/types";
import { useAuth } from "@/lib/auth-context";

function DashboardContent() {
  const { user } = useAuth();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const todayKey = toDateKey(new Date());

  useEffect(() => {
    (async () => {
      const [roomList, bookingList] = await Promise.all([
        fetchRooms(),
        fetchBookingsForDate(todayKey),
      ]);
      setRooms(roomList);
      setBookings(bookingList.sort((a, b) => toMinutes(a.startTime) - toMinutes(b.startTime)));
      setLoading(false);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const ongoing = bookings.filter((b) => getBookingStatus(b) === "Ongoing").length;
  const busyRoomIds = new Set(bookings.map((b) => b.roomId));
  const freeRooms = rooms.length - busyRoomIds.size;
  const firstName = user?.displayName?.split(" ")[0] ?? "there";

  return (
    <AppShell>
      <header className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-ink-900">Hi {firstName} 👋</h1>
          <p className="text-sm text-ink-400 mt-0.5">{formatPrettyDate(todayKey)} — here's what's happening today.</p>
        </div>
        <UserMenu />
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <StatCard icon={CalendarDays} label="Bookings today" value={bookings.length} accent="brand" />
        <StatCard icon={Clock} label="Ongoing now" value={ongoing} accent="training" />
        <StatCard icon={DoorOpen} label="Rooms free right now" value={Math.max(freeRooms, 0)} accent="workshop" />
      </div>

      <div className="bg-card rounded-[2rem] shadow-card p-6 border border-slate-100">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="font-semibold text-ink-900">Today's bookings</h2>
            <p className="text-sm text-ink-400 mt-1">A quick look at what’s happening in each room.</p>
          </div>
          <Link
            href="/calendar"
            className="focus-ring inline-flex items-center gap-2 rounded-2xl bg-brand text-white px-4 py-2 text-sm font-semibold shadow-soft hover:bg-brand-dark transition-colors"
          >
            <CalendarDays size={16} /> Open calendar
          </Link>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-16 rounded-2xl bg-bg animate-pulse" />
            ))}
          </div>
        ) : bookings.length === 0 ? (
          <div className="text-center py-14">
            <p className="text-sm text-ink-400">No bookings yet today.</p>
            <Link
              href="/calendar"
              className="focus-ring inline-block mt-3 text-sm font-medium text-brand hover:underline"
            >
              Reserve a room
            </Link>
          </div>
        ) : (
          <ul className="space-y-2">
            {bookings.map((b, i) => {
              const styles = CATEGORY_STYLES[b.category];
              return (
                <motion.li
                  key={b.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="flex items-center gap-4 rounded-2xl px-4 py-3 hover:bg-bg/60 transition-colors"
                >
                  <RoomAvatar name={b.roomName} />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-ink-900 truncate">{b.roomName}</p>
                    <p className="text-xs text-ink-400 truncate">
                      {b.name} · {minutesToLabel(toMinutes(b.startTime))}–{minutesToLabel(toMinutes(b.endTime))}
                    </p>
                  </div>
                  <span className={`hidden sm:inline text-xs font-semibold px-2.5 py-1 rounded-full ${styles.bg} ${styles.text}`}>
                    {b.category}
                  </span>
                  <StatusBadge status={getBookingStatus(b)} />
                </motion.li>
              );
            })}
          </ul>
        )}
      </div>
    </AppShell>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  accent,
}: {
  icon: typeof CalendarDays;
  label: string;
  value: number;
  accent: "brand" | "training" | "workshop";
}) {
  const accentClasses = {
    brand: "bg-brand-light text-brand",
    training: "bg-category-trainingBg text-category-training",
    workshop: "bg-category-workshopBg text-category-workshop",
  }[accent];

  return (
    <div className="bg-card rounded-[2rem] shadow-card p-5 flex items-center gap-4 border border-slate-100">
      <div className={`w-12 h-12 rounded-3xl flex items-center justify-center ${accentClasses}`}>
        <Icon size={20} />
      </div>
      <div>
        <p className="text-2xl font-semibold text-ink-900 leading-none">{value}</p>
        <p className="text-xs text-ink-500 mt-1">{label}</p>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <RouteGuard>
      <DashboardContent />
    </RouteGuard>
  );
}
