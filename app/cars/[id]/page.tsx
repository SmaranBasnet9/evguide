import React from "react";
import Link from "next/link";
import Image from "next/image";
import VehicleImagePlaceholder from "@/components/vehicles/VehicleImagePlaceholder";
import PremiumNavbar from "@/components/home/PremiumNavbar";
import PremiumFooter from "@/components/home/PremiumFooter";
import EVReviewsSection from "@/components/EVReviewsSection";
import ApprovedFeedbackStories from "@/components/ApprovedFeedbackStories";
import { getApprovedReviewsForCar, reviewToEVReview } from "@/lib/reviews";
import { mapDbEV, type DbEV } from "@/lib/ev-models";
import { getApprovedFeedbackStoriesForModel } from "@/lib/feedback";
import { createPublicServerClient } from "@/lib/supabase/public-server";
import TrackOnMount from "@/components/tracking/TrackOnMount";
import IntentAwareCarActions from "@/components/personalization/IntentAwareCarActions";
import VehicleLeadActions from "@/components/leads/VehicleLeadActions";
import ExchangeButton from "@/components/exchange/ExchangeButton";
import RangeConfidenceChecker from "@/components/vehicles/RangeConfidenceChecker";
import TCOCalculator from "@/components/vehicles/TCOCalculator";
import EVIntelligenceBadges from "@/components/vehicles/EVIntelligenceBadges";
import SaveVehicleButton from "@/components/vehicles/SaveVehicleButton";
import { calcCO2Saving, acChargingLabel, dcChargingLabel } from "@/lib/ev-intelligence";
import {
  Leaf,
  Zap,
  Home,
  ShieldCheck,
  Battery,
  Gauge,
  Timer,
  PoundSterling,
  Car,
  ArrowRight,
  TreePine,
} from "lucide-react";

export const revalidate = 3600; // ISR — revalidate cached page every hour

interface Props {
  params: Promise<{ id: string }>;
}

/** Resolves to `fallback` if `fn` takes longer than `ms` milliseconds. */
function withTimeout<T>(fn: () => Promise<T>, ms: number, fallback: T): Promise<T> {
  return Promise.race([fn(), new Promise<T>((resolve) => setTimeout(() => resolve(fallback), ms))]);
}

async function getAllVehicleIds(): Promise<string[]> {
  const supabase = createPublicServerClient();
  if (!supabase) return [];
  const { data } = await supabase.from("ev_models").select("id");
  return (data ?? []).map((row: { id: string }) => row.id).filter(Boolean);
}

export async function generateStaticParams() {
  const ids = await getAllVehicleIds();
  return ids.map((id) => ({ id }));
}

