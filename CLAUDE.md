# CLAUDE.md — Portfolio + Blog

Operational guide for this repo. Global rules in `~/.claude/CLAUDE.md` still apply; anything below overrides on conflict.

---

## Stack

| Concern       | Tech                                                                          |
| ------------- | ----------------------------------------------------------------------------- |
| Framework     | Next.js 16 (App Router, Turbopack default, React 19)                          |
| Language      | TypeScript 5.9, `strict: true`, no `any`                                      |
| Styling       | Tailwind CSS 4 (CSS-first via `@theme`), tokens in `src/styles/tokens.css`    |
| UI primitives | shadcn/ui (Tailwind v4 preset) + Lucide icons only                            |
| Content       | velite (Zod-validated MDX + JSON) → `.velite/` → typed imports                |
| MDX pipeline  | remark-gfm, rehype-slug, rehype-autolink-headings, rehype-pretty-code (Shiki) |
| Motion        | `motion/react` + CSS-first transitions; View Transitions API for two flows    |
| Fonts         | `geist/font` (Sans + Mono) — self-hosted                                      |
| SEO           | `generateMetadata`, `next/og`, sitemap, robots, JSON-LD                       |
| Analytics     | `@vercel/analytics`, `@vercel/speed-insights`                                 |
| Deploy        | Vercel                                                                        |

> Versions are pinned by `bun add` at install time — **never hand-write package versions**.

---

## Package Manager — Bun

Bun is the only package manager for this repo. Lockfile is `bun.lock`. Do not commit `package-lock.json`, `pnpm-lock.yaml`, or `yarn.lock`.

```bash
bun install                    # install all deps from bun.lock
bun add <pkg>                  # prod dep
bun add -d <pkg>               # dev dep
bun remove <pkg>
bunx <pkg>                     # one-off CLI (equiv. of npx / pnpm dlx)
```

### Scripts (authoritative)

