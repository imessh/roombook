export type Category = "Meeting" | "Interview" | "Training" | "Workshop" | "Other";

export const CATEGORIES: Category[] = [
  "Meeting",
  "Interview",
  "Training",
  "Workshop",
  "Other",
];

// Vivid, distinct color per category — used for solid timeline blocks
// (text/bg pair kept for badges & light chips elsewhere in the app).
export const CATEGORY_STYLES: Record<
  Category,
  { text: string; bg: string; solid: string; dot: string; hex: string }
> = {
  Meeting: {
    text: "text-category-meeting",
    bg: "bg-category-meetingBg",
    solid: "bg-category-meeting",
    dot: "bg-category-meeting",
    hex: "#6366F1",
  },
  Interview: {
    text: "text-category-interview",
    bg: "bg-category-interviewBg",
    solid: "bg-category-interview",
    dot: "bg-category-interview",
    hex: "#10B981",
  },
  Training: {
    text: "text-category-training",
    bg: "bg-category-trainingBg",
    solid: "bg-category-training",
    dot: "bg-category-training",
    hex: "#F59E0B",
  },
  Workshop: {
    text: "text-category-workshop",
    bg: "bg-category-workshopBg",
    solid: "bg-category-workshop",
    dot: "bg-category-workshop",
    hex: "#EC4899",
  },
  Other: {
    text: "text-category-other",
    bg: "bg-category-otherBg",
    solid: "bg-category-other",
    dot: "bg-category-other",
    hex: "#EF4444",
  },
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
