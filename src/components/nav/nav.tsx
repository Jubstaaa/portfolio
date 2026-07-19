'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { Logo } from '@/components/logo/logo'
import { ThemeToggle } from '@/components/theme-toggle/theme-toggle'
import { site } from '@/lib/content'
import { cn } from '@/lib/utils'

function isActive(pathname: string, href: string): boolean {
    if (href === '/') return pathname === '/'
    return pathname === href || pathname.startsWith(`${href}/`)
}

function routeLabel(href: string): string {
    return `.${href}`
}

export function Nav() {
    const pathname = usePathname()
    const dialogRef = useRef<HTMLDialogElement>(null)
    const [open, setOpen] = useState(false)

    const openMenu = useCallback(() => {
        dialogRef.current?.showModal()
        setOpen(true)
    }, [])

    const closeMenu = useCallback(() => {
        dialogRef.current?.close()
    }, [])

    useEffect(() => {
        dialogRef.current?.close()
    }, [pathname])

    return (
        <header className="hairline sticky top-0 z-40 border-b backdrop-blur">
            <div className="bg-background/80 absolute inset-0 -z-10" />
            <div className="container-default flex h-14 items-center justify-between">
                <Logo />

                <nav
                    aria-label="Primary"
                    className="hidden items-center gap-6 md:flex">
                    <ul className="flex items-center gap-5 text-sm">
                        {site.nav.map(item => {
                            const active = isActive(pathname, item.href)
                            return (
                                <li key={item.href}>
                                    <Link
                                        href={item.href}
                                        aria-current={
                                            active ? 'page' : undefined
                                        }
                                        className={cn(
                                            'transition-token',
                                            active
                                                ? 'text-accent'
                                                : 'text-muted-foreground hover:text-foreground'
                                        )}>
                                        {routeLabel(item.href)}
                                    </Link>
                                </li>
                            )
                        })}
                    </ul>
                    <ThemeToggle />
                </nav>

                <div className="flex items-center gap-3 md:hidden">
                    <ThemeToggle />
                    <button
                        aria-controls="mobile-menu"
                        aria-expanded={open}
                        aria-label="Open menu"
                        className="text-muted-foreground hover:text-foreground transition-token inline-flex h-9 items-center gap-1 text-sm"
                        type="button"
                        onClick={openMenu}>
                        <span aria-hidden className="text-accent select-none">
                            ❯
                        </span>
                        menu
                    </button>
                </div>
            </div>

            <dialog
                ref={dialogRef}
                aria-label="Menu"
                className="bg-background text-foreground fixed inset-0 m-0 size-full max-h-none max-w-none border-0 p-0 backdrop:bg-black/60"
                id="mobile-menu"
                onClose={() => setOpen(false)}
                onClick={event => {
                    if (event.target === dialogRef.current) closeMenu()
                }}>
                <div className="container-default flex h-14 items-center justify-between border-b">
                    <Logo />
                    <button
                        aria-label="Close menu"
                        className="text-muted-foreground hover:text-foreground transition-token inline-flex h-9 items-center text-sm"
                        type="button"
                        onClick={closeMenu}>
                        <span
                            aria-hidden
                            className="text-accent mr-1 select-none">
                            ❯
                        </span>
                        close
                    </button>
                </div>
                <nav
                    aria-label="Primary mobile"
                    className="container-default py-10">
                    <ul className="flex flex-col gap-5 text-lg">
                        {site.nav.map(item => {
                            const active = isActive(pathname, item.href)
                            return (
                                <li key={item.href}>
                                    <Link
                                        href={item.href}
                                        aria-current={
                                            active ? 'page' : undefined
                                        }
                                        className={cn(
                                            'transition-token inline-block',
                                            active
                                                ? 'text-accent'
                                                : 'text-foreground hover:text-accent'
                                        )}
                                        onClick={closeMenu}>
                                        {routeLabel(item.href)}
                                    </Link>
                                </li>
                            )
                        })}
                    </ul>
                </nav>
            </dialog>
        </header>
    )
}