export default async function CarDetailsPage({ params }: Props) {
  const { id } = await params;

  const supabase = createPublicServerClient();
  const model = supabase
    ? await withTimeout(
        async () => {
          const { data } = await supabase.from("ev_models").select("*").eq("id", id).maybeSingle();
          return data ? mapDbEV(data as DbEV) : null;
        },
        6000,
        null
      )
    : null;

  if (!model) {
    return (
      <main className="min-h-screen bg-[#F8FAF9] text-[#1A1A1A]">
        <PremiumNavbar />
        <div className="mx-auto max-w-7xl px-6 py-32 text-center">
          <h1 className="text-4xl font-bold text-[#1A1A1A]">Vehicle not found</h1>
          <p className="mt-4 text-[#6B7280]">This vehicle is not available.</p>
          <Link
            href="/vehicles"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#1FBF9F] px-6 py-3 text-sm font-semibold text-white shadow-md hover:bg-[#17A589]"
          >
            Browse EVs <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <PremiumFooter />
      </main>
    );
  }

  const [approvedReviews, feedbackStories] = await withTimeout(
    () =>
      Promise.all([
        getApprovedReviewsForCar(id, model.brand, model.model, 6),
        getApprovedFeedbackStoriesForModel(model.brand, model.model, 6),
      ]),
    4000,
    [[], []] as [Awaited<ReturnType<typeof getApprovedReviewsForCar>>, Awaited<ReturnType<typeof getApprovedFeedbackStoriesForModel>>]
  );
  const reviews = approvedReviews.map(reviewToEVReview);

  const co2Saving = calcCO2Saving(model.batteryKWh, model.rangeKm);
  const realWorldMiles =
    model.realWorldRangeMiles ?? Math.round(model.rangeKm * 0.621371 * 0.82);
  const wltpMiles = model.rangeMiles ?? Math.round(model.rangeKm * 0.621371);

  return (
    <main className="min-h-screen bg-[#F8FAF9] text-[#1A1A1A]">
      <TrackOnMount
        eventType="car_view"
        carId={model.id}
        eventValue={{ brand: model.brand, model: model.model }}
      />
      <PremiumNavbar />

      {/* ── Hero ── */}
      <section className="pt-24 pb-0">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-8 pb-0">
          {/* Breadcrumb */}
          <nav className="mb-6 flex items-center gap-2 text-sm text-zinc-500">
            <Link href="/vehicles" className="hover:text-emerald-400 transition-colors">
              Vehicles
            </Link>
            <span>/</span>
            <span className="text-zinc-300">{model.brand}</span>
            <span>/</span>
            <span className="text-white">{model.model}</span>
          </nav>

          <div className="grid gap-8 lg:grid-cols-[1fr_420px] lg:items-start xl:grid-cols-[1fr_460px]">
            {/* Left — image */}
            <div className="relative overflow-hidden rounded-[2rem] border border-white/5 bg-zinc-900">
              <div className="relative aspect-[16/9] w-full">
                {model.heroImage ? (
                  <>
                    <Image
                      src={model.heroImage}
                      alt={`${model.brand} ${model.model}`}
                      fill
                      unoptimized
                      sizes="(min-width: 1024px) 60vw, 100vw"
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  </>
                ) : (
                  <VehicleImagePlaceholder brand={model.brand} model={model.model} className="absolute inset-0" />
                )}
              </div>

              {model.badge && (
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <span className="rounded-full border border-emerald-500/40 bg-emerald-500/20 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-emerald-300 backdrop-blur-md">
                    {model.badge}
                  </span>
                </div>
              )}
            </div>

            {/* Right — details card */}
            <div className="flex flex-col gap-5 rounded-[2rem] border border-[#E5E7EB] bg-white p-6 lg:p-7">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.28em] text-emerald-400">
                  {model.brand}
                </p>
                <div className="mt-2 flex items-start justify-between gap-3">
                  <h1 className="text-3xl font-extrabold leading-tight tracking-tight text-white">
                    {model.model}
                  </h1>
                  <SaveVehicleButton
                    vehicleId={model.id}
                    vehicleLabel={`${model.brand} ${model.model}`}
                    vehiclePrice={model.price}
                    variant="icon"
                  />
                </div>
                <p className="mt-3 text-4xl font-black text-white">
                  £{model.price.toLocaleString()}
                </p>
                <p className="mt-1 text-sm text-zinc-500">OTR price guide · Finance available</p>
              </div>

              <p className="text-sm leading-7 text-zinc-400">{model.description}</p>

              {/* Quick stats row */}
              <div className="grid grid-cols-3 gap-2">
                <QuickStat
                  icon={<Battery className="h-4 w-4 text-emerald-400" />}
                  value={`${realWorldMiles} mi`}
                  label="Real range"
                  sub="est. real-world"
                />
                <QuickStat
                  icon={<Zap className="h-4 w-4 text-cyan-400" />}
                  value={
                    model.chargingSpeedDcKw
                      ? `${model.chargingSpeedDcKw} kW`
                      : model.fastChargeTime
                  }
                  label="DC fast charge"
                  sub={
                    model.chargeTimeTo80Mins
                      ? `${model.chargeTimeTo80Mins} min`
                      : undefined
                  }
                />
                <QuickStat
                  icon={<PoundSterling className="h-4 w-4 text-violet-400" />}
                  value={
                    model.annualEnergyCostGbp
                      ? `£${Math.round(model.annualEnergyCostGbp)}`
                      : "~£600"
                  }
                  label="Annual energy"
                  sub="7,500 mi/yr"
                />
              </div>

              {/* EV intelligence badges */}
              <EVIntelligenceBadges vehicle={model} variant="card" />

              {/* Actions */}
              <div className="border-t border-white/5 pt-5 space-y-3">
                <IntentAwareCarActions
                  carId={model.id}
                  carPrice={model.price}
                  brand={model.brand}
                  model={model.model}
                />
                <ExchangeButton
                  vehicle={{
                    id:        model.id,
                    brand:     model.brand,
                    model:     model.model,
                    price:     model.price,
                    heroImage: model.heroImage,
                  }}
                  variant="default"
                  className="w-full"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── EV Intelligence ── */}
      <section className="mt-12 border-t border-white/5 bg-[#0D0D0D]">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-emerald-400">
            EV Intelligence
          </p>
          <h2 className="mt-2 text-3xl font-bold text-white">
            What the spec sheet doesn&apos;t tell you
          </h2>
          <p className="mt-2 text-sm text-zinc-500">
            Real-world data points to make a more confident buying decision.
          </p>

          <div className="mt-8 grid gap-4 lg:grid-cols-2">
            <RangeConfidenceChecker
              rangeKm={model.rangeKm}
              vehicleLabel={`${model.brand} ${model.model}`}
            />
            <TCOCalculator
              vehiclePrice={model.price}
              batteryKWh={model.batteryKWh}
              rangeKm={model.rangeKm}
            />
          </div>

          <div className="mt-6">
            <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-zinc-500">
              Charging &amp; Battery Intelligence
            </p>
            <EVIntelligenceBadges vehicle={model} variant="detail" />
          </div>

          {/* CO2 card */}
          <div className="mt-6 overflow-hidden rounded-[1.75rem] border border-emerald-500/20 bg-emerald-500/5 px-6 py-5">
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-emerald-500/15">
                <TreePine className="h-5 w-5 text-emerald-400" />
              </div>
              <div>
                <h3 className="font-semibold text-emerald-300">Environmental impact</h3>
                <p className="mt-1 text-sm leading-7 text-zinc-400">
                  Driving this EV instead of an average UK petrol car saves approximately{" "}
                  <strong className="text-emerald-400">
                    {co2Saving.toLocaleString()} kg of CO₂
                  </strong>{" "}
                  per year — equivalent to planting ~{Math.round(co2Saving / 21)} trees annually.
                </p>
                <p className="mt-1 text-xs text-zinc-600">
                  Based on 7,500 mi/yr vs 140g CO₂/km petrol average. UK grid: ~180g CO₂/kWh (2026).
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Key Specs Grid ── */}
      <section className="border-t border-[#E5E7EB] bg-[#F8FAF9]">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-zinc-500">At a glance</p>
          <h2 className="mt-2 text-3xl font-bold text-white">Key Specifications</h2>

          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <SpecCard
              icon={<Battery className="h-5 w-5 text-emerald-400" />}
              label="WLTP Range"
              value={`${wltpMiles} miles`}
              sub={`${model.rangeKm} km official`}
            />
            <SpecCard
              icon={<Zap className="h-5 w-5 text-cyan-400" />}
              label="Battery"
              value={`${model.batteryKWh} kWh`}
              sub="Usable capacity"
            />
            <SpecCard
              icon={<Gauge className="h-5 w-5 text-violet-400" />}
              label="Top Speed"
              value={`${model.topSpeedKph} km/h`}
            />
            <SpecCard
              icon={<Timer className="h-5 w-5 text-orange-400" />}
              label="0–100 km/h"
              value={model.acceleration}
            />
            <SpecCard
              icon={<Zap className="h-5 w-5 text-yellow-400" />}
              label="Motor Power"
              value={`${model.motorCapacityKw} kW`}
              sub={`${Math.round(model.motorCapacityKw * 1.341)} bhp`}
            />
            <SpecCard
              icon={<Gauge className="h-5 w-5 text-pink-400" />}
              label="Torque"
              value={`${model.torqueNm} Nm`}
            />
            <SpecCard
              icon={<Car className="h-5 w-5 text-blue-400" />}
              label="Seating"
              value={`${model.seats} seats`}
            />
            <SpecCard
              icon={<Car className="h-5 w-5 text-teal-400" />}
              label="Boot Space"
              value={`${model.bootLitres} L`}
            />
          </div>
        </div>
      </section>

      {/* ── Full Specs ── */}
      <section className="border-t border-white/5 bg-[#0D0D0D]">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-zinc-500">
            Deep dive
          </p>
          <h2 className="mt-2 text-3xl font-bold text-white">Full Specifications</h2>

          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            <SpecGroup title="Performance">
              <SpecRow
                label="Motor Power"
                value={`${model.motorCapacityKw} kW (${Math.round(model.motorCapacityKw * 1.341)} bhp)`}
              />
              <SpecRow label="Torque" value={`${model.torqueNm} Nm`} />
              <SpecRow label="0–100 km/h" value={model.acceleration} />
              <SpecRow label="Top Speed" value={`${model.topSpeedKph} km/h`} />
              <SpecRow label="Drive Type" value={model.drive} />
            </SpecGroup>

            <SpecGroup title="Battery & Charging">
              <SpecRow label="Battery Capacity" value={`${model.batteryKWh} kWh`} />
              <SpecRow
                label="WLTP Range"
                value={`${wltpMiles} miles (${model.rangeKm} km)`}
              />
              <SpecRow
                label="Real-World Range"
                value={`~${realWorldMiles} miles (est.)`}
                highlight
              />
              <SpecRow
                label="Charge Port"
                value={model.chargePortType ?? model.chargingStandard}
              />
              {model.chargingSpeedDcKw && (
                <SpecRow
                  label="DC Fast Charge"
                  value={`${model.chargingSpeedDcKw} kW — ${dcChargingLabel(model.chargingSpeedDcKw)}`}
                  highlight
                />
              )}
              {model.chargingSpeedAcKw && (
                <SpecRow
                  label="AC Home Charge"
                  value={`${model.chargingSpeedAcKw} kW — ${acChargingLabel(model.chargingSpeedAcKw)}`}
                />
              )}
              {model.chargeTimeTo80Mins && (
                <SpecRow
                  label="10→80% (DC rapid)"
                  value={`${model.chargeTimeTo80Mins} minutes`}
                  highlight
                />
              )}
              <SpecRow label="Fast Charge (stated)" value={model.fastChargeTime} />
              {model.v2gCapable !== undefined && (
                <SpecRow
                  label="Vehicle-to-Grid"
                  value={model.v2gCapable ? "Supported" : "Not supported"}
                />
              )}
            </SpecGroup>

            <SpecGroup title="Dimensions & Practicality">
              <SpecRow label="Seating" value={`${model.seats} seats`} />
              <SpecRow label="Boot Space" value={`${model.bootLitres} L`} />
              <SpecRow label="Ground Clearance" value={`${model.groundClearanceMm} mm`} />
              <SpecRow label="Tyre Size" value={model.tyreSize} />
            </SpecGroup>

            <SpecGroup title="Ownership">
              <SpecRow label="Warranty" value={model.warranty} />
              {model.batteryWarrantyYears && (
                <SpecRow
                  label="Battery Warranty"
                  value={`${model.batteryWarrantyYears} years`}
                  highlight
                />
              )}
              {model.annualEnergyCostGbp && (
                <SpecRow
                  label="Est. Annual Energy Cost"
                  value={`£${Math.round(model.annualEnergyCostGbp)} (7,500 mi, 28p/kWh)`}
                  highlight
                />
              )}
              <SpecRow label="Annual VED (Road Tax)" value="£0 (zero-emission exempt)" highlight />
              <SpecRow label="ADAS Features" value={model.adas} />
            </SpecGroup>
          </div>
        </div>
      </section>

      {/* ── Charging Guide ── */}
      <section className="border-t border-[#E5E7EB] bg-[#F8FAF9]">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-zinc-500">
            UK charging
          </p>
          <h2 className="mt-2 text-3xl font-bold text-white">Charging Guide</h2>
          <p className="mt-2 text-sm text-zinc-500">
            Compatible charging options for the {model.brand} {model.model} in the UK.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <ChargingCard
              icon={<Home className="h-5 w-5 text-blue-400" />}
              iconBg="bg-blue-500/10 border-blue-500/20"
              title="Home Charging"
              subtitle={`Wallbox (${model.chargingSpeedAcKw ?? 7} kW) overnight`}
              body={
                <>
                  Charge from flat overnight in{" "}
                  <strong className="text-white">
                    {model.chargingSpeedAcKw
                      ? `~${Math.round(model.batteryKWh / model.chargingSpeedAcKw)} hours`
                      : "~8–10 hours"}
                  </strong>
                  . OZEV grant available toward wallbox installation.
                </>
              }
            />
            <ChargingCard
              icon={<Zap className="h-5 w-5 text-emerald-400" />}
              iconBg="bg-emerald-500/10 border-emerald-500/20"
              title="Public AC (7–22 kW)"
              subtitle="Shopping centres, car parks"
              body="Add up to 100 miles per hour at public AC charge points across UK towns and retail locations."
            />
            <ChargingCard
              icon={<Zap className="h-5 w-5 text-yellow-400" />}
              iconBg="bg-yellow-500/10 border-yellow-500/20"
              title={`Rapid DC (${model.chargingSpeedDcKw ?? 50}+ kW)`}
              subtitle="Motorway services, rapid hubs"
              body={
                <>
                  {model.chargeTimeTo80Mins
                    ? `${model.chargeTimeTo80Mins} minutes to 80%. `
                    : "Quick top-up on longer journeys. "}
                  Available at motorway services and dedicated rapid charging hubs nationwide.
                </>
              }
            />
          </div>

          <p className="mt-5 text-xs text-zinc-600">
            Charge port: {model.chargePortType ?? model.chargingStandard}.
          </p>
        </div>
      </section>

      {/* ── Grants & Incentives ── */}
      <section className="border-t border-white/5 bg-[#0D0D0D]">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-zinc-500">
            Save money
          </p>
          <h2 className="mt-2 text-3xl font-bold text-white">UK EV Incentives &amp; Grants</h2>
          <p className="mt-2 text-sm text-zinc-500">
            Financial support available when buying or running this electric car.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <GrantCard
              icon={<Home className="h-5 w-5 text-blue-400" />}
              iconBg="bg-blue-500/10 border-blue-500/20"
              title="Home Charger Grant"
              amount="Up to £350"
              detail="OZEV Electric Vehicle Homecharge Scheme covers part of wallbox installation cost."
            />
            <GrantCard
              icon={<ShieldCheck className="h-5 w-5 text-emerald-400" />}
              iconBg="bg-emerald-500/10 border-emerald-500/20"
              title="Zero Road Tax"
              amount="£0/year"
              detail="Fully electric cars pay no Vehicle Excise Duty — saving up to £190–£600/yr vs petrol."
            />
            <GrantCard
              icon={<Zap className="h-5 w-5 text-violet-400" />}
              iconBg="bg-violet-500/10 border-violet-500/20"
              title="Salary Sacrifice (3% BiK)"
              amount="20–45% saving"
              detail="EV BiK rate is just 3% through 2028. Salary sacrifice can save 30–45% vs personal lease."
            />
            <GrantCard
              icon={<Leaf className="h-5 w-5 text-teal-400" />}
              iconBg="bg-teal-500/10 border-teal-500/20"
              title="Congestion Exempt"
              amount="£15/day saving"
              detail="Zero-emission vehicles are exempt from the London Congestion Charge and ULEZ charges."
            />
          </div>
        </div>
      </section>

      {/* ── Lead capture ── */}
      <section className="border-t border-[#E5E7EB] bg-[#F8FAF9]">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <VehicleLeadActions vehicle={model} />
        </div>
      </section>

      {/* ── Reviews ── */}
      {reviews.length > 0 && (
        <div id="reviews" className="border-t border-white/5">
          <EVReviewsSection modelName={`${model.brand} ${model.model}`} reviews={reviews} />
        </div>
      )}

      {feedbackStories.length > 0 && (
        <section className="border-t border-white/5 bg-[#0D0D0D]">
          <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
            <ApprovedFeedbackStories stories={feedbackStories} />
          </div>
        </section>
      )}

      {/* ── Final CTA ── */}
      <section className="border-t border-[#E5E7EB] bg-[#F8FAF9]">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="overflow-hidden rounded-[2.5rem] border border-white/5 bg-gradient-to-br from-emerald-500/10 via-zinc-900/60 to-cyan-500/8 p-10 text-center md:p-16">
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-emerald-400">
              Next step
            </p>
            <h2 className="mt-4 text-4xl font-extrabold text-white sm:text-5xl">
              Ready to go electric?
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-lg leading-8 text-zinc-400">
              Compare models, check monthly affordability, or find an even better EV match
              for your lifestyle.
            </p>
            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <Link
                href={`/finance?car=${model.id}`}
                className="rounded-full bg-emerald-500 px-8 py-4 text-base font-semibold text-black shadow-[0_0_28px_rgba(16,185,129,0.25)] transition hover:bg-emerald-400 hover:shadow-[0_0_38px_rgba(16,185,129,0.35)]"
              >
                Explore Financing
              </Link>
              <Link
                href={`/compare?carA=${model.id}`}
                className="rounded-full border border-white/10 bg-white/5 px-8 py-4 text-base font-semibold text-white transition hover:bg-white/10"
              >
                Compare Models
              </Link>
              <Link
                href="/ai-match"
                className="rounded-full border border-white/10 bg-white/5 px-8 py-4 text-base font-semibold text-white transition hover:bg-white/10"
              >
                Find my ideal EV
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Sticky CTA bar ── */}
      <div className="sticky bottom-0 z-40 border-t border-[#E5E7EB] bg-[#F8FAF9]/90 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4">
            <div className="hidden sm:block">
              <p className="text-sm font-bold text-white">
                {model.brand} {model.model}
              </p>
              <p className="text-xs text-zinc-500">From £{model.price.toLocaleString()}</p>
            </div>
            <div className="flex w-full items-center gap-3 sm:w-auto">
              <Link
                href={`/finance?car=${model.id}`}
                className="flex-1 rounded-xl border border-white/10 bg-white/5 px-5 py-2.5 text-center text-sm font-semibold text-white transition hover:bg-white/10 sm:flex-none"
              >
                Finance calculator
              </Link>
              <Link
                href={`/compare?carA=${model.id}`}
                className="flex-1 rounded-xl border border-white/10 bg-white/5 px-5 py-2.5 text-center text-sm font-semibold text-white transition hover:bg-white/10 sm:flex-none"
              >
                Compare
              </Link>
              {reviews.length > 0 && (
                <Link
                  href="#reviews"
                  className="flex-1 rounded-xl bg-emerald-500 px-5 py-2.5 text-center text-sm font-semibold text-black shadow-[0_0_16px_rgba(16,185,129,0.3)] transition hover:bg-emerald-400 sm:flex-none"
                >
                  See reviews
                </Link>
              )}
              <ExchangeButton
                vehicle={{
                  id:        model.id,
                  brand:     model.brand,
                  model:     model.model,
                  price:     model.price,
                  heroImage: model.heroImage,
                }}
                variant="compact"
              />
            </div>
          </div>
        </div>
      </div>

      <PremiumFooter />
    </main>
  );
}

