'use client'

import type { ProvidersProps } from './providers.types'

import { ThemeProvider } from './theme-provider'

export function Providers({ children }: ProvidersProps) {
    return <ThemeProvider>{children}</ThemeProvider>
}
