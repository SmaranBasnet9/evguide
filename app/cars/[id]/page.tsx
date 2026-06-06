import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Battery, Gauge, Zap, Home, Shield, Leaf, RefreshCw, Clock } from "lucide-react";
import PremiumNavbar from "@/components/home/PremiumNavbar";
import PremiumFooter from "@/components/home/PremiumFooter";
import EVIntelligenceBadges from "@/components/vehicles/EVIntelligenceBadges";
import RangeConfidenceChecker from "@/components/vehicles/RangeConfidenceChecker";
import TCOCalculator from "@/components/vehicles/TCOCalculator";
import HomeChargerCTA from "@/components/vehicles/HomeChargerCTA";
import EnergyTariffWidget from "@/components/vehicles/EnergyTariffWidget";
import VehicleQuoteButton from "@/components/vehicles/VehicleQuoteButton";
import TestDriveButton from "@/components/vehicles/TestDriveButton";
import InsuranceWidget from "@/components/vehicles/InsuranceWidget";
import { getEVById, getAllEVs } from "@/lib/evs";
import { evModels } from "@/data/evModels";

export const revalidate = 3600;

export async function generateStaticParams() {
  const evs = await getAllEVs().catch(() => evModels);
  return (evs.length > 0 ? evs : evModels).map((ev) => ({ id: ev.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const vehicle = await getEVById(id);
  if (!vehicle) return { title: "EV not found | EVGuide" };
  const realRange = vehicle.realWorldRangeMiles ?? Math.round(vehicle.rangeKm * 0.621371 * 0.82);
  return {
    title: `${vehicle.brand} ${vehicle.model} — Real range, cost & charging | EVGuide`,
    description: `${vehicle.brand} ${vehicle.model}: ${realRange} mi real-world range, ${vehicle.batteryKWh} kWh. True cost vs petrol, charging speed, and commute fit check for UK buyers.`,
  };
}

function formatGBP(n: number) {
  return new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP", maximumFractionDigits: 0 }).format(n);
}

function specRows(v: NonNullable<Awaited<ReturnType<typeof getEVById>>>) {
  return [
    { label: "Battery capacity",      value: `${v.batteryKWh} kWh` },
    { label: "Official range (WLTP)", value: `${Math.round(v.rangeKm * 0.621371)} mi` },
    { label: "Real-world range",      value: `${v.realWorldRangeMiles ?? Math.round(v.rangeKm * 0.621371 * 0.82)} mi` },
    { label: "Motor output",          value: `${v.motorCapacityKw} kW` },
    { label: "Torque",                value: `${v.torqueNm} Nm` },
    { label: "0–60 mph",              value: v.acceleration },
    { label: "Top speed",             value: `${v.topSpeedKph} km/h` },
    { label: "Drive",                 value: v.drive },
    { label: "Charge port",           value: v.chargePortType ?? v.chargingStandard },
    { label: "DC rapid charge",       value: v.chargingSpeedDcKw ? `${v.chargingSpeedDcKw} kW` : v.fastChargeTime },
    { label: "AC home charge",        value: v.chargingSpeedAcKw ? `${v.chargingSpeedAcKw} kW` : null },
    { label: "10→80% time",           value: v.chargeTimeTo80Mins ? `${v.chargeTimeTo80Mins} min` : null },
    { label: "Seats",                 value: String(v.seats) },
    { label: "Boot space",            value: `${v.bootLitres} L` },
    { label: "Ground clearance",      value: `${v.groundClearanceMm} mm` },
    { label: "Battery warranty",      value: v.batteryWarrantyYears ? `${v.batteryWarrantyYears} years` : v.warranty },
    { label: "V2G capable",           value: v.v2gCapable ? "Yes — export power to your home" : "No" },
    { label: "ADAS",                  value: v.adas },
    { label: "Tyre size",             value: v.tyreSize },
  ].filter((r): r is { label: string; value: string } => !!r.value);
}

export default async function VehicleDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const vehicle = await getEVById(id);
  if (!vehicle) notFound();

  const realRange = vehicle.realWorldRangeMiles ?? Math.round(vehicle.rangeKm * 0.621371 * 0.82);
  const principal = vehicle.price * 0.9;
  const monthlyRate = 0.099 / 12;
  const n = 48;
  const estimatedMonthly = Math.round(
    (principal * monthlyRate * Math.pow(1 + monthlyRate, n)) /
      (Math.pow(1 + monthlyRate, n) - 1),
  );

  const rows = specRows(vehicle);

  return (
    <main className="min-h-screen bg-white text-black">
      <PremiumNavbar />

      <div className="mx-auto max-w-6xl space-y-10 px-4 pb-20 pt-24">

        {/* Back */}
        <Link
          href="/vehicles"
          className="inline-flex items-center gap-1.5 text-sm text-black transition-colors hover:text-brand"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          All EVs
        </Link>

        {/* Hero grid */}
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Image */}
          <div className="relative aspect-[16/10] overflow-hidden rounded-2xl border border-gray-200 bg-white">
            <Image
              src={vehicle.heroImage || "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?q=80&w=1200&auto=format&fit=crop"}
              alt={`${vehicle.brand} ${vehicle.model}`}
              fill
              className="object-contain p-4"
              priority
            />
            {vehicle.badge && (
              <div className="absolute left-4 top-4">
                <span className="rounded-full border border-brand/30 bg-brand/15 px-3 py-1 text-xs font-semibold text-brand backdrop-blur-md">
                  {vehicle.badge}
                </span>
              </div>
            )}
            {vehicle.v2gCapable && (
              <div className="absolute right-4 top-4">
                <span className="inline-flex items-center gap-1 rounded-full border border-teal-200 bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-700 backdrop-blur-md">
                  <RefreshCw className="h-3 w-3" /> V2G
                </span>
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex flex-col gap-5">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-black">{vehicle.brand}</p>
              <h1 className="mt-1 text-3xl font-bold tracking-tight text-black">{vehicle.brand} {vehicle.model}</h1>
              {vehicle.variant && <p className="mt-1 text-sm text-black">{vehicle.variant}</p>}

              <div className="mt-4 flex items-baseline gap-3">
                <span className="text-3xl font-bold text-brand">{formatGBP(vehicle.price)}</span>
                <span className="text-sm text-black">Est. {formatGBP(estimatedMonthly)}/mo PCP</span>
              </div>
            </div>

            {/* Key stats */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { icon: Battery, label: "Real range",   value: `${realRange} mi`,             sub: "UK conditions" },
                { icon: Zap,     label: "Rapid charge", value: vehicle.chargingSpeedDcKw ? `${vehicle.chargingSpeedDcKw} kW` : vehicle.fastChargeTime, sub: vehicle.chargeTimeTo80Mins ? `${vehicle.chargeTimeTo80Mins}min 10→80%` : "DC rapid" },
                { icon: Gauge,   label: "0–60 mph",     value: vehicle.acceleration,          sub: `${vehicle.motorCapacityKw} kW` },
              ].map(({ icon: Icon, label, value, sub }) => (
                <div key={label} className="rounded-2xl border border-gray-200 bg-gray-50 p-3 text-center">
                  <Icon className="mx-auto mb-1.5 h-4 w-4 text-brand" />
                  <p className="text-sm font-semibold text-black">{value}</p>
                  <p className="mt-0.5 text-[10px] uppercase tracking-wider text-black">{label}</p>
                  <p className="text-[10px] text-black">{sub}</p>
                </div>
              ))}
            </div>

            <p className="text-sm leading-relaxed text-black">{vehicle.description}</p>
            {vehicle.bestFor && (
              <p className="text-xs text-black">
                <span className="font-semibold text-black">Best for:</span> {vehicle.bestFor}
              </p>
            )}

            {/* CTAs */}
            <div className="flex flex-col gap-2.5 pt-1">
              <VehicleQuoteButton vehicle={{ id: vehicle.id, brand: vehicle.brand, model: vehicle.model, price: vehicle.price }} />
              <TestDriveButton vehicleId={vehicle.id} />
              <div className="flex gap-2.5">
                <Link
                  href={`/compare?carA=${vehicle.id}`}
                  className="flex flex-1 items-center justify-center rounded-xl border border-gray-200 bg-gray-50 py-2.5 text-sm font-medium text-black transition hover:border-brand/30 hover:text-brand"
                >
                  Compare
                </Link>
                <Link
                  href="/consultation"
                  className="flex flex-1 items-center justify-center rounded-xl border border-gray-200 bg-gray-50 py-2.5 text-sm font-medium text-black transition hover:border-gray-300 hover:text-brand"
                >
                  AI Match
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* EV Intelligence */}
        <div>
          <div className="mb-4 flex items-center gap-3">
            <div className="h-px flex-1 bg-gray-200" />
            <p className="shrink-0 text-[10px] font-semibold uppercase tracking-widest text-black">
              EV data AutoTrader &amp; Carwow don&apos;t show
            </p>
            <div className="h-px flex-1 bg-gray-200" />
          </div>
          <EVIntelligenceBadges vehicle={vehicle} variant="detail" />
        </div>

        {/* Interactive tools */}
        <div>
          <h2 className="mb-1 text-xs font-semibold uppercase tracking-[0.3em] text-brand">Will it work for you?</h2>
          <p className="mb-5 text-2xl font-bold text-black">Commute fit &amp; cost check</p>
          <div className="grid gap-5 lg:grid-cols-2">
            <RangeConfidenceChecker rangeKm={vehicle.rangeKm} vehicleLabel={`${vehicle.brand} ${vehicle.model}`} />
            <TCOCalculator vehiclePrice={vehicle.price} batteryKWh={vehicle.batteryKWh} rangeKm={vehicle.rangeKm} />
          </div>
        </div>

        {/* Energy tariff */}
        <EnergyTariffWidget batteryKWh={vehicle.batteryKWh} rangeKm={vehicle.rangeKm} />

        {/* Home charger */}
        <HomeChargerCTA vehicleLabel={`${vehicle.brand} ${vehicle.model}`} />

        {/* Insurance */}
        <InsuranceWidget vehicleId={vehicle.id} vehicleLabel={`${vehicle.brand} ${vehicle.model}`} />

        {/* Full specs */}
        <div>
          <h2 className="mb-1 text-xs font-semibold uppercase tracking-[0.3em] text-brand">Specifications</h2>
          <p className="mb-5 text-2xl font-bold text-black">Full technical details</p>

          <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
            {rows.map((row, i) => (
              <div
                key={row.label}
                className={`flex items-center justify-between px-5 py-3.5 text-sm ${i % 2 === 0 ? "bg-gray-50" : "bg-white"} ${i < rows.length - 1 ? "border-b border-gray-100" : ""}`}
              >
                <span className="text-black">{row.label}</span>
                <span className="text-right font-medium text-black">{row.value}</span>
              </div>
            ))}
          </div>

          {/* Trust badges */}
          <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { icon: Shield, label: "Battery warranty", value: vehicle.batteryWarrantyYears ? `${vehicle.batteryWarrantyYears} yr guarantee` : vehicle.warranty },
              { icon: Leaf,   label: "CO₂ saving",       value: vehicle.co2SavingKgPerYear ? `${vehicle.co2SavingKgPerYear} kg/yr` : "Zero tailpipe" },
              { icon: Home,   label: "Home charging",    value: vehicle.chargingSpeedAcKw ? `${vehicle.chargingSpeedAcKw} kW wallbox` : "Compatible" },
              { icon: Clock,  label: "10→80% rapid",     value: vehicle.chargeTimeTo80Mins ? `${vehicle.chargeTimeTo80Mins} minutes` : "See specs" },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
                <Icon className="mb-2 h-4 w-4 text-brand" />
                <p className="text-[10px] uppercase tracking-wider text-black">{label}</p>
                <p className="mt-1 text-sm font-semibold text-black">{value}</p>
              </div>
            ))}
          </div>
        </div>

      </div>

      <PremiumFooter />
    </main>
  );
}
