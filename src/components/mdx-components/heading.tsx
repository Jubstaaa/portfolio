import type { HTMLAttributes } from 'react'

import { cn } from '@/lib/utils'

import { HEADING_CLASS } from './mdx-components.constants'

export function makeHeading(tag: keyof typeof HEADING_CLASS) {
    const Tag = tag
    return function MdxHeading({
        className,
        ...props
    }: HTMLAttributes<HTMLHeadingElement>) {
        return <Tag className={cn(HEADING_CLASS[tag], className)} {...props} />
    }
}
