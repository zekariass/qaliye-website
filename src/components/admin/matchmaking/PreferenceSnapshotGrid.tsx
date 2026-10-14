import type { PreferenceSnapshot } from "@/lib/admin/matchmaking-types";

interface Props {
  snapshot: PreferenceSnapshot;
}

const PRETTY_KEYS: Record<string, string> = {
  version: "Version",
  gender: "Gender",
  min_age: "Min Age",
  max_age: "Max Age",
  min_height_cm: "Min Height (cm)",
  max_height_cm: "Max Height (cm)",
  specific_country_codes: "Countries",
  has_children_preference: "Has Children",
  wants_children_preference: "Wants Children",
  religion_preferences: "Religions",
  education_levels: "Education",
  marital_statuses: "Marital Status",
  smoking_preferences: "Smoking",
  drinking_preferences: "Drinking",
  language_preference_ids: "Languages",
  ethnicity_preference_ids: "Ethnicities",
  matchmaker_notes: "Matchmaker Notes",
  user_notes: "User Notes",
};

function renderValue(key: string, value: unknown): React.ReactNode {
  if (value === null || value === undefined) return <span className="text-[#9CA3AF]">—</span>;
  if (Array.isArray(value)) {
    if (value.length === 0) return <span className="text-[#9CA3AF]">any</span>;
    return (
      <div className="flex flex-wrap gap-1">
        {(value as string[]).map((v) => (
          <span key={v} className="inline-block bg-[#EDE2FF] text-[#6D28D9] text-xs px-2 py-0.5 rounded-full font-mono">
            {String(v).replace(/_/g, " ")}
          </span>
        ))}
      </div>
    );
  }
  return <span className="text-sm text-[#17171B] font-mono">{String(value).replace(/_/g, " ")}</span>;
}

export function PreferenceSnapshotGrid({ snapshot }: Props) {
  const entries = Object.entries(snapshot);
  if (entries.length === 0) {
    return <p className="text-sm text-[#9CA3AF]">No snapshot data.</p>;
  }

  return (
    <div className="divide-y divide-[#E5E5EA]">
      {entries.map(([key, value]) => (
        <div key={key} className="flex items-start gap-3 py-2">
          <span className="text-xs text-[#666672] shrink-0 w-44 pt-0.5">
            {PRETTY_KEYS[key] ?? key.replace(/_/g, " ")}
          </span>
          <div className="flex-1 min-w-0">{renderValue(key, value)}</div>
        </div>
      ))}
    </div>
  );
}
