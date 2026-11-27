import { cn } from '@/lib/utils'

export const CONTENT_IMAGE_MAX_HEIGHT_CLASS = 'max-h-125'

export const CONTENT_IMAGE_CLASS = cn(
    'hairline h-auto',
    CONTENT_IMAGE_MAX_HEIGHT_CLASS,
    'w-full rounded-md border object-contain'
)

// The article column is max-w-3xl (48rem) inside the gutter, so the slot tops
// out at 768px. Declaring 100vw past that made the LCP cover fetch the 1080w
// candidate for a 768px box.
export const CONTENT_IMAGE_SIZES = '(min-width: 768px) 768px, 100vw'

// Next 16 image docs: for the LCP image, prefer `fetchPriority`/`loading` over
// `preload`; the preload <link> started the fetch at Low priority, raised later.
export const LCP_IMAGE_PROPS = {
    fetchPriority: 'high',
    loading: 'eager',
} as const
