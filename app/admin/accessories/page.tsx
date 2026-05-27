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
          <h1 className="text-3xl font-bold text-white">Accessories</h1>
          <p className="mt-1 text-white/50">{products.length} product{products.length !== 1 ? "s" : ""} across {categories.length} categories</p>
        </div>
        <Link href="/admin/accessories/new" className="rounded-xl bg-brand px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-hover">
          + Add Product
        </Link>
      </div>

      <div className="mt-8 space-y-6">
        {categories.map((cat) => {
          const catProducts = products.filter((p) => p.category_id === cat.id);
          return (
            <div key={cat.id} className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]">
              <div className="flex items-center justify-between border-b border-white/[0.06] bg-white/[0.03] px-6 py-3">
                <p className="text-sm font-semibold text-white">{cat.name}</p>
                <span className="text-xs text-white/40">{catProducts.length} products</span>
              </div>

              {catProducts.length === 0 ? (
                <p className="px-6 py-4 text-sm text-white/30">No products yet.</p>
              ) : (
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left">
                      <th className="px-6 py-2 text-xs font-semibold text-white/40">Image</th>
                      <th className="px-6 py-2 text-xs font-semibold text-white/40">Name</th>
                      <th className="px-6 py-2 text-xs font-semibold text-white/40">Brand</th>
                      <th className="px-6 py-2 text-xs font-semibold text-white/40">Price</th>
                      <th className="px-6 py-2 text-xs font-semibold text-white/40">Badge</th>
                      <th className="px-6 py-2 text-xs font-semibold text-white/40">Status</th>
                      <th className="px-6 py-2 text-xs font-semibold text-white/40"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {catProducts.map((p) => (
                      <tr key={p.id} className="border-t border-white/[0.05] hover:bg-white/[0.02]">
                        <td className="px-6 py-3">
                          <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-lg border border-white/10 bg-white/[0.04]">
                            {p.image_url
                              // eslint-disable-next-line @next/next/no-img-element
                              ? <img src={p.image_url} alt={p.name} className="h-full w-full object-cover" />
                              : <span className="text-lg">📦</span>}
                          </div>
                        </td>
                        <td className="px-6 py-3 font-medium text-white">{p.name}</td>
                        <td className="px-6 py-3 text-white/60">{p.brand ?? "—"}</td>
                        <td className="px-6 py-3 text-white/60">{p.price_gbp != null ? `£${Number(p.price_gbp).toFixed(2)}` : "—"}</td>
                        <td className="px-6 py-3">
                          {p.badge && (
                            <span className="rounded-full border border-white/10 bg-white/[0.06] px-2 py-0.5 text-[10px] font-semibold text-white/70">
                              {p.badge}
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-3">
                          <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${p.is_active ? "bg-brand/20 text-brand" : "bg-white/10 text-white/40"}`}>
                            {p.is_active ? "Active" : "Hidden"}
                          </span>
                        </td>
                        <td className="px-6 py-3">
                          <div className="flex items-center justify-end gap-4">
                            <Link href={`/admin/accessories/${p.id}`} className="text-xs font-semibold text-blue-400 hover:underline">
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
          <div className="rounded-2xl border border-dashed border-white/15 py-20 text-center">
            <p className="text-white/40">Run the migration first to create categories.</p>
          </div>
        )}
      </div>
    </div>
  );
}
