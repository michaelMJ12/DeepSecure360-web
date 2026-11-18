# DeepSecure360 Admin

React + TypeScript admin console for the DeepSecure360 backend (Backend Architecture Blueprint v1.0).

## Run it

```bash
npm install
npm run dev        # http://localhost:5173
```

It starts in **demo mode** (built-in mock data, sign in with any email and a 6+ character password).

To use the real backend, edit `.env`:

```
VITE_USE_MOCK=false
VITE_API_BASE_URL=/api/v1
```

`vite.config.ts` proxies `/api` to `http://localhost:3000` (the NestJS API). The client expects the
response envelope from Blueprint section 5.2/5.3 (`success`, `data`, `meta`, `error`) and
HTTP-only cookie auth.

## Structure

```
src/
  app/            App routes, ProtectedRoute
  components/
    ui/           Button, Icon, Badge, Alert, Card, StatCard, Modal, Pagination, EmptyState, Spinner
    globe/        ThreatGlobe (dark, draggable 3D threat-intel globe)
    geo/          GeoAccuracyMap (radius-based IP geolocation), AttackMap (point-to-point traffic map)
    satellite/    Satellite3D (CSS 3D rotating satellite), SatelliteTerminal (command console)
    layout/       PortalLayout, PortalSidebar, PortalTopbar — shared shell reused by Staff + Client
    form/         Input, Select, Textarea, Checkbox, Field, DynamicForm (+ FieldSchema types)
    data/         DataTable, SearchBar, FilterBar, ResourcePage
    charts/       BarLineChart, RadarChart, HeartbeatChart, ChartCard, Legend, TimeUnitTabs
    layout/       AppLayout, Sidebar, SocialLinks, Topbar, PageHeader
  config/         navigation.ts (sidebar items), social.ts (social links, replace the URLs)
  context/        AuthContext, ToastContext
  features/       auth, dashboard, cases, evidence, forensics, jobs, integrations, geolocation, soc, users, audit, staff, client
  hooks/          useDebounce, useList
  mocks/          mock data used in demo mode
  services/       apiClient, resourceService (REST + mock), per-resource services
  styles/         base.css (design tokens), components.css, layout.css
  types/          api.ts (envelope), models.ts (blueprint tables)
  utils/          format, options, validators, cn
```

## Add a new admin page in ~30 lines

1. Add the type to `types/models.ts` and a service in `services/index.ts`
   (`createService<T>('/path', mockSeed, ['searchKeyA', 'searchKeyB'])`).
2. Create `features/<name>/<Name>Page.tsx` with `columns`, optional `filters` and a `FieldSchema[]`,
   and render `<ResourcePage ... />`. Copy `features/cases/CasesPage.tsx` as a template.
3. Register the route in `app/App.tsx` and the link in `config/navigation.ts`.

## Reusable pieces

- **DataTable**: sortable columns, row selection, row actions, skeleton loading, empty and error states, pagination.
- **DynamicForm**: describe fields as data (`FieldSchema`): required, min/max length, pattern, number range,
  custom `validate`, `visibleWhen` for conditional fields, half or full width. Validates on blur and submit and
  shows server errors in an error card.
- **Alert / useToast()**: error, success, warning and info note cards; `toast.success('Saved')`.
- **ResourcePage**: header, search, filters, table, create/edit modal, delete confirmation, toasts.

## Notes

- Evidence is edit-only here and cannot be deleted, to protect chain of custody. Uploads use the
  resumable upload API from the blueprint (not built in this UI yet).
- Role-based hiding of menu items and actions is not wired up yet; `AuthContext` exposes `user.role` for that.

## Dashboard graphs

The Overview has one time-scale selector (Year, Month, Day, Hour, Minute, Second) that drives every graph.
Second, minute and hour refresh automatically.

- **Bars + line:** active cases and evidence items as bars, critical cases as a line.
- **Spider net:** the same numbers spread across case categories; evidence counts under the category of its case.
- **Heartbeat:** live scrolling traces for processing, queued and failed jobs.
- **Evidence by case:** cases holding the most evidence items.

Demo mode builds the history from the mock data (`mocks/analytics.ts`); the newest point always equals the real
current number. With `VITE_USE_MOCK=false` the page calls `GET /dashboard/analytics?unit=day` and expects
`AnalyticsSnapshot` from `types/models.ts` inside the standard response envelope.

## Forensics & Integrations

Added to match the backend blueprint's `forensics/` module and the `SiemController` /
`WebhookController` code:

