# EVGuide — UK EV Marketplace Platform

EVGuide is a full-stack, production-grade electric vehicle marketplace for the UK market. It enables buyers to research, compare, finance, exchange, and purchase EVs and PHEVs through a unified platform serving consumers, dealers, and administrators.

---

## Table of Contents

- [Platform Overview](#platform-overview)
- [Technology Stack](#technology-stack)
- [Architecture](#architecture)
- [Pages & Routes](#pages--routes)
- [Component Library](#component-library)
- [API Reference](#api-reference)
- [Security Model](#security-model)
- [Business Flow](#business-flow)
- [Database Schema](#database-schema)
- [Environment Variables](#environment-variables)
- [Getting Started](#getting-started)
- [Deployment](#deployment)
- [Roadmap](#roadmap)

---

## Platform Overview

### Who it serves

| Persona | Journey | Key Features |
|---|---|---|
| **Consumer** | Research → Compare → Finance → Buy/Exchange | Vehicle search, AI recommendations, TCO calculator, finance enquiry, part-exchange, test drive booking |
| **Dealer** | Register → List → Respond to leads | Dealer portal, vehicle listings, lead inbox, bid system, analytics |
| **Administrator** | Manage all platform data | 40-page admin panel, CRM, lead pipeline, audit log, SEO tools |

### Core capabilities

- **AI-powered recommendations** — Claude-driven EV matching based on buyer profile, budget, range needs, and lifestyle
- **EV Intelligence** — range confidence checker, real-world TCO, charging cost calculator, energy tariff widget, home charger CTA
- **Part-exchange** — AI-assisted vehicle valuation using Claude, guided wizard, admin review flow
- **Dealer marketplace** — dealer application → approval → listing → lead routing → bid system
- **Finance** — PCP / HP / Lease calculator, finance enquiry flow with lender forwarding
- **Used EVs** — private seller listings with VIN decode, admin moderation
- **SEO** — programmatic SEO pages, keyword management, geo targeting

---

## Technology Stack

| Layer | Technology | Version |
|---|---|---|
| Framework | Next.js App Router + React Server Components | 16.2.1 |
| UI Runtime | React + React DOM | 19.2.4 |
| Styling | Tailwind CSS v4 + shadcn/ui | 4.x |
| Animation | Framer Motion | 12.x |
| 3D | Three.js / @react-three/fiber / @react-three/drei | 0.184 / 9.x / 10.x |
| Icons | lucide-react | 1.14 |
| Forms | react-hook-form + Zod | 7.x / 4.x |
| Database & Auth | Supabase (Postgres + Row Level Security) | 2.49 |
| AI | Anthropic Claude SDK | 0.81 |
| Secondary AI | OpenAI SDK | 6.x |
| Email | Resend | 6.x |
| Data Fetching | TanStack Query | 5.x |

### Build tooling

- TypeScript 5 with strict mode
- ESLint 9 with Next.js config
- Turbopack (via `--webpack` flag override where needed)
- Node.js heap set to 8 GB for large builds (`NODE_OPTIONS=--max-old-space-size=8192`)

---

## Architecture

### Project structure

```
evguide/
├── app/                        # Next.js App Router pages
│   ├── (public routes)         # Consumer-facing pages
│   ├── admin/                  # Admin panel (40+ pages, RBAC)
│   ├── dealer/                 # Dealer portal (authenticated)
│   ├── admin-login/            # Separate admin auth flow
│   ├── api/                    # API route handlers
│   │   ├── admin/              # Admin-only endpoints
│   │   └── dealer/             # Dealer-only endpoints
│   ├── error.tsx               # Global error boundary
│   ├── not-found.tsx           # Global 404 page
│   └── layout.tsx              # Root layout
├── components/
│   ├── home/                   # Homepage section components
│   ├── vehicles/               # Vehicle cards, filters, widgets
│   ├── compare/                # Side-by-side comparison engine
│   ├── blog/                   # Blog hub + article components
│   ├── exchange/               # Part-exchange wizard + modal
│   ├── consultation/           # Consultation wizard
│   ├── dealer/                 # Dealer portal components
│   ├── admin/                  # Admin-specific components
│   ├── finance/                # Finance calculator
│   ├── charging/               # Charging map + cards
│   ├── assistant/              # AI chat interface
│   ├── recommendation/         # Recommendation engine UI
│   ├── used-evs/               # Used EV listing components
│   ├── auth/                   # AuthGuard, LoginPrompt
│   ├── legal/                  # Cookie banner, privacy notice
│   ├── ui/                     # shadcn/ui primitives
│   └── (root)                  # Shared / cross-cutting components
├── lib/
│   ├── supabase/               # client / server / admin / public-server
│   ├── auth/                   # Admin login logic
│   ├── security/               # Guards, rate limiting, alerts
│   ├── tracking/               # Event tracking + identity
│   ├── profiling/              # Intent, financial, buyer-style profiles
│   ├── personalization/        # Intent profile hook
│   ├── recommendation-engine/  # Core scoring + explanation engine
│   ├── vehicles/               # Filter, sort, recommend, personalized-listing
│   ├── scoring/                # Lead scoring + recommendation scoring
│   ├── charging/               # Charging service, filters, types, logging
│   ├── actions/                # Server actions
│   ├── platform/               # Session, tracking, event names
│   ├── legal/                  # Company info
│   └── privacy/                # GDPR consent
├── data/                       # Static seed data (evModels, usedEvListings)
├── public/                     # Static assets (brands SVGs, images)
├── supabase/
│   ├── migrations/             # Auto-generated migrations
│   └── manual/                 # Hand-written SQL migrations
└── Documentation/              # Additional SQL and design docs
```

### Supabase client strategy

| Client | Module | Usage |
|---|---|---|
| Browser (anon) | `lib/supabase/client.ts` | Client components, auth state |
| Server (cookie) | `lib/supabase/server.ts` | Server components, API routes (user context) |
| Admin (service role) | `lib/supabase/admin.ts` | Admin API routes — bypasses RLS |
| Public server | `lib/supabase/public-server.ts` | Public data fetches without user context |

### Request flow

```
Browser → Next.js Edge/Node server
  → API Route Handler
    → Security guard (requireAdmin / requireDealer / auth check)
    → Rate limiter (in-memory bucket)
    → Supabase query (server client or admin client)
    → Resend email (notifications / forwarding)
    → JSON response
```

---

## Pages & Routes

### Public (Consumer) Pages

| Route | Description |
|---|---|
| `/` | Homepage — hero, featured EVs, EV spotlight, blog preview, accessories, budget browser |
| `/vehicles` | Full EV catalogue with filter sidebar (brand, price, range, body type) and smart sort |
| `/cars/[id]` | EV detail — specs, TCO calculator, energy tariff widget, charger CTA, quote modal |
| `/used-evs` | Used EV listings with search and filters |
| `/used-evs/[id]` | Used EV detail page |
| `/used-evs/sell` | Private seller listing form with VIN decode |
| `/compare` | Side-by-side comparison of 2–3 vehicles with optional 3D render |
| `/charging` | Interactive charging station map (OCPI) |
| `/finance` | PCP / HP / Lease calculator + finance enquiry |
| `/exchange` | Part-exchange wizard with AI valuation |
| `/recommend` | AI recommendation flow (budget, range, lifestyle inputs → ranked results) |
| `/consultation` | Multi-step consultation wizard |
| `/consultation/results` | Personalised consultation output |
| `/blog` | Blog hub with buyer-journey sections |
| `/blog/[slug]` | Article with inline EV cards, related articles, contextual CTAs |
| `/appointment` | Appointment booking |
| `/dealers` | Dealer directory |
| `/battery-health` | Battery health assessment tool |
| `/fleet` | Fleet enquiry form |
| `/accessories` | EV accessories marketplace (flat grid, dark theme) |
| `/community` | Community hub |
| `/ai-match` | AI vehicle matching flow |
| `/my-quotes` | Saved quotes (authenticated) |
| `/login` / `/signup` | Consumer auth |
| `/accessibility` | Accessibility statement |
| `/cookies` | Cookie policy |
| `/privacy` | Privacy policy |
| `/terms` | Terms and conditions |
| `/support` | Support page |

### Dealer Portal (`/dealer/`)

| Route | Access | Description |
|---|---|---|
| `/dealer` | Approved dealers | Dashboard with leads summary and listing stats |
| `/dealer/register` | Public | Dealer application form (rate-limited: 3/15 min) |
| `/dealer/vehicles` | Approved dealers | Vehicle listing management |
| `/dealer/vehicles/new` | Approved dealers | Create new listing |
| `/dealer/vehicles/[id]/edit` | Approved dealers | Edit existing listing |
| `/dealer/enquiries` | Approved dealers | Lead inbox |
| `/dealer/analytics` | Approved dealers | Listing and lead analytics |

### Admin Panel (`/admin/`)

All admin pages require `role = admin` or `role = super_admin`. Department-based sub-access available.

| Route | Badge Count | Description |
|---|---|---|
| `/admin` | — | Dashboard with KPI summary |
| `/admin/audit` | — | System audit log |
| `/admin/evs` | — | EV model management |
| `/admin/evs/new` | — | Add new EV model |
| `/admin/evs/[id]` | — | Edit EV model |
| `/admin/accessories` | — | Accessories CRUD |
| `/admin/blog` | — | Blog post management |
| `/admin/consultations` | `consultations` | Consultation requests |
| `/admin/enquiries` | `vehicleQueries` | General enquiries |
| `/admin/vehicle-queries` | `vehicleQueries` | Vehicle-specific queries |
| `/admin/leads` | `leads` | Lead management |
| `/admin/pipeline` | `leads` | Kanban lead pipeline |
| `/admin/crm` | — | CRM profiles |
| `/admin/crm/[id]` | — | CRM profile detail + notes |
| `/admin/exchange` | `exchange` | Part-exchange requests |
| `/admin/exchange/[id]` | — | Exchange detail + activity log |
| `/admin/finance-requests` | `financeRequests` | Finance enquiries |
| `/admin/test-drives` | — | Test drive requests |
| `/admin/fleet-enquiries` | — | Fleet enquiry requests |
| `/admin/battery-reports` | — | Battery health reports |
| `/admin/dealers` | `dealerAccounts` | Dealer account management |
| `/admin/dealers/new` | — | Manually create dealer |
| `/admin/dealers/[id]` | — | Dealer profile + status |
| `/admin/dealer-applications` | `dealerAccounts` | Pending dealer applications |
| `/admin/dealer-listings` | `dealerListings` | Dealer vehicle listing review |
| `/admin/dealer-bids` | — | Dealer bid management |
| `/admin/used-listings` | — | Used EV listing moderation |
| `/admin/feedback` | `feedback` | User feedback moderation |
| `/admin/seo` | — | SEO page management |
| `/admin/seo/new` | — | Create SEO page |
| `/admin/seo/[id]` | — | Edit SEO page |
| `/admin/seo/keywords` | — | SEO keyword management |
| `/admin/seo/keywords/[id]` | — | Edit keyword |
| `/admin/geo` | — | Geographic region management |
| `/admin/geo/new` | — | Add region |
| `/admin/geo/[id]` | — | Edit region |
| `/admin/staff` | super_admin only | Staff role management |
| `/admin/users` | super_admin only | User role management |
| `/admin/recommendations` | — | AI recommendation log |
| `/admin/data-insights` | — | Platform analytics |
| `/admin/business-plan` | — | Business plan viewer |

### Admin Auth

| Route | Description |
|---|---|
| `/admin-login` | Email + password sign-in (admin/super_admin only) |
| `/admin-login/forgot-password` | Password reset request |
| `/admin-login/reset-password` | PKCE password reset completion |

---

## Component Library

### Design system

The platform uses a custom design system built on Tailwind CSS v4:

| Token | Value | Usage |
|---|---|---|
| `brand` | `#00C896` | Primary CTA, links, badges |
| `brand-hover` | `#00B085` | Hover state for brand elements |
| `surface-base` | `#09090B` | Dark page backgrounds |
| `surface-card` | `#f9fafb` | Light card backgrounds |

#### Component patterns

- **Dark theme** (admin, test-drive widget, exchange modal): explicit `bg-[#111827]` + `bg-[#1f2937]` inputs + `[color-scheme:dark]` for native pickers
- **Light theme** (public pages): `bg-white` + `text-gray-900` system
- **Glass morphism**: `backdrop-blur` + `bg-white/[0.06]` borders on dark surfaces
- **Vehicle images**: `object-contain p-4 bg-white` for product-shot presentation
- **Skeleton loading**: `animate-pulse rounded-lg bg-gray-200` — present on all 28 admin page routes

### Key shared components

| Component | Location | Purpose |
|---|---|---|
| `PremiumNavbar` | `components/home/` | Main navigation with mobile hamburger |
| `PremiumFooter` | `components/home/` | Footer with newsletter + social links |
| `AdminSidebar` | `components/` | Role-aware admin navigation with live badge counts |
| `DealerSidebar` | `components/` | Dealer portal navigation |
| `BookTestDriveWidget` | `components/` | Floating test drive booking panel |
| `ExchangeModal` | `components/exchange/` | Part-exchange wizard modal |
| `LoginModal` | `components/` | Auth modal for inline sign-in prompts |
| `CookieBanner` | `components/legal/` | GDPR-compliant cookie consent |

---

## API Reference

### Authentication model

| Endpoint prefix | Guard | Mechanism |
|---|---|---|
| `/api/admin/*` | `requireAdmin()` | Supabase session + profile `role = admin\|super_admin` |
| `/api/dealer/*` | `requireDealer()` | Supabase session + `role = dealer` + `dealer_status = approved` |
| `/api/used-listings` POST | Supabase auth | Any authenticated user |
| All others | None | Public (with rate limiting where applicable) |

### Rate limiting

Applied endpoints:

| Endpoint | Limit | Window |
|---|---|---|
| `POST /api/dealer/register` | 3 requests | 15 minutes |
| `POST /api/dealer-applications` | 3 requests | 15 minutes |
| `POST /api/used-listings` | 3 requests | 15 minutes |
| `POST /api/leads` | Configurable | Per IP |

> Rate limiting uses an in-memory bucket strategy per server instance. For horizontally-scaled deployments, replace with a Redis-backed store.

### Key public endpoints

| Method | Path | Description |
|---|---|---|
| GET | `/api/evs` | List all EV models |
| GET | `/api/evs/[id]` | Single EV model |
| GET | `/api/chargers/nearby` | OCPI charging stations near lat/lng |
| GET | `/api/used-listings` | All approved used listings |
| GET | `/api/bank-offers` | Available finance offers |
| GET | `/api/valuations` | Vehicle valuation data |
| GET | `/api/health` | Platform health check (Supabase + AI) |
| POST | `/api/leads` | Capture a lead |
| POST | `/api/enquiries` | Submit a general enquiry |
| POST | `/api/test-drives` | Book a test drive |
| POST | `/api/exchange-requests` | Submit part-exchange request |
| POST | `/api/finance-enquiries` | Submit finance enquiry |
| POST | `/api/fleet-enquiries` | Submit fleet enquiry |
| POST | `/api/consultation` | Submit consultation |
| POST | `/api/battery-health` | Submit battery assessment |
| POST | `/api/tco-calculate` | Calculate total cost of ownership |
| POST | `/api/recommendations` | Get AI vehicle recommendations |
| POST | `/api/newsletter` | Newsletter subscription |
| POST | `/api/consent` | Record GDPR consent |
| POST | `/api/chat` | OpenAI-powered chat |
| POST | `/api/vin-decode` | VIN lookup and decode |

---

## Security Model

### Authentication

- **Consumer auth**: Supabase Auth with email/password + OAuth
- **Admin auth**: Separate `/admin-login` flow — signs in via Supabase then verifies `profile.role IN ('admin', 'super_admin')` before granting access
- **Session strategy**: SSR cookies via `@supabase/ssr` — uses `getUser()` (server-validated) not `getSession()` (client cache)
- **PKCE flow**: Used for all password resets and OAuth callbacks

### Role-based access control

| Role | Access |
|---|---|
| `user` | Consumer features, saved quotes, test drive booking |
| `dealer` | Dealer portal (requires `dealer_status = approved`) |
| `admin` | Full admin panel (blocked from super_admin functions) |
| `super_admin` | Full access including staff management, user role changes |

Department-based access: admins can be scoped to specific departments via `profile.department` — enforced by `requireAdminForDepartments()`.

### HTTP security headers (production)

| Header | Value |
|---|---|
| `Content-Security-Policy` | `default-src 'self'`, strict with `upgrade-insecure-requests` |
| `Strict-Transport-Security` | `max-age=63072000; includeSubDomains; preload` |
| `X-Frame-Options` | `DENY` |
| `X-Content-Type-Options` | `nosniff` |
| `Referrer-Policy` | `strict-origin-when-cross-origin` |
| `Permissions-Policy` | Blocks camera, microphone, geolocation, browsing-topics |
| `Cache-Control` | `no-store` on all `/api/*` routes |

### Security alerts

Unauthorised admin access attempts trigger email notifications via Resend to the configured support email, with a 10-minute cooldown to prevent alert flooding. Implemented in `lib/security/alerts.ts`.

---

## Business Flow

### Consumer → Lead

```
Homepage / Search → Vehicle Detail → Quote Modal → Lead captured
                 ↓
           AI Recommendation → Consultation → Finance Enquiry → Lender forward (Resend)
                 ↓
           Part-Exchange → AI Valuation (Claude) → Admin review → Dealer assignment
                 ↓
           Test Drive → Admin forward → Dealer confirmation
```

### Dealer onboarding

```
/dealer/register (rate-limited) → dealer_profiles row (status: pending_approval)
→ Admin reviews /admin/dealer-applications → Approve/Reject
→ On approval: dealer can access portal, create listings, receive leads
→ Dealer listings → Admin review /admin/dealer-listings → Approve to go live
→ Live listing → Consumer enquiry → Dealer lead inbox → Dealer bid → Admin bid review
```

### Admin review workflow

All inbound requests follow the same pattern:

```
Inbound form/API → Supabase table (status: pending/new)
→ Badge count increments on AdminSidebar
→ Admin reviews → updates status → optional Resend email to consumer/dealer
→ Badge count clears
```

---

## Database Schema

### Core tables

| Table | Description |
|---|---|
| `profiles` | User profiles — extends Supabase auth.users with role, department |
| `ev_models` | EV model catalogue (brand, specs, pricing, images) |
| `dealer_profiles` | Dealer accounts with status, contact, address |
| `dealer_listings` | Dealer vehicle listings with approval workflow |
| `dealer_bids` | Dealer bids on used EV exchange requests |
| `used_ev_listings` | Private seller listings with moderation status |
| `consultation_requests` | Consultation form submissions |
| `finance_requests` | Finance enquiry submissions |
| `exchange_requests` | Part-exchange requests with AI valuations |
| `test_drive_bookings` | Test drive booking requests |
| `leads` | General lead capture |
| `crm_leads` | CRM pipeline leads |
| `crm_lead_notes` | Notes on CRM leads |
| `vehicle_queries` | Vehicle-specific queries from consumers |
| `fleet_enquiries` | Fleet enquiry submissions |
| `battery_health_reports` | Battery assessment results |
| `accessories` | Product catalogue for accessories marketplace |
| `accessory_categories` | Category taxonomy for accessories |
| `blog_posts` | Blog articles with SEO metadata |
| `seo_pages` | Programmatic SEO page definitions |
| `seo_keywords` | Keyword targets and tracking |
| `geo_regions` | Geographic targeting data |
| `user_ev_feedback` | User reviews and feedback (moderated) |
| `saved_vehicles` | User saved/shortlisted vehicles |
| `newsletter_subscribers` | Email newsletter list |
| `consent_records` | GDPR consent audit trail |
| `platform_events` | Platform event tracking |
| `user_sessions` | Session tracking |
| `user_intent_profiles` | AI-built buyer intent profiles |
| `user_car_interest` | Car interest tracking per user |
| `financial_profiles` | User financial capability profiles |
| `security_events` | Security alert log |
| `audit_log` | Admin action audit trail |

### Row Level Security

RLS is enabled on all tables. Key policies:

- Users can read/write only their own rows (profiles, saved_vehicles, feedback)
- Dealers can read/write only their own dealer profile and listings
- Admin bypasses RLS via the service role key (admin Supabase client)
- Public data (ev_models, blog_posts, accessories) is readable by all

### Database migrations

Migrations are managed in two places:

1. `supabase/migrations/` — auto-generated by Supabase CLI
2. `supabase/manual/` — hand-written SQL for complex operations

See `MIGRATIONS_TO_APPLY.md` for the ordered list of migrations to apply before first deployment.

---

## Environment Variables

Copy `.env.example` to `.env.local` and fill in all values.

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=              # Project URL (public)
NEXT_PUBLIC_SUPABASE_ANON_KEY=         # Anon key (public)
SUPABASE_SERVICE_ROLE_KEY=             # Service role key (NEVER expose client-side)

# AI
ANTHROPIC_API_KEY=                     # Claude API key
OPENAI_API_KEY=                        # OpenAI key (chat fallback)

# Email
RESEND_API_KEY=                        # Resend for transactional email
RESEND_FROM_EMAIL=                     # Sender address (e.g. noreply@evguide.co.uk)

# Platform
NEXT_PUBLIC_SITE_URL=                  # Production URL (https://evguide.co.uk)
NEXT_PUBLIC_SUPPORT_EMAIL=             # Support + security alert recipient
NEXT_PUBLIC_GOOGLE_MAPS_KEY=           # Maps (charging finder)

# Admin (optional override)
ADMIN_EMAIL=                           # Default admin email for seeding
```

> **Security**: Never commit secrets to version control. Use Vercel environment variable management for production. The `.env.local` file is listed in `.gitignore` and must never be committed.

---

## Getting Started

### Prerequisites

- Node.js 20+
- A Supabase project (free tier works for development)
- Anthropic API key (for AI features)
- Resend account (for email)

### Local setup

```bash
# Clone and install
git clone https://github.com/your-org/evguide.git
cd evguide
npm install

# Configure environment
cp .env.example .env.local
# Fill in all values in .env.local

# Run database migrations
# Apply migrations in order from MIGRATIONS_TO_APPLY.md via Supabase SQL editor

# Start development server
npm run dev
# → http://localhost:3000
```

### Creating an admin account

1. Sign up at `/signup` with your email
2. In Supabase dashboard → Table editor → `profiles` → find your row → set `role` to `super_admin`
3. Sign in at `/admin-login`

### Seeding EV data

After signing in as admin, navigate to `/admin/evs` and use the "Seed vehicles" button to populate the EV catalogue from static data.

---

## Deployment

### Vercel (recommended)

1. Connect the repository to a Vercel project
2. Set all environment variables in Vercel project settings (never in the repository)
3. Set `NODE_OPTIONS=--max-old-space-size=8192` in Vercel environment variables
4. Deploy — Next.js App Router is fully supported

### Pre-deployment checklist

- [ ] All database migrations from `MIGRATIONS_TO_APPLY.md` applied
- [ ] All environment variables set in Vercel (not in repo)
- [ ] Supabase RLS policies verified
- [ ] Resend domain verified for transactional email
- [ ] NEXT_PUBLIC_SITE_URL set to production URL
- [ ] Admin account created and tested
- [ ] Health check at `/api/health` returns OK

---

## Roadmap

### Phase 1 (Launched)
- [x] Vehicle catalogue with search and filter
- [x] EV detail page with TCO and tariff widget
- [x] AI recommendation engine
- [x] Part-exchange with AI valuation
- [x] Finance calculator and enquiry
- [x] Admin panel (40+ pages)
- [x] Dealer portal with listing and lead management
- [x] Used EV marketplace
- [x] Blog platform
- [x] Accessories marketplace
- [x] Battery health assessment
- [x] Fleet enquiry
- [x] GDPR-compliant consent management
- [x] Programmatic SEO

### Phase 2 (In progress)
- [ ] Redis-backed rate limiting for distributed deployments
- [ ] Sentry / LogRocket error monitoring
- [ ] OpenAPI / Swagger documentation
- [ ] E2E test suite (Playwright)
- [ ] Admin audit log UI
- [ ] Bulk actions on admin tables
- [ ] Pagination on all admin tables (currently fixed limits)
- [ ] CSV export for all admin pages

### Phase 3 (Planned)
- [ ] Real OCPI charging station integration
- [ ] Stripe payment integration for deposit/booking fees
- [ ] Dealer subscription tiers and billing
- [ ] Mobile app (React Native)
- [ ] Multi-language support (Welsh, Scots Gaelic)
- [ ] Vehicle history report integration (HPI / Motorway)
- [ ] Insurance quote integration
- [ ] Smart charging schedule optimiser

---

## Contributing

See `CONTRIBUTING.md` (coming soon). In the meantime:

1. Branch from `main`
2. Follow existing naming conventions (kebab-case files, PascalCase components)
3. Keep components under 300 lines — extract sub-components when needed
4. All API routes must include input validation and appropriate auth guard
5. No secrets in code — use environment variables only

---

## License

Proprietary — all rights reserved. Contact the EVGuide team for licensing enquiries.
