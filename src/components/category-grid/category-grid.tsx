import { LabeledGrid } from '@/components/labeled-grid'

import type { CategoryGridProps } from './category-grid.types'

export function CategoryGrid({ className, groups }: CategoryGridProps) {
    return <LabeledGrid groups={groups} {...(className ? { className } : {})} />
}
