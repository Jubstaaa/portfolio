'use client'

import { ThemeProvider } from '@/components/theme-provider/theme-provider'

import type { ProvidersProps } from './providers.types'

export function Providers({ children }: ProvidersProps) {
    return <ThemeProvider>{children}</ThemeProvider>
}
