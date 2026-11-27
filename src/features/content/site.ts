import { site } from './content'

export function absoluteUrl(path: string): string {
    return new URL(path, site.url).toString()
}

// Typed by the site schema's locale, so adding a locale there demands an entry.
const OG_LOCALE: Record<typeof site.locale, string> = { en: 'en_US' }

export const ogLocale = OG_LOCALE[site.locale]

// The nav's visible label comes from content, not from the path. Both the
// header and the 404's link list render it, so it lives here beside the other
// site-derived presentation helpers rather than in either one.
export const navLabel = (label: string) => `./${label}`

export const handlePath = (segment?: string) =>
    segment ? `~/${site.handle}/${segment}` : `~/${site.handle}`
