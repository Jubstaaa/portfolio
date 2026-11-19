import { cn } from '@/lib/utils'

export const CONTENT_IMAGE_MAX_HEIGHT_CLASS = 'max-h-125'

export const CONTENT_IMAGE_CLASS = cn(
    'hairline h-auto',
    CONTENT_IMAGE_MAX_HEIGHT_CLASS,
    'w-full rounded-md border object-contain'
)
