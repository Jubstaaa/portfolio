import { Heading } from '@/components/heading'
import { cn } from '@/lib/utils'

export interface SectionHeadingProps {
    as?: 'h1' | 'h2' | 'h3'
    className?: string
    description?: string
    number?: string
    title: string
}

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
