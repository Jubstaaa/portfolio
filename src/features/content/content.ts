import { groupBy } from 'lodash-es'

import {
    education,
    type Education,
    type Experience,
    experiences,
    type Post,
    posts,
    type Project,
    projects,
    site,
    type Skill,
    skills,
    socials,
    type Stack,
    stacks,
} from '#site/content'

export { site, socials }
export type { Education, Experience, Post, Project, Skill, Stack }

export function getAllProjects(): Project[] {
    return projects.toSorted((a, b) => {
        const ao = a.order ?? Number.POSITIVE_INFINITY
        const bo = b.order ?? Number.POSITIVE_INFINITY
        return ao - bo
    })
}

export function getPostBySlug(slug: string): Post | undefined {
    return getPublishedPosts().find(post => post.slug === slug)
}

export function getProjectBySlug(slug: string): Project | undefined {
    return projects.find(project => project.slug === slug)
}

export function getPublishedPosts(): Post[] {
    return selectPublished(posts)
}

export function selectPublished(all: readonly Post[]): Post[] {
    return all
        .filter(post => !post.draft)

        .toSorted(
            (a, b) =>
                b.date.localeCompare(a.date) || a.slug.localeCompare(b.slug)
        )
}

const CURRENT = '9999-99'

interface Datable {
    end?: string | undefined
    start: string
}

export function byRecency(a: Datable, b: Datable): number {
    return (
        (b.end ?? CURRENT).localeCompare(a.end ?? CURRENT) ||
        b.start.localeCompare(a.start)
    )
}

export function getAdjacent<T extends { slug: string }>(
    list: T[],
    current: T,
    order: 'display-order' | 'newest-first' = 'newest-first'
): { next?: T; prev?: T } {
    const index = list.findIndex(item => item.slug === current.slug)
    if (index === -1) return {}
    const step = order === 'newest-first' ? 1 : -1
    const prev = list[index + step]
    const next = list[index - step]
    return { ...(prev ? { prev } : {}), ...(next ? { next } : {}) }
}

export function getEducationSorted(): Education[] {
    return education.toSorted(byRecency)
}

export function getExperiencesSorted(): Experience[] {
    return experiences.toSorted(byRecency)
}

export function getSkillsByCategory(): Partial<
    Record<Skill['category'], Skill[]>
> {
    return groupBy(skills, 'category')
}

export function getSocialHref(label: string): string {
    const social = socials.find(entry => entry.label === label)
    if (!social) throw new Error(`no "${label}" entry in socials.json`)
    return social.href
}

export function getStacksByCategory(): Partial<
    Record<Stack['category'], Stack[]>
> {
    return groupBy(stacks, 'category')
}
