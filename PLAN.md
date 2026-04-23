# Portfolio + Blog — Implementation Plan

**Goal:** Static personal site (portfolio + MDX blog) on Next.js 16 / React 19 / Tailwind 4, deployed to Vercel, Lighthouse 95+ hard target.

**Architecture:** App Router, Server Components by default. Content is build-time via velite (Zod-validated MDX + JSON). No DB, no API routes except `next/og` and RSS. CSS-first animations; `motion/react` only for DOM-transition cases CSS can't express. View Transitions API progressively enhances blog-list→post and project-list→detail.

**Stack (pinned at install):**

- next@16 • react@19 • typescript@5.9
- tailwindcss@4 • @tailwindcss/postcss • tailwindcss-animate
- shadcn/ui (Tailwind v4 + React 19 preset) • lucide-react
- velite@latest • zod • remark-gfm • rehype-slug • rehype-autolink-headings • rehype-pretty-code • shiki
- motion@latest • next-themes • geist
- @vercel/analytics • @vercel/speed-insights
- bun • eslint@9 (flat) • prettier • prettier-plugin-tailwindcss • husky • lint-staged • @commitlint/{cli,config-conventional}

> Versions confirmed at install time via `bun add` (no hand-written pins). Lockfile is `bun.lock`.

---

## File Structure

```
portfolio/
├── PLAN.md
├── CLAUDE.md
├── TODO.md                             # created in S02 — content to replace
├── README.md
├── package.json
├── bun.lock
├── tsconfig.json
├── next.config.ts
├── postcss.config.mjs
├── eslint.config.mjs
├── prettier.config.mjs
├── commitlint.config.mjs
├── velite.config.ts
├── .husky/
│   ├── pre-commit                      # lint-staged
│   └── commit-msg                      # commitlint
├── .vscode/settings.json               # format on save (optional)
├── public/
│   ├── favicon.ico
│   ├── icon.svg
│   ├── icon-dark.svg
│   ├── apple-touch-icon.png
│   ├── manifest.webmanifest
│   ├── og/ (generated-at-build assets cached here if needed)
│   └── images/projects/...
├── content/
│   ├── site.json                       # SiteConfig
│   ├── about.mdx                       # long-form bio rendered by /about in Prose wrapper
│   ├── blog/
│   │   ├── hello-world.mdx
│   │   ├── edge-streaming-mdx.mdx
│   │   └── typed-content-velite.mdx
│   ├── projects/
│   │   ├── prosbase-v2.json
│   │   ├── hono-telescope.json
│   │   ├── pixel-guess.json
│   │   ├── statbox.json
│   │   └── wvw-dev-pr.json
│   ├── experiences/
│   │   ├── 01-acme.json
│   │   ├── 02-initech.json
│   │   └── 03-startup.json
│   ├── education/
│   │   └── 01-university.json
│   └── data/
│       ├── skills.json
│       ├── stacks.json
│       └── socials.json
├── src/
│   ├── app/
│   │   ├── layout.tsx                  # root, html[lang], theme provider, fonts, analytics
│   │   ├── page.tsx                    # Hero
│   │   ├── globals.css                 # Tailwind import + @theme tokens + view-transition CSS
│   │   ├── opengraph-image.tsx         # site-wide OG
│   │   ├── twitter-image.tsx
│   │   ├── icon.tsx                    # dynamic favicon (optional)
│   │   ├── sitemap.ts
│   │   ├── robots.ts
│   │   ├── feed.xml/route.ts           # RSS
│   │   ├── not-found.tsx
│   │   ├── error.tsx
│   │   ├── about/page.tsx
│   │   ├── contact/page.tsx
│   │   ├── projects/
│   │   │   ├── page.tsx
│   │   │   └── [slug]/
│   │   │       ├── page.tsx
│   │   │       └── opengraph-image.tsx
│   │   └── blog/
│   │       ├── page.tsx
│   │       ├── category/[slug]/page.tsx
│   │       └── [slug]/
│   │           ├── page.tsx
│   │           └── opengraph-image.tsx
│   ├── components/
│   │   ├── ui/                         # shadcn primitives (button, badge, separator, tabs, …)
│   │   ├── Nav/                        # Nav.tsx + index.ts
│   │   ├── Footer/
│   │   ├── ThemeToggle/
│   │   ├── Logo/
│   │   ├── SectionHeading/
│   │   ├── Prose/                      # typography wrapper for MDX
│   │   ├── CodeBlock/                  # Shiki output + copy button
│   │   ├── Toc/
│   │   ├── ReadingProgress/
│   │   ├── ProjectCard/
│   │   ├── ProjectFilters/             # 'use client'
│   │   ├── ProjectGallery/
│   │   ├── BlogCard/
│   │   ├── BlogFilters/                # 'use client'
│   │   ├── Timeline/
│   │   ├── SkillsGrid/
│   │   ├── StacksGrid/
│   │   ├── SocialLinks/
│   │   ├── MdxComponents/              # map for velite MDX
│   │   ├── Reveal/                     # 'use client' — in-view fade/slide (motion/react)
│   │   └── ViewTransitionLink/         # 'use client' — startViewTransition wrapper
│   ├── lib/
│   │   ├── site.ts                     # typed site config accessor
│   │   ├── content.ts                  # sort/filter/lookup helpers over velite outputs
│   │   ├── mdx.ts                      # MDX runtime helpers
│   │   ├── seo.ts                      # generateMetadata builders + JSON-LD factories
│   │   ├── og.ts                       # next/og helpers (font loading, shared layout)
│   │   ├── rss.ts                      # feed builder
│   │   ├── reading-time.ts             # (velite plugin covers this; kept for UI formatting)
│   │   ├── format.ts                   # date, duration
│   │   └── cn.ts                       # clsx+tailwind-merge
│   ├── styles/
│   │   └── tokens.css                  # @theme tokens (imported by globals.css)
│   ├── hooks/
│   │   ├── use-reduced-motion.ts
│   │   ├── use-reading-progress.ts
│   │   └── use-scroll-direction.ts
│   └── types/
│       └── content.d.ts                # re-exports velite types
└── .well-known/
    └── (reserved; not used in S01)
```

