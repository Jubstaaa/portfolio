# CLAUDE.md — Portfolio + Blog

Operational guide for this repo. Global rules in `~/.claude/CLAUDE.md` still apply; anything below overrides on conflict.

---

## Stack

| Concern       | Tech                                                                       |
| ------------- | -------------------------------------------------------------------------- |
| Framework     | Next.js 16 (App Router, Turbopack default, React 19)                       |
| Language      | TypeScript 7 (native `tsc`; TS 6 API for tooling), `strict`, no `any`      |
| Styling       | Tailwind CSS 4 (CSS-first via `@theme`), tokens in `src/styles/tokens.css` |
| UI primitives | Hand-rolled components in `src/components/` + Lucide icons only (no kit)   |
| Content       | velite (Zod-validated MDX + JSON) → `.velite/` → typed imports             |
| MDX pipeline  | remark-gfm, rehype-pretty-code (Shiki)                                     |
| Motion        | CSS-first transitions only — no JS animation libraries                     |
| Fonts         | Hermit woff2 via `next/font/local` (OTFs kept for OG images)               |
| SEO           | `metadata`/`generateMetadata`, `next/og`, sitemap, robots, JSON-LD         |
| Images        | Served from a DigitalOcean Spaces CDN — no `public/images` in the repo     |
| Deploy        | Self-hosted: Docker image → GHCR → DigitalOcean droplet behind Caddy       |

> Versions are pinned by `bun add` at install time — **never hand-write package versions**.

### Deployment

