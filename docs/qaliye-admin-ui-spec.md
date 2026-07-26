# Qaliye Admin Console — Next.js UI Implementation Specification

**Source backend contract:** `docs/admin-backend-endpoints.md`  
**Target:** Next.js App Router admin console  
**Primary users:** `ADMIN` and `MODERATOR`  
**Design goal:** A secure, efficient, desktop-first operations console for managing Qaliye users, moderation queues, payments, campaigns, catalog data, and audit history.

---

## 1. Product principles

1. **Operations first.** The dashboard must prioritise items requiring human action, not decorative analytics.
2. **Do not invent backend capabilities.** Actions must only be shown when an endpoint exists and the signed-in role is authorised.
3. **Make dangerous actions difficult to perform accidentally.** Bans, role changes, deletion, refunds, campaign activation, and transaction approval require confirmation.
4. **Use the secret route only as an additional obscurity layer.** Real security must come from authenticated server-side role checks.
5. **Keep admin UI separate from the consumer product.** Do not display an Admin link in the public website, user menu, footer, sitemap, or mobile app.
6. **Prefer clarity over density.** Tables may be information-rich, but every screen should have a clear primary action and predictable filters.
7. **Never imply live trends when only snapshot data is available.** The current analytics endpoint returns aggregate values, not time-series data.

---

## 2. Access strategy and secret admin path

### 2.1 Public behaviour

The public Qaliye UI must contain **no visible or hidden navigation link** to the admin console.

Do not include the admin path in:

- Public header or footer navigation
- Profile menus
- HTML metadata
- Sitemap
- Client-side environment variables
- Public JavaScript constants
- Documentation shipped with the frontend
- Analytics event names

### 2.2 Environment configuration

Use a private server environment variable:

```bash
ADMIN_CONSOLE_PATH=/ops-<long-random-value>
```

Requirements:

- Do not prefix it with `NEXT_PUBLIC_`.
- Use at least 24 random URL-safe characters.
- Store production values in the hosting platform's encrypted environment settings.
- Use a different value for local, staging, and production environments.
- Rotate it if exposed.
- Never commit the production path to source control.

Example only:

```bash
ADMIN_CONSOLE_PATH=/ops-R7m4Wc2qL9xV6nK8pT3yZ5
```

### 2.3 Recommended routing architecture

Keep the real application routes under a fixed internal route group and rewrite the secret path to it.

```text
Public URL:
  /<ADMIN_CONSOLE_PATH>/users

Internal Next.js route:
  /__qaliye_console/users
```

Suggested route implementation:

```text
app/
  __qaliye_console/
    layout.tsx
    page.tsx
    users/
    moderation/
    billing/
    notifications/
    promotions/
    catalog/
    audit-log/
```

Configure a server-side rewrite from the private path to the internal path. Block direct requests to `/__qaliye_console/*`.

Important:

- The rewrite is not the security boundary.
- Middleware and every server-side data operation must validate the JWT and role.
- Backend endpoints must continue enforcing their existing role rules.

### 2.4 Middleware behaviour

Apply middleware to all non-static requests and use early returns for public routes.

For admin paths:

1. Check whether the request path begins with `ADMIN_CONSOLE_PATH`.
2. Read the authenticated session from a secure server-side cookie.
3. Validate token expiry and signature.
4. Resolve the current role from trusted JWT claims or a trusted current-user endpoint.
5. Allow:
   - `ADMIN`
   - `MODERATOR` only for screens explicitly permitted in this specification
6. Return a neutral `404 Not Found` for:
   - Unauthenticated access, unless the request is for the secret admin sign-in route
   - Authenticated users with `USER` role
   - Direct access to `/__qaliye_console/*`
7. Never reveal that an admin console exists in a `403` page shown to ordinary users.

### 2.5 Admin sign-in

Secret route:

```text
/<ADMIN_CONSOLE_PATH>/sign-in
```

UI:

- Qaliye logo
- Title: **Admin Console**
- Standard authentication form or existing Qaliye authentication flow
- No sign-up link
- No social proof or consumer marketing content
- Optional warning: “Authorised staff only”
- Generic invalid-credentials message
- Rate limiting and temporary lockout
- MFA strongly recommended for all `ADMIN` accounts

After sign-in:

- `ADMIN` → Dashboard
- `MODERATOR` → Moderator dashboard
- `USER` or unknown role → neutral 404 and session cleared from the admin context

### 2.6 Security headers

Set these headers for every admin response:

```text
Cache-Control: no-store, private
X-Robots-Tag: noindex, nofollow, noarchive
Content-Security-Policy: strict application policy
Referrer-Policy: no-referrer
X-Content-Type-Options: nosniff
Permissions-Policy: disable unneeded browser capabilities
```

Recommended additional controls:

- Secure, `HttpOnly`, `SameSite=Strict` session cookies
- Short admin session lifetime
- Idle timeout
- Re-authentication before refunds, role elevation, and account deletion
- Origin validation or CSRF tokens for cookie-authenticated mutations
- Audit every admin mutation
- Never store bearer tokens in `localStorage`

---

## 3. Roles and UI permissions

The frontend must hide unavailable navigation and controls, but backend authorisation remains mandatory.

| Capability | MODERATOR | ADMIN |
|---|---:|---:|
| View analytics dashboard | Yes | Yes |
| View photo review queues and counts | Yes | Yes |
| Approve/reject photos | No endpoint available | No endpoint available |
| View users | No | Yes |
| Change user status | No | Yes |
| Change user role | No | Yes |
| Delete user | No | Yes |
| Send direct push notification | No | Yes |
| Manage notification campaigns | No | Yes |
| Review payment orders | No | Yes |
| Refund verified orders | No | Yes |
| Manage promotional campaigns | No | Yes |
| Review manual transactions | No | Yes |
| Manage languages and ethnicities | No | Yes |
| View audit log | No | Yes |

### 3.1 Role-aware navigation

For `MODERATOR`, show only:

- Overview
- Photo Review
- Account menu / Sign out

For `ADMIN`, show the complete navigation.

Never render inaccessible links and then rely on a disabled state. Do not leak route names to unauthorised roles.

---

## 4. Information architecture

### 4.1 Sidebar navigation

```text
Overview

OPERATIONS
  Users
  Photo Review
  Payment Orders
  Manual Transactions

ENGAGEMENT
  Notification Campaigns
  Direct Notification

GROWTH
  Promotional Campaigns

CATALOG
  Languages
  Ethnicities

GOVERNANCE
  Audit Log
```

### 4.2 Recommended routes

The examples below use `<admin>` as a placeholder for the configured secret path.

