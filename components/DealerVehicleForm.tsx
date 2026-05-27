"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Upload, X, Check, Loader2 } from "lucide-react";

const inputCls =
  "w-full rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3 text-sm text-white placeholder:text-white/30 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20 transition";
const labelCls = "mb-2 block text-sm font-medium text-white/70";
const selectCls = inputCls + " cursor-pointer";

type DealerListingRow = {
  id: string;
  brand: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  colour?: string | null;
  description?: string | null;
  images?: string[];
  range_km?: number | null;
  battery_kwh?: number | null;
  drive?: string | null;
  body_type?: string | null;
  charging_standard?: string | null;
  seats?: number | null;
  location?: string | null;
  status: string;
  variant?: string | null;
  dc_charge_kw?: number | null;
  ac_charge_kw?: number | null;
  charge_to_80_mins?: number | null;
};

type Props = {
  mode: "create" | "edit";
  listing?: DealerListingRow;
};

type FormData = {
  vin: string;
  brand: string;
  model: string;
  year: string;
  variant: string;
  colour: string;
  body_type: string;
  seats: string;
  location: string;
  price: string;
  mileage: string;
  drive: string;
  battery_kwh: string;
  range_km: string;
  charging_standard: string;
  dc_charge_kw: string;
  ac_charge_kw: string;
  charge_to_80_mins: string;
  description: string;
};

const STEP_LABELS = [
  "Basic Details",
  "Pricing & Condition",
  "EV Specifications",
  "Photos & Description",
  "Review & Submit",
];

const BODY_TYPES = ["Saloon", "Hatchback", "SUV", "Estate", "Coupe", "MPV", "Van"];
const DRIVES = ["RWD", "FWD", "AWD"];

// ─── Step Indicator ────────────────────────────────────────────────────────────

