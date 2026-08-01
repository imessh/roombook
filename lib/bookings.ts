import {
  collection,
  doc,
  getDocs,
  query,
  where,
  runTransaction,
  deleteDoc,
  orderBy,
  Timestamp,
} from "firebase/firestore";
import { db } from "./firebase";
import { Booking, NewBookingInput, Room } from "./types";
import { rangesOverlap } from "./dates";

const ROOMS = "rooms";
const BOOKINGS = "bookings";

export async function fetchRooms(): Promise<Room[]> {
  const snap = await getDocs(collection(db, ROOMS));
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Room, "id">) }));
}

export async function fetchBookingsForDate(dateKey: string): Promise<Booking[]> {
  const q = query(collection(db, BOOKINGS), where("date", "==", dateKey));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Booking, "id">) }));
}

export async function fetchUpcomingBookings(fromDateKey: string): Promise<Booking[]> {
  const q = query(
    collection(db, BOOKINGS),
    where("date", ">=", fromDateKey),
    orderBy("date", "asc")
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Booking, "id">) }));
}

export class BookingConflictError extends Error {
  constructor() {
    super("This room is already booked for part of that time range.");
    this.name = "BookingConflictError";
  }
}

/**
 * Creates a booking only if no existing booking for the same room + date
 * overlaps the requested time range. Runs inside a Firestore transaction so
 * two simultaneous requests can never both succeed for the same slot.
 * Pass `excludeBookingId` when editing an existing booking so it doesn't
 * conflict with itself.
 */
export async function createBookingSafely(
  input: NewBookingInput,
  roomName: string,
  createdBy?: string,
  excludeBookingId?: string
): Promise<string> {
  if (toMinutesSafe(input.endTime) <= toMinutesSafe(input.startTime)) {
    throw new Error("End time must be after start time.");
  }

  const bookingsRef = collection(db, BOOKINGS);
  const newDocRef = doc(bookingsRef);

  await runTransaction(db, async (tx) => {
    const q = query(
      bookingsRef,
      where("roomId", "==", input.roomId),
      where("date", "==", input.date)
    );
    const existingSnap = await getDocs(q);

    for (const docSnap of existingSnap.docs) {
      if (excludeBookingId && docSnap.id === excludeBookingId) continue;
      const b = docSnap.data() as Omit<Booking, "id">;
      if (rangesOverlap(input.startTime, input.endTime, b.startTime, b.endTime)) {
        throw new BookingConflictError();
      }
    }

    tx.set(newDocRef, {
      roomId: input.roomId,
      roomName,
      name: input.name,
      date: input.date,
      startTime: input.startTime,
      endTime: input.endTime,
      category: input.category,
      note: input.note ?? "",
      createdAt: Timestamp.now().toMillis(),
      createdBy: createdBy ?? null,
    });
  });

  return newDocRef.id;
}

export async function updateBookingSafely(
  bookingId: string,
  input: NewBookingInput,
  roomName: string
): Promise<void> {
  if (toMinutesSafe(input.endTime) <= toMinutesSafe(input.startTime)) {
    throw new Error("End time must be after start time.");
  }
  const bookingsRef = collection(db, BOOKINGS);
  const targetRef = doc(db, BOOKINGS, bookingId);

  await runTransaction(db, async (tx) => {
    const q = query(
      bookingsRef,
      where("roomId", "==", input.roomId),
      where("date", "==", input.date)
    );
    const existingSnap = await getDocs(q);

    for (const docSnap of existingSnap.docs) {
      if (docSnap.id === bookingId) continue;
      const b = docSnap.data() as Omit<Booking, "id">;
      if (rangesOverlap(input.startTime, input.endTime, b.startTime, b.endTime)) {
        throw new BookingConflictError();
      }
    }

    tx.update(targetRef, {
      roomId: input.roomId,
      roomName,
      name: input.name,
      date: input.date,
      startTime: input.startTime,
      endTime: input.endTime,
      category: input.category,
      note: input.note ?? "",
    });
  });
}

export async function cancelBooking(bookingId: string): Promise<void> {
  await deleteDoc(doc(db, BOOKINGS, bookingId));
}

function toMinutesSafe(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}
