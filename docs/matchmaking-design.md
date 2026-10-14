Here is a cleaner, more precise version of your prompt that preserves your requirements while making the implementation expectations unambiguous:

```markdown
# Matchmaking System Redesign & Implementation Requirements

I need to redesign the existing matchmaking system and update the current implementation accordingly.

The new design should simplify the matchmaking flow, remove unnecessary functionality, and integrate matchmaking more naturally with the existing dating/messaging system.

Do not preserve obsolete entities, tables, fields, services, APIs, or code simply for backward compatibility if they are no longer required by the new design. Identify and remove them safely.

---

# 1. User Preference Flow

Users can modify their matchmaking preferences before submitting a matchmaking request.

The matchmaking preference table must use **explicit database columns**, not a JSON/JSONB structure.

Add the following preferences in addition to the existing matchmaking preferences:

### Marriage Timeline

- `NOW`
- `ONE_TO_TWO_YEARS`
- `THREE_TO_FIVE_YEARS`
- `NOT_SURE`

### Long-Distance Relationship

- `YES`
- `NO`

### Family Involvement

- `YES`
- `NO`

### Religion Importance

- `YES`
- `NO`

### Willing to Relocate

- `YES`
- `NO`

Use appropriate database types/enums consistent with the existing project conventions.

---

# 2. Submit Matchmaking Request

The user submits a matchmaking request after configuring their preferences.

After submission:

- The request enters the appropriate active/open state.
- The client should show a clear status such as:

> **Your matchmaker is carefully reviewing your request.**

The user should be able to see the current matchmaking request status.

There should no longer be a matchmaking-specific messaging thread between:

- User ↔ Admin
- User ↔ Matchmaker

Remove the old matchmaking messaging functionality if it is no longer required.

---

# 3. Admin Matchmaking Queue

The admin console displays matchmaking requests.

The admin must be able to:

- View matchmaking requests.
- Sort requests by creation date.
- Open a request.
- View the requester's profile.
- View the requester's matchmaking preferences.
- Search for potential matches.

The admin is responsible for initiating the matchmaking search.

---

# 4. Candidate Search

When the admin opens a matchmaking request and searches for potential matches, the backend must search the available matchmaking requests/users according to the matching rules.

The backend should return a **paginated list of potential candidates**, ranked by calculated compatibility.

The backend must NOT automatically select the final match.

The admin reviews the returned candidates and chooses the final candidate.

---

# 5. Matching Calculation

The backend should calculate compatibility in **both directions**.

For example:

### A → B

Compare:

> User A's matchmaking preferences against User B's profile information.

### B → A

Compare:

> User B's matchmaking preferences against User A's profile information.

The backend should then calculate an overall match percentage based on the matching parameters.

---

## 5.1 Profile Fields

If a preference corresponds to information available directly in the user's profile, compare the preference against the other user's profile.

For example:

```text
A prefers age 25–35
B is 30
→ A → B = match
```

---

## 5.2 Preference-to-Preference Matching

Some information may not exist as a direct profile attribute but may exist in matchmaking preferences.

For those fields, compare the users' matchmaking preferences where appropriate.

For example:

```text
A: willing_to_relocate = YES
B: willing_to_relocate = YES
```

The backend should apply the appropriate preference-to-preference matching rule.

Do not invent matching rules where the existing product requirements do not define one. Keep such logic explicit and maintainable.

---

# 6. Match Percentage

The backend must return compatibility information to the admin.

At minimum, the candidate result should include:

- Candidate profile information required by the admin UI.
- Candidate preference
- Forward match percentage (`A → B`).
- Reverse match percentage (`B → A`).
- Overall match percentage.
- Any relevant matching details that allow the admin to understand why the candidate ranked highly.

For example:

```json
{
  "candidate": {
    "id": "...",
    "name": "...",
    "age": 30
  },
  "match": {
    "forward_percentage": 85,
    "reverse_percentage": 78,
    "overall_percentage": 82
  }
}
```

Use the project's existing API naming convention consistently.

The exact matching algorithm should be implemented in a maintainable way so that it can be extended later.

So the idea is to get all matches but rank based on compatibility.

---

# 7. Admin Review

The backend provides ranked potential candidates.

The admin then evaluates:

1. Calculated match percentage.
2. Candidate profile.
3. Candidate matchmaking preferences.
4. Other relevant profile information.
5. Free-text notes.

### Important

Free-text preference/user notes must **not** be automatically interpreted as structured matching criteria by the backend.

They should be available for the admin to manually review.

The backend provides the candidate ranking and calculated compatibility; the admin makes the final selection.

---

# 8. Propose Introduction

After reviewing candidates, the admin selects one candidate and proposes the introduction.

Both users receive a push notification.

The proposal should contain enough information for each user to evaluate the introduction.

The backend/client should return the other user's:

- Profile.
- Relevant matchmaking preferences.
- Address/location information allowed by the product.
- Profile photos.
- Relevant compatibility information.
- "Why this introduction?" explanation.

---

# 9. "Why This Introduction?"

Every proposed introduction should contain an explanation of why the users were introduced.

For example:

> **Why this introduction?**
>
> You both are looking for marriage within a similar timeframe,
> You both speak Amharic,
> You both are open to relocating.

This explanation should be generated from actual matching information.

Do not claim compatibility based on information that was not used in the matching calculation.

The explanation should be stored with the introduction if necessary so that it remains consistent after the introduction is created.

---

# 10. User Introduction Decision

Each user can choose:

- `INTERESTED`
- `NOT_INTERESTED`

The decision should be one-time for that introduction unless the existing business rules explicitly require otherwise.

If either user selects:

```text
NOT_INTERESTED
```

the introduction ends without creating a match.

If the user still has remaining introduction quota for the current matchmaking request, they may receive/request another introduction.

If no introduction quota remains, the user must submit a new matchmaking request to continue.

---

# 11. Introduction Quota

The maximum number of introductions allowed for one matchmaking request must be configurable through `application.yml`.

For example:

```yaml
matchmaking:
  introductions-per-request: 1
