# EV Guide — QA Report & Admin Panel Documentation

**Date:** 2026-05-16  
**Scope:** Full UI/UX audit of all admin pages, public-facing pages, and database admin panel.

---

## 1. Critical Bugs Fixed

### 1.1 Exchange Admin — Super Admin Locked Out (CRITICAL BUG)
**File:** `app/admin/exchange/page.tsx:76`  
**Issue:** Auth guard used `profile?.role !== "admin"` — this blocked `super_admin` users from accessing the exchange page, silently redirecting them to `/`.  
**Fix:** Changed to `profile?.role !== "admin" && profile?.role !== "super_admin"`.

### 1.2 Dead Code — Unused `UserTable` Component
**File:** `app/admin/users/page.tsx`  
**Issue:** A full `UserTable` inner function was defined inside `AdminUsersPage` but never used. It was suppressed with `void UserTable` — a code smell that hides the problem. The actual component in use is `StaticUserTable`.  
**Fix:** Removed the dead `UserTable` function and its accompanying `formatDate` helper and `void UserTable` suppression line.

---

## 2. Theme Inconsistencies Fixed

The admin panel uses a dark glassmorphism theme (`bg-surface-panel`, dark surfaces). Several pages were using light-mode Tailwind colours (`bg-blue-50`, `bg-amber-100`, `text-blue-700`, etc.) that render as opaque light boxes on the dark background.

### 2.1 Exchange Page — Status & Priority Badges
**File:** `app/admin/exchange/page.tsx`  
- `STATUS_COLORS`: Changed from `bg-*-100 text-*-700` → `bg-*-500/20 text-*-300`  
- `PRIORITY_COLORS`: Same conversion  
- Unread row highlight: `bg-blue-50/40` → `bg-blue-500/[0.06]`  
- Final offer price label: `text-emerald-600` → `text-emerald-400`  
- "View" action button: `bg-blue-50 text-blue-700` → `bg-white/[0.06] text-white/70`

### 2.2 Users Page — Role Badges & Permission Notice
**File:** `app/admin/users/page.tsx`  
- `RoleBadge` for `super_admin`: `bg-violet-100 text-violet-700` → `bg-violet-500/20 text-violet-300`  
- `RoleBadge` for `admin`: `bg-blue-100 text-blue-700` → `bg-blue-500/20 text-blue-300`  
- Permission notice (view-only): `bg-amber-50 border-amber-200 text-amber-800` → `bg-amber-500/10 border-amber-500/30 text-amber-300`  
- Admin count badge: `bg-blue-100 text-blue-700` → `bg-blue-500/20 text-blue-300`

### 2.3 Audit Page — Status Tones, Badges & Section Cards
**File:** `app/admin/audit/page.tsx`  
- `toneMap`: All statuses converted from light (`bg-*-50 text-*-900`) to dark (`bg-*-500/10 text-*-300`)  
- `badgeMap`: All converted from `bg-*-100 text-*-700` to `bg-*-500/20 text-*-300`  
- "Warnings" stat card: `bg-amber-50 border-amber-200 text-amber-900/700` → dark equivalents  
- "Missing or broken" stat card: `bg-rose-50` → `bg-rose-500/10`  
- "Blocked admin routes" stat card: `bg-blue-50` → `bg-blue-500/10`  
- "Recommended next actions" section: `bg-blue-50 text-blue-950/900/800` → `bg-blue-500/10 text-blue-300/200`  
- "System Audit" section label: `text-blue-600` → `text-blue-400`  
- "Review SEO admin" link: light hover states → dark hover states

### 2.4 Finance Requests Page — Stats Cards & Section Label
**File:** `app/admin/finance-requests/page.tsx`  
- "Finance Intelligence" label: `text-blue-600` → `text-blue-400`  
- Status stat cards (`new`, `reviewing`, `approved`, `converted`): `bg-*-50 border-*-200` → `bg-*-500/10 border-*-500/20`

---

## 3. Remaining Known Issues (Not Fixed — Lower Priority)

