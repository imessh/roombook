"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Users, MapPin } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { RouteGuard } from "@/components/RouteGuard";
import { SearchInput } from "@/components/SearchInput";
import { UserMenu } from "@/components/UserMenu";
import { RoomAvatar } from "@/components/RoomAvatar";
import { fetchRooms } from "@/lib/bookings";
import { Room } from "@/lib/types";

function RoomsContent() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setRooms(await fetchRooms());
      setLoading(false);
    })();
  }, []);

  const filtered = rooms.filter((r) => r.name.toLowerCase().includes(search.trim().toLowerCase()));

  return (
    <AppShell>
      <header className="flex flex-wrap items-center gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-ink-900">Rooms</h1>
          <p className="text-sm text-ink-400 mt-0.5">Browse every space available to book.</p>
        </div>
        <div className="ml-auto flex items-center gap-3">
          <SearchInput value={search} onChange={setSearch} placeholder="Search rooms" />
          <UserMenu />
        </div>
      </header>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-40 rounded-3xl bg-card shadow-card animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((room, i) => (
            <motion.div
              key={room.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
            >
              <Link
                href={`/rooms/${room.id}`}
                className="focus-ring block bg-card rounded-3xl shadow-card p-5 hover:shadow-popover transition-shadow h-full"
              >
                <div className="flex items-center gap-3 mb-4">
                  <RoomAvatar name={room.name} size={44} />
                  <div className="min-w-0">
                    <p className="font-semibold text-ink-900 truncate">{room.name}</p>
                    <p className="text-xs text-ink-400 flex items-center gap-1 truncate">
                      <MapPin size={12} /> {room.location}
                    </p>
                  </div>
                </div>
                <p className="text-sm text-ink-500 flex items-center gap-1.5 mb-3">
                  <Users size={14} /> Seats {room.capacity}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {room.amenities.map((a) => (
                    <span
                      key={a}
                      className="text-xs font-medium text-ink-500 bg-bg px-2.5 py-1 rounded-full"
                    >
                      {a}
                    </span>
                  ))}
                </div>
              </Link>
            </motion.div>
          ))}

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
  return (
    <RouteGuard>
      <RoomsContent />
    </RouteGuard>
  );
}
