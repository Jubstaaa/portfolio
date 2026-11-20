'use client'

import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'

import { cn } from '@/lib/utils'

import { useHasMounted } from './use-has-mounted'

interface ThemeToggleProps {
    className?: string
}

export function ThemeToggle({ className }: ThemeToggleProps) {
    const { resolvedTheme, setTheme } = useTheme()
    const mounted = useHasMounted()
    const isDark = mounted ? resolvedTheme === 'dark' : true

    return (
        <button
            aria-label={
                isDark ? 'Switch to light theme' : 'Switch to dark theme'
            }
            className={cn(
                'hairline text-muted-foreground hover:text-foreground transition-token relative inline-flex size-9 items-center justify-center rounded-md border',
                className
            )}
            onClick={() => {
                setTheme(isDark ? 'light' : 'dark')
            }}
            type="button">
            <Sun
                aria-hidden
                className={cn(
                    'transition-token absolute size-4',
                    isDark
                        ? 'scale-0 rotate-90 opacity-0'
                        : 'scale-100 rotate-0 opacity-100'
                )}
                strokeWidth={1.75}
            />
            <Moon
                aria-hidden
                className={cn(
                    'transition-token absolute size-4',
                    isDark
                        ? 'scale-100 rotate-0 opacity-100'
                        : 'scale-0 -rotate-90 opacity-0'
                )}
                strokeWidth={1.75}
            />
        </button>
    )
}
