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

import { HEADING_CLASS, RULE } from './mdx-components.constants'
import type { CalloutTone } from './mdx-components.types'

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

function makeHeading(tag: keyof typeof HEADING_CLASS) {
    const Tag = tag
    return function MdxHeading({
        className,
        ...props
    }: HTMLAttributes<HTMLHeadingElement>) {
        return <Tag className={cn(HEADING_CLASS[tag], className)} {...props} />
    }
}

const H1 = makeHeading('h1')
const H2 = makeHeading('h2')
const H3 = makeHeading('h3')
const H4 = makeHeading('h4')

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

function BorderRow({
    label,
    left,
    right,
}: {
    label?: React.ReactNode
    left: string
    right: string
}) {
    return (
        <div className="text-muted-foreground flex items-baseline gap-2 text-sm leading-none">
            <span aria-hidden className="select-none">
                {left}
            </span>
            {label}
            <span
                aria-hidden
                className="term-rule flex-1 overflow-hidden whitespace-nowrap select-none">
                {RULE}
            </span>
            <span aria-hidden className="select-none">
                {right}
            </span>
        </div>
    )
}

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
            className={cn('my-6 text-sm leading-relaxed', 'text-foreground')}
            data-callout={tone}>
            <BorderRow
                left="╭─"
                right="╮"
                label={
                    <span className={cn('label-caps', labelClass)}>
                        {labelText}
                    </span>
                }
            />
            <div className="px-1 py-3">{children}</div>
            <BorderRow left="╰" right="╯" />
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
        'my-6',
        CONTENT_IMAGE_MAX_HEIGHT_CLASS,
        'w-full object-contain object-left',
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
