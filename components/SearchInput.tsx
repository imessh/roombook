"use client";

import { Search } from "lucide-react";

export function SearchInput({
  value,
  onChange,
  placeholder = "Search",
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div className="flex items-center gap-2 bg-card rounded-2xl shadow-soft px-4 py-2.5 w-full max-w-xs">
      <Search size={16} className="text-ink-400 shrink-0" aria-hidden="true" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
        className="focus-ring w-full bg-transparent text-sm text-ink-900 placeholder:text-ink-400 outline-none"
      />
    </div>
  );
}
