"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Upload, X, Loader2, ArrowRight } from "lucide-react";

interface Props {
  initialData?: Record<string, unknown>;
  listingId?: string;
}

const inputCls = "w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20 transition";
const labelCls = "block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1.5";

const ENGINE_TYPES = ["BEV", "PHEV", "HEV", "MHEV", "ICE"];
const TRANSMISSIONS = ["Automatic", "Manual", "CVT", "Dual-Clutch"];
const DRIVETRAINS   = ["FWD", "RWD", "AWD", "4WD"];
const CONDITIONS    = ["new", "used"];

export default function VendorListingForm({ initialData, listingId }: Props) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [images, setImages] = useState<string[]>((initialData?.images as string[]) ?? []);
  const [uploadingImages, setUploadingImages] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    make:    String(initialData?.make   ?? ""),
    model:   String(initialData?.model  ?? ""),
    variant: String(initialData?.variant ?? ""),
    year:    String(initialData?.year   ?? new Date().getFullYear()),
    condition: String(initialData?.condition ?? "used"),
    mileage:   String(initialData?.mileage   ?? ""),
    price:     String(initialData?.price     ?? ""),
    registrationNumber: String(initialData?.registration_number ?? ""),
    vin:     String(initialData?.vin ?? ""),
    colour:  String(initialData?.colour ?? ""),
    engineType:   String(initialData?.engine_type   ?? ""),
    horsepower:   String(initialData?.horsepower    ?? ""),
    torqueNm:     String(initialData?.torque_nm     ?? ""),
    transmission: String(initialData?.transmission  ?? ""),
    drivetrain:   String(initialData?.drivetrain    ?? ""),
    batteryKwh:   String(initialData?.battery_kwh   ?? ""),
    chargingSpeedKw: String(initialData?.charging_speed_kw ?? ""),
    rangeKm:      String(initialData?.range_km      ?? ""),
    youtubeUrl:   String(initialData?.youtube_url   ?? ""),
    description:  String(initialData?.description   ?? ""),
    location:     String(initialData?.location      ?? ""),
  });

  function setField(k: keyof typeof form, v: string) {
    setForm((prev) => ({ ...prev, [k]: v }));
  }

  async function uploadImages(files: FileList) {
    setUploadingImages(true);
    const urls: string[] = [];
    for (const file of Array.from(files)) {
      const fd = new FormData();
      fd.append("file", file);
      try {
        const res = await fetch("/api/vendor/uploads", { method: "POST", body: fd });
        const data = await res.json();
        if (data.url) urls.push(data.url);
      } catch { /* skip failed file */ }
    }
    setImages((prev) => [...prev, ...urls]);
    setUploadingImages(false);
  }

  function buildPayload(submitForReview = false) {
    return {
      make:    form.make.trim(),
      model:   form.model.trim(),
      variant: form.variant.trim() || undefined,
      year:    parseInt(form.year) || undefined,
      condition: form.condition,
      mileage:   form.mileage   ? parseInt(form.mileage)   : undefined,
      price:     form.price     ? parseFloat(form.price)   : undefined,
      registrationNumber: form.registrationNumber.trim() || undefined,
      vin:      form.vin.trim()  || undefined,
      colour:   form.colour.trim() || undefined,
      engineType:   form.engineType   || undefined,
      horsepower:   form.horsepower   ? parseInt(form.horsepower)   : undefined,
      torqueNm:     form.torqueNm     ? parseInt(form.torqueNm)     : undefined,
      transmission: form.transmission || undefined,
      drivetrain:   form.drivetrain   || undefined,
      batteryKwh:   form.batteryKwh   ? parseFloat(form.batteryKwh) : undefined,
      chargingSpeedKw: form.chargingSpeedKw ? parseFloat(form.chargingSpeedKw) : undefined,
      rangeKm:  form.rangeKm  ? parseInt(form.rangeKm)  : undefined,
      youtubeUrl:  form.youtubeUrl.trim()  || undefined,
      description: form.description.trim() || undefined,
      location:    form.location.trim()    || undefined,
      images,
      submitForReview,
    };
  }

  async function save(submitForReview = false) {
    setError("");
    if (!form.make || !form.model || !form.year || !form.price) {
      setError("Make, model, year and price are required.");
      return;
    }
    if (submitForReview) setSubmitting(true);
    else setSaving(true);
    try {
      const url    = listingId ? `/api/vendor/listings/${listingId}` : "/api/vendor/listings";
      const method = listingId ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(buildPayload(submitForReview)),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? "Save failed."); return; }
      router.push("/vendor/listings");
    } catch { setError("Network error. Please try again."); }
    finally { setSaving(false); setSubmitting(false); }
  }

  return (
    <div className="space-y-8">
      {/* Basic Information */}
      <section className="rounded-2xl border border-gray-200 bg-white p-6 space-y-5 shadow-sm">
        <h2 className="font-bold text-gray-900">Basic Information</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Make *</label>
            <input value={form.make} onChange={(e) => setField("make", e.target.value)} placeholder="e.g. Tesla" className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Model *</label>
            <input value={form.model} onChange={(e) => setField("model", e.target.value)} placeholder="e.g. Model 3" className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Variant</label>
            <input value={form.variant} onChange={(e) => setField("variant", e.target.value)} placeholder="e.g. Long Range AWD" className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Year *</label>
            <input type="number" min="2000" max="2030" value={form.year} onChange={(e) => setField("year", e.target.value)} className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Condition *</label>
            <select value={form.condition} onChange={(e) => setField("condition", e.target.value)} className={inputCls}>
              {CONDITIONS.map((c) => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
            </select>
          </div>
          <div>
            <label className={labelCls}>Mileage</label>
            <input type="number" min="0" value={form.mileage} onChange={(e) => setField("mileage", e.target.value)} placeholder="e.g. 12500" className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Price (£) *</label>
            <input type="number" min="0" value={form.price} onChange={(e) => setField("price", e.target.value)} placeholder="e.g. 32995" className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Colour</label>
            <input value={form.colour} onChange={(e) => setField("colour", e.target.value)} placeholder="e.g. Midnight Blue" className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Registration Number</label>
            <input value={form.registrationNumber} onChange={(e) => setField("registrationNumber", e.target.value)} placeholder="e.g. AB21 XYZ" className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>VIN (optional)</label>
            <input value={form.vin} onChange={(e) => setField("vin", e.target.value)} placeholder="17-character VIN" className={inputCls} />
          </div>
          <div className="col-span-2">
            <label className={labelCls}>Location</label>
            <input value={form.location} onChange={(e) => setField("location", e.target.value)} placeholder="e.g. Manchester, Greater Manchester" className={inputCls} />
          </div>
        </div>
      </section>

      {/* Specifications */}
      <section className="rounded-2xl border border-gray-200 bg-white p-6 space-y-5 shadow-sm">
        <h2 className="font-bold text-gray-900">Specifications</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Engine / Drive Type</label>
            <select value={form.engineType} onChange={(e) => setField("engineType", e.target.value)} className={inputCls}>
              <option value="">Select…</option>
              {ENGINE_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label className={labelCls}>Transmission</label>
            <select value={form.transmission} onChange={(e) => setField("transmission", e.target.value)} className={inputCls}>
              <option value="">Select…</option>
              {TRANSMISSIONS.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label className={labelCls}>Drivetrain</label>
            <select value={form.drivetrain} onChange={(e) => setField("drivetrain", e.target.value)} className={inputCls}>
              <option value="">Select…</option>
              {DRIVETRAINS.map((d) => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
          <div>
            <label className={labelCls}>Horsepower (hp)</label>
            <input type="number" min="0" value={form.horsepower} onChange={(e) => setField("horsepower", e.target.value)} placeholder="e.g. 358" className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Torque (Nm)</label>
            <input type="number" min="0" value={form.torqueNm} onChange={(e) => setField("torqueNm", e.target.value)} placeholder="e.g. 493" className={inputCls} />
          </div>
        </div>

        <div className="border-t border-gray-100 pt-4">
          <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">EV / Battery</p>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className={labelCls}>Battery (kWh)</label>
              <input type="number" step="0.1" value={form.batteryKwh} onChange={(e) => setField("batteryKwh", e.target.value)} placeholder="e.g. 75" className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Max Charging (kW)</label>
              <input type="number" value={form.chargingSpeedKw} onChange={(e) => setField("chargingSpeedKw", e.target.value)} placeholder="e.g. 250" className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>WLTP Range (km)</label>
              <input type="number" value={form.rangeKm} onChange={(e) => setField("rangeKm", e.target.value)} placeholder="e.g. 580" className={inputCls} />
            </div>
          </div>
        </div>
      </section>

      {/* Media */}
      <section className="rounded-2xl border border-gray-200 bg-white p-6 space-y-5 shadow-sm">
        <h2 className="font-bold text-gray-900">Media</h2>

        {/* Image grid */}
        <div>
          <label className={labelCls}>Photos</label>
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-5">
            {images.map((url, idx) => (
              <div key={idx} className="relative rounded-xl overflow-hidden aspect-[4/3] bg-gray-100">
                <Image src={url} alt="" fill className="object-cover" />
                <button
                  type="button"
                  onClick={() => setImages((prev) => prev.filter((_, i) => i !== idx))}
                  className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-white transition hover:bg-red-500"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              disabled={uploadingImages}
              className="flex aspect-[4/3] flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-300 text-gray-400 transition hover:border-brand hover:text-brand disabled:opacity-50"
            >
              {uploadingImages ? <Loader2 className="h-5 w-5 animate-spin" /> : <><Upload className="h-5 w-5" /><span className="text-[10px] font-semibold">Add photos</span></>}
            </button>
          </div>
          <input
            type="file"
            ref={fileRef}
            multiple
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={(e) => { if (e.target.files?.length) uploadImages(e.target.files); e.target.value = ""; }}
          />
          <p className="mt-1.5 text-[10px] text-gray-400">JPEG, PNG or WebP · max 10 MB per file</p>
        </div>

        <div>
          <label className={labelCls}>YouTube Video URL</label>
          <input value={form.youtubeUrl} onChange={(e) => setField("youtubeUrl", e.target.value)} placeholder="https://youtu.be/…" className={inputCls} />
        </div>
      </section>

      {/* Description */}
      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <label className={labelCls}>Description</label>
        <textarea
          value={form.description}
          onChange={(e) => setField("description", e.target.value)}
          rows={5}
          placeholder="Describe the vehicle's condition, history, and any notable features…"
          className={inputCls + " resize-none"}
        />
      </section>

      {error && <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>}

      {/* Action buttons */}
      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => save(false)}
          disabled={saving || submitting}
          className="flex items-center gap-2 rounded-xl border border-gray-300 px-5 py-3 text-sm font-semibold text-gray-700 transition hover:border-gray-400 disabled:opacity-60"
        >
          {saving ? <><Loader2 className="h-4 w-4 animate-spin" /> Saving…</> : "Save as Draft"}
        </button>
        <button
          type="button"
          onClick={() => save(true)}
          disabled={saving || submitting}
          className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-brand py-3 text-sm font-bold text-white shadow-sm transition hover:bg-brand/90 disabled:opacity-60"
        >
          {submitting ? <><Loader2 className="h-4 w-4 animate-spin" /> Submitting…</> : <>Submit for Review <ArrowRight className="h-4 w-4" /></>}
        </button>
      </div>
    </div>
  );
}
