import { NextResponse } from "next/server";

interface SpotifyArtist {
  name: string;
}

interface SpotifyTrack {
  name: string;
  artists: SpotifyArtist[];
  external_urls: { spotify: string };
}

interface SpotifyCurrentlyPlaying {
  is_playing: boolean;
  item: SpotifyTrack | null;
}

interface NowPlayingPayload {
  isPlaying: boolean;
  title?: string;
  artist?: string;
  url?: string;
}

const TOKEN_ENDPOINT = "https://accounts.spotify.com/api/token";
const NOW_PLAYING_ENDPOINT = "https://api.spotify.com/v1/me/player/currently-playing";

const idleResponse = (): NextResponse =>
  NextResponse.json({ isPlaying: false } satisfies NowPlayingPayload, {
    headers: { "Cache-Control": "public, s-maxage=30, stale-while-revalidate=60" },
  });

async function getAccessToken(): Promise<string | null> {
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
  const refreshToken = process.env.SPOTIFY_REFRESH_TOKEN;
  if (!clientId || !clientSecret || !refreshToken) return null;

  const basic = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");
  const res = await fetch(TOKEN_ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `Basic ${basic}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: refreshToken,
    }),
    cache: "no-store",
  });
  if (!res.ok) return null;
  const data = (await res.json()) as { access_token?: string };
  return data.access_token ?? null;
}

export async function GET(): Promise<NextResponse> {
  const token = await getAccessToken();
  if (!token) return idleResponse();

  const res = await fetch(NOW_PLAYING_ENDPOINT, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });

  if (res.status === 204 || res.status >= 400) return idleResponse();

  const data = (await res.json()) as SpotifyCurrentlyPlaying;
  if (!data.item) return idleResponse();

  const payload: NowPlayingPayload = {
    isPlaying: data.is_playing,
    title: data.item.name,
    artist: data.item.artists.map((a) => a.name).join(", "),
    url: data.item.external_urls.spotify,
  };

  return NextResponse.json(payload, {
    headers: { "Cache-Control": "public, s-maxage=30, stale-while-revalidate=60" },
  });
}