```

If configured as:

```text
1
```

then the user's request can produce only one introduction.

After that introduction is:

- Accepted/mutually interested, or
- Declined,

the request is finished.

The user must submit a new matchmaking request if they want another matchmaking attempt.

The implementation should support values greater than one without requiring architectural changes.

---

# 12. Creating a Match

If both users select:

```text
INTERESTED
```

the system creates a normal `match` using the existing matching infrastructure.

The resulting match should integrate with the existing `matches` table and existing messaging system.

Do not create a separate matchmaking-specific chat system.

The matchmaking process ends once the normal match is created.

---

# 13. Messaging After Match

After a matchmaking introduction becomes a mutual match, both users use the **existing normal messaging system**.

The normal conversation supports:

- Text messages.
- Voice messages.
- Image/picture messages.
- Video-call requests.

Video calling is new and should be treated as a **message/conversation action**, rather than as a separate matchmaking process.

Do not create a separate matchmaking video-call communication system.

---

# 14. Video Call Request

A video call is **not automatically started** when users match.

Either user can request a video call from the normal chat.

When the user taps the video-call action, open a video-call request screen.

The screen should show:

- Previous video-call requests.
- Current/pending request, if any.
- Whether the previous request was accepted.
- Whether the current user can send another request.

---

# 15. Video Call Request Rules

A video-call request requires acceptance by the receiving user.

One video-call request represents **one video call**.

If:

```text
User A → requests video call → User B
```

then User B can:

- Accept.
- Decline.

If accepted, the users can start the in-app Agora or other integrated video call.

If declined, the request is completed as declined.

For another video call, a new video-call request must be created.

---

# 16. Pending Video Call Requests

A user must not be able to create duplicate/p conflicting pending video-call requests.

If there is already a pending request involving the same two users, the system must prevent another pending request from being created.

For example:

```text
A → B: PENDING
```

Then:

```text
B → A
```

must not create another pending request for the same call relationship.

The client needs an API that can determine the current video-call-request state between two matched users.

For example, the API should allow the client to determine:

```text
No request
A requested B
B requested A
Request accepted
Request declined
Request completed
```
So new table or entities must be designed for video call request and accept that is linked to a match.
Use the existing project/API conventions when defining the actual endpoint and response structure.

---

# 17. Video Call Integration

For accepted in-app video calls, use the configured video provider such as **Agora RTC**.

The existing/backend video-call implementation should provide the information required by the client to join the Agora channel securely.

The Agora App Certificate must never be exposed to the client.

The client should obtain the appropriate:

- Channel name.
- RTC token.
- UID.
- Expiration information.

The client then joins the Agora channel.

Implement appropriate token refresh handling.

The video call architecture should be like:

User A
↓
Sends video-call request
↓
User B receives request
↓
User B accepts
↓
BACKEND creates the video-call record
↓
BACKEND generates a unique channel_name
↓
BACKEND charges the video-call action
↓
A and B can join
↓
Backend gives each user an Agora token
↓
A + B join the same Agora channel

Create appropriate tables that are required to handle this.

---

# 18. Remove Obsolete Matchmaking Messaging

The old matchmaking-specific messaging functionality is no longer required.

Remove:

- User ↔ Matchmaker messaging.
- User ↔ Admin matchmaking chat.
- Matchmaking message threads.
- Matchmaking-specific unread message tracking.
- Related APIs.
- Related entities/tables/fields/services.

Do not replace them with another matchmaking chat system.

After a successful introduction, communication happens through the existing normal match/chat system.

---

# 19. Remove Preference Snapshots

The new system does **not** require saving a snapshot of matchmaking preferences when a request is submitted.

Remove the old:

- Preference snapshot fields.
- Preference snapshot entities.
- Snapshot services.
- Snapshot-related APIs.
- Snapshot-related code.

The implementation should use the current matchmaking preference data according to the new business rules.

Before removing anything, check all usages and dependencies to avoid breaking unrelated functionality.

---

# 20. Matchmaking Preference Database Design

The matchmaking preference table must be **column-based**.

Do NOT use:

```sql
criteria JSONB
```

or an equivalent JSON/JSONB preference structure.

Use explicit columns for the supported matchmaking preferences.

For example:

```text
age_min
age_max
height_min
height_max
...
marriage_timeline
long_distance_relationship
family_involvement
religion_important
willing_to_relocate
user_notes
```

Use appropriate types and foreign keys for catalog-based preferences according to the existing database design.

---

# 21. Existing Implementation Cleanup

This is a redesign of the existing matchmaking implementation, not an additional parallel implementation.

Review the current matchmaking implementation and:

- Remove obsolete entities.
- Remove obsolete tables.
- Remove obsolete columns.
- Remove obsolete repositories.
- Remove obsolete services.
- Remove obsolete controllers.
- Remove obsolete DTOs.
- Remove obsolete APIs.
- Remove obsolete business logic.
- Remove obsolete scheduled jobs/workers.
- Remove obsolete message-related code.
- Remove obsolete snapshot logic.
- Remove obsolete video-call matchmaking flow.

Introduce new entities, fields, services, APIs, or supporting components only where required by this new design.

Do not leave dead code or duplicate implementations.

---

# 22. Compatibility With Existing Dating System

The redesigned matchmaking system must integrate with the existing dating system.

In particular:

- Successful matchmaking creates a normal `match`.
- The existing messaging system is used after the match.
- Existing text messaging remains unchanged.
- Existing voice messaging remains unchanged.
- Existing image messaging remains unchanged.
- Video-call requests become another conversation capability.
- Existing subscription/credit/feature-action infrastructure should be reused where applicable.

Do not duplicate existing functionality unnecessarily.

---

# 23. Important Architectural Principle

The responsibility of each component should be clear:

### User

- Maintains preferences.
- Submits matchmaking request.
- Reviews introductions.
- Accepts/declines introductions.
- Chats after matching.
- Requests/accepts/declines video calls.

### Admin

- Reviews matchmaking requests.
- Opens a request.
- Searches potential candidates.
- Reviews backend compatibility scores.
- Reviews profiles and preferences.
- Reviews free-text notes.
- Selects the final candidate.
- Sends the introduction.

### Backend

- Searches candidates.
- Applies matching rules.
- Calculates forward/reverse/overall compatibility.
- Returns paginated ranked candidates.
- Creates introductions.
- Manages introduction state.
- Enforces introduction quotas.
- Creates the normal match when both users are interested.
- Manages video-call request state.
- Provides secure Agora credentials.

The backend **does not automatically choose the final matchmaking candidate**.

The admin makes the final candidate selection.

---

# 24. Implementation Requirement

Before modifying code:

1. Review the existing matchmaking implementation.
2. Identify all existing entities, tables, APIs, services, repositories, DTOs, jobs, and relationships.
3. Map each existing component to:
    - Keep
    - Modify
    - Remove
    - Replace
4. Identify dependencies with the existing matching, messaging, subscription, credit, notification, and user systems.
5. Produce an implementation plan.
6. Then implement the redesigned system.

The implementation must be production-quality and follow the existing project's architecture, naming conventions, validation patterns, transaction boundaries, error handling, authorization rules, and database migration practices.

Do not break existing unrelated functionality.

---

# 25. Final Expected Flow

The final end-to-end flow should be:

```text
User
  ↓
Modify matchmaking preferences
  ↓
Submit matchmaking request
  ↓
"Your matchmaker is carefully reviewing your request"
  ↓
Admin sees request
  ↓
Admin opens request
  ↓
Backend searches potential candidates
  ↓
Backend calculates:
  - A → B compatibility
  - B → A compatibility
  - Overall compatibility
  ↓
Backend returns paginated, ranked candidates
  ↓
Admin reviews profiles/preferences/notes
  ↓
Admin selects candidate
  ↓
Introduction proposed
  ↓
Both users receive notification
  ↓
Each user reviews:
  - Profile
  - Preferences
  - Photos
  - Location
  - Why this introduction?
  ↓
Interested / Not Interested
  ↓
If either is Not Interested
  ├── Remaining introduction quota?
  │       ├── Yes → another introduction may be proposed
  │       └── No → request ends; submit a new request
  │
  ↓
If both are Interested
  ↓
Normal Match created
  ↓
Existing normal chat
  ├── Text
  ├── Voice
  ├── Images
  └── Video-call request
          ↓
      Recipient accepts
          ↓
      Agora in-app video call
```

- Credit should now be applied separately for video call and matchmaking request, not together as previous implementation. Apply matchmaking request only when matchmaking request is created.
  Apply video call cost only for the video call requester. The video call credit should be applied only when the
  requester joins the video call. If the requestor has no credit balance, show the insufficient credit balance error in the client.

The redesigned implementation should follow this flow exactly unless an existing system constraint requires a documented technical adjustment.
```


=============================================================


# Personal Matchmaking — Design

This document defines the Personal Matchmaking system in its
redesigned form. It supersedes every previous version of this
document.

Personal Matchmaking is a **manual, admin-driven** matching flow:

```text
User submits a matchmaking request
    → admin searches compatible candidates
    → admin creates an introduction
    → both users independently decide INTERESTED /
      NOT_INTERESTED
    → mutual interest creates a normal match
    → messaging and video calls reuse the existing
      conversation feature
```

The backend does **not** choose the match automatically. The
backend only:

```text
- stores matchmaking requests
- helps the admin search for candidates
- scores each candidate pair (compatibility percentages)
- creates introductions
- enforces state transitions
- creates the final match
```

The final human decision is always made by the admin, and user
consent is enforced before any match is created.

---

# 1. What Changed vs the Previous Design

This redesign is a **simplification**. The match is now created
directly on mutual interest — the video call is no longer part of
the matchmaking lifecycle.

Removed concepts (design + schema + code):

```text
REMOVED  matchmaking_messages
    Per-request admin↔user chat threads, seq column, read cursors,
    polling endpoints. All post-match communication reuses the
    existing messaging feature.

REMOVED  matchmaking_video_calls + matchmaking video lifecycle
    Mandatory mediated video introduction, ARRANGING/SCHEDULED/
    IN_PROGRESS/COMPLETED states, IN_APP/EXTERNAL platforms,
    contact collection, post-call CONTINUE/NOT_A_FIT outcomes,
    outcome sweepers.

REMOVED  Video escrow pricing
    PERSONAL_MATCHMAKING_VIDEO_ESCROW action, bundled escrow,
    video_refund_key / video_refunded_at, MATCHMAKING_ESCROW_REFUND
    credit source. The request charge is a single flat fee.

REMOVED  Preference snapshots
    requests.preferences_snapshot / preferences_version. Requests
    always evaluate the user's CURRENT matchmaking_preferences row
    under the current business rules.

REMOVED  effective_filter_params / admin_override_params /
    search_source on introductions
    Replaced by scored match results (see §11).
```

New concepts:

