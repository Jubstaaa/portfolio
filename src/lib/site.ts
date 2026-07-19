import { site } from '@/lib/content'

export const ogLocale = site.locale === 'en' ? 'en_US' : site.locale

export const handlePath = (segment?: string) =>
    segment ? `~/${site.handle}/${segment}` : `~/${site.handle}`
