import Image from 'next/image'

import { cdnUrl } from '@/lib/cdn'
import { cn } from '@/lib/utils'

import { CONTENT_IMAGE_CLASS } from './content-image.constants'
import type { ContentImageProps } from './content-image.types'

export function ContentImage({
    alt,
    className,
    height,
    preload = false,
    src,
    width,
}: ContentImageProps) {
    return (
        <Image
            alt={alt}
            className={cn(CONTENT_IMAGE_CLASS, className)}
            height={height}
            preload={preload}
            sizes="(min-width: 1024px) 720px, 100vw"
            src={cdnUrl(src)}
            width={width}
        />
    )
}