- **Forensics** (`/forensics`): YARA / Sigma / custom scan jobs run against evidence, with
  verdicts and matched rules. Read-only in the UI (scans are started by the backend's sandboxed workers).
- **Integrations** (`/integrations`): four tabs —
  - *SIEM query*: calls `POST /integrations/siem/query` (vendor + search string).
  - *EDR alerts*: calls `GET /integrations/edr/alerts`.
  - *Threat intel globe*: calls `GET /integrations/threat-feeds/indicators`, plotted on a dark,
    draggable 3D globe (`components/globe/ThreatGlobe.tsx`, canvas-based, no external map
    service). Points are **aggregate, country-level sensor geolocation** per indicator — this
    does not and cannot show a live location, a photo, or the social-media activity of a specific
    person. That kind of per-person live tracking isn't something an IP address supports, and
    isn't included.
  - *Webhook events*: a log of `POST /webhooks` deliveries with signature-valid status.

## Dark mode

The whole app now uses a single dark theme (tokens in `styles/base.css`). There is no light
mode toggle; change the token values there to adjust it. Layout is responsive from phone width
up (sidebar collapses to an off-canvas drawer under 900px, tables scroll horizontally, forms and
panels reflow to one column).

## IP Intelligence

`/ip-intelligence`: look up an IPv4 address and get back city, region, country, network owner
(ASN/org) and timezone — the same shape ipinfo.io returns, e.g.:

```json
{ "ip": "197.211.63.207", "city": "Abuja", "region": "FCT", "country": "NG",
  "loc": "9.0579,7.4951", "org": "AS37148 Globacom Limited", "timezone": "Africa/Lagos" }
```

This is **city/ISP-region accuracy** (the map shows the provider's typical radius, usually
15–60 km), which is the ceiling of what any IP geolocation service — ipinfo.io, MaxMind, or
otherwise — can provide. There is intentionally no path from an IP to a street address, a live
device position, a photo of whoever is using it, or their social media activity: none of that
is derivable from an IP address, so the module doesn't claim to show it.

- In demo mode (`VITE_USE_MOCK=true`), lookups use a small built-in sample set (including the
  Abuja example above) plus a deterministic fallback for any other IP, so the page works with
  no API key.
- For live lookups, set `VITE_USE_MOCK=false` and `VITE_IPINFO_TOKEN=<your ipinfo.io token>` in
  `.env`. The page calls `https://ipinfo.io/<ip>/json?token=...` directly from the browser.
- "Save to history" stores the lookup (with an optional case note) via
  `POST /integrations/geo/lookups` so analysts can attach it to a case later.

## Theme toggle

Dark is still the default (nothing changes until a user switches), but the app now supports
light mode too. `context/ThemeContext.tsx` holds the current theme (persisted in
localStorage) and sets `data-theme` on `<html>`; `styles/base.css` defines a
`[data-theme="light"]` token block alongside the original dark tokens. The toggle button lives
in the top bar and on the new Settings page.

## SOC Operations module

A new sidebar group mirroring a standard SOC console, each page reusing the same ResourcePage /
DataTable / DynamicForm patterns as the rest of the app:

- **Real-Time Monitor** — live stat cards, the attack map, and an auto-refreshing recent-alerts feed.
- **SIEM Search**, **Threat Intelligence** — standalone versions of the panels also reachable from Integrations.
- **Alerts**, **Incidents**, **Endpoint Security**, **Vulnerability Mgmt**, **Reports**, **Playbooks** — new
  CRUD tables backed by `services/soc.ts` and `mocks/soc.ts`.
- **Network Watch** — the attack map plus a connections table.
- **Case Management** — routes to the existing Cases page (`features/cases/CasesPage.tsx`, unchanged) so it
  appears in both the Investigations and SOC Operations groups without duplicating code.
- **Settings** — org/notification preferences (demo form, not persisted) plus the theme toggle.

### Attack map (point-to-point, city/country level)

`components/geo/AttackMap.tsx` draws animated arcs between aggregate source and destination
points. Hovering an endpoint shows "City, Region, Country"; clicking it zooms the canvas in
around that point (click again to zoom back out). Endpoints are always city/region/country
centroids from the same geolocation data as the IP Intelligence and Threat Intelligence pages —
never a street address, and never tied to an individual.

### Satellite Uplink

`/soc/satellite`: a CSS-only 3D satellite (`components/satellite/Satellite3D.tsx`) rotating
slowly on the X and Y axes, speeding up and glowing while "acquiring" or "connected", next to a
dark command terminal (`components/satellite/SatelliteTerminal.tsx`). Commands: `SCAN`,
`CONNECT <name|NORAD id>`, `STATUS`, `DISCONNECT`, `CLEAR`, `HELP`.

This deliberately surfaces real, public orbital data only — which satellite, its altitude, and
its next pass over a region (`services/satelliteService.ts`, `mocks/soc.ts`) — the same kind of
information sites like N2YO or Heavens-Above publish. There is no command that returns a
person's location, photo, or online activity, because no satellite uplink can actually provide
that for a third party; the terminal explicitly refuses command text that asks for it.

## SOC Overview

`/soc/overview` — the first item in the SOC Operations group — mirrors the reference SOC
dashboard layout: five trend stat cards with inline sparklines, a Real-time Attack Map card
(top attacking countries + attack-type donut alongside the live `AttackMap`), an Alert
Distribution donut, a System Status list, Recent Alerts, Recent Cases, and a scrolling Threat
Intelligence Feed ticker. New reusable pieces: `components/charts/DonutChart.tsx` (CSS
conic-gradient donut) and `components/charts/MiniSparkline.tsx`. Data is in `mocks/soc.ts`
(`mockOverviewStats`, `mockTopCountries`, `mockAttackTypes`, `mockAlertDistribution`, etc.) —
wire these to real endpoints the same way the other SOC pages are wired to `services/soc.ts`.

## Scrollbars & responsiveness

Scrollbars are hidden everywhere (`styles/responsive.css`) — sidebar, tables, the terminal,
modals — while scrolling itself still works via touch, trackpad, or keyboard; nothing lost the
ability to scroll. The same file adds breakpoints for small phones (stat grids drop to 2 then 1
column, toolbars and the top bar stack, modals stay within the viewport) and respects iPhone/iPad
safe-area insets for the notch and home indicator, on top of the breakpoints each page already had.

## Organization portals: Staff workspace + Client portal

Two more dashboards, each for a different audience of an organisation that's registered on the
platform, reachable from the admin sidebar's "Organization Portals" group (`/staff`, `/client`)
or directly by URL. Both reuse the exact same UI kit as the admin dashboard (Button, Card, Badge,
DataTable, DynamicForm, ResourcePage, etc.) — only the shell and theme are new.

### Shared shell

`components/layout/PortalLayout.tsx` + `PortalSidebar.tsx` + `PortalTopbar.tsx` are generic:
they take a `portal` ('staff' | 'client'), a `navigation` tree, branding and an optional footer,
and render the sidebar/top bar structure. `StaffLayout.tsx` and `ClientLayout.tsx` are a few
lines each — they just supply the nav config and branding and set `data-portal` so the right
theme applies. Adding a third portal later is: one nav config, one theme file, one `XLayout.tsx`.

### Visual identity

Colour comes entirely from CSS variables scoped to `[data-portal="staff"]` /
`[data-portal="client"]` (`styles/staff-theme.css`, `styles/client-theme.css`), layered on top of
the same `.btn` / `.card` / `.table` / `.badge` / `.input` classes the admin dashboard already
uses — no component had to be forked:

- **Admin** (existing): dark navy/teal, SOC/cyber aesthetic.
- **Staff workspace** (`/staff`): dark indigo sidebar, light content area — a focused,
  professional SaaS tool for the organisation's own analysts. Pages: Overview (my tasks +
  latest alerts), My Tasks (CRUD), and read-only/reused views of Cases, Evidence and Alerts
  (same components the admin dashboard uses), Team, Reports, Settings.
