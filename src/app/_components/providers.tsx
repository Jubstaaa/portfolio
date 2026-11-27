'use client'
import type { ReactNode } from 'react'

import { ThemeProvider } from 'next-themes'

interface ProvidersProps {
    children: ReactNode
}

export function Providers({ children }: ProvidersProps) {
    return (
        <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            disableTransitionOnChange
            storageKey="theme"
            themes={['light', 'dark']}>
            {children}
        </ThemeProvider>
    )
}
