import clsx from "clsx";
import { BookingStatus } from "@/lib/types";

const STYLES: Record<BookingStatus, string> = {
  Available: "bg-category-workshopBg text-category-workshop",
  Reserved: "bg-brand-light text-brand",
  Ongoing: "bg-category-trainingBg text-category-training",
};

export function StatusBadge({ status }: { status: BookingStatus }) {
  return (
    <span
      className={clsx(
        "inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full",
        STYLES[status]
      )}
    >
      <span
        className={clsx("w-1.5 h-1.5 rounded-full", {
          "bg-category-workshop": status === "Available",
          "bg-brand": status === "Reserved",
          "bg-category-training": status === "Ongoing",
        })}
      />
      {status}
    </span>
  );
}
