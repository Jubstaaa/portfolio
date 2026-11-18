import { Img } from './image'
import type { ImgProps } from './image.types'

// For bodies rendered under a cover: the cover is the LCP element, so the body's
// first image must not compete with it for an early fetch.
export function DeferredImg({
    'data-priority': _priority,
    ...props
}: ImgProps) {
    return <Img {...props} />
}
