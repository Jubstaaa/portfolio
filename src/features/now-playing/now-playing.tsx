'use client'

import { cn } from '@/lib/utils'

import { useNowPlaying } from './now-playing.hooks'

interface NowPlayingProps {
    className?: string
}

export function NowPlaying({ className }: NowPlayingProps) {
    const { data } = useNowPlaying()
    const track = data?.isPlaying ? data : undefined
    const label = track && `${track.title} — ${track.artist}`

    return (
        <span className={cn('inline-flex items-start gap-2', className)}>
            {track && (
                <span
                    aria-hidden
                    className="dot-nudge bg-success inline-block size-1.5 shrink-0 rounded-full"
                />
            )}
            <span
                className={cn(
                    'min-w-0 break-all',
                    track ? 'text-foreground' : 'text-muted-foreground'
                )}>
                {track ? (
                    <a
                        aria-label={`Now playing on Spotify: ${label}`}
                        className="hover:text-accent transition-token"
                        href={track.url}
                        rel="noreferrer noopener"
                        target="_blank">
                        {label}
                    </a>
                ) : data ? (
                    '— not listening'
                ) : (
                    '—'
                )}
            </span>
        </span>
    )
}
