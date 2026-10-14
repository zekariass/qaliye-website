# Personal Matchmaking — Admin API

> Audience: matchmaker console / admin tooling. For user-facing endpoints see
> `matchmaking-client-api.md`.

Base path: **`/api/v1/admin/matchmaking`**

---

## 1. Conventions

### Naming convention

- **JSON request bodies and responses: `snake_case` everywhere.**
  Jackson is configured globally with `SNAKE_CASE`, so every JSON field is
  snake_case on the wire (`requester_request_id`, `admin_override_params`,
  `scheduled_at`, …).
- **Map values keep their keys verbatim** — keys inside `override_params`,
  `admin_override_params`, `effective_filter_params`, and
  `preferences_snapshot` are column names already in snake_case.
- **Query parameters keep camelCase** where implicit (`afterSeq`); `page` and
  `size` are case-insensitive in practice.
- Enums are `UPPER_SNAKE_CASE` (`PROPOSED`, `MUTUAL_INTEREST`, `NO_SHOW`, …)
  except children-preference values which are lowercase (`any`, `yes`, `no`).

### Authentication & authorization

Every endpoint requires a Bearer JWT **whose subject belongs to a user with
the `ADMIN` role**:

```
Authorization: Bearer <admin_access_token>
```

The admin's user UUID is taken from the token `sub` claim and recorded on
mutations (`initiated_by_admin_user_id`, `admin_user_id`, …).
Non-admin tokens get `403 FORBIDDEN` — `"Admin access required."`.

### Content types

- Requests with a body: `Content-Type: application/json`
- Responses: `application/json` · **no file uploads** in this API.

### Date / time format

Timestamps are ISO-8601 with UTC offset (e.g. `"2026-10-01T22:31:07+00:00"`).
`scheduled_at` input must be ISO-8601 with offset/`Z` (`null`/omitted → 422).

### Error format

```json
{
  "error": {
    "code": "UNPROCESSABLE",
    "message": "Unknown override parameter: radius_km"
  }
}
```

| Status | `code` | Typical cause |
|--------|--------|---------------|
| 400 | `VALIDATION_ERROR` | Missing/invalid required body fields |
| 401 | — | Missing/invalid token |
| 403 | `FORBIDDEN` | Non-admin token |
| 404 | `NOT_FOUND` | Request / introduction / video call / notes target not found |
| 409 | `CONFLICT` | Illegal state transition (request not OPEN, intro decided, call already started, …) |
| 422 | `UNPROCESSABLE` | Unknown platform/mode/provider label, unknown override key, invalid enum value, missing requester profile |

### Pagination

`page` (0-based, default `0`) + `size` (default `50` for the queue).
List endpoints return **bare JSON arrays** — no envelope, no total count.
Messages use cursor pagination: `?afterSeq=<n>` returns `seq > n`, capped at
50, ordered `seq ASC`.

### Endpoint index

| Method | Path | Purpose |
|--------|------|---------|
| GET | `/api/v1/admin/matchmaking/requests` | OPEN request queue |
| GET | `/api/v1/admin/matchmaking/requests/{requestId}` | Any request detail |
| DELETE | `/api/v1/admin/matchmaking/requests/{requestId}` | Cancel request (cascade) |
| PATCH | `/api/v1/admin/matchmaking/users/{userId}/matchmaking-preferences/notes` | Set matchmaker notes |
| GET | `/api/v1/admin/matchmaking/requests/{requestId}/notes` | List internal notes |
| POST | `/api/v1/admin/matchmaking/requests/{requestId}/notes` | Add internal note |
| GET | `/api/v1/admin/matchmaking/requests/{requestId}/messages` | Read thread (cursor) |
| POST | `/api/v1/admin/matchmaking/requests/{requestId}/messages` | Message the user |
| POST | `/api/v1/admin/matchmaking/requests/{requestId}/messages/read` | Mark thread read |
| POST | `/api/v1/admin/matchmaking/requests/{requestId}/candidate-search` | Reciprocal candidate search |
| POST | `/api/v1/admin/matchmaking/introductions` | Pair two requests |
| GET | `/api/v1/admin/matchmaking/introductions/{introductionId}` | Introduction detail |
| GET | `/api/v1/admin/matchmaking/requests/{requestId}/introductions` | Intros for a request |
| DELETE | `/api/v1/admin/matchmaking/introductions/{introductionId}` | Cancel introduction |
| GET | `/api/v1/admin/matchmaking/introductions/{introductionId}/video-calls` | Call history |
| POST | `/api/v1/admin/matchmaking/video-calls/{videoCallId}/arrange` | Schedule call |
| POST | `/api/v1/admin/matchmaking/video-calls/{videoCallId}/join` | Matchmaker join credentials (IN_APP + WITH_MATCHMAKER) |
| POST | `/api/v1/admin/matchmaking/video-calls/{videoCallId}/start` | Mark call started |
| POST | `/api/v1/admin/matchmaking/video-calls/{videoCallId}/complete` | Mark call completed |
| POST | `/api/v1/admin/matchmaking/video-calls/{videoCallId}/fail` | Fail / no-show |