**Component folder rule:** `ComponentName/ComponentName.tsx` + `index.ts` re-export. Sub-components live as siblings in the same folder when local; promoted to top-level when reused.

---

## Content Models

All models declared as Zod schemas in `velite.config.ts`; types are emitted to `.velite/` and re-exported via `src/types/content.d.ts`. Below is the canonical shape.

```ts
interface SiteConfig {
  name: string;
  handle: string; // @handle, no leading @
  role: string; // hero display — e.g. "Software Engineer"
  location: string;
  title: string;
  description: string; // one sentence (hero/meta); long-form bio lives in content/about.mdx
  url: string; // https://…, no trailing slash
  email: string;
  locale: "en"; // English only — no i18n
  ogDefault: string; // /opengraph-image
  nav: Array<{ label: string; href: string }>;
  avatar?: { src: string; alt: string };
}

interface BlogPost {
  slug: string; // derived from filename; path is `/blog/${slug}` — derived at use site
  title: string;
  description: string;
  date: string; // ISO
  updated?: string;
  category: string; // single category (filterable)
  tags: string[];
  draft: boolean;
  featured: boolean;
  cover?: { src: string; alt: string };
  readingTime: number; // minutes, integer
  toc: Array<{ depth: 2 | 3 | 4; text: string; slug: string }>;
  body: string; // compiled MDX
  raw: string; // raw MDX source (for search/excerpts)
}

interface Project {
  slug: string; // path is `/projects/${slug}` — derived at use site
  title: string;
  summary: string; // ≤ 140 chars
  description: string; // MDX or plain
  category: "web" | "mobile" | "tool" | "library" | "other";
  stack: string[]; // references stacks[].name
  role: string;
  year: number;
  featured: boolean;
  status: "shipped" | "in-progress" | "archived";
  repo?: string;
  url?: string;
  images: Array<{ src: string; alt: string; caption?: string }>;
  highlights: string[]; // 3–6 bullets
}

interface Experience {
  slug: string;
  company: string;
  role: string;
  start: string; // YYYY-MM
  end?: string; // YYYY-MM | undefined (= present)
  location: string;
  remote: boolean;
  summary: string;
  highlights: string[];
  stack: string[];
}

interface Education {
  slug: string;
  school: string;
  degree: string;
  field: string;
  start: string;
  end?: string;
  location?: string;
  notes?: string;
}

interface Skill {
  name: string;
  category: "lang" | "frontend" | "backend" | "devops" | "design" | "other";
}

interface Stack {
  name: string;
  category: "framework" | "library" | "lang" | "infra" | "tooling" | "design";
  url?: string;
}

interface Social {
  label: string;
  href: string;
  icon: string; // lucide icon name
}
```

