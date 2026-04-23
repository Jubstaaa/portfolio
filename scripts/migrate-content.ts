#!/usr/bin/env bun
/**
 * Migrate legacy Payload/MongoDB export into content/ for velite.
 * Input: /Users/ilker/Documents/all/*.json
 * Output: content/*, .migrator-image-manifest.json, TODO.md additions
 */
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

const SOURCE_DIR = "/Users/ilker/Documents/all";
const REPO = process.cwd();
const CONTENT = join(REPO, "content");
const MANIFEST_PATH = join(REPO, ".migrator-image-manifest.json");
const TODO_PATH = join(REPO, "TODO.md");

const SUPABASE_BASE =
  "https://jteaisioximzsuyrcetk.supabase.co/storage/v1/object/public/portfolio-typescript";

// ───── Types (mongo raw shape) ────────────────────────────────────────────────

interface MongoMedia {
  _id: string;
  alt: string | null;
  filename: string;
  url: string;
  width: number;
  height: number;
  mimeType: string;
}

interface MongoBlog {
  _id: string;
  name: string;
  description: string;
  slug: string;
  date: string;
  createdAt: string;
  blogCategoryId: string;
  mediaId: string;
  content: string;
}

interface MongoProject {
  _id: string;
  name: string;
  description: string | null;
  slug: string;
  createdAt: string;
  order: number | string;
  sourceUrl?: string | null;
  previewUrl?: string | null;
  projectCategoryId: string;
  mediaId: string;
  logoId?: string | null;
  stackIds: string[];
  stacks?: string[];
  content: string | null;
}

interface MongoExperience {
  _id: string;
  name: string;
  title: string;
  location: string;
  startDate: string;
  endDate: string | null;
  description: string | null;
  logo?: string | null;
  mediaId: string;
}

interface MongoEducation {
  _id: string;
  name: string;
  department: string;
  location: string;
  startDate: string;
  endDate: string | null;
  description: string | null;
  logo?: string | null;
  mediaId: string;
}

interface MongoSkill {
  _id: string;
  name: string;
}

interface MongoStack {
  _id: string;
  name: string;
  icon: string;
  color: string;
  description: string;
  url: string | null;
  order: number | string | null;
}

interface MongoSocial {
  _id: string;
  name: string;
  icon: string;
  color: string;
  username: string | null;
  url: string;
  order: number | string | null;
}

interface MongoCategory {
  _id: string;
  name: string;
}

interface MongoUser {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  title: string;
  location: string;
  bio: string;
  image: string | null;
  mediaId?: string;
}

// ───── Parsing ────────────────────────────────────────────────────────────────

function parseMongoExport<T>(path: string): T[] {
  if (!existsSync(path)) return [];
  const text = readFileSync(path, "utf-8");
  if (!text.trim()) return [];
  const flat = text.replace(/\],\s*\{/g, ",{");
  let parsed: unknown[];
  try {
    parsed = JSON.parse(flat) as unknown[];
  } catch {
    throw new Error(`Parse failed for ${path}. Dump format unexpected.`);
  }
  const seen = new Set<string>();
  const out: T[] = [];
  for (const rawDoc of parsed) {
    const doc = unwrap(rawDoc) as Record<string, unknown>;
    const id = typeof doc._id === "string" ? doc._id : undefined;
    if (id && seen.has(id)) continue;
    if (id) seen.add(id);
    out.push(doc as T);
  }
  return out;
}

function unwrap<T>(value: T): T {
  if (typeof value === "string") {
    if (value.startsWith('{"$oid"')) {
      try {
        return (JSON.parse(value) as { $oid: string }).$oid as T;
      } catch {
        return value;
      }
    }
    if (value.startsWith('{"$date"')) {
      try {
        return (JSON.parse(value) as { $date: string }).$date as T;
      } catch {
        return value;
      }
    }
    if (value.startsWith("[") && value.includes("$oid")) {
      try {
        const arr = JSON.parse(value) as Array<{ $oid?: string }>;
        return arr.map((o) => o.$oid ?? "").filter(Boolean) as T;
      } catch {
        return value;
      }
    }
    // Try to coerce numeric strings
    if (/^-?\d+(\.\d+)?$/.test(value)) {
      return Number(value) as T;
    }
    return value;
  }
  if (Array.isArray(value)) return value.map((v) => unwrap(v)) as T;
  if (value && typeof value === "object") {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      if (k === "__v") continue;
      out[k] = unwrap(v);
    }
    return out as T;
  }
  return value;
}

