"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { Plus } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { RouteGuard } from "@/components/RouteGuard";
import { DateNav } from "@/components/DateNav";
import { RoomFilterDropdown } from "@/components/RoomFilterDropdown";
import { SearchInput } from "@/components/SearchInput";
import { UserMenu } from "@/components/UserMenu";
import { RoomTimeline } from "@/components/RoomTimeline";
import { BookingPopover } from "@/components/BookingPopover";
import { BookingFormModal } from "@/components/BookingFormModal";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { fetchRooms, fetchBookingsForDate, cancelBooking } from "@/lib/bookings";
import { toDateKey } from "@/lib/dates";
import { Room, Booking } from "@/lib/types";

function CalendarPageContent() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [dateKey, setDateKey] = useState(toDateKey(new Date()));
  const [roomFilter, setRoomFilter] = useState<string | "all">("all");
  const [search, setSearch] = useState("");

  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [editingBooking, setEditingBooking] = useState<Booking | null>(null);
  const [prefill, setPrefill] = useState<{ roomId?: string; startTime?: string }>({});
  const [confirmCancelOpen, setConfirmCancelOpen] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  const loadData = useCallback(async () => {
    setLoading(true);
    const [roomList, bookingList] = await Promise.all([
      rooms.length ? Promise.resolve(rooms) : fetchRooms(),
      fetchBookingsForDate(dateKey),
    ]);
    setRooms(roomList);
    setBookings(bookingList);
    setLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dateKey]);

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dateKey]);

  const visibleRooms = useMemo(() => {
    return rooms
      .filter((r) => roomFilter === "all" || r.id === roomFilter)
      .filter((r) => r.name.toLowerCase().includes(search.trim().toLowerCase()));
  }, [rooms, roomFilter, search]);

  function openCreate(roomId?: string, startTime?: string) {
    setEditingBooking(null);
    setPrefill({ roomId, startTime });
    setFormOpen(true);
  }

  function openEdit(booking: Booking) {
    setPopoverOpen(false);
    setEditingBooking(booking);
    setPrefill({});
    setFormOpen(true);
  }

  async function handleCancelConfirmed() {
    if (!selectedBooking) return;
    setCancelling(true);
    await cancelBooking(selectedBooking.id);
    setCancelling(false);
    setConfirmCancelOpen(false);
    setPopoverOpen(false);
    setSelectedBooking(null);
    loadData();
  }

  return (
    <AppShell>
      <header className="flex flex-wrap items-center gap-3 mb-6">
        <RoomFilterDropdown rooms={rooms} selectedRoomId={roomFilter} onChange={setRoomFilter} />
        <SearchInput value={search} onChange={setSearch} placeholder="Search rooms" />

        <div className="ml-auto flex items-center gap-3">
          <DateNav dateKey={dateKey} onChange={setDateKey} />
          <button
            type="button"
            onClick={() => openCreate()}
            className="focus-ring flex items-center gap-2 rounded-2xl bg-brand text-white px-4 py-2.5 text-sm font-semibold shadow-soft hover:bg-brand-dark transition-colors"
          >
            <Plus size={16} /> Add New
          </button>
          <UserMenu />
        </div>
      </header>

      {loading ? (
        <div className="bg-card rounded-3xl shadow-card h-96 animate-pulse" />
      ) : (
        <div className="rounded-[2rem] border border-slate-100 bg-white shadow-card p-4">
          <RoomTimeline
            rooms={visibleRooms}
            bookings={bookings}
            dateKey={dateKey}
            onOpenBooking={(b) => {
              setSelectedBooking(b);
              setPopoverOpen(true);
            }}
            onCreateBooking={(roomId, startTime) => openCreate(roomId, startTime)}
          />
        </div>
      )}

      <BookingPopover
        booking={selectedBooking}
        open={popoverOpen}
        onClose={() => setPopoverOpen(false)}
        onEdit={() => selectedBooking && openEdit(selectedBooking)}
        onCancel={() => setConfirmCancelOpen(true)}
      />

      <ConfirmDialog
        open={confirmCancelOpen}
        onClose={() => setConfirmCancelOpen(false)}
        onConfirm={handleCancelConfirmed}
        title="Cancel booking?"
        description={`This will free up ${selectedBooking?.roomName ?? "the room"} for ${
          selectedBooking?.startTime ?? ""
        }–${selectedBooking?.endTime ?? ""}. This can't be undone.`}
        confirmLabel="Cancel booking"
        loading={cancelling}
      />

      <BookingFormModal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        rooms={rooms}
        defaultRoomId={prefill.roomId}
        defaultDate={dateKey}
        defaultStartTime={prefill.startTime}
        editingBooking={editingBooking}
        onSaved={loadData}
      />
    </AppShell>
  );
}

export default function CalendarPage() {
  return (
    <RouteGuard>
      <CalendarPageContent />
    </RouteGuard>
  );
}
