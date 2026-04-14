# Agent 4 — Database Inference Agent
**Platform:** EVGuide Competitor Analysis  
**Date:** 2026-04-10  
**Status:** ⚠️ INFERRED ARCHITECTURE — No access to real databases. All schema designs are reverse-engineered from public-facing product behaviour, API response shapes (where observable), and industry standard patterns for automotive marketplaces.

---

## Disclaimer

> This document contains **inferred backend architecture only**. No actual database access, API introspection, or proprietary data was used. All entity relationships, column definitions, and business logic are derived from:
> - Observed UI features and data fields displayed
> - Industry norms for automotive marketplace platforms
> - Public information (job postings, engineering blog posts, news articles where available)
> - Logical inference from product behaviour
>
> These inferences should be treated as **architectural hypotheses** to inform EVGuide's own design — not as factual descriptions of competitor systems.

---

## 1. Carwow — Inferred Backend Architecture

### Observed Features That Inform Schema
- Multi-dealer offer system (reverse auction)
- Manufacturer partnership / new car configuration
- Finance eligibility and monthly payment quotes
- Owner reviews with category breakdowns
- Vehicle valuation for sellers
- Lead management and offer delivery via email

---

### Inferred Core Entities

#### `vehicles`
```sql
id                    UUID PRIMARY KEY
make                  VARCHAR(100)          -- BMW, Tesla, Volkswagen
model                 VARCHAR(100)          -- i4, Model 3, ID.4
variant               VARCHAR(200)          -- e.g. "M Sport Pro 340i xDrive"
year                  SMALLINT
body_type             VARCHAR(50)           -- saloon, SUV, hatchback, estate
fuel_type             VARCHAR(30)           -- petrol, diesel, electric, hybrid, PHEV
transmission          VARCHAR(30)           -- automatic, manual
color_exterior        VARCHAR(50)
color_interior        VARCHAR(50)
mileage               INTEGER
price_asking          DECIMAL(10,2)
price_monthly         DECIMAL(8,2)          -- finance monthly estimate
engine_size_cc        INTEGER
power_bhp             INTEGER
doors                 SMALLINT
seats                 SMALLINT
status                VARCHAR(20)           -- available, reserved, sold
listing_type          VARCHAR(20)           -- new, used, nearly_new
dealer_id             UUID FOREIGN KEY → dealers
images                JSONB                 -- array of image URLs
specs_raw             JSONB                 -- raw spec block from DVLA/Cazana
created_at            TIMESTAMP
updated_at            TIMESTAMP
```

#### `dealers`
```sql
id                    UUID PRIMARY KEY
name                  VARCHAR(200)
trading_name          VARCHAR(200)
address               TEXT
postcode              VARCHAR(10)
lat                   DECIMAL(9,6)
lng                   DECIMAL(9,6)
phone                 VARCHAR(20)
email                 VARCHAR(200)
website               VARCHAR(300)
franchise_brands      VARCHAR[]             -- ['BMW', 'MINI']
subscription_tier     VARCHAR(30)           -- standard, premium, manufacturer_partner
is_manufacturer       BOOLEAN               -- true for OEM direct
rating_avg            DECIMAL(3,2)
review_count          INTEGER
carwow_verified       BOOLEAN
active                BOOLEAN
joined_at             TIMESTAMP
```

#### `users`
```sql
id                    UUID PRIMARY KEY
email                 VARCHAR(255) UNIQUE
first_name            VARCHAR(100)
last_name             VARCHAR(100)
phone                 VARCHAR(20)
postcode              VARCHAR(10)
lat                   DECIMAL(9,6)
lng                   DECIMAL(9,6)
gdpr_consent          BOOLEAN
marketing_consent     BOOLEAN
created_at            TIMESTAMP
last_active_at        TIMESTAMP
```

