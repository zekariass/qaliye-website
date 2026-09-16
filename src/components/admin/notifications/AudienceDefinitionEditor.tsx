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
type RelationshipIntention = "MARRIAGE" | "SERIOUS_RELATIONSHIP" | "LONG_TERM" | "FRIENDSHIP" | "NOT_SURE_YET";
type MaritalStatus = "NEVER_MARRIED" | "DIVORCED" | "WIDOWED" | "SEPARATED";
type LastActiveMode = "ANY" | "ACTIVE_LAST" | "DORMANT_FOR";
type AccountAgeMode = "ANY" | "OLDER_THAN";
type VerificationMode = "ALL" | "VERIFIED" | "UNVERIFIED";
type SubscriptionMode = "ALL" | "PREMIUM" | "NON_PREMIUM";
interface CountryTag { code: string; isValid: boolean; }

// ── Known field registry ──────────────────────────────────────────────────────
const KNOWN_FIELDS = new Set([
  "gender", "ageMin", "ageMax", "residencyTypes", "countries",
  "relationshipIntentions", "maritalStatuses",
  "profileCompletionMin", "profileCompletionMax",
  "lastActiveDays", "lastActiveDaysMax", "accountAgeDays",
  "verifiedOnly", "unVerifiedOnly", "premiumOnly", "nonPremiumOnly", "onboardedOnly",
]);
const KNOWN_GENDERS = new Set(["MALE", "FEMALE"]);
const KNOWN_RESIDENCY = new Set(["ETHIOPIA", "ERITREA", "DIASPORA"]);
const KNOWN_INTENTIONS = new Set(["MARRIAGE", "SERIOUS_RELATIONSHIP", "LONG_TERM", "FRIENDSHIP", "NOT_SURE_YET"]);
const KNOWN_MARITAL = new Set(["NEVER_MARRIED", "DIVORCED", "WIDOWED", "SEPARATED"]);

// ── Parsed shape ──────────────────────────────────────────────────────────────
interface ParsedAudience {
  gender: Gender;
  unknownGender: string | null;
  ageMin: string;
  ageMax: string;
  residencyTypes: Set<ResidencyType>;
  countries: CountryTag[];
  relationshipIntentions: Set<RelationshipIntention>;
  maritalStatuses: Set<MaritalStatus>;
  profileCompletionMin: string;
  profileCompletionMax: string;
  lastActiveMode: LastActiveMode;
  lastActiveDaysInput: string;
  accountAgeMode: AccountAgeMode;
  accountAgeDaysInput: string;
  verificationMode: VerificationMode;
  subscriptionMode: SubscriptionMode;
  onboardedOnly: boolean;
  unknownFields: Record<string, unknown>;
}

