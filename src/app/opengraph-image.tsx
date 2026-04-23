import { ImageResponse } from "next/og";

import { site } from "@/lib/content";

export const alt = `${site.name} — ${site.role}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OG() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        background: "#191c22",
        color: "#ebe7db",
        padding: "80px",
        fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 24, color: "#7b8aa5" }}>
        <span style={{ fontSize: 28 }}>~/{site.handle}</span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        <span
          style={{
            color: "#ebe7db",
            fontSize: 84,
            fontWeight: 700,
            letterSpacing: "-0.03em",
            lineHeight: 1.02,
            display: "flex",
          }}
        >
          {site.name}
        </span>
        <span style={{ color: "#7b8aa5", fontSize: 32 }}>
          {site.role} · {site.location}
        </span>
      </div>
      <div
        style={{ display: "flex", alignItems: "center", gap: 12, color: "#7b8aa5", fontSize: 24 }}
      >
        <span style={{ color: "#6aa7ff" }}>❯</span>
        <span>available for work</span>
      </div>
    </div>,
    size,
  );
}
