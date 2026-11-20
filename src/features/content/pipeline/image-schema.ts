import { s, z } from 'velite'

import { CONTENT_IMAGE_PREFIX, readImageDimensions } from './image-dimensions'

// Frontmatter images (covers, project galleries). Every one is on the CDN, so the
// build can stamp its intrinsic size and next/image always reserves the box.
// The prefix is checked inside the transform: a failed string check alone would
// not stop the transform from fetching the bad path.
export const imageSchema = s
    .object({
        alt: s.string(),
        caption: s.string().optional(),
        src: s.string(),
    })
    .transform(async (data, ctx) => {
        if (!data.src.startsWith(CONTENT_IMAGE_PREFIX)) {
            ctx.addIssue({
                code: 'custom',
                message: `${data.src}: content images live on the CDN under ${CONTENT_IMAGE_PREFIX}`,
                path: ['src'],
            })
            return z.NEVER
        }
        return { ...data, ...(await readImageDimensions(data.src)) }
    })
