# portfolio

Personal site + MDX blog. Next.js 16 · React 19 · TypeScript 5 · Tailwind CSS 4 · velite · motion · Shiki. Deployed on Vercel.

## Quickstart

```bash
bun install
bun run velite       # build content once so types resolve
bun dev              # http://localhost:3000
```

Content changes during dev:

```bash
bun run velite:watch # in a second terminal
```

## Scripts

| Command                           | What it does                            |
| --------------------------------- | --------------------------------------- |
| `bun dev`                         | velite + `next dev --turbopack`         |
| `bun run build`                   | velite + `next build`                   |
| `bun start`                       | `next start` (after `bun run build`)    |
| `bun run typecheck`               | velite + `tsc --noEmit`                 |
| `bun run lint` / `lint:fix`       | ESLint                                  |
| `bun run format` / `format:check` | Prettier                                |
| `bun run velite`                  | build the content pipeline              |
| `bun run velite:watch`            | watch content                           |
| `bun run content:migrate`         | re-run the MongoDB → content/ migrator  |
| `bun run content:download-images` | download referenced images to `public/` |

## Content authoring

See [`CLAUDE.md`](./CLAUDE.md) for full conventions. Short version:

- `content/blog/<slug>.mdx` — frontmatter (title, description, date, category, tags, featured, cover) + MDX body. Supports `<Note>` and `<Warn>` shortcodes.
- `content/projects/<slug>.json` — typed project entry (title, summary, description, category, stack, role, year, status, images, highlights, repo, url).
- `content/site.json` — single source of truth for hero / nav / metadata.
- `content/about.mdx` — long-form bio, rendered inside `Prose` on `/about`.
- `content/experiences/*.json`, `content/education/*.json`, `content/data/{skills,stacks,socials}.json` — typed arrays.

All content is Zod-validated at build time by [`velite.config.ts`](./velite.config.ts). A broken schema fails the build with a precise error.

Images live at `/public/images/<area>/<slug>/<file>.webp`. The `scripts/download-images.ts` script fetches every URL produced by the migrator.

## Design system

- Terminal-aesthetic (Warp / Ghostty flavor). Geist Mono everywhere. OKLCH tokens in [`src/styles/tokens.css`](./src/styles/tokens.css).
- Dark default, `.light` override. Toggle via `ThemeProvider`.
- Motion: CSS-first, `motion/react` only on `Reveal`. View Transitions API scoped to blog-list ↔ post and project-list ↔ detail.
- `prefers-reduced-motion: reduce` zeros the duration tokens globally — single source of truth.

## Deploy

### Vercel

1. Push to GitHub.
2. Import the repo in Vercel.
3. Framework: **Next.js** (auto-detected). Build command: default (`next build`; velite is invoked via the `build` script).
4. Set env var `NEXT_PUBLIC_SITE_URL` if you want to override the URL coded into `content/site.json` (optional — the canonical is read from `content/site.json.url`).
5. Analytics + Speed Insights are wired via `@vercel/analytics` and `@vercel/speed-insights`; they activate automatically on Vercel.

### Anywhere else

```bash
bun run build
bun start   # or any Node-compatible runtime that serves Next output
```

Static export isn't configured — the site has two dynamic routes (`/blog`, `/projects`) that read searchParams and one RSS route.

## Roadmap / TODO

See [`TODO.md`](./TODO.md) — items surfaced by the content migrator that need your review before going live (tags, highlights, category overrides, per-skill categories, etc.).

## Architecture / implementation log

- [`PLAN.md`](./PLAN.md) — the full slice-by-slice implementation plan and content model reference.
- [`CLAUDE.md`](./CLAUDE.md) — operational guide for the codebase.
