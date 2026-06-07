import { notFound } from "next/navigation";

import { getProjectBySlug, projects } from "@/lib/content";
import { renderOgImage } from "@/lib/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/jpeg";

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) notFound();
  return renderOgImage({
    segment: "projects",
    eyebrow: project.category,
    title: project.title,
    ...(project.images[0] ? { cover: project.images[0].src } : {}),
  });
}
