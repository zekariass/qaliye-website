import { formatRelative } from "@/lib/admin/dates";
import type { AuditLogEntry } from "@/lib/admin/adapters";
import { FileText } from "lucide-react";

function humanizeAction(action: string): string {
  return action
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/^\w/, (c) => c.toUpperCase());
}

interface RecentAuditActivityProps {
  entries: AuditLogEntry[];
  auditLogHref: string;
}

export function RecentAuditActivity({
  entries,
  auditLogHref,
}: RecentAuditActivityProps) {
  return (
    <div className="bg-white border border-[#E5E5EA] rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-[#17171B]">Recent Audit Activity</h3>
        <a
          href={auditLogHref}
          className="text-xs text-[#7C3AED] hover:underline"
        >
          View all
        </a>
      </div>

      {entries.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 text-[#9CA3AF]">
          <FileText className="h-8 w-8 mb-2" />
          <p className="text-sm">No recent activity</p>
        </div>
      ) : (
        <ul className="space-y-0 divide-y divide-[#E5E5EA]">
          {entries.map((entry) => (
            <li key={entry.id} className="py-2.5 flex items-start gap-3">
              <div className="shrink-0 flex h-7 w-7 items-center justify-center rounded-full bg-[#F7F2FF] mt-0.5">
                <FileText className="h-3.5 w-3.5 text-[#7C3AED]" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs text-[#17171B] font-medium truncate">
                  {humanizeAction(entry.action)}
                </p>
                <p className="text-xs text-[#9CA3AF] mt-0.5">
                  {entry.actorDisplayName ?? entry.actorId} ·{" "}
                  {formatRelative(entry.createdAt)}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
