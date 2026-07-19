import { TimelineRow } from '@/components/timeline-row'
import type { Education } from '@/lib/content'
import { formatMonth } from '@/lib/format'
import { cn } from '@/lib/utils'

export interface EducationListProps {
    className?: string
    items: Education[]
}

export function EducationList({ className, items }: EducationListProps) {
    return (
        <ol className={cn('flex flex-col', className)}>
            {items.map(edu => (
                <TimelineRow
                    key={edu.slug}
                    dateRange={`${formatMonth(edu.start)} — ${formatMonth(edu.end)}`}>
                    <p className="text-foreground">{edu.school}</p>
                    <p className="text-muted-foreground text-xs">
                        {edu.degree}
                        {edu.field ? (
                            <>
                                <span aria-hidden className="mx-2 select-none">
                                    ·
                                </span>
                                {edu.field}
                            </>
                        ) : null}
                        {edu.location ? (
                            <>
                                <span aria-hidden className="mx-2 select-none">
                                    ·
                                </span>
                                {edu.location}
                            </>
                        ) : null}
                    </p>
                    {edu.notes ? (
                        <p className="text-muted-foreground max-w-prose text-sm">
                            {edu.notes}
                        </p>
                    ) : null}
                </TimelineRow>
            ))}
        </ol>
    )
}