### Domain reference

```
Request:       OPEN → ON_HOLD → MATCHED / COMPLETED / CANCELLED / EXPIRED
Introduction:  PROPOSED → DECLINED / MUTUAL_INTEREST / CANCELLED / EXPIRED → MATCHED
Video call:    ARRANGING → SCHEDULED → IN_PROGRESS → COMPLETED
                                             └→ CANCELLED / NO_SHOW / FAILED
```

Platform defaults: request lifetime 90 d · decision window 72 h · outcome
window 48 h · re-introduction cooldown 30 d · candidate search cap 200.

---

## 2. Request queue

### `GET /api/v1/admin/matchmaking/requests`

The work queue — all `OPEN` requests, **oldest first** (`created_at ASC`).

**Query params:** `page` (default `0`), `size` (default `50`)

**Success:** `200 OK` → `Request[]`

### `GET /api/v1/admin/matchmaking/requests/{requestId}`

Fetch any request regardless of status/owner.

**Success:** `200 OK` → `Request` · **Errors:** `404` unknown id

### `DELETE /api/v1/admin/matchmaking/requests/{requestId}`

Admin cancel — same cascade as the user endpoint: active introduction
cancelled, scheduled call cancelled, partner request released to `OPEN`,
video escrow refunded.

**Success:** `204 No Content`
**Errors:** `404` unknown · `409` already terminal

### `Request` object

| Field | Type | Nullable | Notes |
|-------|------|----------|-------|
| `id`, `user_id`, `matchmaking_preferences_id` | UUID | no | |
| `preferences_version` | int | no | Preference version snapshotted |
| `preferences_snapshot` | object | no | Frozen preferences at creation (snake_case keys: `min_age`, `smoking_preferences`, `gender`, `user_notes`, …) |
| `status` | string | no | `OPEN`/`ON_HOLD`/`MATCHED`/`COMPLETED`/`CANCELLED`/`EXPIRED` |
| `request_charge_idempotency_key` | UUID | yes | |
| `contact_phone` | string | yes | |
| `created_at`, `expires_at`, `completed_at`, `cancelled_at`, `updated_at` | ISO-8601 | some | |
| `video_refund_key`, `video_refunded_at` | UUID / ISO-8601 | yes | Escrow-refund audit |
| `user_last_read_message_seq`, `admin_last_read_message_seq` | long | yes | Compare against latest message `seq` for unread badges |

**Example `Request` response:**

