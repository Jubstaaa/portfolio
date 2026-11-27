import * as z from 'zod/mini'

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
