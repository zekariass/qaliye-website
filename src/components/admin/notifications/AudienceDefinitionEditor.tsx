"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { Info, X, Lock, ChevronDown } from "lucide-react";

// ── Country catalogue ─────────────────────────────────────────────────────────
const COUNTRY_GROUPS = [
  {
    tier: "Primary markets",
    options: [
      { code: "ET", name: "Ethiopia" },
      { code: "ER", name: "Eritrea" },
      { code: "US", name: "United States" },
      { code: "GB", name: "United Kingdom" },
    ],
  },
  {
    tier: "Diaspora markets",
    options: [
      { code: "CA", name: "Canada" },
      { code: "AU", name: "Australia" },
      { code: "SE", name: "Sweden" },
      { code: "NO", name: "Norway" },
      { code: "DE", name: "Germany" },
      { code: "NL", name: "Netherlands" },
      { code: "CH", name: "Switzerland" },
      { code: "IT", name: "Italy" },
      { code: "IL", name: "Israel" },
      { code: "AE", name: "United Arab Emirates" },
      { code: "SA", name: "Saudi Arabia" },
      { code: "KE", name: "Kenya" },
      { code: "DJ", name: "Djibouti" },
    ],
  },
] as const;

// ── Types ─────────────────────────────────────────────────────────────────────
type Gender = "ALL" | "MALE" | "FEMALE";
type ResidencyType = "ETHIOPIA" | "ERITREA" | "DIASPORA";
interface CountryTag { code: string; isValid: boolean; }

interface ParsedAudience {
  gender: Gender;
  unknownGender: string | null;
  ageMin: string;
  ageMax: string;
  residencyTypes: Set<ResidencyType>;
  countries: CountryTag[];
  verifiedOnly: boolean;
  premiumOnly: boolean;
  onboardedOnly: boolean;
  unknownFields: Record<string, unknown>;
}

// ── Parsing ───────────────────────────────────────────────────────────────────
const KNOWN_FIELDS = new Set([
  "gender", "ageMin", "ageMax", "residencyTypes",
  "countries", "verifiedOnly", "premiumOnly", "onboardedOnly",
]);
const KNOWN_GENDERS: Set<string> = new Set(["MALE", "FEMALE"]);
const KNOWN_RESIDENCY: Set<string> = new Set(["ETHIOPIA", "ERITREA", "DIASPORA"]);

function parseAudienceJson(jsonStr: string): ParsedAudience {
  const empty: ParsedAudience = {
    gender: "ALL", unknownGender: null, ageMin: "", ageMax: "",
    residencyTypes: new Set(), countries: [], verifiedOnly: false,
    premiumOnly: false, onboardedOnly: false, unknownFields: {},
  };
  if (!jsonStr?.trim() || jsonStr.trim() === "{}") return empty;
  try {
    const obj = JSON.parse(jsonStr) as Record<string, unknown>;

    let gender: Gender = "ALL";
    let unknownGender: string | null = null;
    if (obj.gender && typeof obj.gender === "string") {
      if (KNOWN_GENDERS.has(obj.gender)) gender = obj.gender as Gender;
      else unknownGender = obj.gender;
    }

    const ageMin = typeof obj.ageMin === "number" && !isNaN(obj.ageMin) ? String(obj.ageMin) : "";
    const ageMax = typeof obj.ageMax === "number" && !isNaN(obj.ageMax) ? String(obj.ageMax) : "";

    const residencyTypes = new Set<ResidencyType>();
    if (Array.isArray(obj.residencyTypes)) {
      for (const r of obj.residencyTypes) {
        if (typeof r === "string" && KNOWN_RESIDENCY.has(r)) residencyTypes.add(r as ResidencyType);
      }
    }

    const countries: CountryTag[] = [];
    if (Array.isArray(obj.countries)) {
      for (const c of obj.countries) {
        if (typeof c === "string") {
          const code = c.toUpperCase();
          countries.push({ code, isValid: /^[A-Z]{2}$/.test(code) });
        }
      }
    }

    const verifiedOnly = obj.verifiedOnly === true;
    const premiumOnly = obj.premiumOnly === true;
    const onboardedOnly = obj.onboardedOnly === true;

    const unknownFields: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(obj)) {
      if (!KNOWN_FIELDS.has(k)) unknownFields[k] = v;
    }

    return { gender, unknownGender, ageMin, ageMax, residencyTypes, countries, verifiedOnly, premiumOnly, onboardedOnly, unknownFields };
  } catch {
    return empty;
  }
}

