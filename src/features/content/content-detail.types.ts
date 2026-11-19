import type { ReactNode } from 'react'
import type { BreadcrumbList, Thing, WithContext } from 'schema-dts'

export interface ContentDetailProps {
    adjacent: {
        ariaLabel: string
        next?: { path: string; title: string }
        prev?: { path: string; title: string }
    }
    body?: string | undefined
    cover?:
        undefined | { alt: string; height: number; src: string; width: number }
    header: {
        children?: ReactNode
        lead: string
        meta: ReactNode
        tags?: ReactNode
        title: string
    }
    highlights?: string[] | undefined
    jsonLd: {
        breadcrumb: WithContext<BreadcrumbList>
        entity: WithContext<Thing>
        idPrefix: string
        slug: string
    }
    pathBar: { meta: string; segment: string }
}