Defined in `package.json`. Invoke with `bun <script>` (Bun's script runner is the fast path; `bun run <script>` also works — use whichever reads more clearly).

```bash
bun dev                        # next dev (Turbopack)
bun run build                  # velite && next build
bun start                      # next start
bun run typecheck              # tsc --noEmit
bun run lint                   # eslint .
bun run lint:fix               # eslint . --fix
bun run format                 # prettier --write .
bun run format:check           # prettier --check .
bun run velite                 # build content pipeline only
bun run velite:watch           # velite --watch (use alongside bun dev when editing content)
```

> Always run `bun run typecheck && bun run lint && bun run build` before committing a slice.

---

## Repository Standards

### Components

- **Folder pattern:** `ComponentName/ComponentName.tsx` + `index.ts` re-export. Sub-components sit at the same level until they earn promotion to the top level via reuse. This overrides the global kebab-case rule for component folders only.
- Non-component files (routes, lib, hooks, styles, content) are kebab-case.
- Server Components by default. Add `'use client'` only when unavoidable (state, effects, browser APIs, form inputs, motion hooks, `startViewTransition`).
- Client islands stay leaf-level; don't bubble `'use client'` upward.

### TypeScript

- `strict: true`. `noUncheckedIndexedAccess: true`. `exactOptionalPropertyTypes: true`.
- No `any`. Use `unknown` + narrow, or model the type properly.
- Prefer `interface` for object shapes; `type` for unions, intersections, mapped/conditional types.
- `import type { … }` for type-only imports.

### Styling

- Tailwind utilities first. Custom CSS goes into `src/styles/tokens.css` via `@theme` or into a co-located `.module.css` only if a utility answer doesn't exist.
- Never inline `style={{ … }}` for anything a class can express.
- **Prettier (project override of global rule):** double quotes, semicolons, 2-space indent, trailing comma `all`. This matches the Next.js / Vercel / shadcn ecosystem so snippets copy in clean. Prettier enforces; do not hand-format.

### Motion

- CSS animations/transitions by default.
- `motion/react` only when the effect needs DOM-transition mechanics (enter/exit with layout shift, FLIP-style shared element outside View Transitions, gesture-driven motion).
- Durations and easings come from tokens (`--d-*`, `--ease-*`). `prefers-reduced-motion: reduce` zeroes durations at the token level — do not re-check in components.
- View Transitions: only for blog-list ↔ post and project-list ↔ detail. No JS fallback; in unsupported browsers, links navigate normally.

### Accessibility

- Headings form a clean outline per page; exactly one `<h1>`.
- Every interactive element is a real `button`/`a`. No `div onClick`.
- Focus rings use `--color-ring`, never removed.
- Alt text is required on every `<Image>` — the velite schema enforces it for content images.

### SEO

- All route segments export `generateMetadata`; rely on `src/lib/seo.ts` helpers.
- JSON-LD is injected server-side on posts (Article), projects (CreativeWork), and the site root (Person).
- Per-post OG images via a route-segment `opengraph-image.tsx`.

---

## Content Authoring

### Blog post

```bash
touch content/blog/my-post.mdx
```

```yaml
---
title: Short, specific, no fluff
description: One sentence — shown in cards and meta description.
date: 2026-04-20
category: engineering # single category (drives /blog/category/[slug])
tags: [next, react, perf] # multiple tags
draft: false # true hides from production builds
featured: false # true pins to top of /blog
cover:
  src: /images/blog/my-post/cover.jpg
  alt: Descriptive alt text
---
# Heading

Body is standard MDX. Fenced code blocks are highlighted via Shiki.
```

- Headings ≥ `##` get slugified anchors automatically.
- Reading time is computed at build (words / 220 wpm).
- Use `<Note>` / `<Warn>` shortcodes (from `MdxComponents`) for callouts.

### Project

`content/projects/my-project.mdx` — frontmatter for metadata, MDX body for the long-form description:

```yaml
---
title: "Prosbase V2"
summary: "LoL esports stats platform — real-time ingest + analytics."
category: web
role: "Lead engineer"
status: in-progress
repo: "https://github.com/you/prosbase"
url: "https://prosbase.example.com"
stack: ["Next.js", "Hono", "PostgreSQL", "BullMQ"]
highlights:
  - "Ingest pipeline scales to 10k events/sec"
  - "TypeScript monorepo with shared contracts"
  - "Tauri desktop companion"
images:
  - src: /images/projects/prosbase/cover.webp
    alt: "Dashboard"
---
# Overview

Long-form description as MDX. Same pipeline as blog posts — `remark-gfm`, Shiki code blocks, `<Note>` / `<Warn>` shortcodes, etc.
```

### Experience / Education / Skills / Stacks / Socials

Schema lives in `velite.config.ts`. Add a JSON file; re-run `bun run velite` or rely on the dev watcher. Typed helpers in `src/lib/content.ts` are the only read path — do **not** import JSON directly elsewhere.

### About page body

`content/about.mdx` is a singleton MDX file. Same frontmatter-less body, same MDX component map as blog posts. The `/about` page renders it inside the shared `Prose` wrapper above the timeline/education/skills. `SiteConfig.description` is one sentence (hero/meta) — long-form bio lives here.

### One MDX map, three surfaces

Blog posts, project bodies, and `about.mdx` all render through the same `MdxComponents` map. Any element override (code blocks, callouts, images, links) applies everywhere. Don't fork the map.

### Images

- Drop under `public/images/<group>/...`.
- Prefer modern formats (AVIF/WebP). `next/image` handles the rest.
- Always provide `alt`; velite rejects content images without it.

---

## Commits

Conventional Commits. No `Co-Authored-By`. Scope is optional but preferred.

```
feat(blog): add reading-progress bar
fix(og): correct font buffer load for /blog OG route
chore: bump tailwind to latest
refactor(content): collapse reading-time helper into velite plugin
docs: README quickstart
```

commitlint runs on `commit-msg`; lint-staged runs Prettier + ESLint on staged files in `pre-commit`.

---

## Quick Verification Checklist

Before marking any slice complete:

1. `bun run typecheck` → 0 errors
2. `bun run lint` → 0 errors (warnings allowed only if documented)
3. `bun run build` → green; no unexpected `'use client'` bubbles in the build trace
4. Manually hit the routes the slice touched in `bun dev`
5. For UI slices: toggle light/dark, check reduced-motion in DevTools, tab through interactive elements

---

## Debugging

Use `superpowers:systematic-debugging` for anything non-trivial. No guessing fixes — write the failing repro, form a hypothesis, change one variable, verify.

---

## What NOT to Do

- Don't import JSON from `content/` directly — go through velite.
- Don't add a client component just to use `motion/react`; CSS first.
- Don't ship `console.log` — ESLint flags it.
- Don't write package versions by hand. `bun add <pkg>` or `bun add <pkg>@latest`.
- Don't mirror RTK Query / fetch results into local state or context.
- Don't add emoji anywhere in UI or content unless explicitly asked.
- Don't introduce a database, auth, or API layer — this is a static site.