- **Client portal** (`/client`): fully light, white sidebar, sky-blue accent, extra-rounded
  cards and buttons (`--radius-lg: 18px`, pill buttons/badges) — a friendly, non-technical
  portal for the organisation's own customers. Pages: Overview (case/invoice/ticket summary),
  Cases (read-only, no severity exposed), Reports (read-only), Billing (invoices), Support
  (view + open tickets via a DynamicForm), Settings (org profile).

### New data

`types/models.ts`: `OrgProfile`, `Invoice`, `SupportTicket`, `StaffTask`. Mock data and services
follow the established pattern (`mocks/client.ts` / `mocks/staff.ts`, `services/client.ts` /
`services/staff.ts`, built on the same `createService()` used everywhere else), so flipping
`VITE_USE_MOCK=false` points them at real endpoints the same way as every other module.

### Simplification to know about

Both portals currently sign in through the same mock `AuthContext`/`authService` as the admin
dashboard (one login screen, one mock user) — there's no separate client/staff authentication,
organisation-scoping of data, or per-user permission check yet. For production you'd want: a
real `organization_id` on every record and a server-side filter by it, separate login flows (or
one login that redirects by role), and route guards so a client can't reach `/staff` or `/`.

## RBAC model + Organization Dashboard (this round)

### Roles

