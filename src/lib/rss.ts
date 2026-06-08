import { Feed } from "feed";

import { getPublishedPosts, site } from "@/lib/content";

export function buildRss(): string {
  const posts = getPublishedPosts().slice(0, 20);
  const author = { name: site.name, link: site.url };

  const feed = new Feed({
    title: site.name,
    description: site.description,
    id: site.url,
    link: site.url,
    language: site.locale,
    copyright: `© ${new Date().getFullYear()} ${site.name}`,
    feedLinks: { rss: new URL("/feed.xml", site.url).toString() },
    author,
    ...(posts[0] ? { updated: new Date(posts[0].date) } : {}),
  });

  for (const post of posts) {
    const url = new URL(post.path, site.url).toString();
    feed.addItem({
      title: post.title,
      id: url,
      link: url,
      date: new Date(post.date),
      description: post.description,
      author: [author],
      category: [post.category, ...post.tags].map((name) => ({ name })),
    });
  }

  return feed.rss2();
}
