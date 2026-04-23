import { ImageResponse } from "next/og";

import { getPostBySlug, posts, site } from "@/lib/content";

export const alt = "Blog post";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return posts.map((post) => ({ slug: post.slug }));
}

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function OG({ params }: Props) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  const title = post?.title ?? site.name;
  const date = post ? new Date(post.date).toISOString().slice(0, 10) : "";
  const meta = post ? `${date} · ${post.category}` : site.role;

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        background: "#191c22",
        color: "#ebe7db",
        padding: "80px",
        fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 24, color: "#7b8aa5" }}>
        <span style={{ fontSize: 28 }}>~/{site.handle}/blog</span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        <span style={{ color: "#7b8aa5", fontSize: 24 }}>{meta}</span>
        <span
          style={{
            fontSize: 72,
            fontWeight: 700,
            letterSpacing: "-0.03em",
            lineHeight: 1.05,
            color: "#ebe7db",
            display: "flex",
          }}
        >
          {title}
        </span>
      </div>
      <div
        style={{ display: "flex", alignItems: "center", gap: 12, color: "#7b8aa5", fontSize: 24 }}
      >
        <span style={{ color: "#6aa7ff" }}>❯</span>
        <span>{site.name}</span>
      </div>
    </div>,
    size,
  );
}
