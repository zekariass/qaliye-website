// ── Enums ─────────────────────────────────────────────────────────────────────

export type RequestStatus =
  | "OPEN"
  | "ON_HOLD"
  | "MATCHED"
  | "COMPLETED"
  | "CANCELLED"
  | "EXPIRED";

export type IntroStatus =
  | "PROPOSED"
  | "DECLINED"
  | "MATCHED"
  | "CANCELLED"
  | "EXPIRED";

export type Decision = "PENDING" | "INTERESTED" | "NOT_INTERESTED";

export const REQUEST_STATUSES: RequestStatus[] = [
  "OPEN",
  "ON_HOLD",
  "MATCHED",
  "COMPLETED",
  "CANCELLED",
  "EXPIRED",
];

export const INTRO_STATUSES: IntroStatus[] = [
  "PROPOSED",
  "MATCHED",
  "DECLINED",
  "CANCELLED",
  "EXPIRED",
];

// ── Children preference enums (lowercase per API spec) ────────────────────────

export type HasChildrenPref = "any" | "yes" | "no";
export type WantsChildrenPref =
  | "any"
  | "yes"
  | "no"
  | "not_sure"
  | "open_to_discussion";

// ── Override param enum sets ───────────────────────────────────────────────────

export const MARITAL_STATUSES = [
  "NEVER_MARRIED",
  "DIVORCED",
  "WIDOWED",
  "SEPARATED",
] as const;
export type MaritalStatus = (typeof MARITAL_STATUSES)[number];

export const SMOKING_PREFS = [
  "NO",
  "YES",
  "OCCASIONALLY",
  "TRYING_TO_QUIT",
] as const;
export type SmokingPref = (typeof SMOKING_PREFS)[number];

export const DRINKING_PREFS = ["NO", "SOCIALLY", "OCCASIONALLY", "YES"] as const;
export type DrinkingPref = (typeof DRINKING_PREFS)[number];

export const RELIGION_PREFS = [
  "ORTHODOX_CHRISTIAN",
  "PROTESTANT",
  "CATHOLIC",
  "MUSLIM",
  "JEWISH",
  "HINDU",
  "BUDDHIST",
  "SPIRITUAL",
  "AGNOSTIC",
  "ATHEIST",
  "OTHER",
] as const;

export const EDUCATION_LEVELS = [
  "HIGH_SCHOOL",
  "DIPLOMA",
  "BACHELORS",
  "MASTERS",
  "DOCTORATE",
  "OTHER",
] as const;

// ── Live matchmaking preferences (requests no longer snapshot) ────────────────

export interface MatchmakingPreferences {
  id?: string;
  user_id?: string;
  version?: number;
  gender?: string | null;
  min_age?: number | null;
  max_age?: number | null;
  min_height_cm?: number | null;
  max_height_cm?: number | null;
  specific_country_codes?: string[];
  has_children_preference?: HasChildrenPref;
  wants_children_preference?: WantsChildrenPref;
  religion_preferences?: string[];
  education_levels?: string[];
  marital_statuses?: string[];
  smoking_preferences?: string[];
  drinking_preferences?: string[];
  language_preference_ids?: string[];
  ethnicity_preference_ids?: string[];
  // Matchmaking-specific self-attributes (alignment dims)
  marriage_timeline?: string | null;
  long_distance_relationship?: string | null;
  family_involvement?: string | null;
  religion_important?: string | null;
  willing_to_relocate?: string | null;
  user_notes?: string | null;
  matchmaker_notes?: string | null;
  [key: string]: unknown;
}

// ── Override params (admin candidate-search overrides — never persisted) ──────

export interface OverrideParams {
  min_age?: number;
  max_age?: number;
  min_height_cm?: number;
  max_height_cm?: number;
  specific_country_codes?: string[];
  has_children_preference?: HasChildrenPref;
  wants_children_preference?: WantsChildrenPref;
  religion_preferences?: string[];
  education_levels?: string[];
  marital_statuses?: string[];
  smoking_preferences?: string[];
  drinking_preferences?: string[];
  language_preference_ids?: string[];
  ethnicity_preference_ids?: string[];
}

