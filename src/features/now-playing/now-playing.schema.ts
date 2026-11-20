// zod/mini, not zod: the browser downloads this schema to validate the API
// response, and the mini build is about half the size of the classic one there.
import * as z from 'zod/mini'

// What /api/now-playing serves.
export const nowPlayingPayloadSchema = z.discriminatedUnion('isPlaying', [
    z.object({
        artist: z.string(),
        isPlaying: z.literal(true),
        title: z.string(),
        url: z.url(),
    }),
    z.object({ isPlaying: z.literal(false) }),
])

export type NowPlayingPayload = z.infer<typeof nowPlayingPayloadSchema>
