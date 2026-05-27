import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/admin";
import AdminAccessoryForm from "@/components/AdminAccessoryForm";

async function getCategories() {
  const admin = createAdminClient();
  const { data } = await admin
    .from("accessory_categories")
    .select("id, name, slug")
    .eq("is_active", true)
    .order("display_order");
  return data ?? [];
}

export default async function NewAccessoryPage() {
  const categories = await getCategories();

  return (
    <div className="mx-auto max-w-3xl">
      <div className="flex items-center gap-2 text-sm text-white/50">
        <Link href="/admin/accessories" className="hover:text-white hover:underline">Accessories</Link>
        <span>/</span>
        <span className="text-white">New product</span>
      </div>
      <h1 className="mt-3 text-3xl font-bold text-white">Add Product</h1>
      <p className="mt-1 text-white/50">New accessory will be visible on the site immediately.</p>
      <div className="mt-8">
        <AdminAccessoryForm mode="new" categories={categories} />
      </div>
    </div>
  );
}
