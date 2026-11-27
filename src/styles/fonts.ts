import localFont from 'next/font/local'

import { cn } from '@/lib/utils'

const hermit = localFont({
    display: 'swap',
    src: [
        {
            path: '../fonts/hermit/Hermit-Regular.woff2',
            style: 'normal',
            weight: '400',
        },
        {
            path: '../fonts/hermit/Hermit-Bold.woff2',
            style: 'normal',
            weight: '700',
        },
    ],
    variable: '--font-hermit',
})

const hermitItalic = localFont({
    display: 'swap',
    preload: false,
    src: [
        {
            path: '../fonts/hermit/Hermit-RegularItalic.woff2',
            style: 'italic',
            weight: '400',
        },
        {
            path: '../fonts/hermit/Hermit-BoldItalic.woff2',
            style: 'italic',
            weight: '700',
        },
    ],
    variable: '--font-hermit-italic',
})

export const fontVariables = cn(hermit.variable, hermitItalic.variable)
