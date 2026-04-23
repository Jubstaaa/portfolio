import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Mdx } from "@/components/Mdx";
import { PathBar } from "@/components/PathBar";
import { Prose } from "@/components/Prose";
import { getPostBySlug, getPublishedPosts, posts, site, type Post } from "@/lib/content";
import { buildArticleJsonLd, buildBreadcrumbJsonLd, buildMetadata, JsonLd } from "@/lib/seo";

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

  const { prev, next } = adjacent(post);

  return (
    <>
      <JsonLd data={buildArticleJsonLd(post)} />
      <JsonLd
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
          <header className="space-y-4">
            <p className="text-muted-foreground flex flex-wrap items-center gap-x-3 text-xs">
              <span className="font-mono tracking-tight">{formatDate(post.date)}</span>
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
              <hr className="my-2 border-t border-[color:var(--foreground)]" />
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

          <Prose>
            <Mdx code={post.body} />
          </Prose>

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
      </section>
    </>
  );
}
