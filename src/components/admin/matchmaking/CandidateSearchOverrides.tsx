"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { adminKeys } from "@/lib/admin/query-keys";
import type { CatalogItem } from "@/lib/admin/adapters";
import {
  asArray,
  DRINKING_PREFS,
  EDUCATION_LEVELS,
  MARITAL_STATUSES,
  RELIGION_PREFS,
  SMOKING_PREFS,
  type HasChildrenPref,
  type MatchmakingPreferences,
  type OverrideParams,
  type WantsChildrenPref,
} from "@/lib/admin/matchmaking-types";

const INPUT =
  "w-full px-3 py-1.5 text-sm border border-[#E5E5EA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/30 focus:border-[#7C3AED]";

const HAS_CHILDREN_OPTIONS: HasChildrenPref[] = ["any", "yes", "no"];
const WANTS_CHILDREN_OPTIONS: WantsChildrenPref[] = [
  "any",
  "yes",
  "no",
  "not_sure",
  "open_to_discussion",
];

function pretty(v: string | null | undefined): string {
  if (!v) return "Any";
  return v.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
}

function listSaved(v: string[] | undefined): string {
  return v && v.length > 0 ? v.map(pretty).join(", ") : "Any";
}

function Toggle({ on, onClick }: { on: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      onClick={onClick}
      className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors ${
        on ? "bg-[#7C3AED]" : "bg-[#E5E5EA]"
      }`}
    >
      <span
        className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform ${
          on ? "translate-x-[18px]" : "translate-x-[3px]"
        }`}
      />
    </button>
  );
}

function Group({
  label,
  savedText,
  on,
  onToggle,
  children,
}: {
  label: string;
  savedText: string;
  on: boolean;
  onToggle: (on: boolean) => void;
  children: React.ReactNode;
}) {
  return (
    <div className="border border-[#E5E5EA] rounded-xl overflow-hidden">
      <div className="flex items-center justify-between gap-4 px-4 py-3">
        <div className="min-w-0">
          <p className="text-sm font-medium text-[#17171B]">{label}</p>
          <p className="text-xs text-[#9CA3AF] truncate">
            {on ? "Override active — saved preference replaced for this search" : `Saved: ${savedText}`}
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className={`text-[10px] font-bold ${on ? "text-[#7C3AED]" : "text-[#9CA3AF]"}`}>
            {on ? "ON" : "OFF"}
          </span>
          <Toggle on={on} onClick={() => onToggle(!on)} />
        </div>
      </div>
      {on && <div className="border-t border-[#E5E5EA] px-4 py-3 bg-[#FBFBFD]">{children}</div>}
    </div>
  );
}

