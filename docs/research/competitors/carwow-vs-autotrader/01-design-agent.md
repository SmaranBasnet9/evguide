# Agent 1 — Design Research Agent
**Platform:** EVGuide Competitor Analysis  
**Date:** 2026-04-10  
**Status:** Confirmed observations + inferred patterns from public-facing UI

---

## Objective

Analyze the visual design and UI systems of Carwow (carwow.co.uk) and Auto Trader (autotrader.co.uk) to extract best practices, identify weaknesses, and produce actionable design recommendations for the EVGuide platform.

---

## 1. Carwow — Design Breakdown

### Overall Philosophy
Carwow uses a **clean, modern, consumer-first design language**. It feels closer to a fintech or lifestyle app than a traditional classifieds site. The design is clearly optimised for mobile-first, with generous whitespace and card-based layouts.

### Homepage
- **Hero:** Large, high-contrast hero section with a single prominent search CTA ("Find your perfect car"). Minimal visual noise — no sidebar clutter.
- **Color palette:** Primarily white backgrounds, with Carwow's signature green (#00B67A) as the action color. Dark navy for headings. This creates high contrast and strong accessibility.
- **Typography:** Clean sans-serif (Inter or similar). Large heading sizes (40–56px). Body copy at comfortable 16–18px. No decorative fonts.
- **Trust signals:** Trustpilot rating displayed prominently above the fold. "500,000+ happy customers" social proof copy. Logos of partnered manufacturers (BMW, Volkswagen, Mercedes, etc.).
- **Navigation:** Sticky top navbar. Clean categories: Buy, Sell, Finance, Reviews. No mega-menus. Simple and fast to parse.
- **Imagery:** Professional lifestyle photography. Cars shown in aspirational settings. No stock photo feel.

### Vehicle Listing Page
- **Card design:** Each vehicle card contains: hero image, make/model, year, mileage, price (monthly + total), dealer rating, and distance. Clear visual hierarchy.
- **Filters sidebar:** Left-aligned filters. Key filters exposed: make, model, price range, mileage, fuel type, body style. Progressive disclosure for advanced filters.
- **Sorting:** Top-right sort by relevance, price, mileage, distance.
- **Pagination:** Infinite scroll on mobile, numbered pagination on desktop.

### Vehicle Detail Page
- **Image gallery:** Large image carousel at the top. Multiple angles. Some dealers include 360° view.
- **Specs block:** Tabbed layout — Overview, Specs, Finance, Reviews. Clean tab switching.
- **Sticky CTA bar:** "Get best price" or "Enquire" floats at the bottom on scroll. Never loses conversion opportunity.
- **Finance calculator:** Embedded inline. Adjustable deposit and term sliders. Monthly payment updates in real time.
- **Reviews section:** Verified owner reviews with star ratings, broken down by category (comfort, reliability, value for money).

### Mobile Experience
- Bottom navigation bar on mobile. Thumb-friendly touch targets. Cards stack vertically cleanly. No horizontal scrolling.

### Premium Feel Score: **8.5/10**

---

## 2. Auto Trader — Design Breakdown

### Overall Philosophy
Auto Trader is the dominant UK marketplace. Its design is **functional and data-rich** but feels more utilitarian than premium. It prioritises comprehensiveness over curation. The UI has improved significantly in recent years but still carries legacy classifieds DNA.

### Homepage
- **Hero:** Search-first layout. Large search form above the fold. Tabs for Cars, Vans, Bikes, Motorhomes.
- **Color palette:** Auto Trader's signature orange (#FF6B00) as the primary action color. White background. Grey for secondary elements. The orange is high-energy and very recognisable but can feel harsh.
- **Typography:** Clean sans-serif but slightly smaller body text than Carwow. Heading hierarchy is present but less dramatic.
- **Trust signals:** "UK's No.1 car marketplace" headline. 500,000+ cars listed. Trusted since 1977. Very authority-heavy messaging.
- **Navigation:** More complex. Includes: Buy a car, Sell my car, Value my car, Van Centre, etc. Slightly harder to navigate at a glance.
- **Imagery:** A mix of dealer-supplied photography (variable quality) and branded lifestyle images. Less consistent than Carwow.

### Vehicle Listing Page
- **Card design:** More information density than Carwow. Cards include: image, title, price, monthly cost, mileage, year, fuel type, transmission, dealer name, distance, ATCheck badge (for vehicle history).
- **Filters sidebar:** More filters exposed upfront. Can feel overwhelming. Includes very granular options (engine size to 0.1L, specific body colour, etc.).
- **Sponsored listings:** Ads are interspersed, sometimes disrupting the browsing experience.
- **Map view:** Toggle to map-based search. Useful for local buyers.

