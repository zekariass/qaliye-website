"use client";

import { useRef, useEffect, useState } from "react";
import { X, AlertTriangle } from "lucide-react";

interface ConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "default" | "danger";
  isLoading?: boolean;
  typeToConfirm?: string;
  children?: React.ReactNode;
}

export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  variant = "default",
  isLoading = false,
  typeToConfirm,
  children,
}: ConfirmDialogProps) {
  const cancelRef = useRef<HTMLButtonElement>(null);
  const [typedValue, setTypedValue] = useState("");

  useEffect(() => {
    if (open) {
      setTypedValue("");
      setTimeout(() => cancelRef.current?.focus(), 50);
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  const confirmDisabled =
    isLoading || (typeToConfirm !== undefined && typedValue !== typeToConfirm);

  const confirmBtnStyle =
    variant === "danger"
      ? "bg-[#C63B4E] hover:bg-[#B03040] text-white"
      : "bg-[#7C3AED] hover:bg-[#6D28D9] text-white";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="dialog-title"
        className="relative w-full max-w-md bg-white rounded-2xl shadow-xl p-6 mx-4"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-1 text-[#666672] hover:text-[#17171B] rounded-lg transition-colors"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-start gap-3">
          {variant === "danger" && (
            <div className="shrink-0 mt-0.5 flex h-9 w-9 items-center justify-center rounded-full bg-[#FFF1F2]">
              <AlertTriangle className="h-5 w-5 text-[#C63B4E]" />
            </div>
          )}
          <div className="min-w-0">
            <h2 id="dialog-title" className="text-base font-semibold text-[#17171B]">
              {title}
            </h2>
            <p className="mt-1 text-sm text-[#666672] leading-relaxed">{description}</p>
            {children}
          </div>
        </div>

        {typeToConfirm !== undefined && (
          <div className="mt-4">
            <label className="block text-xs font-medium text-[#666672] mb-1.5">
              Type <span className="font-mono font-bold text-[#17171B]">{typeToConfirm}</span> to confirm
            </label>
            <input
              type="text"
              value={typedValue}
              onChange={(e) => setTypedValue(e.target.value)}
              className="w-full border border-[#E5E5EA] rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#C63B4E]/30 focus:border-[#C63B4E]"
              placeholder={typeToConfirm}
              autoComplete="off"
              spellCheck={false}
            />
          </div>
        )}

        <div className="mt-5 flex justify-end gap-2">
          <button
            ref={cancelRef}
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 text-sm font-medium text-[#666672] bg-[#F7F7FA] hover:bg-[#E5E5EA] rounded-lg transition-colors disabled:opacity-50"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={confirmDisabled}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${confirmBtnStyle}`}
          >
            {isLoading ? "Please wait…" : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
