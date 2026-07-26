import type { ReactNode } from "react";
import { SearchX, RefreshCw } from "lucide-react";

interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: ReactNode;
  action?: ReactNode;
}

export function EmptyState({
  title = "No results",
  description = "Nothing here yet.",
  icon,
  action,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="mb-3 text-[#9CA3AF]">
        {icon ?? <SearchX className="h-10 w-10" />}
      </div>
      <p className="text-sm font-medium text-[#17171B]">{title}</p>
      <p className="mt-1 text-xs text-[#666672] max-w-xs">{description}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

interface ErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
}

export function ErrorState({
  title = "Failed to load",
  description = "Something went wrong. Please try again.",
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="mb-3 text-[#C63B4E]">
        <RefreshCw className="h-10 w-10" />
      </div>
      <p className="text-sm font-medium text-[#17171B]">{title}</p>
      <p className="mt-1 text-xs text-[#666672] max-w-xs">{description}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-4 inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#7C3AED] bg-[#F7F2FF] hover:bg-[#EDE2FF] rounded-lg transition-colors"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          Try again
        </button>
      )}
    </div>
  );
}
