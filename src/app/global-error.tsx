'use client'

import type { ErrorPageProps } from './error.types'

import ErrorPage from './error'

import '@/app/globals.css'

// Replaces the root layout when the layout itself throws, so it renders its own
// document shell and stylesheet.
export default function GlobalError(props: ErrorPageProps) {
    return (
        <html lang="en">
            <body className="bg-background text-foreground flex min-h-screen flex-col font-mono antialiased">
                <main className="flex flex-1 flex-col">
                    <ErrorPage {...props} />
                </main>
            </body>
        </html>
    )
}
