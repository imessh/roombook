"use client";

import { useMemo } from "react";
import { Room, Booking } from "@/lib/types";
import { toMinutes, minutesToLabel, isToday } from "@/lib/dates";
import { RoomAvatar } from "./RoomAvatar";
import { BookingPill } from "./BookingPill";

const HOUR_WIDTH = 92;
const ROW_HEIGHT = 84;
const LABEL_WIDTH = 220;

export function RoomTimeline({
  rooms,
  bookings,
  dateKey,
  onOpenBooking,
  onCreateBooking,
}: {
  rooms: Room[];
  bookings: Booking[];
  dateKey: string;
  onOpenBooking: (booking: Booking) => void;
  onCreateBooking: (roomId: string, startTime: string) => void;
}) {
  const gridStart = 8 * 60; // 08:00
  const gridEnd = 20 * 60; // 20:00
  const totalHours = (gridEnd - gridStart) / 60;
  const hours = useMemo(
    () => Array.from({ length: totalHours + 1 }, (_, i) => gridStart + i * 60),
    [totalHours]
  );

  const bookingsByRoom = useMemo(() => {
    const map = new Map<string, Booking[]>();
    for (const b of bookings) {
      if (!map.has(b.roomId)) map.set(b.roomId, []);
      map.get(b.roomId)!.push(b);
    }
    return map;
  }, [bookings]);

  const nowMinutes = useMemo(() => {
    const now = new Date();
    return now.getHours() * 60 + now.getMinutes();
  }, []);

  const showNowLine = isToday(dateKey) && nowMinutes >= gridStart && nowMinutes <= gridEnd;
  const nowLeft = ((nowMinutes - gridStart) / 60) * HOUR_WIDTH;

  function handleRowClick(room: Room, e: React.MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const rawMinutes = gridStart + (x / HOUR_WIDTH) * 60;
    const snapped = Math.round(rawMinutes / 30) * 30;
    const clamped = Math.min(Math.max(snapped, gridStart), gridEnd - 30);
    const h = String(Math.floor(clamped / 60)).padStart(2, "0");
    const m = String(clamped % 60).padStart(2, "0");
    onCreateBooking(room.id, `${h}:${m}`);
  }

  return (
    <div className="bg-card rounded-3xl shadow-card overflow-hidden">
      <div className="overflow-x-auto">
        <div style={{ minWidth: LABEL_WIDTH + hours.length * HOUR_WIDTH }}>
          {/* Header row */}
          <div className="flex border-b border-line sticky top-0 bg-card z-10">
            <div
              style={{ width: LABEL_WIDTH }}
              className="shrink-0 px-5 py-4 text-xs font-semibold text-ink-400 uppercase tracking-wide"
            >
              Room
            </div>
            <div className="relative flex">
              {hours.map((h) => (
                <div
                  key={h}
                  style={{ width: HOUR_WIDTH }}
                  className="shrink-0 px-2 py-4 text-xs font-medium text-ink-400 border-l border-line"
                >
                  {minutesToLabel(h).replace(":00", "")}
                </div>
              ))}
            </div>
          </div>

          {/* Room rows */}
          <div className="relative">
            {showNowLine && (
              <div
                className="absolute top-0 bottom-0 w-px bg-brand z-20 pointer-events-none"
                style={{ left: LABEL_WIDTH + nowLeft }}
              >
                <div className="w-2.5 h-2.5 rounded-full bg-brand -ml-[5px]" />
              </div>
            )}

            {rooms.map((room) => {
              const roomBookings = bookingsByRoom.get(room.id) ?? [];
              return (
                <div key={room.id} className="flex border-b border-line last:border-b-0">
                  <div
                    style={{ width: LABEL_WIDTH, height: ROW_HEIGHT }}
                    className="shrink-0 flex items-center gap-3 px-5"
                  >
                    <RoomAvatar name={room.name} />
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-ink-900 truncate">{room.name}</p>
                      <p className="text-xs text-ink-400 truncate">
                        Seats {room.capacity} · {room.location}
                      </p>
                    </div>
                  </div>

                  <div
                    role="button"
                    tabIndex={0}
                    aria-label={`Book ${room.name}`}
                    onClick={(e) => handleRowClick(room, e)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        onCreateBooking(room.id, "09:00");
                      }
                    }}
                    style={{ width: hours.length * HOUR_WIDTH, height: ROW_HEIGHT }}
                    className="focus-ring relative cursor-pointer group"
                  >
                    {hours.map((h, i) => (
                      <div
                        key={h}
                        style={{ left: i * HOUR_WIDTH, width: HOUR_WIDTH }}
                        className="absolute top-0 bottom-0 border-l border-line group-hover:bg-bg/40"
                      />
                    ))}
                    {roomBookings.map((b) => (
                      <BookingPill
                        key={b.id}
                        booking={b}
                        hourWidth={HOUR_WIDTH}
                        gridStartMinutes={gridStart}
                        onOpen={() => onOpenBooking(b)}
                      />
                    ))}
                  </div>
                </div>
              );
            })}

            {rooms.length === 0 && (
              <div className="py-16 text-center text-sm text-ink-400">
                No rooms match your filters.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
