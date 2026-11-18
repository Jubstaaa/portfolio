import type { Metadata, Viewport } from 'next'

import localFont from 'next/font/local'

import { Footer } from '@/components/footer/footer'
import { Nav } from '@/components/nav/nav'
import { Providers } from '@/components/providers/providers'
import { ScrollProgress } from '@/components/scroll-progress/scroll-progress'
import { SkipLink } from '@/components/skip-link/skip-link'
import { site } from '@/lib/content'
import { ogLocale } from '@/lib/site'
import { cn } from '@/lib/utils'

import { SITE_KEYWORDS } from './root-layout.constants'
import type { RootLayoutProps } from './root-layout.types'

import '@/app/globals.css'

// Upright faces are on every page, so they are preloaded. Italics only appear in
// MDX emphasis and blockquotes; a separate family keeps them off the critical path.
const hermit = localFont({
    display: 'swap',
    src: [
        {
            path: '../../fonts/hermit/Hermit-Regular.woff2',
            style: 'normal',
            weight: '400',
        },
        {
            path: '../../fonts/hermit/Hermit-Bold.woff2',
            style: 'normal',
            weight: '700',
        },
    ],
    variable: '--font-hermit',
})

const hermitItalic = localFont({
    display: 'swap',
    preload: false,
    src: [
        {
            path: '../../fonts/hermit/Hermit-RegularItalic.woff2',
            style: 'italic',
            weight: '400',
        },
        {
            path: '../../fonts/hermit/Hermit-BoldItalic.woff2',
            style: 'italic',
            weight: '700',
        },
    ],
    variable: '--font-hermit-italic',
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
    keywords: SITE_KEYWORDS,
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

export default function RootLayout({ children }: RootLayoutProps) {
    return (
        <html
            suppressHydrationWarning
            className={cn(hermit.variable, hermitItalic.variable)}
            lang={site.locale}>
            <body
                suppressHydrationWarning
                className="bg-background text-foreground flex min-h-screen flex-col font-mono antialiased">
                <Providers>
                    <SkipLink />
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
