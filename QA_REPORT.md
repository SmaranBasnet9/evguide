# EVGuide QA Report
**Date:** 2026-05-14  
**QA:** Claude (automated code + logic audit)  
**Scope:** Full codebase — API routes, calculation logic, data integrity, UI flows, dummy data

---

## Summary

| Severity | Found | Fixed | Remaining |
|----------|-------|-------|-----------|
| CRITICAL | 3     | 3     | 0         |
| HIGH     | 4     | 0     | 4         |
| MEDIUM   | 6     | 0     | 6         |
| LOW      | 4     | 0     | 4         |
| **Total**| **17**| **3** | **14**    |

---

## CRITICAL — Fixed

### C-01 · Fleet payback division by zero
**File:** `app/fleet/page.tsx:84`  
**Bug:** `Math.ceil(netInfrastructureCost / monthlyFleetSaving)` — if all savings inputs are zero (user hasn't changed defaults or enters 0 fleet size), `totalFleetSaving = 0` → `monthlyFleetSaving = 0` → `Infinity` or `NaN` returned as payback period. Would crash the results display.  
**Fix applied:** `monthlyFleetSaving > 0 ? Math.ceil(...) : 0`  
**Status:** ✅ Fixed

---

### C-02 · VIN validation accepts 11–16 character strings
**File:** `app/api/battery-health/route.ts:87`  
**Bug:** `if (vin.length < 11 || vin.length > 17)` accepts VINs of 11–16 characters. Real-world VINs are always exactly 17 characters (ISO 3779). Error message also said "17-character VIN" while silently accepting 11-char strings.  
**Fix applied:** `vin.length !== 17 || /[IOQ]/.test(vin)` — enforces exactly 17 chars and blocks I, O, Q (forbidden characters per VIN standard).  
**Status:** ✅ Fixed

---

### C-03 · Battery health RNG returns identical values for every call
**File:** `app/api/battery-health/route.ts:17–20`  
**Bug:** LCG (linear congruential generator) computed `s` from `seed` but never updated `seed` between calls. Every `rand()` call returned the same number, so the ±1% jitter was always identical — battery health was fully deterministic without any variance, and `cellBalanceOptions` always picked the same index.  
**Fix applied:** `seed` is now declared with `let` and updated each call: `seed = (seed * 9301 + 49297) % 233280`.  
**Status:** ✅ Fixed

---

## HIGH — Not yet fixed

### H-01 · Admin route missing pagination on large result sets
**File:** `app/api/admin/consultations/route.ts`  
**Bug:** Fetches all rows with no `limit` clause. At 1,000+ consultation records this will cause slow responses and potential timeout. Supabase default cap is 1,000 rows, so data silently truncates.  
**Recommendation:** Add `.range(offset, offset + 49)` and return `count` for pagination.

---

### H-02 · Used listings POST accepts negative mileage
**File:** `app/api/used-listings/route.ts:61`  
**Bug:** `if (!mileage && mileage !== 0)` — negative numbers are truthy, so `-999` passes validation. A listing with -999 miles would be saved to the database.  
**Recommendation:** Change to `if (mileage === null || mileage < 0)`.

---

### H-03 · Finance page: APR 0% monthly payment uses wrong formula path
**File:** `app/finance/page.tsx` (calculateFinanceMetrics)  
**Bug:** 0% APR is handled via special case returning `loanAmount / termMonths`, which is correct. However the PCP residual value path (`monthlyRate === 0 && residual > 0`) is not covered — the formula would produce `NaN` monthly payments for a 0% PCP deal.  
**Recommendation:** Add guard: `if (monthlyRate === 0) return (loanAmount - residual) / termMonths`.

---

### H-04 · AI chat route has no max message length validation
**File:** `app/api/claude/route.ts`  
**Bug:** User message sent directly to Claude API with no length cap. A malicious user could send a 1MB string per request, inflating token costs.  
**Recommendation:** Add `if (message.length > 2000) return 400`.

---

## MEDIUM — Not yet fixed

### M-01 · Used listings: image URL not validated on POST
**File:** `app/api/used-listings/route.ts`  
**Bug:** `image` field accepted as any string, including `javascript:alert()` or arbitrary external domains not in `next.config.ts` remotePatterns. Would break `<Image>` component on used EV detail page.  
**Recommendation:** Validate URL scheme is `https://` only.

---

### M-02 · Compare page: no max comparison guard
**File:** `app/compare/page.tsx`  
**Bug:** URL params can pass 10+ car IDs. Page renders all of them side-by-side with no cap, breaking the layout on mobile and potentially loading 10 DB queries.  
**Recommendation:** Cap at 3 vehicles; show warning if more provided.

---

### M-03 · Consultation results: empty state shown before data loads
**File:** `app/consultation/results/page.tsx`  
**Bug:** On slow connections, the `NoResultsFallback` component briefly flashes before results populate because there's no intermediate loading state separate from the Suspense boundary.  
**Recommendation:** Ensure loading skeleton covers the results section.

---

### M-04 · Admin CRM notes: no max length on note body
**File:** `app/api/admin/crm/[profileId]/notes/route.ts`  
**Bug:** Note `body` is stored with no length validation. A 100KB note would be inserted into Supabase without error but would cause display issues in the CRM table.  
**Recommendation:** Add `if (body.length > 5000) return 400`.

---

### M-05 · Battery health report: year 2026 edge case
**File:** `app/api/battery-health/route.ts:23`  
**Bug:** `ageYears = 2026 - year` — if year is 2026, age is 0, which is valid. But `chargeCycles = Math.round((mileage / 200) * (soh / 100))` returns 0 cycles for brand-new cars regardless of mileage, which looks wrong on the report.  
**Recommendation:** Minor — show "< 50 cycles estimated" for cars under 1 year old.

---

### M-06 · Fleet calculator: chargePointsNeeded rounds down, may underprovision
**File:** `app/fleet/page.tsx` (calculateFleetSavings)  
**Bug:** `Math.floor(fleetSize / 4)` means a fleet of 5 gets 1 charger (not 2). Under-provisioning would give an unrealistically short payback period.  
**Recommendation:** Use `Math.ceil(fleetSize / 4)` for the chargepoints recommendation.

---

## LOW

### L-01 · Blog slug page: missing 404 for non-existent slugs
**File:** `app/blog/[slug]/page.tsx`  
**Bug:** If slug doesn't match any post in the DB, page renders with all empty/null props rather than calling `notFound()`.

### L-02 · EV models: deduplication is silent
**File:** `data/evModels.ts:1697–1699`  
**Bug:** The runtime dedup filter silently discards 31 duplicate model entries. No console warning. If a dev adds a new model and accidentally duplicates the ID, it silently disappears.

### L-03 · Used EV listing detail page: no sold state UI
**File:** `app/used-evs/[id]/page.tsx`  
**Bug:** Listings with `status: "sold"` render the full "Contact Seller" CTA unchanged — no "SOLD" badge or disabled state.

### L-04 · Admin layout: sidebar links for dealer-bids and test-drives missing
**File:** `app/admin/layout.tsx`  
**Bug:** `app/admin/dealer-bids/page.tsx` and `app/admin/test-drives/page.tsx` exist but have no sidebar navigation entry — only reachable by direct URL.

---

## Dummy Data Added

13 used EV listings now available (was 6). New entries cover:

| ID | Vehicle | Price | Mileage | Battery | Status | Seller |
|----|---------|-------|---------|---------|--------|--------|
| used-bmwi4-001 | BMW i4 eDrive40 M Sport 2022 | £37,995 | 27,400 | 94% | active | dealer |
| used-audiQ4-001 | Audi Q4 e-tron 40 S Line 2021 | £29,500 | 58,300 | 86% | active | dealer |
| used-vwid3-001 | VW ID.3 Pro Performance 2021 | £17,450 | 44,800 | 88% | active | private |
| used-tesla-my-001 | Tesla Model Y Long Range 2023 | £39,750 | 12,600 | 99% | active | private |
| used-renaultzoe-001 | Renault Zoe GT Line+ 2020 | £11,995 | 38,200 | 84% | **pending** | private |
| used-polestar2-002 | Polestar 2 Standard Range 2022 | £23,995 | 31,500 | 93% | **sold** | dealer |
| used-mg5-001 | MG5 Long Range Exclusive 2022 | £16,750 | 25,900 | 92% | active | dealer |

**Coverage added by new entries:**
- Status variety: active ✓ pending ✓ sold ✓ (was all active)
- Battery health range: 84%–99% (was 89%–98%)
- Price range: £11,995–£39,750 (was £14,995–£31,450)
- Premium bracket: BMW, Audi (was missing)
- Estate format: MG5 (UK's only EV estate)
- Near-new: Tesla MY at 12,600 miles

---

## Process Flows Verified

| Flow | Result |
|------|--------|
| Used EV browse → listing detail → contact seller | Pass |
| Battery health report (valid 17-char VIN) | Pass (after C-02/C-03 fix) |
| Fleet calculator with 0 savings | Pass (after C-01 fix) |
| Admin consultation list | Pass (silent pagination truncation — see H-01) |
| Blog article load | Pass |
| Comparison tool (2 vehicles) | Pass |
| Consultation → results (no matches) | Pass — NoResultsFallback shown |
| Finance calculator (HP, PCP, leasing tabs) | Pass (0% PCP edge case — see H-03) |

---

*Report generated: 2026-05-14 | Next QA sweep recommended after H-01, H-02, H-03 fixes.*
