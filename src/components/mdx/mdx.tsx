/* eslint-disable react-hooks/static-components -- MDX runtime: the Content component is compiled from a code string and memoized by hash; not constructed per render. */
import * as runtime from 'react/jsx-runtime'

import { mdxComponents } from '@/components/mdx-components/mdx-components'

import type { MdxComponent, MdxProps } from './mdx.types'

const cache = new Map<string, MdxComponent>()

function getComponent(code: string): MdxComponent {
    const cached = cache.get(code)
    if (cached) return cached
    const fn = new Function(code) as (scope: typeof runtime) => {
        default: MdxComponent
    }
    const Component = fn({ ...runtime }).default
    cache.set(code, Component)
    return Component
}

export function Mdx({ code, components }: MdxProps) {
    const Content = getComponent(code)
    return <Content components={{ ...mdxComponents, ...(components ?? {}) }} />
}
