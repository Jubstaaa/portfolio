import { cn } from '@/lib/utils'

export const CONTENT_IMAGE_MAX_HEIGHT_CLASS = 'max-h-125'

export const CONTENT_IMAGE_CLASS = cn(
    'hairline h-auto',
    CONTENT_IMAGE_MAX_HEIGHT_CLASS,
    'w-full rounded-md border object-contain'
)

// Next 16 image docs: for the LCP image, prefer `fetchPriority`/`loading` over
// `preload`; the preload <link> started the fetch at Low priority, raised later.
export const LCP_IMAGE_PROPS = {
    fetchPriority: 'high',
    loading: 'eager',
} as const
