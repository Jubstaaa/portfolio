import { formatDate } from '@/lib/format'

interface PostMetaProps {
    category: string
    date: string
}

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
