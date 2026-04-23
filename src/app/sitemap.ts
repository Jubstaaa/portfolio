import type { MetadataRoute } from "next";

import { getAllProjects, getPublishedPosts, site } from "@/lib/content";

function absolute(path: string): string {
  return new URL(path, site.url).toString();
}

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: absolute("/"), lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: absolute("/about"), lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: absolute("/projects"), lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: absolute("/blog"), lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: absolute("/contact"), lastModified: now, changeFrequency: "monthly", priority: 0.6 },
  ];

  const projectRoutes: MetadataRoute.Sitemap = getAllProjects().map((project) => ({
    url: absolute(`/projects/${project.slug}`),
    lastModified: now,
    changeFrequency: "monthly",
    priority: project.featured ? 0.85 : 0.7,
  }));

  const postRoutes: MetadataRoute.Sitemap = getPublishedPosts().map((post) => ({
    url: absolute(post.path),
    lastModified: new Date(post.updated ?? post.date),
    changeFrequency: "monthly",
    priority: post.featured ? 0.85 : 0.7,
  }));

  return [...staticRoutes, ...projectRoutes, ...postRoutes];
}
