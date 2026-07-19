import { Heading } from '@/components/heading'
import { cn } from '@/lib/utils'

import type { SectionHeadingProps } from './section-heading.types'

export function SectionHeading({
    as = 'h2',
    className,
    description,
    number,
    title,
}: SectionHeadingProps) {
    return (
        <div className={cn('relative space-y-3', className)}>
            {number ? (
                <span
                    aria-hidden
                    className="text-muted-foreground absolute top-0 -left-10 hidden text-xs md:block">
                    {number}
                </span>
            ) : null}
            <Heading as={as} title={title} />
            {description ? (
                <p className="text-muted-foreground prose-max text-sm">
                    {description}
                </p>
            ) : null}
        </div>
    )
}
