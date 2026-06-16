"use client";

import { useState } from "react";

const PHASES = [
  {
    id: 1,
    label: "Phase 1",
    period: "0–6 months",
    title: "Foundation & Revenue",
    color: "#00C896",
    budget: "£25,000–£45,000",
    revenue: "£0–£8k/mo",
    items: [
      {
        title: "Dealer Bid Engine",
        tag: "Core Revenue",
        effort: "8 weeks",
        cost: "£12,000",
        desc: "Build a reverse-auction system where verified EV dealers submit no-haggle quotes against a buyer's AI-matched spec. Dealers pay £30–£80 per qualified lead. Integrates with existing AI Match flow.",
        tech: ["Next.js API routes", "Stripe Connect", "Dealer CMS portal", "Email/SMS notifications"],
        kpi: "Target: 20 dealers onboarded, 150 leads/mo by month 6",
      },
      {
        title: "Test Drive Activation",
        tag: "Conversion",
        effort: "3 weeks",
        cost: "£4,000",
        desc: "Turn the existing test drive form into a fully functional booking system with dealer calendars, confirmation emails, and follow-up nudges. EVGuide already has the UI — just needs the backend wired up.",
        tech: ["Cal.com API or custom slots", "Sendgrid", "Dealer dashboard"],
        kpi: "Target: 80 bookings/mo, 35% conversion to quote request",
      },
      {
        title: "Home Charger Partnerships",
        tag: "Affiliate Revenue",
        effort: "4 weeks",
        cost: "£3,500",
        desc: "Partner with Pod Point, Ohme, Hypervolt and Octopus Electric Vehicles. Add a post-match 'Set up your home charger' CTA. £40–£120 affiliate commission per install referral.",
        tech: ["Affiliate tracking links", "Partner API (Octopus)", "CTA placement in match flow"],
        kpi: "Target: 60 referrals/mo at avg £65 commission = £3,900/mo",
      },
      {
        title: "SEO & Editorial Engine",
        tag: "Organic Growth",
        effort: "Ongoing",
        cost: "£5,500",
        desc: "Publish 8–12 EV-specific long-form guides per month targeting high-intent queries: 'best EV under £30k UK 2026', 'MG4 vs BYD Atto 3', 'cheapest EV to charge at home'. AutoTrader does broad content; EVGuide wins on EV depth.",
        tech: ["Headless CMS (Sanity)", "Structured data / schema markup", "Internal linking system"],
        kpi: "Target: 40,000 organic visits/mo by month 6",
      },
    ],
  },
  {
    id: 2,
    label: "Phase 2",
    period: "6–18 months",
    title: "Marketplace & Data",
    color: "#0099FF",
    budget: "£80,000–£140,000",
    revenue: "£15k–£60k/mo",
    items: [
      {
        title: "Used EV Listings Marketplace",
        tag: "Biggest Opportunity",
        effort: "16 weeks",
        cost: "£35,000",
        desc: "List used EVs with EV-specific data AutoTrader doesn't show: battery health %, real-world range degradation, charging session history, ULEZ status, wallbox included. Sellers pay £25–£75 to list; dealers pay £150/mo subscription.",
        tech: ["Vehicle data API (cap hpi / Cartell)", "Battery health ingestion", "Search & filter engine", "Stripe subscriptions"],
        kpi: "Target: 2,500 live listings, 800 dealer subscribers by month 18",
      },
      {
        title: "EV Insurance Comparison",
        tag: "Affiliate Revenue",
        effort: "6 weeks",
        cost: "£9,000",
        desc: "Embed a white-label EV insurance comparison at the point of purchase decision. Partner with By Miles, Marshmallow, and Hastings Direct EV. £25–£55 per policy lead. Neither Carwow nor AutoTrader does EV-specific insurance.",
        tech: ["Quotezone or Seopa white-label API", "Policy comparison widget", "Lead tracking"],
        kpi: "Target: 400 leads/mo at avg £38 = £15,200/mo",
      },
      {
        title: "EV Energy Tariff Comparison",
        tag: "Unique Feature",
        effort: "5 weeks",
        cost: "£8,000",
        desc: "Compare Intelligent Octopus, Ovo Charge Anytime, E.ON Drive, and others. Show true cost per mile based on the matched EV's real-world consumption + the buyer's postcode. Completely uncontested territory.",
        tech: ["Ofgem tariff data feed", "Postcode-based pricing", "Cost-per-mile calculator"],
        kpi: "Target: 35% of matched users engage with tariff tool",
      },
      {
        title: "Battery Health Report Product",
        tag: "Premium Feature",
        effort: "8 weeks",
        cost: "£18,000",
        desc: "Offer a paid £29 battery health report for any used EV by VIN — pulling from OBD diagnostics network partners or OEM APIs where available. Creates a trusted data moat. Resell to dealers as part of their listings.",
        tech: ["VIN lookup API", "OBD partner integration (Autopi / Spritmonitor)", "PDF report generation"],
        kpi: "Target: 600 reports/mo at £29 = £17,400/mo gross",
      },
    ],
  },
  {
    id: 3,
    label: "Phase 3",
    period: "18 months+",
    title: "Scale & B2B",
    color: "#FF6B35",
    budget: "£200,000+",
    revenue: "£100k+/mo",
    items: [
      {
        title: "SME Fleet EV Tool",
        tag: "B2B / High Value",
        effort: "20 weeks",
        cost: "£55,000",
        desc: "Build a fleet transition calculator for businesses with 5–100 vehicles: route analysis, charge point planning, salary sacrifice scheme builder, whole-life cost vs diesel. Charge £299–£999/mo SaaS. No competitor is in this EV-specific B2B space.",
        tech: ["Route/telematics API", "Salary sacrifice calculator", "Fleet management dashboard", "Recurring billing"],
        kpi: "Target: 300 SME clients at avg £450/mo = £135,000/mo",
      },
      {
        title: "White-label AI Match for Dealers",
        tag: "Platform Play",
        effort: "12 weeks",
        cost: "£40,000",
        desc: "License EVGuide's AI matching engine to EV dealerships to embed on their own websites. They get a branded version; EVGuide gets £500–£2,000/mo per dealer plus data insights. Turns competitors into customers.",
        tech: ["Embeddable JS widget", "API with dealer branding config", "Usage metering / billing"],
        kpi: "Target: 80 licensed dealers at avg £900/mo = £72,000/mo",
      },
      {
        title: "EV Owner Community & Resale",
        tag: "Retention & Data",
        effort: "10 weeks",
        cost: "£22,000",
        desc: "Build a post-purchase community: charging tips, range optimisation, peer reviews, and a private resale channel where owners list directly to verified buyers. Community drives return visits and feeds used listings with quality supply.",
        tech: ["Forum / community (Discourse or custom)", "Private listing flow", "Push notifications"],
        kpi: "Target: 25,000 registered owners, 15% monthly active",
      },
      {
        title: "Manufacturer Data Partnerships",
        tag: "Revenue & Moat",
        effort: "12 weeks",
        cost: "£30,000",
        desc: "Sell anonymised, aggregated buyer intent data to OEMs (Hyundai, Kia, BYD, Polestar). Which models are being matched but not converting? What's the drop-off point in the finance calculator? Charge £5k–£25k/mo per brand.",
        tech: ["Data warehouse (BigQuery)", "Anonymisation pipeline", "Brand reporting dashboards"],
        kpi: "Target: 6 OEM partnerships at avg £12k/mo = £72,000/mo",
      },
    ],
  },
];