// ── Serialisation ─────────────────────────────────────────────────────────────
function buildAudienceJson(
  gender: Gender,
  ageMin: string,
  ageMax: string,
  residencyTypes: Set<ResidencyType>,
  countries: CountryTag[],
  verifiedOnly: boolean,
  premiumOnly: boolean,
  onboardedOnly: boolean,
  unknownFields: Record<string, unknown>,
): string {
  const obj: Record<string, unknown> = {};
  if (gender !== "ALL") obj.gender = gender;
  const minNum = ageMin !== "" ? parseInt(ageMin, 10) : null;
  const maxNum = ageMax !== "" ? parseInt(ageMax, 10) : null;
  if (minNum !== null && !isNaN(minNum)) obj.ageMin = minNum;
  if (maxNum !== null && !isNaN(maxNum)) obj.ageMax = maxNum;
  if (residencyTypes.size > 0) obj.residencyTypes = Array.from(residencyTypes);
  const validCodes = countries.filter((t) => t.isValid).map((t) => t.code);
  if (validCodes.length > 0) obj.countries = validCodes;
  if (verifiedOnly) obj.verifiedOnly = true;
  if (premiumOnly) obj.premiumOnly = true;
  if (onboardedOnly) obj.onboardedOnly = true;
  Object.assign(obj, unknownFields);
  return Object.keys(obj).length === 0 ? "{}" : JSON.stringify(obj, null, 2);
}

// ── Public validation helper (for zod superRefine) ────────────────────────────
export function validateAudienceDefinition(jsonStr: string): string | null {
  if (!jsonStr?.trim() || jsonStr.trim() === "{}") return null;
  let obj: Record<string, unknown>;
  try { obj = JSON.parse(jsonStr); } catch { return "Audience definition must be valid JSON"; }
  const minNum = typeof obj.ageMin === "number" ? obj.ageMin : null;
  const maxNum = typeof obj.ageMax === "number" ? obj.ageMax : null;
  if (minNum !== null && minNum < 18) return "Minimum age is 18.";
  if (maxNum !== null && maxNum > 120) return "Maximum age is 120.";
  if (minNum !== null && maxNum !== null && minNum > maxNum) return "Min age cannot exceed max age.";
  if (Array.isArray(obj.countries)) {
    for (const c of obj.countries) {
      if (typeof c !== "string" || !/^[A-Z]{2}$/.test(c.toUpperCase())) {
        return `Invalid country code: "${c}". Must be 2 letters.`;
      }
    }
  }
  return null;
}

// ── Sub-components ────────────────────────────────────────────────────────────
function Toggle({ checked, onChange, disabled }: { checked: boolean; onChange: (v: boolean) => void; disabled?: boolean }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => !disabled && onChange(!checked)}
      className={`relative inline-flex h-5 w-9 flex-shrink-0 items-center rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7C3AED] ${
        checked ? "bg-[#7C3AED]" : "bg-[#D1D1DB]"
      } ${disabled ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform ${
          checked ? "translate-x-[18px]" : "translate-x-[2px]"
        }`}
      />
    </button>
  );
}

function ToggleRow({ label, hint, checked, onChange, locked }: {
  label: string; hint: string; checked: boolean; onChange: (v: boolean) => void; locked: boolean;
}) {
  return (
    <div className="flex items-start justify-between gap-4 py-3 border-b border-[#F3F3F6] last:border-0">
      <div className="min-w-0">
        <p className="text-sm font-medium text-[#17171B]">{label}</p>
        <p className="text-xs text-[#666672] mt-0.5">{hint}</p>
      </div>
      <Toggle checked={checked} onChange={onChange} disabled={locked} />
    </div>
  );
}

