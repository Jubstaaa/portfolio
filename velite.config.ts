import { posix } from 'node:path'
import rehypePrettyCode, {
    type Options as PrettyCodeOptions,
} from 'rehype-pretty-code'
import remarkGfm from 'remark-gfm'
import { defineCollection, defineConfig, s } from 'velite'

import { rehypeImageDimensions } from './src/features/content/pipeline/image-dimensions'
import { imageSchema } from './src/features/content/pipeline/image-schema'
import { rehypeFirstImagePriority } from './src/features/content/pipeline/rehype-first-image-priority'
import { rehypeNormalizeHeadings } from './src/features/content/pipeline/rehype-normalize-headings'
import { isYearMonth } from './src/lib/format'

const prettyCode: PrettyCodeOptions = {
    defaultLang: 'plaintext',
    keepBackground: false,
    theme: { dark: 'github-dark-default', light: 'github-light' },
}

const site = defineCollection({
    name: 'Site',
    pattern: 'site.json',
    schema: s.object({
        description: s.string(),
        email: s.string().email(),
        handle: s.string(),
        locale: s.literal('en'),
        location: s.string(),
        name: s.string(),
        nav: s.array(s.object({ href: s.string(), label: s.string() })),
        role: s.string(),
        title: s.string(),
        url: s.string().url(),
    }),
    single: true,
})

const posts = defineCollection({
    name: 'Post',
    pattern: 'blog/*.mdx',
    schema: s
        .object({
            body: s.mdx(),
            category: s.string(),
            cover: imageSchema.optional(),
            date: s.isodate(),
            description: s.string(),
            draft: s.boolean().default(false),
            raw: s.raw(),
            showCover: s.boolean().default(true),
            slug: s.path(),
            tags: s.array(s.string()).default([]),
            title: s.string(),
            updated: s.isodate().optional(),
        })
        .transform(data => {
            const slug = posix.basename(data.slug)
            return { ...data, path: `/blog/${slug}`, slug }
        }),
})

const projects = defineCollection({
    name: 'Project',
    pattern: 'projects/*.mdx',
    schema: s
        .object({
            body: s.mdx(),
            category: s.string(),
            highlights: s.array(s.string()).default([]),
            images: s.array(imageSchema).default([]),
            order: s.number().optional(),
            raw: s.raw(),
            repo: s.string().url().optional(),
            stack: s.array(s.string()).default([]),
            summary: s.string(),
            title: s.string(),
            url: s.string().url().optional(),
        })
        .transform((data, { meta }) => {
            const slug = posix.parse(meta.path).name
            return { ...data, path: `/projects/${slug}`, slug }
        }),
})

const experiences = defineCollection({
    name: 'Experience',
    pattern: 'experiences/*.json',
    schema: s
        .object({
            company: s.string(),
            end: s.string().refine(isYearMonth, 'expected YYYY-MM').optional(),
            highlights: s.array(s.string()).default([]),
            location: s.string(),
            role: s.string(),
            stack: s.array(s.string()).default([]),
            start: s.string().refine(isYearMonth, 'expected YYYY-MM'),
            summary: s.string(),
        })
        .transform((data, { meta }) => {
            return { ...data, slug: posix.parse(meta.path).name }
        }),
})

const education = defineCollection({
    name: 'Education',
    pattern: 'education/*.json',
    schema: s
        .object({
            degree: s.string(),
            end: s.string().refine(isYearMonth, 'expected YYYY-MM').optional(),
            field: s.string().optional(),
            location: s.string().optional(),
            notes: s.string().optional(),
            school: s.string(),
            start: s.string().refine(isYearMonth, 'expected YYYY-MM'),
        })
        .transform((data, { meta }) => {
            return { ...data, slug: posix.parse(meta.path).name }
        }),
})

const skills = defineCollection({
    name: 'Skill',
    pattern: 'data/skills.json',
    schema: s.object({
        category: s.enum([
            'lang',
            'frontend',
            'backend',
            'devops',
            'design',
            'other',
        ]),
        name: s.string(),
    }),
})

const stacks = defineCollection({
    name: 'Stack',
    pattern: 'data/stacks.json',
    schema: s.object({
        category: s.enum([
            'framework',
            'library',
            'lang',
            'infra',
            'tooling',
            'design',
        ]),
        name: s.string(),
    }),
})

const socials = defineCollection({
    name: 'Social',
    pattern: 'data/socials.json',
    schema: s.object({
        href: s.string().url(),
        label: s.string(),
    }),
})

export default defineConfig({
    collections: {
        education,
        experiences,
        posts,
        projects,
        site,
        skills,
        socials,
        stacks,
    },
    mdx: {
        rehypePlugins: [
            rehypeNormalizeHeadings,
            rehypeFirstImagePriority,
            rehypeImageDimensions,
            [rehypePrettyCode, prettyCode],
        ],
        remarkPlugins: [remarkGfm],
    },
    output: {
        assets: 'public/_velite',
        base: '/_velite/',
        clean: true,
        data: '.velite',
        name: '[name]-[hash:8].[ext]',
    },
    root: 'content',
})
