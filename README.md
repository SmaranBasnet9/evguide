# EV Guide

UK-focused EV marketplace. Helps buyers research, compare, finance, and exchange electric vehicles. Built on Next.js 16 App Router with Supabase for data and auth.

---

## Table of Contents

- [Stack](#stack)
- [Pages](#pages)
- [Component Structure](#component-structure)
- [Design System](#design-system)
- [Admin Panel](#admin-panel)
- [Dealer Portal](#dealer-portal)
- [Backend & API](#backend--api)
- [Database](#database)
- [Environment Variables](#environment-variables)
- [Getting Started](#getting-started)
- [Roadmap](#roadmap)

---

## Stack

| Layer | Technology |
|---|---|
| Framework | **Next.js 16** — App Router, React Server Components, Suspense streaming |
| UI | **React 19**, **Tailwind CSS v4**, **shadcn/ui** |
| Animation | **Framer Motion** |
| 3D | **Three.js / @react-three/fiber** |
| Icons | **lucide-react** |
| Backend | **Supabase** (Postgres + Auth + RLS) |
| AI | **Anthropic Claude** (via Anthropic SDK) |
| Email | **Resend** |

---

## Pages

### Public Routes (`app/`)

| Route | Description |
|---|---|
| `/` | Homepage — hero, featured EVs, spotlight, blog preview, budget browse, marketplace pulse |
| `/vehicles` | EV listing with advanced filter sidebar and sort |
| `/cars/[id]` | Individual EV detail page with TCO, tariff widget, charger CTA |
| `/used-evs` | Used EV listings with search and filters |
| `/compare` | Side-by-side comparison with optional 3D dual-scene |
| `/charging` | Charging station finder (OCPI data) |
| `/finance` | Finance calculator and enquiry flow |
| `/exchange` | Part-exchange request wizard |
| `/recommend` | AI-powered vehicle recommendation flow |
| `/consultation` | Multi-step consultation wizard |
| `/consultation/results` | Personalised consultation results |
| `/blog` | Blog hub with buyer journey sections |
| `/blog/[slug]` | Individual blog article with inline EV cards |
| `/appointment` | Book an appointment |
| `/dealers` | Dealer directory |
| `/dealer` | Dealer dashboard (authenticated dealers) |
| `/battery-health` | Battery health report tool |
| `/fleet` | Fleet enquiry form |
| `/accessories` | EV accessories marketplace |
| `/community` | Community hub |
| `/my-quotes` | Saved quotes for signed-in users |
| `/accessibility` | Accessibility statement |
| `/[region]/[slug]` | Programmatic SEO — geo × EV model pages |
| `/login` | User sign-in |
| `/signup` | User registration |

### Admin Auth Routes

| Route | Description |
|---|---|
| `/admin-login` | Admin email + password sign-in |
| `/admin-login/forgot-password` | Request password reset email |
| `/admin-login/reset-password` | Complete reset (handles Supabase PKCE code exchange) |

---

## Component Structure

```
components/
  ui/                     # shadcn/ui primitives (Button, Card, Input, Dialog, …)
  home/                   # Homepage sections
    HeroScene.tsx           # Three.js animated hero
    HeroSection.tsx         # Full hero with search console
    FeaturedEVs.tsx         # Featured EV cards
    EVSpotlight.tsx         # EV of the moment spotlight
    BrowseByBudget.tsx      # Budget-range quick filters
    QuickFilterStrip.tsx    # Horizontal filter strip
    MarketplacePulse.tsx    # Live stats / marketplace activity
    UsedEVsSection.tsx      # Used EV preview section
    DealerMarketplacePreview.tsx  # Dealer highlights
    EVAccessories.tsx       # Accessories preview
    CompareTeaserSection.tsx # Compare CTA teaser
    ActionBanners.tsx       # Promotional banners
    BlogPreview.tsx         # Latest articles preview
    Testimonials.tsx        # Social proof section
    AIRecommendation.tsx    # AI recommendation CTA
    FinancePreview.tsx      # Finance calculator preview
    HowItWorks.tsx          # How EV Guide works
    TrustStrip.tsx          # Trust badges
    FinalCTA.tsx            # Bottom CTA
    PremiumNavbar.tsx       # Top navigation with mobile hamburger
    PremiumFooter.tsx       # Footer with newsletter, trust badges, FCA disclaimer
    MobileBottomNav.tsx     # Sticky mobile bottom navigation bar
    NewsletterSection.tsx   # Newsletter signup section
    FooterSocialLinks.tsx   # Social media links
  vehicles/               # Listing and vehicle detail
    SmartVehicleListing.tsx # Main listing with filters
    PremiumFilterSidebar.tsx # Advanced filter sidebar
    PremiumVehicleCard.tsx  # EV card with glassmorphism
    VehicleDiscovery.tsx    # Discovery/search interface
    VehicleSort.tsx         # Sort controls
    EnergyTariffWidget.tsx  # Live energy tariff / charging cost widget
    HomeChargerCTA.tsx      # Home charger installation CTA
    InsuranceWidget.tsx     # EV insurance quote widget
    TestDriveButton.tsx     # Book test drive button
    VehicleQuoteButton.tsx  # Request dealer quote button
    DealerBidModal.tsx      # Dealer bid submission modal
  compare/                # Comparison feature
    ComparePageClient.tsx   # Main comparison client
    PremiumCompareTable.tsx # Spec comparison table
    PremiumCompareInsights.tsx # AI-generated insights
    PremiumCompareSummary.tsx  # Summary panel
    PremiumCompareCTA.tsx   # CTA panel
    PremiumCompareHero.tsx  # Comparison hero
    CompareDual3DScene.tsx  # 3D dual-vehicle render
  charging/               # Charging station finder
  finance/                # Finance calculator and enquiry
  exchange/               # Part-exchange wizard
  consultation/           # Multi-step consultation wizard
  enquiry/                # Enquiry forms
  assistant/              # EVChatInterface (Claude-powered AI chat)
  blog/
    article/              # Article page components
    hub/                  # Blog hub components
  dealer/
    TestDriveBookingsTable.tsx  # Dealer test-drive inbox
    DealerLeadsInbox.tsx        # Dealer leads dashboard
    DealerPendingScreen.tsx     # Pending approval state
    DealerRejectedScreen.tsx    # Rejected state
  used-evs/               # Used EV listing components
  auth/                   # Login prompt, auth guards
  legal/                  # Cookie consent, privacy
  design-system/          # Shared design primitives (GradientDivider, …)
  tracking/               # Client-side event tracking wrappers
  personalization/        # Intent-aware recommendation UI
  admin/
    StaffPanel.tsx          # Staff management panel
    FinanceRequestForwardButton.tsx
    EnquiriesToolbar.tsx    # Bulk actions toolbar
    DealerBidsTable.tsx     # Dealer bid review table
  AdminSidebar.tsx        # Role/department-aware nav sidebar
  Admin*.tsx              # Admin action buttons, forms, delete controls
  DealerSidebar.tsx       # Dealer portal navigation
  DealerVehicleForm.tsx   # Dealer vehicle listing form
  DealerEnquiryForm.tsx   # Dealer enquiry form
```

---

## Design System

Consistent dark glassmorphism across all pages:

| Token | Value |
|---|---|
| Background | `#0A0A0A` |
| Card surface | `bg-white/[0.06]` with `backdrop-blur-xl` |
| Card border | `border-white/10` |
| Accent / primary | `#1FBF9F` (teal-green) |
| Muted text | `text-white/60`, `text-white/40` |
| Card glow | `shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_32px_80px_rgba(0,0,0,0.5)]` |
| Corner glow | `shadow-[0_0_60px_rgba(31,191,159,0.15)]` on hover |

All cards use premium glassmorphism with teal corner glow on hover. Mobile-first responsive with a hamburger menu and sticky bottom navigation bar on small screens.

---

## Admin Panel

Accessed at `/admin`. Every page load validates auth + role server-side.

### Auth Flow

1. `/admin-login` — email + password form
2. `lib/auth/admin-login.ts` signs in via Supabase, then checks `profiles.role` is `admin` or `super_admin`
3. On success → redirect to `/admin`. On role failure → immediate sign-out + error
4. Forgot password → `/admin-login/forgot-password` → Supabase sends reset email
5. Email link → `/admin-login/reset-password?code=…` → PKCE code exchanged → set-password form → done

### Role-Based Sidebar Access

| Role / Department | Visible sections |
|---|---|
| `super_admin` | All sections |
| `admin` + `management` | General, Content, Vehicles, Finance |
| `admin` + `sales` / `support` | General, Vehicles |
| `admin` + `operations` | General, Vehicles, Finance |
| `admin` + `finance` | General, Finance |
| `admin` + `technical` / `marketing` | General, Content |
| `admin` (no department) | General, Content, Vehicles, Finance |

### Admin Modules

| Route | Purpose |
|---|---|
| `/admin` | Dashboard — live counts from all tables |
| `/admin/audit` | System audit log |
| `/admin/evs` | EV model CRUD |
| `/admin/blog` | Blog post CRUD |
| `/admin/feedback` | User review moderation |
| `/admin/seo` | Programmatic SEO page management |
| `/admin/seo/keywords` | SEO keyword management |
| `/admin/geo` | Geo region management |
| `/admin/leads` | Lead pipeline list |
| `/admin/pipeline` | Pipeline board (kanban-style) |
| `/admin/recommendations` | AI recommendation results |
| `/admin/consultations` | Consultation request handling |
| `/admin/crm` | CRM customer journey |
| `/admin/crm/[profileId]` | Individual customer view with notes |
| `/admin/vehicle-queries` | Find My EV query inbox |
| `/admin/exchange` | Exchange request management |
| `/admin/finance-requests` | Finance enquiry inbox |
| `/admin/test-drives` | Test drive booking management |
| `/admin/staff` | Staff account management |
| `/admin/users` | User access management |
| `/admin/dealers` | Dealer account management |
| `/admin/dealer-applications` | Dealer onboarding approvals |
| `/admin/dealer-listings` | Dealer vehicle listing review |
| `/admin/dealer-bids` | Dealer bid management |
| `/admin/used-listings` | Used EV listing management |
| `/admin/accessories` | Accessories catalogue management |
| `/admin/enquiries` | General enquiry inbox |
| `/admin/fleet-enquiries` | Fleet enquiry management |
| `/admin/battery-reports` | Battery health report management |
| `/admin/data-insights` | Platform analytics and insights |
| `/admin/business-plan` | Business plan and KPI tracker |

---

## Dealer Portal

Dealers can apply, manage listings, receive leads, and respond to test-drive requests.

### Dealer Auth Flow

1. Dealer applies via `/dealer-applications` endpoint
2. Admin reviews and approves at `/admin/dealer-applications`
3. On approval, dealer gains access to `/dealer` dashboard
4. Pending state → `DealerPendingScreen`; rejected → `DealerRejectedScreen`

### Dealer Modules (`/dealer`)

| Section | Purpose |
|---|---|
| Vehicle listings | Create and manage listings via `DealerVehicleForm` |
| Leads inbox | View and respond to enquiries via `DealerLeadsInbox` |
| Test drive bookings | Manage test drive requests via `TestDriveBookingsTable` |
| Dealer bids | Submit bids on vehicle queries via `DealerBidModal` |

### Security

- `lib/security/dealer.ts` — dealer-specific RLS enforcement and access guards
- Dealer routes validate both auth and dealer approval status server-side

---

## Backend & API

### Supabase Clients

| Module | When to use |
|---|---|
| `lib/supabase/client.ts` | Browser (client components, interactive forms) |
| `lib/supabase/server.ts` | Server components and API routes (reads cookies) |
| `lib/supabase/admin.ts` | Server-only, service role key — bypasses RLS |

Auth uses `@supabase/ssr` with PKCE. Sessions are cookie-based. All protected routes call `supabase.auth.getUser()` (not `getSession()`) to avoid stale token bugs.

### API Routes (`app/api/`)

**EV data:**
- `GET/POST /api/evs/` — list and create EV models
- `GET/PATCH/DELETE /api/evs/[id]` — individual EV CRUD
- `POST /api/admin/seed-vehicles/` — seed from static data
- `GET /api/vin-decode/` — VIN lookup and decode

**User flows:**
- `POST /api/consultation/` — submit consultation request
- `POST /api/test-drives/` — book a test drive
- `POST /api/exchange-requests/` — submit part-exchange
- `POST /api/finance-enquiries/` — finance enquiry
- `POST /api/leads/` — lead capture
- `POST /api/enquiries/` — general enquiry
- `POST /api/fleet-enquiries/` — fleet enquiry
- `POST /api/insurance-leads/` — insurance lead capture
- `GET/POST /api/saved-vehicles/` — saved EV list
- `POST /api/tco-calculate/` — total cost of ownership

**Dealer:**
- `POST /api/dealer-applications/` — dealer onboarding application
- `GET/POST /api/dealer-quotes/` — dealer quote requests
- `GET/POST /api/dealer/` — dealer portal API
- `GET/POST /api/admin/dealers/` — admin dealer management
- `GET/POST /api/admin/dealer-listings/` — admin listing review
- `GET/POST /api/admin/dealer-bids/` — admin bid management
- `GET/POST /api/used-listings/` — used EV listings

**AI / Intelligence:**
- `POST /api/claude/` — EV assistant (Claude via Anthropic SDK)
- `POST /api/recommendations/` — AI vehicle matching
- `POST /api/ai-match/complete` — complete AI match flow
- `GET /api/battery-health/` — battery health assessment

**Admin:**
- `GET/POST /api/admin/blog/` — blog CRUD
- `GET/POST /api/admin/consultations/` — consultation management
- `POST /api/admin/consultations/export/` — export consultations to CSV
- `POST /api/admin/consultations/forward/` — forward to sales
- `GET/POST /api/admin/crm/[profileId]/` — CRM profile
- `POST /api/admin/crm/[profileId]/notes/` — CRM notes
- `GET/POST /api/admin/feedback/[userId]/` — user feedback
- `POST /api/admin/feedback/bulk/` — bulk feedback moderation
- `POST /api/admin/test-drives/forward/` — forward test drive to dealer
- `GET/POST /api/admin/accessories/` — accessories management
- `GET/POST /api/admin/enquiries/` — enquiry management

**Infrastructure:**
- `GET /api/chargers/nearby` — OCPI charging station lookup
- `GET /api/bank-offers/` — financing offer data
- `GET /api/valuations/` — vehicle valuation
- `POST /api/newsletter/` — newsletter signup (Resend)
- `POST /api/consent/` — GDPR consent recording
- `GET /api/health` — health check (Supabase + Anthropic)

**Tracking:**
- `POST /api/platform/track` — platform event tracking
- `POST /api/platform/session` — session management

### Business Logic (`lib/`)

| Module | Purpose |
|---|---|
| `lib/evs.ts` | Fetch and cache EV models from Supabase |
| `lib/blog.ts` | Fetch blog posts with dummy fallback |
| `lib/leads.ts` / `lib/lead-pipeline.ts` | Lead scoring and pipeline state |
| `lib/vehicles/` | Filter, sort, search logic |
| `lib/recommendation-engine/` | Scored AI recommendation engine with explanations |
| `lib/finance-engine.ts` | PCP / HP / lease calculations |
| `lib/charging-engine.ts` | Charging cost and time calculations |
| `lib/comparison.ts` | Side-by-side scoring |
| `lib/ev-intelligence.ts` | Range confidence, TCO, enrichment |
| `lib/price-intelligence.ts` | Market price analysis |
| `lib/crm.ts` | CRM data access |
| `lib/seo.ts` / `lib/seo-keywords.ts` | SEO page and keyword CRUD |
| `lib/accessories.ts` / `lib/accessories-static.ts` | Accessories catalogue |
| `lib/profiling/` | Intent, financial, and buyer-style profiling |
| `lib/tracking/` | Event catalog, client tracking, identity |
| `lib/security/` | Rate limiting, admin verification, dealer guards, alerts |
| `lib/auth/admin-login.ts` | Admin-only login with role verification |

### Static Data (`data/`)

| File | Purpose |
|---|---|
| `data/evModels.ts` | Static EV model seed data |
| `data/usedEvListings.ts` | Static used EV listings data |

---

## Database

### Tables (Supabase)

| Table | Description |
|---|---|
| `profiles` | User profiles — `role` (`admin`/`super_admin`/`user`/`dealer`) and `department` |
| `ev_models` | EV vehicle records |
| `blog_posts` | Blog content with `published` flag |
| `user_ev_feedback` | User reviews — moderated via `is_approved` |
| `consultation_requests` | Consultation enquiries with status workflow |
| `vehicle_queries` | Find My EV queries |
| `seo_pages` | Programmatic SEO pages with `is_active` |
| `geo_regions` | Geographic regions for SEO targeting |
| `seo_keywords` | Keyword targeting rules |
| `dealers` | Dealer accounts and approval status |
| `dealer_listings` | Dealer vehicle listings pending review |
| `dealer_bids` | Dealer bids on vehicle queries |
| `used_listings` | Used EV listings |
| `accessories` | EV accessories catalogue |
| `enquiries` | General customer enquiries |
| `fleet_enquiries` | Fleet customer enquiries |

RLS is enabled on all tables. The admin service-role client bypasses RLS for internal operations.

### Migrations

Migrations live in `supabase/migrations/`. Apply in order:

| Migration | Purpose |
|---|---|
| `20260515000000_dealer_portal.sql` | Dealer portal tables, RLS, and policies |
| `20260520000000_create_accessories.sql` | Accessories catalogue table |
| `supabase/manual/018_apply_pending_migrations.sql` | Catch-up migration script |

Run `scripts/run-dealer-migration.mjs` to apply dealer migration programmatically.

### Admin DB Setup

Run `Documentation/supabase-admin-auth.sql` in the Supabase SQL editor, then promote an account:

```sql
select public.promote_user_to_admin('admin@example.com');
```

---

## Environment Variables

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# AI
ANTHROPIC_API_KEY=

# Email
RESEND_API_KEY=
```

---

## Getting Started

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build
```

Open [http://localhost:3000](http://localhost:3000).

---

## Roadmap

### High Value
- **Saved comparisons** — persist compare selections across sessions for signed-in users
- **Email alerts** — notify admin on new leads/consultations via Resend
- **Exchange valuation estimate** — show a live estimated value on the exchange wizard
- **EV search autocomplete** — instant search on `/vehicles` using debounced Supabase `ilike`
- **Dealer reviews** — user ratings for dealer accounts
- **Battery health API integration** — live battery state via third-party VIN service

### Admin Improvements
- **Bulk blog publish/unpublish** — checkbox select + bulk action in `/admin/blog`
- **Lead status history** — timeline view of status changes per lead in CRM
- **Export to CSV** — download button on consultations, finance-requests, fleet-enquiries
- **Admin notifications badge** — live count of new/unread items in the sidebar

### Platform
- **Webhook for new leads** — POST to Slack/Teams/Zapier on new consultation or lead
- **A/B test framework** — use `lib/tracking/` + a simple cookie to split-test hero CTAs
- **Rate limit dashboard** — surface `lib/security/rate-limit.ts` data in the audit page
- **Sitemap auto-generation** — dynamic `sitemap.xml` pulling from `seo_pages` and `geo_regions`
- **Dealer analytics** — impressions, clicks, and conversion per dealer listing
