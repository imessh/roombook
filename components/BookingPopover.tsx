"use client";

import { Booking, CATEGORY_STYLES } from "@/lib/types";
import { minutesToLabel, toMinutes, formatPrettyDate, getBookingStatus } from "@/lib/dates";
import { RoomAvatar } from "./RoomAvatar";
import { StatusBadge } from "./StatusBadge";
import { Modal } from "./Modal";
import { Pencil, Trash2, Calendar, Clock, StickyNote } from "lucide-react";

export function BookingPopover({
  booking,
  open,
  onClose,
  onEdit,
  onCancel,
  canManage,
}: {
  booking: Booking | null;
  open: boolean;
  onClose: () => void;
  onEdit: () => void;
  onCancel: () => void;
  canManage: boolean;
}) {
  if (!booking) return null;
  const styles = CATEGORY_STYLES[booking.category];
  const status = getBookingStatus(booking);

  return (
    <Modal open={open} onClose={onClose} title="Booking details" maxWidth="max-w-sm">
      <div className="flex items-start gap-3 mb-4">
        <RoomAvatar name={booking.roomName} size={44} />
        <div className="min-w-0">
          <p className="font-semibold text-ink-900 truncate">{booking.name}</p>
          <p className="text-sm text-ink-400 truncate">{booking.roomName}</p>
        </div>
        <div className="ml-auto">
          <StatusBadge status={status} />
        </div>
      </div>

      <div className="space-y-3 mb-5">
        <div className={`rounded-2xl px-4 py-3 ${styles.bg}`}>
          <p className="text-xs font-medium text-ink-500 mb-0.5">Category</p>
          <p className={`text-sm font-semibold ${styles.text}`}>{booking.category}</p>
        </div>

        <div className="flex items-center gap-2 text-sm text-ink-700 px-1">
          <Calendar size={16} className="text-ink-400" />
          {formatPrettyDate(booking.date)}
        </div>
        <div className="flex items-center gap-2 text-sm text-ink-700 px-1">
          <Clock size={16} className="text-ink-400" />
          {minutesToLabel(toMinutes(booking.startTime))} – {minutesToLabel(toMinutes(booking.endTime))}
        </div>
        {booking.note && (
          <div className="flex items-start gap-2 text-sm text-ink-700 px-1">
            <StickyNote size={16} className="text-ink-400 mt-0.5" />
            <span>{booking.note}</span>
          </div>
        )}
      </div>

      <div className="flex gap-2">
        {canManage ? (
          <>
            <button
              type="button"
              onClick={onEdit}
              className="focus-ring flex-1 flex items-center justify-center gap-2 rounded-xl bg-brand-light text-brand font-medium text-sm py-2.5 hover:bg-brand hover:text-white transition-colors"
            >
              <Pencil size={15} /> Edit
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="focus-ring flex-1 flex items-center justify-center gap-2 rounded-xl bg-category-otherBg text-category-other font-medium text-sm py-2.5 hover:bg-category-other hover:text-white transition-colors"
            >
              <Trash2 size={15} /> Cancel
            </button>
          </>
        ) : (
          <p className="text-sm text-ink-500">Only the booking owner can edit or cancel this booking.</p>
        )}
      </div>
    </Modal>
  );
}
