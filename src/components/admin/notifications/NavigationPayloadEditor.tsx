"use client";

import { useState } from "react";
import { Info, Plus, Trash2, Code2, List, Lock } from "lucide-react";

// ── Screen catalogue ─────────────────────────────────────────────────────────
const SCREEN_GROUPS = [
  {
    group: "No deep-link",
    options: [{ value: "none", label: "No deep-link (open home)" }],
  },
  {
    group: "Main tabs",
    options: [
      { value: "(tabs)/index", label: "Discovery / swipe" },
      { value: "(tabs)/likes", label: "Likes" },
      { value: "(tabs)/matches", label: "Matches list" },
      { value: "(tabs)/messages", label: "Inbox" },
      { value: "(tabs)/profile", label: "Your profile" },
    ],
  },
  {
    group: "App screens",
    options: [
      { value: "chat", label: "Individual chat thread" },
      { value: "user-profile", label: "View another user's profile" },
      { value: "edit-profile", label: "Edit your profile" },
      { value: "preferences", label: "Discovery preferences" },
      { value: "settings", label: "App settings" },
      { value: "verify-identity", label: "Identity verification" },
      { value: "boost", label: "Boost screen" },
      { value: "premium", label: "Premium upgrade / paywall" },
      { value: "credits-shop", label: "Credits purchase" },
      { value: "balances", label: "Balance overview" },
      { value: "promotions", label: "Active promotions" },
      { value: "manual-payment", label: "Manual payment" },
      { value: "order-status", label: "Order status" },
      { value: "payment-activity", label: "Payment history" },
      { value: "blocked-users", label: "Blocked users list" },
      { value: "support-conversation", label: "User → support chat" },
    ],
  },
] as const;

const ALL_KNOWN_SCREENS = new Set<string>(
  SCREEN_GROUPS.flatMap((g) => g.options.map((o) => o.value))
);

// ── Param hints per screen ────────────────────────────────────────────────────
interface ParamHint {
  key: string;
  type: string;
  required: boolean;
  description: string;
  suggestedValues?: string[];
  validValues?: string[]; // strict enum — validation enforced
}

const PARAM_HINTS: Record<string, ParamHint[]> = {
  chat: [
    { key: "matchId", type: "string (UUID)", required: true, description: "The match/conversation ID to open." },
  ],
  "user-profile": [
    { key: "userId", type: "string (UUID)", required: true, description: "The user profile ID to view." },
  ],
  premium: [
    { key: "source", type: "string", required: false, description: "Attribution source.", suggestedValues: ["push_campaign"] },
    { key: "promoCode", type: "string", required: false, description: "Promo code to pre-apply on the upgrade screen." },
  ],
  boost: [
    { key: "source", type: "string", required: false, description: "Attribution source.", suggestedValues: ["push_campaign"] },
  ],
  "credits-shop": [
    { key: "source", type: "string", required: false, description: "Attribution source.", suggestedValues: ["push_campaign"] },
  ],
  promotions: [
    { key: "promotionId", type: "string (UUID)", required: false, description: "Highlight a specific promotion." },
  ],
  "edit-profile": [
    { key: "focus", type: "string", required: false, description: "Which section to scroll to.", validValues: ["photos", "bio", "prompts"] },
  ],
  "(tabs)/matches": [
    { key: "tab", type: "string", required: false, description: "Which tab to open.", validValues: ["matches", "likes_received"] },
  ],
};

/** Screens where no params are ever needed */
const NO_PARAMS_SCREENS = new Set([
  "verify-identity", "support-conversation", "settings", "preferences",
  "balances", "manual-payment", "order-status", "payment-activity",
  "blocked-users", "(tabs)/index", "(tabs)/likes", "(tabs)/messages", "(tabs)/profile",
]);

// ── Validation ────────────────────────────────────────────────────────────────
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

interface ParamRow { key: string; value: string; }