```json
{
  "id": "a12f4e8b-9c3d-4e5f-8a1b-2c3d4e5f6a7b",
  "user_id": "b5f8c1d2-3e4a-4f5b-8c9d-0e1f2a3b4c5d",
  "matchmaking_preferences_id": "7c9e6679-7425-40de-944b-e07fc1f90ae7",
  "preferences_version": 3,
  "preferences_snapshot": {
    "version": 3, "gender": "FEMALE", "min_age": 26, "max_age": 34,
    "min_height_cm": 160, "max_height_cm": null,
    "specific_country_codes": ["ET"],
    "has_children_preference": "no", "wants_children_preference": "yes",
    "religion_preferences": ["ORTHODOX_CHRISTIAN"],
    "education_levels": ["BACHELORS", "MASTERS"],
    "marital_statuses": ["NEVER_MARRIED"],
    "smoking_preferences": ["NO"], "drinking_preferences": ["NO", "SOCIALLY"],
    "language_preference_ids": [], "ethnicity_preference_ids": [],
    "matchmaker_notes": null,
    "user_notes": "Prefer someone based in Addis."
  },
  "status": "OPEN",
  "request_charge_idempotency_key": "1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed",
  "contact_phone": null,
  "created_at": "2026-10-01T21:45:00+00:00",
  "completed_at": null,
  "cancelled_at": null,
  "expires_at": "2026-12-30T21:45:00+00:00",
  "video_refund_key": null,
  "video_refunded_at": null,
  "user_last_read_message_seq": 4,
  "admin_last_read_message_seq": 7,
  "updated_at": "2026-10-01T21:45:00+00:00"
}
```

---

## 3. Preferences — matchmaker notes

User preferences are typed columns (see client doc for the full field list).
Admins cannot edit user preferences directly; they manage the internal
`matchmaker_notes` field instead.

### `PATCH /api/v1/admin/matchmaking/users/{userId}/matchmaking-preferences/notes`

Sets the admin-only `matchmaker_notes` on a user's preference row. Never
touches user-visible fields; user upserts never wipe it.

**Path params:** `userId` — UUID of the *user* (not the preference row id)

**Request body:**

| Field | Type | Required |
|-------|------|----------|
| `notes` | string | yes (non-blank) |

```json
{ "notes": "Prefers intro calls on weekends. Strong family emphasis." }
```

**Success:** `200 OK` — empty body
**Errors:** `404` user has no preference row · `400` blank notes

---

## 4. Admin notes on requests

Timestamped internal annotations per request (investigation log,
coordination notes). Never visible to users.

### `GET /api/v1/admin/matchmaking/requests/{requestId}/notes`

**Success:** `200 OK` → `Note[]` ordered `created_at ASC` · **Errors:** `404` unknown request

### `POST /api/v1/admin/matchmaking/requests/{requestId}/notes`

**Request body:** `{ "note": "string, non-blank" }` — author is the calling admin.

**Success:** `201 Created` → `Note` · **Errors:** `404` unknown request · `400` blank

### `Note` object

| Field | Type |
|-------|------|
| `id` | UUID |
| `request_id` | UUID |
| `admin_user_id` | UUID |
| `note` | string |
| `created_at` | ISO-8601 |

**Example `Note` response:**

```json
{
  "id": "2f8c4a6b-8d1e-4f2a-9c5b-3d4e5f6a7b8c",
  "request_id": "a12f4e8b-9c3d-4e5f-8a1b-2c3d4e5f6a7b",
  "admin_user_id": "e6a1b8c4-2d5f-4e7a-9b3c-4d5e6f7a8b9c",
  "note": "User prefers weekend calls; strong family emphasis.",
  "created_at": "2026-10-02T08:30:00+00:00"
}
```

---

## 5. Message thread

Same per-request thread the user sees; admins can read any request and post
as `ADMIN`. Admin messages push a `MATCHMAKING_NEW_MESSAGE` notification to
the user.

### `GET /api/v1/admin/matchmaking/requests/{requestId}/messages`

**Query params:** `afterSeq` (long, optional) — messages with `seq > afterSeq`, max 50, `seq ASC`.

**Success:** `200 OK` → `Message[]` · **Errors:** `404` unknown request

### `POST /api/v1/admin/matchmaking/requests/{requestId}/messages`

**Request body:** `{ "body": "string, non-blank" }`

**Success:** `201 Created` → `Message` · **Errors:** `404` unknown request

> Admin messages are allowed even on terminal requests (post-fact
> coordination); user messages are not.

### `POST /api/v1/admin/matchmaking/requests/{requestId}/messages/read`

Advances `admin_last_read_message_seq` to the latest.

**Success:** `200 OK` — empty body · **Errors:** `404`

### `Message` object

