# Agent 2 — User Flow Agent
**Platform:** EVGuide Competitor Analysis  
**Date:** 2026-04-10  
**Status:** Confirmed observations from public-facing flows + inferred conversion logic

---

## Objective

Map complete user journeys across Carwow and Auto Trader — from entry to conversion — and identify friction points, drop-off risks, and flow patterns worth replicating or improving for EVGuide.

---

## 1. User Journey Types Analysed

1. **Browse & Discover** — casual user exploring options
2. **Targeted Search** — user with specific make/model in mind
3. **Finance Journey** — user entering through finance/affordability
4. **Enquiry / Lead Journey** — user contacting a dealer
5. **Sell My Car Journey** — user wanting to sell/part-exchange
6. **Comparison Journey** — user comparing 2–3 vehicles

---

## 2. Carwow — User Flow Analysis

### Flow A: Browse & Discover
```
Homepage
  → "Find your perfect car" CTA
  → Search by make/model or body type
  → Listing results (filtered)
  → Vehicle card click
  → Vehicle detail page
  → "Get best price" CTA
  → Lead form (name, email, phone, postcode)
  → Multiple dealer offers delivered via email
  → User compares offers
  → Accepts offer → dealer contact
```

**Carwow's key differentiator:** Users don't contact one dealer — they submit a single enquiry and receive competing offers from multiple dealers. This is a **reverse auction model** that creates urgency and perceived value for the buyer.

**Friction points:**
- Entering personal details is required to see dealer prices — high friction for early-stage browsers
- Email-based offer delivery means exit from the platform — Carwow loses the post-lead experience
- No real account/profile — repeat visitors start fresh

### Flow B: Finance Journey
```
Homepage
  → "Finance" nav link
  → Finance landing page (eligibility check, monthly budget tool)
  → Enter: monthly budget, deposit, credit preference
  → Matching vehicles shown based on budget
  → Vehicle detail page
  → Inline finance calculator (adjust term/deposit)
  → Apply for finance CTA
  → Soft credit check form
  → Approved → dealer connection
```

**Strength:** Budget-first finance flow is excellent for affordability-driven buyers (majority of market).  
**Weakness:** EV-specific cost modelling absent — no home charging savings, no fuel cost comparison, no salary sacrifice calculation.

### Flow C: Sell My Car
```
Homepage
  → "Sell" nav or footer link
  → Enter registration number
  → Mileage input
  → Instant valuation shown
  → "Get offers from dealers" CTA
  → Personal details form
  → Competing dealer offers delivered
```

**Strength:** Very low friction entry (just reg number). Fast time-to-value.  
**Weakness:** Valuation accuracy varies. No EV battery health input affects EV resale accuracy.

### Flow D: Comparison
- Carwow does NOT have a native side-by-side comparison feature for vehicle specs
- Users must open multiple tabs
- This is a significant gap for considered purchases

---

## 3. Auto Trader — User Flow Analysis

### Flow A: Browse & Discover
```
Homepage
  → Search form (make, model, postcode, max price, max mileage)
  → "Search" CTA
  → Listing results
  → Apply additional filters (sidebar)
  → Vehicle card click
  → Vehicle detail page
  → "Contact dealer" or "Send enquiry" CTA
  → Enquiry form (name, email, phone, message)
  → Direct dealer response by email/phone
```

**Auto Trader's model:** Direct dealer contact. No intermediation. Simple, transparent.  
**Friction points:**
- Cold dealer contact — buyer has no price protection or negotiation support
- Leads go directly to dealers — AT loses visibility after handoff
- Search form on homepage is comprehensive but can feel complex for first-time users

### Flow B: Finance Journey
```
Homepage
  → "Finance" tab or link in nav
  → "Find cars by monthly budget" tool
  → Budget slider → matching inventory shown
  → Vehicle detail page → finance section
  → "Check eligibility" button
  → Soft credit search form
  → Finance quote shown
  → "Proceed" → partner finance application
```

**Strength:** Deep integration with finance partners (black horse, Moneybarn, etc.). Very established.  
**Weakness:** Finance journey UX is fragmented across partners. Some flows leave AT entirely.

### Flow C: Value My Car
```
Homepage
  → "Value my car" nav item
  → Enter registration + mileage
  → Instant valuation range shown
  → Upsell to "Sell my car on AT" (paid listing) or "Instant offer" via AT Instant Offer partners
  → Private listing creation flow (account required)
```

**Strength:** Valuation is highly trusted due to AT's data volume.  
**Weakness:** Selling experience is fragmented — free vs. paid listings, private vs. dealer, instant offer via third party.

### Flow D: Comparison
- Auto Trader has a **native comparison feature** — up to 3 vehicles side by side
- Comparison covers: price, specs, running costs, emissions
- EV range and charging data is partially included but not comprehensive
- Accessible via "Compare" button on vehicle cards

### Flow E: Save & Return
- Auto Trader has a **saved search** feature with email alerts
- Users can save vehicles to a shortlist
- Requires account creation
- Notifications when price drops or vehicle sells — useful retention tool

---

## 4. Friction Analysis

