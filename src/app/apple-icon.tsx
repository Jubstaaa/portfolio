import { ImageResponse } from "next/og";

import { site } from "@/lib/content";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  const initials = site.name
    .split(" ")
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toLowerCase();

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#0a0a0f",
        color: "#f5f5fa",
        fontFamily: "system-ui, sans-serif",
        fontSize: 92,
        fontWeight: 700,
        letterSpacing: "-0.04em",
      }}
    >
      {initials || "me"}
    </div>,
    size,
  );
}
