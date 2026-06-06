"use client";

import { useSyncExternalStore } from "react";

import { cn } from "@/lib/utils";

interface NowPlayingPayload {
  isPlaying: boolean;
  title?: string;
  artist?: string;
  url?: string;
}

const TTL = 30_000;

let cached: { data: NowPlayingPayload; at: number } | null = null;
let inflight: Promise<void> | null = null;
let timer: number | null = null;

const listeners = new Set<() => void>();

function isSame(a: NowPlayingPayload, b: NowPlayingPayload): boolean {
  return (
    a.isPlaying === b.isPlaying && a.title === b.title && a.artist === b.artist && a.url === b.url
  );
}

function refresh(): void {
  if (cached && Date.now() - cached.at < TTL) return;

  inflight ??= fetch("/api/now-playing")
    .then(async (res) => {
      if (!res.ok) return;
      const json = (await res.json()) as NowPlayingPayload;
      if (!cached || !isSame(cached.data, json)) {
        cached = { data: json, at: Date.now() };
        for (const listener of listeners) listener();
      } else {
        cached = { data: cached.data, at: Date.now() };
      }
    })
    .catch(() => undefined)
    .finally(() => {
      inflight = null;
    });
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  if (listeners.size === 1) {
    refresh();
    timer = window.setInterval(refresh, TTL);
  }
  return () => {
    listeners.delete(listener);
    if (listeners.size === 0 && timer !== null) {
      window.clearInterval(timer);
      timer = null;
    }
  };
}

function getSnapshot(): NowPlayingPayload | null {
  return cached?.data ?? null;
}

function getServerSnapshot(): NowPlayingPayload | null {
  return null;
}

export interface NowPlayingProps {
  className?: string;
}

export function NowPlaying({ className }: NowPlayingProps) {
  const data = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

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
          "mt-[calc((1lh-0.375rem)/2)] inline-block size-1.5 shrink-0 rounded-full",
          playing ? "bg-success" : "bg-muted-foreground",
        )}
      />
      <span className="text-foreground min-w-0 break-all">{label}</span>
      {playing ? null : (
        <span className="text-muted-foreground mt-[calc((1lh-0.375rem)/2)] shrink-0 text-xs">
          (paused)
        </span>
      )}
    </>
  );

  const baseClass = cn("inline-flex items-start gap-2", className);

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