```text
/<admin>                                  Dashboard
/<admin>/sign-in                         Admin sign-in

/<admin>/users                           User list
/<admin>/users/[userId]                  User detail

/<admin>/photo-review                    Photo review queue

/<admin>/billing/orders                  Payment orders
/<admin>/billing/orders/[orderId]        Payment order detail
/<admin>/billing/transactions            Manual transactions

/<admin>/notifications/campaigns         Notification campaigns
/<admin>/notifications/campaigns/new     Create notification campaign
/<admin>/notifications/campaigns/[id]    Campaign detail/edit
/<admin>/notifications/direct            Direct notification composer

/<admin>/promotions                      Promotional campaigns
/<admin>/promotions/new                  Create promotional campaign
/<admin>/promotions/[id]                 Promotion detail
/<admin>/promotions/[id]/redemptions     Promotion redemptions

/<admin>/catalog/languages               Languages
/<admin>/catalog/ethnicities             Ethnicities

/<admin>/audit-log                       Audit log
```

Do not create a Reports route yet. The analytics endpoint exposes report counts, but the provided backend contract has no report list, detail, assignment, or resolution endpoints.

---

## 5. Global shell and visual design

### 5.1 Visual direction

The admin console should feel trustworthy and operational, not like the consumer dating experience.

Use:

- Qaliye purple as the primary accent
- Neutral grey page backgrounds
- White or near-white surfaces
- Strong semantic colours for status
- Subtle borders instead of excessive shadows
- 8px spacing system
- 10–12px card radius
- Compact but readable tables
- High-contrast text
- Accessible focus rings

Suggested tokens:

```css
--brand-50:  #F7F2FF;
--brand-100: #EDE2FF;
--brand-500: #7C3AED;
--brand-600: #6D28D9;
--brand-700: #5B21B6;

--surface:        #FFFFFF;
--page:           #F7F7FA;
--sidebar:        #111318;
--text-primary:   #17171B;
--text-secondary: #666672;
--border:         #E5E5EA;

--success: #16815D;
--warning: #B7791F;
--danger:  #C63B4E;
--info:    #2563EB;
```

### 5.2 Desktop shell

- Fixed left sidebar: 248px expanded, 72px collapsed
- Sticky top bar: 64px
- Main content max width: 1600px
- Page padding: 24px desktop, 16px tablet
- Breadcrumbs above page title when deeper than one level
- Right side of top bar:
  - Optional environment badge: `STAGING`
  - Current role badge
  - Admin display name
  - Account menu
  - Sign out

### 5.3 Mobile and tablet

This is desktop-first, but it must remain usable on tablet.

- Sidebar becomes a drawer below 1024px
- Tables switch to horizontally scrollable containers
- Detail pages use stacked sections
- Confirmation dialogs become full-screen sheets on narrow screens
- Do not hide important identifiers or statuses on mobile
- Dangerous actions remain available only through explicit overflow menus or action sections

### 5.4 Common page header

Every page header includes:

- Breadcrumb
- Title
- One-sentence description
- Primary action, when applicable
- Last refreshed time
- Refresh button for operational queues

Example:

```text
Payment Orders
Review manual payments, receipts, and fulfilment decisions.
[Refresh] [Filters]
```

### 5.5 Status badges

Use consistent labels, colours, and casing.

| Status family | Colour |
|---|---|
| Active, approved, verified, completed, fulfilled | Green |
| Pending, queued, draft, verification pending | Blue |
| Manual review, receipt submitted, under review | Amber |
| Paused, deactivated, expired, skipped | Grey |
| Suspended | Orange |
| Rejected, failed, banned, deleted, cancelled | Red |

Never communicate status by colour alone. Always include text and, where useful, an icon.

---

## 6. Dashboard specification

**Endpoint:** `GET /api/v1/admin/analytics/dashboard`  
**Access:** `MODERATOR` or `ADMIN`

### 6.1 Dashboard purpose

The dashboard answers three questions:

1. What needs attention now?
2. Is the platform healthy?
3. What changed recently according to the available snapshot metrics?

Because the endpoint has no historical series, avoid line charts with invented changes. Use KPI cards, ratios, segmented bars, and operational queues.

### 6.2 Header

```text
Overview
Platform health and operational workload.

Last updated 22 Jul 2026, 23:14
[Refresh]
```

Refresh rules:

- Initial server-side load
- Background refetch every 60 seconds while tab is visible
- Manual refresh
- Pause polling when the tab is hidden
- Show stale-data banner after 5 minutes without a successful refresh

### 6.3 Row 1 — primary KPIs

Four large cards:

1. **Total users**
   - `users.total_users`
   - Secondary: `users.new_users_24h` today, `users.new_users_7d` this week

2. **Daily active users**
   - `users.dau`
   - Secondary: DAU/MAU percentage, derived from `dau / mau`

3. **Active subscriptions**
   - `subscriptions.active_subscriptions`
   - Secondary: pending and cancelled counts

4. **Revenue — 30 days**
   - `revenue.revenue_30d`
   - Secondary: 24-hour and 7-day values
   - Format minor units correctly

Each card is clickable only when a meaningful destination exists.

### 6.4 Row 2 — attention required

Display a prominent **Needs attention** panel.

Cards:

- **Photos requiring review**
  - `photos_manual_review + photos_pending`
  - Link: Photo Review
  - Show manual review as the urgent subset

- **Payment orders requiring review**
  - `revenue.review_orders`
  - Link: Payment Orders

- **Pending reports**
  - `reports.reports_pending + reports.reports_under_review`
  - Read-only metric
  - No link until report-management endpoints exist
  - Tooltip: “Report management is not available in the current admin API.”

- **Failed notifications**
  - `notifications.notifications_failed`
  - No event-detail endpoint exists
  - Link only to Notification Campaigns if useful; otherwise remain read-only

For `MODERATOR`, only Photo Review is actionable.

### 6.5 Row 3 — platform funnel

Use horizontal progress bars:

- Onboarded profiles / total profiles
- Verified profiles / total profiles
- Visible profiles / total profiles
- Active matches / total matches

Show numerator, denominator, and percentage.

Example:

```text
Onboarding completion  11,500 / 14,000  82.1%
```

### 6.6 Row 4 — activity snapshot

Two cards:

**User activity**
- DAU
- WAU
- MAU
- DAU/MAU ratio

**Matching**
- Total matches
- Active matches
- New matches in 24 hours
- New matches in 7 days

### 6.7 Row 5 — operational distribution

Three compact cards:

**User status**
- Active
- Suspended
- Deactivated
- Banned
- Deleted

**Photo moderation**
- Pending
- Manual review
- Approved
- Rejected

