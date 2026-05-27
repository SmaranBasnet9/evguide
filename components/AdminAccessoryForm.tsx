"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Upload, X, Loader2 } from "lucide-react";

interface Category { id: string; name: string; slug: string; }

interface Props {
  mode: "new" | "edit";
  id?: string;
  categories: Category[];
  initialData?: {
    category_id:     string;
    name:            string;
    slug:            string;
    description:     string;
    brand:           string;
    price_gbp:       string;
    image_url:       string;
    affiliate_url:   string;
    badge:           string;
    rating:          string;
    review_count:    string;
    is_featured:     boolean;
    is_active:       boolean;
    compatible_with: string[];
    display_order:   string;
  };
}

const BADGES = ["", "Popular", "Hot", "New", "Trending"];
const COMPATIBLE = ["EV", "PHEV", "Hybrid"];

const EMPTY: NonNullable<Props["initialData"]> = {
  category_id: "", name: "", slug: "", description: "", brand: "",
  price_gbp: "", image_url: "", affiliate_url: "", badge: "",
  rating: "", review_count: "0", is_featured: false, is_active: true,
  compatible_with: [], display_order: "0",
};

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold uppercase tracking-wide text-white/50">{label}</label>
      {children}
    </div>
  );
}

const INPUT = "rounded-xl border border-white/10 bg-white/[0.05] px-3 py-2.5 text-sm text-white placeholder:text-white/25 focus:border-brand/50 focus:outline-none";