| Field | Type | Nullable |
|-------|------|----------|
| `id` | UUID | no |
| `seq` | long | no — per-request cursor |
| `request_id` | UUID | no |
| `sender_user_id` | UUID | yes (`null` for `SYSTEM`) |
| `sender_role` | string | `USER` \| `ADMIN` \| `SYSTEM` |
| `body` | string | no |
| `created_at` | ISO-8601 | no |

**Example `Message` response:**

```json
{
  "id": "f7b3d9e2-4c6a-4e8b-9d3f-7a8b9c0d1e2f",
  "seq": 5,
  "request_id": "a12f4e8b-9c3d-4e5f-8a1b-2c3d4e5f6a7b",
  "sender_user_id": "e6a1b8c4-2d5f-4e7a-9b3c-4d5e6f7a8b9c",
  "sender_role": "ADMIN",
  "body": "Hi! We found a promising match for you — check your introductions.",
  "created_at": "2026-10-01T22:10:00+00:00"
}
```

---

## 6. Candidate search

### `POST /api/v1/admin/matchmaking/requests/{requestId}/candidate-search`

Runs the reciprocal match for a requester request and returns eligible
candidate requests, oldest-first, capped at 200.

**Matching is bidirectional and enforced in SQL:**

- **A → B** — the requester's effective preferences (immutable request
  snapshot + your `override_params`, merged) filter each candidate's *live
  profile facts* (age, height, country, children, religion, education,
  marital status, smoking, drinking, languages, ethnicities).
- **B → A** — each candidate's *current* preference row filters the
  requester's profile facts.
- **Gender:** opposite-gender rule applied symmetrically
  (`candidate.gender ≠ requester.gender`, both from live profiles).
- Requests recently introduced to this requester are excluded
  (30-day cooldown by default); the requester, non-OPEN requests, and
  mutually-blocked users never appear.

**Request body** (optional — send no body or `{}` to use the stored snapshot
verbatim):

| Field | Type | Required |
|-------|------|----------|
| `override_params` | object \| null | optional — per-key overrides |

`override_params` keys are **snake_case column names**; unknown keys → 422:

| Key | Type | Notes |
|-----|------|-------|
| `min_age`, `max_age` | integer | 18–120, `min ≤ max` |
| `min_height_cm`, `max_height_cm` | integer | `min > 0`, `min ≤ max` |
| `specific_country_codes` | string[] | uppercased; `[]` = any |
| `has_children_preference` | string | `any`/`yes`/`no` |
| `wants_children_preference` | string | `any`/`yes`/`no`/`not_sure`/`open_to_discussion` |
| `religion_preferences`, `education_levels` | string[] | profile-value sets |
| `marital_statuses` | string[] | `NEVER_MARRIED`/`DIVORCED`/`WIDOWED`/`SEPARATED` |
| `smoking_preferences` | string[] | `NO`/`YES`/`OCCASIONALLY`/`TRYING_TO_QUIT` |
| `drinking_preferences` | string[] | `NO`/`SOCIALLY`/`OCCASIONALLY`/`YES` |
| `language_preference_ids`, `ethnicity_preference_ids` | UUID string[] | catalog ids |

**Example:**

```http
POST /api/v1/admin/matchmaking/requests/3b1c…/candidate-search
Authorization: Bearer <admin-token>
Content-Type: application/json

{
  "override_params": {
    "min_age": 24,
    "max_age": 40,
    "smoking_preferences": ["NO"]
  }
}
```

**Success:** `200 OK` → `Request[]` (candidate requests; inspect
`user_id` + `preferences_snapshot` to brief the pairing)

**Errors:**

| Status | Condition |
|--------|-----------|
| 404 | Requester request not found |
| 409 | Requester request is not `OPEN` |
| 422 | Unknown `override_params` key, invalid enum value, bad UUID in a list, or **requester has no profile** (reciprocal matching requires profile facts) |

---

## 7. Introductions

### `POST /api/v1/admin/matchmaking/introductions`

Pairs two `OPEN` requests. Both requests move to `ON_HOLD`, both users get a
`PROPOSED` notification, and a 72-hour decision window opens.

**Request body:**

