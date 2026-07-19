import { CategoryGrid } from '@/components/category-grid/category-grid'
import { SectionHeading } from '@/components/section-heading/section-heading'
import { getSkillsByCategory } from '@/lib/content'

import { SKILL_CATEGORY_LABEL, SKILL_CATEGORY_ORDER } from './skills.constants'

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
