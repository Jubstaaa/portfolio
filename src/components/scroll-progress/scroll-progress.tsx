"use client";

import { useSyncExternalStore } from "react";

function subscribe(callback: () => void): () => void {
  window.addEventListener("scroll", callback, { passive: true });
  window.addEventListener("resize", callback, { passive: true });
  return () => {
    window.removeEventListener("scroll", callback);
    window.removeEventListener("resize", callback);
  };
}

function getSnapshot(): number {
  const doc = document.documentElement;
  const max = doc.scrollHeight - doc.clientHeight;
  if (max <= 0) return 0;
  const pct = doc.scrollTop / max;
  return Math.max(0, Math.min(1, pct));
}

function getServerSnapshot(): number {
  return 0;
}

export function ScrollProgress() {
  const progress = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  return (
    <div aria-hidden className="fixed top-14 right-0 left-0 z-30 h-0.5 bg-transparent">
      <div className="bg-accent h-full origin-left" style={{ transform: `scaleX(${progress})` }} />
    </div>
  );
}
