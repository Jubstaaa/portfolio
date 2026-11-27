import type { ImgProps } from './image.types'

import { Img } from './image'

export function DeferredImg({
    'data-priority': _priority,
    ...props
}: ImgProps) {
    return <Img {...props} />
}