function parseAudienceJson(jsonStr: string): ParsedAudience {
  const empty: ParsedAudience = {
    gender: "ALL", unknownGender: null, ageMin: "", ageMax: "",
    residencyTypes: new Set(), countries: [],
    relationshipIntentions: new Set(), maritalStatuses: new Set(),
    profileCompletionMin: "", profileCompletionMax: "",
    lastActiveMode: "ANY", lastActiveDaysInput: "",
    accountAgeMode: "ANY", accountAgeDaysInput: "",
    verificationMode: "ALL", subscriptionMode: "ALL",
    onboardedOnly: false, unknownFields: {},
  };
  if (!jsonStr?.trim() || jsonStr.trim() === "{}") return empty;
  try {
    const obj = JSON.parse(jsonStr) as Record<string, unknown>;

    // gender
    let gender: Gender = "ALL";
    let unknownGender: string | null = null;
    if (obj.gender && typeof obj.gender === "string") {
      if (KNOWN_GENDERS.has(obj.gender)) gender = obj.gender as Gender;
      else unknownGender = obj.gender;
    }

    // age
    const ageMin = typeof obj.ageMin === "number" && !isNaN(obj.ageMin) ? String(obj.ageMin) : "";
    const ageMax = typeof obj.ageMax === "number" && !isNaN(obj.ageMax) ? String(obj.ageMax) : "";

    // residency
    const residencyTypes = new Set<ResidencyType>();
    if (Array.isArray(obj.residencyTypes)) {
      for (const r of obj.residencyTypes) {
        if (typeof r === "string" && KNOWN_RESIDENCY.has(r)) residencyTypes.add(r as ResidencyType);
      }
    }

    // countries
    const countries: CountryTag[] = [];
    if (Array.isArray(obj.countries)) {
      for (const c of obj.countries) {
        if (typeof c === "string") {
          const code = c.toUpperCase();
          countries.push({ code, isValid: /^[A-Z]{2}$/.test(code) });
        }
      }
    }

    // relationship intentions
    const relationshipIntentions = new Set<RelationshipIntention>();
    if (Array.isArray(obj.relationshipIntentions)) {
      for (const r of obj.relationshipIntentions) {
        if (typeof r === "string" && KNOWN_INTENTIONS.has(r)) relationshipIntentions.add(r as RelationshipIntention);
      }
    }

    // marital statuses
    const maritalStatuses = new Set<MaritalStatus>();
    if (Array.isArray(obj.maritalStatuses)) {
      for (const m of obj.maritalStatuses) {
        if (typeof m === "string" && KNOWN_MARITAL.has(m)) maritalStatuses.add(m as MaritalStatus);
      }
    }

    // profile completion
    const profileCompletionMin = typeof obj.profileCompletionMin === "number" && !isNaN(obj.profileCompletionMin) ? String(obj.profileCompletionMin) : "";
    const profileCompletionMax = typeof obj.profileCompletionMax === "number" && !isNaN(obj.profileCompletionMax) ? String(obj.profileCompletionMax) : "";

    // last active
    let lastActiveMode: LastActiveMode = "ANY";
    let lastActiveDaysInput = "";
    if (typeof obj.lastActiveDays === "number" && !isNaN(obj.lastActiveDays)) {
      lastActiveMode = "ACTIVE_LAST";
      lastActiveDaysInput = String(obj.lastActiveDays);
    } else if (typeof obj.lastActiveDaysMax === "number" && !isNaN(obj.lastActiveDaysMax)) {
      lastActiveMode = "DORMANT_FOR";
      lastActiveDaysInput = String(obj.lastActiveDaysMax);
    }

    // account age
    let accountAgeMode: AccountAgeMode = "ANY";
    let accountAgeDaysInput = "";
    if (typeof obj.accountAgeDays === "number" && !isNaN(obj.accountAgeDays)) {
      accountAgeMode = "OLDER_THAN";
      accountAgeDaysInput = String(obj.accountAgeDays);
    }

    // verification three-way
    let verificationMode: VerificationMode = "ALL";
    if (obj.verifiedOnly === true) verificationMode = "VERIFIED";
    else if (obj.unVerifiedOnly === true) verificationMode = "UNVERIFIED";

    // subscription three-way
    let subscriptionMode: SubscriptionMode = "ALL";
    if (obj.premiumOnly === true) subscriptionMode = "PREMIUM";
    else if (obj.nonPremiumOnly === true) subscriptionMode = "NON_PREMIUM";

    const onboardedOnly = obj.onboardedOnly === true;

    // unknown fields
    const unknownFields: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(obj)) {
      if (!KNOWN_FIELDS.has(k)) unknownFields[k] = v;
    }

    return {
      gender, unknownGender, ageMin, ageMax, residencyTypes, countries,
      relationshipIntentions, maritalStatuses,
      profileCompletionMin, profileCompletionMax,
      lastActiveMode, lastActiveDaysInput,
      accountAgeMode, accountAgeDaysInput,
      verificationMode, subscriptionMode,
      onboardedOnly, unknownFields,
    };
  } catch {
    return empty;
  }
}

// ── Serialisation ─────────────────────────────────────────────────────────────
interface BuildState {
  gender: Gender;
  ageMin: string; ageMax: string;
  residencyTypes: Set<ResidencyType>;
  countries: CountryTag[];
  relationshipIntentions: Set<RelationshipIntention>;
  maritalStatuses: Set<MaritalStatus>;
  profileCompletionMin: string; profileCompletionMax: string;
  lastActiveMode: LastActiveMode; lastActiveDaysInput: string;
  accountAgeMode: AccountAgeMode; accountAgeDaysInput: string;
  verificationMode: VerificationMode;
  subscriptionMode: SubscriptionMode;
  onboardedOnly: boolean;
  unknownFields: Record<string, unknown>;
}

