"use client";

import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/lib/auth-context";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Users, MapPin, Plus } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { RouteGuard } from "@/components/RouteGuard";
import { DateNav } from "@/components/DateNav";
import { RoomAvatar } from "@/components/RoomAvatar";
import { RoomTimeline } from "@/components/RoomTimeline";
import { BookingPopover } from "@/components/BookingPopover";
import { BookingFormModal } from "@/components/BookingFormModal";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { fetchRooms, fetchBookingsForDate, cancelBooking } from "@/lib/bookings";
import { toDateKey } from "@/lib/dates";
import { Room, Booking } from "@/lib/types";

function RoomDetailContent() {
  const params = useParams<{ roomId: string }>();
  const router = useRouter();
  const { user } = useAuth();
  const [room, setRoom] = useState<Room | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [dateKey, setDateKey] = useState(toDateKey(new Date()));
  const [loading, setLoading] = useState(true);

  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [editingBooking, setEditingBooking] = useState<Booking | null>(null);
  const [prefillStart, setPrefillStart] = useState<string | undefined>();
  const [confirmCancelOpen, setConfirmCancelOpen] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const [rooms, dayBookings] = await Promise.all([fetchRooms(), fetchBookingsForDate(dateKey)]);
    const found = rooms.find((r) => r.id === params.roomId) ?? null;
    setRoom(found);
    setBookings(dayBookings.filter((b) => b.roomId === params.roomId));
    setLoading(false);
  }, [dateKey, params.roomId]);

  useEffect(() => {
    load();
  }, [load]);

  if (!loading && !room) {
    return (
      <AppShell>
        <div className="text-center py-20">
          <p className="text-ink-500">Room not found.</p>
          <button onClick={() => router.push("/rooms")} className="focus-ring text-brand font-medium mt-2 hover:underline">
            Back to rooms
          </button>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <button
        onClick={() => router.push("/rooms")}
        className="focus-ring flex items-center gap-1.5 text-sm text-ink-500 hover:text-ink-900 mb-4"
      >
        <ArrowLeft size={15} /> Back to rooms
      </button>

      {loading || !room ? (
        <div className="h-40 rounded-3xl bg-card shadow-card animate-pulse mb-6" />
      ) : (
        <div className="bg-card rounded-3xl shadow-card p-6 mb-6 flex flex-wrap items-center gap-5">
          <RoomAvatar name={room.name} size={56} />
          <div className="flex-1 min-w-[180px]">
            <h1 className="text-xl font-semibold text-ink-900">{room.name}</h1>
            <p className="text-sm text-ink-400 flex items-center gap-1 mt-0.5">
              <MapPin size={13} /> {room.location}
            </p>
          </div>
          <div className="flex items-center gap-1.5 text-sm text-ink-500">
            <Users size={15} /> Seats {room.capacity}
          </div>
          <div className="flex flex-wrap gap-1.5">
            {room.amenities.map((a) => (
              <span key={a} className="text-xs font-medium text-ink-500 bg-bg px-2.5 py-1 rounded-full">
                {a}
              </span>
            ))}
          </div>
          <button
            type="button"
            onClick={() => {
              setEditingBooking(null);
              setPrefillStart(undefined);
              setFormOpen(true);
            }}
            className="focus-ring ml-auto flex items-center gap-2 btn-gradient text-white rounded-2xl px-4 py-2.5 text-sm font-semibold hover:scale-[1.03] transition-transform"
          >
            <Plus size={16} /> Reserve
          </button>
        </div>
      )}

      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-ink-900">Schedule</h2>
        <DateNav dateKey={dateKey} onChange={setDateKey} />
      </div>

      {!loading && room && (
        <RoomTimeline
          rooms={[room]}
          bookings={bookings}
          dateKey={dateKey}
          onOpenBooking={(b) => {
            setSelectedBooking(b);
            setPopoverOpen(true);
          }}
          onCreateBooking={(_roomId, startTime) => {
            setEditingBooking(null);
            setPrefillStart(startTime);
            setFormOpen(true);
          }}
        />
      )}

      <BookingPopover
        booking={selectedBooking}
        open={popoverOpen}
        onClose={() => setPopoverOpen(false)}
        onEdit={() => {
          setPopoverOpen(false);
          setEditingBooking(selectedBooking);
          setFormOpen(true);
        }}
        onCancel={() => setConfirmCancelOpen(true)}
        canManage={selectedBooking?.createdBy === user?.uid}
      />

      <ConfirmDialog
        open={confirmCancelOpen}
        onClose={() => setConfirmCancelOpen(false)}
        onConfirm={async () => {
          if (!selectedBooking) return;
          setCancelling(true);
          await cancelBooking(selectedBooking.id);
          setCancelling(false);
          setConfirmCancelOpen(false);
          setPopoverOpen(false);
          load();
        }}
        title="Cancel booking?"
        description="This will free up the slot for someone else. This can't be undone."
        confirmLabel="Cancel booking"
        loading={cancelling}
      />

      {room && (
        <BookingFormModal
          open={formOpen}
          onClose={() => setFormOpen(false)}
          rooms={[room]}
          defaultRoomId={room.id}
          defaultDate={dateKey}
          defaultStartTime={prefillStart}
          editingBooking={editingBooking}
          onSaved={load}
        />
      )}
    </AppShell>
  );
}

export default function RoomDetailPage() {
  return (
    <RouteGuard>
      <RoomDetailContent />
    </RouteGuard>
  );
}