// ───── Helpers ────────────────────────────────────────────────────────────────

function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/ı/g, "i")
    .replace(/ş/g, "s")
    .replace(/ç/g, "c")
    .replace(/ğ/g, "g")
    .replace(/ö/g, "o")
    .replace(/ü/g, "u")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
}

function ymd(date: string | undefined | null): string | undefined {
  if (!date) return undefined;
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return undefined;
  return d.toISOString().slice(0, 10);
}

function ym(date: string | undefined | null): string | undefined {
  const full = ymd(date);
  return full?.slice(0, 7);
}

function writeFile(path: string, content: string): void {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, content, "utf-8");
}

// ───── Image manifest ─────────────────────────────────────────────────────────

interface ImageDownload {
  url: string;
  path: string; // relative to repo root, e.g. "public/images/blog/foo/cover.webp"
  description: string;
}

const imageManifest: ImageDownload[] = [];
function queueImage(url: string, path: string, description: string): void {
  if (!url) return;
  if (imageManifest.find((m) => m.path === path)) return;
  imageManifest.push({ url, path, description });
}

function extOf(filename: string): string {
  const m = filename.match(/\.([a-z0-9]+)$/i);
  return m ? m[1]!.toLowerCase() : "webp";
}

// ───── Lexical → Markdown ─────────────────────────────────────────────────────

type LexicalNode = {
  type: string;
  children?: LexicalNode[];
  text?: string;
  format?: number | string;
  tag?: string;
  listType?: "bullet" | "number" | "check";
  url?: string;
  language?: string;
  value?: unknown;
  fields?: { url?: string; doc?: unknown; linkType?: string };
  relationTo?: string;
  [k: string]: unknown;
};

interface ConvertContext {
  mediaMap: Map<string, MongoMedia>;
  slug: string;
  kind: "blog" | "project";
  todos: string[];
}

function convertLexical(contentString: string, ctx: ConvertContext): string {
  if (!contentString) return "";
  const lex = JSON.parse(contentString) as { root: LexicalNode };
  return renderBlocks(lex.root.children ?? [], ctx).trim() + "\n";
}

function renderBlocks(nodes: LexicalNode[], ctx: ConvertContext): string {
  return nodes
    .map((n) => renderBlock(n, ctx))
    .filter(Boolean)
    .join("\n\n");
}

function renderBlock(node: LexicalNode, ctx: ConvertContext): string {
  switch (node.type) {
    case "heading": {
      const tag = (node.tag as string) ?? "h2";
      const level = Math.max(1, Math.min(6, Number(tag.replace("h", "")) || 2));
      const text = renderInline(node.children ?? [], ctx);
      return "#".repeat(level) + " " + text;
    }
    case "paragraph": {
      const text = renderInline(node.children ?? [], ctx);
      return text || "";
    }
    case "list":
      return renderList(node, ctx, "");
    case "quote": {
      return "> " + renderInline(node.children ?? [], ctx);
    }
    case "horizontalrule":
    case "horizontalRule":
      return "---";
    case "code": {
      const lang = (node.language as string) ?? "";
      const code = (node.children ?? [])
        .map((c) => c.text ?? "")
        .join("")
        .replace(/\r\n?/g, "\n");
      return `\`\`\`${lang}\n${code}\n\`\`\``;
    }
    case "upload":
      return handleUpload(node, ctx);
    case "linebreak":
      return "";
    default:
      throw new Error(`Unknown Lexical block type "${node.type}" in ${ctx.kind}/${ctx.slug}`);
  }
}

function renderInline(nodes: LexicalNode[], ctx: ConvertContext): string {
  return nodes.map((n) => renderInlineNode(n, ctx)).join("");
}

