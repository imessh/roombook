"use client";

import { Booking, CATEGORY_STYLES } from "@/lib/types";
import { minutesToLabel, toMinutes, formatPrettyDate, getBookingStatus } from "@/lib/dates";
import { RoomAvatar } from "./RoomAvatar";
import { StatusBadge } from "./StatusBadge";
import { Modal } from "./Modal";
import { Edit3, Trash2, CalendarDays, Clock2, StickyNote, Tag } from "lucide-react";

const CATEGORY_LABELS = {
  Meeting: "Business meeting",
  Interview: "Candidate interview",
  Training: "Team training",
  Workshop: "Hands-on workshop",
  Other: "Flexible booking",
};

export function BookingPopover({
  booking,
  open,
  onClose,
  onEdit,
  onCancel,
}: {
  booking: Booking | null;
  open: boolean;
  onClose: () => void;
  onEdit: () => void;
  onCancel: () => void;
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
        <div className={`rounded-3xl px-4 py-3 border border-black/5 ${styles.bg}`}>
          <div className="flex items-center gap-2 mb-2">
            <span className={`inline-flex items-center justify-center w-9 h-9 rounded-2xl bg-white/90 ${styles.text} shadow-sm`}>
              <Tag size={16} className="stroke-current" />
            </span>
            <div>
              <p className="text-xs font-medium text-ink-500">Category</p>
              <p className={`text-sm font-semibold ${styles.text}`}>{booking.category}</p>
            </div>
          </div>
          <p className="text-sm text-ink-500">{CATEGORY_LABELS[booking.category]}</p>
        </div>

        <div className="flex items-center gap-2 text-sm text-ink-700 px-1">
          <CalendarDays size={16} className="text-ink-400" />
          {formatPrettyDate(booking.date)}
        </div>
        <div className="flex items-center gap-2 text-sm text-ink-700 px-1">
          <Clock2 size={16} className="text-ink-400" />
          {minutesToLabel(toMinutes(booking.startTime))} – {minutesToLabel(toMinutes(booking.endTime))}
        </div>
        {booking.note && (
          <div className="flex items-start gap-2 text-sm text-ink-700 px-1">
            <StickyNote size={16} className="text-ink-400 mt-0.5" />
            <span>{booking.note}</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <button
          type="button"
          onClick={onEdit}
          className="focus-ring flex items-center justify-center gap-2 rounded-2xl bg-brand text-white font-semibold text-sm py-3 hover:bg-brand-dark transition-colors"
        >
          <Edit3 size={16} /> Edit booking
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="focus-ring flex items-center justify-center gap-2 rounded-2xl border border-category-otherBg bg-white text-category-other font-semibold text-sm py-3 hover:bg-category-otherBg transition-colors"
        >
          <Trash2 size={16} /> Cancel booking
        </button>
      </div>
    </Modal>
  );
}
