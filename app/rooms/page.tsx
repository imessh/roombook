"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Users, MapPin, Building2 } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { SearchInput } from "@/components/SearchInput";
import { UserMenu } from "@/components/UserMenu";
import { fetchRooms, fetchBookingsForDate } from "@/lib/bookings";
import { toDateKey, toMinutes } from "@/lib/dates";
import { amenityIcon } from "@/lib/amenityIcons";
import { Room, Booking } from "@/lib/types";

const CARD_ACCENTS = ["#8B5CF6", "#3B82F6", "#10B981", "#F59E0B", "#EC4899", "#6366F1"];

function hashName(name: string): number {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0;
  return h;
}

function isRoomFreeNow(roomId: string, bookings: Booking[]): boolean {
  const now = new Date();
  const nowMins = now.getHours() * 60 + now.getMinutes();
  return !bookings.some(
    (b) => b.roomId === roomId && toMinutes(b.startTime) <= nowMins && nowMins < toMinutes(b.endTime)
  );
}

function RoomsContent() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [todayBookings, setTodayBookings] = useState<Booking[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const [roomList, bookings] = await Promise.all([
        fetchRooms(),
        fetchBookingsForDate(toDateKey(new Date())),
      ]);
      setRooms(roomList);
      setTodayBookings(bookings);
      setLoading(false);
    })();
  }, []);

  const filtered = rooms
    .filter((r) => r.name.toLowerCase().includes(search.trim().toLowerCase()))
    .filter((r) => r.enabled !== false);

  return (
    <AppShell>
      <header className="flex flex-col gap-4 mb-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-ink-900">Rooms</h1>
          <p className="text-sm text-ink-400 mt-0.5">Browse every space available to book.</p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-3 w-full sm:w-auto">
          <div className="min-w-0 w-full sm:w-auto">
            <SearchInput value={search} onChange={setSearch} placeholder="Search rooms" />
          </div>
          <div className="hidden md:flex">
            <UserMenu />
          </div>
        </div>
      </header>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-52 rounded-3xl bg-card shadow-card animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((room, i) => {
            const accent = CARD_ACCENTS[hashName(room.name) % CARD_ACCENTS.length];
            const free = isRoomFreeNow(room.id, todayBookings);
            return (
              <motion.div
                key={room.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05, duration: 0.3 }}
                whileHover={{ y: -4 }}
              >
                <Link
                  href={`/rooms/${room.id}`}
                  className="focus-ring group block bg-card rounded-3xl shadow-card p-6 hover:shadow-popover transition-shadow h-full relative overflow-hidden"
                >
                  <div
                    className="absolute top-0 left-0 right-0 h-1.5"
                    style={{ background: `linear-gradient(90deg, ${accent}, ${accent}55)` }}
                  />

                  <div className="flex items-center gap-3 mb-4">
                    <div
                      className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0"
                      style={{ backgroundColor: `${accent}1F`, color: accent }}
                    >
                      <Building2 size={22} />
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-ink-900 text-base truncate">{room.name}</p>
                      <p className="text-xs text-ink-400 flex items-center gap-1 truncate">
                        <MapPin size={12} /> {room.location}
                      </p>
                    </div>
                  </div>

                  <p className="text-sm text-ink-500 flex items-center gap-1.5 mb-4">
                    <Users size={14} /> Seats {room.capacity} people
                  </p>

                  <div className="flex flex-wrap gap-2 mb-5">
                    {room.amenities.map((a) => {
                      const Icon = amenityIcon(a);
                      return (
                        <span
                          key={a}
                          className="flex items-center gap-1.5 text-xs font-medium text-ink-500 bg-bg px-3 py-1.5 rounded-full"
                        >
                          <Icon size={13} style={{ color: accent }} /> {a}
                        </span>
                      );
                    })}
                  </div>

                  <span
                    className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full ${
                      free ? "bg-category-interviewBg text-category-interview" : "bg-category-otherBg text-category-other"
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${free ? "bg-category-interview" : "bg-category-other"}`}
                    />
                    {free ? "Available now" : "Busy right now"}
                  </span>
                </Link>
              </motion.div>
            );
          })}

          {filtered.length === 0 && (
            <div className="col-span-full text-center py-16 text-sm text-ink-400">
              No rooms match "{search}".
            </div>
          )}
        </div>
      )}
    </AppShell>
  );
}

export default function RoomsPage() {
  return <RoomsContent />;
}
