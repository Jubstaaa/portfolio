import rehypePrettyCode, {
    type Options as PrettyCodeOptions,
} from 'rehype-pretty-code'
import remarkGfm from 'remark-gfm'
import type { Element, Root } from 'hast'
import { posix } from 'node:path'
import sharp from 'sharp'
import { EXIT, visit } from 'unist-util-visit'
import { defineConfig, defineCollection, s } from 'velite'

import { isYearMonth } from './src/lib/format'
import { readImageBytes } from './src/lib/image-source'
import { rehypeNormalizeHeadings } from './src/lib/rehype-normalize-headings'

const prettyCode: PrettyCodeOptions = {
    theme: { dark: 'github-dark-default', light: 'github-light' },
    defaultLang: 'plaintext',
    keepBackground: false,
}

const image = s
    .object({
        src: s.string(),
        alt: s.string(),
        caption: s.string().optional(),
    })
    .transform(async data => {
        // Stamp intrinsic dimensions on local images so next/image reserves the
        // aspect-ratio box (no flicker on cover / gallery images).
        const blank = {
            ...data,
            width: undefined as number | undefined,
            height: undefined as number | undefined,
        }
        if (!data.src.startsWith('/')) return blank

        const { width, height } = await sharp(
            await readImageBytes(data.src)
        ).metadata()

        return { ...data, width, height }
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
    single: true,
    schema: s.object({
        name: s.string(),
        handle: s.string(),
        role: s.string(),
        location: s.string(),
        title: s.string(),
        description: s.string(),
        url: s.string().url(),
        email: s.string().email(),
        locale: s.literal('en'),
        nav: s.array(s.object({ label: s.string(), href: s.string() })),
    }),
})

const posts = defineCollection({
    name: 'Post',
    pattern: 'blog/*.mdx',
    schema: s
        .object({
            title: s.string(),
            description: s.string(),
            date: s.isodate(),
            updated: s.isodate().optional(),
            category: s.string(),
            tags: s.array(s.string()).default([]),
            draft: s.boolean().default(false),
            cover: image.optional(),
            showCover: s.boolean().default(true),
            slug: s.path(),
            body: s.mdx(),
            raw: s.raw(),
        })
        .transform(data => {
            const slug = posix.basename(data.slug)
            return { ...data, slug, path: `/blog/${slug}` }
        }),
})

const projects = defineCollection({
    name: 'Project',
    pattern: 'projects/*.mdx',
    schema: s
        .object({
            title: s.string(),
            summary: s.string(),
            category: s.string(),
            order: s.number().optional(),
            stack: s.array(s.string()).default([]),
            repo: s.string().url().optional(),
            url: s.string().url().optional(),
            images: s.array(image).default([]),
            highlights: s.array(s.string()).default([]),
            body: s.mdx(),
            raw: s.raw(),
        })
        .transform((data, { meta }) => {
            const slug = posix.parse(meta.path).name
            return { ...data, slug, path: `/projects/${slug}` }
        }),
})

const experiences = defineCollection({
    name: 'Experience',
    pattern: 'experiences/*.json',
    schema: s
        .object({
            company: s.string(),
            role: s.string(),
            start: s.string().refine(isYearMonth, 'expected YYYY-MM'),
            end: s.string().refine(isYearMonth, 'expected YYYY-MM').optional(),
            location: s.string(),
            summary: s.string(),
            highlights: s.array(s.string()).default([]),
            stack: s.array(s.string()).default([]),
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
            school: s.string(),
            degree: s.string(),
            field: s.string().optional(),
            start: s.string().refine(isYearMonth, 'expected YYYY-MM'),
            end: s.string().refine(isYearMonth, 'expected YYYY-MM').optional(),
            location: s.string().optional(),
            notes: s.string().optional(),
        })
        .transform((data, { meta }) => {
            return { ...data, slug: posix.parse(meta.path).name }
        }),
})

const skills = defineCollection({
    name: 'Skill',
    pattern: 'data/skills.json',
    schema: s.object({
        name: s.string(),
        category: s.enum([
            'lang',
            'frontend',
            'backend',
            'devops',
            'design',
            'other',
        ]),
    }),
})

const stacks = defineCollection({
    name: 'Stack',
    pattern: 'data/stacks.json',
    schema: s.object({
        name: s.string(),
        category: s.enum([
            'framework',
            'library',
            'lang',
            'infra',
            'tooling',
            'design',
        ]),
    }),
})

const socials = defineCollection({
    name: 'Social',
    pattern: 'data/socials.json',
    schema: s.object({
        label: s.string(),
        href: s.string().url(),
    }),
})

export default defineConfig({
    root: 'content',
    output: {
        data: '.velite',
        assets: 'public/_velite',
        base: '/_velite/',
        name: '[name]-[hash:8].[ext]',
        clean: true,
    },
    collections: {
        site,
        posts,
        projects,
        experiences,
        education,
        skills,
        stacks,
        socials,
    },
    mdx: {
        remarkPlugins: [remarkGfm],
        rehypePlugins: [
            rehypeNormalizeHeadings,
            rehypeFirstImagePriority,
            rehypeImageDimensions,
            [rehypePrettyCode, prettyCode],
        ],
    },
})
