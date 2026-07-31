import clsx from "clsx";
import { CheckCircle2, Clock2, ShieldCheck } from "lucide-react";
import { BookingStatus } from "@/lib/types";

const STYLES: Record<BookingStatus, string> = {
  Available: "bg-category-workshopBg text-category-workshop",
  Reserved: "bg-brand-light text-brand",
  Ongoing: "bg-category-trainingBg text-category-training",
};

const ICONS: Record<BookingStatus, typeof CheckCircle2> = {
  Available: CheckCircle2,
  Reserved: ShieldCheck,
  Ongoing: Clock2,
};

export function StatusBadge({ status }: { status: BookingStatus }) {
  const Icon = ICONS[status];

  return (
    <span
      className={clsx(
        "inline-flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full",
        STYLES[status]
      )}
    >
      <Icon size={14} className="stroke-current" />
      {status}
    </span>
  );
}
