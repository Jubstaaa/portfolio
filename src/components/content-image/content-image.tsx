import Image from 'next/image'

import { cn } from '@/lib/utils'

import { CONTENT_IMAGE_CLASS } from './content-image.constants'
import type { ContentImageProps } from './content-image.types'

export function ContentImage({
    alt,
    className,
    height,
    priority = false,
    src,
    width,
}: ContentImageProps) {
    return (
        <Image
            alt={alt}
            className={cn(CONTENT_IMAGE_CLASS, className)}
            height={height}
            priority={priority}
            sizes="(min-width: 1024px) 720px, 100vw"
            src={src}
            width={width}
        />
    )
}
