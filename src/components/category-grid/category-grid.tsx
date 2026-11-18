import { LabeledGrid } from '@/components/labeled-grid/labeled-grid'

import type { CategoryGridProps } from './category-grid.types'

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