const REVENUE_MODEL = [
  { stream: "Dealer lead fees", model: "£30–£80 per qualified lead", phase: 1, type: "Transaction" },
  { stream: "Home charger affiliate", model: "£40–£120 per install referral", phase: 1, type: "Affiliate" },
  { stream: "Used EV dealer subscriptions", model: "£150/mo per dealer", phase: 2, type: "SaaS" },
  { stream: "Private seller listings", model: "£25–£75 per listing", phase: 2, type: "Transaction" },
  { stream: "Insurance comparison leads", model: "£25–£55 per policy", phase: 2, type: "Affiliate" },
  { stream: "Battery health reports", model: "£29 per report", phase: 2, type: "Product" },
  { stream: "Tariff comparison affiliate", model: "£15–£40 per switch", phase: 2, type: "Affiliate" },
  { stream: "SME fleet SaaS", model: "£299–£999/mo per business", phase: 3, type: "SaaS" },
  { stream: "White-label AI Match", model: "£500–£2,000/mo per dealer", phase: 3, type: "SaaS" },
  { stream: "OEM data partnerships", model: "£5k–£25k/mo per brand", phase: 3, type: "Enterprise" },
];

const STACK = [
  { layer: "Frontend", tech: "Next.js 14 + TypeScript", note: "Already on Vercel — keep it" },
  { layer: "Styling", tech: "Tailwind CSS + shadcn/ui", note: "Fast, consistent components" },
  { layer: "Database", tech: "PostgreSQL via Supabase", note: "Auth, realtime, storage included" },
  { layer: "AI / Matching", tech: "Claude API (Anthropic)", note: "Powers AI Match & chat" },
  { layer: "Payments", tech: "Stripe + Stripe Connect", note: "Dealer payouts + subscriptions" },
  { layer: "Search", tech: "Algolia or Typesense", note: "Fast vehicle search & filters" },
  { layer: "Email", tech: "Resend + React Email", note: "Transactional & marketing" },
  { layer: "Analytics", tech: "PostHog", note: "Product analytics + feature flags" },
  { layer: "Vehicle data", tech: "Cap HPI API", note: "VIN lookup, valuations, history" },
  { layer: "CMS", tech: "Sanity.io", note: "Editorial content & buying guides" },
  { layer: "Infra", tech: "Vercel + Supabase Edge", note: "Serverless, scales automatically" },
  { layer: "Monitoring", tech: "Sentry + Vercel Analytics", note: "Error tracking & performance" },
];

