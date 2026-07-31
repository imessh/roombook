export type Category = "Meeting" | "Interview" | "Training" | "Workshop" | "Other";

export const CATEGORIES: Category[] = [
  "Meeting",
  "Interview",
  "Training",
  "Workshop",
  "Other",
];

export const CATEGORY_STYLES: Record<
  Category,
  { text: string; bg: string; dot: string }
> = {
  Meeting: { text: "text-category-meeting", bg: "bg-category-meetingBg", dot: "bg-category-meeting" },
  Interview: { text: "text-category-interview", bg: "bg-category-interviewBg", dot: "bg-category-interview" },
  Training: { text: "text-category-training", bg: "bg-category-trainingBg", dot: "bg-category-training" },
  Workshop: { text: "text-category-workshop", bg: "bg-category-workshopBg", dot: "bg-category-workshop" },
  Other: { text: "text-category-other", bg: "bg-category-otherBg", dot: "bg-category-other" },
};

export interface Room {
  id: string;
  name: string;
  location: string;
  capacity: number;
  amenities: string[];
  openTime: string; // "08:00"
  closeTime: string; // "20:00"
  colorSeed?: string;
}

export interface Booking {
  id: string;
  roomId: string;
  roomName: string;
  name: string; // person booking
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm (24h)
  endTime: string; // HH:mm (24h)
  category: Category;
  note?: string;
  createdAt: number;
  createdBy?: string; // uid
}

export type BookingStatus = "Available" | "Reserved" | "Ongoing";

export interface NewBookingInput {
  roomId: string;
  name: string;
  date: string;
  startTime: string;
  endTime: string;
  category: Category;
  note?: string;
}
