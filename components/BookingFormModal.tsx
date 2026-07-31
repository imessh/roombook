"use client";

import { useEffect, useState } from "react";
import { Modal } from "./Modal";
import { Room, Booking, Category, CATEGORIES, NewBookingInput } from "@/lib/types";
import { createBookingSafely, updateBookingSafely, BookingConflictError } from "@/lib/bookings";
import { useAuth } from "@/lib/auth-context";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
  open: boolean;
  onClose: () => void;
  rooms: Room[];
  defaultRoomId?: string;
  defaultDate: string;
  defaultStartTime?: string;
  editingBooking?: Booking | null;
  onSaved: () => void;
}

const inputClass =
  "focus-ring w-full rounded-xl border border-line bg-bg/60 px-3.5 py-2.5 text-sm text-ink-900 placeholder:text-ink-400 outline-none focus:border-brand focus:bg-white transition-colors";
const labelClass = "block text-xs font-semibold text-ink-500 mb-1.5";

export function BookingFormModal({
  open,
  onClose,
  rooms,
  defaultRoomId,
  defaultDate,
  defaultStartTime,
  editingBooking,
  onSaved,
}: Props) {
  const { user } = useAuth();
  const isEditing = !!editingBooking;

  const [name, setName] = useState("");
  const [roomId, setRoomId] = useState("");
  const [date, setDate] = useState(defaultDate);
  const [startTime, setStartTime] = useState(defaultStartTime ?? "09:00");
  const [endTime, setEndTime] = useState("10:00");
  const [category, setCategory] = useState<Category>("Meeting");
  const [note, setNote] = useState("");

  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  useEffect(() => {
    if (!open) return;
    setError(null);
    setConfirmed(false);
    if (editingBooking) {
      setName(editingBooking.name);
      setRoomId(editingBooking.roomId);
      setDate(editingBooking.date);
      setStartTime(editingBooking.startTime);
      setEndTime(editingBooking.endTime);
      setCategory(editingBooking.category);
      setNote(editingBooking.note ?? "");
    } else {
      setName(user?.displayName ?? "");
      setRoomId(defaultRoomId ?? rooms[0]?.id ?? "");
      setDate(defaultDate);
      const start = defaultStartTime ?? "09:00";
      setStartTime(start);
      setEndTime(addOneHour(start));
      setCategory("Meeting");
      setNote("");
    }
  }, [open, editingBooking, defaultRoomId, defaultDate, defaultStartTime, rooms, user]);

  function addOneHour(time: string): string {
    const [h, m] = time.split(":").map(Number);
    const total = h * 60 + m + 60;
    const nh = Math.floor(total / 60) % 24;
    const nm = total % 60;
    return `${String(nh).padStart(2, "0")}:${String(nm).padStart(2, "0")}`;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!name.trim()) return setError("Please enter your name.");
    if (!roomId) return setError("Please choose a room.");

    const input: NewBookingInput = { roomId, name: name.trim(), date, startTime, endTime, category, note: note.trim() };
    const room = rooms.find((r) => r.id === roomId);
    if (!room) return setError("Selected room could not be found.");

    setSaving(true);
    try {
      if (isEditing && editingBooking) {
        await updateBookingSafely(editingBooking.id, input, room.name);
      } else {
        await createBookingSafely(input, room.name, user?.uid);
      }
      setConfirmed(true);
      setTimeout(() => {
        onSaved();
        onClose();
      }, 900);
    } catch (err) {
      if (err instanceof BookingConflictError) {
        setError(err.message);
      } else {
        setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      }
    } finally {
      setSaving(false);
    }
  }

  return (
    <Modal open={open} onClose={onClose} title={isEditing ? "Edit booking" : "Reserve a room"}>
      <AnimatePresence mode="wait">
        {confirmed ? (
          <motion.div
            key="confirmed"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center text-center py-8"
          >
            <CheckCircle2 size={44} className="text-category-workshop mb-3" />
            <p className="font-semibold text-ink-900">
              {isEditing ? "Booking updated" : "Booking confirmed"}
            </p>
            <p className="text-sm text-ink-400 mt-1">
              {rooms.find((r) => r.id === roomId)?.name} · {date} · {startTime}–{endTime}
            </p>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onSubmit={handleSubmit}
            className="space-y-4"
          >
            <div>
              <label className={labelClass} htmlFor="bf-name">Name</label>
              <input
                id="bf-name"
                className={inputClass}
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                required
              />
            </div>

            <div>
              <label className={labelClass} htmlFor="bf-room">Meeting room</label>
              <select
                id="bf-room"
                className={inputClass}
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}
              >
                {rooms.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name} — seats {r.capacity}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className={labelClass} htmlFor="bf-date">Date</label>
                <input
                  id="bf-date"
                  type="date"
                  className={inputClass}
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className={labelClass} htmlFor="bf-start">Start</label>
                <input
                  id="bf-start"
                  type="time"
                  className={inputClass}
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className={labelClass} htmlFor="bf-end">End</label>
                <input
                  id="bf-end"
                  type="time"
                  className={inputClass}
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  required
                />
              </div>
            </div>

            <div>
              <label className={labelClass} htmlFor="bf-category">Category</label>
              <select
                id="bf-category"
                className={inputClass}
                value={category}
                onChange={(e) => setCategory(e.target.value as Category)}
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label className={labelClass} htmlFor="bf-note">Note (optional)</label>
              <textarea
                id="bf-note"
                className={inputClass}
                rows={2}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Agenda, dial-in details, etc."
              />
            </div>

            {error && (
              <div className="flex items-start gap-2 rounded-xl bg-category-otherBg text-category-other text-sm px-3.5 py-2.5">
                <AlertCircle size={16} className="mt-0.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="flex gap-2 pt-1">
              <button
                type="button"
                onClick={onClose}
                className="focus-ring flex-1 rounded-xl border border-line text-ink-700 font-medium text-sm py-2.5 hover:bg-bg"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="focus-ring flex-1 rounded-xl bg-brand text-white font-medium text-sm py-2.5 hover:bg-brand-dark disabled:opacity-60"
              >
                {saving ? "Saving…" : isEditing ? "Save changes" : "Confirm booking"}
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </Modal>
  );
}
