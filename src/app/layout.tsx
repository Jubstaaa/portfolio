import type { ReactNode } from 'react'

import type { Metadata, Viewport } from 'next'

import localFont from 'next/font/local'

import { Footer } from '@/components/footer'
import { Nav } from '@/components/nav'
import { ScrollProgress } from '@/components/scroll-progress'
import { site } from '@/lib/content'
import { ogLocale } from '@/lib/site'

import { Providers } from './providers'
import './globals.css'

const hermit = localFont({
    display: 'swap',
    src: [
        {
            path: '../fonts/hermit/Hermit-Regular.otf',
            style: 'normal',
            weight: '400',
        },
        {
            path: '../fonts/hermit/Hermit-RegularItalic.otf',
            style: 'italic',
            weight: '400',
        },
        {
            path: '../fonts/hermit/Hermit-Bold.otf',
            style: 'normal',
            weight: '700',
        },
        {
            path: '../fonts/hermit/Hermit-BoldItalic.otf',
            style: 'italic',
            weight: '700',
        },
    ],
    variable: '--font-hermit',
})

export const metadata: Metadata = {
    alternates: {
        canonical: site.url,
        types: {
            'application/rss+xml': '/feed.xml',
        },
    },
    applicationName: site.name,
    authors: [{ name: site.name, url: site.url }],
    creator: site.name,
    description: site.description,
    keywords: [
        'ilker balcilar',
        'software engineer',
        'frontend engineer',
        'full-stack developer',
        'istanbul',
        'nextjs',
        'typescript',
        'react',
        'react native',
        'node.js',
        'hono',
        'portfolio',
    ],
    metadataBase: new URL(site.url),
    openGraph: {
        description: site.description,
        locale: ogLocale,
        siteName: site.name,
        title: site.title,
        type: 'website',
        url: site.url,
    },
    publisher: site.name,
    robots: { follow: true, index: true },
    title: {
        default: site.title,
        template: `%s — ${site.name}`,
    },
    twitter: {
        card: 'summary_large_image',
        creator: `@${site.handle}`,
        description: site.description,
        title: site.title,
    },
}

export const viewport: Viewport = {
    colorScheme: 'dark light',
    themeColor: [
        {
            color: 'oklch(0.17 0.013 255)',
            media: '(prefers-color-scheme: dark)',
        },
        {
            color: 'oklch(0.985 0.005 85)',
            media: '(prefers-color-scheme: light)',
        },
    ],
}

export default function RootLayout({ children }: { children: ReactNode }) {
    return (
        <html
            suppressHydrationWarning
            className={hermit.variable}
            lang={site.locale}>
            <body
                suppressHydrationWarning
                className="bg-background text-foreground flex min-h-screen flex-col font-mono antialiased">
                <Providers>
                    <Nav />
                    <ScrollProgress />
                    <main className="flex flex-1 flex-col" id="main">
                        {children}
                    </main>
                    <Footer />
                </Providers>
            </body>
        </html>
    )
}
