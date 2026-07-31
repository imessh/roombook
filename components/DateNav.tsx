"use client";

import { ChevronLeft, ChevronRight, CalendarDays } from "lucide-react";
import { addDays, formatPrettyDate } from "@/lib/dates";

export function DateNav({
  dateKey,
  onChange,
}: {
  dateKey: string;
  onChange: (next: string) => void;
}) {
  return (
    <div className="flex items-center gap-1 bg-card rounded-2xl shadow-soft px-2 py-1.5">
      <button
        type="button"
        aria-label="Previous day"
        onClick={() => onChange(addDays(dateKey, -1))}
        className="focus-ring w-8 h-8 rounded-xl flex items-center justify-center text-ink-400 hover:bg-bg hover:text-ink-900"
      >
        <ChevronLeft size={16} />
      </button>

      <label className="relative flex items-center gap-2 px-2 cursor-pointer">
        <CalendarDays size={16} className="text-ink-400" aria-hidden="true" />
        <span className="text-sm font-medium text-ink-700 whitespace-nowrap">
          {formatPrettyDate(dateKey)}
        </span>
        <input
          type="date"
          value={dateKey}
          onChange={(e) => e.target.value && onChange(e.target.value)}
          className="focus-ring absolute inset-0 opacity-0 cursor-pointer"
          aria-label="Choose date"
        />
      </label>

      <button
        type="button"
        aria-label="Next day"
        onClick={() => onChange(addDays(dateKey, 1))}
        className="focus-ring w-8 h-8 rounded-xl flex items-center justify-center text-ink-400 hover:bg-bg hover:text-ink-900"
      >
        <ChevronRight size={16} />
      </button>
    </div>
  );
}
