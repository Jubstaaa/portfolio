'use client'

import {
    ThemeProvider as NextThemesProvider,
    type ThemeProviderProps,
} from 'next-themes'

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
    return (
        <NextThemesProvider
            disableTransitionOnChange
            enableSystem
            attribute="class"
            defaultTheme="dark"
            storageKey="theme"
            themes={['light', 'dark']}
            {...props}>
            {children}
        </NextThemesProvider>
    )
}