**Notification processing**
- Pending
- Processing
- Fanout complete
- Failed
- Skipped

Use segmented bars or labelled lists. Avoid pie charts with many tiny segments.

### 6.8 Recent admin activity

For `ADMIN` only, load the first 10 audit entries from:

```text
GET /api/v1/admin/audit-log?page=1&pageSize=10
```

Show:

- Actor
- Human-readable action
- Target type
- Target ID, truncated with copy button
- Relative time

Click opens an audit-detail drawer.

Do not request this endpoint for `MODERATOR`.

---

## 7. Users

### 7.1 Users list

**Endpoint:** `GET /api/v1/admin/users`

#### Header

```text
Users
Search and manage Qaliye accounts.
```

#### Filter bar

- Search by display name
- Status
- Role
- Page size: 20, 50, 100
- Clear filters

Sync filter state to the URL:

```text
?search=selam&status=ACTIVE&role=USER&page=1&pageSize=20
```

Debounce display-name search by 350–500ms.

#### Table columns

| Column | Behaviour |
|---|---|
| User | Display name or `Unnamed user`; secondary truncated UUID |
| Status | Semantic badge |
| Role | Badge |
| Verification | Verified / Not verified |
| Onboarding | Complete / Incomplete |
| Profile | Completion score with small progress bar |
| Last active | Relative time; exact time in tooltip |
| Joined | Localised date |
| Actions | View details |

Row click opens user detail. Do not place destructive actions directly in the table.

#### Empty states

- No users at all: “No users found.”
- No filtered results: “No users match these filters.” with Clear filters action
- Search with unsupported identifier: explain that the current backend searches display name only

### 7.2 User detail

**Endpoint:** `GET /api/v1/admin/users/{userId}`

#### Header

- Display name
- UUID with copy button
- Status badge
- Role badge
- Verified badge
- Last active
- Primary action: **Send notification**
- Overflow menu:
  - Change status
  - Change role
  - Delete account

#### Summary cards

- Profile completion
- Photo counts by moderation status
- Reports and pending reports
- Active matches
- Account visibility
- Onboarding state
- Verification status

#### Sections

**Account**
- Status
- Role
- Preferred language
- Created
- Updated
- Deleted at, when present

**Profile**
- Gender
- Residency type
- Relationship intention
- Visible in discovery
- Onboarding complete
- Verification

**Moderation summary**
- Total photos
- Pending
- Manual review
- Approved
- Rejected
- Total reports
- Pending reports

The current backend does not provide complete profile text, photo gallery, report details, email, phone number, subscription detail, or device list. Do not show empty placeholders for these fields.

#### Change status

**Endpoint:** `PATCH /api/v1/admin/users/{userId}/status`

Dialog fields:

- New status
- Reason
- Impact warning

Rules:

- Available values: `ACTIVE`, `SUSPENDED`, `DEACTIVATED`, `BANNED`
- Do not include `DELETED`; deletion has its own endpoint
- Disable current status
- Require a reason for `SUSPENDED` and `BANNED` in the UI, even though backend marks it optional
- Show clear consequences:
  - Suspended: temporary access restriction
  - Banned: severe account restriction
  - Deactivated: account inactive
  - Active: restores active status
- On success:
  - Close dialog
  - Show toast
  - Refetch detail and list
  - Add no optimistic status update before server success

#### Change role

**Endpoint:** `PATCH /api/v1/admin/users/{userId}/role`

Dialog:

- Current role
- New role
- Warning for `ADMIN`
- Typed confirmation when promoting to or demoting from `ADMIN`

Rules:

- Values: `USER`, `MODERATOR`, `ADMIN`
- Do not permit current signed-in admin to modify their own role
- Use step-up authentication before assigning `ADMIN`
- Show a summary of access granted

#### Delete account

**Endpoint:** `DELETE /api/v1/admin/users/{userId}`

Use a high-risk confirmation dialog.

Required UI inputs:

- Reason
- Type the user's display name or last 8 characters of UUID
- Checkbox: “I understand this soft-deletes the account.”

After success:

- Navigate back to user detail or users list
- Show `DELETED` state
- Disable further mutation actions
- Do not call the endpoint for the signed-in admin

#### Direct push notification

**Endpoint:** `POST /api/v1/admin/notifications/users/{userId}/push`

Open a side drawer with:

- Recipient display name and UUID
- Title
- Body
- Mobile-style notification preview
- Character counters
- Send button

Success response means **queued**, not delivered. Toast:

> Notification queued for delivery.

Do not display “Notification sent successfully.”

### 7.3 User-specific audit activity

For `ADMIN`, request:

```text
GET /api/v1/admin/audit-log?targetId={userId}&page=1&pageSize=20
```

Show a compact timeline under an **Activity** tab.

---

## 8. Photo Review

### 8.1 Endpoints

```text
GET /api/v1/admin/moderation/photos/manual-review
GET /api/v1/admin/moderation/photos/review-queue
GET /api/v1/admin/moderation/photos/counts
```

**Access:** `MODERATOR` or `ADMIN`

### 8.2 Current capability limitation

The provided backend contract exposes queue retrieval and counts but has **no endpoint to approve, reject, or change a photo's moderation status**.

Therefore:

- Build a useful review viewer.
- Do not render functional Approve or Reject buttons.
- Show a small development-only warning banner in non-production:
  - “Decision endpoints are not available.”
- In production, label the page **Photo Review Queue** and provide viewing/navigation only.
- Add decision controls only after backend endpoints are implemented.

### 8.3 Layout

Top summary cards:

- Manual review
- Pending
- Approved total
- Rejected total

Tabs:

- **Needs review** — `review-queue`
- **Manual review only** — `manual-review`

Main layout:

- Left: responsive thumbnail grid or queue list
- Right: sticky review panel on desktop
- Full-screen viewer on mobile

Photo card:

- Image
- Status badge
- Display name
- Uploaded time
- Queue age
- Open user button

Review panel:

- Large image with contain fit
- Zoom controls
- Display name
- User ID
- Photo ID
- Status
- Uploaded time
- Link to user detail for Admin
- Previous / Next controls

### 8.4 Signed URL handling

`imageUrl` has a one-hour TTL.

- Do not cache signed URLs persistently.
- On image `403` or expiry, refetch the queue.
- Avoid logging full signed URLs.
- Use `referrerPolicy="no-referrer"` where appropriate.
- Prevent browser prefetch from needlessly consuming signed URLs.

### 8.5 Recommended missing decision endpoints

Before enabling moderation actions, add backend endpoints similar to:

```text
POST /api/v1/admin/moderation/photos/{photoId}/approve
POST /api/v1/admin/moderation/photos/{photoId}/reject
POST /api/v1/admin/moderation/photos/{photoId}/manual-review
```

