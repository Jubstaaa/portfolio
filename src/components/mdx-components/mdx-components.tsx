import type {
    AnchorHTMLAttributes,
    HTMLAttributes,
    ImgHTMLAttributes,
} from 'react'

import Image from 'next/image'

import { CodeBlock } from '@/components/code-block'
import { CONTENT_IMAGE_MAX_HEIGHT_CLASS } from '@/components/content-image'
import { ExternalLink } from '@/components/external-link'
import { StyledLink } from '@/components/styled-link'
import { cn, LINK_CLASS } from '@/lib/utils'

const RULE = '─'.repeat(240)

function isExternal(href: string | undefined): boolean {
    if (!href) return false
    return /^https?:\/\//.test(href) || href.startsWith('mailto:')
}

function Anchor({
    children,
    className,
    href,
    ...rest
}: AnchorHTMLAttributes<HTMLAnchorElement>) {
    const external = isExternal(href)
    const linkClass = cn(LINK_CLASS, className)
    if (!href) return <span className={linkClass}>{children}</span>
    if (external) {
        return (
            <ExternalLink className={linkClass} href={href} {...rest}>
                {children}
                <span
                    aria-hidden
                    className="text-muted-foreground ml-1 select-none">
                    ↗
                </span>
            </ExternalLink>
        )
    }
    return (
        <StyledLink className={className} href={href}>
            {children}
        </StyledLink>
    )
}

function H1({ className, ...props }: HTMLAttributes<HTMLHeadingElement>) {
    return (
        <h1
            className={cn(
                'text-foreground mt-10 mb-4 text-xl font-semibold tracking-tight',
                className
            )}
            {...props}
        />
    )
}

function H2({ className, ...props }: HTMLAttributes<HTMLHeadingElement>) {
    return (
        <h2
            className={cn(
                'text-foreground mt-10 mb-3 text-lg font-semibold tracking-tight',
                className
            )}
            {...props}
        />
    )
}

function H3({ className, ...props }: HTMLAttributes<HTMLHeadingElement>) {
    return (
        <h3
            className={cn(
                'text-foreground mt-8 mb-2 text-base font-semibold tracking-tight',
                className
            )}
            {...props}
        />
    )
}

function H4({ className, ...props }: HTMLAttributes<HTMLHeadingElement>) {
    return (
        <h4
            className={cn(
                'text-foreground mt-6 mb-2 text-sm font-semibold tracking-tight',
                className
            )}
            {...props}
        />
    )
}

function P({ className, ...props }: HTMLAttributes<HTMLParagraphElement>) {
    return (
        <p
            className={cn('text-foreground mb-4 leading-relaxed', className)}
            {...props}
        />
    )
}

function Ul({ className, ...props }: HTMLAttributes<HTMLUListElement>) {
    return (
        <ul
            data-mdx-list="bullet"
            className={cn(
                'text-foreground mb-4 list-none space-y-1.5 pl-0',
                className
            )}
            {...props}
        />
    )
}

function Ol({ className, ...props }: HTMLAttributes<HTMLOListElement>) {
    return (
        <ol
            className={cn(
                'text-foreground mb-4 list-decimal space-y-1.5 pl-5',
                className
            )}
            {...props}
        />
    )
}

function Li({ className, ...props }: HTMLAttributes<HTMLLIElement>) {
    return (
        <li
            className={cn(
                "before:text-muted-foreground relative pl-[1.5ch] before:absolute before:left-0 before:content-['→'] before:select-none data-[ordered=true]:pl-0 data-[ordered=true]:before:content-none",
                className
            )}
            {...props}
        />
    )
}

function Hr() {
    return <hr className="border-foreground my-8 border-t" />
}

function Blockquote({ className, ...props }: HTMLAttributes<HTMLQuoteElement>) {
    return (
        <blockquote
            className={cn(
                'text-muted-foreground my-4 border-l-2 pl-4 italic before:content-none',
                className
            )}
            {...props}
        />
    )
}

