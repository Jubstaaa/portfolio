import { buildRss } from "@/lib/rss";

export function GET() {
  return new Response(buildRss(), {
    headers: {
      "content-type": "application/rss+xml; charset=utf-8",
      "cache-control": "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
