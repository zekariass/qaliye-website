"use client";

import { useEffect } from "react";
import { RefreshCw, AlertTriangle } from "lucide-react";

export default function ConsoleError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[Admin Console Error]", error.digest ?? error.message);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#FFF1F2] mb-4">
        <AlertTriangle className="h-6 w-6 text-[#C63B4E]" />
      </div>
      <h2 className="text-base font-semibold text-[#17171B] mb-1">Something went wrong</h2>
      <p className="text-sm text-[#666672] mb-5 max-w-sm">
        An unexpected error occurred. Please try again or contact engineering if the issue persists.
      </p>
      <button
        type="button"
        onClick={reset}
        className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#7C3AED] hover:bg-[#6D28D9] rounded-xl transition-colors"
      >
        <RefreshCw className="h-4 w-4" />
        Try again
      </button>
    </div>
  );
}
