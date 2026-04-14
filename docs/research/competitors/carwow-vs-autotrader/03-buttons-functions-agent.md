# Agent 3 — Buttons & Functions Agent
**Platform:** EVGuide Competitor Analysis  
**Date:** 2026-04-10  
**Status:** Confirmed observations from public UI + inferred business logic

---

## Objective

Identify, categorise, and analyse every significant CTA and interactive function across Carwow and Auto Trader. Understand the user intent, technical function, and business value of each. Produce a recommended CTA system for EVGuide.

---

## 1. CTA Taxonomy

CTAs are categorised as:
- **[I]** Informational — drives discovery, education, research
- **[T]** Transactional — directly drives revenue or lead
- **[L]** Lead Generation — captures user data for dealer/finance handoff
- **[R]** Retention — keeps user engaged, encourages return
- **[V]** Valuation — captures seller intent

---

## 2. Carwow — CTA Inventory

### Homepage CTAs

| CTA Label | Type | User Intent | Business Value |
|---|---|---|---|
| "Find your perfect car" | [I] | Discover vehicles | Entry point to funnel |
| "Get best price" (hero) | [L] | Get competitive price | High — lead intent |
| "Sell my car" | [V] | Get valuation | Lead capture for dealer network |
| "Car reviews" | [I] | Research before buying | SEO traffic, early funnel |
| "Check finance eligibility" | [T] | Understand affordability | Finance commission trigger |
| "Browse [brand]" (manufacturer logos) | [I] | Brand-specific browsing | Partner visibility |

### Search & Listing Page CTAs

| CTA Label | Type | User Intent | Business Value |
|---|---|---|---|
| "Search" (main form) | [I] | Filter results | Core funnel entry |
| "Save search" | [R] | Bookmark search | Email capture, retargeting |
| "Save car" (heart icon) | [R] | Shortlist vehicle | Retargeting, return visits |
| "Sort by" dropdown | [I] | Refine results | Engagement quality signal |
| "Get deal" (on card) | [L] | Express interest | Lead trigger |
| "Finance from £X/mo" | [T] | Finance-first entry | Finance commission |

### Vehicle Detail Page CTAs

| CTA Label | Type | User Intent | Business Value |
|---|---|---|---|
| "Get best price" (sticky) | [L] | Primary conversion action | Highest value — lead |
| "Check eligibility" (finance) | [T] | Check if finance approved | Finance partner revenue |
| "Save this car" | [R] | Shortlist | Retargeting |
| "Compare" | [I] | Side-by-side comparison | Engagement depth |
| "Read owner reviews" | [I] | Trust validation | Reduces bounce |
| "Get insurance quote" | [T] | Insurance upsell | Affiliate revenue |
| "Share" | [R] | Social share | Organic reach |

### Sell Flow CTAs

| CTA Label | Type | User Intent | Business Value |
|---|---|---|---|
| "Value my car" | [V] | Get instant valuation | Seller funnel entry |
| "Get offers from dealers" | [L] | Sell to dealer | Lead for part-exchange |
| "Create free listing" | [T] | Private seller | Platform inventory |

---

## 3. Auto Trader — CTA Inventory

### Homepage CTAs

| CTA Label | Type | User Intent | Business Value |
|---|---|---|---|
| "Search [X] cars" | [I] | Broad browse | Core funnel |
| "Value my car" | [V] | Free valuation | Seller funnel entry |
| "Sell my car" | [T] | Paid/free listing | Listing revenue |
| "Instant offer" | [T] | Quick sale | Third-party revenue share |
| "Find finance" | [T] | Budget-first search | Finance commission |
| "ATCheck" (vehicle history) | [T] | Trust purchase | Product revenue (~£9.99/check) |

### Search & Listing Page CTAs

