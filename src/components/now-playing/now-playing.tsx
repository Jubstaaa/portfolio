'use client'

import { cn } from '@/lib/utils'

import { useNowPlaying } from './now-playing.hooks'
import type { NowPlayingProps } from './now-playing.types'

export function NowPlaying({ className }: NowPlayingProps) {
    const { data } = useNowPlaying()

    if (!data) {
        return <span className={cn('text-muted-foreground', className)}>—</span>
    }

    if (!data.title) {
        return (
            <span className={cn('text-muted-foreground', className)}>
                — not listening
            </span>
        )
    }

    const label = data.artist ? `${data.title} — ${data.artist}` : data.title
    const playing = data.isPlaying

    const body = (
        <>
            <span
                aria-hidden
                className={cn(
                    'dot-nudge inline-block size-1.5 shrink-0 rounded-full',
                    playing ? 'bg-success' : 'bg-muted-foreground'
                )}
            />
            <span className="text-foreground min-w-0 break-all">{label}</span>
            {playing ? null : (
                <span className="text-muted-foreground dot-nudge shrink-0 text-xs">
                    (paused)
                </span>
            )}
        </>
    )

    const baseClass = cn('inline-flex items-start gap-2', className)

    if (data.url) {
        return (
            <a
                aria-label={`${playing ? 'Now playing' : 'Paused'} on Spotify: ${label}`}
                href={data.url}
                rel="noreferrer noopener"
                target="_blank"
                className={cn(
                    baseClass,
                    'hover:[&_.text-foreground]:text-accent transition-token group'
                )}>
                {body}
            </a>
        )
    }

    return <span className={baseClass}>{body}</span>
}