function SectionLabel({ children, hint }: { children: React.ReactNode; hint?: string }) {
  return (
    <div className="mb-1.5">
      <label className="block text-xs font-medium text-[#17171B]">{children}</label>
      {hint && <p className="text-xs text-[#666672] mt-0.5">{hint}</p>}
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export interface AudienceDefinitionEditorProps {
  /** Serialised JSON string. "" or "{}" = all users. */
  value: string;
  onChange: (value: string) => void;
  /** Validation error surfaced from the parent form */
  error?: string;
  readOnly?: boolean;
  /** When set (e.g. "SENDING"), shows a locked banner */
  lockedStatus?: string;
}

export function AudienceDefinitionEditor({
  value,
  onChange,
  error,
  readOnly,
  lockedStatus,
}: AudienceDefinitionEditorProps) {
  const locked = readOnly || !!lockedStatus;

  // Parse the initial value once, lazily
  const [initial] = useState(() => parseAudienceJson(value));

  const [gender, setGender] = useState<Gender>(initial.gender);
  const [unknownGender, setUnknownGender] = useState<string | null>(initial.unknownGender);
  const [ageMin, setAgeMin] = useState(initial.ageMin);
  const [ageMax, setAgeMax] = useState(initial.ageMax);
  const [residencyTypes, setResidencyTypes] = useState<Set<ResidencyType>>(initial.residencyTypes);
  const [countries, setCountries] = useState<CountryTag[]>(initial.countries);
  const [verifiedOnly, setVerifiedOnly] = useState(initial.verifiedOnly);
  const [premiumOnly, setPremiumOnly] = useState(initial.premiumOnly);
  const [onboardedOnly, setOnboardedOnly] = useState(initial.onboardedOnly);
  const [unknownFields] = useState(initial.unknownFields);

  // Country tag input state
  const [countryInput, setCountryInput] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const countryContainerRef = useRef<HTMLDivElement>(null);
  const countryInputRef = useRef<HTMLInputElement>(null);

  // Close suggestions dropdown on outside click
  useEffect(() => {
    function onMouseDown(e: MouseEvent) {
      if (countryContainerRef.current && !countryContainerRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", onMouseDown);
    return () => document.removeEventListener("mousedown", onMouseDown);
  }, []);

  // ── Emit helper ──
  function emitWith(overrides: {
    gender?: Gender; ageMin?: string; ageMax?: string;
    residencyTypes?: Set<ResidencyType>; countries?: CountryTag[];
    verifiedOnly?: boolean; premiumOnly?: boolean; onboardedOnly?: boolean;
  }) {
    onChange(buildAudienceJson(
      overrides.gender ?? gender,
      overrides.ageMin ?? ageMin,
      overrides.ageMax ?? ageMax,
      overrides.residencyTypes ?? residencyTypes,
      overrides.countries ?? countries,
      overrides.verifiedOnly ?? verifiedOnly,
      overrides.premiumOnly ?? premiumOnly,
      overrides.onboardedOnly ?? onboardedOnly,
      unknownFields,
    ));
  }

  // ── Gender ──
  function handleGenderChange(val: string) {
    if (val === "__unknown__") return;
    const g = val as Gender;
    setGender(g);
    setUnknownGender(null);
    emitWith({ gender: g });
  }

  // ── Age range ──
  const ageMinNum = ageMin !== "" ? parseInt(ageMin, 10) : null;
  const ageMaxNum = ageMax !== "" ? parseInt(ageMax, 10) : null;
  const ageMinError = ageMinNum !== null && !isNaN(ageMinNum) && ageMinNum < 18 ? "Minimum age is 18" : null;
  const ageMaxError = ageMaxNum !== null && !isNaN(ageMaxNum) && ageMaxNum > 120
    ? "Maximum age is 120"
    : ageMinNum !== null && ageMaxNum !== null && !isNaN(ageMinNum) && !isNaN(ageMaxNum) && ageMinNum > ageMaxNum
    ? "Min age cannot exceed max age"
    : null;

  // ── Residency ──
  function toggleResidency(type: ResidencyType) {
    const next = new Set(residencyTypes);
    if (next.has(type)) next.delete(type);
    else next.add(type);
    setResidencyTypes(next);
    emitWith({ residencyTypes: next });
  }

  // ── Country tags ──
  const filteredGroups = useMemo(() => {
    const q = countryInput.trim().toUpperCase();
    const existing = new Set(countries.map((t) => t.code));
    return COUNTRY_GROUPS.map((group) => ({
      ...group,
      options: group.options.filter((opt) => {
        if (existing.has(opt.code)) return false;
        if (!q) return true;
        return opt.code.startsWith(q) || opt.name.toUpperCase().includes(q);
      }),
    })).filter((g) => g.options.length > 0);
  }, [countryInput, countries]);

  function addCountry(rawCode: string) {
    const code = rawCode.trim().toUpperCase();
    if (!code) return;
    if (countries.some((t) => t.code === code)) { setCountryInput(""); return; }
    const isValid = /^[A-Z]{2}$/.test(code);
    const next = [...countries, { code, isValid }];
    setCountries(next);
    setCountryInput("");
    emitWith({ countries: next });
  }

  function addCountryFromSuggestion(code: string) {
    if (countries.some((t) => t.code === code)) return;
    const next = [...countries, { code, isValid: true }];
    setCountries(next);
    setCountryInput("");
    setShowSuggestions(false);
    emitWith({ countries: next });
    countryInputRef.current?.focus();
  }

  function removeCountry(idx: number) {
    const next = countries.filter((_, i) => i !== idx);
    setCountries(next);
    emitWith({ countries: next });
  }

  function onCountryKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      if (countryInput.trim()) addCountry(countryInput.trim());
    } else if (e.key === "Backspace" && !countryInput && countries.length > 0) {
      removeCountry(countries.length - 1);
    } else if (e.key === "Escape") {
      setShowSuggestions(false);
    }
  }

  const hasInvalidCountry = countries.some((t) => !t.isValid);
  const hasUnknownFields = Object.keys(unknownFields).length > 0;

  // Live preview JSON
  const previewJson = buildAudienceJson(
    gender, ageMin, ageMax, residencyTypes, countries,
    verifiedOnly, premiumOnly, onboardedOnly, unknownFields,
  );

  const SEL = "w-full px-3 py-2 text-sm border border-[#E5E5EA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/30 focus:border-[#7C3AED] bg-white";
  const INP = "px-3 py-2 text-sm border border-[#E5E5EA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/30 focus:border-[#7C3AED] bg-white";
  const DIS = "opacity-60 cursor-not-allowed";

  return (
    <div className="space-y-5">

      {/* Locked banner */}
      {lockedStatus && (
        <div className="flex items-center gap-2 px-3 py-2.5 text-sm text-[#7C3AED] bg-[#F5F3FF] border border-[#DDD6FE] rounded-lg">
          <Lock className="h-4 w-4 shrink-0" />
          Campaign content is locked because status is <strong className="font-semibold">{lockedStatus}</strong>.
        </div>
      )}

      {/* Section header */}
      <div>
        <p className="text-sm font-semibold text-[#17171B]">Target Audience</p>
        <p className="text-xs text-[#666672] mt-1">Leave all filters empty to target all users with marketing notifications enabled.</p>
        {error && <p className="mt-1.5 text-xs text-[#C63B4E]">{error}</p>}
      </div>

      {/* ── Gender ── */}
      <div>
        <SectionLabel>Gender</SectionLabel>
        {unknownGender && (
          <div className="flex items-center gap-1.5 mb-1.5 px-2.5 py-1.5 text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg">
            <Info className="h-3.5 w-3.5 shrink-0" />
            Gender &ldquo;{unknownGender}&rdquo; is not recognized. Select a valid option.
          </div>
        )}
        <select
          value={unknownGender ? "__unknown__" : gender}
          onChange={(e) => handleGenderChange(e.target.value)}
          disabled={locked}
          className={`${SEL} ${locked ? DIS : "cursor-pointer"}`}
        >
          {unknownGender && <option value="__unknown__" disabled>Unknown: {unknownGender}</option>}
          <option value="ALL">All genders</option>
          <option value="MALE">Male only</option>
          <option value="FEMALE">Female only</option>
        </select>
      </div>

      {/* ── Age range ── */}
      <div>
        <SectionLabel hint="Leave empty for no age restriction. Minimum is 18.">Age range</SectionLabel>
        <div className="flex items-start gap-3">
          <div className="flex-1">
            <input
              type="number"
              min={18}
              max={120}
              value={ageMin}
              onChange={(e) => { setAgeMin(e.target.value); emitWith({ ageMin: e.target.value }); }}
              disabled={locked}
              placeholder="Min age"
              className={`${INP} w-full ${locked ? DIS : ""} ${ageMinError ? "border-[#C63B4E]" : ""}`}
            />
            {ageMinError && <p className="mt-1 text-xs text-[#C63B4E]">{ageMinError}</p>}
          </div>
          <span className="pt-2.5 text-sm text-[#C6C6CE] select-none">–</span>
          <div className="flex-1">
            <input
              type="number"
              min={18}
              max={120}
              value={ageMax}
              onChange={(e) => { setAgeMax(e.target.value); emitWith({ ageMax: e.target.value }); }}
              disabled={locked}
              placeholder="Max age"
              className={`${INP} w-full ${locked ? DIS : ""} ${ageMaxError ? "border-[#C63B4E]" : ""}`}
            />
            {ageMaxError && <p className="mt-1 text-xs text-[#C63B4E]">{ageMaxError}</p>}
          </div>
        </div>
      </div>

      {/* ── Residency type ── */}
      <div>
        <SectionLabel hint="Leave empty to include all residency types.">Residency type</SectionLabel>
        <div className="space-y-2">
          {(["ETHIOPIA", "ERITREA", "DIASPORA"] as ResidencyType[]).map((type) => {
            const labels: Record<ResidencyType, string> = {
              ETHIOPIA: "Lives in Ethiopia",
              ERITREA: "Lives in Eritrea",
              DIASPORA: "Diaspora (outside Ethiopia/Eritrea)",
            };
            return (
              <label key={type} className={`flex items-center gap-2.5 text-sm text-[#17171B] ${locked ? "cursor-not-allowed opacity-60" : "cursor-pointer"}`}>
                <input
                  type="checkbox"
                  checked={residencyTypes.has(type)}
                  onChange={() => !locked && toggleResidency(type)}
                  disabled={locked}
                  className="h-4 w-4 rounded border-[#C6C6CE] text-[#7C3AED] focus:ring-[#7C3AED]/30 accent-[#7C3AED]"
                />
                <span>{labels[type]}</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* ── Countries tag input ── */}
      <div>
        <SectionLabel hint="Leave empty to include all countries. Start typing a country name or code. Any valid ISO 3166-1 alpha-2 code is accepted.">
          Countries
        </SectionLabel>

        <div ref={countryContainerRef} className="relative">
          {/* Tag container + input */}
          <div
            className={`flex flex-wrap gap-1.5 min-h-[42px] px-2.5 py-2 border rounded-lg transition-colors ${
              hasInvalidCountry ? "border-[#C63B4E]" : "border-[#E5E5EA]"
            } ${locked ? "bg-[#F7F7FA] opacity-60" : "bg-white cursor-text"}`}
            onClick={() => !locked && countryInputRef.current?.focus()}
          >
            {countries.map((tag, idx) => (
              <span
                key={idx}
                className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs font-mono rounded-full ${
                  tag.isValid
                    ? "bg-[#EDE9FE] text-[#7C3AED]"
                    : "bg-[#FFF1F2] text-[#C63B4E] border border-[#FECDD3]"
                }`}
              >
                {tag.code}
                {!tag.isValid && (
                  <span className="text-[10px] font-sans text-[#C63B4E]">✕ invalid</span>
                )}
                {!locked && (
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); removeCountry(idx); }}
                    className="hover:opacity-70"
                    aria-label={`Remove ${tag.code}`}
                  >
                    <X className="h-3 w-3" />
                  </button>
                )}
              </span>
            ))}

            {!locked && (
              <input
                ref={countryInputRef}
                type="text"
                value={countryInput}
                onChange={(e) => {
                  setCountryInput(e.target.value);
                  setShowSuggestions(true);
                }}
                onFocus={() => setShowSuggestions(true)}
                onKeyDown={onCountryKeyDown}
                placeholder={countries.length === 0 ? "Type a code or name, press Enter…" : ""}
                className="flex-1 min-w-24 bg-transparent text-sm outline-none placeholder:text-[#C6C6CE]"
              />
            )}
          </div>

          {hasInvalidCountry && (
            <p className="mt-1 text-xs text-[#C63B4E]">
              Invalid country {countries.filter((t) => !t.isValid).length === 1 ? "code" : "codes"}: must be exactly 2 letters.
            </p>
          )}

          {/* Suggestions dropdown */}
          {showSuggestions && filteredGroups.length > 0 && !locked && (
            <div className="absolute z-50 top-full left-0 right-0 mt-1 bg-white border border-[#E5E5EA] rounded-xl shadow-lg max-h-52 overflow-y-auto">
              {filteredGroups.map((group) => (
                <div key={group.tier}>
                  <div className="px-3 py-1.5 text-[10px] font-semibold text-[#C6C6CE] uppercase tracking-wider bg-[#F7F7FA] sticky top-0">
                    {group.tier}
                  </div>
                  {group.options.map((opt) => (
                    <button
                      key={opt.code}
                      type="button"
                      onMouseDown={(e) => { e.preventDefault(); addCountryFromSuggestion(opt.code); }}
                      className="flex items-center gap-3 w-full px-3 py-2 text-sm hover:bg-[#F5F3FF] transition-colors text-left"
                    >
                      <span className="font-mono text-xs text-[#7C3AED] w-8 shrink-0">{opt.code}</span>
                      <span className="text-[#17171B]">{opt.name}</span>
                    </button>
                  ))}
                </div>
              ))}
            </div>
          )}

          {/* "No matches" when typing but nothing found */}
          {showSuggestions && countryInput.trim() && filteredGroups.length === 0 && !locked && (
            <div className="absolute z-50 top-full left-0 right-0 mt-1 bg-white border border-[#E5E5EA] rounded-xl shadow-lg px-3 py-2.5">
              <p className="text-xs text-[#666672]">
                Press <kbd className="px-1 py-0.5 text-[10px] bg-[#F7F7FA] border border-[#E5E5EA] rounded">Enter</kbd> to add{" "}
                <span className="font-mono font-semibold text-[#7C3AED]">{countryInput.trim().toUpperCase()}</span>
              </p>
            </div>
          )}
        </div>

        {/* ChevronDown affordance (hidden when there are tags, to avoid clutter) */}
        {countries.length === 0 && !locked && (
          <button
            type="button"
            onClick={() => { setShowSuggestions((v) => !v); countryInputRef.current?.focus(); }}
            className="mt-1 flex items-center gap-1 text-xs text-[#666672] hover:text-[#7C3AED]"
          >
            <ChevronDown className="h-3.5 w-3.5" /> Browse suggested countries
          </button>
        )}
      </div>

      {/* ── Toggle rows ── */}
      <div className="border border-[#E5E5EA] rounded-xl px-4">
        <ToggleRow
          label="Verified users only"
          hint="Only send to users whose identity has been verified."
          checked={verifiedOnly}
          onChange={(v) => { setVerifiedOnly(v); emitWith({ verifiedOnly: v }); }}
          locked={locked}
        />
        <ToggleRow
          label="Premium subscribers only"
          hint="Only send to users with an active premium subscription."
          checked={premiumOnly}
          onChange={(v) => { setPremiumOnly(v); emitWith({ premiumOnly: v }); }}
          locked={locked}
        />
        <ToggleRow
          label="Onboarded users only"
          hint="Only send to users who have completed the onboarding flow (profile set up)."
          checked={onboardedOnly}
          onChange={(v) => { setOnboardedOnly(v); emitWith({ onboardedOnly: v }); }}
          locked={locked}
        />
      </div>

      {/* ── Unknown fields notice ── */}
      {hasUnknownFields && (
        <div className="border border-amber-200 bg-amber-50 rounded-lg px-3.5 py-3 space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-700">
            <Info className="h-3.5 w-3.5 shrink-0" />
            Additional unrecognized fields
          </div>
          <p className="text-xs text-amber-700">These fields are not recognized by the form and may not be applied by the backend.</p>
          <pre className="text-xs font-mono bg-amber-100 rounded px-2.5 py-2 overflow-x-auto whitespace-pre-wrap text-amber-800">
            {JSON.stringify(unknownFields, null, 2)}
          </pre>
        </div>
      )}

      {/* ── Live JSON preview ── */}
      <div>
        <p className="text-xs font-medium text-[#666672] mb-1.5">Preview</p>
        <pre className="text-xs font-mono bg-[#F7F7FA] border border-[#E5E5EA] rounded-lg px-3 py-2.5 overflow-x-auto whitespace-pre-wrap break-all text-[#17171B] leading-relaxed">
          {previewJson}
        </pre>
      </div>
    </div>
  );
}
