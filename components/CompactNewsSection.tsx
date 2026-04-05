import type { EVNewsItem } from "@/lib/news";

type Props = { items: EVNewsItem[] };

export default function CompactNewsSection({ items }: Props) {
  const compact = items.slice(0, 4);

  return (
    <section className="border-b border-slate-200 bg-white">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-blue-600">EV News</p>
            <h2 className="mt-1 text-2xl font-bold text-slate-900">Latest headlines</h2>
          </div>
          <a
            href="https://electrek.co"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-semibold text-blue-600 hover:underline"
          >
            More news →
          </a>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {compact.map((item) => (
            <a
              key={item.id}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col rounded-2xl border border-slate-200 bg-slate-50 p-4 transition hover:border-blue-300 hover:bg-blue-50"
            >
              <span className="inline-block rounded-full bg-blue-50 px-2 py-0.5 text-xs font-semibold text-blue-600 group-hover:bg-white">
                {item.category}
              </span>
              <p className="mt-2 line-clamp-2 grow text-sm font-semibold text-slate-900">
                {item.title}
              </p>
              <p className="mt-3 text-xs text-slate-500">
                {item.source} · {item.publishedAt}
              </p>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
