import type { Metadata } from "next";

import { site, type Post, type Project } from "@/lib/content";

function absoluteUrl(path: string): string {
  return new URL(path, site.url).toString();
}

interface BuildMetadataInput {
  title: string;
  description?: string;
  path?: string;
  ogImage?: string;
  keywords?: string[];
  type?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
  authors?: string[];
  section?: string;
  tags?: string[];
}

export function buildMetadata(input: BuildMetadataInput): Metadata {
  const description = input.description ?? site.description;
  const path = input.path ?? "/";
  const url = absoluteUrl(path);
  const images = input.ogImage ? [{ url: input.ogImage }] : undefined;
  const type = input.type ?? "website";

  const openGraph: Metadata["openGraph"] =
    type === "article"
      ? {
          type: "article",
          title: input.title,
          description,
          url,
          siteName: site.name,
          locale: "en_US",
          ...(input.publishedTime ? { publishedTime: input.publishedTime } : {}),
          ...(input.modifiedTime ? { modifiedTime: input.modifiedTime } : {}),
          ...(input.authors ? { authors: input.authors } : {}),
          ...(input.section ? { section: input.section } : {}),
          ...(input.tags ? { tags: input.tags } : {}),
          ...(images ? { images } : {}),
        }
      : {
          type: "website",
          title: input.title,
          description,
          url,
          siteName: site.name,
          locale: "en_US",
          ...(images ? { images } : {}),
        };

  return {
    title: input.title,
    description,
    ...(input.keywords && input.keywords.length > 0 ? { keywords: input.keywords } : {}),
    ...(input.authors ? { authors: input.authors.map((name) => ({ name })) } : {}),
    alternates: { canonical: url },
    openGraph,
    twitter: {
      card: "summary_large_image",
      title: input.title,
      description,
      ...(images ? { images } : {}),
      creator: `@${site.handle}`,
    },
  };
}

export function buildPersonJsonLd(): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: site.name,
    jobTitle: site.role,
    email: `mailto:${site.email}`,
    url: site.url,
    address: { "@type": "PostalAddress", addressLocality: site.location },
  };
}

export function buildArticleJsonLd(post: Post): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    ...(post.updated ? { dateModified: post.updated } : { dateModified: post.date }),
    author: { "@type": "Person", name: site.name, url: site.url },
    url: absoluteUrl(post.path),
    ...(post.cover ? { image: absoluteUrl(post.cover.src) } : {}),
    keywords: post.tags.join(", "),
    articleSection: post.category,
    inLanguage: "en",
    mainEntityOfPage: absoluteUrl(post.path),
  };
}

export function buildBreadcrumbJsonLd(
  trail: Array<{ name: string; path: string }>,
): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((entry, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: entry.name,
      item: absoluteUrl(entry.path),
    })),
  };
}

export function buildProjectJsonLd(project: Project): Record<string, unknown> {
  const cover = project.images[0];
  return {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.title,
    description: project.summary,
    creator: { "@type": "Person", name: site.name },
    url: absoluteUrl(`/projects/${project.slug}`),
    ...(project.repo ? { codeRepository: project.repo } : {}),
    ...(cover ? { image: absoluteUrl(cover.src) } : {}),
    keywords: project.stack.join(", "),
  };
}
