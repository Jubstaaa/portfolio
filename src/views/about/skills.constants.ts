import type { Skill, Stack } from '@/lib/content'

export const SKILL_CATEGORY_LABEL: Record<Skill['category'], string> = {
    backend: 'backend',
    design: 'design',
    devops: 'devops',
    frontend: 'frontend',
    lang: 'languages',
    other: 'other',
}

export const SKILL_CATEGORY_ORDER: Skill['category'][] = [
    'lang',
    'frontend',
    'backend',
    'devops',
    'design',
    'other',
]

export const STACK_CATEGORY_LABEL: Record<Stack['category'], string> = {
    design: 'design',
    framework: 'frameworks',
    infra: 'infra',
    lang: 'languages',
    library: 'libraries',
    tooling: 'tooling',
}

export const STACK_CATEGORY_ORDER: Stack['category'][] = [
    'lang',
    'framework',
    'library',
    'design',
    'tooling',
    'infra',
]