Each decision should require:

- Decision reason or reason code
- Optional notes
- Optimistic concurrency or current-status validation
- Audit logging
- Response with updated photo status
- Clear role permission for `MODERATOR` and `ADMIN`

---

## 9. Billing — Payment Orders

### 9.1 List page

**Endpoint:** `GET /api/v1/admin/billing/orders`

#### Filters

- Status multi-select
- Payment method code
- Country code
- Page size
- Clear filters

Default status filter:

```text
MANUAL_REVIEW,RECEIPT_SUBMITTED
```

Consider including `VERIFICATION_PENDING` in a preset named **All reviewable**.

#### Table columns

| Column | Description |
|---|---|
| Reference | Human-readable `order_reference` |
| User | Display name; UUID secondary |
| Status | Status badge |
| Amount | Formatted expected amount |
| Payment method | Display name and method code |
| Country | Country code |
| Created | Relative and exact time |
| Age | Time waiting for review |
| Action | Review |

The list endpoint returns raw snake_case database fields. Convert these to a stable frontend domain model at the API boundary.

### 9.2 Order detail

**Endpoint:** `GET /api/v1/admin/billing/orders/{orderId}`

Recommended two-column desktop layout.

Left:

- Receipt viewer
- Open image in full-screen viewer
- Download is optional and should use the signed URL only

Right:

- Order reference
- Status
- User ID with link to user
- Expected amount
- Currency
- Payment channel
- Payment method
- Method code
- Created date
- Decision controls

If no receipt exists, show a neutral receipt placeholder.

### 9.3 Approval flow

**Endpoint:** `POST /api/v1/admin/billing/orders/{orderId}/approve`

Button: **Approve payment**

Confirmation dialog:

- Order reference
- User
- Amount
- Payment method
- Optional decision note
- Warning that fulfilment may activate a subscription or grant credits

Require the admin to visually inspect the receipt before the button becomes active. This can be a local checkbox:

```text
[ ] I verified the receipt and expected amount.
```

On success:

- Status becomes `VERIFIED`
- Refetch order, list, dashboard, and user-related data
- Show:
  - “Payment approved and fulfilment completed.”

### 9.4 Rejection flow

The backend offers both `/decline` and `/reject`. Do not present two separate user-facing actions because they produce the same outcome and would confuse staff.

Use:

```text
POST /api/v1/admin/billing/orders/{orderId}/decline
```

Reason:

- It requires a non-blank decision note.
- Mandatory reasons improve support and audit quality.

Button: **Reject payment**

Dialog:

- Mandatory reason
- Optional predefined reason selector:
  - Amount mismatch
  - Invalid receipt
  - Duplicate receipt
  - Wrong payment account
  - Unreadable evidence
  - Other
- Detailed note

On success, status becomes `REJECTED`.

Keep `/reject` available only as a low-level client method if legacy behaviour requires it; do not expose it as an additional button.

### 9.5 Refund flow

**Endpoint:** `POST /api/v1/admin/billing/orders/{orderId}/refund`

Show **Refund order** only when status is `VERIFIED`.

The confirmation dialog must summarise backend impact:

- Original transaction becomes refunded
- Refund transaction record is created
- Associated subscription is cancelled
- Credits and boosts from the transaction are expired/cancelled
- Order becomes cancelled

Fields:

- Refund reason
- Typed order reference
- Re-authentication or MFA challenge

Success panel:

- Refund amount
- Currency
- Transaction ID
- Final order status

Never use an optimistic UI for refunds.

### 9.6 Money formatting

All money values are minor units.

Create one shared helper:

```ts
formatMinorUnits(amountMinor, currency, locale)
```

Requirements:

- Use currency-specific fraction digits
- Do not blindly divide every currency by 100
- Preserve raw minor-unit value in technical detail drawers
- Display user-friendly formatted value in the main UI

---

## 10. Manual Transactions

### 10.1 List page

**Endpoint:** `GET /api/v1/admin/transactions`

Filters:

- Status
- Provider multi-select
- Page size

Default status:

```text
MANUAL_REVIEW
```

Table columns:

- User
- Provider
- Payment purpose
- Plan code, when present
- Amount
- Status
- Receipt available
- Created
- Review action

### 10.2 Review drawer

The current API has no separate transaction-detail endpoint. Use the selected row data in a side drawer.

Show:

- Transaction ID
- User and link to user detail
- Provider
- Amount
- Currency
- Payment purpose
- Plan code
- Created
- Receipt area
- Admin notes

### 10.3 Receipt limitation

`receiptImageUrl` is documented as a storage path, not a guaranteed signed URL.

The frontend cannot safely assume it is directly viewable.

Choose one of these approaches:

1. Preferred: add a backend transaction-detail endpoint returning a signed receipt URL.
2. Use an existing authenticated storage-signing service if already available.
3. Do not display the image and show “Receipt preview unavailable” until a secure URL can be obtained.

Do not concatenate storage paths into public URLs in the browser.

### 10.4 Review action

**Endpoint:** `PATCH /api/v1/admin/transactions/{transactionId}`

User-facing actions:

- **Approve transaction** → `COMPLETED`
- **Reject transaction** → `FAILED`

Approval warning:

> Approval may activate a subscription or create a profile boost, depending on the payment purpose.

For rejection, require an admin note in the UI even though it is optional in the backend.

After success:

- Remove item from default manual-review list
- Refetch dashboard and list
- Show server-confirmed final status

### 10.5 Avoid confusion with Payment Orders

Keep **Payment Orders** and **Manual Transactions** as separate screens because the backend models and review endpoints are separate.

Add explanatory subtitles:

- Payment Orders: “Review submitted orders and fulfil purchases.”
- Manual Transactions: “Resolve provider or transfer transactions flagged for manual review.”

---

## 11. Notification Campaigns

### 11.1 List

**Endpoint:** `GET /api/v1/admin/notification-campaigns`

Filters:

- Status: Draft, Running, Completed, Cancelled
- Page size

Table columns:

- Campaign title
- Campaign key
- Status
- Scheduled time
- Started
- Completed or cancelled
- Created
- Actions

Primary action: **Create campaign**

Remember that this endpoint uses **0-based pagination**, unlike most other admin endpoints.

### 11.2 Create campaign

**Endpoint:** `POST /api/v1/admin/notification-campaigns`

Use a two-column editor:

Left form:

- Campaign key
- Notification title
- Notification body
- Navigation payload
- Audience definition

Right:

- Live mobile notification preview
- Audience summary
- Validation summary

### 11.3 JSON fields

`navigationPayload` and `audienceDefinition` are arbitrary JSON objects in the current contract.