**MDX frontmatter example (authoritative):**

```yaml
---
title: Typed content with velite
description: Build-time Zod validation for MDX + JSON in Next.js.
date: 2026-03-14
category: tooling
tags: [next, mdx, velite, typescript]
draft: false
featured: true
cover:
  src: /images/blog/typed-content/cover.jpg
  alt: Source code on a dark terminal
---
```

---

## Design Tokens

Declared via Tailwind 4 `@theme` in `src/styles/tokens.css`. Dark is default; `.light` class flips. Theme provider sets the class on `<html>`.

### Color (OKLCH)

| Token               | Dark (default)          | Light                   |
| ------------------- | ----------------------- | ----------------------- |
| `--color-bg`        | `oklch(0.145 0.01 270)` | `oklch(0.99 0.005 270)` |
| `--color-fg`        | `oklch(0.97 0.01 270)`  | `oklch(0.18 0.02 270)`  |
| `--color-muted`     | `oklch(0.22 0.01 270)`  | `oklch(0.95 0.008 270)` |
| `--color-muted-fg`  | `oklch(0.68 0.02 270)`  | `oklch(0.45 0.02 270)`  |
| `--color-card`      | `oklch(0.18 0.01 270)`  | `oklch(1 0 0)`          |
| `--color-card-fg`   | `oklch(0.96 0.01 270)`  | `oklch(0.2 0.02 270)`   |
| `--color-border`    | `oklch(0.28 0.01 270)`  | `oklch(0.9 0.01 270)`   |
| `--color-ring`      | `oklch(0.74 0.16 240)`  | `oklch(0.55 0.18 240)`  |
| `--color-accent`    | `oklch(0.76 0.17 240)`  | `oklch(0.55 0.18 240)`  |
| `--color-accent-fg` | `oklch(0.12 0.02 270)`  | `oklch(0.99 0 0)`       |
| `--color-success`   | `oklch(0.78 0.15 150)`  | `oklch(0.55 0.17 150)`  |
| `--color-warning`   | `oklch(0.82 0.15 80)`   | `oklch(0.62 0.17 80)`   |
| `--color-danger`    | `oklch(0.72 0.2 25)`    | `oklch(0.55 0.2 25)`    |

> Accent is a single cool blue — swappable via one token. Keep chroma ≤ 0.18 to stay tasteful.

### Typography

- **Fonts:** `Geist Sans` (body/display), `Geist Mono` (code/labels). Loaded via `geist/font`.
- **Scale** (clamp, fluid):
  - `--text-display`: `clamp(3rem, 6vw + 1rem, 6rem)` — hero only
  - `--text-h1`: `clamp(2.25rem, 3vw + 1rem, 3.5rem)`
  - `--text-h2`: `clamp(1.75rem, 1.5vw + 1rem, 2.25rem)`
  - `--text-h3`: `1.5rem`
  - `--text-body`: `1rem` (16px base)
  - `--text-small`: `0.875rem`
  - `--text-mono`: `0.9375rem`
- **Tracking:** display `-0.04em`, h1/h2 `-0.02em`, body `0`, mono `0`.
- **Leading:** display 1.02, h\* 1.1, body 1.65, prose 1.7.
- **Weights:** 400 body, 500 UI, 600 headings, 700 display only.

### Spacing

Tailwind default scale plus:

- `--space-gutter`: `1.25rem` (mobile) / `2rem` (desktop)
- `--space-section`: `6rem` (mobile) / `9rem` (desktop)
- `--content-max`: `72ch` (prose) / `80rem` (layouts)

### Radii & Borders