function ChipSelect({
  options,
  value,
  onChange,
}: {
  options: readonly { value: string; label: string }[];
  value: string[];
  onChange: (v: string[]) => void;
}) {
  function toggle(opt: string) {
    onChange(value.includes(opt) ? value.filter((s) => s !== opt) : [...value, opt]);
  }
  return (
    <div className="flex flex-wrap gap-1.5">
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => toggle(opt.value)}
          className={`px-2 py-0.5 text-xs rounded-full border transition-colors ${
            value.includes(opt.value)
              ? "bg-[#7C3AED] text-white border-[#7C3AED]"
              : "bg-white text-[#666672] border-[#E5E5EA] hover:border-[#7C3AED]"
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

interface Props {
  /** Requester's live preferences — shown as the "Saved:" hint when OFF. */
  preferences: MatchmakingPreferences | null | undefined;
  value: OverrideParams;
  onChange: (params: OverrideParams) => void;
}

/**
 * ON/OFF search overrides. OFF = requester's saved preference applies;
 * ON = admin value replaces it for this search only. Overrides never
 * mutate the user's saved preferences.
 */
export function CandidateSearchOverrides({ preferences, value, onChange }: Props) {
  const { data: languagesData } = useQuery<{ languages?: CatalogItem[] }>({
    queryKey: adminKeys.catalog.languages(),
    queryFn: async () => {
      const res = await fetch("/api/internal-admin/catalog/languages", { cache: "no-store" });
      if (!res.ok) return { languages: [] };
      return res.json();
    },
    staleTime: 300_000,
  });
  const { data: ethnicitiesData } = useQuery<{ ethnicities?: CatalogItem[] }>({
    queryKey: adminKeys.catalog.ethnicities(),
    queryFn: async () => {
      const res = await fetch("/api/internal-admin/catalog/ethnicities", { cache: "no-store" });
      if (!res.ok) return { ethnicities: [] };
      return res.json();
    },
    staleTime: 300_000,
  });

  const languageOptions = asArray<CatalogItem>(languagesData?.languages ?? languagesData)
    .filter((l) => l.isActive !== false)
    .map((l) => ({ value: l.id, label: l.nativeName ? `${l.name} (${l.nativeName})` : l.name }));
  const ethnicityOptions = asArray<CatalogItem>(ethnicitiesData?.ethnicities ?? ethnicitiesData)
    .filter((e) => e.isActive !== false)
    .map((e) => ({ value: e.id, label: e.name }));

  const [countryText, setCountryText] = useState("");

  function set<K extends keyof OverrideParams>(key: K, v: OverrideParams[K] | undefined) {
    const next = { ...value };
    if (v === undefined || (Array.isArray(v) && v.length === 0)) delete next[key];
    else next[key] = v;
    onChange(next);
  }

  function toggleGroup(keys: (keyof OverrideParams)[], on: boolean, seed?: () => void) {
    if (!on) {
      const next = { ...value };
      for (const k of keys) delete next[k];
      onChange(next);
    } else {
      seed?.();
    }
  }

  const p = preferences;
  const ageSaved =
    p?.min_age || p?.max_age ? `${p.min_age ?? "?"}–${p.max_age ?? "?"}` : "Any";
  const heightSaved =
    p?.min_height_cm || p?.max_height_cm
      ? `${p.min_height_cm ?? "?"}–${p.max_height_cm ?? "?"} cm`
      : "Any";
  const childrenSaved = `${pretty(p?.has_children_preference)} / ${pretty(p?.wants_children_preference)}`;

  const rangeError =
    value.min_age !== undefined && value.max_age !== undefined && value.min_age > value.max_age
      ? "Min age must be ≤ max age."
      : value.min_height_cm !== undefined &&
          value.max_height_cm !== undefined &&
          value.min_height_cm > value.max_height_cm
        ? "Min height must be ≤ max height."
        : null;

  const numInput = (
    val: number | undefined,
    setVal: (v: number | undefined) => void,
    placeholder?: string
  ) => (
    <input
      type="number"
      min={0}
      placeholder={placeholder}
      value={val === undefined ? "" : String(val)}
      onChange={(e) => setVal(e.target.value === "" ? undefined : Number(e.target.value))}
      className={INPUT}
    />
  );

  const ageOn = value.min_age !== undefined || value.max_age !== undefined;
  const heightOn = value.min_height_cm !== undefined || value.max_height_cm !== undefined;
  const locationOn = value.specific_country_codes !== undefined;
  const religionOn = value.religion_preferences !== undefined;
  const educationOn = value.education_levels !== undefined;
  const maritalOn = value.marital_statuses !== undefined;
  const childrenOn =
    value.has_children_preference !== undefined || value.wants_children_preference !== undefined;
  const smokingOn = value.smoking_preferences !== undefined;
  const drinkingOn = value.drinking_preferences !== undefined;
  const languagesOn = value.language_preference_ids !== undefined;
  const ethnicitiesOn = value.ethnicity_preference_ids !== undefined;

  return (
    <div className="space-y-3">
      <Group
        label="Age"
        savedText={ageSaved}
        on={ageOn}
        onToggle={(on) =>
          toggleGroup(["min_age", "max_age"], on, () => {
            set("min_age", p?.min_age ?? undefined);
            set("max_age", p?.max_age ?? undefined);
          })
        }
      >
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs text-[#666672] mb-1">Min</label>
            {numInput(value.min_age, (v) => set("min_age", v), p?.min_age ? String(p.min_age) : "Any")}
          </div>
          <div>
            <label className="block text-xs text-[#666672] mb-1">Max</label>
            {numInput(value.max_age, (v) => set("max_age", v), p?.max_age ? String(p.max_age) : "Any")}
          </div>
        </div>
      </Group>

      <Group
        label="Location"
        savedText={listSaved(p?.specific_country_codes)}
        on={locationOn}
        onToggle={(on) =>
          toggleGroup(["specific_country_codes"], on, () =>
            setCountryText((p?.specific_country_codes ?? []).join(", "))
          )
        }
      >
        <input
          type="text"
          placeholder="Country codes, e.g. ET, GB, US"
          value={countryText}
          onChange={(e) => {
            setCountryText(e.target.value);
            const parsed = e.target.value
              .split(",")
              .map((s) => s.trim().toUpperCase())
              .filter(Boolean);
            set("specific_country_codes", parsed.length > 0 ? parsed : []);
          }}
          className={`${INPUT} font-mono`}
        />
        <p className="mt-1 text-[10px] text-[#9CA3AF]">Empty list = any country.</p>
      </Group>

      <Group
        label="Religion"
        savedText={listSaved(p?.religion_preferences)}
        on={religionOn}
        onToggle={(on) =>
          toggleGroup(["religion_preferences"], on, () =>
            set("religion_preferences", [...(p?.religion_preferences ?? [])])
          )
        }
      >
        <ChipSelect
          options={RELIGION_PREFS.map((r) => ({ value: r, label: pretty(r) }))}
          value={value.religion_preferences ?? []}
          onChange={(v) => set("religion_preferences", v)}
        />
      </Group>

      <Group
        label="Education"
        savedText={listSaved(p?.education_levels)}
        on={educationOn}
        onToggle={(on) =>
          toggleGroup(["education_levels"], on, () =>
            set("education_levels", [...(p?.education_levels ?? [])])
          )
        }
      >
        <ChipSelect
          options={EDUCATION_LEVELS.map((r) => ({ value: r, label: pretty(r) }))}
          value={value.education_levels ?? []}
          onChange={(v) => set("education_levels", v)}
        />
      </Group>

      <Group
        label="Marital status"
        savedText={listSaved(p?.marital_statuses)}
        on={maritalOn}
        onToggle={(on) =>
          toggleGroup(["marital_statuses"], on, () =>
            set("marital_statuses", [...(p?.marital_statuses ?? [])])
          )
        }
      >
        <ChipSelect
          options={MARITAL_STATUSES.map((r) => ({ value: r, label: pretty(r) }))}
          value={value.marital_statuses ?? []}
          onChange={(v) => set("marital_statuses", v)}
        />
      </Group>

      <Group
        label="Children"
        savedText={childrenSaved}
        on={childrenOn}
        onToggle={(on) =>
          toggleGroup(["has_children_preference", "wants_children_preference"], on, () => {
            set("has_children_preference", p?.has_children_preference ?? "any");
            set("wants_children_preference", p?.wants_children_preference ?? "any");
          })
        }
      >
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs text-[#666672] mb-1">Has children</label>
            <select
              value={value.has_children_preference ?? "any"}
              onChange={(e) => set("has_children_preference", e.target.value as HasChildrenPref)}
              className={`${INPUT} cursor-pointer`}
            >
              {HAS_CHILDREN_OPTIONS.map((o) => (
                <option key={o} value={o}>{pretty(o)}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs text-[#666672] mb-1">Wants children</label>
            <select
              value={value.wants_children_preference ?? "any"}
              onChange={(e) => set("wants_children_preference", e.target.value as WantsChildrenPref)}
              className={`${INPUT} cursor-pointer`}
            >
              {WANTS_CHILDREN_OPTIONS.map((o) => (
                <option key={o} value={o}>{pretty(o)}</option>
              ))}
            </select>
          </div>
        </div>
      </Group>

      <Group
        label="Height"
        savedText={heightSaved}
        on={heightOn}
        onToggle={(on) =>
          toggleGroup(["min_height_cm", "max_height_cm"], on, () => {
            set("min_height_cm", p?.min_height_cm ?? undefined);
            set("max_height_cm", p?.max_height_cm ?? undefined);
          })
        }
      >
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs text-[#666672] mb-1">Min (cm)</label>
            {numInput(value.min_height_cm, (v) => set("min_height_cm", v), p?.min_height_cm ? String(p.min_height_cm) : "Any")}
          </div>
          <div>
            <label className="block text-xs text-[#666672] mb-1">Max (cm)</label>
            {numInput(value.max_height_cm, (v) => set("max_height_cm", v), p?.max_height_cm ? String(p.max_height_cm) : "Any")}
          </div>
        </div>
      </Group>

      <Group
        label="Smoking"
        savedText={listSaved(p?.smoking_preferences)}
        on={smokingOn}
        onToggle={(on) =>
          toggleGroup(["smoking_preferences"], on, () =>
            set("smoking_preferences", [...(p?.smoking_preferences ?? [])])
          )
        }
      >
        <ChipSelect
          options={SMOKING_PREFS.map((r) => ({ value: r, label: pretty(r) }))}
          value={value.smoking_preferences ?? []}
          onChange={(v) => set("smoking_preferences", v)}
        />
      </Group>

      <Group
        label="Drinking"
        savedText={listSaved(p?.drinking_preferences)}
        on={drinkingOn}
        onToggle={(on) =>
          toggleGroup(["drinking_preferences"], on, () =>
            set("drinking_preferences", [...(p?.drinking_preferences ?? [])])
          )
        }
      >
        <ChipSelect
          options={DRINKING_PREFS.map((r) => ({ value: r, label: pretty(r) }))}
          value={value.drinking_preferences ?? []}
          onChange={(v) => set("drinking_preferences", v)}
        />
      </Group>

      <Group
        label="Languages"
        savedText={
          p?.language_preference_ids?.length
            ? `${p.language_preference_ids.length} selected`
            : "Any"
        }
        on={languagesOn}
        onToggle={(on) =>
          toggleGroup(["language_preference_ids"], on, () =>
            set("language_preference_ids", [...(p?.language_preference_ids ?? [])])
          )
        }
      >
        <ChipSelect
          options={languageOptions}
          value={value.language_preference_ids ?? []}
          onChange={(v) => set("language_preference_ids", v)}
        />
      </Group>

      <Group
        label="Ethnicities"
        savedText={
          p?.ethnicity_preference_ids?.length
            ? `${p.ethnicity_preference_ids.length} selected`
            : "Any"
        }
        on={ethnicitiesOn}
        onToggle={(on) =>
          toggleGroup(["ethnicity_preference_ids"], on, () =>
            set("ethnicity_preference_ids", [...(p?.ethnicity_preference_ids ?? [])])
          )
        }
      >
        <ChipSelect
          options={ethnicityOptions}
          value={value.ethnicity_preference_ids ?? []}
          onChange={(v) => set("ethnicity_preference_ids", v)}
        />
      </Group>

      {rangeError && <p className="text-xs text-[#C63B4E]">{rangeError}</p>}
    </div>
  );
}
