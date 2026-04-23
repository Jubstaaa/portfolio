import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { BlogCard } from "@/components/BlogCard";
import { PathBar } from "@/components/PathBar";
import { SectionHeading } from "@/components/SectionHeading";
import { getAllBlogCategories, getPostsByCategory, site } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";

export function generateStaticParams() {
  return getAllBlogCategories().map((slug) => ({ slug }));
}

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  if (!getAllBlogCategories().includes(slug)) return {};
  return buildMetadata({
    title: `${slug} — blog`,
    description: `Posts in the ${slug} category.`,
    path: `/blog/category/${slug}`,
  });
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const categories = getAllBlogCategories();
  if (!categories.includes(slug)) notFound();

  const posts = getPostsByCategory(slug);

  return (
    <>
      <PathBar
        path={`~/${site.handle}/blog/category/${slug}`}
        meta={`${posts.length} ${posts.length === 1 ? "post" : "posts"}`}
      />
      <section className="container-default section-pad space-y-10">
        <SectionHeading
          as="h1"
          title={slug}
          number="01"
          description={`All posts tagged with the ${slug} category.`}
        />
        <ol className="divide-border hairline flex flex-col divide-y border-t">
          {posts.map((post) => (
            <li key={post.slug}>
              <BlogCard post={post} />
            </li>
          ))}
        </ol>
      </section>
    </>
  );
}