| Field | Type | Required |
|-------|------|----------|
| `requester_request_id` | UUID | yes |
| `candidate_request_id` | UUID | yes — must differ from requester |
| `admin_override_params` | object \| null | optional — same key rules as candidate-search; recorded on the intro |

```json
{
  "requester_request_id": "3b1c0d…",
  "candidate_request_id": "9e7f2a…",
  "admin_override_params": { "min_age": 24 }
}
```

**Success:** `201 Created` → `Introduction` (`status: "PROPOSED"`,
`search_source: "ADMIN_OVERRIDE"` when overrides were supplied, else
`"REQUESTER_PREFERENCES"`)

**Errors:**

| Status | Condition |
|--------|-----------|
| 400 | Same id for requester and candidate |
| 404 | Either request not found |
| 409 | Either request not `OPEN` (already paired/claimed) |

### `GET /api/v1/admin/matchmaking/introductions/{introductionId}`

**Success:** `200 OK` → `Introduction` · **Errors:** `404`

### `GET /api/v1/admin/matchmaking/requests/{requestId}/introductions`

All introductions touching a request (either side), history included.

**Success:** `200 OK` → `Introduction[]` (possibly `[]`)

### `DELETE /api/v1/admin/matchmaking/introductions/{introductionId}`

Cancels a pending/in-progress introduction: status → `CANCELLED`, active
video call cancelled, both requests released to `OPEN`.

**Success:** `204 No Content`
**Errors:** `404` unknown · `409` already terminal

### `Introduction` object

| Field | Type | Nullable | Notes |
|-------|------|----------|-------|
| `id`, `requester_request_id`, `candidate_request_id` | UUID | no | |
| `initiated_by_admin_user_id` | UUID | yes | |
| `search_source` | string | yes | `REQUESTER_PREFERENCES` \| `ADMIN_OVERRIDE` |
| `effective_filter_params` | object | yes | Snapshot+overrides actually used |
| `admin_override_params` | object | yes | |
| `requester_decision`, `candidate_decision` | string | no | `PENDING`/`INTERESTED`/`NOT_INTERESTED` |
| `status` | string | no | `PROPOSED`/`DECLINED`/`MUTUAL_INTEREST`/`MATCHED`/`CANCELLED`/`EXPIRED` |
| `requester_decided_at`, `candidate_decided_at`, `decision_expires_at` | ISO-8601 | yes | |
| `match_id` | UUID | yes | Set on match creation |
| `proposed_at`, `accepted_at`, `completed_at`, `created_at`, `updated_at` | ISO-8601 | yes | |

**Example `Introduction` response:**

```json
{
  "id": "d3f5a9c2-7e1b-4c8d-9f2a-5b6c7d8e9f0a",
  "requester_request_id": "a12f4e8b-9c3d-4e5f-8a1b-2c3d4e5f6a7b",
  "candidate_request_id": "8b4d2f6a-1c3e-4a5b-9d8f-2e3a4b5c6d7e",
  "initiated_by_admin_user_id": "e6a1b8c4-2d5f-4e7a-9b3c-4d5e6f7a8b9c",
  "search_source": "ADMIN_OVERRIDE",
  "effective_filter_params": { "min_age": 24, "max_age": 34, "smoking_preferences": ["NO"] },
  "admin_override_params": { "min_age": 24 },
  "requester_decision": "PENDING",
  "candidate_decision": "PENDING",
  "status": "PROPOSED",
  "requester_decided_at": null,
  "candidate_decided_at": null,
  "decision_expires_at": "2026-10-05T09:00:00+00:00",
  "match_id": null,
  "proposed_at": "2026-10-02T09:00:00+00:00",
  "accepted_at": null,
  "completed_at": null,
  "created_at": "2026-10-02T09:00:00+00:00",
  "updated_at": "2026-10-02T09:00:00+00:00"
}
```

**Status transitions to watch:**

- `MUTUAL_INTEREST` — both said `INTERESTED`; a video-call row now exists in
  `ARRANGING`. **This is your cue to arrange the call.**
- `DECLINED` — either party declined or outcome was `NOT_A_FIT`; requests
  auto-released to `OPEN`.
