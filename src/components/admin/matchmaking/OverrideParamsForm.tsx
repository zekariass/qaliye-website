"use client";

import { useState, useEffect } from "react";
import type { OverrideParams, PreferenceSnapshot } from "@/lib/admin/matchmaking-types";
import { MARITAL_STATUSES, SMOKING_PREFS, DRINKING_PREFS } from "@/lib/admin/matchmaking-types";

const RELIGION_OPTIONS = [
  "ORTHODOX_CHRISTIAN", "PROTESTANT", "CATHOLIC", "MUSLIM", "JEWISH",
  "HINDU", "BUDDHIST", "SPIRITUAL", "AGNOSTIC", "ATHEIST", "OTHER",
];
const EDUCATION_OPTIONS = [
  "HIGH_SCHOOL", "SOME_COLLEGE", "ASSOCIATES", "BACHELORS", "MASTERS", "DOCTORATE", "TRADE_SCHOOL",
];
const HAS_CHILDREN_OPTIONS = ["any", "yes", "no"] as const;
const WANTS_CHILDREN_OPTIONS = ["any", "yes", "no", "not_sure", "open_to_discussion"] as const;

function MultiCheckbox({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: readonly string[];
  value: string[] | undefined;
  onChange: (v: string[] | undefined) => void;
}) {
  const selected = value ?? [];
  function toggle(opt: string) {
    const next = selected.includes(opt)
      ? selected.filter((s) => s !== opt)
      : [...selected, opt];
    onChange(next.length > 0 ? next : undefined);
  }
  return (
    <div>
      <p className="text-xs font-medium text-[#666672] mb-1">{label}</p>
      <div className="flex flex-wrap gap-1.5">
        {options.map((opt) => (
          <button
            key={opt}
            type="button"
            onClick={() => toggle(opt)}
            className={`px-2 py-0.5 text-xs rounded-full border transition-colors ${
              selected.includes(opt)
                ? "bg-[#7C3AED] text-white border-[#7C3AED]"
                : "bg-white text-[#666672] border-[#E5E5EA] hover:border-[#7C3AED]"
            }`}
          >
            {opt.replace(/_/g, " ")}
          </button>
        ))}
      </div>
    </div>
  );
}

interface Props {
  snapshot?: PreferenceSnapshot;
  value: OverrideParams;
  onChange: (params: OverrideParams) => void;
}

