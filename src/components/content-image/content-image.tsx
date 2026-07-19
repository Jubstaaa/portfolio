import Image from 'next/image'

import { cn } from '@/lib/utils'

export const CONTENT_IMAGE_MAX_HEIGHT_CLASS = 'max-h-125'

export const CONTENT_IMAGE_CLASS = cn(
    'hairline h-auto',
    CONTENT_IMAGE_MAX_HEIGHT_CLASS,
    'w-full rounded-md border object-contain'
)

export interface ContentImageProps {
    alt: string
    className?: string
    height: number
    priority?: boolean
    src: string
    width: number
}

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
