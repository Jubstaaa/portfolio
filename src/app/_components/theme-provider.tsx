'use client'

import {
    ThemeProvider as NextThemesProvider,
    type ThemeProviderProps,
} from 'next-themes'

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
    return (
        <NextThemesProvider
            attribute="class"
            defaultTheme="dark"
            disableTransitionOnChange
            enableSystem
            storageKey="theme"
            themes={['light', 'dark']}
            {...props}>
            {children}
        </NextThemesProvider>
    )
}
