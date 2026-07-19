import type { ImgHTMLAttributes } from 'react'

import Image from 'next/image'

import { CONTENT_IMAGE_MAX_HEIGHT_CLASS } from '@/components/content-image/content-image.constants'
import { cn } from '@/lib/utils'

export function Img({
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