#### `leads`
```sql
id                    UUID PRIMARY KEY
user_id               UUID FOREIGN KEY → users
vehicle_id            UUID FOREIGN KEY → vehicles (nullable — new car searches)
search_criteria       JSONB                 -- what they searched for
intent                VARCHAR(30)           -- buy_new, buy_used, part_exchange
status                VARCHAR(20)           -- pending, offers_sent, accepted, closed
source                VARCHAR(50)           -- organic, paid_search, referral
utm_source            VARCHAR(100)
utm_campaign          VARCHAR(100)
created_at            TIMESTAMP
```

#### `dealer_offers`
```sql
id                    UUID PRIMARY KEY
lead_id               UUID FOREIGN KEY → leads
dealer_id             UUID FOREIGN KEY → dealers
vehicle_id            UUID FOREIGN KEY → vehicles
offer_price           DECIMAL(10,2)
monthly_price         DECIMAL(8,2)
finance_term_months   SMALLINT
deposit_amount        DECIMAL(8,2)
offer_expires_at      TIMESTAMP
status                VARCHAR(20)           -- sent, viewed, accepted, rejected
sent_at               TIMESTAMP
viewed_at             TIMESTAMP
responded_at          TIMESTAMP
```

#### `finance_applications`
```sql
id                    UUID PRIMARY KEY
user_id               UUID FOREIGN KEY → users
vehicle_id            UUID FOREIGN KEY → vehicles
dealer_offer_id       UUID FOREIGN KEY → dealer_offers
monthly_payment       DECIMAL(8,2)
deposit               DECIMAL(8,2)
term_months           SMALLINT
apr                   DECIMAL(5,2)
total_amount_payable  DECIMAL(10,2)
provider              VARCHAR(100)          -- finance company name
soft_search_id        VARCHAR(200)          -- reference from credit bureau
hard_search_id        VARCHAR(200)
status                VARCHAR(30)           -- pre_approval, approved, declined, funded
created_at            TIMESTAMP
```

#### `reviews`
```sql
id                    UUID PRIMARY KEY
vehicle_make          VARCHAR(100)
vehicle_model         VARCHAR(100)
vehicle_year          SMALLINT
reviewer_user_id      UUID FOREIGN KEY → users
ownership_months      SMALLINT
rating_overall        SMALLINT              -- 1-5
rating_comfort        SMALLINT
rating_reliability    SMALLINT
rating_value          SMALLINT
rating_running_cost   SMALLINT
body_text             TEXT
verified_owner        BOOLEAN
created_at            TIMESTAMP
```

#### `valuations` (Sell flow)
```sql
id                    UUID PRIMARY KEY
user_id               UUID FOREIGN KEY → users
registration          VARCHAR(10)
mileage               INTEGER
valuation_low         DECIMAL(10,2)
valuation_high        DECIMAL(10,2)
valuation_source      VARCHAR(50)           -- cap_hpi, cazana, internal
data_snapshot         JSONB                 -- raw valuation provider response
converted_to_lead     BOOLEAN
created_at            TIMESTAMP
```

---

## 2. Auto Trader — Inferred Backend Architecture

### Observed Features That Inform Schema
- Private and dealer listings (two separate inventory types)
- Paid listing tiers (free, standard, premium)
- Vehicle history product (ATCheck / MOT)
- Price intelligence ("Great Price" badges)
- Saved searches with email alerts
- Finance with multiple lender partners
- Dealer subscription management
- Map-based search

---

### Inferred Core Entities

#### `listings`
```sql
id                    UUID PRIMARY KEY
listing_type          VARCHAR(20)           -- private, dealer
seller_id             UUID FOREIGN KEY → sellers
vehicle_id            UUID FOREIGN KEY → vehicles
title                 VARCHAR(300)
description           TEXT
price_asking          DECIMAL(10,2)
price_monthly         DECIMAL(8,2)
price_label           VARCHAR(30)           -- great_price, good_price, fair_price
images                JSONB
status                VARCHAR(20)           -- active, sold, expired, draft
featured              BOOLEAN
highlighted           BOOLEAN
package_tier          VARCHAR(20)           -- free, standard, advanced, premium
views_count           INTEGER
enquiry_count         INTEGER
expires_at            TIMESTAMP
created_at            TIMESTAMP
updated_at            TIMESTAMP
```

