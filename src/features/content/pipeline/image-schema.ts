import { s, z } from 'velite'

import { CONTENT_IMAGE_PREFIX } from '@/lib/cdn'

import { readImageDimensions } from './image-dimensions'

export const imageSchema = s
    .object({
        alt: s.string(),
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
