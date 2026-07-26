import type { ReactNode } from "react";
import { EmptyState, ErrorState } from "./EmptyState";
import { Pagination } from "./Pagination";

export interface Column<T> {
  key: string;
  header: string | ReactNode;
  cell: (row: T) => ReactNode;
  className?: string;
  headerClassName?: string;
}

interface AdminDataTableProps<T> {
  columns: Column<T>[];
  data: T[] | undefined;
  isLoading: boolean;
  isError?: boolean;
  onRetry?: () => void;
  emptyTitle?: string;
  emptyDescription?: string;
  keyExtractor: (row: T) => string;
  pagination?: {
    page: number;
    totalPages: number;
    totalItems?: number;
    pageSize?: number;
    onChange: (page: number) => void;
  };
  className?: string;
}

export function AdminDataTable<T>({
  columns,
  data,
  isLoading,
  isError,
  onRetry,
  emptyTitle,
  emptyDescription,
  keyExtractor,
  pagination,
  className = "",
}: AdminDataTableProps<T>) {
  return (
    <div className={`bg-white border border-[#E5E5EA] rounded-xl overflow-hidden ${className}`}>
      <div className="overflow-x-auto">
        <table className="w-full min-w-max text-sm">
          <thead>
            <tr className="border-b border-[#E5E5EA] bg-[#F7F7FA]">
              {columns.map((col) => (
                <th
                  key={col.key}
                  scope="col"
                  className={`px-4 py-3 text-left text-xs font-semibold text-[#666672] uppercase tracking-wider whitespace-nowrap ${col.headerClassName ?? ""}`}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E5E5EA]">
            {isLoading ? (
              Array.from({ length: 8 }).map((_, i) => (
                <tr key={i} className="animate-pulse">
                  {columns.map((col) => (
                    <td key={col.key} className="px-4 py-3">
                      <div className="h-4 bg-[#E5E5EA] rounded w-3/4" />
                    </td>
                  ))}
                </tr>
              ))
            ) : isError ? (
              <tr>
                <td colSpan={columns.length}>
                  <ErrorState onRetry={onRetry} />
                </td>
              </tr>
            ) : !data || data.length === 0 ? (
              <tr>
                <td colSpan={columns.length}>
                  <EmptyState title={emptyTitle} description={emptyDescription} />
                </td>
              </tr>
            ) : (
              data.map((row) => (
                <tr
                  key={keyExtractor(row)}
                  className="hover:bg-[#F7F7FA] transition-colors"
                >
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className={`px-4 py-3 text-[#17171B] ${col.className ?? ""}`}
                    >
                      {col.cell(row)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {pagination && pagination.totalPages > 1 && (
        <Pagination
          page={pagination.page}
          totalPages={pagination.totalPages}
          totalItems={pagination.totalItems}
          pageSize={pagination.pageSize}
          onPageChange={pagination.onChange}
          isLoading={isLoading}
        />
      )}
    </div>
  );
}