function renderList(node: LexicalNode, ctx: ConvertContext, indent: string): string {
  return (node.children ?? [])
    .map((li, i) => {
      const marker = node.listType === "number" ? `${i + 1}.` : "-";
      return renderListItem(li, marker, ctx, indent);
    })
    .join("\n");
}

function renderListItem(
  li: LexicalNode,
  marker: string,
  ctx: ConvertContext,
  indent: string,
): string {
  // A listitem's children are a mix of inline nodes and (optionally) nested lists.
  // Collapse consecutive inline nodes into one rendered string, render nested lists
  // as indented blocks on their own lines.
  const lines: string[] = [];
  let inlineBuffer = "";
  const flush = () => {
    if (inlineBuffer) {
      lines.push(inlineBuffer);
      inlineBuffer = "";
    }
  };
  for (const child of li.children ?? []) {
    if (child.type === "list") {
      flush();
      lines.push(renderList(child, ctx, indent + "  "));
    } else {
      inlineBuffer += renderInlineNode(child, ctx);
    }
  }
  flush();
  if (lines.length === 0) return `${indent}${marker} `;
  const [first, ...rest] = lines;
  const head = `${indent}${marker} ${first ?? ""}`;
  return rest.length ? `${head}\n${rest.join("\n")}` : head;
}

function renderInlineNode(node: LexicalNode, ctx: ConvertContext): string {
  if (node.type === "text") {
    let text = node.text ?? "";
    const format = typeof node.format === "number" ? node.format : 0;
    // Bitflags: 1=bold, 2=italic, 4=underline, 8=strikethrough, 16=code
    if (format & 16) text = "`" + text + "`";
    if (format & 8) text = "~~" + text + "~~";
    if (format & 1) text = `**${text}**`;
    if (format & 2) text = `*${text}*`;
    if (format & 4) text = `<u>${text}</u>`;
    return text;
  }
  if (node.type === "link" || node.type === "autolink") {
    const url = (node.url as string) ?? node.fields?.url ?? "";
    const text = renderInline(node.children ?? [], ctx);
    if (!url) return text;
    return `[${text}](${url})`;
  }
  if (node.type === "linebreak") return "  \n";
  if (node.type === "upload") return handleUpload(node, ctx);
  // Block-level nodes occasionally appear inside a paragraph (Lexical quirk).
  // Emit them as their block form, surrounded by blank lines, so markdown stays valid.
  if (
    node.type === "horizontalrule" ||
    node.type === "horizontalRule" ||
    node.type === "list" ||
    node.type === "quote" ||
    node.type === "heading" ||
    node.type === "code"
  ) {
    return `\n\n${renderBlock(node, ctx)}\n\n`;
  }
  throw new Error(`Unknown Lexical inline type "${node.type}" in ${ctx.kind}/${ctx.slug}`);
}

function handleUpload(node: LexicalNode, ctx: ConvertContext): string {
  const value = node.value as
    | { id?: string; _id?: string; alt?: string; filename?: string; url?: string }
    | string
    | undefined;
  let mediaId: string | undefined;
  let altFromValue = "";
  if (typeof value === "object" && value) {
    mediaId = value.id ?? value._id;
    altFromValue = value.alt ?? "";
  } else if (typeof value === "string") {
    mediaId = value;
  }
  if (!mediaId) {
    throw new Error(`Upload node has no mediaId in ${ctx.kind}/${ctx.slug}`);
  }
  const media = ctx.mediaMap.get(mediaId);
  if (!media) {
    throw new Error(`Upload references unknown mediaId ${mediaId} in ${ctx.kind}/${ctx.slug}`);
  }
  const alt = altFromValue || media.alt || "";
  const area = ctx.kind === "blog" ? "blog" : "projects";
  const localPath = `/images/${area}/${ctx.slug}/${media.filename}`;
  queueImage(
    `${SUPABASE_BASE}/${media.filename}`,
    `public${localPath}`,
    `${ctx.kind}/${ctx.slug} inline image`,
  );
  return `![${alt.replace(/"/g, '\\"')}](${localPath})`;
}

