import { Tv, Video, Coffee, PenSquare, Presentation, Mic2, MonitorPlay } from "lucide-react";
import type { LucideIcon } from "lucide-react";

const MAP: Record<string, LucideIcon> = {
  "tv screen": Tv,
  "video conf": Video,
  "coffee bar": Coffee,
  whiteboard: PenSquare,
  stage: Presentation,
  "mic & speakers": Mic2,
  projector: MonitorPlay,
};

export function amenityIcon(name: string): LucideIcon {
  return MAP[name.toLowerCase()] ?? Tv;
}