function computeParamErrors(screen: string, params: ParamRow[]): Record<string, string> {
  const errors: Record<string, string> = {};
  const map = Object.fromEntries(params.filter((p) => p.key.trim()).map((p) => [p.key.trim(), p.value]));

  if (screen === "chat") {
    if (!map.matchId) errors.matchId = "matchId is required";
    else if (!UUID_RE.test(map.matchId)) errors.matchId = "matchId must be a valid UUID";
  }
  if (screen === "user-profile") {
    if (!map.userId) errors.userId = "userId is required";
    else if (!UUID_RE.test(map.userId)) errors.userId = "userId must be a valid UUID";
  }
  if (screen === "edit-profile" && map.focus && !["photos", "bio", "prompts"].includes(map.focus)) {
    errors.focus = 'Must be one of: "photos", "bio", "prompts"';
  }
  if (screen === "(tabs)/matches" && map.tab && !["matches", "likes_received"].includes(map.tab)) {
    errors.tab = 'Must be one of: "matches", "likes_received"';
  }
  return errors;
}

// ── Serialization helpers ─────────────────────────────────────────────────────
function parseJsonValue(jsonStr: string): { screen: string; params: ParamRow[]; isUnknown: boolean } {
  const empty = { screen: "none", params: [] as ParamRow[], isUnknown: false };
  if (!jsonStr?.trim() || jsonStr.trim() === "{}") return empty;
  try {
    const obj = JSON.parse(jsonStr) as Record<string, unknown>;
    if (!obj.screen || typeof obj.screen !== "string") return empty;
    const screen = obj.screen;
    const raw =
      obj.params && typeof obj.params === "object" && !Array.isArray(obj.params)
        ? (obj.params as Record<string, unknown>)
        : {};
    const params: ParamRow[] = Object.entries(raw).map(([k, v]) => ({
      key: k,
      value: typeof v === "string" ? v : JSON.stringify(v),
    }));
    return { screen, params, isUnknown: !ALL_KNOWN_SCREENS.has(screen) };
  } catch {
    return empty;
  }
}

function buildJson(screen: string, params: ParamRow[]): string {
  if (screen === "none") return "{}";
  const paramsObj: Record<string, string> = {};
  for (const row of params) {
    if (row.key.trim()) paramsObj[row.key.trim()] = row.value;
  }
  const payload: Record<string, unknown> = { screen };
  if (Object.keys(paramsObj).length > 0) payload.params = paramsObj;
  return JSON.stringify(payload, null, 2);
}

// ── Public validation helper (for zod superRefine) ────────────────────────────
export function validateNavigationPayload(jsonStr: string): string | null {
  if (!jsonStr?.trim() || jsonStr.trim() === "{}") return null;
  let obj: Record<string, unknown>;
  try { obj = JSON.parse(jsonStr); } catch { return "Navigation payload must be valid JSON"; }
  if (!obj.screen || obj.screen === "none") return null;
  const params = (obj.params ?? {}) as Record<string, string>;
  if (obj.screen === "chat") {
    if (!params.matchId) return "matchId is required for the chat screen";
    if (!UUID_RE.test(params.matchId)) return "matchId must be a valid UUID";
  }
  if (obj.screen === "user-profile") {
    if (!params.userId) return "userId is required for the user-profile screen";
    if (!UUID_RE.test(params.userId)) return "userId must be a valid UUID";
  }
  if (obj.screen === "edit-profile" && params.focus && !["photos", "bio", "prompts"].includes(params.focus)) {
    return 'focus must be one of: "photos", "bio", "prompts"';
  }
  if (obj.screen === "(tabs)/matches" && params.tab && !["matches", "likes_received"].includes(params.tab)) {
    return 'tab must be one of: "matches", "likes_received"';
  }
  return null;
}

// ── Component ─────────────────────────────────────────────────────────────────
export interface NavigationPayloadEditorProps {
  /** Serialised JSON string. "" or "{}" = no deep-link. */
  value: string;
  onChange: (value: string) => void;
  /** Validation error surfaced from the parent form (shown under the screen dropdown) */
  error?: string;
  readOnly?: boolean;
  /** When set (e.g. "SENDING"), shows a locked banner */
  lockedStatus?: string;
}

