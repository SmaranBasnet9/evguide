export const dynamic = "force-dynamic";

import Link from "next/link";
import { getAllSeoPages } from "@/lib/seo";
import AdminSeoDeleteButton from "../../../components/AdminSeoDeleteButton";

export default async function AdminSeoPage() {
  const pages = await getAllSeoPages();

  return (
    <div className="mx-auto max-w-5xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">SEO Management</h1>
          <p className="mt-1 text-gray-500">
            {pages.length} page{pages.length !== 1 ? "s" : ""} configured
          </p>
        </div>
        <Link
          href="/admin/seo/new"
          className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
        >
          + Add Page
        </Link>
      </div>

      <div className="mt-8">
        {pages.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 py-20 text-center">
            <p className="text-gray-500">No SEO pages configured yet.</p>
            <Link
              href="/admin/seo/new"
              className="mt-4 inline-block rounded-xl bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-700"
            >
              Add your first page
            </Link>
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50 text-left">
                  <th className="px-6 py-3 font-semibold text-gray-500">Slug</th>
                  <th className="px-6 py-3 font-semibold text-gray-500">Meta Title</th>
                  <th className="px-6 py-3 font-semibold text-gray-500">Meta Description</th>
                  <th className="px-6 py-3 font-semibold text-gray-500">Status</th>
                  <th className="px-6 py-3 font-semibold text-gray-500"></th>
                </tr>
              </thead>
              <tbody>
                {pages.map((page) => (
                  <tr
                    key={page.id}
                    className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50"
                  >
                    <td className="px-6 py-4">
                      <code className="rounded bg-gray-100 px-2 py-0.5 text-xs font-mono text-gray-700">
                        {page.page_slug}
                      </code>
                    </td>
                    <td className="max-w-xs truncate px-6 py-4 font-medium text-gray-900">
                      {page.meta_title ?? <span className="text-gray-400">-</span>}
                    </td>
                    <td className="max-w-xs truncate px-6 py-4 text-gray-600">
                      {page.meta_description
                        ? page.meta_description.slice(0, 80) + (page.meta_description.length > 80 ? "..." : "")
                        : <span className="text-gray-400">-</span>}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          page.is_active
                            ? "bg-green-50 text-green-700"
                            : "bg-gray-100 text-gray-500"
                        }`}
                      >
                        {page.is_active ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-3">
                        <Link
                          href={`/admin/seo/${page.id}`}
                          className="text-sm font-medium text-blue-600 hover:text-blue-800"
                        >
                          Edit
                        </Link>
                        <AdminSeoDeleteButton id={page.id} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="mt-6 rounded-2xl border border-blue-100 bg-blue-50 p-5">
        <h2 className="text-sm font-semibold text-blue-900">How it works</h2>
        <p className="mt-1 text-sm text-blue-700">
          SEO metadata is matched at render time by <code className="mx-1 rounded bg-blue-100 px-1 font-mono text-xs">page_slug</code>.
          Set a slug like <code className="mx-1 rounded bg-blue-100 px-1 font-mono text-xs">/vehicles</code> to override the
          default metadata for that route. Inactive pages fall back to site defaults.
        </p>
      </div>
    </div>
  );
}
