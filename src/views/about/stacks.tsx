import { CategoryGrid } from '@/components/category-grid/category-grid'
import { SectionHeading } from '@/components/section-heading/section-heading'
import { getStacksByCategory } from '@/lib/content'

import { STACK_CATEGORY_LABEL, STACK_CATEGORY_ORDER } from './skills.constants'

export function Stacks() {
    return (
        <div className="space-y-6">
            <SectionHeading number="05" title="stacks" />
            <CategoryGrid
                buckets={getStacksByCategory()}
                label={STACK_CATEGORY_LABEL}
                order={STACK_CATEGORY_ORDER}
            />
        </div>
    )
}
