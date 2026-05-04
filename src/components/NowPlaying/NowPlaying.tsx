"use client";

import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";

interface NowPlayingPayload {
  isPlaying: boolean;
  title?: string;
  artist?: string;
  url?: string;
}

export interface NowPlayingProps {
  className?: string;
}

export function NowPlaying({ className }: NowPlayingProps) {
  const [data, setData] = useState<NowPlayingPayload | null>(null);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const res = await fetch("/api/now-playing");
        if (!res.ok) return;
        const json = (await res.json()) as NowPlayingPayload;
        if (!cancelled) setData(json);
      } catch {
        /* swallow — widget is non-critical */
      }
    };

    void load();
    const id = setInterval(() => void load(), 30_000);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, []);

  if (data === null) {
    return <span className={cn("text-muted-foreground", className)}>—</span>;
  }

  if (!data.title) {
    return <span className={cn("text-muted-foreground", className)}>— not listening</span>;
  }

  const label = data.artist ? `${data.title} — ${data.artist}` : data.title;
  const playing = data.isPlaying;

  const body = (
    <>
      <span
        aria-hidden
        className={cn(
          "inline-block size-1.5 rounded-full",
          playing ? "bg-success" : "bg-muted-foreground",
        )}
      />
      <span className="text-foreground truncate">{label}</span>
      {playing ? null : <span className="text-muted-foreground text-xs">(paused)</span>}
    </>
  );

  const baseClass = cn("inline-flex items-center gap-2", className);

  if (data.url) {
    return (
      <a
        href={data.url}
        target="_blank"
        rel="noreferrer noopener"
        className={cn(baseClass, "hover:[&_.text-foreground]:text-accent transition-token group")}
        aria-label={`${playing ? "Now playing" : "Paused"} on Spotify: ${label}`}
      >
        {body}
      </a>
    );
  }

  return <span className={baseClass}>{body}</span>;
}
