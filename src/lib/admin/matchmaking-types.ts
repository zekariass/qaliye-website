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
  | "MUTUAL_INTEREST"
  | "MATCHED"
  | "CANCELLED"
  | "EXPIRED";

export type CallStatus =
  | "ARRANGING"
  | "SCHEDULED"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "CANCELLED"
  | "NO_SHOW"
  | "FAILED";

export type Decision = "PENDING" | "INTERESTED" | "NOT_INTERESTED";
export type Platform = "IN_APP" | "EXTERNAL";
export type CallMode = "PRIVATE" | "WITH_MATCHMAKER";
export type ExtProvider = "ZOOM" | "GOOGLE_MEET";
export type Outcome = "CONTINUE" | "NOT_A_FIT";
export type SenderRole = "USER" | "ADMIN" | "SYSTEM";
export type SearchSource = "REQUESTER_PREFERENCES" | "ADMIN_OVERRIDE";

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

// ── Preferences snapshot ──────────────────────────────────────────────────────

export interface PreferenceSnapshot {
  version?: number;
  gender?: string;
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
  matchmaker_notes?: string | null;
  user_notes?: string | null;
  [key: string]: unknown;
}

// ── Override params (13 keys from API doc §6) ─────────────────────────────────

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

// ── Domain objects ─────────────────────────────────────────────────────────────

export interface MmRequest {
  id: string;
  user_id: string;
  matchmaking_preferences_id: string;
  preferences_version: number;
  preferences_snapshot: PreferenceSnapshot;
  status: RequestStatus;
  request_charge_idempotency_key?: string | null;
  contact_phone?: string | null;
  created_at: string;
  expires_at?: string | null;
  completed_at?: string | null;
  cancelled_at?: string | null;
  updated_at?: string | null;
  video_refund_key?: string | null;
  video_refunded_at?: string | null;
  user_last_read_message_seq?: number | null;
  admin_last_read_message_seq?: number | null;
}

export interface Note {
  id: string;
  request_id: string;
  admin_user_id: string;
  note: string;
  created_at: string;
}

export interface Message {
  id: string;
  seq: number;
  request_id: string;
  sender_user_id?: string | null;
  sender_role: SenderRole;
  body: string;
  created_at: string;
}

export interface Introduction {
  id: string;
  requester_request_id: string;
  candidate_request_id: string;
  initiated_by_admin_user_id?: string | null;
  search_source?: SearchSource | null;
  effective_filter_params?: Record<string, unknown> | null;
  admin_override_params?: Record<string, unknown> | null;
  requester_decision: Decision;
  candidate_decision: Decision;
  status: IntroStatus;
  requester_decided_at?: string | null;
  candidate_decided_at?: string | null;
  decision_expires_at?: string | null;
  match_id?: string | null;
  proposed_at?: string | null;
  accepted_at?: string | null;
  completed_at?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
}

export interface VideoCall {
  id: string;
  introduction_id: string;
  arranged_by_admin_user_id?: string | null;
  platform?: Platform | null;
  mode?: CallMode | null;
  channel_name?: string | null;
  external_provider?: ExtProvider | null;
  external_meeting_url?: string | null;
  external_access_code?: string | null;
  requester_outcome?: Outcome | null;
  candidate_outcome?: Outcome | null;
  outcome_expires_at?: string | null;
  status: CallStatus;
  scheduled_tz?: string | null;
  scheduled_at?: string | null;
  started_at?: string | null;
  ended_at?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
}

export interface JoinSession {
  channel_name: string;
  token: string;
  uid: number | string;
  expires_at: string;
}

// ── Arrange call body ─────────────────────────────────────────────────────────

export interface ArrangeCallBody {
  platform?: Platform;
  mode: CallMode;
  external_provider?: ExtProvider;
  external_meeting_url?: string;
  external_access_code?: string | null;
  scheduled_at: string;
  scheduled_tz?: string | null;
}