// ── Sub-components ─────────────────────────────────────────────────────────────

function QuickStat({
  icon,
  value,
  label,
  sub,
}: {
  icon: React.ReactNode;
  value: string;
  label: string;
  sub?: string;
}) {
  return (
    <div className="flex flex-col items-center gap-1 rounded-xl border border-[#E5E7EB] bg-[#F8FAF9] p-3 text-center">
      {icon}
      <p className="mt-0.5 text-base font-bold text-white">{value}</p>
      <p className="text-[11px] font-medium text-zinc-400">{label}</p>
      {sub && <p className="text-[10px] text-zinc-600">{sub}</p>}
    </div>
  );
}

function SpecCard({
  icon,
  label,
  value,
  sub,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub?: string;
}) {
  return (
    <div className="rounded-[1.25rem] border border-[#E5E7EB] bg-white p-5">
      <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-white/5">
        {icon}
      </div>
      <p className="text-xs font-medium text-zinc-500">{label}</p>
      <p className="mt-1 text-xl font-bold text-white">{value}</p>
      {sub && <p className="mt-0.5 text-xs text-zinc-600">{sub}</p>}
    </div>
  );
}

function SpecGroup({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-[1.75rem] border border-[#E5E7EB] bg-white p-6">
      <h3 className="mb-4 border-b border-white/5 pb-3 text-base font-bold text-white">
        {title}
      </h3>
      <dl className="space-y-0">{children}</dl>
    </div>
  );
}

function SpecRow({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`flex justify-between border-b border-white/5 py-3 last:border-b-0 ${
        highlight ? "-mx-2 rounded-lg bg-emerald-500/5 px-2" : ""
      }`}
    >
      <dt className="text-sm font-medium text-zinc-500">{label}</dt>
      <dd
        className={`max-w-[55%] text-right text-sm font-semibold ${
          highlight ? "text-emerald-400" : "text-white"
        }`}
      >
        {value}
      </dd>
    </div>
  );
}

