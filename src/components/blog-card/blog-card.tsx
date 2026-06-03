import { ContentCard } from "@/components/content-card";
import type { Post } from "@/lib/content";
import { formatDate } from "@/lib/format";
import { cn } from "@/lib/utils";

export interface BlogCardProps {
  post: Post;
  className?: string;
}

export function BlogCard({ post, className }: BlogCardProps) {
  return (
    <ContentCard
      href={post.path}
      meta={
        <>
          <span className="font-mono tracking-tight">{formatDate(post.date)}</span>
          <span aria-hidden className="select-none">
            ·
          </span>
          <span>{post.category}</span>
        </>
      }
      title={post.title}
      description={post.description}
      {...(post.tags.length > 0 ? { tags: post.tags.map((t) => <span key={t}>#{t}</span>) } : {})}
      className={cn("transition-[border-color] duration-[--duration-base] ease-out", className)}
    />
  );
}