| CTA Label | Type | User Intent | Business Value |
|---|---|---|---|
| "Filter results" | [I] | Refine search | Session depth |
| "Save ad" | [R] | Shortlist vehicle | Email/push retargeting |
| "Save search" | [R] | Bookmark | Alert emails = retargeting |
| "Get finance quote" (on card) | [T] | Monthly price check | Finance revenue |
| "Price drop alert" | [R] | Watch vehicle | Push re-engagement |
| "Sponsored" badges | [T] | Dealer visibility | Dealer subscription revenue |

### Vehicle Detail Page CTAs

| CTA Label | Type | User Intent | Business Value |
|---|---|---|---|
| "Send enquiry" | [L] | Contact dealer | Lead revenue to dealer |
| "Call dealer" | [L] | Direct contact | Tracked call lead |
| "Check finance" | [T] | Finance calculator | Finance commission |
| "Get ATCheck report" | [T] | Vehicle history | Product sale ~£9.99 |
| "Save to shortlist" | [R] | Wishlist | Retargeting |
| "Report this ad" | [I] | Trust/safety | Trust signal |
| "View dealer's stock" | [I] | Browse dealer | Dealer retention |
| "Similar vehicles" | [I] | Cross-sell | Session extension |
| "Share this ad" | [R] | Social | Organic reach |
| "Make an offer" (some listings) | [T] | Price negotiation | Engagement signal |

### Value & Sell CTAs

| CTA Label | Type | User Intent | Business Value |
|---|---|---|---|
| "Get my valuation" | [V] | Instant price | Email capture |
| "List for free" | [T] | Private seller | Inventory + upsell |
| "Upgrade listing" | [T] | Premium visibility | Paid listing revenue |
| "Instant offer" | [T] | Fast sale | Revenue share |

---

## 4. Revenue-Driving Actions Analysis

### Carwow — Revenue Actions Ranked
1. **"Get best price"** — primary lead, paid per validated lead to dealer (est. £20–£150/lead)
2. **"Check finance eligibility"** — finance commission (est. 1–3% of finance value)
3. **"Value my car / Get dealer offers"** — part-exchange leads
4. **Insurance quote affiliate** — lower value per click but volume play
5. **Manufacturer partnerships** — featured placement and campaign fees

### Auto Trader — Revenue Actions Ranked
1. **Dealer subscription packages** — primary revenue (dealers pay £500–£3,000+/mo)
2. **"Check finance"** — finance commission
3. **"Get ATCheck"** — direct product revenue per check
4. **"Upgrade listing"** — seller upsell (featured, highlighted, photo upgrade)
5. **Sponsored placements** — paid ranking in search results
6. **Data/analytics products** — sold to dealers (market data, pricing tools)
7. **Insurance affiliate** — partner revenue

---

## 5. CTA Performance Observations

### Carwow Strengths
- **Sticky "Get best price"** — never lets conversion opportunity scroll away. Simple, single-intent CTA.
- **"Best price" framing** — positions Carwow as the buyer's ally, not a neutral listing site
- **Finance eligibility inline** — embedded in vehicle page, no separate journey required
- **Low-friction enquiry form** — name, email, postcode only. No essay required.

### Carwow Weaknesses
- No "Quick enquiry" or "Call now" for hot leads who don't want email
- No WhatsApp or live chat CTA (growing expectation in UK market)
- "Get best price" requires full PII before showing anything — cold browsers bounce
- No "I'm just researching" flow — binary (commit or leave)

### Auto Trader Strengths
- **"Price drop alert"** — brilliant retention mechanism. Low commitment, high return value.
- **"Make an offer"** — dealer-opted negotiation creates engagement and urgency
- **ATCheck product** — converts trust anxiety into a £9.99 revenue event
- **"Call dealer"** — tracked calls are high-intent leads with measurable attribution

### Auto Trader Weaknesses
- Too many CTAs on vehicle detail pages — cognitive overload
- "Send enquiry" is generic — no personalization or context
- Ad/sponsored labels reduce trust
- No "EV-specific" actions anywhere (e.g. "Book test charge", "Check home charger compatibility")

---

## 6. Recommended CTA System for EVGuide