### Carwow Friction Points
| Friction | Location | Severity |
|---|---|---|
| Must submit personal details to see prices | Before offer stage | High |
| No saved vehicles without account | Browsing | Medium |
| No in-platform comparison tool | Research stage | High |
| Offer delivery via email (exits platform) | Post-lead | Medium |
| No EV-specific journey (range, charging) | Throughout | High |

### Auto Trader Friction Points
| Friction | Location | Severity |
|---|---|---|
| Complex search form for new users | Homepage | Medium |
| Filter overload in sidebar | Listing page | Medium |
| Cold dealer contact — no price protection | Enquiry | High |
| Finance journey fragments off-platform | Finance | Medium |
| Ad disruption on listing pages | Browsing | Low-Medium |
| No EV-specific journey | Throughout | High |

---

## 5. Conversion Path Analysis

### Carwow Conversion Model
- **Entry intent:** Medium to high (users comparing prices)
- **Lead type:** Warm — user has expressed specific intent
- **Conversion trigger:** Competitive offers (FOMO, price competition)
- **Estimated funnel:** Homepage → Search → Vehicle → Lead Form ≈ 3–5% conversion

### Auto Trader Conversion Model
- **Entry intent:** Mixed (some browsing, some ready to buy)
- **Lead type:** Varies — could be cold browser or warm buyer
- **Conversion trigger:** Availability, price confidence ("Great Price" badge)
- **Estimated funnel:** Homepage → Search → Vehicle → Contact ≈ 2–4% conversion

---

## 6. Recommended User Flow for EVGuide

### EV Buyer Journey — EVGuide Native Flow

The core insight: **EV buyers have different top concerns** than ICE buyers:
1. Will it fit my daily range?
2. Can I charge at home?
3. What does it actually cost to run?
4. Is the battery healthy?
5. What incentives / grants apply to me?

EVGuide must design flows that answer these questions before asking for a lead.

---

### Recommended Flow A: Range-First Discovery
```
Homepage
  → "Find EVs that fit my life" CTA (not generic search)
  → Step 1: "What's your typical daily drive?" (slider: 0–200 miles)
  → Step 2: "Do you have home charging?" (Yes / Plan to / No)
  → Step 3: "What's your monthly budget?" (slider)
  → Matching EVs shown with: range confidence score, charging compatibility, monthly cost
  → Vehicle detail page (EV-native)
  → Sticky CTA: "Check availability & get best price"
  → Lead form (lightweight — name, email, postcode)
  → Dealer offers OR instant availability check
```

This flow **qualifies** the buyer and **reduces range anxiety** before the lead is generated — making it higher quality for dealers and more confident for buyers.

---

### Recommended Flow B: Total Cost of Ownership Journey
```
Homepage or Finance page
  → "See what an EV really costs you" CTA
  → Enter: current car fuel spend per month
  → Enter: home energy tariff (or use national average)
  → Enter: annual mileage
  → EVGuide calculates: monthly saving vs ICE, payback period, 3-year TCO
  → "Find EVs within your saving range" → filtered listing
  → Vehicle detail with real TCO embedded
  → Lead / enquiry CTA
```

This flow creates **financial conviction** — the buyer understands they'll save money before they see a price.

---

### Recommended Flow C: EV Intelligence / Research First
```
Homepage
  → "Compare EVs" or "EV Reviews" section
  → Browse by: range tier, charging speed, brand, price band
  → Deep review pages with: real-world range tests, battery degradation data, charging network compatibility
  → "Find one near me" CTA on review page → listing search
  → Vehicle detail → lead
```

This builds EVGuide as a **trusted authority**, not just a marketplace. Drives SEO and return visits.

---

### Recommended Flow D: Sell / Part-Exchange EV
```
Homepage → "What's my EV worth?"
  → Enter: registration, mileage
  → Enter: battery health % (or estimate from mileage)
  → Enter: home charging history
  → Instant EV valuation (battery-adjusted)
  → "Get offers" → competing dealer bids
```

**Key insight:** EV valuations require battery health data. Neither competitor captures this. EVGuide can offer more accurate EV-specific valuations, creating a moat.

---

### Comparison Feature (Priority Build)
- Allow up to 4 EVs side by side
- Compare: range, charging speed, monthly cost, battery size, warranty, TCO, boot space
- "Which is right for me?" quiz leading into comparison

---

## 7. Journey Flow Priorities (Ranked)

| Priority | Flow | Why |
|---|---|---|
| 1 | Range-first discovery | Removes #1 EV purchase barrier |
| 2 | TCO calculator → listing | Creates financial conviction |
| 3 | EV-native vehicle detail page | Replaces generic ICE data model |
| 4 | EV valuation (battery-adjusted) | Unique data capture, moat |
| 5 | Comparison tool | Supports considered purchase |
| 6 | Saved searches + alerts | Retention and return visits |

---

## Summary

Neither Carwow nor Auto Trader has designed a user flow that addresses the real psychological and informational needs of the EV buyer. Carwow's reverse auction model is clever for price-sensitive buyers. Auto Trader's data depth is a strength. But **neither platform starts with the EV buyer's actual questions**.

EVGuide's opportunity is to build **intent-first, EV-native flows** that guide buyers through their real concerns — range, charging, cost — before asking for a lead. This produces higher-quality leads, better conversion rates, and a genuinely differentiated product.
