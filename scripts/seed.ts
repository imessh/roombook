/**
 * Seeds Firestore with demo rooms and bookings.
 * Run with: npm run seed
 *
 * Requires the same NEXT_PUBLIC_FIREBASE_* env vars as the app itself
 * (loaded from .env.local).
 */
import "dotenv/config";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs, Timestamp } from "firebase/firestore";
import { SEED_ROOMS, buildSeedBookings } from "../lib/seedData";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

function toDateKey(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

async function main() {
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);

  console.log("Seeding rooms...");
  const roomsCol = collection(db, "rooms");
  const existingRooms = await getDocs(roomsCol);
  const roomIdByName: Record<string, string> = {};

  if (!existingRooms.empty) {
    existingRooms.docs.forEach((d) => {
      roomIdByName[(d.data() as { name: string }).name] = d.id;
    });
    console.log(`Found ${existingRooms.size} existing rooms, reusing them.`);
  } else {
    for (const room of SEED_ROOMS) {
      const ref = await addDoc(roomsCol, room);
      roomIdByName[room.name] = ref.id;
      console.log(`  + room: ${room.name}`);
    }
  }

  console.log("Seeding bookings...");
  const bookingsCol = collection(db, "bookings");
  const existingBookings = await getDocs(bookingsCol);
  if (!existingBookings.empty) {
    console.log(`Found ${existingBookings.size} existing bookings, skipping seed.`);
  } else {
    const todayKey = toDateKey(new Date());
    const demoBookings = buildSeedBookings(roomIdByName, todayKey);
    for (const b of demoBookings) {
      await addDoc(bookingsCol, {
        ...b,
        roomName: Object.keys(roomIdByName).find((k) => roomIdByName[k] === b.roomId),
        createdAt: Timestamp.now().toMillis(),
        createdBy: null,
      });
      console.log(`  + booking: ${b.name} (${b.startTime}-${b.endTime})`);
    }
  }

  console.log("Done.");
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

console.log(firebaseConfig);