function buildAudienceJson(s: BuildState): string {
  const obj: Record<string, unknown> = {};

  if (s.gender !== "ALL") obj.gender = s.gender;

  const ageMinN = s.ageMin !== "" ? parseInt(s.ageMin, 10) : null;
  const ageMaxN = s.ageMax !== "" ? parseInt(s.ageMax, 10) : null;
  if (ageMinN !== null && !isNaN(ageMinN)) obj.ageMin = ageMinN;
  if (ageMaxN !== null && !isNaN(ageMaxN)) obj.ageMax = ageMaxN;

  if (s.residencyTypes.size > 0) obj.residencyTypes = Array.from(s.residencyTypes);

  const validCodes = s.countries.filter((t) => t.isValid).map((t) => t.code);
  if (validCodes.length > 0) obj.countries = validCodes;

  if (s.relationshipIntentions.size > 0) obj.relationshipIntentions = Array.from(s.relationshipIntentions);
  if (s.maritalStatuses.size > 0) obj.maritalStatuses = Array.from(s.maritalStatuses);

  const pcMinN = s.profileCompletionMin !== "" ? parseInt(s.profileCompletionMin, 10) : null;
  const pcMaxN = s.profileCompletionMax !== "" ? parseInt(s.profileCompletionMax, 10) : null;
  if (pcMinN !== null && !isNaN(pcMinN)) obj.profileCompletionMin = pcMinN;
  if (pcMaxN !== null && !isNaN(pcMaxN)) obj.profileCompletionMax = pcMaxN;

  const daysN = s.lastActiveDaysInput !== "" ? parseInt(s.lastActiveDaysInput, 10) : null;
  if (s.lastActiveMode === "ACTIVE_LAST" && daysN !== null && !isNaN(daysN) && daysN >= 1) obj.lastActiveDays = daysN;
  if (s.lastActiveMode === "DORMANT_FOR" && daysN !== null && !isNaN(daysN) && daysN >= 1) obj.lastActiveDaysMax = daysN;

  const accN = s.accountAgeDaysInput !== "" ? parseInt(s.accountAgeDaysInput, 10) : null;
  if (s.accountAgeMode === "OLDER_THAN" && accN !== null && !isNaN(accN) && accN >= 1) obj.accountAgeDays = accN;

  if (s.verificationMode === "VERIFIED") obj.verifiedOnly = true;
  if (s.verificationMode === "UNVERIFIED") obj.unVerifiedOnly = true;

  if (s.subscriptionMode === "PREMIUM") obj.premiumOnly = true;
  if (s.subscriptionMode === "NON_PREMIUM") obj.nonPremiumOnly = true;

  if (s.onboardedOnly) obj.onboardedOnly = true;

  Object.assign(obj, s.unknownFields);
  return Object.keys(obj).length === 0 ? "{}" : JSON.stringify(obj, null, 2);
}

// ── Public validation helper (used in zod superRefine) ────────────────────────
export function validateAudienceDefinition(jsonStr: string): string | null {
  if (!jsonStr?.trim() || jsonStr.trim() === "{}") return null;
  let obj: Record<string, unknown>;
  try { obj = JSON.parse(jsonStr); } catch { return "Audience definition must be valid JSON"; }

  const ageMin = typeof obj.ageMin === "number" ? obj.ageMin : null;
  const ageMax = typeof obj.ageMax === "number" ? obj.ageMax : null;
  if (ageMin !== null && ageMin < 18) return "Minimum age is 18.";
  if (ageMax !== null && ageMax > 120) return "Maximum age is 120.";
  if (ageMin !== null && ageMax !== null && ageMin > ageMax) return "Min age cannot exceed max age.";

  const pcMin = typeof obj.profileCompletionMin === "number" ? obj.profileCompletionMin : null;
  const pcMax = typeof obj.profileCompletionMax === "number" ? obj.profileCompletionMax : null;
  if (pcMin !== null && pcMin < 0) return "Minimum profile completion is 0.";
  if (pcMax !== null && pcMax > 100) return "Maximum profile completion is 100.";
  if (pcMin !== null && pcMax !== null && pcMin > pcMax) return "Min completion cannot exceed max completion.";

  const lastActiveDays = typeof obj.lastActiveDays === "number" ? obj.lastActiveDays : null;
  const lastActiveDaysMax = typeof obj.lastActiveDaysMax === "number" ? obj.lastActiveDaysMax : null;
  const accountAgeDays = typeof obj.accountAgeDays === "number" ? obj.accountAgeDays : null;
  if (lastActiveDays !== null && lastActiveDays < 1) return "Days must be at least 1.";
  if (lastActiveDaysMax !== null && lastActiveDaysMax < 1) return "Days must be at least 1.";
  if (accountAgeDays !== null && accountAgeDays < 1) return "Days must be at least 1.";

  if (Array.isArray(obj.countries)) {
    for (const c of obj.countries) {
      if (typeof c !== "string" || !/^[A-Z]{2}$/.test(c.toUpperCase())) {
        return `Invalid country code: "${c}". Must be 2 letters.`;
      }
    }
  }
  return null;
}