- `--radius-sm`: `0.375rem`
- `--radius`: `0.625rem`
- `--radius-lg`: `1rem`
- Border width default `1px`, hairline via color alpha rather than width.

### Motion

- `--ease-out`: `cubic-bezier(0.22, 1, 0.36, 1)`
- `--ease-in-out`: `cubic-bezier(0.65, 0, 0.35, 1)`
- `--ease-spring`: `cubic-bezier(0.34, 1.56, 0.64, 1)`
- Durations: `--d-fast: 150ms`, `--d-base: 240ms`, `--d-slow: 420ms`, `--d-vt: 360ms` (view transition).
- `prefers-reduced-motion: reduce` zeroes all durations at the token layer (single source of truth):
  ```css
  @media (prefers-reduced-motion: reduce) {
    :root {
      --d-fast: 0ms;
      --d-base: 0ms;
      --d-slow: 0ms;
      --d-vt: 0ms;
    }
  }
  ```
- `motion/react` reads the same tokens via a tiny `useMotionConfig()` hook and also honors `useReducedMotion()` — so CSS and JS can't drift.

### View Transitions

- Enable with `<ViewTransition>` (React 19) or CSS-level `view-transition-name`. Scoped to:
  - Blog list ↔ post: share `view-transition-name: post-<slug>` on title and cover.
  - Project list ↔ detail: share `view-transition-name: project-<slug>` on card thumb.
- No JS fallback: links degrade to plain navigation when the API isn't supported.

---

## Slices

Each slice ends with: a passing `bun run typecheck && bun run lint && bun run build`, a single Conventional Commit, and an explicit demo checklist for you.

### S01 — Foundation + Design System

**Goal:** Bootable Next app with theme, tokens, shell layout, error/404, favicons, shadcn wired, lint/format/hook chain green.

**Files created:**

- `package.json`, `tsconfig.json`, `next.config.ts`, `postcss.config.mjs`
- `eslint.config.mjs`, `prettier.config.mjs`, `commitlint.config.mjs`
- `.husky/pre-commit`, `.husky/commit-msg`, `.gitignore`, `.editorconfig`
- `src/app/layout.tsx`, `src/app/page.tsx`, `src/app/globals.css`
- `src/app/not-found.tsx`, `src/app/error.tsx`
- `src/styles/tokens.css`
- `src/components/Nav/*`, `src/components/Footer/*`, `src/components/ThemeToggle/*`, `src/components/Logo/*`, `src/components/SectionHeading/*`
- `src/components/ui/*` (shadcn: button, badge, separator, dropdown-menu, tabs, tooltip — installed as needed)
- `src/lib/cn.ts`, `src/lib/site.ts` (stub), `src/hooks/use-reduced-motion.ts`
- `public/favicon.ico`, `public/icon.svg`, `public/icon-dark.svg`, `public/apple-touch-icon.png`, `public/manifest.webmanifest`

**Key steps:**

1. `bun create next-app portfolio --ts --eslint --tailwind --app --src-dir --turbopack --import-alias "@/*"` — used as template only; we're already in the directory, so bootstrap manually if the CLI refuses a non-empty dir.
2. Install & init shadcn/ui with the Tailwind v4 preset; enable React 19 peer override if prompted.
3. Drop `tokens.css` and `@theme` block into `globals.css`; verify `bg-background text-foreground` works via mapped Tailwind utilities.
4. Theme provider: `next-themes` with `attribute="class"`, `defaultTheme="dark"`, `enableSystem`, `storageKey="theme"`. Emit `suppressHydrationWarning` on `<html>`.
5. Shell: `Nav` (logo, routes, theme toggle), `Footer` (socials placeholder, copyright).
6. `not-found.tsx` + `error.tsx` — typography-driven, same visual system.
7. Favicon set — 32/180/512 PNG + SVG + ico; manifest with `theme_color` pulling from token.
8. Lint/format/hooks: ESLint flat (next/core-web-vitals, @typescript-eslint, tailwind plugin), Prettier + Tailwind plugin, husky+lint-staged, commitlint with conventional config.
9. `package.json` scripts: `dev`, `build`, `start`, `lint`, `typecheck`, `format`, `format:check`, `prepare`.

**Demo checklist:**

