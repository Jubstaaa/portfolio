import Image from 'next/image'

import { CONTENT_IMAGE_MAX_HEIGHT_CLASS } from '@/features/content/content-image.constants'
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
    const preload = dataPriority === 'true'
    const w = Number(width) || undefined
    const h = Number(height) || undefined
    const sharedClassName = cn(
        'my-6',
        CONTENT_IMAGE_MAX_HEIGHT_CLASS,
        'w-full object-contain object-left',
        className
    )

    if (w && h) {
        return (
            <Image
                alt={alt}
                height={h}
                src={resolvedSrc}
                width={w}
                {...(preload ? { preload: true } : {})}
                className={cn(sharedClassName, 'h-auto')}
                sizes="(min-width: 768px) 720px, 100vw"
            />
        )
    }

    return (
        <Image
            alt={alt}
            height={0}
            src={resolvedSrc}
            width={0}
            {...(preload ? { preload: true } : {})}
            className={sharedClassName}
            sizes="100vw"
        />
    )
}
