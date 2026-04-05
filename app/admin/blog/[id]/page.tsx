import { notFound } from "next/navigation";
import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/admin";
import AdminBlogForm from "@/components/AdminBlogForm";

async function getPost(id: string) {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("id", id)
    .single();
  if (error || !data) return null;
  return data;
}

export default async function EditBlogPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const post = await getPost(id);
  if (!post) notFound();

  const initialData = {
    title: post.title ?? "",
    excerpt: post.excerpt ?? "",
    content: post.content ?? "",
    cover_image: post.cover_image ?? "",
    category: post.category ?? "",
    published: post.published ?? false,
  };

  return (
    <div className="mx-auto max-w-4xl">
      <div className="flex items-center gap-2 text-sm text-slate-500">
        <Link href="/admin/blog" className="hover:text-blue-600 hover:underline">
          Blog Posts
        </Link>
        <span>/</span>
        <span className="font-medium text-slate-900">{post.title}</span>
      </div>

      <h1 className="mt-3 text-3xl font-bold text-slate-900">Edit Post</h1>
      <p className="mt-1 text-slate-500">
        Changes are saved immediately. Toggle &quot;Publish immediately&quot; to show or hide on the public blog.
      </p>

      <div className="mt-8">
        <AdminBlogForm mode="edit" id={id} initialData={initialData} />
      </div>
    </div>
  );
}