// ── Profile card (embedded in request rows / candidate views / intro rows) ────

export interface ProfileCard {
  user_id?: string;
  display_name?: string;
  age?: number | null;
  gender?: string | null;
  city?: string | null;
  region?: string | null;
  country_code?: string | null;
  country_name?: string | null;
  occupation?: string | null;
  is_verified?: boolean;
  primary_photo_url?: string | null;
  last_active_at?: string | null;
}

// ── Domain objects ─────────────────────────────────────────────────────────────

export interface MmRequest {
  id: string;
  user_id: string;
  matchmaking_preferences_id?: string;
  status: RequestStatus;
  request_charge_idempotency_key?: string | null;
  contact_phone?: string | null;
  /** Live PROPOSED introduction involving this request, if any. */
  active_introduction_id?: string | null;
  created_at: string;
  expires_at?: string | null;
  completed_at?: string | null;
  cancelled_at?: string | null;
  updated_at?: string | null;
  /** Present when the queue row embeds the requester's profile card. */
  profile?: ProfileCard | null;
}

/** GET /requests/{id} — request + requester profile + live preferences. */
export interface MmRequestDetail {
  request: MmRequest;
  profile: ProfileCard | null;
  preferences: MatchmakingPreferences | null;
  introductions: Introduction[];
}

export interface Note {
  id: string;
  request_id: string;
  admin_user_id: string;
  note: string;
  created_at: string;
}

// ── Compatibility ──────────────────────────────────────────────────────────────

export interface MatchDetail {
  dimension: string;
  matched: boolean;
  label: string;
}

export interface MatchScore {
  forward_percentage: number;
  reverse_percentage: number;
  overall_percentage: number;
  details: MatchDetail[];
}

/** Ranked candidate result from POST .../candidates/search. */
export interface CandidateMatchView {
  request: MmRequest;
  profile: ProfileCard | null;
  preferences: MatchmakingPreferences | null;
  match: MatchScore;
}

// ── Introductions ──────────────────────────────────────────────────────────────

export interface Introduction {
  id: string;
  requester_request_id: string;
  candidate_request_id: string;
  initiated_by_admin_user_id?: string | null;
  forward_percentage?: number | null;
  reverse_percentage?: number | null;
  overall_percentage?: number | null;
  match_details?: MatchDetail[];
  reason?: string | null;
  requester_decision: Decision;
  candidate_decision: Decision;
  requester_decided_at?: string | null;
  candidate_decided_at?: string | null;
  status: IntroStatus;
  decision_expires_at?: string | null;
  match_id?: string | null;
  proposed_at?: string | null;
  completed_at?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
}

/** List/detail rows may embed each side's profile card. */
export interface IntroductionRow extends Introduction {
  requester?: ProfileCard | null;
  candidate?: ProfileCard | null;
}

// ── Dashboard stats ────────────────────────────────────────────────────────────

export interface MmStats {
  requestsByStatus: Record<string, number>;
  introductionsByStatus: Record<string, number>;
  awaitingDecisions: number | null;
  proposalsExpiringSoon: number | null;
  totalMatches: number | null;
}

// ── Pagination ─────────────────────────────────────────────────────────────────

export interface Page<T> {
  items: T[];
  /** null when the backend returned a bare array (no envelope). */
  total: number | null;
  page: number;
  size: number;
}

// ── Normalizers (backend fields seen in both snake_case and camelCase) ─────────

type Raw = Record<string, unknown>;

function asObj(v: unknown): Raw | null {
  return v && typeof v === "object" && !Array.isArray(v) ? (v as Raw) : null;
}

function pick(obj: Raw | null | undefined, ...keys: string[]): unknown {
  if (!obj) return undefined;
  for (const k of keys) {
    if (obj[k] !== undefined && obj[k] !== null) return obj[k];
  }
  return undefined;
}