`super_admin`, `admin` — DeepSecure360's own platform operators, full access to every module
(the root admin dashboard you already had). `org_admin` — the admin for one registered
organisation (e.g. a bank, an exchange, a government agency) — gets the new **Organization
Dashboard** at `/org`. `security_analyst`, `forensic_investigator`, `org_staff` — that
organisation's own staff — share the **Staff workspace** at `/staff`. `viewer` and `api_client`
get no dashboard at all (the consumer-facing AI chat product described below is where `viewer`
lives).

`config/rbac.ts` is the single source of truth for which module keys each role can see
(`ROLE_MODULES`, `canAccessModule()`). The nav configs (`navigation.ts`, `navigation.staff.ts`,
`navigation.org.ts`) build their menus from the same module list described there — a real backend
should enforce the identical list server-side.

### Organization Dashboard (`/org`, org_admin)

New layout (`components/layout/OrgLayout.tsx`) with the full module set you asked for — Case
Management, Evidence, Forensics, Analysis Jobs, IP Intelligence, Real-Time Monitor, SIEM Search,
Alerts, Incidents, Endpoint Security, Threat Intelligence, Network Watch, Vulnerability Mgmt —
every one of them the *same component* the main admin dashboard uses, just mounted under `/org/*`.
Plus three new pages:

- **Staff Accounts** (`/org/staff-accounts`) — org_admin creates/edits/deactivates their own
  `security_analyst` / `forensic_investigator` / `org_staff` accounts. Creating one shows a toast
  simulating the "login credentials emailed" step (no real email is sent — see Limitations).
