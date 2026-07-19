import { LabeledGrid } from '@/components/labeled-grid/labeled-grid'

import type { CategoryGridProps } from './category-grid.types'

export function CategoryGrid<T extends string>({
    buckets,
    className,
    label,
    order,
}: CategoryGridProps<T>) {
    const groups = order
        .filter(cat => (buckets[cat] ?? []).length > 0)
        .map(cat => ({
            items: buckets[cat].map(item => item.name),
            label: label[cat],
        }))

    return <LabeledGrid groups={groups} {...(className ? { className } : {})} />
}
