import type { Metadata } from "next";

import { BlogCard } from "@/components/BlogCard";
import { PathBar } from "@/components/PathBar";
import { SectionHeading } from "@/components/SectionHeading";
import { getPublishedPosts, site } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Blog",
  description:
    "Writing on frontend engineering, TypeScript, Next.js, performance, and developer tooling — plus occasional posts about games and anime.",
  path: "/blog",
  keywords: [
    "ilker balcilar blog",
    "frontend engineering",
    "nextjs tutorial",
    "typescript tips",
    "developer tools",
    "web performance",
  ],
});

export default function BlogPage() {
  const posts = getPublishedPosts();

  return (
    <>
      <PathBar
        path={`~/${site.handle}/blog`}
        meta={`${posts.length} ${posts.length === 1 ? "post" : "posts"}`}
      />
      <section className="container-default section-pad space-y-10">
        <SectionHeading
          as="h1"
          title="blog"
          number="01"
          description="Notes on frontend engineering, performance, and tooling."
        />
        {posts.length === 0 ? (
          <p className="text-muted-foreground text-sm">
            <span aria-hidden className="mr-1 select-none">
              →
            </span>
            no posts yet
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
