import { readFile } from "node:fs/promises";
import { join } from "node:path";

import { ImageResponse } from "next/og";
import sharp from "sharp";

import { site } from "@/lib/content";

export const OG_SIZE = { width: 1200, height: 630 } as const;
export const OG_CONTENT_TYPE = "image/jpeg";

const FONT_DIR = join(process.cwd(), "src/fonts/hermit");

async function loadFonts() {
  const [regular, bold] = await Promise.all([
    readFile(join(FONT_DIR, "Hermit-Regular.otf")),
    readFile(join(FONT_DIR, "Hermit-Bold.otf")),
  ]);
  return [
    { name: "Hermit", data: regular, weight: 400 as const, style: "normal" as const },
    { name: "Hermit", data: bold, weight: 700 as const, style: "normal" as const },
  ];
}

// satori can't decode webp and has no system-font fallback, so covers are
// rasterized to png and only ASCII glyphs are used in the layout.
async function loadCover(src?: string): Promise<string | undefined> {
  if (!src) return undefined;
  try {
    const file = join(process.cwd(), "public", src.replace(/^\//, ""));
    const png = await sharp(await readFile(file))
      .resize(OG_SIZE.width, OG_SIZE.height, { fit: "cover" })
      .png()
      .toBuffer();
    return `data:image/png;base64,${png.toString("base64")}`;
  } catch {
    return undefined;
  }
}

interface OgInput {
  segment?: string;
  eyebrow: string;
  title: string;
  cover?: string;
}

export async function renderOgImage({ segment, eyebrow, title, cover }: OgInput) {
  const path = segment ? `~/${site.handle}/${segment}` : `~/${site.handle}`;
  const [fonts, coverUrl] = await Promise.all([loadFonts(), loadCover(cover)]);

  const overlay = coverUrl
    ? "linear-gradient(90deg, rgba(18,20,25,0.95) 0%, rgba(18,20,25,0.88) 52%, rgba(18,20,25,0.6) 100%)"
    : "#16181d";

  const image = new ImageResponse(
    <div style={{ position: "relative", display: "flex", width: "100%", height: "100%" }}>
      {coverUrl ? (
        // satori only understands raw <img>; next/image cannot run here.
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={coverUrl}
          alt=""
          width={OG_SIZE.width}
          height={OG_SIZE.height}
          style={{ position: "absolute", top: 0, left: 0, objectFit: "cover" }}
        />
      ) : null}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background: overlay,
        }}
      />

      <div
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          color: "#ece9e1",
          padding: "72px",
          fontFamily: "Hermit",
          borderTop: "10px solid #5aa6ea",
        }}
      >
        <div style={{ display: "flex", fontSize: 30, color: "#8a93a1" }}>{path}</div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: 30, color: "#5aa6ea", marginBottom: 24 }}>
            {eyebrow}
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 60,
              fontWeight: 700,
              lineHeight: 1.12,
              letterSpacing: "-0.02em",
              color: "#ece9e1",
            }}
          >
            {title}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: 28,
            color: "#8a93a1",
          }}
        >
          <span>{`${site.name} · ${site.role}`}</span>
          <span style={{ color: "#5aa6ea" }}>{`${site.url.replace(/^https?:\/\//, "")} ->`}</span>
        </div>
      </div>
    </div>,
    { ...OG_SIZE, fonts },
  );

  // satori/resvg only emit PNG, which is huge for photographic covers — recompress
  // to JPEG so social cards stay small.
  const png = Buffer.from(await image.arrayBuffer());
  const jpeg = await sharp(png).jpeg({ quality: 84, mozjpeg: true }).toBuffer();
  return new Response(new Uint8Array(jpeg), {
    headers: {
      "Content-Type": OG_CONTENT_TYPE,
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