// ── Shared styles ─────────────────────────────────────────────────────────────
const SEL = "w-full px-3 py-2 text-sm border border-[#E5E5EA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/30 focus:border-[#7C3AED] bg-white";
const INP = "px-3 py-2 text-sm border border-[#E5E5EA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/30 focus:border-[#7C3AED] bg-white";
const DIS = "opacity-60 cursor-not-allowed";

// ── Sub-components ────────────────────────────────────────────────────────────
function Toggle({ checked, onChange, disabled }: { checked: boolean; onChange: (v: boolean) => void; disabled?: boolean }) {
  return (
    <button
      type="button" role="switch" aria-checked={checked}
      onClick={() => !disabled && onChange(!checked)}
      className={`relative inline-flex h-5 w-9 flex-shrink-0 items-center rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7C3AED] ${
        checked ? "bg-[#7C3AED]" : "bg-[#D1D1DB]"
      } ${disabled ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}`}
    >
      <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform ${checked ? "translate-x-[18px]" : "translate-x-[2px]"}`} />
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

function SegmentedControl<T extends string>({ options, value, onChange, disabled }: {
  options: { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
  disabled?: boolean;
}) {
  return (
    <div className="flex rounded-lg border border-[#E5E5EA] overflow-hidden">
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => !disabled && onChange(opt.value)}
          className={`flex-1 px-3 py-2 text-xs font-medium transition-colors border-l border-[#E5E5EA] first:border-l-0 ${
            value === opt.value
              ? "bg-[#7C3AED] text-white border-[#7C3AED]"
              : "bg-white text-[#666672] hover:bg-[#F5F3FF] hover:text-[#7C3AED]"
          } ${disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer"}`}
        >
          {opt.label}
        </button>
      ))}
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

function SubsectionHeader({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 pt-1">
      <p className="text-xs font-semibold text-[#666672] uppercase tracking-wider">{children}</p>
      <div className="flex-1 h-px bg-[#E5E5EA]" />
    </div>
  );
}