### Core CTA Principles
1. **One primary CTA per context** — no competing actions at the same hierarchy level
2. **Intent-matched labels** — not "Submit" but "Check if it fits my range"
3. **EV-native language** — reflect EV buyer psychology
4. **Progressive commitment** — low-friction early, higher commitment later

---

### EVGuide CTA Inventory (Recommended)

#### Homepage
| CTA | Type | Priority | Notes |
|---|---|---|---|
| "Find EVs that fit my life" | [I] | Primary | Range/lifestyle-first entry |
| "What's my EV worth?" | [V] | Secondary | Battery-adjusted valuation |
| "How much will I save?" | [I] | Secondary | TCO calculator entry |
| "Browse all EVs" | [I] | Tertiary | Standard search entry |

#### Listing Page
| CTA | Type | Priority | Notes |
|---|---|---|---|
| "See full details" (card) | [I] | Primary | Clean card CTA |
| "Check range for my commute" | [I] | Feature | On-card range check |
| "Save" (heart) | [R] | Standard | Shortlist |
| "Set price alert" | [R] | Standard | Retention hook |
| "Compare" | [I] | Standard | Multi-select compare |
| "Get best price" | [L] | Intent-triggered | Show after page scroll/dwell |

#### Vehicle Detail Page
| CTA | Type | Priority | Notes |
|---|---|---|---|
| "Get best price from dealers" | [L] | Primary sticky | Main conversion CTA |
| "Check my commute range" | [I] | Feature | Range anxiety reducer |
| "Calculate my savings" | [T] | Feature | TCO vs current car |
| "Check finance" | [T] | Secondary | Monthly cost entry |
| "Book a test drive" | [L] | Secondary | Physical intent signal |
| "View charging near me" | [I] | Feature | Map overlay |
| "Save this EV" | [R] | Standard | Shortlist |
| "Set price alert" | [R] | Standard | Retention |
| "Get vehicle history" | [T] | Trust | Battery report product |
| "Share" | [R] | Low | Social |

#### Sell / Valuation Flow
| CTA | Type | Priority | Notes |
|---|---|---|---|
| "Get my EV's true value" | [V] | Primary | Battery-adjusted entry |
| "Get competing dealer offers" | [L] | Conversion | Reverse auction like Carwow |
| "List privately" | [T] | Alternative | Private listing option |

#### Finance Flow
| CTA | Type | Priority | Notes |
|---|---|---|---|
| "See what EVs I can afford" | [T] | Entry | Budget-first |
| "Check eligibility (no credit impact)" | [T] | Mid-funnel | Soft search reassurance |
| "Apply for finance" | [T] | Conversion | Hard credit search |

---

### EV-Unique CTAs (Differentiators — Build These)

| CTA | Type | What It Does |
|---|---|---|
| "Does this fit my commute?" | [I] | Range check against user's postcode/distance |
| "Is home charging compatible?" | [I] | Check charger type vs vehicle specs |
| "Battery health report" | [T] | EV-specific history product (revenue) |
| "Salary sacrifice calculator" | [T] | HMRC-compliant cost tool |
| "Grant eligibility check" | [I] | OZEV/DVLA grant checker |
| "Charge cost estimate" | [I] | Monthly charge cost vs fuel saving |
| "Book a home charger quote" | [T] | Affiliate installer lead (revenue) |

---

## Summary

The CTA systems of both Carwow and Auto Trader are optimised for **ICE car buyers**. Neither platform has built EV-specific interactive functions. EVGuide's CTA system should:

1. Use **Carwow's clarity** — single sticky primary CTA, clean hierarchy
2. Use **Auto Trader's retention tools** — price alerts, save features, history products
3. **Add EV-native CTAs** that address range anxiety, charging compatibility, and real cost — none of these exist anywhere in the current market

These EV-native CTAs are not just UX features — they are **revenue opportunities** (battery reports, charger installs, salary sacrifice tools) that neither competitor has monetised.
