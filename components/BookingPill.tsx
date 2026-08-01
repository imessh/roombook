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
      initial={{ opacity: 0, scale: 0.9, y: 4 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      whileHover={{ scale: 1.03, y: -2 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.18, ease: "easeOut" }}
      style={{
        left,
        width: Math.max(width, 60),
        backgroundColor: styles.hex,
        boxShadow: `0 8px 20px ${styles.hex}55`,
      }}
      className="focus-ring absolute top-2 bottom-2 rounded-2xl px-3.5 py-2 text-left overflow-hidden"
    >
      <span className="block text-xs font-semibold text-white truncate">
        {booking.category}
      </span>
      <span className="block text-[11px] text-white/85 truncate">
        {booking.name}
      </span>
      <span className="block text-[10px] text-white/70 truncate mt-0.5">
        {minutesToLabel(start)} – {minutesToLabel(end)}
      </span>
    </motion.button>
  );
}