function CheckboxGroup<T extends string>({
  options, selected, onToggle, locked,
}: {
  options: { value: T; label: string }[];
  selected: Set<T>;
  onToggle: (v: T) => void;
  locked: boolean;
}) {
  return (
    <div className="grid grid-cols-2 gap-y-2 gap-x-4">
      {options.map(({ value, label }) => (
        <label key={value} className={`flex items-center gap-2 text-sm text-[#17171B] ${locked ? "cursor-not-allowed opacity-60" : "cursor-pointer"}`}>
          <input
            type="checkbox"
            checked={selected.has(value)}
            onChange={() => !locked && onToggle(value)}
            disabled={locked}
            className="h-4 w-4 rounded border-[#C6C6CE] accent-[#7C3AED]"
          />
          <span>{label}</span>
        </label>
      ))}
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export interface AudienceDefinitionEditorProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  readOnly?: boolean;
  lockedStatus?: string;
}

export function AudienceDefinitionEditor({
  value, onChange, error, readOnly, lockedStatus,
}: AudienceDefinitionEditorProps) {
  const locked = readOnly || !!lockedStatus;

  // Parse initial value once
  const [initial] = useState(() => parseAudienceJson(value));

  // ── State ──
  const [gender, setGender] = useState<Gender>(initial.gender);
  const [unknownGender, setUnknownGender] = useState<string | null>(initial.unknownGender);
  const [ageMin, setAgeMin] = useState(initial.ageMin);
  const [ageMax, setAgeMax] = useState(initial.ageMax);
  const [residencyTypes, setResidencyTypes] = useState<Set<ResidencyType>>(initial.residencyTypes);
  const [countries, setCountries] = useState<CountryTag[]>(initial.countries);
  const [relationshipIntentions, setRelationshipIntentions] = useState<Set<RelationshipIntention>>(initial.relationshipIntentions);
  const [maritalStatuses, setMaritalStatuses] = useState<Set<MaritalStatus>>(initial.maritalStatuses);
  const [profileCompletionMin, setProfileCompletionMin] = useState(initial.profileCompletionMin);
  const [profileCompletionMax, setProfileCompletionMax] = useState(initial.profileCompletionMax);
  const [lastActiveMode, setLastActiveMode] = useState<LastActiveMode>(initial.lastActiveMode);
  const [lastActiveDaysInput, setLastActiveDaysInput] = useState(initial.lastActiveDaysInput);
  const [accountAgeMode, setAccountAgeMode] = useState<AccountAgeMode>(initial.accountAgeMode);
  const [accountAgeDaysInput, setAccountAgeDaysInput] = useState(initial.accountAgeDaysInput);
  const [verificationMode, setVerificationMode] = useState<VerificationMode>(initial.verificationMode);
  const [subscriptionMode, setSubscriptionMode] = useState<SubscriptionMode>(initial.subscriptionMode);
  const [onboardedOnly, setOnboardedOnly] = useState(initial.onboardedOnly);
  const [unknownFields] = useState(initial.unknownFields);

  // Country tag input
  const [countryInput, setCountryInput] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const countryContainerRef = useRef<HTMLDivElement>(null);
  const countryInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function onMouseDown(e: MouseEvent) {
      if (countryContainerRef.current && !countryContainerRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", onMouseDown);
    return () => document.removeEventListener("mousedown", onMouseDown);
  }, []);

  // ── Emit ──
  function emitWith(overrides: Partial<BuildState> = {}) {
    onChange(buildAudienceJson({
      gender, ageMin, ageMax, residencyTypes, countries,
      relationshipIntentions, maritalStatuses,
      profileCompletionMin, profileCompletionMax,
      lastActiveMode, lastActiveDaysInput,
      accountAgeMode, accountAgeDaysInput,
      verificationMode, subscriptionMode,
      onboardedOnly, unknownFields,
      ...overrides,
    }));
  }

  // ── Gender ──
  function handleGenderChange(val: string) {
    if (val === "__unknown__") return;
    const g = val as Gender;
    setGender(g); setUnknownGender(null);
    emitWith({ gender: g });
  }

  // ── Age validation ──
  const ageMinN = ageMin !== "" ? parseInt(ageMin, 10) : null;
  const ageMaxN = ageMax !== "" ? parseInt(ageMax, 10) : null;
  const ageMinError = ageMinN !== null && !isNaN(ageMinN) && ageMinN < 18 ? "Minimum age is 18" : null;
  const ageMaxError = ageMaxN !== null && !isNaN(ageMaxN) && ageMaxN > 120
    ? "Maximum age is 120"
    : ageMinN !== null && ageMaxN !== null && !isNaN(ageMinN) && !isNaN(ageMaxN) && ageMinN > ageMaxN
    ? "Min age cannot exceed max age" : null;

  // ── Residency ──
  function toggleResidency(type: ResidencyType) {
    const next = new Set(residencyTypes);
    if (next.has(type)) next.delete(type); else next.add(type);
    setResidencyTypes(next); emitWith({ residencyTypes: next });
  }

  // ── Relationship intentions ──
  function toggleIntention(type: RelationshipIntention) {
    const next = new Set(relationshipIntentions);
    if (next.has(type)) next.delete(type); else next.add(type);
    setRelationshipIntentions(next); emitWith({ relationshipIntentions: next });
  }

  // ── Marital status ──
  function toggleMarital(type: MaritalStatus) {
    const next = new Set(maritalStatuses);
    if (next.has(type)) next.delete(type); else next.add(type);
    setMaritalStatuses(next); emitWith({ maritalStatuses: next });
  }

  // ── Profile completion validation ──
  const pcMinN = profileCompletionMin !== "" ? parseInt(profileCompletionMin, 10) : null;
  const pcMaxN = profileCompletionMax !== "" ? parseInt(profileCompletionMax, 10) : null;
  const pcMinError = pcMinN !== null && !isNaN(pcMinN) && pcMinN < 0 ? "Minimum is 0" : null;
  const pcMaxError = pcMaxN !== null && !isNaN(pcMaxN) && pcMaxN > 100
    ? "Maximum is 100"
    : pcMinN !== null && pcMaxN !== null && !isNaN(pcMinN) && !isNaN(pcMaxN) && pcMinN > pcMaxN
    ? "Min cannot exceed max" : null;

  // ── Last active validation ──
  const lastActiveDaysN = lastActiveDaysInput !== "" ? parseInt(lastActiveDaysInput, 10) : null;
  const lastActiveDaysError = lastActiveMode !== "ANY" && lastActiveDaysN !== null && !isNaN(lastActiveDaysN) && lastActiveDaysN < 1
    ? "Days must be at least 1" : null;

  // ── Account age validation ──
  const accountAgeDaysN = accountAgeDaysInput !== "" ? parseInt(accountAgeDaysInput, 10) : null;
  const accountAgeDaysError = accountAgeMode === "OLDER_THAN" && accountAgeDaysN !== null && !isNaN(accountAgeDaysN) && accountAgeDaysN < 1
    ? "Days must be at least 1" : null;

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
    setCountries(next); setCountryInput(""); emitWith({ countries: next });
  }

  function addCountryFromSuggestion(code: string) {
    if (countries.some((t) => t.code === code)) return;
    const next = [...countries, { code, isValid: true }];
    setCountries(next); setCountryInput(""); setShowSuggestions(false);
    emitWith({ countries: next }); countryInputRef.current?.focus();
  }

  function removeCountry(idx: number) {
    const next = countries.filter((_, i) => i !== idx);
    setCountries(next); emitWith({ countries: next });
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

  const previewJson = buildAudienceJson({
    gender, ageMin, ageMax, residencyTypes, countries,
    relationshipIntentions, maritalStatuses,
    profileCompletionMin, profileCompletionMax,
    lastActiveMode, lastActiveDaysInput,
    accountAgeMode, accountAgeDaysInput,
    verificationMode, subscriptionMode,
    onboardedOnly, unknownFields,
  });

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

      {/* ══════════════════════ SUBSECTION 1: Demographics ═════════════════════ */}
      <SubsectionHeader>Demographics</SubsectionHeader>

      {/* Gender */}
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

      {/* Age range */}
      <div>
        <SectionLabel hint="Leave empty for no age restriction. Minimum is 18.">Age range</SectionLabel>
        <div className="flex items-start gap-3">
          <div className="flex-1">
            <input
              type="number" min={18} max={120} value={ageMin}
              onChange={(e) => { setAgeMin(e.target.value); emitWith({ ageMin: e.target.value }); }}
              disabled={locked} placeholder="Min age"
              className={`${INP} w-full ${locked ? DIS : ""} ${ageMinError ? "border-[#C63B4E]" : ""}`}
            />
            {ageMinError && <p className="mt-1 text-xs text-[#C63B4E]">{ageMinError}</p>}
          </div>
          <span className="pt-2.5 text-sm text-[#C6C6CE] select-none">–</span>
          <div className="flex-1">
            <input
              type="number" min={18} max={120} value={ageMax}
              onChange={(e) => { setAgeMax(e.target.value); emitWith({ ageMax: e.target.value }); }}
              disabled={locked} placeholder="Max age"
              className={`${INP} w-full ${locked ? DIS : ""} ${ageMaxError ? "border-[#C63B4E]" : ""}`}
            />
            {ageMaxError && <p className="mt-1 text-xs text-[#C63B4E]">{ageMaxError}</p>}
          </div>
        </div>
      </div>

      {/* Residency type */}
      <div>
        <SectionLabel hint="Leave empty to include all residency types.">Residency type</SectionLabel>
        <CheckboxGroup
          options={[
            { value: "ETHIOPIA", label: "Lives in Ethiopia" },
            { value: "ERITREA", label: "Lives in Eritrea" },
            { value: "DIASPORA", label: "Diaspora (outside ET/ER)" },
          ]}
          selected={residencyTypes}
          onToggle={toggleResidency}
          locked={locked}
        />
      </div>

      {/* Countries */}
      <div>
        <SectionLabel hint="Leave empty to include all countries. Start typing a country name or code. Any valid ISO 3166-1 alpha-2 code is accepted.">
          Countries
        </SectionLabel>
        <div ref={countryContainerRef} className="relative">
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
                  tag.isValid ? "bg-[#EDE9FE] text-[#7C3AED]" : "bg-[#FFF1F2] text-[#C63B4E] border border-[#FECDD3]"
                }`}
              >
                {tag.code}
                {!tag.isValid && <span className="text-[10px] font-sans text-[#C63B4E]">✕ invalid</span>}
                {!locked && (
                  <button type="button" onClick={(e) => { e.stopPropagation(); removeCountry(idx); }} className="hover:opacity-70" aria-label={`Remove ${tag.code}`}>
                    <X className="h-3 w-3" />
                  </button>
                )}
              </span>
            ))}
            {!locked && (
              <input
                ref={countryInputRef} type="text" value={countryInput}
                onChange={(e) => { setCountryInput(e.target.value); setShowSuggestions(true); }}
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

          {showSuggestions && filteredGroups.length > 0 && !locked && (
            <div className="absolute z-50 top-full left-0 right-0 mt-1 bg-white border border-[#E5E5EA] rounded-xl shadow-lg max-h-52 overflow-y-auto">
              {filteredGroups.map((group) => (
                <div key={group.tier}>
                  <div className="px-3 py-1.5 text-[10px] font-semibold text-[#C6C6CE] uppercase tracking-wider bg-[#F7F7FA] sticky top-0">
                    {group.tier}
                  </div>
                  {group.options.map((opt) => (
                    <button
                      key={opt.code} type="button"
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

          {showSuggestions && countryInput.trim() && filteredGroups.length === 0 && !locked && (
            <div className="absolute z-50 top-full left-0 right-0 mt-1 bg-white border border-[#E5E5EA] rounded-xl shadow-lg px-3 py-2.5">
              <p className="text-xs text-[#666672]">
                Press <kbd className="px-1 py-0.5 text-[10px] bg-[#F7F7FA] border border-[#E5E5EA] rounded">Enter</kbd> to add{" "}
                <span className="font-mono font-semibold text-[#7C3AED]">{countryInput.trim().toUpperCase()}</span>
              </p>
            </div>
          )}
        </div>

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

      {/* Relationship intention */}
      <div>
        <SectionLabel hint="Leave empty to include all relationship intentions.">Relationship intention</SectionLabel>
        <CheckboxGroup
          options={[
            { value: "MARRIAGE", label: "Marriage" },
            { value: "SERIOUS_RELATIONSHIP", label: "Serious relationship" },
            { value: "LONG_TERM", label: "Long-term" },
            { value: "FRIENDSHIP", label: "Friendship" },
            { value: "NOT_SURE_YET", label: "Not sure yet" },
          ]}
          selected={relationshipIntentions}
          onToggle={toggleIntention}
          locked={locked}
        />
      </div>

      {/* Marital status */}
      <div>
        <SectionLabel hint="Leave empty to include all marital statuses.">Marital status</SectionLabel>
        <CheckboxGroup
          options={[
            { value: "NEVER_MARRIED", label: "Never married" },
            { value: "DIVORCED", label: "Divorced" },
            { value: "WIDOWED", label: "Widowed" },
            { value: "SEPARATED", label: "Separated" },
          ]}
          selected={maritalStatuses}
          onToggle={toggleMarital}
          locked={locked}
        />
      </div>

      {/* Profile completion */}
      <div>
        <SectionLabel hint="Target users by profile completeness. Use Max (e.g. 50) to target users with incomplete profiles. Score range: 0–100.">
          Profile completion score
        </SectionLabel>
        <div className="flex items-start gap-3">
          <div className="flex-1">
            <input
              type="number" min={0} max={100} value={profileCompletionMin}
              onChange={(e) => { setProfileCompletionMin(e.target.value); emitWith({ profileCompletionMin: e.target.value }); }}
              disabled={locked} placeholder="Min %"
              className={`${INP} w-full ${locked ? DIS : ""} ${pcMinError ? "border-[#C63B4E]" : ""}`}
            />
            {pcMinError && <p className="mt-1 text-xs text-[#C63B4E]">{pcMinError}</p>}
          </div>
          <span className="pt-2.5 text-sm text-[#C6C6CE] select-none">–</span>
          <div className="flex-1">
            <input
              type="number" min={0} max={100} value={profileCompletionMax}
              onChange={(e) => { setProfileCompletionMax(e.target.value); emitWith({ profileCompletionMax: e.target.value }); }}
              disabled={locked} placeholder="Max %"
              className={`${INP} w-full ${locked ? DIS : ""} ${pcMaxError ? "border-[#C63B4E]" : ""}`}
            />
            {pcMaxError && <p className="mt-1 text-xs text-[#C63B4E]">{pcMaxError}</p>}
          </div>
        </div>
      </div>

      {/* ═══════════════════ SUBSECTION 2: Activity & Account ══════════════════ */}
      <SubsectionHeader>Activity &amp; Account</SubsectionHeader>

      {/* Last active */}
      <div>
        <SectionLabel hint="Target recently active users or dormant users for win-back campaigns.">Last active</SectionLabel>
        <select
          value={lastActiveMode}
          onChange={(e) => {
            const mode = e.target.value as LastActiveMode;
            setLastActiveMode(mode);
            if (mode === "ANY") { setLastActiveDaysInput(""); emitWith({ lastActiveMode: mode, lastActiveDaysInput: "" }); }
            else emitWith({ lastActiveMode: mode });
          }}
          disabled={locked}
          className={`${SEL} ${locked ? DIS : "cursor-pointer"} mb-2`}
        >
          <option value="ANY">Any activity</option>
          <option value="ACTIVE_LAST">Active within last N days</option>
          <option value="DORMANT_FOR">Not active for at least N days</option>
        </select>
        {lastActiveMode !== "ANY" && (
          <div className="flex items-center gap-2">
            <input
              type="number" min={1} value={lastActiveDaysInput}
              onChange={(e) => { setLastActiveDaysInput(e.target.value); emitWith({ lastActiveDaysInput: e.target.value }); }}
              disabled={locked} placeholder="days"
              className={`${INP} w-28 ${locked ? DIS : ""} ${lastActiveDaysError ? "border-[#C63B4E]" : ""}`}
            />
            <span className="text-sm text-[#666672]">days</span>
          </div>
        )}
        {lastActiveDaysError && <p className="mt-1 text-xs text-[#C63B4E]">{lastActiveDaysError}</p>}
      </div>

      {/* Account age */}
      <div>
        <SectionLabel hint="Target established users (e.g. older than 14 days) to exclude brand new accounts.">Account age</SectionLabel>
        <select
          value={accountAgeMode}
          onChange={(e) => {
            const mode = e.target.value as AccountAgeMode;
            setAccountAgeMode(mode);
            if (mode === "ANY") { setAccountAgeDaysInput(""); emitWith({ accountAgeMode: mode, accountAgeDaysInput: "" }); }
            else emitWith({ accountAgeMode: mode });
          }}
          disabled={locked}
          className={`${SEL} ${locked ? DIS : "cursor-pointer"} mb-2`}
        >
          <option value="ANY">Any account age</option>
          <option value="OLDER_THAN">Account older than N days</option>
        </select>
        {accountAgeMode === "OLDER_THAN" && (
          <div className="flex items-center gap-2">
            <input
              type="number" min={1} value={accountAgeDaysInput}
              onChange={(e) => { setAccountAgeDaysInput(e.target.value); emitWith({ accountAgeDaysInput: e.target.value }); }}
              disabled={locked} placeholder="days"
              className={`${INP} w-28 ${locked ? DIS : ""} ${accountAgeDaysError ? "border-[#C63B4E]" : ""}`}
            />
            <span className="text-sm text-[#666672]">days old</span>
          </div>
        )}
        {accountAgeDaysError && <p className="mt-1 text-xs text-[#C63B4E]">{accountAgeDaysError}</p>}
      </div>

      {/* ═════════════════ SUBSECTION 3: Status & Subscription ════════════════ */}
      <SubsectionHeader>Status &amp; Subscription</SubsectionHeader>

      {/* Verification — three-way */}
      <div>
        <SectionLabel hint="Verified users have completed identity verification. Unverified includes NOT_STARTED, PENDING, FAILED, and MANUAL_REVIEW.">
          Verification status
        </SectionLabel>
        <SegmentedControl
          options={[
            { value: "ALL", label: "All users" },
            { value: "VERIFIED", label: "Verified only" },
            { value: "UNVERIFIED", label: "Unverified only" },
          ]}
          value={verificationMode}
          onChange={(v) => { setVerificationMode(v); emitWith({ verificationMode: v }); }}
          disabled={locked}
        />
      </div>

      {/* Subscription — three-way */}
      <div>
        <SectionLabel hint="Premium users have an active or grace-period subscription. Non-premium users have no active subscription.">
          Subscription status
        </SectionLabel>
        <SegmentedControl
          options={[
            { value: "ALL", label: "All users" },
            { value: "PREMIUM", label: "Premium only" },
            { value: "NON_PREMIUM", label: "Non-premium only" },
          ]}
          value={subscriptionMode}
          onChange={(v) => { setSubscriptionMode(v); emitWith({ subscriptionMode: v }); }}
          disabled={locked}
        />
      </div>

      {/* Onboarded toggle */}
      <div className="border border-[#E5E5EA] rounded-xl px-4">
        <ToggleRow
          label="Onboarded users only"
          hint="Only send to users who have completed the onboarding flow (profile set up)."
          checked={onboardedOnly}
          onChange={(v) => { setOnboardedOnly(v); emitWith({ onboardedOnly: v }); }}
          locked={locked}
        />
      </div>

      {/* Unknown fields */}
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

      {/* Live JSON preview */}
      <div>
        <p className="text-xs font-medium text-[#666672] mb-1.5">Preview</p>
        <pre className="text-xs font-mono bg-[#F7F7FA] border border-[#E5E5EA] rounded-lg px-3 py-2.5 overflow-x-auto whitespace-pre-wrap break-all text-[#17171B] leading-relaxed">
          {previewJson}
        </pre>
      </div>
    </div>
  );
}
