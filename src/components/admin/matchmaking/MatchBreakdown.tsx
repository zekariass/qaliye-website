import type { MatchDetail } from "@/lib/admin/matchmaking-types";
import { Check, X } from "lucide-react";

function prettyDim(d: string): string {
  return d.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

/** Renders the backend-supplied match.details — never invents claims. */
export function MatchBreakdown({
  details,
  matchedOnly = false,
  limit,
}: {
  details: MatchDetail[] | undefined;
  matchedOnly?: boolean;
  limit?: number;
}) {
  if (!details || details.length === 0) {
    return (
      <p className="text-sm text-[#9CA3AF]">No matching breakdown available.</p>
    );
  }

  let rows = matchedOnly ? details.filter((d) => d.matched) : details;
  const overflow = limit !== undefined && rows.length > limit ? rows.length - limit : 0;
  if (limit !== undefined) rows = rows.slice(0, limit);

  if (rows.length === 0) {
    return (
      <p className="text-sm text-[#9CA3AF]">No matching breakdown available.</p>
    );
  }

  return (
    <div>
      <ul className="space-y-2">
        {rows.map((d, i) => (
          <li key={`${d.dimension}-${i}`} className="flex items-start gap-2">
            {d.matched ? (
              <Check className="h-4 w-4 text-[#16815D] shrink-0 mt-0.5" />
            ) : (
              <X className="h-4 w-4 text-[#C63B4E] shrink-0 mt-0.5" />
            )}
            <div className="min-w-0">
              <p className="text-sm font-medium text-[#17171B]">{prettyDim(d.dimension)}</p>
              {d.label && <p className="text-xs text-[#666672]">{d.label}</p>}
            </div>
          </li>
        ))}
      </ul>
      {overflow > 0 && (
        <p className="mt-2 text-xs text-[#9CA3AF]">+ {overflow} more</p>
      )}
    </div>
  );
}
