import type { ReactNode } from 'react'

export interface ContentDetailProps {
    adjacent: {
        ariaLabel: string
        next?: { path: string; title: string }
        prev?: { path: string; title: string }
    }
    body?: string | undefined
    cover?:
        | { alt: string; height: number; src: string; width: number }
        | undefined
    header: {
        children?: ReactNode
        lead: string
        meta: ReactNode
        tags?: ReactNode
        title: string
    }
    highlights?: string[] | undefined
    jsonLd: {
        breadcrumb: Record<string, unknown>
        entity: Record<string, unknown>
        idPrefix: string
        slug: string
    }
    pathBar: { meta: string; segment: string }
}