```text
NEW  Matchmaking-specific preference columns
    marriage_timeline, long_distance_relationship,
    family_involvement, religion_important, willing_to_relocate
    (§5).

NEW  Compatibility scoring on candidate search
    forward %, reverse %, overall % + per-dimension details
    used for ranking and for the "why this introduction" payload
    (§11, §12).

NEW  Introduction quota
    matchmaking.introductions-per-request config controls how
    many introductions a request can consume (§13).

NEW  video_call_requests
    A general, match-scoped video-call capability used after a
    match exists — by matched users from any match source
    (discovery, blind date, matchmaking) (§15).
```

---

# 2. User Responsibility Model

## What the User Must Do

```text
1. Create a matchmaking request.
2. Maintain matchmaking preferences.
3. Decide INTERESTED or NOT_INTERESTED on each proposed
   introduction.
4. After a match is created, use the normal conversation:
   send messages and request/join video calls.
```

## What the User Does NOT Do

```text
- search for candidates
- see a list of possible candidates
- contact the admin through a matchmaking-only chat thread
- schedule or arrange a matchmaking video call
- submit post-call outcomes
```

## High-Level User Flow

```text
User
  ↓
Configure Matchmaking Preferences
  ↓
Create Matchmaking Request (paid)
  ↓
Status: "Your matchmaker is carefully reviewing your request"
  ↓
Receive Introduction Proposal
  ↓
INTERESTED or NOT_INTERESTED
  ↓
both INTERESTED → normal Match created
  ↓
chat + video calls via the existing conversation feature
```

---

# 3. Admin Responsibility Model

The admin (matchmaker):

```text
1. Opens the matchmaking request queue (filterable by status).
2. Picks one request to work on.
3. Runs a candidate search, optionally with admin-only filter
   overrides.
4. Reviews ranked results: candidate profile, candidate's own
   preferences, compatibility percentages and the "why"
   explanation.
5. Selects exactly one candidate and creates the introduction.
6. Cancels requests or introductions when operationally needed.
7. Writes private matchmaker notes on the request.
```

The admin never creates a match directly — the match is produced
by mutual user consent (§14).

---

# 4. Backend Responsibility Model

```text
Backend
  ├── stores matchmaking preferences (typed columns)
  ├── stores matchmaking requests
  ├── charges the request fee atomically with request creation
  ├── runs candidate search for the admin (eligibility + scoring)
  ├── enforces the introduction quota per request
  ├── manages introduction state transitions
  ├── creates the normal match on mutual interest
  ├── enforces video-call-request rules on matched pairs
  ├── charges the video-call action on the requester's first join
  └── expires stale entities via Quartz workers
```

The backend never auto-creates a match, never auto-creates an
introduction, and never exposes contact details between users.

---

# 5. `matchmaking_preferences`

One row per user. Stores **what the user is looking for** plus
matchmaking-specific self-attributes that are evaluated as
pair-alignment dimensions.

All preferences are **typed columns** — no JSONB, no schema-on-read
filter_params. Every column maps to a known preference key; adding
a preference means adding a column.

```sql
CREATE TABLE public.matchmaking_preferences (
    id            UUID DEFAULT gen_random_uuid() NOT NULL,
    user_id       UUID NOT NULL,
    version       INTEGER NOT NULL DEFAULT 1,

    /*
     * Derived from profiles.gender at upsert time; refreshed by
     * the search pipeline when the profile changes. Matching is
     * heterosexual — candidates have the opposite gender (§10).
     */
    gender        VARCHAR(20) NULL,

    /* --- "what I am looking for" (directional dims) --- */
    min_age       INTEGER NULL,
    max_age       INTEGER NULL,
    min_height_cm INTEGER NULL,
    max_height_cm INTEGER NULL,

    /* Acceptable candidate residence country codes. */
    specific_country_codes TEXT[] NOT NULL DEFAULT '{}',

    has_children_preference   VARCHAR(20) NOT NULL DEFAULT 'any',
    wants_children_preference VARCHAR(30) NOT NULL DEFAULT 'any',

    religion_preferences  TEXT[] NOT NULL DEFAULT '{}',
    education_levels      TEXT[] NOT NULL DEFAULT '{}',
    marital_statuses      TEXT[] NOT NULL DEFAULT '{}',
    smoking_preferences   TEXT[] NOT NULL DEFAULT '{}',
    drinking_preferences  TEXT[] NOT NULL DEFAULT '{}',

    language_preference_ids  UUID[] NOT NULL DEFAULT '{}',
    ethnicity_preference_ids UUID[] NOT NULL DEFAULT '{}',

    /*
     * --- matchmaking-specific self-attributes (alignment dims) ---
     * NULL = not answered → the dimension is inactive for scoring.
     * These describe the USER, not a filter over the partner.
     */
    marriage_timeline          VARCHAR(30) NULL,
    long_distance_relationship VARCHAR(5)  NULL,   -- 'YES' | 'NO'
    family_involvement         VARCHAR(5)  NULL,   -- 'YES' | 'NO'
    religion_important         VARCHAR(5)  NULL,   -- 'YES' | 'NO'
    willing_to_relocate        VARCHAR(5)  NULL,   -- 'YES' | 'NO'

    /*
     * Free text written for the matchmaker only. Never machine-
     * enforced, never editable by admins through this column.
     */
    user_notes        TEXT NULL,
    matchmaker_notes  TEXT NULL,

    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,

    CONSTRAINT matchmaking_preferences_pkey PRIMARY KEY (id),

    CONSTRAINT matchmaking_preferences_user_fkey
        FOREIGN KEY (user_id) REFERENCES public.app_users(id)
        ON DELETE CASCADE,

    CONSTRAINT matchmaking_preferences_user_uq UNIQUE (user_id),

    CONSTRAINT matchmaking_preferences_timeline_check
        CHECK (marriage_timeline IS NULL OR marriage_timeline IN (
            'NOW', 'ONE_TO_TWO_YEARS', 'THREE_TO_FIVE_YEARS',
            'NOT_SURE')),

    CONSTRAINT matchmaking_preferences_alignment_check
        CHECK (
            (long_distance_relationship IS NULL OR
             long_distance_relationship IN ('YES', 'NO'))
        AND (family_involvement IS NULL OR
             family_involvement IN ('YES', 'NO'))
        AND (religion_important IS NULL OR
             religion_important IN ('YES', 'NO'))
        AND (willing_to_relocate IS NULL OR
             willing_to_relocate IN ('YES', 'NO'))
        )
);
```

Rules:

```text
- One row per user — upsert semantics, version increments.
- gender is profile-derived, never user-supplied here.
- has/wants_children values mirror discovery_preferences
  ('any'|'yes'|'no'|'not_sure'|'open_to_discussion');
  marital/smoking/drinking mirror the existing UPPERCASE
  catalog values. 'any' / empty array / NULL = "not set"
  (dimension inactive).
- The five alignment columns are nullable: NULL means the
  user skipped the question and the dimension does not
  participate in scoring (§11).
```

---

# 6. Preference Semantics

Two families of dimensions:

**Directional dims** ("what I am looking for") — evaluated
asymmetrically: the requester's preference is tested against the
candidate's profile facts, and the candidate's preference is
tested against the requester's profile facts.

```text
age range            → profiles-derived age within [min,max]
height range         → profiles.height_cm within [min,max]
specific_countries   → addresses.country_code ∈ array
has_children         → profile fact vs preference token
wants_children       → profile fact vs preference token
religion             → profiles.religion ∈ array
education            → profiles.education_level ∈ array
marital_status       → profiles.marital_status ∈ array
smoking              → profiles.smoking_detail ∈ array
drinking             → profiles.drinking_detail ∈ array
languages            → overlap with profile language ids
ethnicity            → overlap with profile ethnicity ids
```

**Alignment dims** ("how we approach marriage") — evaluated
symmetrically against BOTH users' own `matchmaking_preferences`
rows. A single outcome counts in both directions. These are the
new columns and require **explicit rules** (no invented logic):

```text
marriage_timeline
    MATCH when A = B, or either side is 'NOT_SURE'.
    NOW vs ONE_TO_TWO_YEARS vs THREE_TO_FIVE_YEARS mismatch
    = NO MATCH.

long_distance_relationship
    MATCH when both are 'YES', or both live in the same
    country_code (distance irrelevant), or either is NULL
    → dim inactive.
    A='NO', B='YES', different countries → NO MATCH.

family_involvement / religion_important / willing_to_relocate
    MATCH when A = B (YES↔YES or NO↔NO). Either NULL →
    dim inactive.

gender rule (always active, hard exclusion, §10)
    candidate.gender <> requester.gender — never scored.
```

