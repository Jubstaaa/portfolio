import { useQuery } from '@tanstack/react-query'

import type { NowPlayingPayload } from './now-playing.types'

export function useNowPlaying() {
    return useQuery<NowPlayingPayload>({
        queryFn: async () => {
            const res = await fetch('/api/now-playing')
            if (!res.ok) throw new Error('failed')
            return res.json()
        },
        queryKey: ['now-playing'],
        refetchInterval: 30_000,
        refetchOnWindowFocus: false,
        staleTime: 30_000,
    })
}
