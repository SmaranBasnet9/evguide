"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Search, Tag, ArrowRight, CheckCircle2, Star } from "lucide-react";

const BRANDS = ["Tesla", "BMW", "Kia", "BYD", "VW", "Hyundai", "Audi", "Volvo", "Polestar", "MG", "Renault", "Nissan"];

const BUDGETS = [
  { label: "Any budget", value: "" },
  { label: "Up to £25k", value: "25000" },
  { label: "£25k – £40k", value: "40000" },
  { label: "£40k – £60k", value: "60000" },
  { label: "£60k+", value: "100000" },
];

export default function HeroSearchConsole() {
  const router = useRouter();
  const [tab, setTab] = useState<"find" | "sell" | "reviews">("find");

  // Find a car state
  const [query, setQuery] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");
  const [budget, setBudget] = useState("");

  // Sell a car state
  const [reg, setReg] = useState("");
  const [name, setName] = useState("");
  const [vehicleModel, setVehicleModel] = useState("");
  const [vehicleColor, setVehicleColor] = useState("");
  const [vehicleVariant, setVehicleVariant] = useState("");
  const [purchaseYear, setPurchaseYear] = useState("");
  const [ownerHistory, setOwnerHistory] = useState<
    "first_owner" | "second_owner" | "third_plus" | ""
  >("");
  const [seatCount, setSeatCount] = useState("1");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [sellError, setSellError] = useState<string | null>(null);
  const currentYear = new Date().getFullYear();

  function handleSearch(e: FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    const q = selectedBrand || query.trim();
    if (q) params.set("q", q);
    if (budget) params.set("maxPrice", budget);
    const qs = params.size > 0 ? "?" + params.toString() : "";
    router.push(`/vehicles${qs}`);
  }

  async function handleSell(e: FormEvent) {
    e.preventDefault();
    if (
      !reg.trim() ||
      !name.trim() ||
      !vehicleModel.trim() ||
      !vehicleColor.trim() ||
      !vehicleVariant.trim() ||
      !purchaseYear.trim() ||
      !ownerHistory ||
      !seatCount.trim() ||
      !email.trim() ||
      !phone.trim()
    ) {
      setSellError("Please fill in all fields.");
      return;
    }
    setSubmitting(true);
    setSellError(null);
    try {
      const res = await fetch("/api/valuations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          phone,
          registration_number: reg.toUpperCase().trim(),
          vehicle_model: vehicleModel.trim(),
          vehicle_color: vehicleColor.trim(),
          vehicle_variant: vehicleVariant.trim(),
          purchase_year: purchaseYear,
          owner_history: ownerHistory,
          current_user_count: seatCount,
        }),
      });
      const payload = await res.json().catch(() => null);
      if (!res.ok) {
        setSellError(payload?.error ?? "Something went wrong. Please try again.");
        return;
      }
      setSubmitted(true);
      setReg("");
      setName("");
      setVehicleModel("");
      setVehicleColor("");
      setVehicleVariant("");
      setPurchaseYear("");
      setOwnerHistory("");
      setSeatCount("1");
      setEmail("");
      setPhone("");
    } catch {
      setSellError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="w-full overflow-hidden rounded-[1.75rem] border border-[#E5E7EB] bg-white p-1.5 shadow-lg shadow-black/10">
      {/* Tab switcher */}
      <div className="flex rounded-[1.35rem] bg-[#F3F7F5] p-1">
        <button
          type="button"
          onClick={() => setTab("find")}
          className={`flex flex-1 items-center justify-center gap-1.5 rounded-[1.1rem] px-3 py-2 text-sm font-semibold transition-all ${
            tab === "find"
              ? "bg-brand text-white shadow-md"
              : "text-[#6B7280] hover:text-[#1A1A1A]"
          }`}
        >
          <Search className="h-3.5 w-3.5" />
          Find a Car
        </button>
        <button
          type="button"
          onClick={() => setTab("sell")}
          className={`flex flex-1 items-center justify-center gap-1.5 rounded-[1.1rem] px-3 py-2 text-sm font-semibold transition-all ${
            tab === "sell"
              ? "bg-brand text-white shadow-md"
              : "text-[#6B7280] hover:text-[#1A1A1A]"
          }`}
        >
          <Tag className="h-3.5 w-3.5" />
          Sell a Car
        </button>
        <button
          type="button"
          onClick={() => setTab("reviews")}
          className={`flex flex-1 items-center justify-center gap-1.5 rounded-[1.1rem] px-3 py-2 text-sm font-semibold transition-all ${
            tab === "reviews"
              ? "bg-brand text-white shadow-md"
              : "text-[#6B7280] hover:text-[#1A1A1A]"
          }`}
        >
          <Star className="h-3.5 w-3.5" />
          Read Reviews
        </button>
      </div>

      <div className="p-3">
        {tab === "find" ? (
          <form onSubmit={handleSearch} className="space-y-3">
            {/* Search input */}
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6B7280]" />
              <input
                type="text"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setSelectedBrand("");
                }}
                placeholder="Search make, model or keyword..."
                className="w-full rounded-full border border-[#E5E7EB] bg-white py-3 pl-10 pr-4 text-sm text-[#1A1A1A] placeholder-[#6B7280] outline-none transition focus:border-brand focus:ring-2 focus:ring-[#D1F2EB]"
              />
            </div>

            {/* Brand pills */}
            <div className="flex flex-wrap gap-1.5">
              {BRANDS.map((brand) => (
                <button
                  key={brand}
                  type="button"
                  onClick={() => {
                    setSelectedBrand(brand === selectedBrand ? "" : brand);
                    setQuery("");
                  }}
                  className={`rounded-full border px-2.5 py-0.5 text-[11px] font-medium transition-all ${
                    selectedBrand === brand
                      ? "border-brand bg-brand text-white"
                      : "border-[#E5E7EB] bg-[#EEF9F5] text-brand hover:border-brand hover:bg-[#D1F2EB]"
                  }`}
                >
                  {brand}
                </button>
              ))}
            </div>

            {/* Budget + search button */}
            <div className="flex gap-2">
              <select
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                className="flex-1 rounded-xl border border-[#E5E7EB] bg-white px-3 py-2.5 text-sm text-[#1A1A1A] outline-none transition focus:border-brand focus:ring-2 focus:ring-[#D1F2EB]"
              >
                {BUDGETS.map((b) => (
                  <option key={b.value} value={b.value}>
                    {b.label}
                  </option>
                ))}
              </select>
              <button
                type="submit"
                className="flex items-center gap-2 rounded-xl bg-brand px-5 py-2.5 text-sm font-semibold text-white shadow-md transition hover:bg-brand-hover"
              >
                Search EVs
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </form>
        ) : tab === "reviews" ? (
          <div className="flex flex-col items-center gap-4 py-6 text-center">
            <Star className="h-10 w-10 text-brand" />
            <div>
              <p className="text-base font-semibold text-[#1A1A1A]">Expert EV &amp; Hybrid Reviews</p>
              <p className="mt-1 text-sm text-[#6B7280]">
                In-depth guides, real-world range tests, and owner opinions.
              </p>
            </div>
            <Link
              href="/blog"
              className="flex items-center gap-2 rounded-xl bg-brand px-6 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-brand-hover"
            >
              Browse all reviews
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        ) : submitted ? (
          <div className="flex flex-col items-center gap-3 py-8 text-center">
            <CheckCircle2 className="h-10 w-10 text-brand" />
            <p className="text-lg font-semibold text-[#1A1A1A]">Valuation request received</p>
            <p className="text-sm text-[#6B7280]">
              Our team will review your EV details and contact you shortly.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSell} className="space-y-3">
            <input
              type="text"
              value={reg}
              onChange={(e) => setReg(e.target.value.toUpperCase())}
              placeholder="Enter reg number  e.g. AB12 CDE"
              maxLength={10}
              className="w-full rounded-xl border border-[#E5E7EB] bg-white px-4 py-3.5 text-center font-mono text-xl font-bold uppercase tracking-[0.25em] text-[#1A1A1A] placeholder-[#6B7280] outline-none transition focus:border-brand focus:ring-2 focus:ring-[#D1F2EB]"
            />
            <div className="grid gap-3 md:grid-cols-4">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className="rounded-xl border border-[#E5E7EB] bg-white px-4 py-3 text-sm text-[#1A1A1A] placeholder-[#6B7280] outline-none transition focus:border-brand focus:ring-2 focus:ring-[#D1F2EB]"
              />
              <input
                type="text"
                value={vehicleModel}
                onChange={(e) => setVehicleModel(e.target.value)}
                placeholder="Vehicle model"
                className="rounded-xl border border-[#E5E7EB] bg-white px-4 py-3 text-sm text-[#1A1A1A] placeholder-[#6B7280] outline-none transition focus:border-brand focus:ring-2 focus:ring-[#D1F2EB]"
              />
              <input
                type="text"
                value={vehicleColor}
                onChange={(e) => setVehicleColor(e.target.value)}
                placeholder="Vehicle color"
                className="rounded-xl border border-[#E5E7EB] bg-white px-4 py-3 text-sm text-[#1A1A1A] placeholder-[#6B7280] outline-none transition focus:border-brand focus:ring-2 focus:ring-[#D1F2EB]"
              />
              <input
                type="text"
                value={vehicleVariant}
                onChange={(e) => setVehicleVariant(e.target.value)}
                placeholder="Vehicle variant"
                className="rounded-xl border border-[#E5E7EB] bg-white px-4 py-3 text-sm text-[#1A1A1A] placeholder-[#6B7280] outline-none transition focus:border-brand focus:ring-2 focus:ring-[#D1F2EB]"
              />
            </div>
            <div className="grid gap-3 md:grid-cols-3">
              <input
                type="number"
                min={1990}
                max={currentYear + 1}
                value={purchaseYear}
                onChange={(e) => setPurchaseYear(e.target.value)}
                placeholder="Buy year"
                className="rounded-xl border border-[#E5E7EB] bg-white px-4 py-3 text-sm text-[#1A1A1A] placeholder-[#6B7280] outline-none transition focus:border-brand focus:ring-2 focus:ring-[#D1F2EB]"
              />
              <select
                value={ownerHistory}
                onChange={(e) =>
                  setOwnerHistory(
                    e.target.value as "first_owner" | "second_owner" | "third_plus" | "",
                  )
                }
                className="rounded-xl border border-[#E5E7EB] bg-white px-4 py-3 text-sm text-[#1A1A1A] outline-none transition focus:border-brand focus:ring-2 focus:ring-[#D1F2EB]"
              >
                <option value="">First or second car?</option>
                <option value="first_owner">First owner</option>
                <option value="second_owner">Second owner</option>
                <option value="third_plus">Third+ owner</option>
              </select>
              <input
                type="number"
                min={1}
                max={10}
                value={seatCount}
                onChange={(e) => setSeatCount(e.target.value)}
                placeholder="How many seats?"
                className="rounded-xl border border-[#E5E7EB] bg-white px-4 py-3 text-sm text-[#1A1A1A] placeholder-[#6B7280] outline-none transition focus:border-brand focus:ring-2 focus:ring-[#D1F2EB]"
              />
            </div>
            <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto]">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email address"
                className="rounded-xl border border-[#E5E7EB] bg-white px-4 py-3 text-sm text-[#1A1A1A] placeholder-[#6B7280] outline-none transition focus:border-brand focus:ring-2 focus:ring-[#D1F2EB]"
              />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Phone number"
                className="rounded-xl border border-[#E5E7EB] bg-white px-4 py-3 text-sm text-[#1A1A1A] placeholder-[#6B7280] outline-none transition focus:border-brand focus:ring-2 focus:ring-[#D1F2EB]"
              />
              <button
                type="submit"
                disabled={submitting}
                className="flex items-center justify-center gap-2 rounded-xl bg-brand px-5 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-brand-hover disabled:opacity-60 md:min-w-[190px]"
              >
                {submitting ? "Sending..." : "Get Valuation"}
                {!submitting && <ArrowRight className="h-4 w-4" />}
              </button>
            </div>
            {sellError && <p className="text-xs text-red-500">{sellError}</p>}
          </form>
        )}
      </div>
    </div>
  );
}
