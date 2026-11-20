import Image from 'next/image'

import {
    CONTENT_IMAGE_MAX_HEIGHT_CLASS,
    LCP_IMAGE_PROPS,
} from '@/features/content/content-image.constants'
import { cdnUrl } from '@/lib/cdn'
import { cn } from '@/lib/utils'

import type { ImgProps } from './image.types'

export function Img({
    alt = '',
    className,
    'data-priority': dataPriority,
    height,
    src,
    width,
}: ImgProps) {
    if (typeof src !== 'string') return null
    const resolvedSrc = cdnUrl(src)
    // The first body image is the LCP candidate when no cover is shown.
    const priorityProps = dataPriority === 'true' ? LCP_IMAGE_PROPS : {}
    const w = Number(width) || undefined
    const h = Number(height) || undefined
    const sharedClassName = cn(
        'my-6',
        CONTENT_IMAGE_MAX_HEIGHT_CLASS,
        'w-full object-contain object-left',
        className
    )

    // The content pipeline stamps every body image; rendering one without a size
    // would ship a layout shift instead of failing the build.
    if (!w || !h) {
        throw new Error(
            `body image ${src} has no intrinsic size: it skipped the content pipeline (a JSX <img> in MDX does)`
        )
    }

    return (
        <Image
            alt={alt}
            height={h}
            src={resolvedSrc}
            width={w}
            {...priorityProps}
            className={cn(sharedClassName, 'h-auto')}
            sizes="(min-width: 768px) 720px, 100vw"
        />
    )
}