const phaseColors: Record<number, string> = { 1: "#00C896", 2: "#0099FF", 3: "#FF6B35" };
const typeColors: Record<string, string> = {
  Transaction: "#00C896",
  Affiliate: "#0099FF",
  SaaS: "#FF6B35",
  Product: "#9B59B6",
  Enterprise: "#E74C3C",
};

export default function BusinessPlanPage() {
  const [activePhase, setActivePhase] = useState(1);
  const [activeTab, setActiveTab] = useState("roadmap");
  const [expandedItem, setExpandedItem] = useState<number | null>(null);

  const phase = PHASES.find((p) => p.id === activePhase)!;

  return (
    <div style={{
      fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif",
      background: "#0A0E14",
      color: "#E8EDF5",
      minHeight: "100vh",
      margin: "-32px",
    }}>
      {/* Header */}
      <div style={{
        borderBottom: "1px solid rgba(255,255,255,0.07)",
        padding: "28px 32px 24px",
        background: "linear-gradient(180deg, #0F1520 0%, #0A0E14 100%)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "6px" }}>
          <div style={{
            width: "32px", height: "32px", borderRadius: "8px",
            background: "linear-gradient(135deg, #00C896, #0099FF)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "16px",
          }}>⚡</div>
          <span style={{ fontSize: "13px", color: "#00C896", fontWeight: "600", letterSpacing: "0.08em", textTransform: "uppercase" }}>EVGuide AI</span>
        </div>
        <h1 style={{ fontSize: "26px", fontWeight: "700", margin: "0 0 4px", letterSpacing: "-0.02em" }}>
          Business Development Plan
        </h1>
        <p style={{ fontSize: "13px", color: "rgba(232,237,245,0.45)", margin: 0 }}>
          3-phase roadmap to compete with Carwow & AutoTrader · 2026–2028
        </p>
      </div>

      {/* Nav Tabs */}
      <div style={{
        display: "flex", gap: "4px", padding: "16px 32px 0",
        borderBottom: "1px solid rgba(255,255,255,0.07)",
      }}>
        {[
          { id: "roadmap", label: "Roadmap" },
          { id: "revenue", label: "Revenue Streams" },
          { id: "stack", label: "Tech Stack" },
          { id: "summary", label: "Financials" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              background: activeTab === tab.id ? "rgba(0,200,150,0.12)" : "transparent",
              border: "none",
              borderBottom: activeTab === tab.id ? "2px solid #00C896" : "2px solid transparent",
              color: activeTab === tab.id ? "#00C896" : "rgba(232,237,245,0.45)",
              padding: "8px 16px 12px",
              fontSize: "13px",
              fontWeight: "500",
              cursor: "pointer",
              borderRadius: "4px 4px 0 0",
              transition: "all 0.15s",
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div style={{ padding: "28px 32px" }}>

        {/* ROADMAP TAB */}
        {activeTab === "roadmap" && (
          <div>
            <div style={{ display: "flex", gap: "10px", marginBottom: "24px" }}>
              {PHASES.map((p) => (
                <button
                  key={p.id}
                  onClick={() => { setActivePhase(p.id); setExpandedItem(null); }}
                  style={{
                    flex: 1,
                    background: activePhase === p.id ? "rgba(255,255,255,0.05)" : "transparent",
                    border: `1px solid ${activePhase === p.id ? p.color : "rgba(255,255,255,0.1)"}`,
                    borderRadius: "10px",
                    padding: "14px 16px",
                    cursor: "pointer",
                    textAlign: "left",
                    transition: "all 0.2s",
                  }}
                >
                  <div style={{ fontSize: "11px", color: p.color, fontWeight: "600", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: "4px" }}>
                    {p.label} · {p.period}
                  </div>
                  <div style={{ fontSize: "14px", fontWeight: "600", color: "#E8EDF5", marginBottom: "8px" }}>{p.title}</div>
                  <div style={{ display: "flex", gap: "12px" }}>
                    <div>
                      <div style={{ fontSize: "10px", color: "rgba(232,237,245,0.35)", marginBottom: "2px" }}>Budget</div>
                      <div style={{ fontSize: "12px", color: "rgba(232,237,245,0.75)", fontWeight: "500" }}>{p.budget}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: "10px", color: "rgba(232,237,245,0.35)", marginBottom: "2px" }}>Revenue target</div>
                      <div style={{ fontSize: "12px", color: p.color, fontWeight: "600" }}>{p.revenue}</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {phase.items.map((item, i) => {
                const isOpen = expandedItem === i;
                return (
                  <div
                    key={i}
                    style={{
                      background: "rgba(255,255,255,0.03)",
                      border: `1px solid ${isOpen ? phase.color + "50" : "rgba(255,255,255,0.08)"}`,
                      borderRadius: "12px",
                      overflow: "hidden",
                      transition: "border-color 0.2s",
                    }}
                  >
                    <button
                      onClick={() => setExpandedItem(isOpen ? null : i)}
                      style={{
                        width: "100%", background: "none", border: "none",
                        padding: "16px 18px", cursor: "pointer", textAlign: "left",
                        display: "flex", alignItems: "center", justifyContent: "space-between",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                        <div style={{
                          width: "6px", height: "6px", borderRadius: "50%",
                          background: phase.color, flexShrink: 0,
                        }} />
                        <div>
                          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "2px" }}>
                            <span style={{ fontSize: "14px", fontWeight: "600", color: "#E8EDF5" }}>{item.title}</span>
                            <span style={{
                              fontSize: "10px", fontWeight: "600", padding: "2px 8px",
                              borderRadius: "20px", background: phase.color + "20", color: phase.color,
                              letterSpacing: "0.04em",
                            }}>{item.tag}</span>
                          </div>
                          <div style={{ display: "flex", gap: "16px" }}>
                            <span style={{ fontSize: "12px", color: "rgba(232,237,245,0.4)" }}>⏱ {item.effort}</span>
                            <span style={{ fontSize: "12px", color: "rgba(232,237,245,0.4)" }}>💷 {item.cost}</span>
                          </div>
                        </div>
                      </div>
                      <span style={{ color: "rgba(232,237,245,0.3)", fontSize: "18px", transform: isOpen ? "rotate(180deg)" : "rotate(0)", transition: "transform 0.2s" }}>⌄</span>
                    </button>

                    {isOpen && (
                      <div style={{ padding: "0 18px 18px" }}>
                        <p style={{ fontSize: "13px", color: "rgba(232,237,245,0.65)", lineHeight: "1.65", margin: "0 0 14px" }}>{item.desc}</p>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                          <div>
                            <div style={{ fontSize: "11px", color: "rgba(232,237,245,0.35)", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "8px" }}>Tech involved</div>
                            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                              {item.tech.map((t, ti) => (
                                <span key={ti} style={{
                                  fontSize: "11px", padding: "3px 9px", borderRadius: "6px",
                                  background: "rgba(255,255,255,0.06)", color: "rgba(232,237,245,0.6)",
                                  border: "1px solid rgba(255,255,255,0.08)",
                                }}>{t}</span>
                              ))}
                            </div>
                          </div>
                          <div>
                            <div style={{ fontSize: "11px", color: "rgba(232,237,245,0.35)", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "8px" }}>Success metric</div>
                            <div style={{
                              fontSize: "12px", color: phase.color, background: phase.color + "12",
                              border: `1px solid ${phase.color}30`, borderRadius: "8px",
                              padding: "8px 12px", lineHeight: "1.5",
                            }}>{item.kpi}</div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* REVENUE TAB */}
        {activeTab === "revenue" && (
          <div>
            <div style={{ marginBottom: "20px" }}>
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "16px" }}>
                {Object.entries(typeColors).map(([type, color]) => (
                  <span key={type} style={{
                    fontSize: "11px", padding: "3px 10px", borderRadius: "20px",
                    background: color + "18", color: color, border: `1px solid ${color}30`,
                    fontWeight: "600",
                  }}>{type}</span>
                ))}
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {REVENUE_MODEL.map((r, i) => (
                <div key={i} style={{
                  display: "grid", gridTemplateColumns: "1fr auto auto",
                  alignItems: "center", gap: "16px",
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.07)",
                  borderRadius: "10px", padding: "14px 16px",
                }}>
                  <div>
                    <div style={{ fontSize: "13px", fontWeight: "600", color: "#E8EDF5", marginBottom: "3px" }}>{r.stream}</div>
                    <div style={{ fontSize: "12px", color: "rgba(232,237,245,0.45)" }}>{r.model}</div>
                  </div>
                  <span style={{
                    fontSize: "10px", fontWeight: "600", padding: "3px 9px",
                    borderRadius: "20px", background: typeColors[r.type] + "18",
                    color: typeColors[r.type], border: `1px solid ${typeColors[r.type]}30`,
                    whiteSpace: "nowrap",
                  }}>{r.type}</span>
                  <span style={{
                    fontSize: "11px", fontWeight: "700", padding: "3px 10px",
                    borderRadius: "6px",
                    background: phaseColors[r.phase] + "18",
                    color: phaseColors[r.phase],
                    border: `1px solid ${phaseColors[r.phase]}25`,
                    whiteSpace: "nowrap",
                  }}>Phase {r.phase}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TECH STACK TAB */}
        {activeTab === "stack" && (
          <div>
            <p style={{ fontSize: "13px", color: "rgba(232,237,245,0.45)", marginBottom: "20px", lineHeight: "1.6" }}>
              EVGuide is already on Next.js + Vercel. The recommended stack extends this foundation rather than rebuilding — keeping velocity high and costs low.
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "10px" }}>
              {STACK.map((s, i) => (
                <div key={i} style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: "10px", padding: "14px 16px",
                }}>
                  <div style={{ fontSize: "10px", color: "rgba(232,237,245,0.3)", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: "5px" }}>{s.layer}</div>
                  <div style={{ fontSize: "14px", fontWeight: "600", color: "#00C896", marginBottom: "4px" }}>{s.tech}</div>
                  <div style={{ fontSize: "12px", color: "rgba(232,237,245,0.45)" }}>{s.note}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* FINANCIALS TAB */}
        {activeTab === "summary" && (
          <div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px", marginBottom: "24px" }}>
              {[
                { label: "Phase 1 investment", value: "£25–45k", sub: "0–6 months", color: "#00C896" },
                { label: "Phase 2 investment", value: "£80–140k", sub: "6–18 months", color: "#0099FF" },
                { label: "Phase 3 investment", value: "£200k+", sub: "18 months+", color: "#FF6B35" },
                { label: "Phase 1 revenue target", value: "£8k/mo", sub: "By month 6", color: "#00C896" },
                { label: "Phase 2 revenue target", value: "£60k/mo", sub: "By month 18", color: "#0099FF" },
                { label: "Phase 3 revenue target", value: "£100k+/mo", sub: "By month 30", color: "#FF6B35" },
              ].map((m, i) => (
                <div key={i} style={{
                  background: "rgba(255,255,255,0.03)",
                  border: `1px solid ${m.color}25`,
                  borderRadius: "12px", padding: "16px",
                }}>
                  <div style={{ fontSize: "11px", color: "rgba(232,237,245,0.4)", marginBottom: "6px" }}>{m.label}</div>
                  <div style={{ fontSize: "22px", fontWeight: "700", color: m.color, marginBottom: "2px" }}>{m.value}</div>
                  <div style={{ fontSize: "11px", color: "rgba(232,237,245,0.3)" }}>{m.sub}</div>
                </div>
              ))}
            </div>

            <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "12px", padding: "20px", marginBottom: "16px" }}>
              <div style={{ fontSize: "12px", fontWeight: "600", color: "rgba(232,237,245,0.4)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "14px" }}>Competitive positioning vs rivals</div>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {[
                  { area: "EV-specific matching", evguide: 95, carwow: 40, autotrader: 30 },
                  { area: "Used car inventory", evguide: 20, carwow: 35, autotrader: 100 },
                  { area: "Dealer network", evguide: 10, carwow: 85, autotrader: 100 },
                  { area: "Battery health data", evguide: 60, carwow: 5, autotrader: 10 },
                  { area: "Post-purchase tools", evguide: 25, carwow: 20, autotrader: 40 },
                  { area: "Finance comparison", evguide: 50, carwow: 70, autotrader: 80 },
                  { area: "B2B / fleet tools", evguide: 5, carwow: 10, autotrader: 20 },
                  { area: "Content & editorial", evguide: 20, carwow: 75, autotrader: 90 },
                ].map((row, i) => (
                  <div key={i}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "5px" }}>
                      <span style={{ fontSize: "12px", color: "rgba(232,237,245,0.6)" }}>{row.area}</span>
                      <div style={{ display: "flex", gap: "12px" }}>
                        <span style={{ fontSize: "11px", color: "#00C896" }}>EVG {row.evguide}%</span>
                        <span style={{ fontSize: "11px", color: "rgba(232,237,245,0.3)" }}>CW {row.carwow}%</span>
                        <span style={{ fontSize: "11px", color: "rgba(232,237,245,0.3)" }}>AT {row.autotrader}%</span>
                      </div>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
                      {[
                        { val: row.evguide, color: "#00C896" },
                        { val: row.carwow, color: "rgba(232,237,245,0.15)" },
                        { val: row.autotrader, color: "rgba(232,237,245,0.08)" },
                      ].map((bar, bi) => (
                        <div key={bi} style={{ height: "4px", background: "rgba(255,255,255,0.05)", borderRadius: "2px", overflow: "hidden" }}>
                          <div style={{ width: `${bar.val}%`, height: "100%", background: bar.color, borderRadius: "2px", transition: "width 0.5s ease" }} />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ display: "flex", gap: "16px", marginTop: "12px" }}>
                <span style={{ fontSize: "11px", color: "#00C896" }}>— EVGuide</span>
                <span style={{ fontSize: "11px", color: "rgba(232,237,245,0.3)" }}>— Carwow</span>
                <span style={{ fontSize: "11px", color: "rgba(232,237,245,0.2)" }}>— AutoTrader</span>
              </div>
            </div>

            <div style={{ background: "#00C89610", border: "1px solid #00C89630", borderRadius: "12px", padding: "16px" }}>
              <div style={{ fontSize: "12px", fontWeight: "600", color: "#00C896", marginBottom: "6px" }}>Strategic thesis</div>
              <p style={{ fontSize: "13px", color: "rgba(232,237,245,0.6)", margin: 0, lineHeight: "1.65" }}>
                EVGuide&apos;s window is 12–18 months before AutoTrader builds EV depth. The goal isn&apos;t to be a smaller AutoTrader — it&apos;s to own the EV buyer journey so completely that by the time AutoTrader invests in EV-specific features, EVGuide already has the brand trust, the data moat, and the dealer network locked in.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
