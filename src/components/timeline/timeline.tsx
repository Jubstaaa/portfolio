import { TimelineRow } from '@/components/timeline-row/timeline-row'
import { formatMonth } from '@/lib/format'
import { cn } from '@/lib/utils'

import type { TimelineEntry, TimelineProps } from './timeline.types'

export function Timeline<T extends TimelineEntry>({
    className,
    items,
    renderContent,
}: TimelineProps<T>) {
    return (
        <ol className={cn('flex flex-col', className)}>
            {items.map(item => (
                <TimelineRow
                    key={item.slug}
                    dateRange={`${formatMonth(item.start)} — ${formatMonth(item.end)}`}>
                    {renderContent(item)}
                </TimelineRow>
            ))}
        </ol>
    )
}
