# portfolio

Personal site + MDX blog. Next.js 16 · React 19 · TypeScript 5.9 · Tailwind CSS 4 · velite · Shiki. Self-hosted: Docker → GHCR → DigitalOcean droplet behind Caddy.

## Quickstart

Requires Bun (version pinned in `package.json` → `packageManager`) and network access to the Spaces CDN: the build reads every content image's dimensions from it.

```bash
bun install          # also installs the husky hooks (commitlint, lint-staged)
bun dev              # http://localhost:3000 — builds content first
```

Content changes during dev:

```bash
bun run velite:watch # in a second terminal
```

## Environment

| Variable               | When       | Required | Purpose                                                                                                                                                                            |
| ---------------------- | ---------- | -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `LASTFM_API_KEY`       | runtime    | no       | Last.fm API key for `/api/now-playing`. Unset, the widget always reports idle — silently, so check this first if it never shows a track.                                           |
| `LASTFM_USERNAME`      | runtime    | no       | Last.fm user whose current track is shown.                                                                                                                                         |
| `NEXT_PUBLIC_CDN_BASE` | build time | no       | Overrides the Spaces CDN base (default in `src/lib/cdn.ts`). Inlined into the HTML and compiled into the image allow-list and CSP, so changing it needs a rebuild. CI requires it. |

Locally they go in `.env.local` (see `.env.example`); on the droplet in `/opt/portfolio/.env`.

## Scripts

| Command                           | What it does                                                   |
| --------------------------------- | -------------------------------------------------------------- |
| `bun dev`                         | velite + `next dev`                                            |
| `bun run build`                   | velite + `next build`                                          |
| `bun start`                       | `next start` (local only — production runs `server.js`)        |
| `bun run typecheck`               | velite + `next typegen` + `tsc --noEmit`                       |
| `bun run test`                    | `bun test`                                                     |
| `bun run audit`                   | `bun audit --audit-level=high` with the reviewed ignores       |
| `bun run lint` / `lint:fix`       | ESLint                                                         |
| `bun run format` / `format:check` | Prettier                                                       |
| `bun run velite` / `velite:watch` | build / watch the content pipeline                             |
| `bun run optimize:images <dir>`   | webp q78, ≤2000px long edge — run before uploading to the CDN  |
| `bun scripts/smoke.ts <url>`      | post-build smoke test (CI runs it against the candidate image) |

## Content authoring

See [`CLAUDE.md`](./CLAUDE.md) for full conventions. Short version:

- `content/blog/<slug>.mdx` — frontmatter (title, description, date, category, tags, cover, draft) + MDX body. Supports `<Note>` and `<Warn>` shortcodes.
- `content/projects/<slug>.mdx` — frontmatter (title, summary, category, order, stack, repo, url, images, highlights) + MDX body.
- `content/site.json` — name, role, location, title/description, canonical `url`, email, locale and `nav`.
- `content/experiences/*.json`, `content/education/*.json`, `content/data/{skills,stacks,socials}.json` — typed arrays.

All content is Zod-validated at build time by [`velite.config.ts`](./velite.config.ts). A broken schema fails the build with a precise error.

### Images

Content images live only in the DigitalOcean Spaces bucket, never in the repo.

1. `bun run optimize:images <dir>` — converts to webp q78 and caps the long edge at 2000px.
2. Upload the output to the bucket under `images/`, preserving the subpath, with public-read access.
3. Reference it root-relative: `/images/projects/foo/cover.webp`.

The image must be on the CDN before you build — the build fetches it to read its dimensions and fails if it is missing.

## Design system

- Terminal-aesthetic (Warp / Ghostty flavor). Hermit (self-hosted woff2 via `next/font/local`, `src/fonts/hermit/`) everywhere; the OTFs feed the OG images. OKLCH tokens in [`src/styles/tokens.css`](./src/styles/tokens.css).
- Dark default, `.light` override. Toggle via `ThemeProvider`.
- Motion: CSS-only transitions. No JS animation libraries.
- `prefers-reduced-motion: reduce` zeros the duration tokens globally — single source of truth.

## Deploy

`.github/workflows/deploy.yml`:

1. **check** (every push, PR and weekly) — format, lint, typecheck, tests, dependency audit.
2. **image** — builds the Docker image (`output: 'standalone'`, Node 24 LTS runner), runs it with the production constraints, runs `scripts/smoke.ts` against it, and on `main` pushes exactly that image as `ghcr.io/jubstaaa/portfolio:<commit-sha>`.
3. **deploy** (`main` only, `Production` environment) — copies `docker-compose.yml` to `/opt/portfolio`, then `docker compose up --wait` with `IMAGE_TAG=<sha>`. If the container is not healthy within 120 s it rolls back to the previously running tag and fails the job. `/opt/portfolio/release.env` records the current and previous tags.
4. **promote** — moves `:latest` to the released SHA, so `:latest` always means "what production runs".

After a healthy deploy the job purges the Cloudflare cache (`CF_PURGE_TOKEN`, a token scoped to Cache Purge on this zone only). HTML is cached at the edge until that purge; requests for RSC payloads (`?_rsc`, `RSC` header), `/api/*` and `/_next/image` bypass the cache.

The container listens on `127.0.0.1:3002`; the shared Caddy in `/opt/proxy` terminates TLS and reverse-proxies `ilkerbalcilar.com` to it.

GitHub configuration: secrets `DO_HOST`, `DO_USER`, `DO_SSH_KEY`, `DO_KNOWN_HOSTS`, `CF_PURGE_TOKEN` (in the `Production` environment); repository variables `NEXT_PUBLIC_CDN_BASE`, `CF_ZONE_ID`.

### Rollback

- **Preferred:** `gh workflow run deploy.yml --ref main -f image_tag=<good-sha>` — redeploys an existing image with the same health gate and automatic rollback, then promotes it to `:latest`.
- **Break-glass, on the droplet:** `cd /opt/portfolio && IMAGE_TAG=<good-sha> docker compose up -d --wait`. The next push to `main` deploys over it, so revert or fix forward before pushing again.

Find good SHAs in `/opt/portfolio/release.env` (`PREVIOUS_TAG`), `git log --first-parent main`, or the GHCR package page.

### Droplet layout

- `/opt/portfolio/` — `docker-compose.yml` (overwritten by every deploy), `.env`, `release.env`, `cache/images/` (the persisted `/_next/image` cache, capped by `images.maximumDiskCacheSize`).
- `/opt/proxy/` — the shared Caddy for every site on the droplet. The `ilkerbalcilar.com` block only accepts Cloudflare IPs (`cfonly`) and holds requests for up to 30 s (`lb_try_duration`) while a deploy recreates the container, so visitors see a short wait instead of a 502.

### Monitoring

`.github/workflows/uptime.yml` probes the home page and the feed every 15 minutes; a failed scheduled run is emailed by GitHub. GitHub disables scheduled workflows after 60 days without repository activity — re-enable it from the Actions tab if that happens.
