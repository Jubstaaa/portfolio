import { ViewTransitionLink } from "@/components/ViewTransitionLink";
import type { Post } from "@/lib/content";
import { cn } from "@/lib/utils";

export interface BlogCardProps {
  post: Post;
  className?: string;
}

function formatDate(iso: string): string {
  return new Date(iso).toISOString().slice(0, 10);
}

export function BlogCard({ post, className }: BlogCardProps) {
  const vtName = `post-${post.slug}`;

  return (
    <ViewTransitionLink
      href={post.path}
      className={cn(
        "hairline group block border-b py-6 transition-[border-color] duration-[var(--duration-base)] ease-[var(--ease-out)]",
        className,
      )}
    >
      <p className="text-muted-foreground flex flex-wrap items-center gap-x-3 text-xs">
        <span className="font-mono tracking-tight">{formatDate(post.date)}</span>
        <span aria-hidden className="select-none">
          ·
        </span>
        <span>{post.category}</span>
        {post.featured ? (
          <>
            <span aria-hidden className="select-none">
              ·
            </span>
            <span className="text-accent">featured</span>
          </>
        ) : null}
      </p>
      <h2
        className="text-foreground group-hover:text-accent transition-token mt-2 text-lg font-semibold tracking-tight"
        style={{ viewTransitionName: vtName }}
      >
        {post.title}
      </h2>
      <p className="text-muted-foreground mt-1 max-w-prose text-sm">{post.description}</p>
      {post.tags.length > 0 ? (
        <p className="text-muted-foreground mt-2 flex flex-wrap gap-x-3 text-xs">
          {post.tags.map((t) => (
            <span key={t}>#{t}</span>
          ))}
        </p>
      ) : null}
    </ViewTransitionLink>
  );
}
