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
    type Site,
    type Skill,
    skills,
    type Social,
    socials,
    type Stack,
    stacks,
} from '#site/content'

export {
    education,
    experiences,
    posts,
    projects,
    site,
    skills,
    socials,
    stacks,
}
export type { Education, Experience, Post, Project, Site, Skill, Social, Stack }

// ───── Posts ──────────────────────────────────────────────────────────────────
export function getPublishedPosts(): Post[] {
    return posts
        .filter(post => !post.draft)
        .slice()
        .sort((a, b) => b.date.localeCompare(a.date))
}

export function getPostBySlug(slug: string): Post | undefined {
    return posts.find(post => post.slug === slug)
}

// ───── Projects ───────────────────────────────────────────────────────────────
export function getAllProjects(): Project[] {
    return projects.slice().sort((a, b) => {
        const ao = a.order ?? Number.POSITIVE_INFINITY
        const bo = b.order ?? Number.POSITIVE_INFINITY
        return ao - bo
    })
}

export function getProjectBySlug(slug: string): Project | undefined {
    return projects.find(project => project.slug === slug)
}

// ───── Experience / Education ─────────────────────────────────────────────────
const CURRENT = '9999-99'

interface Datable {
    end?: string | undefined
    start: string
}

function byRecency(a: Datable, b: Datable): number {
    return (
        (b.end ?? CURRENT).localeCompare(a.end ?? CURRENT) ||
        b.start.localeCompare(a.start)
    )
}

export function getExperiencesSorted(): Experience[] {
    return experiences.slice().sort(byRecency)
}

export function getEducationSorted(): Education[] {
    return education.slice().sort(byRecency)
}

// ───── Data ───────────────────────────────────────────────────────────────────
export function getSkillsByCategory(): Record<Skill['category'], Skill[]> {
    const buckets = {} as Record<Skill['category'], Skill[]>
    for (const skill of skills) {
        ;(buckets[skill.category] ??= []).push(skill)
    }
    return buckets
}

export function getStacksByCategory(): Record<Stack['category'], Stack[]> {
    const buckets = {} as Record<Stack['category'], Stack[]>
    for (const stack of stacks) {
        ;(buckets[stack.category] ??= []).push(stack)
    }
    return buckets
}

// ───── Adjacency ──────────────────────────────────────────────────────────────
export function getAdjacent<T extends { slug: string }>(
    list: T[],
    current: T
): { next?: T; prev?: T } {
    const index = list.findIndex(item => item.slug === current.slug)
    return {
        ...(list[index + 1] ? { prev: list[index + 1]! } : {}),
        ...(list[index - 1] ? { next: list[index - 1]! } : {}),
    }
}
