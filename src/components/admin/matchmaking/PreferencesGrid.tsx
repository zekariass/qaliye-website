"use client";

import { useQuery } from "@tanstack/react-query";
import { adminKeys } from "@/lib/admin/query-keys";
import type { CatalogItem } from "@/lib/admin/adapters";
import type { MatchmakingPreferences } from "@/lib/admin/matchmaking-types";
import { asArray } from "@/lib/admin/matchmaking-types";

function pretty(v: string | null | undefined): string {
  if (!v) return "—";
  return v.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
}

function list(v: string[] | undefined): string {
  return v && v.length > 0 ? v.map(pretty).join(", ") : "Any";
}

function range(min?: number | null, max?: number | null): string {
  if (min == null && max == null) return "Any";
  return `${min ?? "?"} – ${max ?? "?"}`;
}

function PrefRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 py-2 border-b border-[#E5E5EA] last:border-0">
      <span className="text-xs text-[#666672] shrink-0">{label}</span>
      <span className="text-sm text-[#17171B] text-right min-w-0">{value ?? "—"}</span>
    </div>
  );
}

function useCatalogNames() {
  const { data: languages } = useQuery<CatalogItem[]>({
    queryKey: adminKeys.catalog.languages(),
    queryFn: async () => {
      const res = await fetch("/api/internal-admin/catalog/languages", { cache: "no-store" });
      if (!res.ok) return [];
      const json = await res.json();
      return asArray<CatalogItem>(json?.languages ?? json);
    },
    staleTime: 300_000,
  });
  const { data: ethnicities } = useQuery<CatalogItem[]>({
    queryKey: adminKeys.catalog.ethnicities(),
    queryFn: async () => {
      const res = await fetch("/api/internal-admin/catalog/ethnicities", { cache: "no-store" });
      if (!res.ok) return [];
      const json = await res.json();
      return asArray<CatalogItem>(json?.ethnicities ?? json);
    },
    staleTime: 300_000,
  });
  const byId = new Map<string, string>();
  for (const l of languages ?? []) byId.set(l.id, l.name);
  for (const e of ethnicities ?? []) byId.set(e.id, e.name);
  return byId;
}

function names(ids: string[] | undefined, byId: Map<string, string>): string {
  if (!ids || ids.length === 0) return "Any";
  return ids.map((id) => byId.get(id) ?? `${id.slice(0, 8)}…`).join(", ");
}

/** Read-only view of the requester's CURRENT matchmaking preferences. */
export function PreferencesGrid({
  preferences,
}: {
  preferences: MatchmakingPreferences | null | undefined;
}) {
  const byId = useCatalogNames();
  const p = preferences;

  if (!p) {
    return (
      <p className="text-sm text-[#9CA3AF] py-4 text-center">
        No matchmaking preferences on record for this user.
      </p>
    );
  }

  const hasAlign =
    p.marriage_timeline ||
    p.long_distance_relationship ||
    p.family_involvement ||
    p.religion_important ||
    p.willing_to_relocate;

  return (
    <div className="space-y-5">
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-widest text-[#9CA3AF] mb-1">
          Looking for
        </p>
        <PrefRow label="Age" value={range(p.min_age, p.max_age)} />
        <PrefRow label="Height" value={range(p.min_height_cm, p.max_height_cm) + (p.min_height_cm || p.max_height_cm ? " cm" : "")} />
        <PrefRow label="Location" value={list(p.specific_country_codes)} />
        <PrefRow label="Has children" value={pretty(p.has_children_preference ?? "any")} />
        <PrefRow label="Wants children" value={pretty(p.wants_children_preference ?? "any")} />
        <PrefRow label="Religion" value={list(p.religion_preferences)} />
        <PrefRow label="Education" value={list(p.education_levels)} />
        <PrefRow label="Marital status" value={list(p.marital_statuses)} />
        <PrefRow label="Smoking" value={list(p.smoking_preferences)} />
        <PrefRow label="Drinking" value={list(p.drinking_preferences)} />
        <PrefRow label="Languages" value={names(p.language_preference_ids, byId)} />
        <PrefRow label="Ethnicities" value={names(p.ethnicity_preference_ids, byId)} />
      </div>

      {(hasAlign || p.user_notes) && (
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-widest text-[#9CA3AF] mb-1">
            About them
          </p>
          {p.marriage_timeline && (
            <PrefRow label="Marriage timeline" value={pretty(p.marriage_timeline)} />
          )}
          {p.long_distance_relationship && (
            <PrefRow label="Long distance" value={pretty(p.long_distance_relationship)} />
          )}
          {p.family_involvement && (
            <PrefRow label="Family involvement" value={pretty(p.family_involvement)} />
          )}
          {p.religion_important && (
            <PrefRow label="Religion important" value={pretty(p.religion_important)} />
          )}
          {p.willing_to_relocate && (
            <PrefRow label="Willing to relocate" value={pretty(p.willing_to_relocate)} />
          )}
          {p.user_notes && (
            <div className="mt-3 p-3 bg-[#F7F7FA] rounded-xl">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-[#9CA3AF] mb-1">
                Note to matchmaker
              </p>
              <p className="text-sm text-[#17171B] whitespace-pre-wrap">{p.user_notes}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