A dimension is **active** when the side holding the preference
has set it (non-NULL, non-'any', non-empty array). Alignment dims
are active only when **both** sides answered.

ANY / not-set semantics:

```text
User selects a preference value → backend scores it
User leaves it ANY/empty/NULL   → dimension ignored
```

No HARD/SOFT/weight configuration exists. Admin filter
overrides (§10) still act as **hard exclusions** on top of
scoring — an admin narrowing age to 22–35 drops everyone else
from the result set entirely.

---

# 7. `matchmaking_requests`

One row represents a paid request for a human matchmaker to find
a partner. **No preference snapshot** — the request always
evaluates the user's current `matchmaking_preferences` row.

```sql
CREATE TABLE public.matchmaking_requests (
    id                UUID DEFAULT gen_random_uuid() NOT NULL,
    user_id           UUID NOT NULL,

    /*
     * The user's live preferences row. FK for referential
     * integrity only — the CURRENT row is always used, so the
     * user can adjust preferences mid-request and the next
     * search applies the new values.
     */
    matchmaking_preferences_id UUID NOT NULL,

    status            VARCHAR(30) NOT NULL DEFAULT 'OPEN',

    /*
     * Idempotency key covering BOTH the credit charge and the
     * row insert (§8). Unique — a client retry after a timeout
     * returns the existing request instead of double-charging.
     */
    request_charge_idempotency_key UUID NOT NULL,

    /*
     * Optional phone the admin may use to reach the user
     * off-platform for coordination. Never required, never
     * exposed to other users.
     */
    contact_phone     VARCHAR(40) NULL,

    created_at        TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
    completed_at      TIMESTAMPTZ NULL,
    cancelled_at      TIMESTAMPTZ NULL,
    expires_at        TIMESTAMPTZ NOT NULL,
    updated_at        TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,

    CONSTRAINT matchmaking_requests_pkey PRIMARY KEY (id),

    CONSTRAINT matchmaking_requests_user_fkey
        FOREIGN KEY (user_id) REFERENCES public.app_users(id)
        ON DELETE CASCADE,

    /*
     * NO ACTION, not RESTRICT: RESTRICT is checked immediately
     * and would break user deletion (requests + preferences are
     * cascade-deleted in one statement); NO ACTION is checked
     * at statement end, after the cascades have run (§22).
     */
    CONSTRAINT matchmaking_requests_prefs_fkey
        FOREIGN KEY (matchmaking_preferences_id)
        REFERENCES public.matchmaking_preferences(id)
        ON DELETE NO ACTION,

    CONSTRAINT matchmaking_requests_charge_key_uq
        UNIQUE (request_charge_idempotency_key),

    CONSTRAINT matchmaking_requests_status_check
        CHECK (status IN (
            'OPEN', 'ON_HOLD', 'MATCHED',
            'COMPLETED', 'CANCELLED', 'EXPIRED'))
);
```

Dropped vs the previous schema: `preferences_snapshot`,
`preferences_version`, `video_refund_key`, `video_refunded_at`,
`user_last_read_message_seq`, `admin_last_read_message_seq`.

## One Active Request Per User

```sql
CREATE UNIQUE INDEX uq_matchmaking_one_active_request_per_user
ON public.matchmaking_requests (user_id)
WHERE status IN ('OPEN', 'ON_HOLD');
```

OPEN and ON_HOLD are the only live states; the index makes a
second live request impossible.

## Request Statuses

```text
OPEN
    Waiting for admin processing. No active introduction.
ON_HOLD
    Paused while an introduction is live (PROPOSED).
MATCHED
    An introduction produced a match. Terminal.
COMPLETED
    The introduction quota is exhausted, or the admin closed
    the request, or the pair already matched organically.
    Terminal.
CANCELLED
    User/admin cancelled. Terminal.
EXPIRED
    Request lifetime exceeded with no match. Terminal.
```

## Transitions

```text
OPEN    → ON_HOLD    (introduction created)
ON_HOLD → OPEN       (introduction ended with quota remaining)
ON_HOLD → MATCHED    (introduction produced a match)
ON_HOLD → COMPLETED  (introduction ended and quota exhausted;
                      or organic-match conflict at match
                      creation — §14)
OPEN    → COMPLETED  (admin close)
OPEN    → CANCELLED  (user or admin)
OPEN    → EXPIRED    (sweeper, expires_at)
ON_HOLD → CANCELLED  (user/admin — also cancels the live
                      introduction; partner settled per §13)
```

ON_HOLD release always uses a guarded
`UPDATE ... WHERE status = 'ON_HOLD'` so a concurrent
cancellation is never resurrected.

## Expiry

`expires_at = created_at + matchmaking.request-lifetime-days`
(default 90). An hourly sweeper expires stale OPEN requests
(§19). ON_HOLD requests are never expired — they wait for the
introduction outcome. If a held request is still ON_HOLD when its
`expires_at` passes, it simply remains held; once the
introduction releases it back to OPEN the next sweep expires it
if the deadline already passed.

---

# 8. Monetization — Request Charge Only

One feature action, consumed once at request creation:

```text
PERSONAL_MATCHMAKING_REQUEST
    → the matchmaking service (admin sourcing, proposals,
      introduction quota)
```

Charging and row insertion commit in **one transaction** — a
request can never exist OPEN and unpaid:

```text
BEGIN
    consume PERSONAL_MATCHMAKING_REQUEST (existing
        subscription/credit pipeline; apply_credit_after_limit
        per plan as usual)
    INSERT matchmaking_requests (status = OPEN,
        request_charge_idempotency_key = client key,
        expires_at = now + request-lifetime-days)
COMMIT
```

- Payment failure → 4xx, no row.
- Same idempotency key retried → the unique violation resolves to
  the existing request (200 with the original row).
- The request fee is **non-refundable** (§21): it pays for the
  matchmaking service, not a guaranteed match.
- The video call is priced **separately** via the `VIDEO_CALL`
  action, charged on first join (§15) — it is no longer bundled.

After creation the client shows:
> "Your matchmaker is carefully reviewing your request."

---

# 9. Admin Request Queue

```text
GET /api/v1/admin/matchmaking/requests?status=&page=&size=
```

`status` is optional; omitting it lists all requests. Valid
values: the six request statuses. Returns a page envelope
`{ items, total, page, size }` so the admin UI can render
queue tabs (All / OPEN / ON_HOLD / EXPIRED / …) with counts.

```text
GET /api/v1/admin/matchmaking/requests/{id}
    → request + requester profile card + live preferences +
      introduction history + matchmaker notes
```

Unread-badge plumbing tied to `matchmaking_messages` is gone —
the queue badge is simply the OPEN count.

---

# 10. Admin Candidate Search

```text
POST /api/v1/admin/matchmaking/requests/{requestId}/candidates/search
body: { ...optional admin override params..., page, size }
```

The admin UI keeps the ON/OFF pattern: OFF = use the user's
preference, ON + value = override for this search. Only supplied
keys are sent; overrides never mutate the saved preferences.

## Effective Parameters

```text
effective = requester's CURRENT matchmaking_preferences,
            with each supplied override key replacing its value
```

## Eligibility — Hard Exclusions (SQL)

```text
1. request.status = 'OPEN'
2. candidate.user_id <> requester.user_id
3. candidate preferences gender <> requester gender
   (heterosexual matching assumption)
4. candidate app_user account active (not deactivated,
   anonymized or banned)
5. candidate profile visible under existing rules
   (approved photo, complete profile)
6. no ACTIVE match between the two users
7. no user_blocks row in either direction
8. neither user has a live (PROPOSED) introduction
9. the pair was not introduced within the re-introduction
   cooldown window — measured from the previous introduction's
   terminal timestamp (matchmaking.reintroduction-cooldown-days,
   default 30)
10. supplied admin overrides are applied as hard filters
```

## Scoring + Ranking

Every survivor is scored, not just filtered (§11). Results are
returned as a paginated, ranked list:

```text
ordering: overall_percentage DESC, request_id ASC
          (deterministic for pagination)
cap:      matchmaking.candidate-search-cap (default 200)
          eligible rows materialized per search
```

Each result contains:

```text
{
  request:   candidate's matchmaking request,
  profile:   { displayName, age, gender, city, region,
               countryCode, countryName, isVerified,
               primaryPhotoUrl (signed, ~1h TTL),
               lastActiveAt },
  preferences: candidate's matchmaking preference values
               (for admin review),
  match: {
    forwardPercentage,   // requester prefs satisfied by candidate
    reversePercentage,   // candidate prefs satisfied by requester
    overallPercentage,
    details: [ { dimension, matched, label } ... ]   // the "why"
  }
}
```

The backend does not decide which result becomes the
introduction — the admin reviews and picks.

## Implementation Note

```text
Phase 1 (SQL)   — §10 hard exclusions + admin overrides +
                  requester's scalar/array preference checks
                  against profile columns.
Phase 2 (SQL)   — candidate's CURRENT preference columns tested
                  against requester profile facts (bidirectional).
Phase 3 (Java)  — alignment-dim rules + score computation +
                  ranking + details generation (the rules are too
                  nuanced for reliable SQL).
```

---

# 11. Compatibility Scoring

Replaces the old counting score with three explicit percentages.

```text
forward_percentage
    = satisfied / active directional+alignment dims of the
      REQUESTER's preferences (vs candidate) × 100
    answers: "how well does B satisfy what A asked for"

reverse_percentage
    = satisfied / active dims of the CANDIDATE's preferences
      (vs requester) × 100
    answers: "how well does A satisfy what B asked for"

overall_percentage
    = round((forward + reverse) / 2)
    both sides declared preferences symmetrically, so the
    average is the balanced headline number
```

Worked example (from the requirements):

```text
Requester prefs satisfied by candidate: 8/10 → forward = 80%
Candidate prefs satisfied by requester: 7/10 → reverse = 70%
overall = 75%
```

`details` records every evaluated dimension:

```text
{ dimension: "age",        matched: true,  label: "28 within 25–32" }
{ dimension: "religion",   matched: true,  label: "CHRISTIAN ∈ […]" }
{ dimension: "marriage_timeline",
  matched: false,          label: "NOW vs THREE_TO_FIVE_YEARS" }
```

These details power the admin's "why this introduction" review
and are persisted on the created introduction (§12) so the
explanation survives in history.

An empty preference set (all ANY/NULL) yields `active = 0` —
score that direction as 100% (no requirements = nothing
violated) rather than dividing by zero; note it in `details`.

---

# 12. `matchmaking_introductions`

One row represents: **User A was introduced to User B.**

```sql
CREATE TABLE public.matchmaking_introductions (
    id                   UUID DEFAULT gen_random_uuid() NOT NULL,
    requester_request_id UUID NOT NULL,
    candidate_request_id UUID NOT NULL,

    /* Admin who created the introduction (audit). */
    initiated_by_admin_user_id UUID NOT NULL,

    /*
     * Compatibility result at creation time (§11). Persisted
     * so the admin rationale survives even after preferences
     * change (requests no longer snapshot).
     */
    forward_percentage  INTEGER NOT NULL,
    reverse_percentage  INTEGER NOT NULL,
    overall_percentage  INTEGER NOT NULL,
    match_details       JSONB NOT NULL DEFAULT '[]'::jsonb,

    /*
     * Human-readable "why this introduction" summary generated
     * from match_details (e.g. "Strong alignment on timeline,
     * religion and family plans"). Admin-editable at creation.
     */
    reason              TEXT NULL,

    requester_decision  VARCHAR(30) NOT NULL DEFAULT 'PENDING',
    candidate_decision  VARCHAR(30) NOT NULL DEFAULT 'PENDING',
    requester_decided_at TIMESTAMPTZ NULL,
    candidate_decided_at TIMESTAMPTZ NULL,

    status              VARCHAR(30) NOT NULL DEFAULT 'PROPOSED',

    /*
     * Proposal deadline — set at creation
     * (now + matchmaking.introduction-decision-hours, 72h).
     * A sweeper expires unanswered proposals.
     */
    decision_expires_at TIMESTAMPTZ NOT NULL,

    /* Set when the second INTERESTED creates the match (§14). */
    match_id            UUID NULL,

    proposed_at  TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
    completed_at TIMESTAMPTZ NULL,   -- MATCHED stamp
    created_at   TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at   TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,

    CONSTRAINT matchmaking_introductions_pkey PRIMARY KEY (id),

    CONSTRAINT matchmaking_introductions_requester_fkey
        FOREIGN KEY (requester_request_id)
        REFERENCES public.matchmaking_requests(id)
        ON DELETE CASCADE,

    CONSTRAINT matchmaking_introductions_candidate_fkey
        FOREIGN KEY (candidate_request_id)
        REFERENCES public.matchmaking_requests(id)
        ON DELETE CASCADE,

    /* Admin accounts are deactivated, never deleted (§22). */
    CONSTRAINT matchmaking_introductions_admin_fkey
        FOREIGN KEY (initiated_by_admin_user_id)
        REFERENCES public.app_users(id)
        ON DELETE RESTRICT,

    /* SET NULL — deleting a match must not erase history. */
    CONSTRAINT matchmaking_introductions_match_fkey
        FOREIGN KEY (match_id) REFERENCES public.matches(id)
        ON DELETE SET NULL,

    CONSTRAINT matchmaking_introductions_distinct_check
        CHECK (requester_request_id <> candidate_request_id),

    CONSTRAINT matchmaking_introductions_decision_check
        CHECK (
            requester_decision IN
                ('PENDING', 'INTERESTED', 'NOT_INTERESTED')
        AND candidate_decision IN
                ('PENDING', 'INTERESTED', 'NOT_INTERESTED')),

    CONSTRAINT matchmaking_introductions_status_check
        CHECK (status IN (
            'PROPOSED', 'DECLINED', 'MATCHED',
            'CANCELLED', 'EXPIRED'))
);
```

Indexes:

```sql
/* One live introduction per side of a request. */
CREATE UNIQUE INDEX uq_matchmaking_active_requester_introduction
ON public.matchmaking_introductions (requester_request_id)
WHERE status = 'PROPOSED';

CREATE UNIQUE INDEX uq_matchmaking_active_candidate_introduction
ON public.matchmaking_introductions (candidate_request_id)
WHERE status = 'PROPOSED';

CREATE INDEX idx_matchmaking_introductions_match
ON public.matchmaking_introductions (match_id)
WHERE match_id IS NOT NULL;

CREATE INDEX idx_matchmaking_introductions_sweep
ON public.matchmaking_introductions (decision_expires_at)
WHERE status = 'PROPOSED';
```

`MUTUAL_INTEREST` no longer exists as a stored status — mutual
interest creates the match in the same transaction that lands the
second INTERESTED (§14).

## Introduction Quota

`matchmaking.introductions-per-request` (default **1**) caps how
many introductions a request may consume:

```text
consumed = introductions in DECLINED / MATCHED / EXPIRED
           (admin CANCELLED does not consume — ops correction)

when an introduction ends without a match:
    consumed < quota  → request → OPEN (searchable again)
    consumed = quota  → request → COMPLETED
```

With the default quota of 1, a declined or expired proposal
completes the request — "the request produces only one
introduction". Raising the config lets a request try again
without schema change.

When the introduction is created, both requests move
`OPEN → ON_HOLD` in the same transaction; neither can appear in
another candidate search. On release, the guarded ON_HOLD→OPEN
update prevents resurrecting a concurrently cancelled request.

## Proposal Payload (user-facing)

```text
{ introductionId, proposedAt, decisionExpiresAt,
  myDecision,
  candidate: { displayName, age, gender, city, region,
               countryCode, isVerified,
               photos: [signed URLs] },
  relevantPreferences: { marriageTimeline, religionImportant,
                         ...the candidate's answered alignment
                         dims },
  match: { forwardPercentage, reversePercentage,
           overallPercentage, reason },
  reason: "why this introduction" }
```

The other side's decision is never exposed prematurely.

## Transitions

```text
PROPOSED → DECLINED   (either side NOT_INTERESTED;
                       requests settle per quota, §13)
PROPOSED → MATCHED    (second INTERESTED → match created,
                       same tx — §14)
PROPOSED → EXPIRED    (sweeper, decision deadline;
                       requests settle per quota)
*        → CANCELLED  (admin cancel / request cancellation;
                       does not consume quota → requests OPEN)
```

---

# 13. Decision Flow

```text
Proposal A ↔ B (PROPOSED)
      │
      ▼
Both independently decide
      │
   ┌──┴───┐
   │      │
  NO     both
   │    INTERESTED
   ▼      │
DECLINED  ▼
   │   MATCH created (same tx)
   ▼      │
requests  ▼
 settle  requests → MATCHED
per §13  chat unlocks
```