Provide:

- Simple mode with key/value rows
- Advanced JSON editor
- JSON schema validation for syntax
- Pretty-print action
- Reset to `{}`

Do not promise a specific audience field is supported unless it is defined by the backend audience engine.

Suggested presets may populate JSON, but label them as templates:

```json
{ "country": "ET" }
```

```json
{ "country": "ET", "gender": "FEMALE" }
```

### 11.4 Campaign detail and edit

**Endpoints:**

```text
GET   /api/v1/admin/notification-campaigns/{campaignId}
PATCH /api/v1/admin/notification-campaigns/{campaignId}
```

Sections:

- Content
- Navigation
- Audience
- Schedule
- Lifecycle timestamps
- Technical IDs

Allow editing only when sensible for current status. The backend does not document transition restrictions for update, so the UI should be conservative:

- Draft: editable
- Running: read-only content; allow cancel
- Completed: read-only
- Cancelled: read-only

### 11.5 Start campaign

**Endpoint:** `POST /api/v1/admin/notification-campaigns/{campaignId}/start`

Confirmation:

- Title
- Audience JSON summary
- Scheduled time
- Warning that notifications will begin processing

Require typed campaign key for high-volume campaigns if an audience size estimate is unavailable.

### 11.6 Cancel campaign

**Endpoint:** `POST /api/v1/admin/notification-campaigns/{campaignId}/cancel`

Require confirmation. Explain that cancellation may not recall notifications already processed.

### 11.7 Current backend gaps

The current API does not expose:

- Audience estimate
- Test notification
- Delivery metrics per campaign
- Failure details
- Open/click metrics
- Delete campaign endpoint
- Duplicate campaign endpoint

Do not show fake performance charts.

Recommended additions:

```text
POST /api/v1/admin/notification-campaigns/{id}/estimate
POST /api/v1/admin/notification-campaigns/{id}/test
GET  /api/v1/admin/notification-campaigns/{id}/metrics
```

---

## 12. Direct Notification

This is a convenience screen backed by the users endpoint and direct push endpoint.

### 12.1 Route

```text
/<admin>/notifications/direct
```

### 12.2 Flow

1. Search recipient by display name using `GET /api/v1/admin/users`.
2. Select exactly one user.
3. Enter title and body.
4. Preview.
5. Confirm.
6. Queue notification.

Fields:

- Recipient
- Title
- Body

Rules:

- Deleted or banned users may be rejected by the backend
- Clear recipient search after successful queueing
- Keep a local unsent draft only in memory, not persistent browser storage
- Show `QUEUED`, not “delivered”

---

## 13. Promotional Campaigns

### 13.1 List

**Endpoint:** `GET /api/v1/admin/billing/campaigns`

Filters:

- Draft
- Active
- Paused
- Expired
- Page size

Table columns:

- Name
- Campaign key
- Status
- Benefit
- Eligibility
- Country
- Target gender
- Redemptions
- Start
- End
- Priority
- Actions

Redemption display:

```text
fulfilledCount / maxRedemptions
```

When `maxRedemptions` is null, show:

```text
123 / Unlimited
```

### 13.2 Create wizard

**Endpoint:** `POST /api/v1/admin/billing/campaigns`

Use a four-step wizard.

#### Step 1 — Basics

- Campaign key
- Name
- Description
- Country
- Subscription product
- Priority

#### Step 2 — Eligibility

- Trigger type:
  - Purchase
  - Automatic on signup
- Eligibility:
  - New users
  - All users
- New-user window days, shown only for `NEW_USER`
- Target gender:
  - All
  - Male
  - Female

#### Step 3 — Benefit

- Free premium
- Discount

For free premium:

- Duration days

For discount:

- Percentage or fixed
- Discount value
- Currency, required for fixed discount

#### Step 4 — Limits and schedule

- Starts at
- Ends at
- Maximum total redemptions
- Maximum per user
- Final summary
- Validation messages

### 13.3 Conditional validation

Frontend validation must reflect the backend contract:

- `FREE_PREMIUM` requires `durationDays > 0`
- `DISCOUNT` requires `discountType` and `discountValue`
- `NEW_USER` requires `newUserWindowDays > 0`
- `endsAt` must be after `startsAt`
- Country is two uppercase letters
- Gender is `MALE`, `FEMALE`, or null
- Campaign key is immutable after creation
- Product ID is required

### 13.4 Campaign detail

**Endpoint:** `GET /api/v1/admin/billing/campaigns/{id}`

Header:

- Name
- Status
- Campaign key
- Primary lifecycle action

Summary cards:

- Fulfilled redemptions
- Reserved redemptions
- Remaining, when capped
- Start/end
- Benefit value

Sections:

- Eligibility
- Benefit
- Limits
- Schedule
- Redemptions preview
- Technical details

### 13.5 Edit campaign

**Endpoint:** `PUT /api/v1/admin/billing/campaigns/{id}`

Only expose fields the backend allows:

- Name
- Description
- Max redemptions
- Max redemptions per user
- Priority
- Ends at
- Target gender

Do not render disabled controls for immutable fields in the edit form. Show immutable configuration in a separate read-only summary.

### 13.6 Lifecycle actions

Endpoints:

```text
POST /api/v1/admin/billing/campaigns/{id}/activate
POST /api/v1/admin/billing/campaigns/{id}/pause
POST /api/v1/admin/billing/campaigns/{id}/expire
```

Action matrix:

| Current status | Actions |
|---|---|
| DRAFT | Activate, Expire |
| ACTIVE | Pause, Expire |
| PAUSED | Activate, Expire |
| EXPIRED | None |

Confirmation is required for every lifecycle change.

For Expire, use stronger language:

> Expiring this campaign is a terminal action in the current API.

### 13.7 Redemptions

**Endpoint:** `GET /api/v1/admin/billing/campaigns/{id}/redemptions`

Table columns:

- User ID
- Status
- Eligibility country
- Eligibility gender
- Original amount
- Discount
- Final amount
- Currency
- Reserved
- Fulfilled/cancelled/expired time
- Failure code
- Linked payment order
- Linked subscription

The documented response is an array even though query parameters include pagination. Build the adapter to tolerate:

- A raw array
- A future paginated object

The UI should not display page totals unless returned by the backend.

---

## 14. Catalog Management

### 14.1 Shared layout

Use one Catalog section with tabs:

- Languages
- Ethnicities

Both screens use:

- Country filter
- Search within loaded rows on the client
- Add button
- Table
- Edit drawer
- Soft-delete confirmation

### 14.2 Languages

Endpoints:

