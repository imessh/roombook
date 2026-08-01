import {
  collection,
  doc,
  getDocs,
  orderBy,
  query,
  updateDoc,
  deleteDoc,
  getDoc,
} from "firebase/firestore";
import { db } from "./firebase";
import { UserProfile, UserRole } from "./types";

const USERS = "users";

export async function fetchUsers(): Promise<UserProfile[]> {
  const q = query(collection(db, USERS), orderBy("registeredAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map((docSnap) => ({
    uid: docSnap.id,
    ...(docSnap.data() as Omit<UserProfile, "uid">),
  }));
}

export async function fetchUserProfile(uid: string): Promise<UserProfile | null> {
  const snap = await getDoc(doc(db, USERS, uid));
  if (!snap.exists()) return null;
  return { uid: snap.id, ...(snap.data() as Omit<UserProfile, "uid">) };
}

export async function updateUserRole(uid: string, role: UserRole): Promise<void> {
  await updateDoc(doc(db, USERS, uid), { role });
}

export async function setUserOwner(uid: string, isOwner: boolean): Promise<void> {
  await updateDoc(doc(db, USERS, uid), { isOwner });
}

export async function deleteUser(uid: string): Promise<void> {
  await deleteDoc(doc(db, USERS, uid));
}