Rules:

```text
- Decision writes lock the introduction row (SELECT ...
  FOR UPDATE) so near-simultaneous decisions serialize.
- Re-check user_blocks inside the locked transaction; a late
  block declines the introduction like NOT_INTERESTED.
- Decisions are idempotent — resubmitting the same value
  returns the current state.
- decision_expires_at enforcement: sweeper (§19) + lazy
  finalization on any load of the introduction.
```

---

# 14. Match Creation

When the second INTERESTED lands, inside the same transaction:

```text
1. Re-check: no ACTIVE match exists between the pair
   (they may have matched via discovery while the proposal
   was open).
      found → introduction CANCELLED (not consumed),
              both requests → COMPLETED, admin notified,
              decision response: { alreadyMatched: true,
              matchId }
2. INSERT matches (match_source = 'MATCHMAKING',
   matchmaking_introduction_id = introduction.id,
   like-action columns NULL).
3. introduction → MATCHED, match_id set, completed_at stamped.
4. both requests → MATCHED.
```

`unique_active_match_pair` stays the race backstop — an insert
conflict between the check and the write resolves identically to
the explicit already-matched result.

`matches` table requirements (unchanged from previous design):

```text
- user_one_id < user_two_id ordering (existing check)
- user_one_like_action_id / user_two_like_action_id /
  created_by_action_id nullable
- match_source extended to allow 'MATCHMAKING'
- matchmaking_introduction_id FK, partial unique index
- no fake LIKE rows are ever inserted into
  user_discovery_actions
```

Match validation becomes source-specific:

```text
DISCOVERY    → validate discovery Like actions
BLIND_DATE   → validate Blind Date rules
MATCHMAKING  → validate the introduction:
               belongs to both users, status = MATCHED,
               both decisions = INTERESTED
```

Once the match exists it is an ordinary match — unmatching,
blocking and messaging follow the normal lifecycle with zero
matchmaking involvement. **All post-match communication happens
inside the existing conversation feature**: messages and video
calls, no matchmaking-specific messaging exists anywhere.

---

# 15. Video Call Requests (post-match capability)

Video calls are a **general matched-pair capability**, not a
matchmaking step. Any two users with an ACTIVE match — regardless
of `match_source` — may use them, surfaced as a conversation
action in the existing chat UI.

## Flow

```text
User A (requester) taps "Request video call" in the
conversation
    → video_call_requests row, status = PENDING
    → User B notified (conversation + push)

User B (responder):
    ACCEPT  → status ACCEPTED; backend mints the channel name
              via the configured VideoCallProvider
    DECLINE → status DECLINED (terminal)
    (A may CANCEL while PENDING)

Both join when ready:
    → join endpoint returns Agora credentials
      { channelName, token, uid, expiresAt }
    → the REQUESTER's first join consumes the VIDEO_CALL
      feature action — charged only on join, not on accept

Call ends → status COMPLETED
For another call → a NEW request must be created
```

## `video_call_requests`

One row = one request = at most one call. Request lifecycle and
call session live on the same row (strictly 1:1).

```sql
CREATE TABLE public.video_call_requests (
    id                UUID DEFAULT gen_random_uuid() NOT NULL,

    /*
     * Scoped to a match. Deleting the match removes the call
     * history — calls are meaningless without the match.
     */
    match_id          UUID NOT NULL,
    requester_user_id UUID NOT NULL,
    responder_user_id UUID NOT NULL,

    status            VARCHAR(20) NOT NULL DEFAULT 'PENDING',

    /*
     * Pending window — the responder must answer before this
     * (matchmaking.video-call-request-expiry-hours, default 48h).
     * Sweeper expires stale PENDING rows.
     */
    request_expires_at TIMESTAMPTZ NOT NULL,

    responded_at      TIMESTAMPTZ NULL,   -- ACCEPTED/DECLINED stamp

    /*
     * --- call session (populated on ACCEPT) ---
     * Opaque channel/room name minted by the configured
     * VideoCallProvider (video.platform). Join tokens are
     * issued on demand, never stored.
     */
    channel_name      VARCHAR(255) NULL,

    /*
     * Requester-side charge idempotency. Stamped by the first
     * successful requester join; UNIQUE prevents a double
     * VIDEO_CALL charge under retries/races.
     */
    requester_charge_key UUID NULL,
    requester_charged_at TIMESTAMPTZ NULL,

    requester_joined_at TIMESTAMPTZ NULL,
    responder_joined_at TIMESTAMPTZ NULL,
    ended_at            TIMESTAMPTZ NULL,

    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,

    CONSTRAINT video_call_requests_pkey PRIMARY KEY (id),

    CONSTRAINT video_call_requests_match_fkey
        FOREIGN KEY (match_id) REFERENCES public.matches(id)
        ON DELETE CASCADE,

    CONSTRAINT video_call_requests_requester_fkey
        FOREIGN KEY (requester_user_id)
        REFERENCES public.app_users(id) ON DELETE CASCADE,

    CONSTRAINT video_call_requests_responder_fkey
        FOREIGN KEY (responder_user_id)
        REFERENCES public.app_users(id) ON DELETE CASCADE,

    CONSTRAINT video_call_requests_distinct_users_check
        CHECK (requester_user_id <> responder_user_id),

    CONSTRAINT video_call_requests_status_check
        CHECK (status IN (
            'PENDING', 'ACCEPTED', 'DECLINED',
            'CANCELLED', 'EXPIRED', 'COMPLETED')),

    /* Channel + charge only exist once accepted. */
    CONSTRAINT video_call_requests_channel_check
        CHECK (status = 'PENDING' OR channel_name IS NOT NULL),

    CONSTRAINT video_call_requests_charge_key_uq
        UNIQUE (requester_charge_key)
);
```

```sql
/* One active request per match — PENDING or ACCEPTED. */
CREATE UNIQUE INDEX uq_video_call_request_per_match
ON public.video_call_requests (match_id)
WHERE status IN ('PENDING', 'ACCEPTED');

/* Sweeper: stale pending requests. */
CREATE INDEX idx_video_call_requests_sweep
ON public.video_call_requests (request_expires_at)
WHERE status = 'PENDING';
```

## State Machine

```text
PENDING  → ACCEPTED   (responder accepts → channel minted)
PENDING  → DECLINED   (responder declines — terminal)
PENDING  → CANCELLED  (requester withdraws — terminal)
PENDING  → EXPIRED    (sweeper — terminal)
ACCEPTED → COMPLETED  (call ended — terminal)

COMPLETED means the call ended; the request row then serves
as call history. A new call = a new request row.
```

## Rules

```text
- Only match participants can create/answer/join.
- Only one PENDING-or-ACCEPTED request per match (partial
  unique index) — a second tap returns the live request.
- The match must be ACTIVE at request and at accept time;
  an unmatched pair cancels the live request (listener or
  lazy check).
- Direction is stored (requester/responder) — state labels in
  the client are role-aware ("B requested a call" vs
  "You requested a call").
- No response before request_expires_at → EXPIRED.
- Video charge applies ONLY to the requester, consumed on
  their first successful join (idempotent via
  requester_charge_key). Insufficient credit → join fails
  with the standard billing error; the responder joins free.
- No refund: once the requester joined, the call was delivered.
- Join credentials are minted per call by the configured
  VideoCallProvider (video.platform — AGORA today) and are
  never persisted; the vendor name never enters the domain
  model, API or database.
- Call completion: either participant ends it via the end
  endpoint (idempotent) — or the provider webhook later.
- Block during a live request → the request is CANCELLED.
```

---

# 16. Notifications

Reuse the existing notification outbox/dedup infrastructure.

Matchmaking events:

```text
MATCHMAKING_REQUEST_CREATED
MATCHMAKING_REQUEST_CANCELLED
MATCHMAKING_REQUEST_EXPIRED
MATCHMAKING_INTRODUCTION_PROPOSED      (to both users)
MATCHMAKING_INTRODUCTION_DECLINED      (to both users)
MATCHMAKING_INTRODUCTION_EXPIRED       (to both users)
MATCHMAKING_INTRODUCTION_CANCELLED     (to both users)
MATCHMAKING_MATCH_CREATED              (to both users)
```

Video-call events (general — any match source):

```text
VIDEO_CALL_REQUESTED   → responder
VIDEO_CALL_ACCEPTED    → requester
VIDEO_CALL_DECLINED    → requester
VIDEO_CALL_CANCELLED   → responder
VIDEO_CALL_EXPIRED     → requester
```