```text
GET    /api/v1/admin/catalog/languages
POST   /api/v1/admin/catalog/languages
PATCH  /api/v1/admin/catalog/languages/{id}
DELETE /api/v1/admin/catalog/languages/{id}
```

Table columns:

- Name
- Native name
- Code
- Country
- Actions

Create fields:

- Code
- Country code
- Name
- Native name
- Sort order

Edit fields:

- Name
- Native name
- Active
- Sort order

Validation:

- Code: `[a-z][a-z0-9_-]*`
- Country code: exactly two uppercase letters
- Name max 100
- Native name max 100
- Sort order integer

### 14.3 Ethnicities

Endpoints:

```text
GET    /api/v1/admin/catalog/ethnicities
POST   /api/v1/admin/catalog/ethnicities
PATCH  /api/v1/admin/catalog/ethnicities/{id}
DELETE /api/v1/admin/catalog/ethnicities/{id}
```

Table columns:

- Name
- Code
- Country
- Region
- Actions

Create fields:

- Code
- Country code
- Name
- Region
- Sort order

Edit fields:

- Name
- Region
- Active
- Sort order

### 14.4 Soft deletion

Delete dialog copy:

> This removes the option from active catalog use. Existing profiles may still retain historical references.

Require the item name to confirm when it may affect many profiles.

### 14.5 Current response limitation

The documented language and ethnicity list response fields do not include `isActive` or `sortOrder`, although update endpoints accept those fields.

Until the backend returns them:

- Do not show an Active column.
- Do not show sort order in the table.
- The edit form may submit changes, but it cannot reliably prefill current values.
- Prefer adding these fields to list and create/update responses before enabling full edit UX.

Recommended response additions:

```json
{
  "isActive": true,
  "sortOrder": 5
}
```

---

## 15. Audit Log

**Endpoint:** `GET /api/v1/admin/audit-log`  
**Access:** `ADMIN`

### 15.1 Page structure

Header:

```text
Audit Log
Review administrative and system actions.
```

Filters:

- Action
- Target table
- Actor ID
- Target ID
- Page size

URL example:

```text
?action=USER_STATUS_CHANGED&targetTable=app_users&page=1&pageSize=50
```

### 15.2 Table columns

- Timestamp
- Actor
- Action
- Target table
- Target ID
- Request ID
- Details
- View

Humanise known actions:

```text
USER_STATUS_CHANGED → User status changed
APPROVE_ORDER       → Payment order approved
```

Preserve the raw action value in the detail drawer.

### 15.3 Detail drawer

Show:

- Entry ID
- Actor ID and name
- Raw action
- Target table
- Target ID
- Request ID
- Timestamp
- Parsed JSON details

Parse the `details` JSON string safely:

- Pretty-print valid JSON
- Show raw text if parsing fails
- Add copy buttons
- Never execute or render embedded HTML

### 15.4 Recommended backend improvements

Add optional filters:

- Date from
- Date to
- Free-text request ID
- Action list endpoint or enum metadata

These are not required for the initial UI.

---

## 16. Shared interaction patterns

### 16.1 Data tables

Use server-side pagination for:

- Users
- Audit log
- Notification campaigns
- Payment orders
- Manual transactions
- Promotional campaigns

Table requirements:

- Sticky header
- Clear loading skeleton
- Horizontal scroll when necessary
- Persistent URL filters
- Page size selector
- Total count when available
- Empty and error states
- No automatic bulk selection unless a bulk endpoint exists

### 16.2 Drawers versus pages

Use a drawer for:

- Quick review
- Notification composer
- Edit catalog item
- Audit entry detail

Use a full page for:

- User detail
- Payment order detail
- Campaign detail
- Promotion creation wizard

### 16.3 Confirmation levels

| Risk | Pattern |
|---|---|
| Low: edit catalog label, save draft | Standard confirmation or direct save |
| Medium: suspend user, reject payment, pause campaign | Confirmation dialog with reason |
| High: ban, assign Admin, approve fulfilment, start campaign | Explicit impact summary and checkbox |
| Critical: delete account, refund order, expire campaign | Typed confirmation and re-authentication |

### 16.4 Toast language

Use precise server-state wording:

- “User status updated.”
- “Notification queued.”
- “Payment approved and fulfilled.”
- “Payment rejected.”
- “Refund completed.”
- “Campaign started.”
- “Catalog item soft-deleted.”

Do not use generic “Success!” without context.

### 16.5 Loading states

- Page skeleton on first load
- Preserve previous table data while changing pages
- Disable only the submitted control during mutations
- Show progress text for slow actions
- Never leave destructive buttons active during submission

### 16.6 Error states

Map common backend errors to useful messages.

| Error | UI message |
|---|---|
| `cannot_change_own_status` | You cannot change your own account status. |
| `cannot_change_own_role` | You cannot change your own admin role. |
| `cannot_delete_own_account` | You cannot delete your own account. |
| `order_not_reviewable` | This order has already been processed or is not reviewable. |
| `only_verified_orders_can_be_refunded` | Only verified orders can be refunded. |
| `transaction_already_reviewed` | This transaction has already been reviewed. |
| `invalid_status_transition` | This action is no longer valid for the current status. |
| `access_denied` / `admin_access_required` | Return the admin-safe access-denied state; do not retry. |
| 401 | Clear admin session and redirect to secret sign-in route. |
| 500 | Keep current data visible and offer Retry. |

On mutation conflict, refetch the entity before allowing another attempt.

---

## 17. API client and data architecture

### 17.1 Recommended stack

- Next.js App Router
- TypeScript with strict mode
- Tailwind CSS
- shadcn/ui or Radix primitives
- Zustand for shared client-side application and admin UI state
- React Query for server state, API caching, mutations, invalidation, and operational polling
- TanStack Table for data tables
- React Hook Form for form state, submission, and field-level interaction
- Zod for request schemas, form validation, and API response validation
- Local React state (`useState` and `useReducer`) for component-only UI state
- `date-fns` or Luxon
- `Intl.NumberFormat` for money and counts
- Sonner or equivalent toast library

### 17.2 State management responsibilities

Use each state-management tool for a specific responsibility. Do not duplicate the same state across Zustand, React Query, URL parameters, and component state.

| State type | Required tool | Examples |
|---|---|---|
| Server and API state | React Query | Dashboard metrics, users, moderation queues, orders, transactions, campaigns, catalog data, audit entries |
| Shared client application state | Zustand | Sidebar collapsed state, global admin command palette, shared table preferences, selected environment, cross-page draft state |
| Form state | React Hook Form | User status dialogs, notification composer, campaign forms, promotion wizard, catalog forms |
| Validation and schemas | Zod | Form rules, conditional promotion validation, JSON payload validation, API request and response parsing |
| Component-only UI state | Local React state | Open dialog, active tab, selected row, image zoom, drawer state, temporary confirmation checkbox |
| Shareable navigation state | URL search parameters | Search, filters, sort, pagination, selected list tab |

