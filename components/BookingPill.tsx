"use client";

import { motion } from "framer-motion";
import { Users, ClipboardCheck, BookOpen, Wrench, Sparkles } from "lucide-react";
import { Booking, CATEGORY_STYLES } from "@/lib/types";
import { minutesToLabel, toMinutes } from "@/lib/dates";

const CATEGORY_ICONS = {
  Meeting: Users,
  Interview: ClipboardCheck,
  Training: BookOpen,
  Workshop: Wrench,
  Other: Sparkles,
};

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
  const Icon = CATEGORY_ICONS[booking.category];

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
      style={{ left, width: Math.max(width, 72) }}
      className={`focus-ring absolute top-2 bottom-2 rounded-3xl ${styles.bg} border border-black/5 px-3.5 py-2 text-left overflow-hidden shadow-sm hover:shadow-md transition-shadow`}
    >
      <div className="flex items-center gap-2 mb-1">
        <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full ${styles.text} bg-white/90 shadow-sm`}>
          <Icon size={14} className="stroke-current" />
        </span>
        <span className={`text-xs font-semibold ${styles.text} truncate`}>
          {booking.category}
        </span>
      </div>
      <p className={`text-sm font-semibold ${styles.text} truncate`}>
        {booking.name}
      </p>
      <p className="text-[11px] text-ink-500 truncate">
        {minutesToLabel(start)} – {minutesToLabel(end)}
      </p>
    </motion.button>
  );
}
