import type { Metadata } from "next";

import { site, type Post, type Project } from "@/lib/content";

export interface BuildMetadataInput {
  title: string;
  description?: string;
  path?: string;
  ogImage?: string;
}

export function buildMetadata(input: BuildMetadataInput): Metadata {
  const description = input.description ?? site.description;
  const path = input.path ?? "/";
  const url = new URL(path, site.url).toString();
  const images = input.ogImage ? [{ url: input.ogImage }] : undefined;
  return {
    title: input.title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: input.title,
      description,
      url,
      siteName: site.name,
      locale: "en_US",
      type: "website",
      ...(images ? { images } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: input.title,
      description,
      ...(images ? { images } : {}),
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
    url: new URL(post.path, site.url).toString(),
    ...(post.cover ? { image: new URL(post.cover.src, site.url).toString() } : {}),
    keywords: post.tags.join(", "),
    articleSection: post.category,
    inLanguage: "en",
    mainEntityOfPage: new URL(post.path, site.url).toString(),
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
    url: new URL(`/projects/${project.slug}`, site.url).toString(),
    ...(project.repo ? { codeRepository: project.repo } : {}),
    ...(cover ? { image: new URL(cover.src, site.url).toString() } : {}),
    keywords: project.stack.join(", "),
  };
}

export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      // Server-rendered, our content — safe to serialize directly.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