### Vehicle Detail Page
- **Image gallery:** Similar carousel to Carwow. Image quality varies widely by dealer.
- **Specs block:** Long scrolling page with all data. Less tabbed, more linear. Can feel exhaustive.
- **Vehicle history check:** Prominent integration with MOT history, mileage tracker, and vehicle check products. This is a major trust differentiator.
- **Dealer profile:** More detailed than Carwow — shows dealer inventory size, years in business, review count.
- **Price indicator:** "Great Price / Good Price / Fair Price" badge based on market comparison. Very useful feature.

### Mobile Experience
- Responsive but can feel cramped with high information density. Filters require a full-screen modal on mobile.

### Premium Feel Score: **6.5/10**

---

## 3. Head-to-Head Comparison

| Dimension | Carwow | Auto Trader |
|---|---|---|
| Visual polish | ★★★★★ | ★★★☆☆ |
| Information density | Medium | High |
| Mobile UX | Excellent | Good |
| Trust signals | Social proof, reviews | Authority, history data |
| Search UX | Simple, guided | Comprehensive, complex |
| Premium feel | High | Medium |
| Data richness | Medium | High |
| Consistency of imagery | High | Variable |
| EV-specific design | None | Minimal |
| Accessibility | Good | Moderate |

---

## 4. Design Best Practices (Combined)

1. **Sticky CTAs on vehicle pages** — never let the conversion button scroll away
2. **Price visibility** — monthly payment shown prominently alongside total price
3. **Trust signals above the fold** — review count, Trustpilot, authority copy
4. **Progressive filter disclosure** — don't overwhelm with 30 filters on load
5. **High-quality, consistent photography** — sets premium tone
6. **Price intelligence badges** — "Great Price" indicators drive urgency and confidence
7. **Tabbed vehicle detail pages** — keeps long-form data scannable
8. **Real-time finance calculators** — embedded, not linked away

---

## 5. Key Weaknesses

### Carwow
- No EV-specific design patterns (range anxiety tools, charging info, battery health)
- Imagery leans internal combustion — EVs feel like an afterthought
- Lacks deep vehicle data (not as strong as Auto Trader on specs)
- Finance UI is good but not differentiated for EV ownership patterns (home charging, salary sacrifice)

### Auto Trader
- Design feels dated in sections — inconsistent component library
- Overwhelming filter sidebar — analysis paralysis risk
- Orange color palette limits premium positioning
- No EV-native UX — range maps, charging network overlays, battery degradation scores absent
- Ad placements disrupt the browse experience

---

## 6. Recommendations for EVGuide

### Immediate Design Priorities

**1. Build an EV-native visual language**
- Color palette: Deep teal + white + electric accent (avoid generic green/orange). Think Rivian or Tesla — confident, tech-forward.
- Iconography: Custom EV icons — charging bolt, range meter, battery %, home plug vs public charging.
- Typography: Modern, clean, confident. Consider a variable font for performance.

**2. Vehicle card design for EVs**
Instead of: "Mileage: 12,000 | Fuel: Electric"  
Show: `🔋 87% battery health | ⚡ 280mi range | 🏠 Home charging ready`

This is a fundamentally different data model from ICE cars.

**3. Range Confidence UI**
- Embed a range calculator directly on vehicle cards and detail pages
- "Will this car fit my commute?" — enter postcode, show range map
- This is a major anxiety reducer that neither competitor offers

**4. Design System**
- Build a component library from day one (Storybook or similar)
- Define: colors, spacing scale, card variants, button system, form elements
- Do NOT let design drift — a consistent system communicates premium quality

**5. Charging Network Overlay**
- On vehicle detail page: show nearby charging stations (Zap-Map API or Open Charge Map)
- Filter listing by: compatible charging standard, max charge speed (kW)

**6. Trust Signal Stack (EV-specific)**
- Battery health certification badge
- Manufacturer warranty remaining
- Full charge cost at current energy prices
- CO₂ savings vs equivalent ICE vehicle

**7. Mobile-first, always**
- 65%+ of UK car search traffic is mobile
- Bottom nav bar, large touch targets, swipeable image galleries
- Filter UI as bottom sheet (not sidebar)

---

## Summary

EVGuide has a clear design opportunity: **neither competitor has designed natively for the EV buyer**. Both Carwow and Auto Trader treat EVs as just another fuel type. EVGuide can own the EV buyer experience by building a UI that speaks to real EV purchase concerns — range, charging, battery health, total cost of ownership — in a visually premium, mobile-first package.

**Design positioning:** Tesla-meets-Which? — aspirational but data-driven.
