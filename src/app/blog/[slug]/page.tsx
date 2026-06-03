import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";

import { AdjacentNav } from "@/components/adjacent-nav";
import { ArticleHeader } from "@/components/article-header";
import { Mdx } from "@/components/mdx";
import { PathBar } from "@/components/path-bar";
import { Prose } from "@/components/prose";
import { getAdjacent, getPostBySlug, getPublishedPosts, posts, site } from "@/lib/content";
import { formatDate } from "@/lib/format";
import { JsonLd } from "@/components/json-ld";
import { buildArticleJsonLd, buildBreadcrumbJsonLd, buildMetadata } from "@/lib/seo";

export function generateStaticParams() {
  return posts.map((post) => ({ slug: post.slug }));
}

interface PostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};
  return buildMetadata({
    title: post.title,
    description: post.description,
    path: post.path,
    ...(post.cover ? { ogImage: post.cover.src } : {}),
    type: "article",
    publishedTime: post.date,
    modifiedTime: post.updated ?? post.date,
    authors: [site.name],
    section: post.category,
    tags: post.tags,
    keywords: post.tags,
  });
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const { prev, next } = getAdjacent(getPublishedPosts(), post);

  return (
    <>
      <JsonLd id={`ld-article-${post.slug}`} data={buildArticleJsonLd(post)} />
      <JsonLd
        id={`ld-breadcrumb-${post.slug}`}
        data={buildBreadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Blog", path: "/blog" },
          { name: post.title, path: post.path },
        ])}
      />
      <PathBar
        path={`~/${site.handle}/blog/${post.slug}`}
        meta={`${formatDate(post.date)} · ${post.category}`}
      />
      <section className="container-default section-pad">
        <article className="mx-auto max-w-3xl min-w-0 space-y-8">
          <ArticleHeader
            meta={
              <>
                <span className="font-mono tracking-tight">{formatDate(post.date)}</span>
                <span aria-hidden className="select-none">
                  ·
                </span>
                <span>{post.category}</span>
              </>
            }
            title={post.title}
            lead={post.description}
            {...(post.tags.length > 0
              ? { tags: post.tags.map((tag) => <span key={tag}>#{tag}</span>) }
              : {})}
          />

          {post.cover ? (
            <Image
              src={post.cover.src}
              alt={post.cover.alt}
              width={0}
              height={0}
              priority
              sizes="(min-width: 1024px) 720px, 100vw"
              className="hairline max-h-125 w-full rounded-md border object-contain"
            />
          ) : null}

          <Prose>
            <Mdx code={post.body} />
          </Prose>

          <AdjacentNav
            {...(prev ? { prev } : {})}
            {...(next ? { next } : {})}
            ariaLabel="Post navigation"
          />
        </article>
      </section>
    </>
  );
}
