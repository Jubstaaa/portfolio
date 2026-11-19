'use client'

import { cn } from '@/lib/utils'

import { useNowPlaying } from './now-playing.hooks'

interface NowPlayingProps {
    className?: string
}

export function NowPlaying({ className }: NowPlayingProps) {
    const { data } = useNowPlaying()

    if (!data) {
        return <span className={cn('text-muted-foreground', className)}>—</span>
    }

    if (!data.isPlaying) {
        return (
            <span className={cn('text-muted-foreground', className)}>
                — not listening
            </span>
        )
    }

    const label = `${data.title} — ${data.artist}`

    return (
        <a
            aria-label={`Now playing on Spotify: ${label}`}
            className={cn(
                'inline-flex items-start gap-2',
                'hover:[&_.text-foreground]:text-accent transition-token group',
                className
            )}
            href={data.url}
            rel="noreferrer noopener"
            target="_blank">
            <span
                aria-hidden
                className="dot-nudge bg-success inline-block size-1.5 shrink-0 rounded-full"
            />
            <span className="text-foreground min-w-0 break-all">{label}</span>
        </a>
    )
}
