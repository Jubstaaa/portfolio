import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypePrettyCode, { type Options as PrettyCodeOptions } from "rehype-pretty-code";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import { defineConfig, defineCollection, s } from "velite";

const prettyCode: PrettyCodeOptions = {
  theme: { dark: "github-dark-default", light: "github-light" },
  defaultLang: "plaintext",
  keepBackground: false,
};

const image = s.object({ src: s.string(), alt: s.string(), caption: s.string().optional() });
const logo = s.object({ src: s.string(), alt: s.string() });

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
    ogDefault: s.string(),
    nav: s.array(s.object({ label: s.string(), href: s.string() })),
  }),
});

const about = defineCollection({
  name: "About",
  pattern: "about.mdx",
  single: true,
  schema: s
    .object({
      title: s.string().default("About"),
      body: s.mdx(),
      raw: s.raw(),
    })
    .transform((data) => ({ ...data })),
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
      category: s.enum(["web", "mobile", "tool", "library", "other"]),
      stack: s.array(s.string()).default([]),
      role: s.string(),
      status: s.enum(["shipped", "in-progress", "archived"]).default("shipped"),
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
      remote: s.boolean().default(false),
      summary: s.string(),
      highlights: s.array(s.string()).default([]),
      stack: s.array(s.string()).default([]),
      logo: logo.optional(),
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
      logo: logo.optional(),
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
    url: s.string().url().optional(),
  }),
});

const socials = defineCollection({
  name: "Social",
  pattern: "data/socials.json",
  schema: s.object({
    label: s.string(),
    href: s.string().url(),
    icon: s.string(),
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
    about,
    posts,
    projects,
    experiences,
    education,
    skills,
    stacks,
    socials,
  },
  markdown: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [rehypeSlug, [rehypePrettyCode, prettyCode]],
  },
  mdx: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [
      rehypeSlug,
      [rehypeAutolinkHeadings, { behavior: "wrap" }],
      [rehypePrettyCode, prettyCode],
    ],
  },
});
