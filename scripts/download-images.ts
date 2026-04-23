#!/usr/bin/env bun
/**
 * Download image manifest produced by migrate-content into /public/images/.
 * - concurrency 8
 * - idempotent (skips existing files unless --force)
 * - appends failures to TODO.md (under the `## image downloads` section)
 */
import { existsSync, mkdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

interface ImageDownload {
  url: string;
  path: string;
  description: string;
}

const REPO = process.cwd();
const MANIFEST = join(REPO, ".migrator-image-manifest.json");
const TODO = join(REPO, "TODO.md");
const CONCURRENCY = 8;

interface DownloadResult {
  item: ImageDownload;
  ok: boolean;
  reason?: string;
  bytes?: number;
  skipped?: boolean;
}

async function downloadOne(item: ImageDownload, force: boolean): Promise<DownloadResult> {
  const absPath = join(REPO, item.path);
  if (!force && existsSync(absPath)) {
    const size = statSync(absPath).size;
    return { item, ok: true, bytes: size, skipped: true };
  }
  try {
    const response = await fetch(item.url, { redirect: "follow" });
    if (!response.ok) {
      return { item, ok: false, reason: `HTTP ${response.status} ${response.statusText}` };
    }
    const buf = Buffer.from(await response.arrayBuffer());
    if (buf.byteLength === 0) {
      return { item, ok: false, reason: "empty response" };
    }
    mkdirSync(dirname(absPath), { recursive: true });
    writeFileSync(absPath, buf);
    return { item, ok: true, bytes: buf.byteLength };
  } catch (e) {
    return { item, ok: false, reason: (e as Error).message };
  }
}

async function pool<T, R>(items: T[], n: number, fn: (t: T) => Promise<R>): Promise<R[]> {
  const results: R[] = new Array(items.length);
  let cursor = 0;
  async function worker() {
    for (;;) {
      const index = cursor++;
      if (index >= items.length) return;
      results[index] = await fn(items[index]!);
    }
  }
  await Promise.all(Array.from({ length: Math.min(n, items.length) }, worker));
  return results;
}

function fmtBytes(b: number | undefined): string {
  if (b === undefined) return "";
  if (b < 1024) return `${b}B`;
  if (b < 1024 * 1024) return `${(b / 1024).toFixed(1)}KB`;
  return `${(b / 1024 / 1024).toFixed(2)}MB`;
}

function appendFailuresToTodo(failures: DownloadResult[]): void {
  if (failures.length === 0) return;
  const existing = existsSync(TODO) ? readFileSync(TODO, "utf-8") : "# TODO\n";
  const marker = "## image downloads";
  const lines = [
    "",
    `Downloaded at ${new Date().toISOString().replace(/\.\d+Z$/, "Z")}. **${failures.length}** failure(s):`,
    "",
    ...failures.map(
      (f) => `- \`${f.item.path}\` ← \`${f.item.url}\` — ${f.reason} (${f.item.description})`,
    ),
    "",
  ];
  const addition = lines.join("\n");
  const next = existing.includes(marker)
    ? existing.replace(new RegExp(`(${marker}[\\s\\S]*?)(\\n##|$)`), `$1${addition}$2`)
    : existing + `\n${marker}\n${addition}`;
  writeFileSync(TODO, next, "utf-8");
}

async function main(): Promise<void> {
  const force = process.argv.includes("--force");
  if (!existsSync(MANIFEST)) {
    console.error(`Manifest missing: ${MANIFEST}\nRun \`bun run content:migrate\` first.`);
    process.exit(1);
  }
  const manifest = JSON.parse(readFileSync(MANIFEST, "utf-8")) as ImageDownload[];
  if (manifest.length === 0) {
    console.log("No images to download.");
    return;
  }
  console.log(`Downloading ${manifest.length} images (concurrency ${CONCURRENCY})...`);

  const results = await pool(manifest, CONCURRENCY, (item) => downloadOne(item, force));

  const ok = results.filter((r) => r.ok);
  const skipped = ok.filter((r) => r.skipped);
  const downloaded = ok.filter((r) => !r.skipped);
  const failed = results.filter((r) => !r.ok);

  for (const r of results) {
    const status = r.ok ? (r.skipped ? "skip" : "ok  ") : "FAIL";
    const size = r.bytes ? fmtBytes(r.bytes).padStart(8) : "      -";
    console.log(`  [${status}] ${size}  ${r.item.path}${r.ok ? "" : `  — ${r.reason}`}`);
  }

  console.log("");
  console.log(
    `Summary: ${downloaded.length} downloaded, ${skipped.length} skipped, ${failed.length} failed.`,
  );

  if (failed.length > 0) {
    appendFailuresToTodo(failed);
    console.error(`\n${failed.length} failure(s) appended to TODO.md`);
    process.exit(1);
  }
}

void main();
