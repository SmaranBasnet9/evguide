import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/admin";
import AdminAccessoryDeleteButton from "@/components/AdminAccessoryDeleteButton";

async function getData() {
  const admin = createAdminClient();
  const [{ data: categories }, { data: products }] = await Promise.all([
    admin.from("accessory_categories").select("id, name, slug, display_order").eq("is_active", true).order("display_order"),
    admin.from("accessories").select("id, name, brand, price_gbp, badge, is_active, is_featured, image_url, category_id, display_order").order("category_id").order("display_order"),
  ]);
  return { categories: categories ?? [], products: products ?? [] };
}

export default async function AdminAccessoriesPage() {
  const { categories, products } = await getData();

  return (
    <div className="mx-auto max-w-6xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Accessories</h1>
          <p className="mt-1 text-gray-500">{products.length} product{products.length !== 1 ? "s" : ""} across {categories.length} categories</p>
        </div>
        <Link href="/admin/accessories/new" className="rounded-xl bg-brand px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-hover">
          + Add Product
        </Link>
      </div>

      <div className="mt-8 space-y-6">
        {categories.map((cat) => {
          const catProducts = products.filter((p) => p.category_id === cat.id);
          return (
            <div key={cat.id} className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
              <div className="flex items-center justify-between border-b border-gray-100 bg-gray-50 px-6 py-3">
                <p className="text-sm font-semibold text-gray-900">{cat.name}</p>
                <span className="text-xs text-gray-400">{catProducts.length} products</span>
              </div>

              {catProducts.length === 0 ? (
                <p className="px-6 py-4 text-sm text-gray-400">No products yet.</p>
              ) : (
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left">
                      <th className="px-6 py-2 text-xs font-semibold text-gray-500">Image</th>
                      <th className="px-6 py-2 text-xs font-semibold text-gray-500">Name</th>
                      <th className="px-6 py-2 text-xs font-semibold text-gray-500">Brand</th>
                      <th className="px-6 py-2 text-xs font-semibold text-gray-500">Price</th>
                      <th className="px-6 py-2 text-xs font-semibold text-gray-500">Badge</th>
                      <th className="px-6 py-2 text-xs font-semibold text-gray-500">Status</th>
                      <th className="px-6 py-2 text-xs font-semibold text-gray-500"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {catProducts.map((p) => (
                      <tr key={p.id} className="border-t border-gray-100 hover:bg-gray-50">
                        <td className="px-6 py-3">
                          <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-lg border border-gray-200 bg-gray-100">
                            {p.image_url
                              // eslint-disable-next-line @next/next/no-img-element
                              ? <img src={p.image_url} alt={p.name} className="h-full w-full object-cover" />
                              : <span className="text-lg">📦</span>}
                          </div>
                        </td>
                        <td className="px-6 py-3 font-medium text-gray-900">{p.name}</td>
                        <td className="px-6 py-3 text-gray-600">{p.brand ?? "—"}</td>
                        <td className="px-6 py-3 text-gray-600">{p.price_gbp != null ? `£${Number(p.price_gbp).toFixed(2)}` : "—"}</td>
                        <td className="px-6 py-3">
                          {p.badge && (
                            <span className="rounded-full border border-gray-200 bg-gray-100 px-2 py-0.5 text-[10px] font-semibold text-gray-600">
                              {p.badge}
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-3">
                          <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${p.is_active ? "bg-brand/20 text-brand" : "bg-gray-100 text-gray-400"}`}>
                            {p.is_active ? "Active" : "Hidden"}
                          </span>
                        </td>
                        <td className="px-6 py-3">
                          <div className="flex items-center justify-end gap-4">
                            <Link href={`/admin/accessories/${p.id}`} className="text-xs font-semibold text-blue-600 hover:underline">
                              Edit
                            </Link>
                            <AdminAccessoryDeleteButton id={p.id} />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          );
        })}

        {categories.length === 0 && (
          <div className="rounded-2xl border border-dashed border-gray-200 py-20 text-center">
            <p className="text-gray-400">Run the migration first to create categories.</p>
          </div>
        )}
      </div>
    </div>
  );
}
