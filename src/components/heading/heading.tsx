import type { HeadingProps } from './heading.types'

export function Heading({ as = 'h2', title }: HeadingProps) {
    const Tag = as

    return (
        <>
            <Tag className="text-foreground flex items-baseline gap-2 text-lg font-normal">
                <span aria-hidden className="text-muted-foreground select-none">
                    #
                </span>
                <span>{title}</span>
            </Tag>
            <hr className="border-foreground my-2 border-t" />
        </>
    )
}