- **Billing & Plan** (`/org/billing`) — the 3m/6m/1y/2y/3y/4y/5y term picker you asked for (styled
  like a hosting provider's renewal page), a trial countdown banner, and a "Request activation"
  action that flips the org to `pending_approval`.
- **Branding & Settings** (`/org/settings`) — sidebar colour, accent colour, logo text and a dark
  mode toggle, with a live preview. Saved values flow into `OrgBrandingContext`
  (`context/OrgBrandingContext.tsx`), which `OrgLayout` applies as CSS variables
  (`--org-sidebar-bg`, `--org-accent`) on top of the `org-theme.css` defaults — so every
  organisation can look different without forking a single component.

### Staff workspace (`/staff`) — updated module list

Nav now matches what you specified: My Tasks, Case Management, Evidence, Analysis Jobs, Alerts,
IP Intelligence, Threat Intelligence, Forensics, SIEM Search (plus Team/Reports/Settings, kept
from the previous round).

### Platform-side: Organizations (`/organizations`, super_admin/admin)

New page listing every registered organisation with its subscription status and account status.
**Approve payment** flips a `pending_approval` org to `active` (which is what unlocks every module
on that org's dashboard — there's no separate per-module unlock, matching "if not, modules are
deactivated"). **Deactivate** turns off an org's dashboard access entirely — this is the "the
client account (org_admin) can be deactivated from the DeepSecure360 main admin dashboard"
control. Deactivating DeepSecure360's own `admin`/`super_admin` accounts, and an organisation's
own staff accounts, both already work through the existing **Users** page / **Staff Accounts**
page's "Account is active" checkbox — no separate control was needed for those.

### What's a frontend prototype, not a real backend (read this before pricing or promising it)

Every dashboard in this project — including everything built this round — is a React UI wired to
mock data (`VITE_USE_MOCK=true` by default), the same pattern used throughout. Concretely, still
missing before any of this is real:

- **Auth & RLS**: one shared mock login; no real per-organisation data isolation, no Supabase/JWT,
  no server-side permission checks. `config/rbac.ts` defines the intended rule set but nothing
  enforces it outside the UI yet.
- **Email**: "invite sent" / "credentials emailed" are toast notifications only — no transactional
  email provider is wired up.
- **Payments**: the billing page is a plan picker + status flag; no payment gateway is integrated.
- **The AI chat product** you described (public, no-login chat interface with voice input, file/
  image upload, PDF export of answers, chat history, a social "Public Hub" with posting/commenting/
  share-to-Facebook-Instagram-LinkedIn-TikTok, many-language translation, category-scoped AI
  answers) is a **separate, large product** — a consumer app, not another admin dashboard — and
  isn't built in this round. It needs real infrastructure this sandbox can't stand up (a speech-
  to-text API, a translation API, an LLM backend, a social feed backend, moderation). I can build
  its frontend shell next (chat UI, history sidebar, Public Hub feed, language/category pickers,
  profile section, free-trial banner) wired to mock responses the same way everything else here
  is — say the word and I'll scope and start it the same way as this round.

## AI Assistant — public chat product (`/assistant`, no login required)

A separate consumer-facing product living in its own `src/assistant/` folder, not part of the
RBAC admin/org/staff system — it's the ChatGPT/Civiqli-style experience for visitors described
in the spec. Reuses this project's existing UI kit (Button, Card, Badge, Icon, ThemeToggle,
SocialLinks) but has its own layout, sidebar and green theme (`styles/assistant.css`,
`[data-portal="assistant"]`).

### What's there
- **Chat** (`/assistant`) — type or "record" (demo voice-to-text) a question, attach a file or
  image (UI only), pick a cybersecurity category so answers stay scoped to it (`data/categories.ts`),
  four modes — Chat, Clarify, Comprehend video, Incident response — each a quick-start into the
  same chat engine. Mentioning "pdf" or "download" in a message makes that reply's answer
  downloadable; there's also an always-available "Export conversation" button once a thread has
  messages, built with `jspdf` (added to `package.json` — run `npm install`).
- **Chat history** — every conversation is saved to `localStorage` (`services/chatStorage.ts`):
  searchable, deletable, auto-titled from the first message.
- **Public Hub** (`/assistant/hub`) — a small social feed: post, like, comment, and a **Share**
  button that opens Facebook/X/LinkedIn/Telegram/WhatsApp's own share dialog with the post text
  pre-filled (TikTok has no public web share link, so it copies the text instead). This is the
  realistic version of "share to social media": the visitor posts it themselves, from their own
  logged-in account, rather than the app silently posting on their behalf.
- **Language switcher** — 13 languages listed (`data/languages.ts`), including Yoruba, Hausa,
  Igbo and Nigerian Pidgin; the UI chrome (buttons, labels) actually translates for English,
  Yoruba, Hausa and Pidgin (`data/i18n.ts`) to prove the mechanism end-to-end. Every other
  language, and the AI's own answers in any language, fall back to English — see Limitations.
- **Profile** (`/assistant/profile`) — editable name and picture (stored as a data URL in
  `localStorage`), language, dark mode, and free-trial status. The same profile chip sits in the
  sidebar on every page.
- **Free trial banner** — 14 days from first visit (`services/profileStorage.ts`), shown to
  anyone not signed in as an org_admin. It's a banner, not a paywall — see Limitations.
- **Organization hand-off** — if someone signed in as `org_admin` lands on `/assistant`, the chat
  is replaced with a "go to your dashboard" prompt instead of the public chat; otherwise there's a
  "Sign in as an organization" link in the sidebar pointing at the existing `/login`.

### What this is not (read before quoting a client on it)

Like the rest of this project, this is a wired-up frontend prototype, not production
infrastructure:
- **The AI is a canned response bank** (`data/mockReplies.ts`), not a real model call. A real
  build needs a backend endpoint that calls an actual LLM, scoped by the selected category.
- **Voice input is simulated** — it inserts one fixed sentence after a delay. A real build needs
  a speech-to-text API (e.g. the browser's Web Speech API as a cheap start, or a hosted STT
  service for reliability).
- **"Comprehend video" doesn't analyse a real video** — it's a mode label on the same mock chat
  engine. Real video understanding needs a video-AI service.
- **Translation of the AI's actual answers isn't live** — only the four languages above have a
  translated UI dictionary, and it only covers interface chrome, not generated answers. Real
  multi-language answers need a translation API (or an LLM prompted to answer in the requested
  language) in the backend.
- **The free trial isn't enforced** — nothing stops usage after day 14 except the banner's wording.
- **Chat history and Hub posts are per-browser** (`localStorage`), not per-account — clearing
  browser data loses them, and nothing is shared between devices.

## Major restructure: AI Assistant is now the landing page

The admin dashboard moved from `/` to **`/admin`** (nav paths in `config/navigation.ts` updated
to match, `Sidebar.tsx`'s "home" check updated). The admin login at `/login` is untouched and
still only reachable from `/login` — after signing in it now lands on `/admin` instead of `/`.
**`/` is now the public AI Assistant** (`AssistantLayout` → `ChatPage`), so visiting the site with
no path at all opens the chat, not a login screen.

### Two-step onboarding

A first-time visitor can only use **basic Chat** (New Chat). Clarify, Comprehend, Incident
Response and Public Hub show a lock icon and send the visitor to `/signin` if clicked — this is
enforced both in the sidebar (`AssistantSidebar`'s `locked` prop) and again at the route level
(`ClarifyPage`, `ComprehendPage`, `PublicHubPage` each redirect to `/signin` if not signed in), so
typing the URL directly doesn't bypass it.

### A second, separate sign-up/sign-in system

`/signup` and `/signin` are brand new and have **nothing to do with the admin login** —
different context (`AssistantAuthContext`), different storage key, different pages. Sign-up asks
for a role: **Visitor**, **Private organisation**, **Public sector**, or **Government** (the
last three all become `org_admin` with a `sector`), plus "or sign up with Google / LinkedIn /
Facebook / Twitter" buttons — these are mocked (no real OAuth; see Limitations). After signing
up, the visitor is sent to `/signin` to log in, per your two-step flow, rather than being
auto-logged-in.

Signing in resolves the account and redirects automatically:
- `org_admin` → `/org` (their Organization Dashboard)
- `security_analyst` / `forensic_investigator` / `org_staff` → `/staff`
- `super_admin` / `admin` → `/admin`
- `viewer` → stays on the assistant, now fully unlocked

Staff/admin accounts aren't created through this sign-up (they're created from **Staff
Accounts** inside the Organization Dashboard, or already seeded) — signing in with one of their
emails on `/signin` still resolves and redirects correctly, by checking the existing `mockUsers`
directory as a fallback.

### Civiqli-style Clarify & Comprehend

Both are now dedicated pages (no chat input), not chat modes: a Pinterest-style masonry grid
(`components/MasonryGrid.tsx`, pure CSS columns) of colour-coded cards per category, with the
same category pill filter row as the reference screenshots. Clicking a card opens a full-screen
single-card gallery (`components/CardGallery.tsx`) with prev/next arrows, a share/bookmark/like/
comment-count rail, matching the Civiqli reference. Comprehend's cards are video tiles with a
thumbnail, duration badge and play icon (`VideoCardTile.tsx`); its gallery shows a video-player
placeholder instead of body text, same rail, same navigation — no real video playback is wired up
(see Limitations).

### Chat history: pin, rename, add to project, move to group, delete

Each history item now has a "⋯" menu (`HistoryItemMenu.tsx`) with all five actions; pinned
conversations float to their own section above "Recent chats". Project/group are simple demo
string fields (`CHAT_PROJECTS`, `CHAT_GROUPS` in `assistant/types.ts`) — a real build would want
these as their own entities with their own CRUD rather than fixed arrays.

### Profile, matched to your backend `User` entity

Reworked `VisitorProfile` to mirror the fields on the TypeORM entity you shared —
`first_name`/`last_name` instead of one display name, plus `email`, `role`, `mfa_enabled`,
`is_active`, `organization_id` — so this maps directly onto a real `GET/PATCH /users/me` later.
The Profile page now shows an MFA toggle and an account-type badge to match.

### Dark mode — the actual bug, fixed

Every portal theme (`org-theme.css`, `staff-theme.css`, `client-theme.css`, `assistant.css`) was
unconditionally overriding every colour token regardless of the dark/light toggle, so switching
themes did nothing inside any of those four portals — only the plain admin dashboard ever
actually changed. Each file now has a `[data-portal="X"][data-theme="dark"]` block with a real
dark palette, which wins on specificity once the toggle is flipped. Confirmed by re-reading how
`ThemeContext` sets `data-theme` on `<html>` and tracing the CSS cascade.

### Language list

Reduced to **English, Hausa, Igbo, Yoruba, Nigerian Pidgin** everywhere (signup is unaffected;
this was the assistant's interface language list). Igbo now has a translated UI dictionary too
(`data/i18n.ts`), so all five actually work rather than four-plus-fallback.

### Still not real (unchanged from before, now covering more surface area)

Social sign-up/sign-in is a mocked button, not real OAuth. Clarify/Comprehend content is a fixed
seed list, not a live feed. Video playback is a placeholder. Everything about accounts, roles and
sessions in `/signup`, `/signin` and `AssistantAuthContext` is `localStorage`/`sessionStorage`,
not a real backend — it's shaped to match your `User` entity so wiring it to a real API later is
mostly a matter of swapping `authStorage.ts`'s internals for `fetch` calls.
