"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

const EMPTY = {
  title: "",
  excerpt: "",
  content: "",
  cover_image: "",
  category: "",
  meta_title: "",
  meta_description: "",
  keywords: "",
  geo_location: "UK",
  author: "EVGuide AI Editorial",
  published: false,
};

type FormShape = typeof EMPTY;

interface Props {
  mode?: "create" | "edit";
  id?: string;
  initialData?: Partial<Omit<FormShape, "published"> & { published: boolean }>;
}

function Field({
  label,
  name,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-slate-700">{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm focus:border-blue-500 focus:outline-none"
      />
    </div>
  );
}

export default function AdminBlogForm({ mode = "create", id, initialData }: Props) {
  const router = useRouter();

  const [formData, setFormData] = useState<FormShape>({
    ...EMPTY,
    ...(initialData ?? {}),
  });
  const [loading, setLoading] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error">("success");

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const target = e.target as HTMLInputElement;
    const value = target.type === "checkbox" ? target.checked : target.value;
    setFormData((prev) => ({ ...prev, [target.name]: value }));
  }

  async function handleCoverUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingCover(true);
    setMessage("");
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/uploads", { method: "POST", body: fd });
      const result = await res.json();
      if (!res.ok) {
        setMessage(result.error ?? "Image upload failed.");
        setMessageType("error");
        return;
      }
      setFormData((prev) => ({ ...prev, cover_image: result.url }));
      setMessage("Cover image uploaded.");
      setMessageType("success");
    } catch {
      setMessage("Something went wrong uploading the image.");
      setMessageType("error");
    } finally {
      setUploadingCover(false);
      e.target.value = "";
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const url = mode === "edit" ? `/api/admin/blog/${id}` : "/api/admin/blog";
    const method = mode === "edit" ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: formData.title,
        excerpt: formData.excerpt,
        content: formData.content,
        cover_image: formData.cover_image,
        category: formData.category,
        meta_title: formData.meta_title,
        meta_description: formData.meta_description,
        keywords: formData.keywords,
        geo_location: formData.geo_location,
        author: formData.author,
        published: formData.published,
      }),
    });

    const result = await res.json();
    setLoading(false);

    if (!res.ok) {
      setMessage(result.error ?? "Failed to save post.");
      setMessageType("error");
      return;
    }

    setMessage(
      result.warning ??
        (mode === "edit" ? "Post updated successfully." : "Post created successfully."),
    );
    setMessageType(result.warning ? "error" : "success");

    if (mode === "create") {
      setFormData(EMPTY);
      router.push("/admin/blog");
    } else {
      router.refresh();
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="mb-5 text-base font-semibold text-slate-900">Post Details</h2>
        <div className="space-y-4">
          <Field label="Title *" name="title" value={formData.title} onChange={handleChange} placeholder="Why EVs are the future of driving" />
          <Field label="Category" name="category" value={formData.category} onChange={handleChange} placeholder="EV Insights, Finance, Charging..." />
          <Field label="Author" name="author" value={formData.author} onChange={handleChange} placeholder="EVGuide AI Editorial" />
          <Field label="Geo Location" name="geo_location" value={formData.geo_location} onChange={handleChange} placeholder="UK, London, Manchester..." />
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">Cover Image</label>
            <input
              type="file"
              accept="image/png,image/jpeg,image/webp"
              onChange={handleCoverUpload}
              disabled={uploadingCover}
              className="w-full text-sm text-slate-600 file:mr-4 file:rounded-xl file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:font-semibold file:text-blue-700 hover:file:bg-blue-100 disabled:opacity-60"
            />
            <p className="mt-1 text-xs text-slate-500">
              {uploadingCover ? "Uploading..." : "PNG / JPG / WEBP, max 5 MB"}
            </p>
            {formData.cover_image && (
              <div className="mt-3">
                <Image
                  src={formData.cover_image}
                  alt="Cover preview"
                  width={1200}
                  height={384}
                  unoptimized
                  className="h-32 w-full rounded-xl border border-slate-200 object-cover"
                />
                <input
                  type="text"
                  name="cover_image"
                  value={formData.cover_image}
                  onChange={handleChange}
                  placeholder="Or paste an image URL"
                  className="mt-2 w-full rounded-2xl border border-slate-300 px-4 py-2 text-xs focus:border-blue-500 focus:outline-none"
                />
              </div>
            )}
            {!formData.cover_image && (
              <input
                type="text"
                name="cover_image"
                value={formData.cover_image}
                onChange={handleChange}
                placeholder="Or paste an image URL"
                className="mt-2 w-full rounded-2xl border border-slate-300 px-4 py-2 text-xs focus:border-blue-500 focus:outline-none"
              />
            )}
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">Short Excerpt</label>
            <textarea
              name="excerpt"
              value={formData.excerpt}
              onChange={handleChange}
              rows={2}
              placeholder="A brief summary shown on blog listing..."
              className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm focus:border-blue-500 focus:outline-none"
            />
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="mb-5 text-base font-semibold text-slate-900">SEO & Discovery</h2>
        <div className="space-y-4">
          <Field label="Meta Title" name="meta_title" value={formData.meta_title} onChange={handleChange} placeholder="Best EV under £20k in the UK" />
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">Meta Description</label>
            <textarea
              name="meta_description"
              value={formData.meta_description}
              onChange={handleChange}
              rows={3}
              placeholder="SEO description for Google and social previews..."
              className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm focus:border-blue-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">Keywords</label>
            <textarea
              name="keywords"
              value={formData.keywords}
              onChange={handleChange}
              rows={2}
              placeholder="best EV UK, EV finance UK, electric car buying guide"
              className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm focus:border-blue-500 focus:outline-none"
            />
            <p className="mt-1 text-xs text-slate-500">Separate keywords with commas.</p>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="mb-5 text-base font-semibold text-slate-900">Content *</h2>
        <textarea
          name="content"
          value={formData.content}
          onChange={handleChange}
          rows={20}
          placeholder="Write your full blog post here..."
          className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm focus:border-blue-500 focus:outline-none"
          required
        />
        <p className="mt-2 text-xs text-slate-500">
          {formData.content.length} characters
        </p>
      </section>

      <div className="flex flex-wrap items-center gap-5">
        <button
          type="submit"
          disabled={loading}
          className="rounded-2xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
        >
          {loading ? "Saving..." : mode === "edit" ? "Save Changes" : "Create Post"}
        </button>

        <label className="flex cursor-pointer items-center gap-2 text-sm font-medium text-slate-700">
          <input
            type="checkbox"
            name="published"
            checked={formData.published}
            onChange={handleChange}
            className="h-4 w-4 rounded"
          />
          Publish immediately
        </label>

        {mode === "edit" && (
          <button
            type="button"
            onClick={() => router.back()}
            className="rounded-2xl border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            Cancel
          </button>
        )}

        {message && (
          <p className={`text-sm font-medium ${messageType === "error" ? "text-red-600" : "text-emerald-600"}`}>
            {message}
          </p>
        )}
      </div>
    </form>
  );
}
