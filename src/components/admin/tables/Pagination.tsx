"use client";

import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";

interface PaginationProps {
  page: number;
  totalPages: number;
  totalItems?: number;
  pageSize?: number;
  onPageChange: (page: number) => void;
  isLoading?: boolean;
}

export function Pagination({
  page,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
  isLoading,
}: PaginationProps) {
  const canPrev = page > 1;
  const canNext = page < totalPages;

  const startItem = totalItems !== undefined && pageSize ? (page - 1) * pageSize + 1 : undefined;
  const endItem =
    totalItems !== undefined && pageSize ? Math.min(page * pageSize, totalItems) : undefined;

  return (
    <div className="flex items-center justify-between px-4 py-3 border-t border-[#E5E5EA]">
      <div className="text-xs text-[#666672]">
        {totalItems !== undefined && startItem !== undefined && endItem !== undefined ? (
          <>
            Showing <span className="font-medium text-[#17171B]">{startItem}–{endItem}</span>{" "}
            of <span className="font-medium text-[#17171B]">{totalItems.toLocaleString()}</span> results
          </>
        ) : (
          `Page ${page} of ${totalPages}`
        )}
      </div>

      <div className="flex items-center gap-1">
        <NavButton
          icon={<ChevronsLeft className="h-4 w-4" />}
          label="First page"
          disabled={!canPrev || !!isLoading}
          onClick={() => onPageChange(1)}
        />
        <NavButton
          icon={<ChevronLeft className="h-4 w-4" />}
          label="Previous page"
          disabled={!canPrev || !!isLoading}
          onClick={() => onPageChange(page - 1)}
        />

        <span className="px-3 py-1 text-xs font-medium text-[#17171B]">
          {page} / {totalPages}
        </span>

        <NavButton
          icon={<ChevronRight className="h-4 w-4" />}
          label="Next page"
          disabled={!canNext || !!isLoading}
          onClick={() => onPageChange(page + 1)}
        />
        <NavButton
          icon={<ChevronsRight className="h-4 w-4" />}
          label="Last page"
          disabled={!canNext || !!isLoading}
          onClick={() => onPageChange(totalPages)}
        />
      </div>
    </div>
  );
}

function NavButton({
  icon,
  label,
  disabled,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  disabled: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      disabled={disabled}
      className="p-1.5 rounded-lg text-[#666672] hover:text-[#17171B] hover:bg-[#F7F7FA] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
    >
      {icon}
    </button>
  );
}
