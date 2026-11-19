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
    return (
        all
            .filter(post => !post.draft)
            // Same-day posts fall back to slug order so lists and feeds stay stable.
            .toSorted(
                (a, b) =>
                    b.date.localeCompare(a.date) || a.slug.localeCompare(b.slug)
            )
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
    current: T
): { next?: T; prev?: T } {
    const index = list.findIndex(item => item.slug === current.slug)
    if (index === -1) return {}
    const prev = list[index + 1]
    const next = list[index - 1]
    return { ...(prev ? { prev } : {}), ...(next ? { next } : {}) }
}

export function getEducationSorted(): Education[] {
    return education.toSorted(byRecency)
}

export function getExperiencesSorted(): Experience[] {
    return experiences.toSorted(byRecency)
}

// Categories without entries are absent from the result.
export function getSkillsByCategory(): Partial<
    Record<Skill['category'], Skill[]>
> {
    return groupBy(skills, 'category')
}

export function getStacksByCategory(): Partial<
    Record<Stack['category'], Stack[]>
> {
    return groupBy(stacks, 'category')
}
