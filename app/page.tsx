"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { CalendarDays, DoorOpen, Clock, ArrowRight, Sparkles } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { UserMenu } from "@/components/UserMenu";
import { UserAvatar } from "@/components/UserAvatar";
import { RoomAvatar } from "@/components/RoomAvatar";
import { StatusBadge } from "@/components/StatusBadge";
import { CATEGORY_STYLES } from "@/lib/types";
import { fetchRooms, fetchBookingsForDate } from "@/lib/bookings";
import { toDateKey, formatPrettyDate, minutesToLabel, toMinutes, getBookingStatus } from "@/lib/dates";
import { Room, Booking } from "@/lib/types";
import { useAuth } from "@/lib/auth-context";

function greeting(): string {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

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
  const freeRooms = Math.max(rooms.length - busyRoomIds.size, 0);
  const nextBooking = bookings[0];
  const firstName = user?.displayName?.split(" ")[0] ?? "there";
  const seed = user?.email ?? user?.uid ?? "guest";
  const timelineMarkers = ["8 AM", "10 AM", "12 PM", "2 PM", "4 PM", "6 PM", "8 PM"];
  const timelineStart = 8 * 60;
  const timelineEnd = 20 * 60;
  const timelineSpan = timelineEnd - timelineStart;

  return (
    <AppShell>
      {/* Greeting header */}
      <header className="relative flex flex-col items-center gap-5 pt-8 md:flex-row md:items-center md:justify-between md:pt-0 mb-7">
        <div className="flex flex-col items-center gap-4 text-center md:flex-row md:items-center md:text-left">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sidebar-purple/80">Workspace pulse</p>
            <h1 className="text-2xl sm:text-3xl font-semibold text-ink-900">
              {greeting()}, {firstName} 👋
            </h1>
            <p className="text-sm text-ink-400 mt-1">{formatPrettyDate(todayKey)} — your live floor timeline and today’s bookings are below.</p>
            {!user && (
              <p className="text-sm text-ink-500 mt-2">
                Browse rooms, calendar, and booking details in view-only mode. Sign in to add or edit reservations.
              </p>
            )}
          </div>
        </div>
        <div className="absolute right-0 top-0 hidden w-full justify-end md:flex md:static md:w-auto">
          <UserMenu />
        </div>
      </header>

      {/* Hero summary */}
      <div className="rounded-3xl border border-line bg-gradient-to-r from-slate-50 via-white to-slate-100 p-6 shadow-card mb-6">
        <div className="flex flex-col items-center gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-2xl space-y-3 text-center lg:text-left">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-sidebar-purple/80">Today at a glance</p>
            <h2 className="text-2xl font-semibold text-ink-900">See room availability and meeting plans in one view.</h2>
            <p className="text-sm text-ink-500">A clear snapshot of today's workspace activity, so your schedule stays calm and organized.</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-3 justify-items-stretch w-full sm:w-auto">
            <div className="w-full rounded-3xl bg-sidebar-purple/10 p-4 text-sidebar-purple border border-sidebar-purple/20">
              <p className="text-3xl font-semibold">{rooms.length}</p>
              <p className="text-sm font-medium mt-1">Rooms total</p>
            </div>
            <div className="w-full rounded-3xl bg-sidebar-blue/10 p-4 text-sidebar-blue border border-sidebar-blue/20">
              <p className="text-3xl font-semibold">{busyRoomIds.size}</p>
              <p className="text-sm font-medium mt-1">Booked today</p>
            </div>
            <div className="w-full rounded-3xl bg-sidebar-orange/10 p-4 text-sidebar-orange border border-sidebar-orange/20">
              <p className="text-3xl font-semibold">{freeRooms}</p>
              <p className="text-sm font-medium mt-1">Rooms available</p>
            </div>
          </div>
        </div>

        <div className="mt-6 rounded-3xl bg-sidebar-purple/5 p-5 shadow-sm border border-sidebar-purple/20">
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-center sm:text-left">
              <p className="text-sm font-semibold text-sidebar-purple/80">Upcoming meeting</p>
              <p className="mt-1 text-lg font-semibold text-ink-900">{nextBooking ? nextBooking.roomName : "No upcoming bookings"}</p>
            </div>
            <div className="inline-flex rounded-2xl bg-sidebar-purple/10 px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-sidebar-purple">
              {nextBooking ? "Coming up" : "Available"}
            </div>
          </div>
          {nextBooking ? (
            <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_auto] items-start">
              <div className="rounded-3xl bg-white p-4 border border-line text-center sm:text-left">
                <p className="text-sm text-ink-500">{nextBooking.name}</p>
                <p className="mt-1 text-base font-semibold text-ink-900">{minutesToLabel(toMinutes(nextBooking.startTime))} – {minutesToLabel(toMinutes(nextBooking.endTime))}</p>
                <p className="mt-2 text-sm text-ink-500">{nextBooking.category} · {nextBooking.roomName}</p>
              </div>
              <div className="flex justify-center sm:justify-end">
                <Link href="/calendar" className="inline-flex items-center justify-center rounded-2xl bg-sidebar-purple px-4 py-3 text-sm font-semibold text-white transition hover:bg-sidebar-purple/90">
                  View calendar
                </Link>
              </div>
            </div>
          ) : (
            <div className="mt-4 text-sm text-ink-500 text-center sm:text-left">No meetings are scheduled for the rest of today. Use the calendar to add the next one.</div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <StatCard icon={DoorOpen} label="Total rooms" value={rooms.length} color="#8B5CF6" bg="bg-sidebar-purpleBg" />
        <StatCard icon={CalendarDays} label="Booked today" value={busyRoomIds.size} color="#3B82F6" bg="bg-sidebar-blueBg" />
        <StatCard icon={Clock} label="Ongoing now" value={ongoing} color="#F59E0B" bg="bg-sidebar-orangeBg" />
      </div>

      {/* Live floor snapshot */}
      <div className="bg-card rounded-3xl shadow-card p-6 mb-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-5">
          <div className="flex items-center gap-2">
            <Sparkles size={16} className="text-sidebar-purple" />
            <h2 className="font-semibold text-ink-900">Live floor timeline</h2>
          </div>
          <Link
            href="/calendar"
            className="focus-ring inline-flex items-center gap-1 rounded-2xl bg-sidebar-purple/10 px-3 py-2 text-sm font-medium text-sidebar-purple hover:bg-sidebar-purple/15"
          >
            Open full calendar <ArrowRight size={14} />
          </Link>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-10 rounded-xl bg-bg animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            <div className="grid grid-cols-[7rem_1fr] items-center gap-4 px-2 text-[11px] text-ink-400">
              <div className="w-28" aria-hidden="true" />
              <div className="grid grid-cols-7 text-center">
                {timelineMarkers.map((label) => (
                  <span key={label} className="truncate">
                    {label}
                  </span>
                ))}
              </div>
            </div>
            {rooms.slice(0, 5).map((room) => {
              const roomBookings = bookings.filter((b) => b.roomId === room.id);
              return (
                <div key={room.id} className="flex items-center gap-4">
                  <span className="w-28 shrink-0 text-sm font-medium text-ink-700 truncate">{room.name}</span>
                          <div className="relative flex-1 h-12 bg-bg rounded-2xl overflow-hidden border border-line">
                    <div className="absolute inset-0 grid grid-cols-7">
                      {timelineMarkers.map((_, idx) => (
                        <div key={idx} className="relative">
                          {idx > 0 && <div className="absolute inset-y-0 left-0 w-px bg-line" />}
                        </div>
                      ))}
                    </div>
                    {roomBookings.map((b) => {
                      const styles = CATEGORY_STYLES[b.category];
                      const startPct = ((toMinutes(b.startTime) - timelineStart) / timelineSpan) * 100;
                      const widthPct = ((toMinutes(b.endTime) - toMinutes(b.startTime)) / timelineSpan) * 100;
                      return (
                        <div
                          key={b.id}
                          className="absolute top-1 bottom-1 rounded-lg flex items-center px-2"
                          style={{
                            left: `${Math.min(Math.max(startPct, 0), 100)}%`,
                            width: `${Math.max(Math.min(widthPct, 100), 3)}%`,
                            backgroundColor: styles.hex,
                          }}
                          title={`${b.category} · ${b.startTime}–${b.endTime}`}
                        >
                          <span className="text-[10px] font-medium text-white truncate">{b.category}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Upcoming bookings today */}
      <div className="bg-card rounded-3xl shadow-card p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-semibold text-ink-900">Today's agenda</h2>
          <Link
            href="/calendar"
            className="focus-ring flex items-center gap-1 text-sm font-medium text-brand hover:underline"
          >
            View full calendar <ArrowRight size={14} />
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
                  className="flex flex-col gap-4 rounded-3xl border border-line bg-white px-4 py-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-card sm:flex-row sm:items-center"
                >
                  <RoomAvatar name={b.roomName} />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-ink-900 truncate">{b.roomName}</p>
                    <p className="text-xs text-ink-400 truncate">
                      {b.name} · {minutesToLabel(toMinutes(b.startTime))}–{minutesToLabel(toMinutes(b.endTime))}
                    </p>
                  </div>
                  <span
                    className="text-xs font-semibold px-2.5 py-1 rounded-full text-white"
                    style={{ backgroundColor: styles.hex }}
                  >
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
  color,
  bg,
}: {
  icon: typeof CalendarDays;
  label: string;
  value: number;
  color: string;
  bg: string;
}) {
  return (
    <motion.div
      whileHover={{ y: -3 }}
      className="rounded-3xl border border-line bg-white p-5 flex items-center gap-4 shadow-card transition-transform"
    >
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${bg}`} style={{ color }}>
        <Icon size={20} />
      </div>
      <div>
        <p className="text-2xl font-semibold text-ink-900 leading-none">{value}</p>
        <p className="text-xs text-ink-400 mt-1">{label}</p>
      </div>
    </motion.div>
  );
}

export default function DashboardPage() {
  return <DashboardContent />;
}