function num(v: unknown): number | null {
  const n = Number(v);
  return v === null || v === undefined || v === "" || Number.isNaN(n) ? null : n;
}

function str(v: unknown): string | null {
  return typeof v === "string" && v.length > 0 ? v : null;
}

function strArr(v: unknown): string[] | undefined {
  if (Array.isArray(v)) return v.map((x) => String(x));
  return undefined;
}

function bool(v: unknown): boolean | undefined {
  return typeof v === "boolean" ? v : undefined;
}

export function asArray<T>(json: unknown): T[] {
  if (Array.isArray(json)) return json as T[];
  const obj = asObj(json);
  if (obj) {
    for (const v of Object.values(obj)) {
      if (Array.isArray(v)) return v as T[];
    }
  }
  return [];
}

/**
 * Accepts paged envelopes and bare arrays. Envelope row keys per the admin API
 * are resource-named (`requests`, `introductions`), but `items`/`content`/`data`
 * are also tolerated.
 */
export function asPage<T>(json: unknown, fallbackSize: number): Page<T> {
  if (Array.isArray(json)) {
    return { items: json as T[], total: null, page: 0, size: fallbackSize };
  }
  const obj = asObj(json);
  if (obj) {
    let itemsRaw: unknown =
      obj.items ?? obj.content ?? obj.data ?? obj.results ??
      obj.requests ?? obj.introductions;
    if (!Array.isArray(itemsRaw)) {
      // Fall back to the first array-valued property (resource-named keys).
      itemsRaw = Object.values(obj).find((v) => Array.isArray(v));
    }
    const items = asArray<T>(itemsRaw);
    const total = num(obj.total ?? obj.total_items ?? obj.totalItems ?? obj.count);
    const page = num(obj.page) ?? 0;
    const size = num(obj.size ?? obj.page_size ?? obj.pageSize) ?? fallbackSize;
    return { items, total, page, size };
  }
  return { items: [], total: null, page: 0, size: fallbackSize };
}

export function normProfile(raw: unknown): ProfileCard | null {
  const o = asObj(raw);
  if (!o) return null;
  return {
    user_id: str(pick(o, "user_id", "userId")) ?? undefined,
    display_name: str(pick(o, "display_name", "displayName", "name")) ?? undefined,
    age: num(pick(o, "age")),
    gender: str(pick(o, "gender")),
    city: str(pick(o, "city")),
    region: str(pick(o, "region", "state")),
    country_code: str(pick(o, "country_code", "countryCode")),
    country_name: str(pick(o, "country_name", "countryName")),
    occupation: str(pick(o, "occupation", "job_title", "jobTitle", "profession")),
    is_verified: bool(pick(o, "is_verified", "isVerified", "verified")),
    primary_photo_url: str(
      pick(o, "primary_photo_url", "primaryPhotoUrl", "photo_url", "photoUrl")
    ),
    last_active_at: str(pick(o, "last_active_at", "lastActiveAt")),
  };
}

