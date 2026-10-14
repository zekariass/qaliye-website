# Matchmaking Admin Console — Frontend Implementation Plan (Next.js)

> **For the frontend agent:** implement an admin/matchmaker management console
> for the Personal Matchmaking feature. The API contract is the source of
> truth — read `docs/matchmaking-admin-api.md` in full before writing code.
> This file is the build plan; the API doc defines every field, enum, and
> error.

**Base path:** `/api/v1/admin/matchmaking` · **Auth:** admin Bearer JWT on
every request (`sub` = admin user UUID; non-admin → `403 FORBIDDEN`).

---

## 1. Conventions the client must honor

- **snake_case everywhere** in JSON bodies and responses (Jackson SNAKE_CASE).
  Define TS interfaces in snake_case — do NOT convert to camelCase; keep a
  1:1 field mapping to avoid drift.
- **Enums are `UPPER_SNAKE_CASE`** — children-preference values are the only
  lowercase exception (`any`, `yes`, `no`, `not_sure`, `open_to_discussion`).
- **Timestamps** are ISO-8601 with offset. `scheduled_at` input requires an
  offset/`Z` — missing → `422`.
- **Errors:** envelope `{ "error": { "code", "message" } }`. Codes:
  `VALIDATION_ERROR` (400), `FORBIDDEN` (403), `NOT_FOUND` (404),
  `CONFLICT` (409 = illegal state transition → re-fetch), `UNPROCESSABLE`
  (422 = invalid enum/label/override key → surface `message` verbatim).
- **Pagination:** `page` (0-based) + `size` (default 50); list responses are
  **bare arrays** — no envelope/total. Messages use cursor pagination:
  `?afterSeq=<n>` returns `seq > n`, max 50, `seq ASC`.
- **No file uploads.** `Content-Type: application/json` for bodies.

## 2. Domain model (replicate as TS types)

```ts
type RequestStatus = 'OPEN' | 'ON_HOLD' | 'MATCHED' | 'COMPLETED' | 'CANCELLED' | 'EXPIRED';
type IntroStatus   = 'PROPOSED' | 'DECLINED' | 'MUTUAL_INTEREST' | 'MATCHED' | 'CANCELLED' | 'EXPIRED';
type CallStatus    = 'ARRANGING' | 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW' | 'FAILED';
type Decision      = 'PENDING' | 'INTERESTED' | 'NOT_INTERESTED';
type Platform      = 'IN_APP' | 'EXTERNAL';
type CallMode      = 'PRIVATE' | 'WITH_MATCHMAKER';
type ExtProvider   = 'ZOOM' | 'GOOGLE_MEET';
type Outcome       = 'CONTINUE' | 'NOT_A_FIT';
type SenderRole    = 'USER' | 'ADMIN' | 'SYSTEM';
type SearchSource  = 'REQUESTER_PREFERENCES' | 'ADMIN_OVERRIDE';
```

Interfaces: `MmRequest`, `Note`, `Message`, `Introduction`, `VideoCall`,
`JoinSession` (`channel_name`, `token`, `uid`, `expires_at`), plus
`PreferenceSnapshot`/`OverrideParams` (the 13 overridable keys from API doc
§6 — types and enum sets exactly as listed).

State machines (drive action-button visibility):

```
Request:      OPEN → ON_HOLD → MATCHED/COMPLETED/CANCELLED/EXPIRED
Introduction: PROPOSED → DECLINED/MUTUAL_INTEREST/CANCELLED/EXPIRED → MATCHED
VideoCall:    ARRANGING → SCHEDULED → IN_PROGRESS → COMPLETED
                                    └→ CANCELLED / NO_SHOW / FAILED
```

## 3. API client layer

One module `lib/api/matchmaking-admin.ts` — thin wrappers, one function per
endpoint from the index table (API doc §1). Central `apiFetch` handles:
Bearer attach, JSON encode, error-envelope parse into
`{ status, code, message }`, and throws a typed `ApiError`.

Special handling:

- `PATCH .../preferences/notes` and `DELETE`s return **empty bodies** — don't
  `.json()` them (204/empty 200).
- `arrange` defaults `platform` to `IN_APP` when omitted; blank
  `external_access_code` must be sent as `null` (not `""`).
- `fail` body `{ reason }`: literal `"NO_SHOW"` → `NO_SHOW`, anything else →
  `FAILED`.
- Candidate-search and introductions accept **optional bodies** — send no
  body or `{}` when no overrides.

## 4. Routes & pages

Mount under `/admin/matchmaking/` inside the existing admin site shell.

