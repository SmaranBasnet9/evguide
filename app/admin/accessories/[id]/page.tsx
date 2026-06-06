import { notFound } from "next/navigation";
import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/admin";
import AdminAccessoryForm from "@/components/AdminAccessoryForm";

async function getData(id: string) {
  const admin = createAdminClient();
  const [{ data: product }, { data: categories }] = await Promise.all([
    admin.from("accessories").select("*").eq("id", id).single(),
    admin.from("accessory_categories").select("id, name, slug").eq("is_active", true).order("display_order"),
  ]);
  return { product, categories: categories ?? [] };
}

export default async function EditAccessoryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { product, categories } = await getData(id);
  if (!product) notFound();

  const initialData = {
    category_id:     product.category_id ?? "",
    name:            product.name ?? "",
    slug:            product.slug ?? "",
    description:     product.description ?? "",
    brand:           product.brand ?? "",
    price_gbp:       product.price_gbp != null ? String(product.price_gbp) : "",
    image_url:       product.image_url ?? "",
    affiliate_url:   product.affiliate_url ?? "",
    badge:           product.badge ?? "",
    rating:          product.rating != null ? String(product.rating) : "",
    review_count:    String(product.review_count ?? 0),
    is_featured:     Boolean(product.is_featured),
    is_active:       Boolean(product.is_active),
    compatible_with: Array.isArray(product.compatible_with) ? product.compatible_with : [],
    display_order:   String(product.display_order ?? 0),
  };

  return (
    <div className="mx-auto max-w-3xl">
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <Link href="/admin/accessories" className="hover:text-gray-900 hover:underline">Accessories</Link>
        <span>/</span>
        <span className="text-gray-900">{product.name}</span>
      </div>
      <h1 className="mt-3 text-3xl font-bold text-gray-900">Edit Product</h1>
      <p className="mt-1 text-gray-500">Changes are saved directly to the database.</p>
      <div className="mt-8">
        <AdminAccessoryForm mode="edit" id={id} categories={categories} initialData={initialData} />
      </div>
    </div>
  );
}
