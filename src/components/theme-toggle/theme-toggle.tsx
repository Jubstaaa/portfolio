'use client'

import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'

import { useHasMounted } from '@/hooks/use-has-mounted'
import { cn } from '@/lib/utils'

import type { ThemeToggleProps } from './theme-toggle.types'

export function ThemeToggle({ className }: ThemeToggleProps) {
    const { resolvedTheme, setTheme } = useTheme()
    const mounted = useHasMounted()
    const isDark = mounted ? resolvedTheme === 'dark' : true

    return (
        <button
            type="button"
            aria-label={
                isDark ? 'Switch to light theme' : 'Switch to dark theme'
            }
            className={cn(
                'hairline text-muted-foreground hover:text-foreground transition-token relative inline-flex size-9 items-center justify-center rounded-md border',
                className
            )}
            onClick={() => setTheme(isDark ? 'light' : 'dark')}>
            <Sun
                aria-hidden
                strokeWidth={1.75}
                className={cn(
                    'transition-token absolute size-4',
                    isDark
                        ? 'scale-0 rotate-90 opacity-0'
                        : 'scale-100 rotate-0 opacity-100'
                )}
            />
            <Moon
                aria-hidden
                strokeWidth={1.75}
                className={cn(
                    'transition-token absolute size-4',
                    isDark
                        ? 'scale-100 rotate-0 opacity-100'
                        : 'scale-0 -rotate-90 opacity-0'
                )}
            />
        </button>
    )
}
