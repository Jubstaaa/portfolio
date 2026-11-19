/* eslint-disable react-hooks/static-components -- MDX runtime: the Content component is compiled from a code string and memoized by hash; not constructed per render. */
import type { ComponentType, ElementType } from 'react'

import * as runtime from 'react/jsx-runtime'

import { mdxComponents } from '@/features/content/mdx-components/mdx-components'

type MdxComponent = ComponentType<{
    components?: Record<string, ElementType>
}>

interface MdxProps {
    code: string
    components?: Record<string, ElementType>
}

const cache = new Map<string, MdxComponent>()

export function Mdx({ code, components }: MdxProps) {
    const Content = getComponent(code)
    return <Content components={{ ...mdxComponents, ...(components ?? {}) }} />
}

function getComponent(code: string): MdxComponent {
    const cached = cache.get(code)
    if (cached) return cached
    // velite's documented MDX runtime: compiled, repo-authored content only.
    // eslint-disable-next-line @typescript-eslint/no-implied-eval
    const fn = new Function(code) as (scope: typeof runtime) => {
        default: MdxComponent
    }
    const Component = fn({ ...runtime }).default
    cache.set(code, Component)
    return Component
}
