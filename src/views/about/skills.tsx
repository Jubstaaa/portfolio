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
    const buckets = getSkillsByCategory()
    const groups = SKILL_CATEGORY_ORDER.filter(
        cat => (buckets[cat] ?? []).length > 0
    ).map(cat => ({
        items: (buckets[cat] ?? []).map(skill => skill.name),
        label: SKILL_CATEGORY_LABEL[cat],
    }))

    return (
        <div className="space-y-6">
            <SectionHeading number="04" title="skills" />
            <CategoryGrid groups={groups} />
        </div>
    )
}

export function Stacks() {
    const buckets = getStacksByCategory()
    const groups = STACK_CATEGORY_ORDER.filter(
        cat => (buckets[cat] ?? []).length > 0
    ).map(cat => ({
        items: (buckets[cat] ?? []).map(stack => stack.name),
        label: STACK_CATEGORY_LABEL[cat],
    }))

    return (
        <div className="space-y-6">
            <SectionHeading number="05" title="stacks" />
            <CategoryGrid groups={groups} />
        </div>
    )
}