#### Zustand rules

- Create small domain-focused stores rather than one large global store.
- Persist only harmless UI preferences such as sidebar state or table density.
- Do not persist JWTs, bearer tokens, signed URLs, payment evidence, user records, or sensitive admin data.
- Do not copy React Query response data into Zustand.
- Use Zustand for cross-component or cross-page client state only when local state or URL parameters are insufficient.
- Use selectors to minimise unnecessary rerenders.

Suggested stores:

```text
stores/
  admin-shell-store.ts        Sidebar, mobile navigation, command palette
  admin-preferences-store.ts  Table density and optional column preferences
  promotion-draft-store.ts    Optional multi-page promotion wizard draft
```

#### React Query rules

- Treat React Query as the source of truth for backend data.
- Use query keys defined in this specification.
- Invalidate affected queries after successful mutations.
- Do not optimistically update destructive or financially sensitive actions.
- Use polling only for operational screens that benefit from fresh data.
- Keep previous paginated data visible while the next page loads.
- Pause background polling when the browser tab is hidden.

#### React Hook Form and Zod rules

- Use React Hook Form for all non-trivial forms and confirmation dialogs.
- Use Zod schemas through the form resolver.
- Keep conditional rules in Zod, especially for promotional campaign benefit and eligibility fields.
- Transform form values into backend request DTOs in one adapter layer.
- Display server validation errors next to the relevant field when possible.

#### Local React state rules

Use local state for transient state that does not need to survive navigation or be shared globally. Examples include:

- Whether a dialog or drawer is open
- Current image zoom level
- Selected photo within the loaded review queue
- Temporary confirmation checkbox
- Active tab within one detail page

Promote local state to Zustand only when multiple distant components or routes genuinely need to read or update it.

### 17.3 Server-side BFF

Prefer a Next.js server-side Backend-for-Frontend layer.

```text
Browser
  → Next.js route handler/server action
  → Qaliye backend /api/v1/admin/*
```

Benefits:

- Bearer token stays server-side
- Backend base URL is not exposed
- Consistent role enforcement
- Response normalisation
- Unified error mapping
- CSRF/origin checks
- Safer logging

Do not create a broad generic proxy that accepts arbitrary backend URLs. Define explicit route handlers per admin capability.

### 17.4 Domain adapters

The backend contract mixes:

- camelCase
- snake_case
- 0-based pages
- 1-based pages
- offset pagination
- raw arrays
- Spring Page objects

Normalise every response before it reaches components.

Example:

```ts
type AdminPage<T> = {
  items: T[];
  page: number;       // Always 1-based inside UI
  pageSize: number;
  total?: number;
  totalPages?: number;
};
```

Create adapters such as:

```text
adaptUsersPage
adaptNotificationCampaignPage
adaptPaymentOrdersPage
adaptPromotionPage
adaptCatalogList
adaptRedemptions
```

### 17.5 Query keys

Examples:

```ts
["admin", "dashboard"]
["admin", "users", filters]
["admin", "user", userId]
["admin", "photo-review", queueType]
["admin", "photo-counts"]
["admin", "payment-orders", filters]
["admin", "payment-order", orderId]
["admin", "transactions", filters]
["admin", "notification-campaigns", filters]
["admin", "notification-campaign", campaignId]
["admin", "promotions", filters]
["admin", "promotion", campaignId]
["admin", "promotion-redemptions", campaignId, page]
["admin", "catalog", "languages", filters]
["admin", "catalog", "ethnicities", filters]
["admin", "audit-log", filters]
```

### 17.6 Cache and refetch policy

- Dashboard: stale after 30 seconds; refetch every 60 seconds while visible
- Queues: stale after 15–30 seconds
- Lists: stale after 30–60 seconds
- Detail pages: stale after 30 seconds
- Catalog: stale after 5 minutes
- Audit log: no automatic polling unless displayed on dashboard

After mutations, invalidate only affected domains plus dashboard.

### 17.7 Date and timezone

Backend timestamps are ISO-8601.

UI rules:

- Display in the admin's local timezone
- Show timezone abbreviation in detail views
- Exact timestamp tooltip on relative time
- Send scheduled times as ISO-8601 UTC
- Show a confirmation summary in both local time and UTC for campaigns

---

## 18. Recommended component structure

```text
components/admin/
  shell/
    AdminSidebar.tsx
    AdminTopbar.tsx
    AdminBreadcrumbs.tsx
    RoleGate.tsx
    EnvironmentBadge.tsx

  dashboard/
    MetricCard.tsx
    AttentionQueueCard.tsx
    RatioBar.tsx
    StatusDistribution.tsx
    RecentAuditActivity.tsx

  tables/
    AdminDataTable.tsx
    Pagination.tsx
    FilterBar.tsx
    ColumnVisibilityMenu.tsx
    EmptyTableState.tsx

  users/
    UserStatusBadge.tsx
    UserRoleBadge.tsx
    UserSummary.tsx
    ChangeStatusDialog.tsx
    ChangeRoleDialog.tsx
    DeleteUserDialog.tsx

  moderation/
    PhotoQueueGrid.tsx
    PhotoReviewPanel.tsx
    SignedImage.tsx

  billing/
    Money.tsx
    PaymentOrderTable.tsx
    PaymentOrderSummary.tsx
    ReceiptViewer.tsx
    ApproveOrderDialog.tsx
    RejectOrderDialog.tsx
    RefundOrderDialog.tsx
    TransactionReviewDrawer.tsx

  notifications/
    NotificationPreview.tsx
    AudienceJsonEditor.tsx
    NavigationPayloadEditor.tsx
    StartCampaignDialog.tsx
    CancelCampaignDialog.tsx
    DirectNotificationForm.tsx

  promotions/
    PromotionWizard.tsx
    PromotionSummary.tsx
    PromotionLifecycleActions.tsx
    RedemptionTable.tsx

  catalog/
    CatalogTable.tsx
    LanguageForm.tsx
    EthnicityForm.tsx
    DeleteCatalogItemDialog.tsx

  audit/
    AuditLogTable.tsx
    AuditDetailDrawer.tsx
    JsonDetails.tsx

  shared/
    CopyIdButton.tsx
    StatusBadge.tsx
    ConfirmActionDialog.tsx
    TypedConfirmation.tsx
    PageError.tsx
    PageSkeleton.tsx
    LastUpdated.tsx
```

---

## 19. Suggested Next.js project structure