| # | Issue | File | Severity |
|---|-------|------|----------|
| 1 | Both "Enquiries" and "Vehicle Consultancy" sidebar links show the same `consultations` badge count | `components/AdminSidebar.tsx:86,90` | Low |
| 2 | Homepage section comments skip number 5, duplicate 8 | `app/page.tsx` | Cosmetic |
| 3 | `getExchangeRequests()` called twice on exchange page (once filtered, once unfiltered for tab counts) | `app/admin/exchange/page.tsx:80,83` | Performance |
| 4 | No `error.tsx` boundary in admin layout — unhandled errors crash the full admin panel | `app/admin/` | Medium |
| 5 | Missing loading states for ~22 admin pages (only 5 exist) | `app/admin/**/loading.tsx` | Medium |
| 6 | Hard-coded row limits (50–500) with no pagination UI | Multiple admin pages | Medium |
| 7 | No admin audit log (who changed what, when) | — | Medium |
| 8 | No bulk actions (multi-select delete/status update) on any table | Multiple admin pages | Low |
| 9 | Only consultations/enquiries have CSV export | Multiple admin pages | Low |

---

## 4. Admin Panel Documentation

### 4.1 Architecture

```
app/admin/
├── layout.tsx          — Auth guard (admin + super_admin), sidebar, pending badge counts
├── page.tsx            — Dashboard: stats grid + task completion report + recently added EVs
├── audit/              — Database schema audit, migration status, admin route health
├── evs/                — EV model CRUD (list, new, [id] edit)
├── blog/               — Blog post CRUD (list, new, [id] edit)
├── feedback/           — User feedback moderation (approve/reject)
├── seo/                — SEO page metadata (list, new, [id] edit)
├── seo/keywords/       — SEO keywords management (list, [id] edit)
├── geo/                — GEO region management (list, new, [id] edit)
├── consultations/      — Vehicle consultancy enquiries (status workflow + email forwarding)
├── enquiries/          — Alternative enquiry view with date/status filter toolbar
├── leads/              — Lead pipeline with AI scoring
├── pipeline/           — Kanban board of lead pipeline stages
├── crm/                — Customer journey CRM ([id] for individual journeys)
├── vehicle-queries/    — AI Match query leads
├── test-drives/        — Test drive booking management
├── exchange/           — Vehicle exchange requests ([id] for detail view)
├── finance-requests/   — Finance intent requests (3-layer fallback: finance_requests → finance_enquiries → consultation_requests sector=bank)
├── recommendations/    — AI recommendation engine outputs
├── battery-reports/    — Battery health reports (SOH status)
├── fleet-enquiries/    — Fleet/B2B enquiry management
├── used-listings/      — Used EV marketplace listings
├── dealers/            — Dealer account management (list, new, [id] detail)
├── dealer-listings/    — Dealer vehicle listings with approval workflow
├── dealer-bids/        — Dealer bid management
├── dealer-applications/— Dealer partner applications
├── data-insights/      — Platform analytics (sector distribution, model interest, time series)
├── business-plan/      — Business stack documentation (informational)
├── staff/              — Staff & department management
└── users/              — Users & Access management (super_admin only for role changes)
```

### 4.2 Role-Based Access Control

| Role | Access |
|------|--------|
| `super_admin` | All sections, all departments, can manage roles |
| `admin` (management dept) | General, Content, Vehicles, Dealers, Finance |
| `admin` (sales/support dept) | General, Vehicles, Dealers |
| `admin` (operations dept) | General, Vehicles, Dealers, Finance |
| `admin` (finance dept) | General, Finance only |
| `admin` (technical/marketing dept) | General, Content only |
| `admin` (no dept / pre-migration) | Full access (backwards compat) |

### 4.3 Sidebar Pending Badge Counts

The layout fetches live counts for sidebar badges on every page load:

| Badge key | Tracks |
|-----------|--------|
| `consultations` | `consultation_requests` where `status = 'pending'` |
| `vehicleQueries` | `vehicle_queries` where `status = 'new'` |
| `leads` | `crm_leads` where `status = 'new'` |
| `financeRequests` | `finance_requests` where `status = 'new'` |
| `exchange` | `exchange_requests` where `status = 'pending'` |
| `feedback` | `user_ev_feedback` where `is_approved = false` |
| `dealerAccounts` | `dealer_profiles` where `status = 'pending_approval'` |
| `dealerListings` | `dealer_listings` where `status = 'pending'` |

### 4.4 Finance Requests — Fallback Logic

The finance requests page queries tables in priority order:

1. **Primary:** `finance_requests` table (full finance intent data — deposit, term, income band, credit rating)  
2. **Fallback 1:** `finance_enquiries` table (older schema — maps loan_years × 12 to term_months, down_payment to deposit_gbp)  
3. **Fallback 2:** `consultation_requests` filtered by `sector = 'bank'` (uses bank_name as lender, ev_model_label as vehicle)

The active data source is not shown in the UI. The `source` field on each row indicates which table it came from.

### 4.5 API Routes