#### `vehicles` (AT likely has a canonical vehicle DB separate from listings)
```sql
id                    UUID PRIMARY KEY
registration          VARCHAR(10) UNIQUE    -- DVLA source
vin                   VARCHAR(17)
make                  VARCHAR(100)
model                 VARCHAR(100)
derivative            VARCHAR(200)
year                  SMALLINT
fuel_type             VARCHAR(30)
transmission          VARCHAR(30)
body_type             VARCHAR(50)
color                 VARCHAR(50)
engine_size_cc        INTEGER
power_bhp             INTEGER
co2_gkm               SMALLINT
mpg_combined          DECIMAL(5,1)
mot_expiry            DATE
mot_history           JSONB                 -- array of MOT records
mileage_history       JSONB                 -- array of recorded mileages
num_previous_owners   SMALLINT
insurance_group       SMALLINT
tax_band              VARCHAR(5)
cap_id                VARCHAR(30)           -- CAP HPI industry code
specs                 JSONB                 -- full technical spec
```

#### `sellers` (unified for private + dealer)
```sql
id                    UUID PRIMARY KEY
seller_type           VARCHAR(20)           -- private, dealer
display_name          VARCHAR(200)
email                 VARCHAR(255)
phone                 VARCHAR(20)
postcode              VARCHAR(10)
lat                   DECIMAL(9,6)
lng                   DECIMAL(9,6)
-- Dealer-specific
trading_name          VARCHAR(200)
franchise_brands      VARCHAR[]
fca_authorised        BOOLEAN
subscription_plan_id  UUID FOREIGN KEY → subscription_plans
subscription_status   VARCHAR(20)
stock_count           INTEGER               -- denormalized for display
review_count          INTEGER
rating_avg            DECIMAL(3,2)
-- Private-specific
account_verified      BOOLEAN
id_verified           BOOLEAN
```

#### `subscription_plans` (dealer revenue model)
```sql
id                    UUID PRIMARY KEY
name                  VARCHAR(100)          -- Starter, Standard, Advanced, Premium
price_monthly         DECIMAL(8,2)
listing_limit         INTEGER
featured_listing_slots INTEGER
analytics_access      BOOLEAN
priority_support      BOOLEAN
price_data_access     BOOLEAN
```

#### `enquiries`
```sql
id                    UUID PRIMARY KEY
listing_id            UUID FOREIGN KEY → listings
buyer_user_id         UUID FOREIGN KEY → users (nullable for guests)
buyer_email           VARCHAR(255)
buyer_phone           VARCHAR(20)
buyer_name            VARCHAR(200)
message               TEXT
enquiry_type          VARCHAR(30)           -- email, call, whatsapp
status                VARCHAR(20)           -- sent, responded, closed
tracked_call_id       VARCHAR(100)          -- from call tracking provider
created_at            TIMESTAMP
```

#### `saved_searches`
```sql
id                    UUID PRIMARY KEY
user_id               UUID FOREIGN KEY → users
search_criteria       JSONB                 -- full filter state
alert_frequency       VARCHAR(20)           -- instant, daily, weekly
alert_email           VARCHAR(255)
last_alerted_at       TIMESTAMP
new_matches_count     INTEGER               -- denormalized for email
active                BOOLEAN
created_at            TIMESTAMP
```

#### `price_analysis` (powers "Great Price" badge)
```sql
id                    UUID PRIMARY KEY
vehicle_cap_id        VARCHAR(30)
listing_id            UUID FOREIGN KEY → listings
market_avg_price      DECIMAL(10,2)
percentile_rank       SMALLINT              -- 0-100
price_label           VARCHAR(30)           -- great, good, fair, high
mileage_adjusted      BOOLEAN
data_points_used      INTEGER
calculated_at         TIMESTAMP
```

---

## 3. Recommended Schema for EVGuide

