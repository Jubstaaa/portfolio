import localFont from 'next/font/local'

import { cn } from '@/lib/utils'

// Shared by the root layout and global-error, which replaces it with its own
// document. Each localFont call self-hosts a separate font instance, so both
// import this one definition.

// Upright faces are on every page, so they are preloaded. Italics only appear in
// MDX emphasis and blockquotes; a separate family keeps them off the critical path.
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