Removed: all `MATCHMAKING_MESSAGE_*` and
`MATCHMAKING_VIDEO_*` (scheduling/contact/outcome) events — the
features they served no longer exist.

---

# 17. Public API (User-Facing)

Preferences:

```text
GET /api/v1/matchmaking/preferences
    → all typed preference fields + version | 404 if never saved

PUT /api/v1/matchmaking/preferences
    body: every preference field (validated against the
          enum/catalog registry — unknown/invalid → 400)
    → upsert, increments version, re-derives gender from profile
```

Requests:

```text
POST /api/v1/matchmaking/requests
    body: { idempotencyKey, contactPhone? }
    → requires saved preferences + complete core profile +
      ≥1 approved photo (a NULL-backed profile would fail every
      reciprocal check — rejected before charging) → 422
    → charges PERSONAL_MATCHMAKING_REQUEST and inserts OPEN in
      one transaction (§8)
    → same key retried → the existing request

PATCH /api/v1/matchmaking/requests/{requestId}/contact
    body: { contactPhone }   (null clears) — owner, non-terminal

GET /api/v1/matchmaking/requests/active
    → the caller's live request + live introduction, or 404

GET /api/v1/matchmaking/requests?cursor=
    → own history

POST /api/v1/matchmaking/requests/{requestId}/cancel
    → OPEN → CANCELLED
    → ON_HOLD → CANCELLED; live introduction CANCELLED and the
      partner request → OPEN (cancellation never consumes quota)
    → terminal → 409
```

Introductions:

```text
GET /api/v1/matchmaking/introductions/current
    → the caller's pending proposal (§12 payload) or null

GET /api/v1/matchmaking/introductions?cursor=
    → own history (never reveals the other side's decision early)

POST /api/v1/matchmaking/introductions/{id}/decision
    body: { decision: INTERESTED | NOT_INTERESTED }
    → idempotent; the second INTERESTED creates the match in
      the same transaction (§14)
    → second-INTERESTED response: { matchId } or
      { alreadyMatched: true, matchId }
```

Removed user endpoints: everything under
`/requests/{id}/messages*` and `/video-calls*` — the features no
longer exist.

Video calls (match-scoped, parallel to `/api/v1/messages`):

```text
POST /api/v1/video-call-requests
    body: { matchId }
    → participant only, ACTIVE match only; creates PENDING or
      returns the live one (§15 unique index)

GET /api/v1/matches/{matchId}/video-call-requests?cursor=
    → call history + current live request for the pair;
      role-aware state for the caller

POST /api/v1/video-call-requests/{id}/accept    → responder
POST /api/v1/video-call-requests/{id}/decline   → responder
POST /api/v1/video-call-requests/{id}/cancel    → requester, PENDING only

POST /api/v1/video-call-requests/{id}/join
    → participant, while ACCEPTED
    → { channelName, token, uid, expiresAt } minted on demand
    → the requester's first successful join consumes VIDEO_CALL
      (idempotent via requester_charge_key); insufficient
      credit → 402/billing error

POST /api/v1/video-call-requests/{id}/end
    → participant, while ACCEPTED; idempotent → COMPLETED
```

---

# 18. Admin API

All endpoints require the existing admin role check.

```text
Request queue:
GET  /api/v1/admin/matchmaking/requests?status=&page=&size=
GET  /api/v1/admin/matchmaking/requests/{id}
POST /api/v1/admin/matchmaking/requests/{id}/cancel
POST /api/v1/admin/matchmaking/requests/{id}/complete
PATCH /api/v1/admin/matchmaking/requests/{id}/matchmaker-notes
     → writes matchmaking_preferences.matchmaker_notes
       (admin-only field; 404 if the request has no prefs row)

Private notes feed (append-only, request-scoped):
GET  /api/v1/admin/matchmaking/requests/{id}/notes
POST /api/v1/admin/matchmaking/requests/{id}/notes { note }

Candidate search:
POST /api/v1/admin/matchmaking/requests/{requestId}/candidates/search
     body: { ...overrides..., page, size }
     → ranked CandidateMatchView[] (§10): request + profile
       card + candidate preferences + match scores/details

Introductions:
POST /api/v1/admin/matchmaking/introductions
     body: { requesterRequestId, candidateRequestId, reason? }
     → revalidates eligibility (§10/§20), re-runs scoring,
       stamps percentages + details + reason, inserts the row
       and puts both requests ON_HOLD — one transaction
GET  /api/v1/admin/matchmaking/introductions?status=&userId=&search=&page=&size=
GET  /api/v1/admin/matchmaking/introductions/{id}
POST /api/v1/admin/matchmaking/introductions/{id}/cancel
     → CANCELLED + both requests → OPEN (quota not consumed)

Dashboard:
GET  /api/v1/admin/matchmaking/stats
     → funnel counts: requests by status, introductions by
       status, action-needed counters (awaiting decision,
       proposals expiring soon)
```

Removed admin endpoints: everything under
`/requests/{id}/messages*`, `/video-calls*` and
`/introductions/{id}/video-call` — plus outcome/arrange/contact
operations. There is no matchmaking video queue anymore; the
admin never mediates calls.

---

# 19. Workers & Configuration

Quartz workers (existing `QuartzConfig` pattern):

```text
MatchmakingRequestSweeper      (hourly)
    OPEN + expires_at < now → EXPIRED, notify user
    (ON_HOLD never swept)

MatchmakingIntroductionSweeper (every 5 min)
    PROPOSED + decision_expires_at < now
        → EXPIRED, both requests settle per §13
          (guarded UPDATE), notify both users

VideoCallRequestSweeper        (every 15 min)
    PENDING + request_expires_at < now → EXPIRED,
    notify requester
```

Lazy finalization accompanies sweepers: whenever a service loads
an overdue entity it runs the same finalize routine inside that
request's transaction and returns the updated state — a user
opening the app one second past a deadline sees the final state
immediately.

`application.yml`:

```yaml
matchmaking:
  request-lifetime-days: 90            # → requests.expires_at
  introduction-decision-hours: 72      # → introductions.decision_expires_at
  reintroduction-cooldown-days: 30     # → §10 item 9
  candidate-search-cap: 200            # → §10 materialized cap
  introductions-per-request: 1         # → §12 quota
  video-call-request-expiry-hours: 48  # → video_call_requests.request_expires_at

video:
  platform: ${VIDEO_PLATFORM:AGORA}    # existing provider SPI
  agora:
    app-id: ${AGORA_APP_ID}
    app-certificate: ${AGORA_APP_CERTIFICATE}
    token-ttl-seconds: ${AGORA_TOKEN_TTL_SECONDS:3600}
```

---

# 20. Pair Protection

Checked at candidate-search time and re-validated inside the
introduction-creation transaction:

```text
1. existing ACTIVE match between the pair → skip
2. live (PROPOSED) introduction on either request → skip
3. user_blocks in either direction → skip
4. pair introduced within reintroduction-cooldown-days
   (from the previous introduction's terminal timestamp) → skip
```

Plus the conflict at match creation: a pair that
matched organically during the proposal gets `alreadyMatched`
instead of a second match row (§14).

---

# 21. Charging & Refund Policy

```text
Request fee (PERSONAL_MATCHMAKING_REQUEST)
    Charged once, atomically with the request insert.
    Non-refundable — it pays for the matchmaking service
    (search, curation, the introduction quota), not for a
    guaranteed match. No refund on cancel, expiry, declined
    introductions or quota exhaustion. Goodwill refunds stay a
    manual admin action through the existing credit-grant
    tooling.

Video call (VIDEO_CALL)
    Not bundled. Charged to the REQUESTER on first join only;
    the responder joins free. Idempotent via
    requester_charge_key (UNIQUE). Once charged it is never
    refunded — the call was deliverable.

Nothing else is charged:
    No escrow, no per-introduction fee, no outcome fee.
```

`MATCHMAKING_ESCROW_REFUND` credit source and
`PERSONAL_MATCHMAKING_VIDEO_ESCROW` feature action are dropped —
existing historical rows remain untouched in production data.

---

# 22. Deletion Semantics