- `EXPIRED` — decision window elapsed; requests released.
- `MATCHED` — both outcomes were `CONTINUE`; a `matches` row was created.

---

## 8. Video calls

### `GET /api/v1/admin/matchmaking/introductions/{introductionId}/video-calls`

All calls for an introduction (history), newest first.

**Success:** `200 OK` → `VideoCall[]`

### `POST /api/v1/admin/matchmaking/video-calls/{videoCallId}/arrange`

Schedules the call (`ARRANGING`/`SCHEDULED` → `SCHEDULED`). Notifies both
participants.

**Request body:**

| Field | Type | Required | Constraint |
|-------|------|----------|------------|
| `platform` | string | optional | `IN_APP` (default when omitted) \| `EXTERNAL` |
| `mode` | string | yes | `PRIVATE` \| `WITH_MATCHMAKER` |
| `external_provider` | string | conditional | Required for `EXTERNAL` — `ZOOM` \| `GOOGLE_MEET` only |
| `external_meeting_url` | string | conditional | Required for `EXTERNAL` — participants join on this link (DB CHECK enforces) |
| `external_access_code` | string \| null | optional | `EXTERNAL` only — passcode/PIN for the meeting (e.g. Zoom passcode, dial-in code); blank is stored as `null` |
| `scheduled_at` | ISO-8601 | yes | Agreed instant — ISO-8601 with offset/`Z` |
| `scheduled_tz` | string \| null | optional | IANA timezone label the schedule was agreed in (e.g. `"Africa/Addis_Ababa"`) — display only |

`channel_name` is never supplied — for `IN_APP` the configured video
provider mints it (currently `mm_<callId>`).

```json
{
  "platform": "EXTERNAL",
  "mode": "PRIVATE",
  "external_provider": "ZOOM",
  "external_meeting_url": "https://zoom.us/j/123456789",
  "external_access_code": "417293",
  "scheduled_at": "2026-10-05T18:00:00+03:00",
  "scheduled_tz": "Africa/Addis_Ababa"
}
```

```json
{
  "mode": "WITH_MATCHMAKER",
  "scheduled_at": "2026-10-05T18:00:00+03:00",
  "scheduled_tz": "Africa/Addis_Ababa"
}
```
*(omitting `platform` schedules a default IN_APP call)*

**Success:** `200 OK` → `VideoCall` (`status: "SCHEDULED"`)

**Errors:**

| Status | Condition |
|--------|-----------|
| 400 | Missing `mode` |
| 404 | Call not found |
| 409 | Call not in `ARRANGING`/`SCHEDULED` |
| 422 | Missing `scheduled_at`; unknown `platform`/`mode`; missing `external_provider` for EXTERNAL; `external_provider` not `ZOOM`/`GOOGLE_MEET`; **or missing `external_meeting_url`** for EXTERNAL |

### `POST /api/v1/admin/matchmaking/video-calls/{videoCallId}/join`

Mints the matchmaker's join credentials for an `IN_APP` call — only
meaningful when `mode = WITH_MATCHMAKER`. Credentials are generated on
demand by the configured video provider, never stored.

**Success:** `200 OK` → `{ "channel_name", "token", "uid", "expires_at" }` — same shape as the user `.../join` endpoint; `token`/`uid` are minted with host role

**Errors:** `404` unknown · `409` call not `SCHEDULED`/`IN_PROGRESS` · `422` EXTERNAL platform or `PRIVATE` mode

### `POST /api/v1/admin/matchmaking/video-calls/{videoCallId}/start`

`SCHEDULED → IN_PROGRESS`, stamps `started_at`.

**Success:** `200 OK` → `VideoCall` · **Errors:** `409` not `SCHEDULED` (includes unknown id)

### `POST /api/v1/admin/matchmaking/video-calls/{videoCallId}/complete`

`IN_PROGRESS → COMPLETED`, stamps `ended_at`, opens the 48-hour outcome
window.

**Success:** `200 OK` → `VideoCall` · **Errors:** `409` not `IN_PROGRESS`

### `POST /api/v1/admin/matchmaking/video-calls/{videoCallId}/fail`

