import AdminBlogForm from "@/components/AdminBlogForm";

export default function NewBlogPostPage() {
  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="text-3xl font-bold text-slate-900">Write New Post</h1>
      <p className="mt-1 text-slate-500">
        Write an EV blog post or story. Toggle &quot;Publish immediately&quot; to make it visible on the public blog.
      </p>
      <div className="mt-8">
        <AdminBlogForm mode="create" />
      </div>
    </div>
  );
}
