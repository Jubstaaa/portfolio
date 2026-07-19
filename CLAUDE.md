# CLAUDE.md — Portfolio + Blog

Operational guide for this repo. Global rules in `~/.claude/CLAUDE.md` still apply; anything below overrides on conflict.

---

## Stack

| Concern       | Tech                                                                       |
| ------------- | -------------------------------------------------------------------------- |
| Framework     | Next.js 16 (App Router, Turbopack default, React 19)                       |
| Language      | TypeScript 5.9, `strict: true`, no `any`                                   |
| Styling       | Tailwind CSS 4 (CSS-first via `@theme`), tokens in `src/styles/tokens.css` |
| UI primitives | shadcn/ui (Tailwind v4 preset) + Lucide icons only                         |
| Content       | velite (Zod-validated MDX + JSON) → `.velite/` → typed imports             |
| MDX pipeline  | remark-gfm, rehype-pretty-code (Shiki)                                     |
| Motion        | CSS-first transitions only — no JS animation libraries                     |
| Fonts         | `geist/font` (Sans + Mono) — self-hosted                                   |
| SEO           | `generateMetadata`, `next/og`, sitemap, robots, JSON-LD                    |
| Deploy        | Vercel                                                                     |

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

> A global `frontend-standards` skill holds the canonical, project-agnostic version of these conventions. This section is the project-specific application of it — when in doubt, the skill wins.

### View-based structure

- Route logic lives in `src/views/<feature>/`, not in `src/app/`. Each `app/**/page.tsx` (and `layout.tsx`, `opengraph-image.tsx`, etc.) is a thin re-export:
    ```ts
    export { default, metadata } from '@/views/blog/blog-list'
    ```
- Inside a view folder, files sit flat and share the feature's base name with a dot suffix: `blog-list.tsx`, `blog-list.types.ts`, `blog-list.constants.ts`, `blog-list.hooks.ts`. No `ui/`, `lib/`, or other subfolders.
- **No `index.ts` barrel under `src/views/`** — views are only ever imported by their matching `app/` re-export, so a barrel adds indirection with no consumer. Components under `src/components/` keep the barrel (`component-name/component-name.tsx` + `index.ts` re-export) because they're imported from multiple call sites.
- Sub-components stay at the same level inside the component/view folder until reuse elsewhere earns them promotion to `src/components/`.
- **Everything is kebab-case** — folders, files, routes, lib, hooks, styles, content. React component identifiers stay PascalCase.
- Server Components by default. Add `'use client'` only when unavoidable (state, effects, browser APIs, form inputs). Client islands stay leaf-level; don't bubble `'use client'` upward.

### TypeScript

- `strict: true`. `noUncheckedIndexedAccess: true`. `exactOptionalPropertyTypes: true`.
- No `any`. Use `unknown` + narrow, or model the type properly.
- Prefer `interface` for object shapes; `type` for unions, intersections, mapped/conditional types.
- `import type { … }` for type-only imports.
- **No inline type or constant definitions inside `.tsx` files.** A component's props/local types go in a sibling `.types.ts`; magic strings, enums, or lookup tables go in a sibling `.constants.ts`. The `.tsx` file imports both.
- ESLint's `perfectionist` plugin sorts interface/object-type members, object literals, named imports, and JSX props automatically — don't hand-order them against a `--fix` run.

### Data fetching

- Client-side GET requests (e.g. now-playing) go through TanStack Query, not ad-hoc `useEffect` + `fetch`. A form submission or mutation would use a Next.js Server Action instead — this is a static site with no database, so that path isn't currently exercised.
- Don't mirror query results into local state or context; read from the query cache directly.
- `lodash-es` is allowed for utility functions (e.g. `groupBy`) where it's clearer than hand-rolling — import named functions only, never the default `lodash` bundle.

### Styling

- Tailwind utilities first. Custom CSS goes into `src/styles/tokens.css` via `@theme` or into a co-located `.module.css` only if a utility answer doesn't exist.
- Never inline `style={{ … }}` for anything a class can express.
- No off-scale arbitrary pixel values (`w-[437px]`, `mt-[13px]`, etc.) — use the Tailwind v4 scale, including its half-step utilities (`px-4.5`, `gap-2.5`, …), instead of reaching for a one-off arbitrary. Deliberate typographic values with no clean scale equivalent (a `rem`/`em` code-block font size tuned for readability, a `ch`-based monospace width) are fine and should stay as arbitrary values — the rule targets arbitrary spacing, not considered exceptions.
- Important overrides use the Tailwind v4 trailing `!` suffix (`text-red-500!`), not the old leading `!` prefix.
- **Prettier:** single quotes, no semicolons, 4-space indent, `arrowParens: avoid`, `bracketSameLine: true`, `quoteProps: consistent`, `trailingComma: es5`, default `printWidth` (80). Matches the rest of İlker's projects. Prettier enforces; do not hand-format.

### Motion

- CSS animations/transitions only. No JS animation libraries.
- Durations and easings come from tokens (`--d-*`, `--ease-*`). `prefers-reduced-motion: reduce` zeroes durations at the token level — do not re-check in components.

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
category: engineering # single category
tags: [next, react, perf] # multiple tags
draft: false # true hides from production builds
cover:
    src: /images/blog/my-post/cover.jpg
    alt: Descriptive alt text
---
# Heading

Body is standard MDX. Fenced code blocks are highlighted via Shiki.
```

- Use `<Note>` / `<Warn>` shortcodes (from `MdxComponents`) for callouts.

### Project

`content/projects/my-project.mdx` — frontmatter for metadata, MDX body for the long-form description:

```yaml
---
title: 'Prosbase V2'
summary: 'LoL esports stats platform — real-time ingest + analytics.'
category: web
repo: 'https://github.com/you/prosbase'
url: 'https://prosbase.example.com'
stack: ['Next.js', 'Hono', 'PostgreSQL', 'BullMQ']
highlights:
    - 'Ingest pipeline scales to 10k events/sec'
    - 'TypeScript monorepo with shared contracts'
    - 'Tauri desktop companion'
images:
    - src: /images/projects/prosbase/cover.webp
      alt: 'Dashboard'
---
# Overview

Long-form description as MDX. Same pipeline as blog posts — `remark-gfm`, Shiki code blocks, `<Note>` / `<Warn>` shortcodes, etc.
```

### Experience / Education / Skills / Stacks / Socials

Schema lives in `velite.config.ts`. Add a JSON file; re-run `bun run velite` or rely on the dev watcher. Typed helpers in `src/lib/content.ts` are the only read path — do **not** import JSON directly elsewhere.

### One MDX map, two surfaces

Blog posts and project bodies both render through the same `MdxComponents` map. Any element override (code blocks, callouts, images, links) applies everywhere. Don't fork the map.

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
- Don't ship `console.log` — ESLint flags it.
- Don't write package versions by hand. `bun add <pkg>` or `bun add <pkg>@latest`.
- Don't mirror TanStack Query results into local state or context — read from the query cache.
- Don't add an `index.ts` barrel under `src/views/` — the `app/**/page.tsx` re-export is the only consumer.
- Don't define types or constants inline in a `.tsx` file — split them into `.types.ts` / `.constants.ts`.
- Don't reach for an arbitrary pixel value when a Tailwind v4 scale step (including half-steps) covers it.
- Don't add emoji anywhere in UI or content unless explicitly asked.
- Don't introduce a database, auth, or API layer — this is a static site.
