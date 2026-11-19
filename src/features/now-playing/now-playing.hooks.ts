import { useQuery } from '@tanstack/react-query'

import type { NowPlayingPayload } from './last-fm'

export function useNowPlaying() {
    return useQuery<NowPlayingPayload>({
        queryFn: async () => {
            const res = await fetch('/api/now-playing')
            if (!res.ok) throw new Error(`now-playing: HTTP ${res.status}`)
            return (await res.json()) as NowPlayingPayload
        },
        queryKey: ['now-playing'],
        refetchInterval: 30_000,
        refetchOnWindowFocus: false,
        retry: 1,
        staleTime: 30_000,
    })
}