// ───── Reference maps ─────────────────────────────────────────────────────────

function buildMap<T extends { _id: string }>(docs: T[]): Map<string, T> {
  const m = new Map<string, T>();
  for (const d of docs) m.set(d._id, d);
  return m;
}

// ───── Category mappers ───────────────────────────────────────────────────────

const PROJECT_CATEGORY: Record<string, string> = {
  "Web App": "web",
  "Mobile App": "mobile",
  "Browser Extension": "tool",
  Service: "tool",
  Game: "other",
};

const STACK_CATEGORY: Record<string, string> = {
  // framework
  "Next.js": "framework",
  "Next js": "framework",
  Nuxt: "framework",
  Astro: "framework",
  Remix: "framework",
  SvelteKit: "framework",
  "React Native": "framework",
  Expo: "framework",
  Tauri: "framework",
  Electron: "framework",
  Hono: "framework",
  NestJS: "framework",
  Express: "framework",
  Fastify: "framework",
  // library
  React: "library",
  Vue: "library",
  Svelte: "library",
  "React Router": "library",
  "Framer Motion": "library",
  Motion: "library",
  "Redux Toolkit": "library",
  Zustand: "library",
  "Tanstack Query": "library",
  "React Query": "library",
  "React Hook Form": "library",
  Zod: "library",
  Drizzle: "library",
  Prisma: "library",
  Mongoose: "library",
  tRPC: "library",
  Axios: "library",
  // lang
  TypeScript: "lang",
  JavaScript: "lang",
  Python: "lang",
  Go: "lang",
  Rust: "lang",
  "C#": "lang",
  Java: "lang",
  Kotlin: "lang",
  Swift: "lang",
  // infra
  Vercel: "infra",
  Netlify: "infra",
  AWS: "infra",
  Cloudflare: "infra",
  Supabase: "infra",
  Firebase: "infra",
  PostgreSQL: "infra",
  MySQL: "infra",
  MongoDB: "infra",
  Redis: "infra",
  Docker: "infra",
  Kubernetes: "infra",
  // tooling
  Git: "tooling",
  GitHub: "tooling",
  GitLab: "tooling",
  Bun: "tooling",
  pnpm: "tooling",
  Vite: "tooling",
  Webpack: "tooling",
  Turbopack: "tooling",
  ESLint: "tooling",
  Prettier: "tooling",
  Playwright: "tooling",
  Jest: "tooling",
  Vitest: "tooling",
  Storybook: "tooling",
  // design
  "Tailwind CSS": "design",
  Tailwind: "design",
  "shadcn/ui": "design",
  Figma: "design",
  Sass: "design",
  "Styled Components": "design",
  "CSS Modules": "design",
  Ant: "design",
  MUI: "design",
};

const SOCIAL_ICON: Record<string, { icon: string; needsReview?: boolean }> = {
  "mdi:github": { icon: "github" },
  "mdi:gmail": { icon: "mail" },
  "mdi:instagram": { icon: "instagram" },
  "mdi:linkedin": { icon: "linkedin" },
  "mdi:twitter": { icon: "twitter" },
  "mdi:reddit": { icon: "circle-user", needsReview: true },
  "mdi:spotify": { icon: "music", needsReview: true },
  "ri:discord-fill": { icon: "message-square", needsReview: true },
};

// ───── TODOs ──────────────────────────────────────────────────────────────────

const todos: string[] = [];
function todo(area: string, item: string): void {
  todos.push(`- **${area}**: ${item}`);
}

// ───── Main ───────────────────────────────────────────────────────────────────

