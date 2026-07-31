"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";
import { Room } from "@/lib/types";
import clsx from "clsx";

export function RoomFilterDropdown({
  rooms,
  selectedRoomId,
  onChange,
}: {
  rooms: Room[];
  selectedRoomId: string | "all";
  onChange: (roomId: string | "all") => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const label =
    selectedRoomId === "all"
      ? "All Rooms"
      : rooms.find((r) => r.id === selectedRoomId)?.name ?? "All Rooms";

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="focus-ring flex items-center gap-2 bg-card rounded-2xl shadow-soft px-4 py-2.5 text-sm font-medium text-ink-700 hover:text-ink-900"
      >
        {label}
        <ChevronDown size={16} className="text-ink-400" />
      </button>

      {open && (
        <div
          role="listbox"
          className="absolute z-20 mt-2 w-56 bg-card rounded-2xl shadow-popover py-2 max-h-72 overflow-auto"
        >
          <DropdownOption
            active={selectedRoomId === "all"}
            label="All Rooms"
            onClick={() => {
              onChange("all");
              setOpen(false);
            }}
          />
          {rooms.map((r) => (
            <DropdownOption
              key={r.id}
              active={selectedRoomId === r.id}
              label={r.name}
              sub={r.location}
              onClick={() => {
                onChange(r.id);
                setOpen(false);
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function DropdownOption({
  active,
  label,
  sub,
  onClick,
}: {
  active: boolean;
  label: string;
  sub?: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      role="option"
      aria-selected={active}
      onClick={onClick}
      className={clsx(
        "focus-ring w-full flex items-center justify-between px-4 py-2 text-left text-sm hover:bg-bg",
        active ? "text-brand font-medium" : "text-ink-700"
      )}
    >
      <span>
        {label}
        {sub && <span className="block text-xs text-ink-400 font-normal">{sub}</span>}
      </span>
      {active && <Check size={15} />}
    </button>
  );
}
