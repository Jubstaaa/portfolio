import Image from 'next/image'

import { cdnUrl } from '@/lib/cdn'
import { cn } from '@/lib/utils'

import {
    CONTENT_IMAGE_CLASS,
    CONTENT_IMAGE_SIZES,
    LCP_IMAGE_PROPS,
} from './content-image.constants'

interface ContentImageProps {
    alt: string
    className?: string
    height: number
    lcpCandidate?: boolean
    src: string
    width: number
}

export function ContentImage({
    alt,
    className,
    height,
    lcpCandidate = false,
    src,
    width,
}: ContentImageProps) {
    return (
        <Image
            alt={alt}
            className={cn(CONTENT_IMAGE_CLASS, className)}
            height={height}
            {...(lcpCandidate ? LCP_IMAGE_PROPS : {})}
            sizes={CONTENT_IMAGE_SIZES}
            src={cdnUrl(src)}
            width={width}
        />
    )
}
