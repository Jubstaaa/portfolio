import { site } from '@/lib/content'

export function absoluteUrl(path: string): string {
    return new URL(path, site.url).toString()
}

// Typed by the site schema's locale, so adding a locale there demands an entry.
const OG_LOCALE: Record<typeof site.locale, string> = { en: 'en_US' }

export const ogLocale = OG_LOCALE[site.locale]

export const handlePath = (segment?: string) =>
    segment ? `~/${site.handle}/${segment}` : `~/${site.handle}`