EVGuide's schema must extend beyond ICE-car patterns to capture EV-specific data that creates competitive moat.

### New / Modified Entities

#### `vehicles` (EV-extended)
```sql
-- All standard fields (make, model, year, etc.) PLUS:

-- EV-specific
battery_capacity_kwh         DECIMAL(5,1)      -- e.g. 77.4
battery_usable_kwh           DECIMAL(5,1)      -- usable capacity
range_wltp_miles             SMALLINT          -- official WLTP
range_realworld_miles        SMALLINT          -- crowd-sourced or tested
range_urban_miles            SMALLINT
range_highway_miles          SMALLINT
battery_health_percent       SMALLINT          -- if known/reported
battery_warranty_years       SMALLINT
battery_warranty_miles       INTEGER
max_charge_speed_ac_kw       DECIMAL(5,1)      -- e.g. 11 kW
max_charge_speed_dc_kw       DECIMAL(5,1)      -- e.g. 150 kW
charge_port_type             VARCHAR(30)       -- CCS, CHAdeMO, Type2, NACS
charge_time_0_80_mins        SMALLINT
charge_time_full_mins        SMALLINT
home_charge_compatible       BOOLEAN
v2g_capable                  BOOLEAN           -- vehicle-to-grid
annual_energy_cost_gbp       DECIMAL(8,2)      -- calculated field
annual_fuel_equivalent_saving DECIMAL(8,2)
co2_saving_vs_avg_ice_kg     INTEGER
battery_chemistry            VARCHAR(50)       -- NMC, LFP, etc.
drivetrain                   VARCHAR(20)       -- FWD, RWD, AWD
motor_count                  SMALLINT
power_kw                     SMALLINT
torque_nm                    SMALLINT
zero_to_60_secs              DECIMAL(4,2)
```

#### `battery_health_reports`
```sql
id                          UUID PRIMARY KEY
vehicle_id                  UUID FOREIGN KEY → vehicles
listing_id                  UUID FOREIGN KEY → listings
reported_by                 VARCHAR(20)      -- seller, evguide_verified, third_party
health_percent              SMALLINT
assessment_date             DATE
assessment_method           VARCHAR(50)      -- obd_scan, visual, manufacturer_data
raw_scan_data               JSONB
certified                   BOOLEAN
certified_by                VARCHAR(100)
report_url                  VARCHAR(500)
created_at                  TIMESTAMP
```

#### `range_profiles` (powers "fits my commute" feature)
```sql
id                          UUID PRIMARY KEY
vehicle_id                  UUID FOREIGN KEY → vehicles
season                      VARCHAR(10)      -- summer, winter, all_year
driving_style               VARCHAR(20)      -- eco, normal, spirited
motorway_percent            SMALLINT
urban_percent               SMALLINT
estimated_range_miles       SMALLINT
data_source                 VARCHAR(30)      -- wltp, real_world_tested, user_reported
user_count                  INTEGER          -- how many users reported
created_at                  TIMESTAMP
```

#### `charging_compatibility`
```sql
id                          UUID PRIMARY KEY
vehicle_id                  UUID FOREIGN KEY → vehicles
network_name                VARCHAR(100)     -- Tesla Supercharger, bp pulse, Pod Point
compatible                  BOOLEAN
adapter_required            BOOLEAN
max_speed_at_network_kw     DECIMAL(5,1)
notes                       TEXT
```

#### `tco_calculations` (Total Cost of Ownership)
```sql
id                          UUID PRIMARY KEY
vehicle_id                  UUID FOREIGN KEY → vehicles
listing_id                  UUID FOREIGN KEY → listings (nullable)
user_id                     UUID FOREIGN KEY → users (nullable)
annual_mileage              INTEGER
home_energy_rate_pkwh       DECIMAL(6,4)     -- pence per kWh
public_charge_mix_percent   SMALLINT
finance_apr                 DECIMAL(5,2)
term_months                 SMALLINT
deposit_gbp                 DECIMAL(8,2)
annual_energy_cost          DECIMAL(8,2)
annual_insurance_est        DECIMAL(8,2)
annual_servicing_est        DECIMAL(8,2)
annual_tax_cost             DECIMAL(8,2)
total_3yr_cost              DECIMAL(10,2)
vs_comparable_ice_saving    DECIMAL(10,2)
created_at                  TIMESTAMP
```

