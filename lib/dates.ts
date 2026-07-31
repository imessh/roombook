import { Booking, BookingStatus } from "./types";

export function toDateKey(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function formatPrettyDate(dateKey: string): string {
  const [y, m, d] = dateKey.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  return date.toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function addDays(dateKey: string, delta: number): string {
  const [y, m, d] = dateKey.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  date.setDate(date.getDate() + delta);
  return toDateKey(date);
}

// Minutes since midnight, e.g. "09:30" -> 570
export function toMinutes(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

export function minutesToLabel(mins: number): string {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  const period = h >= 12 ? "PM" : "AM";
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  return m === 0 ? `${hour12}:00 ${period}` : `${hour12}:${String(m).padStart(2, "0")} ${period}`;
}

export function rangesOverlap(
  startA: string,
  endA: string,
  startB: string,
  endB: string
): boolean {
  const sA = toMinutes(startA);
  const eA = toMinutes(endA);
  const sB = toMinutes(startB);
  const eB = toMinutes(endB);
  return sA < eB && sB < eA;
}

export function getBookingStatus(
  booking: Pick<Booking, "date" | "startTime" | "endTime">,
  now: Date = new Date()
): BookingStatus {
  const todayKey = toDateKey(now);
  if (booking.date !== todayKey) return "Reserved";
  const nowMins = now.getHours() * 60 + now.getMinutes();
  const start = toMinutes(booking.startTime);
  const end = toMinutes(booking.endTime);
  if (nowMins >= start && nowMins < end) return "Ongoing";
  return "Reserved";
}

export function isToday(dateKey: string): boolean {
  return dateKey === toDateKey(new Date());
}