export default function AdminAccessoryForm({ mode, id, categories, initialData }: Props) {
  const router = useRouter();
  const [form, setForm] = useState(initialData ?? EMPTY);
  const [saving, setSaving] = useState(false);
  const [imgUploading, setImgUploading] = useState(false);
  const [imgDeleting, setImgDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  function set(key: string, val: unknown) {
    setForm((f) => ({ ...f, [key]: val }));
  }

  function handleNameChange(v: string) {
    set("name", v);
    if (mode === "new") set("slug", slugify(v));
  }

  function toggleCompat(tag: string) {
    set("compatible_with",
      form.compatible_with.includes(tag)
        ? form.compatible_with.filter((t) => t !== tag)
        : [...form.compatible_with, tag],
    );
  }

  async function handleImageUpload(file: File) {
    if (!id) return;
    setImgUploading(true);
    const fd = new FormData();
    fd.append("image", file);
    const res = await fetch(`/api/admin/accessories/${id}/image`, { method: "POST", body: fd });
    const json = await res.json();
    setImgUploading(false);
    if (res.ok) set("image_url", json.imageUrl);
    else setError(json.error);
  }

  async function handleImageDelete() {
    if (!id) return;
    setImgDeleting(true);
    const res = await fetch(`/api/admin/accessories/${id}/image`, { method: "DELETE" });
    setImgDeleting(false);
    if (res.ok) set("image_url", "");
    else setError("Failed to remove image");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const payload = {
      category_id:     form.category_id,
      name:            form.name,
      slug:            form.slug,
      description:     form.description,
      brand:           form.brand,
      price_gbp:       form.price_gbp ? Number(form.price_gbp) : null,
      image_url:       form.image_url || null,
      affiliate_url:   form.affiliate_url || null,
      badge:           form.badge || null,
      rating:          form.rating ? Number(form.rating) : null,
      review_count:    Number(form.review_count),
      is_featured:     form.is_featured,
      is_active:       form.is_active,
      compatible_with: form.compatible_with,
      display_order:   Number(form.display_order),
    };

    const res = await fetch(
      mode === "edit" ? `/api/admin/accessories/${id}` : "/api/admin/accessories",
      { method: mode === "edit" ? "PATCH" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) },
    );

    const json = await res.json();
    setSaving(false);

    if (!res.ok) { setError(json.error ?? "Failed to save"); return; }
    router.push("/admin/accessories");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}

      {/* Image */}
      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
        <p className="mb-4 text-sm font-semibold text-white">Product Image</p>
        <div className="flex items-start gap-4">
          {/* Preview */}
          <div className="relative flex h-32 w-32 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-white/[0.04]">
            {form.image_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={form.image_url} alt="Product" className="h-full w-full object-cover" />
            ) : (
              <span className="text-4xl opacity-30">📦</span>
            )}
            {imgUploading && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/60">
                <Loader2 className="h-6 w-6 animate-spin text-white" />
              </div>
            )}
          </div>

          {/* Controls */}
          <div className="flex flex-col gap-2">
            {mode === "edit" ? (
              <>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => { const f = e.target.files?.[0]; if (f) handleImageUpload(f); }}
                />
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  disabled={imgUploading}
                  className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.05] px-4 py-2 text-sm font-medium text-white hover:bg-white/10 disabled:opacity-50"
                >
                  <Upload className="h-4 w-4" />
                  {form.image_url ? "Replace image" : "Upload image"}
                </button>
                {form.image_url && (
                  <button
                    type="button"
                    onClick={handleImageDelete}
                    disabled={imgDeleting}
                    className="flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm font-medium text-red-400 hover:bg-red-500/20 disabled:opacity-50"
                  >
                    <X className="h-4 w-4" />
                    {imgDeleting ? "Removing…" : "Remove image"}
                  </button>
                )}
              </>
            ) : (
              <Field label="Image URL">
                <input
                  className={INPUT}
                  placeholder="https://… (upload after creating)"
                  value={form.image_url}
                  onChange={(e) => set("image_url", e.target.value)}
                />
              </Field>
            )}
            <p className="text-xs text-white/30">
              {mode === "new" ? "You can upload an image after creating the product." : "JPG, PNG or WebP. Max 5 MB."}
            </p>
          </div>
        </div>
      </div>

      {/* Core fields */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Category *">
          <select
            required
            className={INPUT + " cursor-pointer"}
            value={form.category_id}
            onChange={(e) => set("category_id", e.target.value)}
          >
            <option value="">Select category…</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </Field>

        <Field label="Brand">
          <input className={INPUT} placeholder="e.g. Rolec" value={form.brand} onChange={(e) => set("brand", e.target.value)} />
        </Field>

        <Field label="Product name *">
          <input required className={INPUT} placeholder="e.g. 7.5m Type 2 Cable" value={form.name} onChange={(e) => handleNameChange(e.target.value)} />
        </Field>

        <Field label="Slug *">
          <input required className={INPUT} placeholder="auto-generated" value={form.slug} onChange={(e) => set("slug", e.target.value)} />
        </Field>

        <Field label="Price (£)">
          <input type="number" min="0" step="0.01" className={INPUT} placeholder="39.99" value={form.price_gbp} onChange={(e) => set("price_gbp", e.target.value)} />
        </Field>

        <Field label="Badge">
          <select className={INPUT + " cursor-pointer"} value={form.badge} onChange={(e) => set("badge", e.target.value)}>
            {BADGES.map((b) => <option key={b} value={b}>{b || "None"}</option>)}
          </select>
        </Field>

        <Field label="Rating (0–5)">
          <input type="number" min="0" max="5" step="0.1" className={INPUT} placeholder="4.7" value={form.rating} onChange={(e) => set("rating", e.target.value)} />
        </Field>

        <Field label="Review count">
          <input type="number" min="0" className={INPUT} placeholder="0" value={form.review_count} onChange={(e) => set("review_count", e.target.value)} />
        </Field>

        <Field label="Display order">
          <input type="number" min="0" className={INPUT} value={form.display_order} onChange={(e) => set("display_order", e.target.value)} />
        </Field>

        <Field label="Affiliate URL">
          <input className={INPUT} placeholder="https://…" value={form.affiliate_url} onChange={(e) => set("affiliate_url", e.target.value)} />
        </Field>
      </div>

      <Field label="Description">
        <textarea rows={3} className={INPUT + " resize-none"} placeholder="Short product description…" value={form.description} onChange={(e) => set("description", e.target.value)} />
      </Field>

      {/* Compatible with */}
      <Field label="Compatible with">
        <div className="flex gap-2">
          {COMPATIBLE.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => toggleCompat(tag)}
              className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
                form.compatible_with.includes(tag)
                  ? "border-brand bg-brand/20 text-brand"
                  : "border-white/10 bg-white/[0.04] text-white/50 hover:border-white/25"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </Field>

      {/* Toggles */}
      <div className="flex gap-6">
        {[
          { key: "is_featured", label: "Featured" },
          { key: "is_active",   label: "Active / Visible" },
        ].map(({ key, label }) => (
          <label key={key} className="flex cursor-pointer items-center gap-2.5">
            <div
              onClick={() => set(key, !form[key as keyof typeof form])}
              className={`relative h-5 w-9 rounded-full transition ${form[key as keyof typeof form] ? "bg-brand" : "bg-white/10"}`}
            >
              <span className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-all ${form[key as keyof typeof form] ? "left-4" : "left-0.5"}`} />
            </div>
            <span className="text-sm text-white/70">{label}</span>
          </label>
        ))}
      </div>

      {/* Submit */}
      <div className="flex items-center gap-3 border-t border-white/[0.06] pt-5">
        <button
          type="submit"
          disabled={saving}
          className="flex items-center gap-2 rounded-xl bg-brand px-6 py-2.5 text-sm font-semibold text-white hover:bg-brand-hover disabled:opacity-50"
        >
          {saving && <Loader2 className="h-4 w-4 animate-spin" />}
          {mode === "edit" ? "Save changes" : "Create product"}
        </button>
        <a href="/admin/accessories" className="text-sm text-white/50 hover:text-white">
          Cancel
        </a>
      </div>
    </form>
  );
}
