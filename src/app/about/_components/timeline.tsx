import { formatMonth } from '@/lib/format'
import { cn } from '@/lib/utils'

import type { TimelineEntry, TimelineProps } from './timeline.types'

import { TimelineRow } from './timeline-row'

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
