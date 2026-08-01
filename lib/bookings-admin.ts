import {
  collection,
  doc,
  getDocs,
  query,
  orderBy,
  deleteDoc,
} from "firebase/firestore";
import { db } from "./firebase";
import { Booking } from "./types";

const BOOKINGS = "bookings";

export async function fetchAllBookings(): Promise<Booking[]> {
  const q = query(collection(db, BOOKINGS), orderBy("date", "asc"));
  const snap = await getDocs(q);
  return snap.docs.map((docSnap) => ({ id: docSnap.id, ...(docSnap.data() as Omit<Booking, "id">) }));
}

export async function deleteBookingAdmin(bookingId: string): Promise<void> {
  await deleteDoc(doc(db, BOOKINGS, bookingId));
}