Not Vercel. `next.config.ts` sets `output: 'standalone'`. `.github/workflows/ci.yml` (PRs; deploy
reuses its `image` job) holds the gate; `.github/workflows/deploy.yml` (push to `main`, manual
dispatch) releases. Actions are pinned to commit SHAs, shared steps live in the
`.github/actions/setup-bun` composite action, and the deploy uses the shared
[Jubstaaa/deploy-actions](https://github.com/Jubstaaa/deploy-actions) (`ssh`, `compose`):

1. **check** — Trivy (lockfile, Dockerfile, secrets; HIGH/CRITICAL fail), `format:check`,
   `generate`, `lint`, `tsc`, `test`, `audit`, `knip`, `jscpd`, `depcruise`, actionlint
2. **image** — builds the image, runs it with the production constraints, runs
   `bun run test:smoke` (`e2e/site.smoke.ts`) against it, and on `main` pushes exactly that
   image as `:<commit-sha>`. On `main` only this job runs before deploy: `check` already
   passed on the up-to-date PR branch, so it is not repeated
3. **deploy** (`main`, `Production` environment) — copies `docker-compose.yml` to the droplet
   over plain OpenSSH (pinned host key) and runs `docker compose up --wait` with
   `IMAGE_TAG=<sha>`; an unhealthy container is rolled back to the previous tag automatically,
   and `:latest` moves to the released SHA after a healthy release

Rollback: `gh workflow run deploy.yml --ref main -f image_tag=<good-sha>` (see README).

`main` is protected by the `protect-main` ruleset: no direct pushes, no force-push or deletion, and every PR needs the `check` and `image` jobs green on a branch that is up to date with `main` before it can merge — there is no bypass. Dependabot patch/minor PRs auto-merge once green (`dependabot-auto-merge.yml`): the workflow merges, then dispatches `deploy.yml` itself, because a merge made with `GITHUB_TOKEN` starts no workflows; a branch left behind is sent back with `@dependabot rebase`.

The container listens on `127.0.0.1:3002`; a shared Caddy at `/opt/proxy` on the droplet
terminates TLS and reverse-proxies `ilkerbalcilar.com` to it, alongside the other sites on
the same box. Content images live in the Spaces bucket, not in the repo — `src/lib/cdn.ts`
holds the base URL and `next.config.ts` imports it (relatively — no path aliases there) for the
image optimizer's allow-list and the CSP, so the two cannot drift.

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
bun dev                        # velite build && next dev (Turbopack is the default)
bun run build                  # velite build && next build
bun start                      # next start
bun run generate               # velite build && next typegen (content + route types)
bun run typecheck              # generate && tsc --noEmit
bun run test                   # bun test
bun run test:smoke             # e2e/site.smoke.ts against SMOKE_BASE_URL (a running server)
bun run audit                  # bun audit --audit-level=high
bun run knip                   # unused files, exports and dependencies (knip.json)
bun run jscpd                  # duplication in src/, fails above 1% (.jscpd.json)
bun run depcruise              # module graph: no cycles, orphans, dev deps in src (.dependency-cruiser.mjs)
bun run lint                   # eslint
bun run lint:fix               # eslint --fix
bun run format                 # prettier --write .
bun run format:check           # prettier --check .
bun run velite                 # build content pipeline only
bun run velite:watch           # velite build --watch (use alongside bun dev when editing content)
bun run optimize:images <src> <out>  # webp q78, ≤2000px copies into <out> — before uploading to the CDN bucket
```

> Always run `bun run typecheck && bun run lint && bun run test && bun run knip && bun run jscpd && bun run depcruise && bun run build` before committing a slice.

---

## Repository Standards

Next.js is unopinionated about layout; this repo follows its "split project files by feature or route" strategy with colocation: code lives next to the only place that uses it, and moves to a shared folder once a second user appears.

### Folder structure

```
src/
  app/                      routes; each segment holds its own page/layout/opengraph-image
    _components/            site-wide layout parts (nav, footer, skip link, providers)
    about/_components/      parts used only by /about (likewise blog/, contact/)
  features/                 code shared across routes, or a self-contained feature with its own state and tests
    content/                velite read path, MDX rendering, content cards and detail views, RSS, SEO/JSON-LD, site URLs
      og/                   OG image renderer (Satori card → JPEG) for the opengraph-image routes
      pipeline/             Node-only content processing for velite and OG images (image bytes and dimensions, rehype plugins, image schema)
    terminal/               the home page terminal (commands, parser, session store, hooks)
    now-playing/            Last.fm parsing, client hook and widget
  components/               small UI parts used by more than one route or feature
  hooks/                    generic hooks shared across features
  lib/                      cross-cutting infrastructure: cdn, format, clipboard, utils — never imports from features/ (depcruise `lib-not-to-features`)
  styles/                   design tokens and the shared next/font definitions (fonts.ts)
  test-utils/               test-only helpers (MSW network setup)
```

- `page.tsx`, `layout.tsx`, `opengraph-image.tsx` and the other special files hold their own code; there is no separate view layer. Route segment config (`dynamicParams`, `size`, `contentType`, …) is a literal `export const` in the route file, as Next requires.
- `_`-prefixed folders inside `app/` are private: never routable, safe for colocated components.
- A component's props interface and its small constants live in the component file. A separate `*.types.ts` / `*.constants.ts` file exists only when several files share it (e.g. `features/terminal/commands.types.ts`). No project-wide `types/` or `constants/` dumping ground.
- Imports: `./x` within the same folder, `@/…` everywhere else. No `index.ts` barrels; import the file directly.
- Multi-file parts get a folder (`app/_components/nav/`, `components/terminal-block/`); single-file parts are a file (`components/heading.tsx`).
- **Everything is kebab-case** — folders, files, routes, lib, hooks, styles, content. React component identifiers stay PascalCase.
- Server Components by default. Add `'use client'` only when unavoidable (state, effects, browser APIs, form inputs). Client islands stay leaf-level; don't bubble `'use client'` upward.

### TypeScript

- `strict: true`. `noUncheckedIndexedAccess: true`. `exactOptionalPropertyTypes: true`.
- No `any`. Use `unknown` + narrow, or model the type properly.
- Prefer `interface` for object shapes; `type` for unions, intersections, mapped/conditional types.
- `import type { … }` for type-only imports.
- ESLint is built from presets — `eslint-config-next` (core-web-vitals + TypeScript), `typescript-eslint` strict + stylistic **type-checked**, `jsx-a11y` recommended, `perfectionist` recommended-natural (all sorting: imports, objects, types, JSX props), and `eslint-config-prettier` last. `eslint.config.mjs` only adds a few documented project choices; prefer adjusting a preset rule there over hand-ordering code against `--fix`.

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
- Durations and easings come from tokens (`--duration-*`, `--ease-*`, defined in `src/styles/tokens.css`). `prefers-reduced-motion: reduce` zeroes durations at the token level — do not re-check in components.

### Accessibility

- Headings form a clean outline per page; exactly one `<h1>`.
- Every interactive element is a real `button`/`a`. No `div onClick`.
- Focus rings use `--color-ring`, never removed.
- Alt text is required on every `<Image>` — the velite schema enforces it for content images.

### SEO

- Static routes export `metadata` built with `buildMetadata()`; dynamic `[slug]` routes export `generateMetadata`. Rely on `src/features/content/seo.ts` helpers.
- JSON-LD is injected server-side on posts (BlogPosting + BreadcrumbList), projects (CreativeWork), and the site root (Person).
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
draft: false # true excludes the post from the build (no page, OG image, feed or sitemap entry)
updated: 2026-05-01 # optional
showCover: true # false: cover only for cards/OG; the first body image becomes the LCP candidate
cover:
    src: /images/blog/my-post/cover.webp
    alt: Descriptive alt text
---
# Heading

Body is standard MDX. Headings are normalized so the body's top level renders as `<h2>` (the page title is the only `<h1>`). Fenced code blocks are highlighted via Shiki.
```

- Use `<Note>` / `<Warn>` shortcodes (from `mdxComponents`) for callouts.

### Project

`content/projects/my-project.mdx` — frontmatter for metadata, MDX body for the long-form description:

```yaml
---
title: 'Prosbase V2'
summary: 'LoL esports stats platform — real-time ingest + analytics.'
category: 'Web App' # free text, shown verbatim
order: 3 # optional; ascending, unordered projects sort last
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

Schema lives in `velite.config.ts`. Add a JSON file; re-run `bun run velite` or rely on the dev watcher. Typed helpers in `src/features/content/content.ts` are the only read path — do **not** import JSON directly elsewhere.

### One MDX map, two surfaces

Blog posts and project bodies both render through the same `mdxComponents` map. Any element override (code blocks, callouts, images, links) applies everywhere. Don't fork the map.

### Images

- Content images live only in the Spaces bucket. Run `bun run optimize:images <source-dir> <output-dir>` (sources stay untouched), upload the output under `images/<group>/...`, reference as `/images/<group>/...`. The build fetches each image for its dimensions and fails if it is missing or its path is outside `/images/` — body images included.
- Frontmatter images (`cover`, `images[]`) require `alt` — the velite schema enforces it. MDX body images (`![alt](src)`) are **not** validated: write the alt text yourself.

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
3. `bun run test` → green
4. `bun run build` → green; no unexpected `'use client'` bubbles in the build trace
5. Manually hit the routes the slice touched in `bun dev`
6. For UI slices: toggle light/dark, check reduced-motion in DevTools, tab through interactive elements

---

## Debugging

Use `superpowers:systematic-debugging` for anything non-trivial. No guessing fixes — write the failing repro, form a hypothesis, change one variable, verify.

---

## What NOT to Do

- Don't import JSON from `content/` directly — go through velite.
- Don't ship `console.log` — ESLint flags it.
- Don't write package versions by hand. `bun add <pkg>` or `bun add <pkg>@latest`.
- Don't mirror TanStack Query results into local state or context — read from the query cache.
- Don't add an `index.ts` barrel anywhere — import the file directly.
- Don't put single-use code in `src/components/`; colocate it with the route that uses it. `src/features/` takes single-route code only when it is a self-contained feature (own state, sub-modules and tests), like the home terminal.
- Don't reach for an arbitrary pixel value when a Tailwind v4 scale step (including half-steps) covers it.
- Don't add emoji anywhere in UI or content unless explicitly asked.
- Don't introduce a database, auth, or API layer — this is a static site.