function StepIndicator({ step }: { step: number }) {
  return (
    <div className="mb-8">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-sm font-medium text-white/70">
          Step {step} of 5 — <span className="text-white">{STEP_LABELS[step - 1]}</span>
        </p>
        <p className="text-xs text-white/40">{Math.round(((step - 1) / 4) * 100)}% complete</p>
      </div>

      {/* Progress bar */}
      <div className="mb-5 h-1 w-full overflow-hidden rounded-full bg-white/[0.08]">
        <div
          className="h-full rounded-full bg-brand transition-all duration-300"
          style={{ width: `${((step - 1) / 4) * 100}%` }}
        />
      </div>

      {/* Step circles */}
      <div className="flex items-center gap-0">
        {STEP_LABELS.map((label, i) => {
          const n = i + 1;
          const done = n < step;
          const active = n === step;
          return (
            <div key={n} className="flex flex-1 items-center">
              <div className="flex flex-col items-center gap-1">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition ${
                    done
                      ? "bg-brand text-white"
                      : active
                        ? "border-2 border-brand bg-brand/20 text-brand"
                        : "border border-white/20 bg-white/[0.04] text-white/30"
                  }`}
                >
                  {done ? <Check className="h-4 w-4" /> : n}
                </div>
                <span className={`hidden text-[10px] sm:block ${active ? "text-brand" : "text-white/30"}`}>
                  {label}
                </span>
              </div>
              {i < 4 && (
                <div
                  className={`mx-1 h-px flex-1 transition ${n < step ? "bg-brand" : "bg-white/[0.10]"}`}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Main Form ─────────────────────────────────────────────────────────────────

export default function DealerVehicleForm({ mode, listing }: Props) {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [stepError, setStepError] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);
  const [vinDecoding, setVinDecoding] = useState(false);
  const [vinStatus, setVinStatus] = useState<"idle" | "ok" | "error">("idle");
  const [vinError, setVinError] = useState("");
  const autosaveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const draftIdRef       = useRef<string | null>(listing?.id ?? null);
  const mountedRef       = useRef(false);

  useEffect(() => {
    mountedRef.current = true;
    return () => { mountedRef.current = false; };
  }, []);

  const [form, setForm] = useState<FormData>({
    vin:              "",
    brand:            listing?.brand             ?? "",
    model:            listing?.model             ?? "",
    year:             String(listing?.year       ?? new Date().getFullYear()),
    variant:          listing?.variant           ?? "",
    colour:           listing?.colour            ?? "",
    body_type:        listing?.body_type         ?? "",
    seats:            String(listing?.seats      ?? ""),
    location:         listing?.location          ?? "",
    price:            String(listing?.price      ?? ""),
    mileage:          String(listing?.mileage    ?? ""),
    drive:            listing?.drive             ?? "",
    battery_kwh:      String(listing?.battery_kwh    ?? ""),
    range_km:         String(listing?.range_km        ?? ""),
    charging_standard: listing?.charging_standard    ?? "",
    dc_charge_kw:     String(listing?.dc_charge_kw    ?? ""),
    ac_charge_kw:     String(listing?.ac_charge_kw    ?? ""),
    charge_to_80_mins: String(listing?.charge_to_80_mins ?? ""),
    description:      listing?.description       ?? "",
  });

  const [images, setImages] = useState<string[]>(listing?.images ?? []);

  const set =
    (key: keyof FormData) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm((p) => ({ ...p, [key]: e.target.value }));

  // ── Payload builder ─────────────────────────────────────────────────────────
  const buildPayload = useCallback(() => ({
    brand:             form.brand,
    model:             form.model,
    year:              Number(form.year),
    price:             Number(form.price),
    mileage:           Number(form.mileage),
    colour:            form.colour            || null,
    description:       form.description       || null,
    range_km:          form.range_km          ? Number(form.range_km)          : null,
    battery_kwh:       form.battery_kwh       ? Number(form.battery_kwh)       : null,
    drive:             form.drive             || null,
    body_type:         form.body_type         || null,
    charging_standard: form.charging_standard || null,
    seats:             form.seats             ? Number(form.seats)             : null,
    location:          form.location          || null,
    images,
    variant:           form.variant           || null,
    dc_charge_kw:      form.dc_charge_kw      ? Number(form.dc_charge_kw)      : null,
    ac_charge_kw:      form.ac_charge_kw      ? Number(form.ac_charge_kw)      : null,
    charge_to_80_mins: form.charge_to_80_mins ? Number(form.charge_to_80_mins) : null,
  }), [form, images]);

  // ── Autosave (create mode only, debounced 30s) ──────────────────────────────
  useEffect(() => {
    if (mode !== "create") return;
    if (!form.brand || !form.model) return;

    if (autosaveTimerRef.current) clearTimeout(autosaveTimerRef.current);
    autosaveTimerRef.current = setTimeout(async () => {
      if (!mountedRef.current) return;
      const payload = buildPayload();
      if (draftIdRef.current) {
        fetch(`/api/dealer/vehicles/${draftIdRef.current}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }).catch(() => {});
      } else {
        try {
          const res = await fetch("/api/dealer/vehicles", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...payload, status: "draft" }),
          });
          if (res.ok && mountedRef.current) {
            const data = await res.json();
            draftIdRef.current = data.id ?? null;
          }
        } catch {}
      }
    }, 30_000);

    return () => {
      if (autosaveTimerRef.current) clearTimeout(autosaveTimerRef.current);
    };
  }, [form, images, mode, buildPayload]);

  // ── VIN Decode ──────────────────────────────────────────────────────────────
  const decodeVin = async () => {
    const vin = form.vin.trim();
    if (!vin) return;
    setVinDecoding(true);
    setVinStatus("idle");
    setVinError("");
    try {
      const res = await fetch(`/api/vin-decode?vin=${encodeURIComponent(vin)}`);
      const data = await res.json();
      if (!mountedRef.current) return;
      if (!res.ok) {
        setVinStatus("error");
        setVinError(data.error ?? "VIN decode failed.");
      } else {
        setForm((p) => ({
          ...p,
          brand: data.brand ?? p.brand,
          year:  data.year  ? String(data.year) : p.year,
        }));
        setVinStatus("ok");
      }
    } catch {
      if (mountedRef.current) {
        setVinStatus("error");
        setVinError("Network error. Please try again.");
      }
    } finally {
      if (mountedRef.current) setVinDecoding(false);
    }
  };

  // ── Image upload ────────────────────────────────────────────────────────────
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (images.length >= 8) {
      setStepError("Maximum 8 images per listing.");
      return;
    }
    setUploadingImage(true);
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/dealer/uploads", { method: "POST", body: fd });
    const data = await res.json();
    if (!mountedRef.current) return;
    setUploadingImage(false);
    if (!res.ok) {
      setStepError(data.error ?? "Image upload failed.");
      return;
    }
    setImages((prev) => [...prev, data.url]);
    e.target.value = "";
  };

  const removeImage = (url: string) => setImages((prev) => prev.filter((u) => u !== url));

  // ── Step validation ─────────────────────────────────────────────────────────
  function validateStep(): string {
    if (step === 1) {
      if (!form.brand.trim()) return "Brand is required.";
      if (!form.model.trim()) return "Model is required.";
      const yr = Number(form.year);
      if (!form.year || isNaN(yr) || yr < 2011 || yr > 2027) return "Year must be between 2011 and 2027.";
    }
    if (step === 2) {
      const price = Number(form.price);
      const mileage = Number(form.mileage);
      if (!form.price || isNaN(price) || price < 0) return "A valid price is required.";
      if (!form.mileage || isNaN(mileage) || mileage < 0) return "A valid mileage is required.";
    }
    return "";
  }

  const next = () => {
    const err = validateStep();
    if (err) { setStepError(err); return; }
    setStepError("");
    setStep((s) => Math.min(s + 1, 5));
  };

  const back = () => {
    setStepError("");
    setStep((s) => Math.max(s - 1, 1));
  };

  // ── Submit ──────────────────────────────────────────────────────────────────
  const handleSubmit = async () => {
    setLoading(true);
    setStepError("");

    const payload = buildPayload();
    const url    = mode === "create" ? "/api/dealer/vehicles" : `/api/dealer/vehicles/${listing!.id}`;
    const method = mode === "create" ? "POST" : "PUT";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!mountedRef.current) return;
    setLoading(false);

    if (!res.ok) {
      setStepError(data.error ?? "Something went wrong.");
      return;
    }

    router.push("/dealer/vehicles");
    router.refresh();
  };

  const isLive = listing?.status === "live";

  // ── Render steps ────────────────────────────────────────────────────────────

  return (
    <div className="space-y-6">
      {isLive && (
        <div className="rounded-2xl border border-amber-500/20 bg-amber-500/10 px-5 py-4 text-sm text-amber-300">
          This listing is currently live. Saving changes will pause it for re-review before it goes live again.
        </div>
      )}

      <StepIndicator step={step} />

      {/* ── Step 1: Basic Details ── */}
      {step === 1 && (
        <div className="space-y-5">
          {/* VIN decode row */}
          <div>
            <label className={labelCls}>VIN <span className="text-white/40">(optional)</span></label>
            <div className="flex gap-3">
              <input
                type="text"
                value={form.vin}
                onChange={set("vin")}
                className={inputCls}
                placeholder="17-character VIN"
                maxLength={17}
              />
              <button
                type="button"
                onClick={decodeVin}
                disabled={vinDecoding || !form.vin.trim()}
                className="flex shrink-0 items-center gap-2 rounded-2xl border border-brand/30 bg-brand/10 px-4 py-3 text-sm font-semibold text-brand transition hover:bg-brand/20 disabled:opacity-50"
              >
                {vinDecoding ? <Loader2 className="h-4 w-4 animate-spin" /> : "Decode"}
              </button>
            </div>
            {vinStatus === "ok" && (
              <p className="mt-2 flex items-center gap-1.5 text-xs font-medium text-green-400">
                <Check className="h-3.5 w-3.5" /> VIN decoded — brand and year filled in
              </p>
            )}
            {vinStatus === "error" && (
              <p className="mt-2 text-xs text-red-400">{vinError}</p>
            )}
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className={labelCls}>Brand *</label>
              <input type="text" value={form.brand} onChange={set("brand")} className={inputCls} placeholder="Tesla" />
            </div>
            <div>
              <label className={labelCls}>Model *</label>
              <input type="text" value={form.model} onChange={set("model")} className={inputCls} placeholder="Model 3" />
            </div>
            <div>
              <label className={labelCls}>Year *</label>
              <input type="number" value={form.year} onChange={set("year")} min={2011} max={2027} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Variant <span className="text-white/40">(optional)</span></label>
              <input type="text" value={form.variant} onChange={set("variant")} className={inputCls} placeholder="Long Range AWD" />
            </div>
            <div>
              <label className={labelCls}>Colour <span className="text-white/40">(optional)</span></label>
              <input type="text" value={form.colour} onChange={set("colour")} className={inputCls} placeholder="Pearl White" />
            </div>
            <div>
              <label className={labelCls}>Body type <span className="text-white/40">(optional)</span></label>
              <select value={form.body_type} onChange={set("body_type")} className={selectCls}>
                <option value="">Select...</option>
                {BODY_TYPES.map((b) => <option key={b} value={b}>{b}</option>)}
              </select>
            </div>
            <div>
              <label className={labelCls}>Seats <span className="text-white/40">(optional)</span></label>
              <input type="number" value={form.seats} onChange={set("seats")} min={1} max={9} className={inputCls} placeholder="5" />
            </div>
            <div>
              <label className={labelCls}>Location <span className="text-white/40">(optional)</span></label>
              <input type="text" value={form.location} onChange={set("location")} className={inputCls} placeholder="London, SW1" />
            </div>
          </div>
        </div>
      )}

      {/* ── Step 2: Pricing & Condition ── */}
      {step === 2 && (
        <div className="space-y-5">
          <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] px-4 py-3 text-xs text-white/50">
            Live listings pending review will return to pending after edit.
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className={labelCls}>Price (£) *</label>
              <input type="number" value={form.price} onChange={set("price")} min={0} className={inputCls} placeholder="29995" />
            </div>
            <div>
              <label className={labelCls}>Mileage *</label>
              <input type="number" value={form.mileage} onChange={set("mileage")} min={0} className={inputCls} placeholder="15000" />
            </div>
            <div>
              <label className={labelCls}>Drive <span className="text-white/40">(optional)</span></label>
              <select value={form.drive} onChange={set("drive")} className={selectCls}>
                <option value="">Select...</option>
                {DRIVES.map((d) => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
          </div>
        </div>
      )}

      {/* ── Step 3: EV Specifications ── */}
      {step === 3 && (
        <div className="space-y-5">
          <p className="text-sm text-white/50">All fields on this step are optional.</p>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <label className={labelCls}>Battery (kWh)</label>
              <input type="number" value={form.battery_kwh} onChange={set("battery_kwh")} min={0} step={0.1} className={inputCls} placeholder="75.0" />
            </div>
            <div>
              <label className={labelCls}>Range (km)</label>
              <input type="number" value={form.range_km} onChange={set("range_km")} min={0} className={inputCls} placeholder="480" />
            </div>
            <div>
              <label className={labelCls}>Charging standard</label>
              <input type="text" value={form.charging_standard} onChange={set("charging_standard")} className={inputCls} placeholder="CCS, CHAdeMO, NACS" />
            </div>
            <div>
              <label className={labelCls}>DC charge rate (kW)</label>
              <input type="number" value={form.dc_charge_kw} onChange={set("dc_charge_kw")} min={0} step={0.1} className={inputCls} placeholder="150.0" />
            </div>
            <div>
              <label className={labelCls}>AC charge rate (kW)</label>
              <input type="number" value={form.ac_charge_kw} onChange={set("ac_charge_kw")} min={0} step={0.1} className={inputCls} placeholder="11.0" />
            </div>
            <div>
              <label className={labelCls}>Charge 0–80% (mins)</label>
              <input type="number" value={form.charge_to_80_mins} onChange={set("charge_to_80_mins")} min={0} className={inputCls} placeholder="30" />
            </div>
          </div>
        </div>
      )}

      {/* ── Step 4: Photos & Description ── */}
      {step === 4 && (
        <div className="space-y-6">
          {/* Image upload */}
          <div>
            <h2 className="mb-1 text-base font-semibold text-white">Photos</h2>
            <p className="mb-4 text-xs text-white/40">Upload up to 8 images. First image is the cover photo.</p>
            <div className="flex flex-wrap gap-3">
              {images.map((url) => (
                <div key={url} className="group relative h-24 w-32 overflow-hidden rounded-xl border border-white/10">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={url} alt="" className="h-full w-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeImage(url)}
                    className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-black/70 text-white opacity-0 transition group-hover:opacity-100"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
              {images.length < 8 && (
                <label className="flex h-24 w-32 cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-white/20 bg-white/[0.03] text-white/40 transition hover:border-brand/40 hover:text-brand">
                  {uploadingImage ? (
                    <span className="text-xs">Uploading...</span>
                  ) : (
                    <>
                      <Upload className="h-5 w-5" />
                      <span className="mt-1 text-xs">Add photo</span>
                    </>
                  )}
                  <input type="file" accept="image/*" className="sr-only" onChange={handleImageUpload} disabled={uploadingImage} />
                </label>
              )}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className={labelCls}>Description <span className="text-white/40">(optional)</span></label>
            <textarea
              value={form.description}
              onChange={set("description")}
              rows={4}
              className={inputCls + " resize-none"}
              placeholder="Key features, condition, service history, anything buyers should know..."
            />
          </div>
        </div>
      )}

      {/* ── Step 5: Review & Submit ── */}
      {step === 5 && (
        <div className="space-y-6">
          <h2 className="text-base font-semibold text-white">Review your listing</h2>

          {/* Summary grid */}
          <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5">
            <div className="grid gap-x-8 gap-y-3 sm:grid-cols-2">
              {(
                [
                  ["Brand",         form.brand],
                  ["Model",         form.model],
                  ["Year",          form.year],
                  ["Variant",       form.variant       || "—"],
                  ["Colour",        form.colour        || "—"],
                  ["Body type",     form.body_type     || "—"],
                  ["Seats",         form.seats         || "—"],
                  ["Location",      form.location      || "—"],
                  ["Price",         form.price  ? `£${Number(form.price).toLocaleString()}` : "—"],
                  ["Mileage",       form.mileage ? `${Number(form.mileage).toLocaleString()} mi` : "—"],
                  ["Drive",         form.drive         || "—"],
                  ["Battery",       form.battery_kwh   ? `${form.battery_kwh} kWh`  : "—"],
                  ["Range",         form.range_km      ? `${form.range_km} km`       : "—"],
                  ["Charging",      form.charging_standard || "—"],
                  ["DC rate",       form.dc_charge_kw  ? `${form.dc_charge_kw} kW`  : "—"],
                  ["AC rate",       form.ac_charge_kw  ? `${form.ac_charge_kw} kW`  : "—"],
                  ["0–80%",         form.charge_to_80_mins ? `${form.charge_to_80_mins} min` : "—"],
                  ["Photos",        `${images.length} image${images.length !== 1 ? "s" : ""}`],
                ] as [string, string][]
              ).map(([label, value]) => (
                <div key={label} className="flex gap-2">
                  <span className="min-w-[90px] shrink-0 text-xs text-white/40">{label}</span>
                  <span className="text-sm text-white">{value}</span>
                </div>
              ))}
            </div>

            {form.description && (
              <div className="mt-4 border-t border-white/[0.06] pt-4">
                <p className="mb-1 text-xs text-white/40">Description</p>
                <p className="text-sm leading-6 text-white/80">{form.description}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Error ── */}
      {stepError && (
        <p className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {stepError}
        </p>
      )}

      {/* ── Navigation ── */}
      <div className="flex items-center justify-between pt-2">
        <button
          type="button"
          onClick={step === 1 ? () => router.back() : back}
          className="rounded-2xl border border-white/10 bg-white/[0.04] px-6 py-3 text-sm font-semibold text-white/70 transition hover:bg-white/[0.08]"
        >
          {step === 1 ? "Cancel" : "← Back"}
        </button>

        {step < 5 ? (
          <button
            type="button"
            onClick={next}
            className="rounded-2xl bg-brand px-8 py-3 font-semibold text-white transition hover:bg-brand-hover disabled:opacity-60"
          >
            Next →
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading || uploadingImage}
            className="rounded-2xl bg-brand px-8 py-3 font-semibold text-white transition hover:bg-brand-hover disabled:opacity-60"
          >
            {loading ? "Saving..." : mode === "create" ? "Submit for Review" : "Save Changes"}
          </button>
        )}
      </div>
    </div>
  );
}