```text
src/
  app/
    __qaliye_console/
      layout.tsx
      page.tsx
      loading.tsx
      error.tsx

      users/
        page.tsx
        [userId]/
          page.tsx

      photo-review/
        page.tsx

      billing/
        orders/
          page.tsx
          [orderId]/
            page.tsx
        transactions/
          page.tsx

      notifications/
        direct/
          page.tsx
        campaigns/
          page.tsx
          new/
            page.tsx
          [campaignId]/
            page.tsx

      promotions/
        page.tsx
        new/
          page.tsx
        [campaignId]/
          page.tsx
          redemptions/
            page.tsx

      catalog/
        languages/
          page.tsx
        ethnicities/
          page.tsx

      audit-log/
        page.tsx

    api/
      internal-admin/
        dashboard/
        users/
        moderation/
        billing/
        notifications/
        promotions/
        catalog/
        audit-log/

  components/
    admin/

  stores/
    admin-shell-store.ts
    admin-preferences-store.ts
    promotion-draft-store.ts

  lib/
    admin/
      auth.ts
      permissions.ts
      api-client.ts
      errors.ts
      money.ts
      dates.ts
      pagination.ts
      adapters/
      schemas/
      query-keys.ts

  middleware.ts
```

The `/api/internal-admin/*` route handlers are private BFF endpoints, not public admin API contracts. They must repeat session and role validation.

---

## 20. Backend capability gaps affecting UI quality

These are the highest-priority backend additions.

### P0 — required for core operations

1. **Photo moderation decision endpoints**
   - Approve
   - Reject
   - Reason codes
   - Audit logging

2. **Report management endpoints**
   - List reports
   - Report detail
   - Assign/start review
   - Resolve no action
   - Warn/suspend/ban
   - Reporter and subject context

3. **Secure transaction receipt URL**
   - Transaction detail endpoint
   - Signed receipt URL

4. **Trusted current-admin identity**
   - Role in verified JWT claims, or
   - Dedicated current-admin session endpoint

### P1 — strongly recommended

5. User search by UUID, email, and phone
6. Order search by order reference and user
7. Analytics date range and time-series endpoint
8. Notification audience estimate and test-send
9. Notification delivery metrics and failure details
10. Catalog responses including `isActive` and `sortOrder`
11. Transaction detail endpoint
12. Pagination metadata for campaign redemptions

### P2 — operational improvements

13. Audit date filters
14. Export endpoints for audit and billing data
15. Campaign duplication
16. Saved admin filters
17. Internal admin notes on users
18. Admin action idempotency keys for high-risk mutations

---

## 21. MVP implementation phases

### Phase 1 — secure foundation

- Secret path and rewrite
- Middleware and role checks
- Admin sign-in
- Admin shell
- Shared API client
- Dashboard
- Error handling
- Audit-safe mutation framework

### Phase 2 — core operations

- Users list and detail
- User status, role, deletion
- Direct notification
- Photo review viewer
- Payment orders
- Refunds
- Manual transactions

### Phase 3 — engagement and growth

- Notification campaigns
- Promotional campaign wizard
- Promotion lifecycle
- Redemptions

### Phase 4 — governance and catalog

- Languages
- Ethnicities
- Audit log
- UI polish
- Accessibility testing
- Responsive refinement

### Phase 5 — backend-enhanced operations

- Photo decisions
- Report management
- Analytics history
- Campaign metrics
- Signed transaction receipts

---

## 22. Accessibility requirements

- WCAG 2.1 AA contrast
- All dialogs trap focus and return focus to the trigger
- All icon-only buttons have accessible labels
- Status includes text, not colour only
- Tables have proper headers and captions
- Keyboard navigation for queue items
- Escape closes non-destructive drawers/dialogs
- Destructive confirmation cannot be submitted accidentally with Enter while focus is outside the form
- Images have meaningful alt text:
  - “Profile photo uploaded by Selam”
- Loading states announce changes with polite live regions
- Toasts are not the only place where errors appear

---

## 23. Logging and privacy

Admin screens expose sensitive operational information.

Rules:

- Do not send user IDs, order IDs, signed URLs, or audit details to third-party analytics by default.
- Mask identifiers in screenshots and support tools where possible.
- Never log JWTs.
- Never log complete signed receipt or image URLs.
- Do not cache admin HTML at CDN level.
- Use server-side redaction for error monitoring.
- Track admin actions through backend audit logs rather than consumer analytics.
- Show a visible environment badge outside production to prevent accidental staging/production confusion.

---

## 24. Acceptance criteria

### Security

- No public Admin link exists.
- Production secret path is not present in client environment variables.
- Direct access to internal routes is blocked.
- A normal user receives a neutral 404.
- Moderator and Admin navigation differ correctly.
- Every BFF route validates session and role.
- Admin pages are no-store and noindex.

### Dashboard

- All values map to the dashboard endpoint.
- Minor-unit revenue is formatted correctly.
- No fake trends or historical charts are shown.
- Operational cards link only to implemented screens.
- Moderator sees only authorised actions.

### Users

- Filters persist in URL.
- Status and role changes require confirmation.
- Self-role, self-status, and self-delete operations are prevented.
- Ban and delete require stronger confirmation.
- Push result is labelled queued.

### Billing

- Reviewable orders are easy to identify.
- Receipt can be inspected where a signed URL exists.
- Approval and rejection are not optimistic.
- Only one user-facing rejection action exists.
- Refund shows full impact and requires typed confirmation.

### Campaigns

- Notification JSON fields are syntactically validated.
- Start and cancel require confirmation.
- Promotion form enforces conditional fields.
- Lifecycle buttons follow allowed status transitions.
- Redemptions tolerate the documented array response.

### Catalog

- Create, update, and soft delete are available.
- Validation follows backend patterns.
- UI does not pretend to know `isActive` or `sortOrder` when the list response omits them.

### Reliability

- 401 clears admin session.
- 403 does not expose protected content.
- Mutation conflicts trigger refetch.
- Signed image expiry triggers safe refetch.
- Tables have loading, error, empty, and retry states.

---

## 25. Final implementation recommendation

Build the admin console as a **separate operational surface inside the same Next.js deployment**, reachable only through a private server-configured path and protected by server-side authentication and role checks.

The first dashboard view should prioritise:

1. Photos requiring review
2. Payment orders requiring review
3. Manual transactions requiring review
4. Failed notification count
5. User, subscription, activity, match, and revenue snapshots

Use the existing API exactly where it is sufficient. Keep unsupported actions absent, not merely disabled. The most important backend work before calling the console fully operational is adding photo decision endpoints, report-management endpoints, and a secure transaction receipt-detail endpoint.
