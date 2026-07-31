"use client";

import { motion } from "framer-motion";
import { Booking, CATEGORY_STYLES } from "@/lib/types";
import { minutesToLabel, toMinutes } from "@/lib/dates";

export function BookingPill({
  booking,
  hourWidth,
  gridStartMinutes,
  onOpen,
}: {
  booking: Booking;
  hourWidth: number;
  gridStartMinutes: number;
  onOpen: () => void;
}) {
  const start = toMinutes(booking.startTime);
  const end = toMinutes(booking.endTime);
  const left = ((start - gridStartMinutes) / 60) * hourWidth;
  const width = ((end - start) / 60) * hourWidth;
  const styles = CATEGORY_STYLES[booking.category];

  return (
    <motion.button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        onOpen();
      }}
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.16 }}
      style={{ left, width: Math.max(width, 56) }}
      className={`focus-ring absolute top-2 bottom-2 rounded-xl ${styles.bg} border border-black/5 px-3 py-1.5 text-left overflow-hidden shadow-sm hover:shadow-md transition-shadow`}
    >
      <span className={`block text-xs font-semibold ${styles.text} truncate`}>
        {booking.category} · {booking.name}
      </span>
      <span className="block text-[11px] text-ink-500 truncate">
        {minutesToLabel(start)} – {minutesToLabel(end)}
      </span>
    </motion.button>
  );
}
