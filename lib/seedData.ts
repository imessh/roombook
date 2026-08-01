import { Room, NewBookingInput } from "./types";

export const SEED_ROOMS: Omit<Room, "id">[] = [
  {
    name: "Falcon",
    location: "Level 2, East Wing",
    capacity: 8,
    amenities: ["TV Screen", "Whiteboard", "Video Conf"],
    openTime: "08:00",
    closeTime: "20:00",
  },
  {
    name: "Horizon Hall",
    location: "Level 1, Lobby",
    capacity: 40,
    amenities: ["Projector", "Mic & Speakers", "Stage"],
    openTime: "08:00",
    closeTime: "20:00",
  },
  {
    name: "Nimbus",
    location: "Level 3, North",
    capacity: 6,
    amenities: ["Whiteboard", "Video Conf"],
    openTime: "08:00",
    closeTime: "20:00",
  },
  {
    name: "Zenith",
    location: "Level 3, South",
    capacity: 12,
    amenities: ["TV Screen", "Video Conf", "Coffee Bar"],
    openTime: "08:00",
    closeTime: "20:00",
  },
  {
    name: "Compass",
    location: "Level 4, West Wing",
    capacity: 4,
    amenities: ["Whiteboard"],
    openTime: "08:00",
    closeTime: "20:00",
  },
];

// Demo bookings are generated relative to "today" at seed time so the
// dashboard/calendar always shows something relevant when you run `npm run seed`.
export function buildSeedBookings(roomIdByName: Record<string, string>, todayKey: string): NewBookingInput[] {
  return [
    {
      roomId: roomIdByName["Falcon"],
      name: "Ayesha Perera",
      date: todayKey,
      startTime: "10:00",
      endTime: "11:00",
      category: "Meeting",
      note: "Weekly design sync",
    },
    {
      roomId: roomIdByName["Horizon Hall"],
      name: "Dilan Fernando",
      date: todayKey,
      startTime: "13:00",
      endTime: "15:00",
      category: "Training",
      note: "New hire onboarding session",
    },
    {
      roomId: roomIdByName["Zenith"],
      name: "Nadeesha Silva",
      date: todayKey,
      startTime: "15:30",
      endTime: "16:30",
      category: "Workshop",
      note: "Q3 planning workshop",
    },
    {
      roomId: roomIdByName["Nimbus"],
      name: "Kasun Jayasuriya",
      date: todayKey,
      startTime: "09:00",
      endTime: "09:30",
      category: "Interview",
      note: "Candidate: Backend Engineer",
    },
    {
      roomId: roomIdByName["Compass"],
      name: "Ishara Weerasinghe",
      date: todayKey,
      startTime: "17:00",
      endTime: "18:00",
      category: "Other",
      note: "1:1 catch-up",
    },
    {
      roomId: roomIdByName["Falcon"],
      name: "Ruwan Bandara",
      date: todayKey,
      startTime: "14:00",
      endTime: "14:30",
      category: "Meeting",
      note: "Vendor call",
    },
  ];
}
