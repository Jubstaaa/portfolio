import { CategoryGrid } from '@/components/category-grid'
import { SectionHeading } from '@/components/section-heading'
import { getSkillsByCategory, getStacksByCategory } from '@/lib/content'

import {
    SKILL_CATEGORY_LABEL,
    SKILL_CATEGORY_ORDER,
    STACK_CATEGORY_LABEL,
    STACK_CATEGORY_ORDER,
} from './skills.constants'

export function Skills() {
    return (
        <div className="space-y-6">
            <SectionHeading number="04" title="skills" />
            <CategoryGrid
                buckets={getSkillsByCategory()}
                label={SKILL_CATEGORY_LABEL}
                order={SKILL_CATEGORY_ORDER}
            />
        </div>
    )
}

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
