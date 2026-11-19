import type { ReactNode } from 'react'

export interface TimelineEntry {
    end?: string | undefined
    slug: string
    start: string
}

export interface TimelineProps<T extends TimelineEntry> {
    className?: string
    items: T[]
    renderContent: (item: T) => ReactNode
}
