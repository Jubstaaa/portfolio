import { getPublishedPosts, site, type Post } from "@/lib/content";

function escapeXml(input: string): string {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function rfc822(date: string): string {
  return new Date(date).toUTCString();
}

function itemXml(post: Post): string {
  const url = new URL(post.path, site.url).toString();
  return [
    "    <item>",
    `      <title>${escapeXml(post.title)}</title>`,
    `      <link>${url}</link>`,
    `      <guid isPermaLink="true">${url}</guid>`,
    `      <pubDate>${rfc822(post.date)}</pubDate>`,
    `      <category>${escapeXml(post.category)}</category>`,
    `      <description>${escapeXml(post.description)}</description>`,
    "    </item>",
  ].join("\n");
}

export function buildRss(): string {
  const feedUrl = new URL("/feed.xml", site.url).toString();
  const posts = getPublishedPosts().slice(0, 20);
  const lastBuild = posts[0] ? rfc822(posts[0].date) : new Date().toUTCString();

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">',
    "  <channel>",
    `    <title>${escapeXml(site.name)}</title>`,
    `    <link>${site.url}</link>`,
    `    <description>${escapeXml(site.description)}</description>`,
    `    <language>${site.locale}</language>`,
    `    <lastBuildDate>${lastBuild}</lastBuildDate>`,
    `    <atom:link href="${feedUrl}" rel="self" type="application/rss+xml" />`,
    ...posts.map(itemXml),
    "  </channel>",
    "</rss>",
  ].join("\n");
}
