import { LabeledGrid } from './labeled-grid'

interface CategoryGridProps<T extends string> {
    buckets: Partial<Record<T, { name: string }[]>>
    className?: string
    label: Record<T, string>
    order: T[]
}

export function CategoryGrid<T extends string>({
    buckets,
    className,
    label,
    order,
}: CategoryGridProps<T>) {
    const groups = order.flatMap(cat => {
        const items = buckets[cat]
        return items?.length
            ? [{ items: items.map(item => item.name), label: label[cat] }]
            : []
    })

    return <LabeledGrid groups={groups} {...(className ? { className } : {})} />
}
