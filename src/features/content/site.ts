import { site } from './content'

export function absoluteUrl(path: string): string {
    return new URL(path, site.url).toString()
}

const OG_LOCALE: Record<typeof site.locale, string> = { en: 'en_US' }

export const ogLocale = OG_LOCALE[site.locale]

export const navLabel = (label: string) => `./${label}`

export const handlePath = (segment?: string) =>
    segment ? `~/${site.handle}/${segment}` : `~/${site.handle}`