function ChargingCard({
  icon,
  iconBg,
  title,
  subtitle,
  body,
}: {
  icon: React.ReactNode;
  iconBg: string;
  title: string;
  subtitle: string;
  body: React.ReactNode;
}) {
  return (
    <div className="rounded-[1.75rem] border border-[#E5E7EB] bg-white p-5">
      <div
        className={`mb-4 flex h-10 w-10 items-center justify-center rounded-xl border ${iconBg}`}
      >
        {icon}
      </div>
      <h3 className="font-semibold text-white">{title}</h3>
      <p className="mt-0.5 text-xs text-zinc-600">{subtitle}</p>
      <p className="mt-3 text-sm leading-7 text-zinc-400">{body}</p>
    </div>
  );
}

function GrantCard({
  icon,
  iconBg,
  title,
  amount,
  detail,
}: {
  icon: React.ReactNode;
  iconBg: string;
  title: string;
  amount: string;
  detail: string;
}) {
  return (
    <div className="rounded-[1.75rem] border border-[#E5E7EB] bg-white p-5">
      <div
        className={`mb-4 flex h-10 w-10 items-center justify-center rounded-xl border ${iconBg}`}
      >
        {icon}
      </div>
      <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">{title}</p>
      <p className="mt-1 text-2xl font-black text-white">{amount}</p>
      <p className="mt-2 text-xs leading-6 text-zinc-500">{detail}</p>
    </div>
  );
}