- `bun dev` → `/` renders hero placeholder in dark mode by default.
- Toggle flips to light, persists, respects system on first load.
- `/unknown-route` renders custom 404; throwing in a client component renders `error.tsx`.
- `bun run lint && bun run typecheck && bun run build` all pass.
- `git commit -m "foo"` fails commitlint; `git commit -m "chore: init"` passes.

**Commit:** `chore: bootstrap next 16, tailwind 4, shadcn, theme system`

---

### S02 — Content Pipeline + Placeholder Content

**Goal:** velite validates all content at build time. Typed accessors land. Placeholder content in place. TODO.md generated.

**Files created:**

- `velite.config.ts`
- `src/types/content.d.ts`
- `src/lib/content.ts` (helpers: `getAllPosts`, `getPostBySlug`, `getPostsByCategory`, `getAllCategories`, `getAllTags`, `getAllProjects`, `getProjectBySlug`, `getFeaturedProjects`, `getExperiencesSorted`, `getEducationSorted`, `getSkillsByCategory`)
- `src/lib/mdx.ts` — shared MDX component map (used in S04)
- `content/site.json`
- `content/about.mdx` (long-form bio — 3–5 paragraphs, rendered via Prose on /about above the timeline)
- `content/blog/*.mdx` (3 posts — one each: intro, a technical walk-through with ≥2 code blocks, an opinion piece)
- `content/projects/*.json` (5 entries; 2 featured)
- `content/experiences/*.json` (3), `content/education/*.json` (1–2)
- `content/data/{skills,stacks,socials}.json`
- `TODO.md`

**velite config highlights:**

- `root: 'content'`
- Collections: `site` (singleton), `about` (singleton MDX), `posts`, `projects`, `experiences`, `education`, `skills`, `stacks`, `socials`.
- MDX pipeline: `remark-gfm`, `rehype-slug`, `rehype-autolink-headings` (icon variant), `rehype-pretty-code` (Shiki, theme `github-dark-default` + `github-light`, transformer for copy).
- ToC extracted from rehype AST; `readingTime` computed via word count / 220 wpm.
- `onSuccess` hook writes `.velite/` which is gitignored; typegen into `src/types/content.d.ts` via re-export.
- Wire velite into `next.config.ts` via a small build plugin OR prepend `velite` before `next build` in the `build` script (simpler; chosen path).

**TODO.md contents:** exact list of files with placeholder copy, images to source/replace, socials/email to set, resume PDF optional, OG brand asset, and a "before first deploy" checklist.

**Demo checklist:**

- `bun run velite` completes clean; `.velite/` contains typed outputs.
- Import `getAllPosts` in a scratch page → autocompletion shows the schema.
- Intentional schema break (e.g. delete `date`) fails build with a helpful Zod error.
- `TODO.md` lists every placeholder field.

**Commit:** `feat(content): velite pipeline with zod-validated mdx + json`

---

### S03 — Home, About, Projects, Contact

**Goal:** Hero, About (bio/timeline/education/skills/stacks), Projects index with category+stack filters, project detail pages, Contact page (socials + email, no form).

**Files created/modified:**

- `src/app/page.tsx` — typography-driven hero: name, role, one-liner, inline availability, primary CTAs (Projects, Contact).
- `src/app/about/page.tsx` — Server Component. Reads `content/about.mdx` via velite and renders it inside the shared `Prose` wrapper (same MDX map as blog), followed by Experience timeline, Education, Skills grid, Stacks grid. One scroll.
- `src/app/projects/page.tsx` — grid + filter bar.
- `src/app/projects/[slug]/page.tsx` — summary, meta (role/year/stack), gallery, highlights bullets, long-form description (MDX if provided), links.
- `src/app/contact/page.tsx` — typography-led page: email (mailto, copy-to-clipboard button), `SocialLinks` grid, short "best way to reach me" blurb. No form.
- Components: `Timeline`, `SkillsGrid`, `StacksGrid`, `ProjectCard`, `ProjectFilters` ('use client'), `ProjectGallery`, `SocialLinks`, `CopyEmail` ('use client').
- `src/lib/seo.ts` — `buildMetadata()` and `buildPersonJsonLd()`, `buildProjectJsonLd()`.

