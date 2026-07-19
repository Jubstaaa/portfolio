import { cn } from '@/lib/utils'

export interface LabeledGridGroup {
    items: string[]
    label: string
}

export interface LabeledGridProps {
    className?: string
    groups: LabeledGridGroup[]
}

export function LabeledGrid({ className, groups }: LabeledGridProps) {
    return (
        <dl className={cn('grid gap-x-10 gap-y-6 md:grid-cols-2', className)}>
            {groups.map(group => (
                <div key={group.label} className="space-y-2">
                    <dt className="text-muted-foreground label-caps">
                        {group.label}
                    </dt>
                    <dd>
                        <ul className="text-foreground flex flex-wrap gap-x-3 gap-y-1 text-sm">
                            {group.items.map(item => (
                                <li key={item}>{item}</li>
                            ))}
                        </ul>
                    </dd>
                </div>
            ))}
        </dl>
    )
}
