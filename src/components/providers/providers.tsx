'use client'

import { useState } from 'react'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import { ThemeProvider } from '@/components/theme-provider/theme-provider'

import type { ProvidersProps } from './providers.types'

export function Providers({ children }: ProvidersProps) {
    const [client] = useState(() => new QueryClient())
    return (
        <QueryClientProvider client={client}>
            <ThemeProvider>{children}</ThemeProvider>
        </QueryClientProvider>
    )
}