export function OverrideParamsForm({ snapshot, value, onChange }: Props) {
  const [countryCodes, setCountryCodes] = useState(
    (value.specific_country_codes ?? snapshot?.specific_country_codes ?? []).join(", ")
  );
  const [langIds, setLangIds] = useState(
    (value.language_preference_ids ?? snapshot?.language_preference_ids ?? []).join(", ")
  );
  const [ethnicityIds, setEthnicityIds] = useState(
    (value.ethnicity_preference_ids ?? snapshot?.ethnicity_preference_ids ?? []).join(", ")
  );

  // Sync back country codes
  useEffect(() => {
    const parsed = countryCodes
      .split(",")
      .map((s) => s.trim().toUpperCase())
      .filter(Boolean);
    onChange({ ...value, specific_country_codes: parsed.length > 0 ? parsed : undefined });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [countryCodes]);

  useEffect(() => {
    const parsed = langIds.split(",").map((s) => s.trim()).filter(Boolean);
    onChange({ ...value, language_preference_ids: parsed.length > 0 ? parsed : undefined });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [langIds]);

  useEffect(() => {
    const parsed = ethnicityIds.split(",").map((s) => s.trim()).filter(Boolean);
    onChange({ ...value, ethnicity_preference_ids: parsed.length > 0 ? parsed : undefined });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ethnicityIds]);

  function numField(
    fieldKey: "min_age" | "max_age" | "min_height_cm" | "max_height_cm",
    label: string,
    placeholder: string
  ) {
    const snap = snapshot?.[fieldKey] as number | undefined | null;
    return (
      <div>
        <label className="block text-xs font-medium text-[#666672] mb-1">{label}</label>
        <input
          type="number"
          placeholder={snap !== undefined && snap !== null ? String(snap) : placeholder}
          value={value[fieldKey] !== undefined ? String(value[fieldKey]) : ""}
          onChange={(e) => {
            const n = e.target.value === "" ? undefined : Number(e.target.value);
            onChange({ ...value, [fieldKey]: n });
          }}
          className="w-full px-3 py-1.5 text-sm border border-[#E5E5EA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/30 focus:border-[#7C3AED]"
        />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        {numField("min_age", "Min Age", "18")}
        {numField("max_age", "Max Age", "99")}
        {numField("min_height_cm", "Min Height (cm)", "140")}
        {numField("max_height_cm", "Max Height (cm)", "220")}
      </div>

      <div>
        <label className="block text-xs font-medium text-[#666672] mb-1">Country Codes (comma-separated)</label>
        <input
          type="text"
          placeholder="e.g. ET, GB, US"
          value={countryCodes}
          onChange={(e) => setCountryCodes(e.target.value)}
          className="w-full px-3 py-1.5 text-sm border border-[#E5E5EA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/30 focus:border-[#7C3AED]"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-[#666672] mb-1">Has Children</label>
          <select
            value={value.has_children_preference ?? ""}
            onChange={(e) => onChange({ ...value, has_children_preference: (e.target.value || undefined) as typeof value.has_children_preference })}
            className="w-full px-3 py-1.5 text-sm border border-[#E5E5EA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/30 cursor-pointer"
          >
            <option value="">— use snapshot —</option>
            {HAS_CHILDREN_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-[#666672] mb-1">Wants Children</label>
          <select
            value={value.wants_children_preference ?? ""}
            onChange={(e) => onChange({ ...value, wants_children_preference: (e.target.value || undefined) as typeof value.wants_children_preference })}
            className="w-full px-3 py-1.5 text-sm border border-[#E5E5EA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/30 cursor-pointer"
          >
            <option value="">— use snapshot —</option>
            {WANTS_CHILDREN_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
          </select>
        </div>
      </div>

      <MultiCheckbox
        label="Religion Preferences"
        options={RELIGION_OPTIONS}
        value={value.religion_preferences}
        onChange={(v) => onChange({ ...value, religion_preferences: v })}
      />
      <MultiCheckbox
        label="Education Levels"
        options={EDUCATION_OPTIONS}
        value={value.education_levels}
        onChange={(v) => onChange({ ...value, education_levels: v })}
      />
      <MultiCheckbox
        label="Marital Statuses"
        options={MARITAL_STATUSES}
        value={value.marital_statuses}
        onChange={(v) => onChange({ ...value, marital_statuses: v })}
      />
      <MultiCheckbox
        label="Smoking Preferences"
        options={SMOKING_PREFS}
        value={value.smoking_preferences}
        onChange={(v) => onChange({ ...value, smoking_preferences: v })}
      />
      <MultiCheckbox
        label="Drinking Preferences"
        options={DRINKING_PREFS}
        value={value.drinking_preferences}
        onChange={(v) => onChange({ ...value, drinking_preferences: v })}
      />

      <div>
        <label className="block text-xs font-medium text-[#666672] mb-1">Language IDs (comma-separated UUIDs)</label>
        <input
          type="text"
          placeholder="UUID, UUID…"
          value={langIds}
          onChange={(e) => setLangIds(e.target.value)}
          className="w-full px-3 py-1.5 text-sm border border-[#E5E5EA] rounded-lg font-mono focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/30 focus:border-[#7C3AED]"
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-[#666672] mb-1">Ethnicity IDs (comma-separated UUIDs)</label>
        <input
          type="text"
          placeholder="UUID, UUID…"
          value={ethnicityIds}
          onChange={(e) => setEthnicityIds(e.target.value)}
          className="w-full px-3 py-1.5 text-sm border border-[#E5E5EA] rounded-lg font-mono focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/30 focus:border-[#7C3AED]"
        />
      </div>
    </div>
  );
}