export function normPreferences(raw: unknown): MatchmakingPreferences | null {
  const o = asObj(raw);
  if (!o) return null;
  return {
    id: str(pick(o, "id")) ?? undefined,
    user_id: str(pick(o, "user_id", "userId")) ?? undefined,
    version: num(pick(o, "version")) ?? undefined,
    gender: str(pick(o, "gender")),
    min_age: num(pick(o, "min_age", "minAge")),
    max_age: num(pick(o, "max_age", "maxAge")),
    min_height_cm: num(pick(o, "min_height_cm", "minHeightCm")),
    max_height_cm: num(pick(o, "max_height_cm", "maxHeightCm")),
    specific_country_codes:
      strArr(pick(o, "specific_country_codes", "specificCountryCodes")) ?? [],
    has_children_preference: str(
      pick(o, "has_children_preference", "hasChildrenPreference")
    ) as HasChildrenPref | undefined,
    wants_children_preference: str(
      pick(o, "wants_children_preference", "wantsChildrenPreference")
    ) as WantsChildrenPref | undefined,
    religion_preferences:
      strArr(pick(o, "religion_preferences", "religionPreferences")) ?? [],
    education_levels:
      strArr(pick(o, "education_levels", "educationLevels")) ?? [],
    marital_statuses:
      strArr(pick(o, "marital_statuses", "maritalStatuses")) ?? [],
    smoking_preferences:
      strArr(pick(o, "smoking_preferences", "smokingPreferences")) ?? [],
    drinking_preferences:
      strArr(pick(o, "drinking_preferences", "drinkingPreferences")) ?? [],
    language_preference_ids:
      strArr(pick(o, "language_preference_ids", "languagePreferenceIds")) ?? [],
    ethnicity_preference_ids:
      strArr(pick(o, "ethnicity_preference_ids", "ethnicityPreferenceIds")) ?? [],
    marriage_timeline: str(pick(o, "marriage_timeline", "marriageTimeline")),
    long_distance_relationship: str(
      pick(o, "long_distance_relationship", "longDistanceRelationship")
    ),
    family_involvement: str(pick(o, "family_involvement", "familyInvolvement")),
    religion_important: str(pick(o, "religion_important", "religionImportant")),
    willing_to_relocate: str(pick(o, "willing_to_relocate", "willingToRelocate")),
    user_notes: str(pick(o, "user_notes", "userNotes")),
    matchmaker_notes: str(pick(o, "matchmaker_notes", "matchmakerNotes")),
  };
}

export function normRequest(raw: unknown): MmRequest {
  const o = asObj(raw) ?? {};
  const nestedProfile = pick(
    o,
    "profile",
    "requester_profile",
    "requesterProfile",
    "profile_card",
    "profileCard",
    "requester"
  );
  return {
    id: str(pick(o, "id")) ?? "",
    user_id: str(pick(o, "user_id", "userId")) ?? "",
    matchmaking_preferences_id:
      str(pick(o, "matchmaking_preferences_id", "matchmakingPreferencesId")) ??
      undefined,
    status: (str(pick(o, "status")) ?? "OPEN") as RequestStatus,
    request_charge_idempotency_key: str(
      pick(o, "request_charge_idempotency_key", "requestChargeIdempotencyKey")
    ),
    contact_phone: str(pick(o, "contact_phone", "contactPhone")),
    active_introduction_id: str(
      pick(o, "active_introduction_id", "activeIntroductionId")
    ),
    created_at: str(pick(o, "created_at", "createdAt")) ?? "",
    expires_at: str(pick(o, "expires_at", "expiresAt")),
    completed_at: str(pick(o, "completed_at", "completedAt")),
    cancelled_at: str(pick(o, "cancelled_at", "cancelledAt")),
    updated_at: str(pick(o, "updated_at", "updatedAt")),
    profile: normProfile(nestedProfile),
  };
}

/**
 * GET /requests/{id} — documented as an aggregate (request + requester profile
 * card + live preferences + history). Also tolerates a bare Request body.
 */
export function normRequestDetail(raw: unknown): MmRequestDetail {
  const o = asObj(raw) ?? {};
  const requestObj =
    asObj(pick(o, "request")) ??
    (o.status !== undefined || o.user_id !== undefined || o.userId !== undefined
      ? o
      : null);
  return {
    request: normRequest(requestObj),
    profile:
      normProfile(
        pick(
          o,
          "profile",
          "requester_profile",
          "requesterProfile",
          "requester",
          "profile_card",
          "profileCard"
        )
      ) ?? normRequest(requestObj).profile ?? null,
    preferences: normPreferences(
      pick(
        o,
        "preferences",
        "live_preferences",
        "livePreferences",
        "matchmaking_preferences",
        "matchmakingPreferences"
      )
    ),
    introductions: asArray<unknown>(
      pick(
        o,
        "introductions",
        "introduction_history",
        "introductionHistory",
        "history"
      )
    )
      .map(normIntroduction),
  };
}

