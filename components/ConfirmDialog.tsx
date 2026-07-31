"use client";

import { Modal } from "./Modal";
import { AlertTriangle } from "lucide-react";

export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = "Confirm",
  danger = true,
  loading = false,
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmLabel?: string;
  danger?: boolean;
  loading?: boolean;
}) {
  return (
    <Modal open={open} onClose={onClose} title={title} maxWidth="max-w-sm">
      <div className="flex gap-3 mb-5">
        <div className="w-10 h-10 rounded-2xl bg-category-otherBg text-category-other flex items-center justify-center shrink-0">
          <AlertTriangle size={18} />
        </div>
        <p className="text-sm text-ink-700 pt-1.5">{description}</p>
      </div>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={onClose}
          className="focus-ring flex-1 rounded-xl border border-line text-ink-700 font-medium text-sm py-2.5 hover:bg-bg"
        >
          Go back
        </button>
        <button
          type="button"
          onClick={onConfirm}
          disabled={loading}
          className={`focus-ring flex-1 rounded-xl text-white font-medium text-sm py-2.5 disabled:opacity-60 ${
            danger ? "bg-category-other hover:opacity-90" : "bg-brand hover:bg-brand-dark"
          }`}
        >
          {loading ? "Please wait…" : confirmLabel}
        </button>
      </div>
    </Modal>
  );
}