Marks the call failed and runs the release cascade: call →
`NO_SHOW`/`FAILED`, introduction → `CANCELLED`, both requests → `OPEN`.

**Request body:**

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `reason` | string | yes | `"NO_SHOW"` produces `NO_SHOW`; **any other value produces `FAILED`** |

**Success:** `200 OK` — empty body · **Errors:** `404` unknown call

### `VideoCall` object

| Field | Type | Nullable |
|-------|------|----------|
| `id`, `introduction_id` | UUID | no |
| `arranged_by_admin_user_id` | UUID | yes |
| `platform` | string | yes — `IN_APP`/`EXTERNAL` |
| `mode` | string | yes — `PRIVATE`/`WITH_MATCHMAKER` |
| `channel_name`, `external_provider`, `external_meeting_url`, `external_access_code` | string | yes |
| `requester_outcome`, `candidate_outcome` | string | yes — `CONTINUE`/`NOT_A_FIT` |
| `outcome_expires_at` | ISO-8601 | yes |
| `status` | string | no — `ARRANGING`/`SCHEDULED`/`IN_PROGRESS`/`COMPLETED`/`CANCELLED`/`NO_SHOW`/`FAILED` |
| `scheduled_tz` | string | yes — IANA label, display only |
| `scheduled_at`, `started_at`, `ended_at`, `created_at`, `updated_at` | ISO-8601 | some |

**Example `VideoCall` response:**

```json
{
  "id": "c4e2d7a9-3b5f-4c8e-9a2d-6e7f8a9b0c1d",
  "introduction_id": "d3f5a9c2-7e1b-4c8d-9f2a-5b6c7d8e9f0a",
  "arranged_by_admin_user_id": "e6a1b8c4-2d5f-4e7a-9b3c-4d5e6f7a8b9c",
  "platform": "EXTERNAL",
  "mode": "WITH_MATCHMAKER",
  "channel_name": null,
  "external_provider": "ZOOM",
  "external_meeting_url": "https://zoom.us/j/123456789",
  "external_access_code": "417293",
  "requester_outcome": null,
  "candidate_outcome": null,
  "outcome_expires_at": null,
  "status": "SCHEDULED",
  "scheduled_at": "2026-10-05T18:00:00+03:00",
  "scheduled_tz": "Africa/Addis_Ababa",
  "started_at": null,
  "ended_at": null,
  "created_at": "2026-10-02T10:06:00+00:00",
  "updated_at": "2026-10-02T13:00:00+00:00"
}
```

---

## 9. Admin workflow recipe

1. **Poll the queue:** `GET /requests` → pick an `OPEN` request.
2. **Find candidates:** `POST /requests/{id}/candidate-search` (optionally with
   `override_params` to widen/narrow the snapshot).
3. **Brief via notes:** `PATCH /users/{userId}/matchmaking-preferences/notes`,
   `POST /requests/{id}/notes`, `POST /requests/{id}/messages`.
4. **Introduce:** `POST /introductions` → both requests go `ON_HOLD`,
   `PROPOSED` notifications fire.
5. **Monitor decisions:** `GET /introductions/{id}` — on
   `MUTUAL_INTEREST` a video-call row appears (`GET
   /introductions/{id}/video-calls`).
6. **Arrange:** coordinate a time on each user's message thread, then `arrange`.
   `platform` omitted = `IN_APP` (in-app video; users + matchmaker fetch join
   credentials via `.../join`); `EXTERNAL` needs `external_provider`
   (`ZOOM`/`GOOGLE_MEET`) + `external_meeting_url`. `WITH_MATCHMAKER` mode lets
   the matchmaker join via `POST /video-calls/{id}/join`.
7. **Run the call:** `start` → conduct → `complete` (or `fail`/`NO_SHOW`).
8. **Outcomes:** users self-report within 48 h; two `CONTINUE`s → `MATCHED`
   + match record. Missing outcomes auto-finalize as `NOT_A_FIT`.

**Sweepers** run server-side — no API needed: request expiry (90 d),
introduction expiry (72 h window), stale-call sweeper (ARRANGING 72 h,
scheduled+4 h grace, IN_PROGRESS 6 h), outcome auto-finalization (48 h).