export function normMatchDetail(raw: unknown): MatchDetail | null {
  const o = asObj(raw);
  if (!o) return null;
  const dimension = str(pick(o, "dimension", "key", "name"));
  const label = str(pick(o, "label", "description", "detail"));
  const matched = pick(o, "matched", "satisfied", "ok");
  if (!dimension && !label) return null;
  return {
    dimension: dimension ?? "other",
    matched: matched === undefined ? true : Boolean(matched),
    label: label ?? "",
  };
}

/** `match_details` is persisted as a JSON string — parse it when it arrives that way. */
function parseMatchDetails(raw: unknown): MatchDetail[] | undefined {
  if (typeof raw === "string") {
    try {
      raw = JSON.parse(raw);
    } catch {
      return undefined;
    }
  }
  if (!Array.isArray(raw)) return undefined;
  return raw
    .map(normMatchDetail)
    .filter((d): d is MatchDetail => d !== null);
}

export function normMatchScore(raw: unknown): MatchScore {
  const o = asObj(raw) ?? {};
  const details =
    parseMatchDetails(pick(o, "details", "match_details", "matchDetails")) ?? [];
  const forward = num(pick(o, "forward_percentage", "forwardPercentage")) ?? 0;
  const reverse = num(pick(o, "reverse_percentage", "reversePercentage")) ?? 0;
  const overall =
    num(pick(o, "overall_percentage", "overallPercentage")) ??
    Math.round((forward + reverse) / 2);
  return {
    forward_percentage: forward,
    reverse_percentage: reverse,
    overall_percentage: overall,
    details,
  };
}

export function normCandidateView(raw: unknown): CandidateMatchView | null {
  const o = asObj(raw);
  if (!o) return null;
  const request =
    normRequest(
      asObj(pick(o, "request")) ??
        asObj(pick(o, "candidate_request", "candidateRequest")) ??
        o
    ) ?? null;
  if (!request || !request.id) return null;
  const match = normMatchScore(pick(o, "match", "match_score", "matchScore") ?? o);
  return {
    request,
    profile: normProfile(pick(o, "profile", "profile_card", "profileCard")),
    preferences: normPreferences(pick(o, "preferences")),
    match,
  };
}

export function normIntroduction(raw: unknown): Introduction {
  const o = asObj(raw) ?? {};
  const match_details = parseMatchDetails(
    pick(o, "match_details", "matchDetails", "details")
  );
  return {
    id: str(pick(o, "id")) ?? "",
    requester_request_id:
      str(pick(o, "requester_request_id", "requesterRequestId")) ?? "",
    candidate_request_id:
      str(pick(o, "candidate_request_id", "candidateRequestId")) ?? "",
    initiated_by_admin_user_id: str(
      pick(o, "initiated_by_admin_user_id", "initiatedByAdminUserId")
    ),
    forward_percentage: num(pick(o, "forward_percentage", "forwardPercentage")),
    reverse_percentage: num(pick(o, "reverse_percentage", "reversePercentage")),
    overall_percentage: num(pick(o, "overall_percentage", "overallPercentage")),
    match_details,
    reason: str(pick(o, "reason")),
    requester_decision:
      (str(pick(o, "requester_decision", "requesterDecision")) as Decision) ??
      "PENDING",
    candidate_decision:
      (str(pick(o, "candidate_decision", "candidateDecision")) as Decision) ??
      "PENDING",
    requester_decided_at: str(
      pick(o, "requester_decided_at", "requesterDecidedAt")
    ),
    candidate_decided_at: str(
      pick(o, "candidate_decided_at", "candidateDecidedAt")
    ),
    status: (str(pick(o, "status")) ?? "PROPOSED") as IntroStatus,
    decision_expires_at: str(
      pick(o, "decision_expires_at", "decisionExpiresAt")
    ),
    match_id: str(pick(o, "match_id", "matchId")),
    proposed_at: str(pick(o, "proposed_at", "proposedAt")),
    completed_at: str(pick(o, "completed_at", "completedAt")),
    created_at: str(pick(o, "created_at", "createdAt")),
    updated_at: str(pick(o, "updated_at", "updatedAt")),
  };
}

