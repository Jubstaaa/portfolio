'use client'

import type { ReactNode } from 'react'
import { useState } from 'react'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import { ThemeProvider } from '@/components/theme-provider'

export function Providers({ children }: { children: ReactNode }) {
    const [client] = useState(() => new QueryClient())
    return (
        <QueryClientProvider client={client}>
            <ThemeProvider>{children}</ThemeProvider>
        </QueryClientProvider>
    )
}
