import { formatDate } from '@/lib/format'

import type { PostMetaProps } from './post-meta.types'

export function PostMeta({ category, date }: PostMetaProps) {
    return (
        <>
            <span className="font-mono tracking-tight">{formatDate(date)}</span>
            <span aria-hidden className="select-none">
                ·
            </span>
            <span>{category}</span>
        </>
    )
}
