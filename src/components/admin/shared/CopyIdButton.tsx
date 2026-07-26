"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";

interface CopyIdButtonProps {
  id: string;
  label?: string;
  className?: string;
  iconOnly?: boolean;
}

export function CopyIdButton({ id, label, className = "", iconOnly = false }: CopyIdButtonProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(id);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* ignore */
    }
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      title={`Copy ${label ?? "ID"}: ${id}`}
      className={`inline-flex items-center gap-1 font-mono text-xs text-[#666672] hover:text-[#17171B] transition-colors ${className}`}
    >
      {!iconOnly && <span>{label ? `${label}: ` : ""}{id.length > 12 ? `${id.slice(0, 8)}…` : id}</span>}
      {copied ? (
        <Check className="h-3 w-3 text-[#16815D]" />
      ) : (
        <Copy className="h-3 w-3 opacity-50" />
      )}
    </button>
  );
}
