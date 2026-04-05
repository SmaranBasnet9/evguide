import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { createClient } from "@/lib/supabase/server";

type BlogPostPageProps = {
  params: Promise<{ slug: string }>;
};

async function getPost(slug: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("slug", slug)
    .eq("published", true)
    .single();
  if (error || !data) return null;
  return data;
}

function formatDate(d: string | null) {
  if (!d) return "";
  return new Date(d).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <Navbar />
      <article className="mx-auto max-w-3xl px-6 py-16">
        {post.category && (
          <p className="text-sm font-semibold text-blue-600">{post.category}</p>
        )}
        <h1 className="mt-2 text-4xl font-bold leading-tight text-slate-900">
          {post.title}
        </h1>
        {post.published_at && (
          <p className="mt-3 text-sm text-slate-400">{formatDate(post.published_at)}</p>
        )}
        {post.cover_image && (
          <Image
            src={post.cover_image}
            alt={post.title}
            width={1200}
            height={675}
            unoptimized
            className="mt-8 w-full rounded-2xl object-cover"
          />
        )}
        {post.excerpt && (
          <p className="mt-8 text-lg font-medium leading-relaxed text-slate-600">
            {post.excerpt}
          </p>
        )}
        <div className="mt-8 whitespace-pre-wrap text-base leading-8 text-slate-800">
          {post.content}
        </div>
        <div className="mt-12 border-t border-slate-200 pt-8">
          <Link
            href="/blog"
            className="text-sm font-semibold text-blue-600 hover:underline"
          >
            ← Back to blog
          </Link>
        </div>
      </article>
      <Footer />
    </main>
  );
}