export function NavigationPayloadEditor({
  value,
  onChange,
  error,
  readOnly,
  lockedStatus,
}: NavigationPayloadEditorProps) {
  const locked = readOnly || !!lockedStatus;

  // Initialise state lazily from the incoming JSON string (once, on first render)
  const [screen, setScreen] = useState(() => parseJsonValue(value).screen);
  const [params, setParams] = useState<ParamRow[]>(() => parseJsonValue(value).params);
  const [isUnknown, setIsUnknown] = useState(() => parseJsonValue(value).isUnknown);
  const [rawMode, setRawMode] = useState(false);
  const [rawText, setRawText] = useState(() =>
    value?.trim() && value.trim() !== "{}" ? value : "{}"
  );
  const [rawError, setRawError] = useState<string | null>(null);

  function emit(s: string, p: ParamRow[]) {
    const json = buildJson(s, p);
    setRawText(json);
    onChange(json);
  }

  function handleScreenChange(newScreen: string) {
    if (newScreen === "__unknown__") return;
    setIsUnknown(false);
    setScreen(newScreen);
    // Pre-seed required param rows so the admin sees them immediately
    const required = (PARAM_HINTS[newScreen] ?? [])
      .filter((h) => h.required)
      .map((h) => ({ key: h.key, value: "" }));
    setParams(required);
    emit(newScreen, required);
  }

  function updateParam(idx: number, field: "key" | "value", val: string) {
    const next = params.map((p, i) => (i === idx ? { ...p, [field]: val } : p));
    setParams(next);
    emit(screen, next);
  }

  function addParam(suggestedKey = "") {
    const next = [...params, { key: suggestedKey, value: "" }];
    setParams(next);
    emit(screen, next);
  }

  function removeParam(idx: number) {
    const next = params.filter((_, i) => i !== idx);
    setParams(next);
    emit(screen, next);
  }

  function handleRawChange(raw: string) {
    setRawText(raw);
    try { JSON.parse(raw); setRawError(null); onChange(raw); }
    catch { setRawError("Invalid JSON"); }
  }

  function applyRaw() {
    try {
      const parsed = parseJsonValue(rawText);
      setScreen(parsed.screen);
      setParams(parsed.params);
      setIsUnknown(parsed.isUnknown);
      setRawError(null);
      setRawMode(false);
      onChange(rawText);
    } catch { setRawError("Cannot apply — fix the JSON first"); }
  }

  const hints = PARAM_HINTS[screen] ?? [];
  const noParamsNeeded = NO_PARAMS_SCREENS.has(screen);
  const knownKeys = new Set(hints.map((h) => h.key));
  const existingKeys = new Set(params.map((p) => p.key.trim()).filter(Boolean));
  const unaddedOptional = hints.filter((h) => !h.required && !existingKeys.has(h.key));
  const unknownKeyWarnings = params
    .map((p) => p.key.trim())
    .filter((k) => k && !knownKeys.has(k));
  const paramErrors = computeParamErrors(screen, params);

  // Required params not yet present
  const missingRequired = hints
    .filter((h) => h.required && !existingKeys.has(h.key));

  const SEL = "w-full px-3 py-2 text-sm border border-[#E5E5EA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/30 focus:border-[#7C3AED] bg-white";
  const INP = "px-3 py-1.5 text-sm border border-[#E5E5EA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/30 focus:border-[#7C3AED] bg-white";

  return (
    <div className="space-y-4">

      {/* Locked banner */}
      {lockedStatus && (
        <div className="flex items-center gap-2 px-3 py-2.5 text-sm text-[#7C3AED] bg-[#F5F3FF] border border-[#DDD6FE] rounded-lg">
          <Lock className="h-4 w-4 shrink-0" />
          Campaign content is locked because status is <strong className="font-semibold">{lockedStatus}</strong>.
        </div>
      )}

      {/* Screen dropdown */}
      <div>
        <label className="block text-xs font-medium text-[#17171B] mb-1.5">
          Deep-link screen <span className="text-[#C63B4E]">*</span>
        </label>

        {isUnknown && (
          <div className="flex items-center gap-1.5 mb-1.5 px-2.5 py-1.5 text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg">
            <Info className="h-3.5 w-3.5 shrink-0" />
            Screen &ldquo;{screen}&rdquo; is not recognized. Select a valid screen.
          </div>
        )}

        <select
          value={isUnknown ? "__unknown__" : screen}
          onChange={(e) => handleScreenChange(e.target.value)}
          disabled={locked}
          className={`${SEL} ${locked ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}`}
        >
          {isUnknown && (
            <option value="__unknown__" disabled>Unknown: {screen}</option>
          )}
          {SCREEN_GROUPS.map((group) => (
            <optgroup key={group.group} label={group.group}>
              {group.options.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </optgroup>
          ))}
        </select>

        {error && <p className="mt-1 text-xs text-[#C63B4E]">{error}</p>}
      </div>

      {/* Params section — only for real screens */}
      {screen !== "none" && (
        <div className="border border-[#E5E5EA] rounded-xl overflow-hidden">

          {/* Section header */}
          <div className="flex items-center justify-between px-4 py-2.5 bg-[#F7F7FA] border-b border-[#E5E5EA]">
            <span className="text-xs font-semibold text-[#17171B]">Screen parameters</span>
            {!locked && (
              <button
                type="button"
                onClick={() => setRawMode((v) => !v)}
                className="flex items-center gap-1 text-xs text-[#666672] hover:text-[#7C3AED] transition-colors"
              >
                {rawMode ? <List className="h-3.5 w-3.5" /> : <Code2 className="h-3.5 w-3.5" />}
                {rawMode ? "Structured" : "Raw JSON"}
              </button>
            )}
          </div>

          <div className="p-4 space-y-3">

            {/* ── Hints panel (always visible) ── */}
            {noParamsNeeded ? (
              <div className="flex items-start gap-2 text-xs text-[#666672]">
                <Info className="h-3.5 w-3.5 mt-0.5 shrink-0 text-[#7C3AED]" />
                No parameters needed for this screen.
              </div>
            ) : hints.length > 0 ? (
              <div className="bg-[#F5F3FF] border border-[#EDE9FE] rounded-lg px-3.5 py-3 space-y-2">
                <p className="text-xs font-semibold text-[#7C3AED]">Valid parameters for this screen</p>
                {hints.map((h) => (
                  <div key={h.key} className="text-xs leading-relaxed">
                    <code className="font-mono text-[#7C3AED] bg-[#EDE9FE] px-1 py-0.5 rounded">{h.key}</code>
                    {" "}
                    <span className="text-[#666672]">({h.type})</span>
                    {h.required && <span className="text-[#C63B4E] font-semibold"> · required</span>}
                    <span className="text-[#17171B]"> — {h.description}</span>
                    {(h.suggestedValues ?? h.validValues) && (
                      <span className="text-[#666672]">
                        {" "}{h.validValues ? "Valid values:" : "Suggested:"}{" "}
                        {(h.validValues ?? h.suggestedValues)!.map((v, i) => (
                          <span key={v}>{i > 0 && ", "}<code className="font-mono bg-[#F7F7FA] px-1 rounded">&quot;{v}&quot;</code></span>
                        ))}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-start gap-2 text-xs text-[#666672]">
                <Info className="h-3.5 w-3.5 mt-0.5 shrink-0 text-[#7C3AED]" />
                No documented parameters for this screen.
              </div>
            )}

            {/* ── Missing required params warning ── */}
            {missingRequired.length > 0 && !rawMode && (
              <div className="flex items-start gap-2 text-xs text-[#C63B4E] bg-[#FFF1F2] border border-[#FECDD3] rounded-lg px-3 py-2">
                <Info className="h-3.5 w-3.5 mt-0.5 shrink-0" />
                <span>
                  Required {missingRequired.length === 1 ? "parameter" : "parameters"} missing:{" "}
                  {missingRequired.map((h, i) => (
                    <span key={h.key}>{i > 0 && ", "}<code className="font-mono">{h.key}</code></span>
                  ))}
                  {". "}
                  {!locked && (
                    <button
                      type="button"
                      onClick={() => {
                        const toAdd = missingRequired.filter((h) => !existingKeys.has(h.key));
                        const next = [...params, ...toAdd.map((h) => ({ key: h.key, value: "" }))];
                        setParams(next);
                        emit(screen, next);
                      }}
                      className="underline hover:no-underline"
                    >
                      Add now
                    </button>
                  )}
                </span>
              </div>
            )}

            {/* ── Unknown param key warnings ── */}
            {unknownKeyWarnings.length > 0 && (
              <div className="flex items-start gap-2 text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
                <Info className="h-3.5 w-3.5 mt-0.5 shrink-0" />
                <span>
                  Unknown {unknownKeyWarnings.length === 1 ? "key" : "keys"}:{" "}
                  {unknownKeyWarnings.map((k, i) => (
                    <span key={k}>{i > 0 && ", "}<code className="font-mono">&quot;{k}&quot;</code></span>
                  ))}
                  {" "}— {unknownKeyWarnings.length === 1 ? "this param" : "these params"} may not be recognized by the client.
                </span>
              </div>
            )}

            {/* ── Raw JSON mode ── */}
            {rawMode ? (
              <div>
                <textarea
                  value={rawText}
                  onChange={(e) => handleRawChange(e.target.value)}
                  rows={5}
                  disabled={locked}
                  spellCheck={false}
                  className={`w-full px-3 py-2 text-sm font-mono border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/30 ${
                    rawError ? "border-[#C63B4E]" : "border-[#E5E5EA] focus:border-[#7C3AED]"
                  } ${locked ? "opacity-60 cursor-not-allowed bg-[#F7F7FA]" : "bg-white"}`}
                />
                {rawError && <p className="mt-1 text-xs text-[#C63B4E]">{rawError}</p>}
                {!locked && (
                  <button
                    type="button"
                    onClick={applyRaw}
                    disabled={!!rawError}
                    className="mt-2 px-3 py-1.5 text-xs font-medium text-white bg-[#7C3AED] hover:bg-[#6D28D9] rounded-lg disabled:opacity-50"
                  >
                    Apply JSON
                  </button>
                )}
              </div>
            ) : (
              /* ── Structured key-value editor ── */
              <div className="space-y-2">
                {params.length === 0 && (
                  <p className="text-xs text-[#666672] italic">
                    {locked ? "No parameters configured." : "No parameters yet."}
                  </p>
                )}

                {params.map((row, idx) => {
                  const rowError = paramErrors[row.key.trim()];
                  return (
                    <div key={idx} className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <input
                          value={row.key}
                          onChange={(e) => updateParam(idx, "key", e.target.value)}
                          disabled={locked}
                          placeholder="key"
                          spellCheck={false}
                          className={`w-36 shrink-0 ${INP} font-mono text-xs ${locked ? "opacity-60 cursor-not-allowed" : ""}`}
                        />
                        <span className="text-[#C6C6CE] select-none">:</span>
                        <input
                          value={row.value}
                          onChange={(e) => updateParam(idx, "value", e.target.value)}
                          disabled={locked}
                          placeholder="value"
                          className={`flex-1 ${INP} ${locked ? "opacity-60 cursor-not-allowed" : ""} ${rowError ? "border-[#C63B4E]" : ""}`}
                        />
                        {!locked && (
                          <button
                            type="button"
                            onClick={() => removeParam(idx)}
                            className="p-1.5 text-[#C6C6CE] hover:text-[#C63B4E] transition-colors"
                            title="Remove"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        )}
                      </div>
                      {rowError && (
                        <p className="text-xs text-[#C63B4E] pl-[152px]">{rowError}</p>
                      )}
                    </div>
                  );
                })}

                {!locked && (
                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => addParam()}
                      className="flex items-center gap-1 text-xs text-[#7C3AED] hover:underline"
                    >
                      <Plus className="h-3.5 w-3.5" /> Add parameter
                    </button>
                    {unaddedOptional.map((h) => (
                      <button
                        key={h.key}
                        type="button"
                        onClick={() => addParam(h.key)}
                        title={h.description}
                        className="text-xs text-[#666672] border border-[#E5E5EA] hover:border-[#7C3AED] hover:text-[#7C3AED] px-2 py-0.5 rounded-full transition-colors font-mono"
                      >
                        + {h.key}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Live JSON preview ── */}
      <div>
        <p className="text-xs font-medium text-[#666672] mb-1.5">Preview</p>
        <pre className="text-xs font-mono bg-[#F7F7FA] border border-[#E5E5EA] rounded-lg px-3 py-2.5 overflow-x-auto whitespace-pre-wrap break-all text-[#17171B] leading-relaxed">
          {buildJson(screen, params)}
        </pre>
      </div>
    </div>
  );
}
