import type { Metadata } from "next";

import Link from "next/link";

import { BlogCard } from "@/components/BlogCard";
import { PathBar } from "@/components/PathBar";
import { SectionHeading } from "@/components/SectionHeading";
import { getAllBlogCategories, getAllBlogTags, getPublishedPosts, site } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";
import { cn } from "@/lib/utils";

export const metadata: Metadata = buildMetadata({
  title: "Blog",
  description: "Notes on frontend engineering, performance, and tooling.",
  path: "/blog",
});

interface BlogPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const params = await searchParams;
  const tagParam = typeof params.tag === "string" ? params.tag : undefined;
  const categories = getAllBlogCategories();
  const tags = getAllBlogTags();
  const allPosts = getPublishedPosts();
  const posts = tagParam ? allPosts.filter((p) => p.tags.includes(tagParam)) : allPosts;

  return (
    <>
      <PathBar
        path={`~/${site.handle}/blog`}
        meta={`${posts.length} ${posts.length === 1 ? "post" : "posts"}${
          tagParam ? ` · #${tagParam}` : ""
        } · rss`}
      />
      <section className="container-default section-pad space-y-10">
        <SectionHeading
          as="h1"
          title="blog"
          number="01"
          description="Notes on frontend engineering, performance, and tooling."
        />

        {categories.length > 0 ? (
          <div className="flex flex-wrap items-center gap-2">
            <span
              aria-hidden
              className="text-muted-foreground mr-1 font-mono text-xs tracking-[0.18em] uppercase"
            >
              categories
            </span>
            {categories.map((cat) => (
              <a
                key={cat}
                href={`/blog/category/${cat}`}
                className={cn(
                  "hairline text-muted-foreground hover:text-foreground transition-token inline-flex h-7 items-center rounded-full border px-3 text-xs",
                )}
              >
                {cat}
              </a>
            ))}
          </div>
        ) : null}

        {tags.length > 0 ? (
          <div className="flex flex-wrap items-center gap-2">
            <span
              aria-hidden
              className="text-muted-foreground mr-1 font-mono text-xs tracking-[0.18em] uppercase"
            >
              tags
            </span>
            <Link
              href="/blog"
              aria-current={!tagParam ? "page" : undefined}
              className={cn(
                "hairline transition-token inline-flex h-7 items-center rounded-full border px-3 text-xs",
                !tagParam
                  ? "border-accent text-accent"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              all
            </Link>
            {tags.map((tag) => (
              <Link
                key={tag}
                href={`/blog?tag=${encodeURIComponent(tag)}`}
                aria-current={tagParam === tag ? "page" : undefined}
                className={cn(
                  "hairline transition-token inline-flex h-7 items-center rounded-full border px-3 text-xs",
                  tagParam === tag
                    ? "border-accent text-accent"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                #{tag}
              </Link>
            ))}
          </div>
        ) : null}

        {posts.length === 0 ? (
          <p className="text-muted-foreground text-sm">
            <span aria-hidden className="mr-1 select-none">
              →
            </span>
            no posts match the current filter
          </p>
        ) : (
          <ol className="divide-border hairline flex flex-col divide-y border-t">
            {posts.map((post) => (
              <li key={post.slug}>
                <BlogCard post={post} />
              </li>
            ))}
          </ol>
        )}
      </section>
    </>
  );
}
