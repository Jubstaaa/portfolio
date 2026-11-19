import type { Element, Root } from 'hast'

import { posix } from 'node:path'
import rehypePrettyCode, {
    type Options as PrettyCodeOptions,
} from 'rehype-pretty-code'
import remarkGfm from 'remark-gfm'
import sharp from 'sharp'
import { EXIT, visit } from 'unist-util-visit'
import { defineCollection, defineConfig, s } from 'velite'

import { readImageBytes } from './src/features/content/image-source'
import { rehypeNormalizeHeadings } from './src/features/content/rehype-normalize-headings'
import { isYearMonth } from './src/lib/format'

const prettyCode: PrettyCodeOptions = {
    defaultLang: 'plaintext',
    keepBackground: false,
    theme: { dark: 'github-dark-default', light: 'github-light' },
}

const image = s
    .object({
        alt: s.string(),
        caption: s.string().optional(),
        src: s.string(),
    })
    .transform(async data => {
        // Stamp intrinsic dimensions on local images so next/image reserves the
        // aspect-ratio box (no flicker on cover / gallery images).
        const blank = {
            ...data,
            height: undefined as number | undefined,
            width: undefined as number | undefined,
        }
        if (!data.src.startsWith('/')) return blank

        const { height, width } = await sharp(
            await readImageBytes(data.src)
        ).metadata()

        return { ...data, height, width }
    })

// Flag the first image in the body so it can be preloaded — it becomes the
// LCP element on posts whose cover is hidden (showCover: false).
function rehypeFirstImagePriority() {
    return (tree: Root) => {
        visit(tree, { tagName: 'img', type: 'element' }, (node: Element) => {
            node.properties.dataPriority = 'true'
            return EXIT
        })
    }
}

// Stamp intrinsic width/height on local body images so next/image reserves the
// correct aspect-ratio box up front — kills the reload layout shift / flicker.
function rehypeImageDimensions() {
    return async (tree: Root) => {
        const images: Element[] = []
        visit(tree, { tagName: 'img', type: 'element' }, (node: Element) => {
            images.push(node)
        })

        await Promise.all(
            images.map(async node => {
                const { height, src, width } = node.properties
                if (typeof src !== 'string' || !src.startsWith('/')) return
                if (width && height) return
                const metadata = await sharp(
                    await readImageBytes(src)
                ).metadata()
                if (metadata.width && metadata.height) {
                    node.properties.width = metadata.width
                    node.properties.height = metadata.height
                }
            })
        )
    }
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
            cover: image.optional(),
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
            images: s.array(image).default([]),
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