function InlineCode({ className, ...props }: HTMLAttributes<HTMLElement>) {
    return (
        <code
            className={cn(
                'bg-muted text-foreground rounded px-1.5 py-0.5 text-[0.9em]',
                className
            )}
            {...props}
        />
    )
}

function Pre(props: HTMLAttributes<HTMLPreElement>) {
    return <CodeBlock {...props} />
}

type CalloutTone = 'note' | 'warn'

function Callout({
    children,
    label,
    tone = 'note',
}: {
    children: React.ReactNode
    label?: string
    tone?: CalloutTone
}) {
    const labelText = label ?? tone
    const labelClass =
        tone === 'warn' ? 'text-warning' : 'text-muted-foreground'
    return (
        <aside
            data-callout={tone}
            className={cn(
                'my-6 text-sm leading-relaxed',
                tone === 'warn' ? 'text-foreground' : 'text-foreground'
            )}>
            <div className="text-muted-foreground flex items-baseline gap-2 text-sm leading-none">
                <span aria-hidden className="select-none">
                    ╭─
                </span>
                <span className={cn('label-caps', labelClass)}>
                    {labelText}
                </span>
                <span
                    aria-hidden
                    className="term-rule flex-1 overflow-hidden whitespace-nowrap select-none">
                    {RULE}
                </span>
                <span aria-hidden className="select-none">
                    ╮
                </span>
            </div>
            <div className="px-1 py-3">{children}</div>
            <div className="text-muted-foreground flex items-baseline gap-2 text-sm leading-none">
                <span aria-hidden className="select-none">
                    ╰
                </span>
                <span
                    aria-hidden
                    className="term-rule flex-1 overflow-hidden whitespace-nowrap select-none">
                    {RULE}
                </span>
                <span aria-hidden className="select-none">
                    ╯
                </span>
            </div>
        </aside>
    )
}

function Note({
    children,
    label,
}: {
    children: React.ReactNode
    label?: string
}) {
    return (
        <Callout tone="note" {...(label !== undefined ? { label } : {})}>
            {children}
        </Callout>
    )
}

function Warn({
    children,
    label,
}: {
    children: React.ReactNode
    label?: string
}) {
    return (
        <Callout tone="warn" {...(label !== undefined ? { label } : {})}>
            {children}
        </Callout>
    )
}

function Img({
    alt = '',
    className,
    height,
    src,
    width,
    ...rest
}: ImgHTMLAttributes<HTMLImageElement>) {
    if (typeof src !== 'string') return null
    const priority =
        (rest as Record<string, unknown>)['data-priority'] === 'true'
    const w = Number(width) || undefined
    const h = Number(height) || undefined
    const sharedClassName = cn(
        'my-6 w-full object-contain object-left',
        CONTENT_IMAGE_MAX_HEIGHT_CLASS,
        className
    )

    // With real intrinsic dimensions the browser reserves the aspect-ratio box up
    // front (no reload flicker). Fall back to the responsive 0/0 hack otherwise.
    if (w && h) {
        return (
            <Image
                alt={alt}
                height={h}
                src={src}
                width={w}
                {...(priority ? { priority: true } : {})}
                className={cn(sharedClassName, 'h-auto')}
                sizes="(min-width: 768px) 720px, 100vw"
            />
        )
    }

    return (
        <Image
            alt={alt}
            height={0}
            src={src}
            width={0}
            {...(priority ? { priority: true } : {})}
            className={sharedClassName}
            sizes="100vw"
        />
    )
}

function Strong({ className, ...props }: HTMLAttributes<HTMLElement>) {
    return (
        <strong
            className={cn('text-foreground font-semibold', className)}
            {...props}
        />
    )
}

function Em({ className, ...props }: HTMLAttributes<HTMLElement>) {
    return <em className={cn('italic', className)} {...props} />
}

export const mdxComponents = {
    a: Anchor,
    blockquote: Blockquote,
    code: InlineCode,
    em: Em,
    h1: H1,
    h2: H2,
    h3: H3,
    h4: H4,
    hr: Hr,
    img: Img,
    li: Li,
    Note,
    ol: Ol,
    p: P,
    pre: Pre,
    strong: Strong,
    ul: Ul,
    Warn,
} as const
