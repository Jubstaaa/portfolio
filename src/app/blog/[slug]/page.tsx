import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Mdx } from "@/components/Mdx";
import { PathBar } from "@/components/PathBar";
import { Prose } from "@/components/Prose";
import { ReadingProgress } from "@/components/ReadingProgress";
import { SectionHeading } from "@/components/SectionHeading";
import { Toc } from "@/components/Toc";
import { getPostBySlug, getPublishedPosts, posts, site, type Post } from "@/lib/content";
import { buildArticleJsonLd, buildMetadata, JsonLd } from "@/lib/seo";

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
    ogImage: `${post.path}/opengraph-image`,
  });
}

function relatedPosts(current: Post, limit = 3): Post[] {
  if (current.tags.length === 0) return [];
  const tagSet = new Set(current.tags);
  return getPublishedPosts()
    .filter((post) => post.slug !== current.slug)
    .map((post) => ({
      post,
      overlap: post.tags.filter((t) => tagSet.has(t)).length,
    }))
    .filter((entry) => entry.overlap > 0)
    .sort((a, b) => b.overlap - a.overlap || b.post.date.localeCompare(a.post.date))
    .slice(0, limit)
    .map((entry) => entry.post);
}

function adjacent(current: Post): { prev?: Post; next?: Post } {
  const list = getPublishedPosts();
  const index = list.findIndex((p) => p.slug === current.slug);
  return {
    ...(list[index + 1] ? { prev: list[index + 1]! } : {}),
    ...(list[index - 1] ? { next: list[index - 1]! } : {}),
  };
}

function formatDate(iso: string): string {
  return new Date(iso).toISOString().slice(0, 10);
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const related = relatedPosts(post);
  const { prev, next } = adjacent(post);

  return (
    <>
      <JsonLd data={buildArticleJsonLd(post)} />
      <ReadingProgress />
      <PathBar
        path={`~/${site.handle}/blog/${post.slug}`}
        meta={`${formatDate(post.date)} · ${post.readingTime} min · ${post.category}`}
      />
      <div className="container-default section-pad grid gap-12 lg:grid-cols-[minmax(0,1fr),16rem]">
        <article className="min-w-0 space-y-8">
          <header className="space-y-4">
            <p className="text-muted-foreground flex flex-wrap items-center gap-x-3 text-xs">
              <span className="font-mono tracking-tight">{formatDate(post.date)}</span>
              <span aria-hidden className="select-none">
                ·
              </span>
              <span>{post.readingTime} min</span>
              <span aria-hidden className="select-none">
                ·
              </span>
              <span>{post.category}</span>
            </p>
            <div className="relative space-y-3">
              <h1
                className="text-foreground flex items-baseline gap-2 text-lg font-normal"
                style={{ viewTransitionName: `post-${post.slug}` }}
              >
                <span aria-hidden className="text-muted-foreground select-none">
                  #
                </span>
                <span>{post.title}</span>
              </h1>
              <div
                aria-hidden
                className="term-rule overflow-hidden text-sm leading-none whitespace-nowrap"
              >
                {"─".repeat(240)}
              </div>
            </div>
            <p className="text-foreground max-w-prose text-base leading-relaxed">
              {post.description}
            </p>
            {post.tags.length > 0 ? (
              <p className="text-muted-foreground flex flex-wrap gap-x-3 text-xs">
                {post.tags.map((tag) => (
                  <span key={tag}>#{tag}</span>
                ))}
              </p>
            ) : null}
          </header>

          {post.cover ? (
            <div className="hairline relative aspect-[16/9] overflow-hidden rounded-md border">
              <Image
                src={post.cover.src}
                alt={post.cover.alt}
                fill
                priority
                sizes="(min-width: 1024px) 720px, 100vw"
                className="object-cover"
              />
            </div>
          ) : null}

          {post.toc.length > 0 ? (
            <details className="hairline group rounded-md border p-4 lg:hidden">
              <summary className="text-muted-foreground hover:text-foreground marker:text-muted-foreground cursor-pointer text-xs tracking-[0.18em] uppercase">
                on this page
              </summary>
              <div className="mt-4">
                <Toc items={post.toc} />
              </div>
            </details>
          ) : null}

          <Prose>
            <Mdx code={post.body} />
          </Prose>

          {related.length > 0 ? (
            <section className="space-y-4 pt-10">
              <SectionHeading title="related" />
              <ul className="divide-border hairline flex flex-col divide-y border-t">
                {related.map((r) => (
                  <li key={r.slug} className="py-4">
                    <Link
                      href={r.path}
                      className="text-foreground hover:text-accent transition-token"
                    >
                      {r.title}
                    </Link>
                    <p className="text-muted-foreground mt-1 text-xs">
                      {formatDate(r.date)} · {r.readingTime} min · {r.category}
                    </p>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          {prev || next ? (
            <nav
              aria-label="Post navigation"
              className="hairline grid grid-cols-1 gap-4 border-t pt-8 md:grid-cols-2"
            >
              {prev ? (
                <Link
                  href={prev.path}
                  className="hover:text-foreground transition-token text-muted-foreground group block space-y-1"
                >
                  <span className="text-xs tracking-[0.18em] uppercase">← prev</span>
                  <span className="text-foreground group-hover:text-accent transition-token block truncate">
                    {prev.title}
                  </span>
                </Link>
              ) : (
                <span />
              )}
              {next ? (
                <Link
                  href={next.path}
                  className="hover:text-foreground transition-token text-muted-foreground group block space-y-1 md:text-right"
                >
                  <span className="text-xs tracking-[0.18em] uppercase">next →</span>
                  <span className="text-foreground group-hover:text-accent transition-token block truncate">
                    {next.title}
                  </span>
                </Link>
              ) : (
                <span />
              )}
            </nav>
          ) : null}
        </article>

        <aside className="hidden lg:block">
          <div className="sticky top-24">
            <Toc items={post.toc} />
          </div>
        </aside>
      </div>
    </>
  );
}
