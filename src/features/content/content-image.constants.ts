import { cn } from '@/lib/utils'

export const CONTENT_IMAGE_MAX_HEIGHT_CLASS = 'max-h-125'

export const CONTENT_IMAGE_CLASS = cn(
    'hairline h-auto',
    CONTENT_IMAGE_MAX_HEIGHT_CLASS,
    'w-full rounded-md border object-contain'
)

export const CONTENT_IMAGE_SIZES = '(min-width: 768px) 768px, 100vw'

export const LCP_IMAGE_PROPS = {
    fetchPriority: 'high',
    loading: 'eager',
} as const
