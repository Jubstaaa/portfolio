'use client'

import type { ComponentProps } from 'react'

import { site } from '@/features/content/content'
import { fontVariables } from '@/styles/fonts'

import ErrorPage from './error'
import './globals.css'

// Replaces the root layout when the layout itself throws, so it renders its own
// document shell and stylesheet.
export default function GlobalError(props: ComponentProps<typeof ErrorPage>) {
    return (
        <html className={fontVariables} lang={site.locale}>
            <body className="bg-background text-foreground flex min-h-screen flex-col font-mono antialiased">
                <main className="flex flex-1 flex-col">
                    <ErrorPage {...props} />
                </main>
            </body>
        </html>
    )
}
