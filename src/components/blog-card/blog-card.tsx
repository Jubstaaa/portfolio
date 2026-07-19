import { ContentCard } from '@/components/content-card'
import type { Post } from '@/lib/content'
import { formatDate } from '@/lib/format'

export interface BlogCardProps {
    className?: string
    post: Post
}

export function BlogCard({ className, post }: BlogCardProps) {
    return (
        <ContentCard
            description={post.description}
            href={post.path}
            title={post.title}
            meta={
                <>
                    <span className="font-mono tracking-tight">
                        {formatDate(post.date)}
                    </span>
                    <span aria-hidden className="select-none">
                        ·
                    </span>
                    <span>{post.category}</span>
                </>
            }
            {...(post.tags.length > 0
                ? { tags: post.tags.map(t => <span key={t}>#{t}</span>) }
                : {})}
            {...(className ? { className } : {})}
        />
    )
}
