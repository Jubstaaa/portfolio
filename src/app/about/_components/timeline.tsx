import type { ReactNode } from 'react'

import { formatMonth } from '@/lib/format'
import { cn } from '@/lib/utils'

import { TimelineRow } from './timeline-row'

interface TimelineEntry {
    end?: string | undefined
    slug: string
    start: string
}

interface TimelineProps<T extends TimelineEntry> {
    className?: string
    items: T[]
    renderContent: (item: T) => ReactNode
}

export function Timeline<T extends TimelineEntry>({
    className,
    items,
    renderContent,
}: TimelineProps<T>) {
    return (
        <ol className={cn('flex flex-col', className)}>
            {items.map(item => (
                <TimelineRow
                    dateRange={`${formatMonth(item.start)} — ${formatMonth(item.end)}`}
                    key={item.slug}>
                    {renderContent(item)}
                </TimelineRow>
            ))}
        </ol>
    )
}
