import { useQuery } from '@tanstack/react-query'

import type { NowPlayingPayload } from './now-playing.schema'

// The widget renders a placeholder on failure and TanStack Query does not log
// query errors, so the failure is logged here before the query sees it.
export async function fetchNowPlaying(): Promise<NowPlayingPayload> {
    try {
        const res = await fetch('/api/now-playing')
        if (!res.ok) throw new Error(`now-playing: HTTP ${res.status}`)
        // Loaded with the first response rather than with the terminal: zod
        // would otherwise double the home page's terminal chunk.
        const { nowPlayingPayloadSchema } = await import('./now-playing.schema')
        return nowPlayingPayloadSchema.parse(await res.json())
    } catch (error) {
        console.error('now-playing: request failed', error)
        throw error
    }
}

export function useNowPlaying() {
    return useQuery<NowPlayingPayload>({
        queryFn: fetchNowPlaying,
        queryKey: ['now-playing'],
        refetchInterval: 30_000,
        refetchOnWindowFocus: false,
        retry: 1,
        staleTime: 30_000,
    })
}
