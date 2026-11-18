import type { ImgHTMLAttributes } from 'react'

export type ImgProps = ImgHTMLAttributes<HTMLImageElement> & {
    'data-priority'?: string
}