**Filter behavior (projects) — server-driven:**

- URL is the source of truth. `/projects?category=web&stack=Next.js,Hono` drives what's rendered.
- `src/app/projects/page.tsx` is a Server Component. It reads `searchParams`, applies filters via `src/lib/content.ts` helpers, and renders the filtered grid SSR — no hydration flash, no "all then filter" flash, correct FCP.
- `ProjectFilters` ('use client') handles _UI_ state only: maintains the selected pills/chips and calls `router.replace()` with the new query string (`scroll: false`). It reads initial state from `useSearchParams` on mount so the UI matches the URL.
- Semantics: `category` = single value (omit = all). `stack` = comma-separated, AND (project must include every selected stack). Unknown values are ignored server-side.
- No global store. No derived client memo; the Server Component re-renders on navigation.

**Demo checklist:**

- `/` renders hero with correct hierarchy; dark/light both pass contrast.
- `/about` renders timeline with correct chronological order (most recent first).
- `/projects` filter combos work; URL reflects state; refresh restores it.
- `/projects/<slug>` renders for every seeded project; `notFound()` for unknown.
- `/contact` renders socials + email; copy-to-clipboard flashes confirmation.

**Commit:** `feat: home, about, projects, contact`

---

### S04 — Blog

**Goal:** Full MDX blog with ToC, reading time, Shiki, scroll progress, category filter routes, tags, per-post OG, RSS, related posts.

**Files created/modified:**

- `src/app/blog/page.tsx` — Server Component. Reads `searchParams.tag` for optional tag filter; list sorted by date desc, featured pinned first. Same server-driven pattern as projects.
- `src/app/blog/category/[slug]/page.tsx` — Server Component, filters by `params.slug` server-side; `generateStaticParams` over known categories, `notFound()` for unknown.
- `src/app/blog/[slug]/page.tsx` — header (title, date, reading time, tags), ToC (sticky on ≥lg), `Prose` MDX body, related posts (by tag overlap), prev/next by date.
- `src/app/blog/[slug]/opengraph-image.tsx` — per-post OG via `next/og`, shared layout from `src/lib/og.ts` (title, handle, date, accent dot).
- `src/app/feed.xml/route.ts` — RSS 2.0, Atom-lite, includes full `<content:encoded>` for last 20.
- Components: `BlogCard`, `BlogFilters`, `Toc`, `ReadingProgress`, `CodeBlock`, `Prose`, `MdxComponents`.
- `src/lib/rss.ts`.

**MDX component map:** heading anchors, links (external opens new tab w/ `rel`), images via `next/image`, `<pre>` styled by Shiki + copy button, callouts (`<Note>`, `<Warn>` — shortcode in MDX), tables.

**Demo checklist:**

- `/blog` renders list; featured post pinned.
- Visiting `/blog/<slug>` shows ToC, reading time, progress bar scrolling 0→100.
- Code blocks render with syntax highlighting, copy works.
- `/blog/category/tooling` renders only matching posts; unknown category 404s.
- `/feed.xml` validates (W3C feed validator or `curl | xmllint --noout`).
- Per-post OG: `/blog/<slug>/opengraph-image` returns a 1200×630 PNG with title + handle.

**Commit:** `feat(blog): mdx pipeline, toc, shiki, rss, per-post og, categories`

---

### S05 — Motion + View Transitions

**Goal:** Tasteful motion layer. View Transitions on the two specified flows. `prefers-reduced-motion` verified.

**Scope of motion:**

