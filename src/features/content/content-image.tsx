import Image from 'next/image'

import { cdnUrl } from '@/lib/cdn'
import { cn } from '@/lib/utils'

import { CONTENT_IMAGE_CLASS } from './content-image.constants'

interface ContentImageProps {
    alt: string
    className?: string
    height: number
    preload?: boolean
    src: string
    width: number
}

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
