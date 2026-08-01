import {
  collection,
  doc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
} from "firebase/firestore";
import { db } from "./firebase";
import { Room } from "./types";

const ROOMS = "rooms";

export async function fetchAllRooms(): Promise<Room[]> {
  const q = query(collection(db, ROOMS), orderBy("name", "asc"));
  const snap = await getDocs(q);
  return snap.docs.map((docSnap) => ({ id: docSnap.id, ...(docSnap.data() as Omit<Room, "id">) }));
}

export async function createRoom(input: Omit<Room, "id">): Promise<string> {
  const ref = await addDoc(collection(db, ROOMS), {
    ...input,
    enabled: input.enabled ?? true,
  });
  return ref.id;
}

export async function updateRoom(roomId: string, input: Omit<Room, "id">): Promise<void> {
  await updateDoc(doc(db, ROOMS, roomId), {
    ...input,
  });
}

export async function deleteRoom(roomId: string): Promise<void> {
  await deleteDoc(doc(db, ROOMS, roomId));
}