- `Reveal` wrapper — in-view fade+translate (y: 8px → 0) with stagger, triggered by `IntersectionObserver` (or `motion`'s `whileInView`). Used on sections, grids.
- Nav underline: CSS `::after` scaleX using `--ease-out` and `--d-fast`. No JS.
- Card hover: transform-only (`translate3d` + `box-shadow` via pseudo-layer) — GPU, 60fps.
- Theme toggle icon crossfade — CSS.
- View Transitions:
  - `ViewTransitionLink` wraps `next/link`, calls `document.startViewTransition` when supported; assigns `view-transition-name` just before navigation via a render-safe mechanism (React 19 `<ViewTransition>` when ready, otherwise a tiny imperative wrapper).
  - Scoped names: `post-<slug>` on blog card title + cover; mirror on post page header. Same for `project-<slug>`.
- Global rules:
  - No layout-thrashing animations (no `top`/`left`/`width`/`height`).
  - All animated elements carry `will-change` only while animating (toggled).
  - Every `motion.*` respects `useReducedMotion()` → sets `animate={false}` equivalent.

**Demo checklist:**

- DevTools → Rendering → emulate `prefers-reduced-motion: reduce`: everything snaps; no transitions fire; RSS/pages unchanged.
- Safari + Chrome: blog list → post shows a smooth cross-morph of title; fallback in non-supporting browser = plain navigation (no jank, no console errors).
- Chrome Performance trace during hero + section reveals: no long tasks >50ms, main thread clean.

**Commit:** `feat: motion layer + view transitions on blog and project flows`

---

### S06 — SEO, Analytics, Deploy

**Goal:** Complete metadata, sitemap, robots, JSON-LD, analytics, Lighthouse ≥ 95 across the board, Vercel deploy.

**Files created/modified:**

- `src/app/sitemap.ts` — static routes + all posts + all projects + categories.
- `src/app/robots.ts` — allow all, sitemap link.
- `src/app/opengraph-image.tsx`, `src/app/twitter-image.tsx` — site-wide.
- `src/lib/seo.ts` — finalize `buildMetadata`, `buildArticleJsonLd`, `buildBreadcrumbJsonLd`, `buildPersonJsonLd`, `buildProjectJsonLd`.
- Inject JSON-LD via `<script type="application/ld+json">` in relevant pages.
- Add `@vercel/analytics` + `@vercel/speed-insights` in `layout.tsx`.
- README: quickstart, content authoring, deploy.
- `vercel.json` only if headers/redirects required (likely just cache headers for `/feed.xml`).

**Lighthouse plan:**

- Self-host Geist (already via `geist/font`), preload hero font subset if needed.
- `next/image` with explicit `sizes` everywhere.
- Defer non-critical JS: analytics uses `next/script strategy="afterInteractive"` via the official wrappers.
- CLS: reserve space for `ReadingProgress`, images, ToC sticky.
- TBT: ensure filter components are the only `'use client'` islands on their pages.

**Demo checklist:**

- `curl https://<preview>/sitemap.xml` shows all expected URLs.
- `curl https://<preview>/robots.txt` shows sitemap line.
- Lighthouse (mobile, incognito, throttled) on `/`, `/about`, `/projects`, `/projects/<slug>`, `/blog`, `/blog/<slug>`: every category ≥ 95.
- JSON-LD validates in Google Rich Results Test for a post and a project.
- Vercel Analytics shows a pageview after a visit.

**Commit:** `feat: sitemap, robots, json-ld, og, analytics, deploy-ready`

---

## Risks / Open Questions

- **shadcn + Tailwind 4 + React 19 quirks:** Some older shadcn recipes assume Tailwind 3. Use the v4-branded components or the latest CLI (`bunx shadcn@latest init`) which supports v4. If peer conflicts arise on React 19, resolve via Bun's `overrides` in `package.json`; I'll note and act only if it appears.
- **React 19 `<ViewTransition>`:** If not surfaced in stable by the time we build S05, we fall back to the imperative `document.startViewTransition` wrapper — behavior-identical for our two flows. No plan change.
- **Velite + Turbopack dev watch:** If `velite --watch` doesn't cleanly interleave with `next dev --turbopack`, we run them via a single `concurrently` script — S02 already accounts for this.
- **OG fonts in `next/og`:** `next/og` doesn't accept Geist by name; we fetch the TTF at build from `public/fonts/` and pass as `Buffer`. Documented in `src/lib/og.ts`.
- **Placeholder personal content:** I'll seed plausible but generic content. You review in S02 and swap real copy before S06's deploy step.

---

## Execution Cadence

Per slice: implement → `bun run typecheck && bun run lint && bun run build` → single Conventional Commit → post summary + demo steps → wait for approval.

Debugging uses `superpowers:systematic-debugging` when a failure isn't obvious in one read. No guessing fixes.
