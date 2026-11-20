import { useQuery } from '@tanstack/react-query'

import { type NowPlayingPayload, nowPlayingPayloadSchema } from './last-fm'

export function useNowPlaying() {
    return useQuery<NowPlayingPayload>({
        queryFn: async () => {
            const res = await fetch('/api/now-playing')
            if (!res.ok) throw new Error(`now-playing: HTTP ${res.status}`)
            return nowPlayingPayloadSchema.parse(await res.json())
        },
        queryKey: ['now-playing'],
        refetchInterval: 30_000,
        refetchOnWindowFocus: false,
        retry: 1,
        staleTime: 30_000,
    })
}