```text
app_users deleted
    → matchmaking_requests          CASCADE (user-owned)
    → matchmaking_preferences       CASCADE
    → video_call_requests           CASCADE via matches
      (and directly via requester/responder FKs)

matchmaking_requests deleted
    → matchmaking_introductions     CASCADE
    → matchmaking_admin_notes       CASCADE
      (introductions and notes are meaningless without
      their requests)

matchmaking_requests → matchmaking_preferences
    NO ACTION — checked at statement end, after the cascades
    run (RESTRICT would abort the delete mid-cascade)

matches deleted
    → matchmaking_introductions.match_id      SET NULL
    → matches.matchmaking_introduction_id     SET NULL
    → video_call_requests                     CASCADE

Admin references (initiated_by_admin_user_id,
admin_notes.admin_user_id) stay RESTRICT — admin accounts are
deactivated, never hard-deleted.
```

If the platform switches to anonymize-instead-of-delete, the
CASCADE paths simply never fire — nothing depends on hard
deletion happening.

---

# 23. Complete Relationship Diagram

```text
                       app_users
                           │
              ┌────────────┴────────────┐
              ▼                         ▼
          profiles            matchmaking_preferences
                                        │
                                        ▼
                              matchmaking_requests
                                        │
                    ┌───────────────────┤
                    ▼                   ▼
         matchmaking_admin_notes   Request A + Request B
              (admin-only feed)         │
                                        ▼
                           matchmaking_introductions
                           (scores + reason + decisions)
                                        │
                            both INTERESTED ▼
                                     matches
                              match_source=MATCHMAKING
                                        │
                            ┌───────────┴───────────┐
                            ▼                       ▼
                      existing messaging      video_call_requests
                      (conversation)          (PENDING → ACCEPTED
                                               → join → COMPLETED)
```

---

# 24. New Tables

```text
video_call_requests
```

Kept (modified): `matchmaking_preferences`, `matchmaking_requests`,
`matchmaking_admin_notes`, `matchmaking_introductions`, `matches`.

Removed: `matchmaking_messages`, `matchmaking_video_calls`.

---

# 25. Existing Tables Reused

```text
app_users
profiles
profile_photos
user_blocks
matches
messages                      (post-match conversation)

feature_actions               (PERSONAL_MATCHMAKING_REQUEST, VIDEO_CALL)
subscription_plan_limit_and_cost
user_action_limits_tracker
user_credit_balances
user_credit_ledger

notification_outbox_events
```

Feature action additions:

```text
VIDEO_CALL — charged to the video-call requester on first join.
             No plan rows are seeded; configured per plan via
             subscription_plan_limit_and_cost like MESSAGE.
```

---

# 26. Final End-to-End Flow

```text
                         USER A
                           │
                           ▼
                Saved Matchmaking Preferences
                (typed columns incl. alignment dims)
                           │
                           ▼
                  Create Matchmaking Request
                  (PERSONAL_MATCHMAKING_REQUEST charged,
                   request + charge in one tx)
                           │
                           ▼
                          OPEN
              "Your matchmaker is carefully
               reviewing your request"
                           │
                           ▼
                         ADMIN
                           │
                    Select Request A
                           │
                    Candidate Search
                     (eligibility + bidirectional
                      preference scoring + overrides)
                           │
                     Ranked results:
                     profile + prefs + forward/reverse/
                     overall % + match details
                           │
                    Admin selects B + writes
                    "why this introduction"
                           │
                           ▼
                     INTRODUCTION A ↔ B
                     (both requests ON_HOLD,
                      decision_expires_at set)
                           │
              ┌────────────┴────────────┐
              │                         │
          Either NO                 Both YES
              │                         │
              ▼                         ▼
        DECLINED / quota           MATCH created
        check → OPEN or            (same tx, source=
        COMPLETED                  MATCHMAKING)
              │                         │
              ▼                         ▼
         search again            existing conversation:
         or done                 messaging + video call
                                 requests (VIDEO_CALL
                                 charged on requester join)
```

---

# 27. Core Rules

```text
1.  Users maintain reusable matchmaking preferences as typed
    columns — directional dims plus the five alignment dims
    (marriage_timeline, long_distance_relationship,
    family_involvement, religion_important, willing_to_relocate).

2.  Matchmaking preferences are separate from discovery
    preferences.

3.  No preference snapshots — requests always evaluate the
    user's CURRENT matchmaking_preferences row under current
    business rules. Changing preferences mid-request affects
    the next search; in-flight proposals keep their recorded
    scores and reason.

4.  Matchmaking is always admin-initiated. The backend never
    auto-matches.

5.  Admin selects an OPEN request, searches, reviews ranked
    scored candidates, picks one.

6.  Candidate eligibility is a hard SQL filter (§10); preference
    satisfaction is scored — forward %, reverse %, overall %
    (average) with per-dimension details.

7.  Alignment dims are active only when both users answered;
    NOT_SURE timeline matches anything; equal YES/NO answers
    align; long-distance NO vs YES only matches same-country.

8.  Admin filter overrides apply per search as hard filters on
    top of scoring; they never modify saved preferences.

9.  Creating an introduction: quota check, revalidation, scores
    + details + reason persisted, both requests → ON_HOLD, one
    transaction.

10. introductions-per-request (default 1) caps consumed
    introductions; DECLINED/EXPIRED consume it, CANCELLED does
    not. Quota remaining → request reopens; exhausted →
    COMPLETED.

11. Only one live (PROPOSED) introduction per request — partial
    unique indexes on both sides.

12. Both users independently decide INTERESTED/NOT_INTERESTED.
    The other side's decision is never shown early.

13. Either NOT_INTERESTED → DECLINED, requests settle per quota.

14. Second INTERESTED → match created in the same transaction
    (source = MATCHMAKING), both requests → MATCHED. No video
    step, no post-call consent gate.

15. The existing matches table is the source of truth; no fake
    LIKE actions, no matchmaking_matches table.

16. Proposals have decision_expires_at; a sweeper + lazy
    finalization expire unanswered proposals.

17. Requests have expires_at (90d); sweeper expires stale OPEN
    requests; ON_HOLD is never swept.

18. There is NO matchmaking messaging — admin coordination is
    off-platform/ops-side; post-match chat uses the existing
    messaging feature only.

19. There is NO matchmaking video flow — video calls are a
    general post-match capability via video_call_requests.

20. Video call request: one PENDING/ACCEPTED per match;
    requester/responder direction stored; responder accept
    mints the channel; requester's first join consumes the
    VIDEO_CALL action (idempotent via requester_charge_key);
    responder joins free; expiry sweeper drops stale PENDING.

21. The request fee is non-refundable; the video charge is
    non-refundable once consumed. No escrow exists anywhere.

22. The one-active-request partial unique index plus guarded
    ON_HOLD releases make concurrent state races safe; decision
    writes lock the introduction row FOR UPDATE.

23. An organic match during an open proposal yields
    alreadyMatched — introduction CANCELLED (quota not
    consumed), both requests COMPLETED.

24. matchmaker_notes is admin-only free text on preferences;
    admin notes feed is append-only on the request. Neither
    affects matching.

25. Deletion: user-owned rows cascade; match back-references
    SET NULL; admin audit references RESTRICT.

26. All timing tunables and the introduction quota are
    application.yml config — no DB config table.
```

---

# 28. Removal / Migration Checklist

For the implementation pass, the previous schema and code shed
the following (data-preserving where history exists):

```text
DROP     matchmaking_messages (table + repo/service/endpoints)
DROP     matchmaking_video_calls (table + repo/service/endpoints
         + workers: outcome sweep, stale-call sweep)
DROP     requests columns: preferences_snapshot,
         preferences_version, video_refund_key,
         video_refunded_at, user_last_read_message_seq,
         admin_last_read_message_seq
DROP     feature action PERSONAL_MATCHMAKING_VIDEO_ESCROW
         (keep historical ledger rows untouched)
DROP     credit_source_type value MATCHMAKING_ESCROW_REFUND
         (historical rows remain)
DROP     MatchmakingEscrowService, MatchmakingVideoCallService,
         introduction message endpoints, contact/outcome flows

ALTER    matchmaking_preferences: add the five alignment
         columns (nullable)
ALTER    matchmaking_introductions: add forward/reverse/
         overall_percentage, match_details JSONB, reason;
         remove search_source, effective_filter_params,
         admin_override_params; narrow status CHECK (drop
         MUTUAL_INTEREST — historical rows migrate to MATCHED
         or their resolved state)
ADD      video_call_requests (new table)
ADD      feature action VIDEO_CALL
ADD      notifications: VIDEO_CALL_* events

MOVE     matchmaking/video/* (VideoCallProvider SPI, Agora
         provider, VideoConfig) out of the matchmaking package —
         the provider now serves general video_call_requests
```
