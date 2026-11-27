'use client'

import Link from 'next/link'
import { useEffect } from 'react'

import { StatusDot } from '@/components/terminal-block/status-dot'
import { TerminalBlock } from '@/components/terminal-block/terminal-block'
import { TerminalLine } from '@/components/terminal-block/terminal-line'
import { TerminalMeta } from '@/components/terminal-block/terminal-meta'
import { LINK_CLASS } from '@/lib/utils'

interface ErrorPageProps {
    error: unknown
    retry: () => void
}

export default function ErrorPage({ error, retry }: ErrorPageProps) {
    useEffect(() => {
        console.error(error)
    }, [error])

    const digest = errorDigest(error)

    return (
        <section className="container-default section-pad">
            <TerminalBlock>
                <TerminalMeta branch="500" path="~/error" />

                <TerminalLine command="cat .">
                    <h1 className="font-normal">
                        <StatusDot tone="danger" />
                        unexpected error · 500
                    </h1>
                    <p className="text-muted-foreground">
                        <span aria-hidden className="mr-1 select-none">
                            →
                        </span>
                        the page failed to render
                    </p>
                    {digest ? (
                        <p className="text-muted-foreground">
                            <span aria-hidden className="mr-1 select-none">
                                →
                            </span>
                            ref: {digest}
                        </p>
                    ) : null}
                </TerminalLine>

                <TerminalLine command="retry">
                    <p>
                        <button
                            className={LINK_CLASS}
                            onClick={retry}
                            type="button">
                            ./reset
                        </button>
                        <span
                            aria-hidden
                            className="text-muted-foreground mx-3 select-none">
                            ·
                        </span>
                        <Link
                            className="text-foreground hover:text-accent transition-token underline-offset-4 hover:underline"
                            href="/">
                            ./home
                        </Link>
                    </p>
                </TerminalLine>
            </TerminalBlock>
        </section>
    )
}

function errorDigest(error: unknown): string | undefined {
    if (!(error instanceof Error) || !('digest' in error)) return undefined
    return typeof error.digest === 'string' ? error.digest : undefined
}