### 4.1 Queue — `/admin/matchmaking/requests`
`GET /requests?page=&size=` → table: user_id, status, created_at, expires_at,
unread badge (latest message seq vs `admin_last_read_message_seq` — poll
latest seq or use last fetched message), contact_phone, actions.
- Oldest-first is server ordering; keep it.
- Row → `/admin/matchmaking/requests/[id]`.

### 4.2 Request detail — `/admin/matchmaking/requests/[id]`
`GET /requests/{id}` — layout:
- **Header:** status badge + timestamps; Cancel button (`DELETE`) — confirm
  dialog warning about the cascade (intro cancelled, partner freed, escrow
  refunded). Disabled/409 → re-fetch.
- **Snapshot panel:** render `preferences_snapshot` as a key/value grid
  (enum values pretty-printed; UUID arrays as id chips or resolved names if
  catalogs are available).
- **Tabs:** Notes (`GET/POST /requests/{id}/notes`, ordered list + add form),
  Messages (`GET/POST .../messages` + `POST .../messages/read`), Introductions
  (`GET /requests/{id}/introductions` → link to intro detail), Candidate
  Search, Matchmaker Notes editor.

### 4.3 Message thread tab
Cursor-load oldest→latest (`afterSeq` loop or "load more"), show
`sender_role` styling (ADMIN right/primary, USER left, SYSTEM centered gray,
`sender_user_id` null for SYSTEM). Composer POSTs then appends. "Mark read"
button calls `.../messages/read`. Admin messaging works even on terminal
requests — keep composer enabled.

### 4.4 Candidate search tab — `POST /requests/{id}/candidate-search`
- Override form built from the 13 keys (API doc §6 table): numeric inputs
  (age/height ranges with min≤max validation), multi-selects for enum arrays
  (`marital_statuses`, `smoking_preferences`, `drinking_preferences`,
  `religion_preferences`, `education_levels`), text input for
  `specific_country_codes` (comma-separated → `string[]`), UUID pickers for
  `language_preference_ids`/`ethnicity_preference_ids` (if catalog endpoints
  exist in the admin app, reuse them; else raw UUID input is acceptable v1).
- Prefill with `preferences_snapshot` values; only send changed keys in
  `override_params` (empty → omit body).
- Results = `Request[]`: card list (user_id, snapshot summary, created_at).
  Each card gets "Introduce" → opens pairing dialog.
- Show result count + server cap (200) note. 422 → inline field error from
  `error.message`. Disabled entirely when request ≠ `OPEN`.

### 4.5 Introduction create dialog — `POST /introductions`
Two request pickers: fixed requester (current request) + selected candidate
from search results (or paste candidate request id). Optional
`admin_override_params` — reuse the §4.4 override form. On `201`, navigate to
`/admin/matchmaking/introductions/[id]`.

### 4.6 Introduction detail — `/admin/matchmaking/introductions/[id]`
`GET /introductions/{id}`:
- Both request links, `search_source` badge, decision table
  (`requester_decision`/`candidate_decision` + decided_at), countdown to
  `decision_expires_at`.
- `effective_filter_params` vs `admin_override_params` diff view.
- Cancel button (`DELETE`) with confirm; 409 → re-fetch.
- Video calls list (`GET /introductions/{id}/video-calls`) — newest first;
  call row → expandable manage panel.
- **On `MUTUAL_INTEREST`: show a prominent "Arrange call" CTA** — a call row
  now exists in `ARRANGING`.

### 4.7 Video call manage panel
Per-call card on the introduction page:

- **Arrange form** (`POST /video-calls/{id}/arrange`), only when status is
  `ARRANGING`/`SCHEDULED`:
  - `platform` toggle: `IN_APP` (default) | `EXTERNAL`
  - `mode` select: `PRIVATE` | `WITH_MATCHMAKER` (required)
  - `EXTERNAL` reveals: `external_provider` (`ZOOM`/`GOOGLE_MEET`, required),
    `external_meeting_url` (required, URL input), `external_access_code`
    (optional passcode)
  - `scheduled_at` datetime-local input → serialize with offset;
    `scheduled_tz` optional IANA text/select
- **Lifecycle buttons** by status: `start` (`SCHEDULED` only),
  `complete` (`IN_PROGRESS` only), `fail` (any active — dialog with reason
  text; "No show" preset sends `"NO_SHOW"`).
- **Join** (`POST /video-calls/{id}/join`) — only for `IN_APP` +
  `WITH_MATCHMAKER` + `SCHEDULED`/`IN_PROGRESS`; renders returned
  `JoinSession` (channel_name/token/uid/expires_at) for the embedded video
  SDK or copy-paste. `422` for EXTERNAL/PRIVATE.