export function normIntroductionRow(raw: unknown): IntroductionRow {
  const o = asObj(raw) ?? {};
  const base = asObj(pick(o, "introduction")) ?? o;
  const intro = normIntroduction(base);
  return {
    ...intro,
    requester: normProfile(
      pick(o, "requester", "requester_profile", "requesterProfile") ??
        pick(base, "requester", "requester_profile", "requesterProfile")
    ),
    candidate: normProfile(
      pick(o, "candidate", "candidate_profile", "candidateProfile") ??
        pick(base, "candidate", "candidate_profile", "candidateProfile")
    ),
  };
}

export function normStats(raw: unknown): MmStats {
  const o = asObj(raw) ?? {};

  function statusMap(...keys: string[]): Record<string, number> {
    const v = asObj(pick(o, ...keys));
    if (!v) return {};
    const out: Record<string, number> = {};
    for (const [k, val] of Object.entries(v)) {
      const n = num(val);
      if (n !== null) out[k.toUpperCase()] = n;
    }
    return out;
  }

  // `requests`/`introductions` are direct status→count maps per the API spec;
  // also tolerate `{ requests: { by_status: {...} } }` style nesting.
  const nestedReq = asObj(pick(o, "requests"));
  const nestedIntro = asObj(pick(o, "introductions"));

  const requestsByStatus = statusMap(
    "requests_by_status",
    "requestsByStatus",
    "request_counts",
    "requestCounts"
  );
  if (Object.keys(requestsByStatus).length === 0 && nestedReq) {
    const inner =
      asObj(pick(nestedReq, "by_status", "byStatus", "statuses", "counts")) ??
      nestedReq;
    for (const [k, val] of Object.entries(inner)) {
      const n = num(val);
      if (n !== null) requestsByStatus[k.toUpperCase()] = n;
    }
  }

  const introductionsByStatus = statusMap(
    "introductions_by_status",
    "introductionsByStatus",
    "introduction_counts",
    "introductionCounts"
  );
  if (Object.keys(introductionsByStatus).length === 0 && nestedIntro) {
    const inner =
      asObj(pick(nestedIntro, "by_status", "byStatus", "statuses", "counts")) ??
      nestedIntro;
    for (const [k, val] of Object.entries(inner)) {
      const n = num(val);
      if (n !== null) introductionsByStatus[k.toUpperCase()] = n;
    }
  }

  const actionNeeded = asObj(pick(o, "action_needed", "actionNeeded"));

  return {
    requestsByStatus,
    introductionsByStatus,
    awaitingDecisions: num(
      pick(
        o,
        "awaiting_decisions",
        "awaitingDecisions",
        "awaiting_decision_count",
        "needs_action",
        "needsAction",
        "proposals_awaiting_decision"
      ) ??
        pick(actionNeeded ?? {}, "awaiting_decision", "awaitingDecision") ??
        pick(nestedIntro ?? {}, "awaiting_decisions", "awaitingDecisions")
    ),
    proposalsExpiringSoon: num(
      pick(
        o,
        "proposals_expiring_soon",
        "proposalsExpiringSoon",
        "expiring_soon",
        "expiringSoon"
      ) ??
        pick(actionNeeded ?? {}, "expiring_soon", "expiringSoon") ??
        pick(nestedIntro ?? {}, "expiring_soon", "expiringSoon")
    ),
    totalMatches: num(
      pick(
        o,
        "total_matchmaking_matches",
        "totalMatchmakingMatches",
        "total_matches",
        "totalMatches",
        "matches"
      ) ?? introductionsByStatus["MATCHED"] ?? requestsByStatus["MATCHED"]
    ),
  };
}
