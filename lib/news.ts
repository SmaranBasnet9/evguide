import { evNews as staticEvNews } from "@/data/evNews";

export type EVNewsItem = {
  id: string;
  title: string;
  summary: string;
  source: string;
  category: string;
  image: string;
  url: string;
  publishedAt: string;
};

type RssSource = {
  name: string;
  feedUrl: string;
};

type ParsedNewsItem = {
  item: EVNewsItem;
  timestamp: number;
};

const RSS_SOURCES: RssSource[] = [
  { name: "Electrek", feedUrl: "https://electrek.co/guides/electric-vehicles/feed/" },
  { name: "InsideEVs", feedUrl: "https://insideevs.com/rss/news/" },
  { name: "CleanTechnica", feedUrl: "https://cleantechnica.com/tag/electric-vehicles/feed/" },
];

function inferCategory(text: string): string {
  const value = text.toLowerCase();

  if (value.includes("tesla")) return "Tesla";
  if (value.includes("byd")) return "BYD";
  if (value.includes("battery")) return "Battery";
  if (value.includes("charging") || value.includes("charger")) return "Charging";
  return "EV News";
}

function formatPublishedDate(dateString: string): string {
  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) return "Recently";

  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

function decodeHtml(input: string): string {
  return input
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

function stripHtml(input: string): string {
  return decodeHtml(input).replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

function getTagValue(itemXml: string, tagName: string): string | null {
  const match = itemXml.match(new RegExp(`<${tagName}(?:\\s[^>]*)?>([\\s\\S]*?)</${tagName}>`, "i"));
  return match?.[1]?.trim() ?? null;
}

function getImageUrl(itemXml: string): string {
  const mediaMatch = itemXml.match(/<media:content[^>]*url=["']([^"']+)["']/i);
  if (mediaMatch?.[1]) return mediaMatch[1];

  const enclosureMatch = itemXml.match(/<enclosure[^>]*url=["']([^"']+)["']/i);
  if (enclosureMatch?.[1]) return enclosureMatch[1];

  const fromContent = itemXml.match(/<img[^>]*src=["']([^"']+)["']/i);
  if (fromContent?.[1]) return fromContent[1];

  return "https://images.unsplash.com/photo-1553440569-bcc63803a83d?q=80&w=1200&auto=format&fit=crop";
}

function parseRss(xml: string, sourceName: string, maxItems: number): ParsedNewsItem[] {
  const itemBlocks = xml.match(/<item\b[\s\S]*?<\/item>/gi) ?? [];

  return itemBlocks.slice(0, maxItems).map((itemXml, index) => {
    const title = stripHtml(getTagValue(itemXml, "title") ?? "Untitled article");
    const description = stripHtml(getTagValue(itemXml, "description") ?? "No summary available.");
    const url = decodeHtml(getTagValue(itemXml, "link") ?? "");
    const pubDateRaw = getTagValue(itemXml, "pubDate") ?? "";
    const publishedAt = formatPublishedDate(pubDateRaw);
    const timestamp = Number.isNaN(new Date(pubDateRaw).getTime())
      ? 0
      : new Date(pubDateRaw).getTime();

    return {
      item: {
        id: `${sourceName}-${index}-${url || title}`,
        title,
        summary: description,
        source: sourceName,
        category: inferCategory(`${title} ${description}`),
        image: getImageUrl(itemXml),
        url,
        publishedAt,
      },
      timestamp,
    };
  });
}

async function fetchSource(source: RssSource): Promise<ParsedNewsItem[]> {
  try {
    const response = await fetch(source.feedUrl, {
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      return [];
    }

    const xml = await response.text();
    return parseRss(xml, source.name, 5);
  } catch {
    return [];
  }
}

export async function getEvNews(): Promise<EVNewsItem[]> {
  const fallback: EVNewsItem[] = staticEvNews.map((item) => ({
    id: item.id,
    title: item.title,
    summary: item.summary,
    source: item.source,
    category: item.category,
    image: item.image,
    url: item.url,
    publishedAt: "Recently",
  }));

  const settled = await Promise.allSettled(RSS_SOURCES.map((source) => fetchSource(source)));

  const parsed = settled.flatMap((result) =>
    result.status === "fulfilled" ? result.value : []
  );

  if (parsed.length === 0) {
    return fallback;
  }

  const dedupedByUrl = new Map<string, ParsedNewsItem>();
  for (const entry of parsed) {
    const key = entry.item.url || entry.item.id;
    if (!dedupedByUrl.has(key)) {
      dedupedByUrl.set(key, entry);
    }
  }

  const liveItems = Array.from(dedupedByUrl.values())
    .sort((a, b) => b.timestamp - a.timestamp)
    .slice(0, 10)
    .map((entry) => entry.item);

  if (liveItems.length >= 10) {
    return liveItems;
  }

  // If live feeds return fewer items, pad with curated static stories
  // to keep the layout full and avoid large empty sections.
  const combined = [...liveItems];
  const seen = new Set(combined.map((item) => item.url || item.title));

  for (const item of fallback) {
    if (combined.length >= 10) break;

    const key = item.url || item.title;
    if (seen.has(key)) continue;

    seen.add(key);
    combined.push({
      ...item,
      id: `fallback-${item.id}`,
    });
  }

  return combined;
}