- Detail grid shows all fields incl. `external_access_code`,
  `scheduled_at` + `scheduled_tz` (display both — tz is the label the time
  was agreed in), outcomes, `outcome_expires_at`.

### 4.8 Matchmaker notes — `PATCH .../users/{userId}/matchmaking-preferences/notes`
Simple textarea + save (from request detail or a user lookup). `404` = user
has no preference row yet. Admins never edit user preference fields — only
`matchmaker_notes`.

## 5. Component inventory

- `RequestQueueTable`, `RequestStatusBadge`, `IntroStatusBadge`,
  `CallStatusBadge` (color map: OPEN/PROPOSED=info, ON_HOLD/ARRANGING=amber,
  MATCHED/COMPLETED=green, DECLINED/CANCELLED/FAILED/NO_SHOW/EXPIRED=gray/red)
- `PreferenceSnapshotGrid` (renders arbitrary snapshot keys; array chips)
- `OverrideParamsForm` (controlled by a Zod/TS schema generated from the
  13-key table; emits only dirty keys)
- `MessageThread` + `MessageComposer`
- `NotesList` + `NoteComposer`
- `IntroductionCard`, `CandidateCard`
- `ArrangeCallForm` (conditional EXTERNAL fields), `CallActionBar`,
  `JoinSessionDisplay`
- `ConfirmDialog` (cancel request / cancel intro / fail call)

## 6. State & data fetching

- Use TanStack Query (or the project's existing fetcher). Query keys:
  `['mm-requests', page]`, `['mm-request', id]`, `['mm-notes', id]`,
  `['mm-messages', id]`, `['mm-intros', requestId]`, `['mm-intro', id]`,
  `['mm-calls', introId]`.
- **Mutations invalidate** the entity + the queue (status changes propagate —
  e.g. arrange flips call to `SCHEDULED`, cancel frees requests to `OPEN`).
- **Polling:** queue page `refetchInterval` ~30 s; introduction detail ~15 s
  while `PROPOSED`/`MUTUAL_INTEREST` (decisions + auto-created call row);
  message thread `afterSeq` incremental poll ~10 s. **No websockets** — all
  server-side sweepers (request 90 d, intro 72 h, stale-call, outcome 48 h)
  mutate state that only appears via re-fetch.
- **409 CONFLICT handling:** toast the message and invalidate the entity —
  it means the state moved (sweeper or another admin).
- Sequential cascade awareness: cancelling a request or failing a call
  changes multiple entities — invalidate queue + request + intro + calls.

## 7. Edge cases (don't regress)

- Bare-array lists: render empty state (`[]` is success).
- `arrange` requires `scheduled_at` — 422 if null; send timezone offset.
- `external_access_code` blank → `null`, never `""`.
- `join` exists only for `IN_APP` + `WITH_MATCHMAKER`; hide otherwise (422).
- `fail` reason: map UI choice — "NO_SHOW" → literal; else `"FAILED"`-producing
  free text.
- Terminal requests still allow admin messages/notes.
- `preferences_snapshot` is frozen at request time — may differ from live
  prefs; label it "snapshot".
- Cancel-fail-safe flows: call `fail` on already-terminal call returns 404 —
  treat as "refresh state", not fatal.
- Unknown override key → 422 listing the bad key; surface verbatim so the
  matchmaker fixes the form.
- Non-admin session → 403 on every call; gate the whole section on role.

## 8. Build order

1. apiFetch + error envelope + types/enums
2. Queue page (list + pagination)
3. Request detail (snapshot, notes, messages, cancel)
4. Candidate search + overrides form
5. Introduction create + detail + cancel
6. Video calls: arrange form, lifecycle actions, join display
7. Matchmaker notes editor
8. Polling + unread badges + polish (empty states, skeletons, toasts)

## 9. Acceptance checklist

- Queue paginates; opening a request shows status-correct actions only.
- Cancel request → intro cancelled, call cancelled, partner freed (verify via
  re-fetch: statuses flip).
- Candidate search returns results; override with an invalid key → 422 shown.
- Create intro → `PROPOSED`; simulate both INTERESTED → `MUTUAL_INTEREST` and
  `ARRANGING` call appears in the calls list.
- Arrange IN_APP (omit platform) and EXTERNAL (Zoom URL + access code) both
  reach `SCHEDULED`; `scheduled_tz` renders alongside `scheduled_at`.
- start → complete opens outcome window; fail with "NO_SHOW" → `NO_SHOW` and
  requests back to `OPEN`.
- WITH_MATCHMAKER + IN_APP → join returns `{channel_name, token, uid,
  expires_at}`; same button hidden/disabled on EXTERNAL or PRIVATE.
- Message send → appears with `sender_role: "ADMIN"`; read-marker clears badge.