function main(): void {
  // Clean stale output
  rmSync(CONTENT, { recursive: true, force: true });
  mkdirSync(CONTENT, { recursive: true });

  // Load sources
  const media = parseMongoExport<MongoMedia>(join(SOURCE_DIR, "media.json"));
  const blogs = parseMongoExport<MongoBlog>(join(SOURCE_DIR, "blogs.json"));
  const blogCategories = parseMongoExport<MongoCategory>(join(SOURCE_DIR, "blogCategories.json"));
  const projects = parseMongoExport<MongoProject>(join(SOURCE_DIR, "projects.json"));
  const projectCategories = parseMongoExport<MongoCategory>(
    join(SOURCE_DIR, "projectCategories.json"),
  );
  const experiences = parseMongoExport<MongoExperience>(join(SOURCE_DIR, "experiences.json"));
  const educations = parseMongoExport<MongoEducation>(join(SOURCE_DIR, "educations.json"));
  const skills = parseMongoExport<MongoSkill>(join(SOURCE_DIR, "skills.json"));
  const stacks = parseMongoExport<MongoStack>(join(SOURCE_DIR, "stacks.json"));
  const socials = parseMongoExport<MongoSocial>(join(SOURCE_DIR, "socials.json"));
  const users = parseMongoExport<MongoUser>(join(SOURCE_DIR, "users.json"));

  const mediaMap = buildMap(media);
  const blogCatMap = buildMap(blogCategories);
  const projCatMap = buildMap(projectCategories);
  const stackMap = buildMap(stacks);

  const counts = {
    blog: 0,
    projects: 0,
    experiences: 0,
    education: 0,
    skills: 0,
    stacks: 0,
    socials: 0,
  };

  // ─── Site ───────────────────────────────────────────────────────────────────
  const user = users[0];
  if (!user) throw new Error("No user in users.json");

  const avatarExt = user.mediaId
    ? extOf(mediaMap.get(user.mediaId)?.filename ?? "avatar.webp")
    : user.image
      ? extOf(user.image)
      : "webp";
  const avatarLocal = `/images/site/avatar.${avatarExt}`;
  if (user.mediaId) {
    const m = mediaMap.get(user.mediaId);
    if (m) {
      queueImage(
        `${SUPABASE_BASE}/${m.filename}`,
        `public${avatarLocal}`,
        "site avatar (from user.mediaId)",
      );
    } else if (user.image) {
      queueImage(user.image, `public${avatarLocal}`, "site avatar (user.image fallback)");
    }
  } else if (user.image) {
    queueImage(user.image, `public${avatarLocal}`, "site avatar (from user.image)");
  } else {
    todo("site", "no avatar found — add one at public/images/site/avatar.webp");
  }

  const site = {
    name: `${user.firstName} ${user.lastName}`.trim(),
    handle: "ilker",
    role: "Software Engineer",
    location: user.location?.replace(/,\s*TR$/i, "").replace("İstanbul", "Istanbul") ?? "",
    title: `${user.firstName} ${user.lastName} — Software Engineer`,
    description: "Senior frontend engineer building fast, accessible interfaces.",
    url: "https://example.com",
    email: user.email,
    locale: "en" as const,
    ogDefault: "/opengraph-image",
    nav: [
      { label: "projects", href: "/projects" },
      { label: "about", href: "/about" },
      { label: "blog", href: "/blog" },
      { label: "contact", href: "/contact" },
    ],
    avatar: { src: avatarLocal, alt: `${user.firstName} ${user.lastName}` },
  };
  writeFile(join(CONTENT, "site.json"), JSON.stringify(site, null, 2));
  todo("site", `replace placeholder url "${site.url}" with real domain`);
  todo("site", `review description — currently "${site.description}"`);

  // ─── About (bio) ────────────────────────────────────────────────────────────
  const bio = user.bio?.trim() ?? "";
  const aboutBody = bio || "_TODO: write bio in content/about.mdx_";
  const aboutMdx = `---\ntitle: About\n---\n\n${aboutBody}\n`;
  writeFile(join(CONTENT, "about.mdx"), aboutMdx);
  if (!bio) todo("about", "write long-form bio in content/about.mdx");

  // ─── Blog posts ─────────────────────────────────────────────────────────────
  for (const blog of blogs) {
    const slug = blog.slug || slugify(blog.name);
    const cat = blogCatMap.get(blog.blogCategoryId);
    const category = cat ? cat.name.toLowerCase() : "general";
    if (!cat) todo("blog", `post "${slug}" has unknown category id ${blog.blogCategoryId}`);

    const coverMedia = mediaMap.get(blog.mediaId);
    let coverFrontmatter = "";
    if (coverMedia) {
      const localCover = `/images/blog/${slug}/cover.${extOf(coverMedia.filename)}`;
      queueImage(
        `${SUPABASE_BASE}/${coverMedia.filename}`,
        `public${localCover}`,
        `blog/${slug} cover`,
      );
      coverFrontmatter = `cover:\n  src: ${localCover}\n  alt: ${JSON.stringify(coverMedia.alt ?? blog.name)}\n`;
    } else {
      todo("blog", `post "${slug}" references missing mediaId ${blog.mediaId}`);
    }

    const ctx: ConvertContext = { mediaMap, slug, kind: "blog", todos };
    let body: string;
    try {
      body = convertLexical(blog.content, ctx);
    } catch (e) {
      throw new Error(`Lexical conversion failed for blog "${slug}": ${(e as Error).message}`);
    }

    const frontmatter = [
      "---",
      `title: ${JSON.stringify(blog.name)}`,
      `description: ${JSON.stringify(blog.description ?? "")}`,
      `date: ${ymd(blog.date) ?? ymd(blog.createdAt)}`,
      `category: ${category}`,
      "tags: []",
      "draft: false",
      coverFrontmatter.trim(),
      "---",
      "",
    ]
      .filter(Boolean)
      .join("\n");

    writeFile(join(CONTENT, "blog", `${slug}.mdx`), frontmatter + "\n" + body);
    counts.blog++;
    todo("blog", `post "${slug}" — pick tags (currently empty)`);
  }

  // ─── Projects ───────────────────────────────────────────────────────────────
  for (const project of projects) {
    const slug = project.slug || slugify(project.name);
    const cat = projCatMap.get(project.projectCategoryId);
    const categoryName = cat?.name ?? "Web App";
    const category = PROJECT_CATEGORY[categoryName] ?? "other";
    if (!cat) todo("projects", `"${slug}" has unknown category id ${project.projectCategoryId}`);
    if (!PROJECT_CATEGORY[categoryName]) {
      todo("projects", `"${slug}" category "${categoryName}" → fell back to "other" — review`);
    }

    const stackNames: string[] = [];
    for (const id of project.stackIds ?? []) {
      const s = stackMap.get(id);
      if (s) stackNames.push(s.name);
      else todo("projects", `"${slug}" references unknown stack id ${id}`);
    }

    const images: Array<{ src: string; alt: string }> = [];
    const coverMedia = mediaMap.get(project.mediaId);
    if (coverMedia) {
      const localCover = `/images/projects/${slug}/cover.${extOf(coverMedia.filename)}`;
      queueImage(
        `${SUPABASE_BASE}/${coverMedia.filename}`,
        `public${localCover}`,
        `projects/${slug} cover`,
      );
      images.push({ src: localCover, alt: coverMedia.alt ?? project.name });
    } else {
      todo("projects", `"${slug}" references missing cover mediaId ${project.mediaId}`);
    }
    let descriptionMd = "";
    if (project.content) {
      const ctx: ConvertContext = { mediaMap, slug, kind: "project", todos };
      try {
        descriptionMd = convertLexical(project.content, ctx);
      } catch (e) {
        throw new Error(`Lexical conversion failed for project "${slug}": ${(e as Error).message}`);
      }
    }

    const summary = project.description ?? "";
    const body = descriptionMd || summary;
    const fmLines: string[] = [
      "---",
      `title: ${JSON.stringify(project.name)}`,
      `summary: ${JSON.stringify(summary)}`,
      `category: ${category}`,
      `role: ${JSON.stringify("Creator")}`,
      `status: shipped`,
    ];
    if (project.sourceUrl) fmLines.push(`repo: ${JSON.stringify(project.sourceUrl)}`);
    if (project.previewUrl) fmLines.push(`url: ${JSON.stringify(project.previewUrl)}`);
    fmLines.push(`stack: ${JSON.stringify(stackNames)}`);
    fmLines.push(`highlights: []`);
    if (images.length > 0) {
      fmLines.push("images:");
      for (const img of images) {
        fmLines.push(`  - src: ${JSON.stringify(img.src)}`);
        fmLines.push(`    alt: ${JSON.stringify(img.alt)}`);
      }
    } else {
      fmLines.push("images: []");
    }
    fmLines.push("---", "");
    writeFile(join(CONTENT, "projects", `${slug}.mdx`), fmLines.join("\n") + "\n" + body + "\n");
    counts.projects++;
    todo("projects", `"${slug}" — fill highlights[], review role/status`);
  }

  // ─── Experiences ────────────────────────────────────────────────────────────
  const expSorted = [...experiences].sort((a, b) =>
    (b.startDate ?? "").localeCompare(a.startDate ?? ""),
  );
  expSorted.forEach((exp, i) => {
    const slug = slugify(exp.name);
    const num = String(i + 1).padStart(2, "0");

    // Prefer mediaId (Supabase), fall back to logo (Vercel Blob)
    const m = mediaMap.get(exp.mediaId);
    let logo: { src: string; alt: string } | undefined;
    if (m) {
      const local = `/images/experiences/${slug}/logo.${extOf(m.filename)}`;
      queueImage(
        `${SUPABASE_BASE}/${m.filename}`,
        `public${local}`,
        `experiences/${slug} logo (supabase)`,
      );
      logo = { src: local, alt: `${exp.name} logo` };
    } else if (exp.logo) {
      const local = `/images/experiences/${slug}/logo.${extOf(exp.logo)}`;
      queueImage(exp.logo, `public${local}`, `experiences/${slug} logo (direct URL)`);
      logo = { src: local, alt: `${exp.name} logo` };
    } else {
      todo("experiences", `"${exp.name}" has no logo reference`);
    }

    const record = {
      company: exp.name,
      role: exp.title,
      start: ym(exp.startDate) ?? "",
      ...(exp.endDate ? { end: ym(exp.endDate) } : {}),
      location: exp.location,
      remote: false,
      summary: exp.description ?? "",
      highlights: [] as string[],
      stack: [] as string[],
      ...(logo ? { logo } : {}),
    };
    writeFile(join(CONTENT, "experiences", `${num}-${slug}.json`), JSON.stringify(record, null, 2));
    counts.experiences++;
    todo("experiences", `"${exp.name}" — fill highlights[] and stack[] (both currently empty)`);
  });

  // ─── Education (only Software Engineering per user spec) ───────────────────
  const seMatch = educations.find((e) => /software\s*engineer/i.test(`${e.department} ${e.name}`));
  const seEdu = seMatch ?? null;
  if (seEdu) {
    const slug = slugify(seEdu.name);
    const logoMedia = mediaMap.get(seEdu.mediaId);
    let logo: { src: string; alt: string } | undefined;
    if (logoMedia) {
      const local = `/images/education/${slug}/logo.${extOf(logoMedia.filename)}`;
      queueImage(
        `${SUPABASE_BASE}/${logoMedia.filename}`,
        `public${local}`,
        `education/${slug} logo (supabase)`,
      );
      logo = { src: local, alt: `${seEdu.name} logo` };
    } else if (seEdu.logo) {
      const local = `/images/education/${slug}/logo.${extOf(seEdu.logo)}`;
      queueImage(seEdu.logo, `public${local}`, `education/${slug} logo (direct URL)`);
      logo = { src: local, alt: `${seEdu.name} logo` };
    }
    const record = {
      school: seEdu.name,
      degree: "BSc in Software Engineering",
      start: ym(seEdu.startDate) ?? "",
      // end deliberately omitted (ongoing) per user spec
      location: seEdu.location,
      ...(seEdu.description ? { notes: seEdu.description } : {}),
      ...(logo ? { logo } : {}),
    };
    writeFile(join(CONTENT, "education", `01-${slug}.json`), JSON.stringify(record, null, 2));
    counts.education++;
  } else {
    // Placeholder
    const placeholder = {
      school: "TODO: your Software Engineering school",
      degree: "BSc in Software Engineering",
      start: "2021-09",
      location: "Istanbul, Turkey",
    };
    writeFile(
      join(CONTENT, "education", "01-placeholder.json"),
      JSON.stringify(placeholder, null, 2),
    );
    counts.education++;
    todo("education", "no Software Engineering record found in dump — fill placeholder");
  }

  // ─── Skills ─────────────────────────────────────────────────────────────────
  const skillsOut = skills.map((s) => {
    const name = s.name.trim();
    return { name, category: "frontend" as const };
  });
  writeFile(join(CONTENT, "data", "skills.json"), JSON.stringify(skillsOut, null, 2));
  counts.skills = skillsOut.length;
  todo("skills", `review category for each skill (all currently "frontend")`);

  // ─── Stacks ─────────────────────────────────────────────────────────────────
  const stacksOut = [...stacks]
    .sort((a, b) => Number(a.order ?? 0) - Number(b.order ?? 0))
    .map((s) => {
      const name = s.name.trim();
      const category = STACK_CATEGORY[name];
      if (!category) {
        todo(
          "stacks",
          `"${name}" has no curated category → defaulted to "library" — pick correct one`,
        );
      }
      return {
        name,
        category: category ?? ("library" as const),
        ...(s.url ? { url: s.url } : {}),
      };
    });
  writeFile(join(CONTENT, "data", "stacks.json"), JSON.stringify(stacksOut, null, 2));
  counts.stacks = stacksOut.length;

  // ─── Socials ────────────────────────────────────────────────────────────────
  const socialsOut = [...socials]
    .sort((a, b) => Number(a.order ?? 0) - Number(b.order ?? 0))
    .map((s) => {
      const mapping = SOCIAL_ICON[s.icon];
      if (!mapping) {
        todo("socials", `"${s.name}" icon "${s.icon}" has no lucide mapping — using "link"`);
      } else if (mapping.needsReview) {
        todo(
          "socials",
          `"${s.name}" icon "${s.icon}" → "${mapping.icon}" (Lucide lacks a native one) — review`,
        );
      }
      return {
        label: s.name,
        href: s.url,
        icon: mapping?.icon ?? "link",
      };
    });
  writeFile(join(CONTENT, "data", "socials.json"), JSON.stringify(socialsOut, null, 2));
  counts.socials = socialsOut.length;

  // ─── Image manifest ─────────────────────────────────────────────────────────
  writeFile(MANIFEST_PATH, JSON.stringify(imageManifest, null, 2));

  // ─── TODO.md ────────────────────────────────────────────────────────────────
  writeTodoFile();

  // ─── Report ─────────────────────────────────────────────────────────────────
  console.log("\nMigration complete");
  console.log("==================");
  for (const [k, v] of Object.entries(counts)) console.log(`  ${k}: ${v}`);
  console.log(`  images queued: ${imageManifest.length}`);
  console.log(`  todo items: ${todos.length}`);
  console.log(`\nManifest: ${MANIFEST_PATH}`);
  console.log(`TODO: ${TODO_PATH}`);
}

function writeTodoFile(): void {
  const buckets: Record<string, string[]> = {};
  for (const t of todos) {
    const m = t.match(/^- \*\*([^*]+)\*\*:/);
    const area = m?.[1] ?? "misc";
    (buckets[area] ??= []).push(t.replace(/^- \*\*[^*]+\*\*:\s*/, "- "));
  }
  const sections: string[] = [
    "# TODO",
    "",
    "Items surfaced by `bun run content:migrate`. Replace / review / resolve before the site goes live.",
    "",
  ];
  for (const area of Object.keys(buckets).sort()) {
    sections.push(`## ${area}`);
    sections.push("");
    sections.push(...buckets[area]!);
    sections.push("");
  }
  sections.push("## image downloads");
  sections.push("");
  sections.push("Any failures from `bun run content:download-images` are appended below.");
  sections.push("");
  writeFile(TODO_PATH, sections.join("\n"));
}

main();
