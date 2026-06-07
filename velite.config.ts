import { readFile } from "node:fs/promises";
import { join } from "node:path";

import rehypePrettyCode, { type Options as PrettyCodeOptions } from "rehype-pretty-code";
import remarkGfm from "remark-gfm";
import sharp from "sharp";
import { defineConfig, defineCollection, s } from "velite";

const prettyCode: PrettyCodeOptions = {
  theme: { dark: "github-dark-default", light: "github-light" },
  defaultLang: "plaintext",
  keepBackground: false,
};

const image = s
  .object({ src: s.string(), alt: s.string(), caption: s.string().optional() })
  .transform(async (data) => {
    // Stamp intrinsic dimensions on local images so next/image reserves the
    // aspect-ratio box (no flicker on cover / gallery images).
    const blank = {
      ...data,
      width: undefined as number | undefined,
      height: undefined as number | undefined,
    };
    if (!data.src.startsWith("/")) return blank;
    try {
      const { width, height } = await sharp(
        join(process.cwd(), "public", data.src.replace(/^\//, "")),
      ).metadata();
      return { ...data, width, height };
    } catch {
      return blank;
    }
  });

interface HastNode {
  type?: string;
  tagName?: string;
  properties?: Record<string, unknown>;
  children?: HastNode[];
}

// Flag the first image in the body so it can render eager/priority — it becomes the
// LCP element on posts whose cover is hidden (showCover: false).
function rehypeFirstImagePriority() {
  return (tree: HastNode) => {
    let done = false;
    const walk = (node: HastNode) => {
      if (done) return;
      if (node.type === "element" && node.tagName === "img") {
        node.properties = { ...node.properties, dataPriority: "true" };
        done = true;
        return;
      }
      for (const child of node.children ?? []) walk(child);
    };
    walk(tree);
  };
}

// Stamp intrinsic width/height on local body images so next/image reserves the
// correct aspect-ratio box up front — kills the reload layout shift / flicker.
function rehypeImageDimensions() {
  return async (tree: HastNode) => {
    const images: HastNode[] = [];
    const collect = (node: HastNode) => {
      if (node.type === "element" && node.tagName === "img") images.push(node);
      for (const child of node.children ?? []) collect(child);
    };
    collect(tree);

    await Promise.all(
      images.map(async (node) => {
        const props = node.properties ?? {};
        const src = typeof props.src === "string" ? props.src : undefined;
        if (!src || !src.startsWith("/") || (props.width && props.height)) return;
        try {
          const { width, height } = await sharp(
            await readFile(join(process.cwd(), "public", src.replace(/^\//, ""))),
          ).metadata();
          if (width && height) node.properties = { ...props, width, height };
        } catch {
          // remote or missing asset — leave dimensions unset, Img falls back
        }
      }),
    );
  };
}

const site = defineCollection({
  name: "Site",
  pattern: "site.json",
  single: true,
  schema: s.object({
    name: s.string(),
    handle: s.string(),
    role: s.string(),
    location: s.string(),
    title: s.string(),
    description: s.string(),
    url: s.string().url(),
    email: s.string().email(),
    locale: s.literal("en"),
    nav: s.array(s.object({ label: s.string(), href: s.string() })),
  }),
});

const posts = defineCollection({
  name: "Post",
  pattern: "blog/*.mdx",
  schema: s
    .object({
      title: s.string(),
      description: s.string(),
      date: s.isodate(),
      updated: s.isodate().optional(),
      category: s.string(),
      tags: s.array(s.string()).default([]),
      draft: s.boolean().default(false),
      cover: image.optional(),
      showCover: s.boolean().default(true),
      slug: s.path(),
      body: s.mdx(),
      raw: s.raw(),
    })
    .transform((data) => ({
      ...data,
      slug: data.slug.replace(/^blog\//, ""),
      path: `/blog/${data.slug.replace(/^blog\//, "")}`,
    })),
});

const projects = defineCollection({
  name: "Project",
  pattern: "projects/*.mdx",
  schema: s
    .object({
      title: s.string(),
      summary: s.string(),
      category: s.string(),
      order: s.number().optional(),
      stack: s.array(s.string()).default([]),
      repo: s.string().url().optional(),
      url: s.string().url().optional(),
      images: s.array(image).default([]),
      highlights: s.array(s.string()).default([]),
      body: s.mdx(),
      raw: s.raw(),
    })
    .transform((data, { meta }) => {
      const file = meta.path.split("/").pop() ?? "";
      const slug = file.replace(/\.mdx$/, "");
      return { ...data, slug, path: `/projects/${slug}` };
    }),
});

const experiences = defineCollection({
  name: "Experience",
  pattern: "experiences/*.json",
  schema: s
    .object({
      company: s.string(),
      role: s.string(),
      start: s.string(),
      end: s.string().optional(),
      location: s.string(),
      summary: s.string(),
      highlights: s.array(s.string()).default([]),
      stack: s.array(s.string()).default([]),
    })
    .transform((data, { meta }) => {
      const file = meta.path.split("/").pop() ?? "";
      const slug = file.replace(/\.json$/, "");
      return { ...data, slug };
    }),
});

const education = defineCollection({
  name: "Education",
  pattern: "education/*.json",
  schema: s
    .object({
      school: s.string(),
      degree: s.string(),
      field: s.string().optional(),
      start: s.string(),
      end: s.string().optional(),
      location: s.string().optional(),
      notes: s.string().optional(),
    })
    .transform((data, { meta }) => {
      const file = meta.path.split("/").pop() ?? "";
      const slug = file.replace(/\.json$/, "");
      return { ...data, slug };
    }),
});

const skills = defineCollection({
  name: "Skill",
  pattern: "data/skills.json",
  schema: s.object({
    name: s.string(),
    category: s.enum(["lang", "frontend", "backend", "devops", "design", "other"]),
  }),
});

const stacks = defineCollection({
  name: "Stack",
  pattern: "data/stacks.json",
  schema: s.object({
    name: s.string(),
    category: s.enum(["framework", "library", "lang", "infra", "tooling", "design"]),
  }),
});

const socials = defineCollection({
  name: "Social",
  pattern: "data/socials.json",
  schema: s.object({
    label: s.string(),
    href: s.string().url(),
  }),
});

export default defineConfig({
  root: "content",
  output: {
    data: ".velite",
    assets: "public/_velite",
    base: "/_velite/",
    name: "[name]-[hash:8].[ext]",
    clean: true,
  },
  collections: {
    site,
    posts,
    projects,
    experiences,
    education,
    skills,
    stacks,
    socials,
  },
  mdx: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [
      rehypeFirstImagePriority,
      rehypeImageDimensions,
      [rehypePrettyCode, prettyCode],
    ],
  },
});
