import { LabeledGrid } from '@/components/labeled-grid'
import { getStacksByCategory, type Stack } from '@/lib/content'

const CATEGORY_LABEL: Record<Stack['category'], string> = {
    design: 'design',
    framework: 'frameworks',
    infra: 'infra',
    lang: 'languages',
    library: 'libraries',
    tooling: 'tooling',
}

const CATEGORY_ORDER: Stack['category'][] = [
    'lang',
    'framework',
    'library',
    'design',
    'tooling',
    'infra',
]

export interface StacksGridProps {
    className?: string
}

export function StacksGrid({ className }: StacksGridProps) {
    const buckets = getStacksByCategory()
    const groups = CATEGORY_ORDER.filter(
        cat => (buckets[cat] ?? []).length > 0
    ).map(cat => ({
        items: (buckets[cat] ?? []).map(stack => stack.name),
        label: CATEGORY_LABEL[cat],
    }))

    return <LabeledGrid groups={groups} {...(className ? { className } : {})} />
}