| Method | Path | Purpose |
|--------|------|---------|
| GET | `/api/admin/users` | List all users with roles |
| PATCH | `/api/admin/users/[id]` | Update user role |
| GET/POST | `/api/admin/consultations` | Consultation CRUD |
| POST | `/api/admin/consultations/export` | CSV export |
| POST | `/api/admin/consultations/forward` | Email to lender via Resend |
| GET/PATCH | `/api/admin/crm/[profileId]` | Lead management |
| POST | `/api/admin/crm/[profileId]/notes` | Add CRM notes |
| GET/POST/PATCH | `/api/admin/dealers` | Dealer CRUD |
| PATCH | `/api/admin/dealers/[id]` | Dealer status update |
| POST | `/api/admin/feedback/[userId]` | Moderate single feedback |
| POST | `/api/admin/feedback/bulk` | Bulk feedback moderation |
| GET/POST | `/api/admin/seo-keywords` | Keyword management |
| DELETE | `/api/admin/seo-keywords/[id]` | Delete keyword |
| POST | `/api/admin/seo/sync` | Sync SEO data |
| POST | `/api/admin/test-drives/forward` | Forward test drive to dealer |
| POST | `/api/admin/seed-vehicles` | Seed EV database from static data |

### 4.6 Supabase Client Strategy

| Client | File | Used for |
|--------|------|---------|
| `createClient()` | `lib/supabase/server.ts` | SSR auth checks, RLS-aware queries |
| `createAdminClient()` | `lib/supabase/admin.ts` | Service role queries, bypasses RLS |
| `createClient()` | `lib/supabase/client.ts` | Browser client components (sidebar sign-out) |

Admin pages always auth-check with `createClient()` then query data with `createAdminClient()` where RLS bypass is needed (e.g., viewing other users' data).

### 4.7 Environment Variables Required

```env
NEXT_PUBLIC_SUPABASE_URL=         # Public Supabase project URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=    # Public anon key
SUPABASE_SERVICE_ROLE_KEY=        # Service role key (server only, never expose to client)
RESEND_API_KEY=                   # For email forwarding (consultation/finance/test-drive)
```

### 4.8 Database Tables (Admin-Relevant)

| Table | Purpose |
|-------|---------|
| `profiles` | User profiles with `role` and `department` columns |
| `ev_models` | EV vehicle catalogue |
| `blog_posts` | Blog content with SEO metadata |
| `user_ev_feedback` | User reviews / ratings |
| `consultation_requests` | Vehicle consultancy enquiries |
| `vehicle_queries` | AI Match leads from "Find My EV" |
| `seo_pages` | Per-page SEO metadata |
| `geo_regions` | Geographic region targeting |
| `crm_leads` | CRM lead tracking with status |
| `crm_lead_notes` | Notes added by admin per lead |
| `user_intent_profiles` | User session intent data |
| `test_drive_bookings` | Test drive requests |
| `exchange_requests` | Part-exchange requests |
| `finance_requests` | Finance intent submissions |
| `recommendations` | AI recommendation engine outputs |
| `dealer_profiles` | Dealer accounts |
| `dealer_listings` | Dealer vehicle listings |
| `used_ev_listings` | Used EV marketplace listings |
| `lead_scores` | Computed lead scores by session |

---

## 5. Public-Facing Pages — QA Summary

| Page | Status | Notes |
|------|--------|-------|
| `/` (Home) | OK | Proper Suspense boundaries, dynamic imports for below-fold |
| `/cars/[id]` | OK | loading.tsx present |
| `/blog` | OK | loading.tsx present |
| `/blog/[slug]` | OK | loading.tsx present |
| `/compare` | OK | Client-side comparison tool |
| `/charging` | OK | loading.tsx present |
| `/appointment` | OK | loading.tsx present |
| `/consultation` | OK | Wizard flow |
| `/finance` | OK | — |
| `/exchange` | OK | — |
| `/login` | OK | Supabase auth |

**Footer (PremiumFooter):** Correct dark-theme styling throughout. Newsletter, social links, trust badges, FCA disclaimer all present. App Store / Google Play buttons shown as "Coming soon" placeholders (non-functional by design).

---

## 6. Files Changed in This QA Pass

| File | Change |
|------|--------|
| `app/admin/exchange/page.tsx` | Auth bug fix + 5 theme fixes |
| `app/admin/users/page.tsx` | Dead code removal + 3 theme fixes |
| `app/admin/audit/page.tsx` | 10+ theme fixes (toneMap, badgeMap, stat cards, actions section) |
| `app/admin/finance-requests/page.tsx` | 2 theme fixes (label color + stat card backgrounds) |