#### `government_grants`
```sql
id                          UUID PRIMARY KEY
grant_name                  VARCHAR(200)     -- OZEV Plug-in Car Grant
authority                   VARCHAR(100)     -- DVLA, OZEV, local council
grant_amount_gbp            DECIMAL(8,2)
eligibility_criteria        JSONB            -- structured rules
vehicle_types               VARCHAR[]        -- car, van, motorbike
price_cap_gbp               DECIMAL(10,2)
active                      BOOLEAN
expires_at                  DATE
source_url                  VARCHAR(500)
updated_at                  TIMESTAMP
```

#### `salary_sacrifice_calculations`
```sql
id                          UUID PRIMARY KEY
user_id                     UUID FOREIGN KEY → users (nullable)
vehicle_id                  UUID FOREIGN KEY → vehicles
gross_salary_gbp            DECIMAL(10,2)
tax_band                    VARCHAR(10)      -- basic, higher, additional
p11d_value_gbp              DECIMAL(10,2)
bik_rate_percent            DECIMAL(5,2)
monthly_gross_cost          DECIMAL(8,2)
monthly_net_cost            DECIMAL(8,2)     -- after tax saving
annual_saving_vs_personal   DECIMAL(8,2)
ni_saving_for_employer      DECIMAL(8,2)
created_at                  TIMESTAMP
```

---

## 4. Schema Comparison

| Entity | Carwow (inferred) | Auto Trader (inferred) | EVGuide (recommended) |
|---|---|---|---|
| Vehicle core | Standard ICE fields | Full DVLA + MOT data | ICE + EV extension fields |
| Battery data | None | None | Full battery entity |
| Range data | None | None | WLTP + real-world profiles |
| Charging data | None | None | Compatibility + network mapping |
| TCO modelling | Basic finance calc | Basic running cost | Full 3-year TCO entity |
| Government grants | None | None | Grants entity |
| Salary sacrifice | None | None | SS calculation entity |
| Price intelligence | None visible | Price label system | AI-assisted EV pricing |
| Lead model | Reverse auction | Direct dealer contact | Hybrid (both options) |
| Review model | User reviews | Dealer reviews | Owner + battery-specific |

---

## 5. Data Sources EVGuide Should Integrate

| Source | Data | Priority |
|---|---|---|
| DVLA/DVSA API | Registration lookup, MOT history | P0 |
| CAP HPI | Industry vehicle valuations | P0 |
| Open Charge Map API | Charging station locations | P0 |
| Zap-Map API | UK charging network data | P1 |
| WLTP database | Official range figures | P0 |
| BatteryCheck / OBD providers | Battery health scans | P1 |
| HMRC BIK tables | Salary sacrifice calculations | P1 |
| OZEV grant data | Government incentives | P1 |
| Octopus/EDF/EON APIs | Energy tariff data for cost calcs | P2 |
| Ofgem energy price data | National average energy costs | P1 |
| Weather API | Range prediction adjusted for temperature | P3 |

---

## Summary

The architectural gap between current competitor databases and what EVGuide needs is significant — and intentional. EVGuide is not building a better version of what Carwow or Auto Trader built; it is building the **first EV-native data model** in the UK marketplace space.

The entities above — `battery_health_reports`, `range_profiles`, `tco_calculations`, `government_grants`, `salary_sacrifice_calculations` — do not exist in any competitor product. These are both product features and **data moats**. The more users interact with these tools, the richer EVGuide's dataset becomes, enabling better pricing intelligence, better recommendations, and eventually proprietary EV valuation models.

**Build the data model right, from day one.**
