'use client'

import { usePathname } from 'next/navigation'
import { useCallback, useEffect, useRef, useState } from 'react'

import { site } from '@/features/content/content'

import { Logo } from './logo'
import { NavItem } from './nav-item'
import { ThemeToggle } from './theme-toggle'

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
                        {site.nav.map(item => (
                            <NavItem
                                href={item.href}
                                key={item.href}
                                label={item.label}
                                pathname={pathname}
                                variant="desktop"
                            />
                        ))}
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
                        onClick={openMenu}
                        type="button">
                        <span aria-hidden className="text-accent select-none">
                            ❯
                        </span>
                        menu
                    </button>
                </div>
            </div>

            {/* Backdrop click is a pointer convenience; keyboard users close the
                modal dialog with Escape, which the browser provides. */}
            {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions */}
            <dialog
                aria-label="Menu"
                className="bg-background text-foreground fixed inset-0 m-0 size-full max-h-none max-w-none border-0 p-0 backdrop:bg-black/60"
                id="mobile-menu"
                onClick={event => {
                    if (event.target === dialogRef.current) closeMenu()
                }}
                onClose={() => {
                    setOpen(false)
                }}
                ref={dialogRef}>
                <div className="container-default flex h-14 items-center justify-between border-b">
                    <Logo />
                    <button
                        aria-label="Close menu"
                        className="text-muted-foreground hover:text-foreground transition-token inline-flex h-9 items-center text-sm"
                        onClick={closeMenu}
                        type="button">
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
                        {site.nav.map(item => (
                            <NavItem
                                href={item.href}
                                key={item.href}
                                label={item.label}
                                onNavigate={closeMenu}
                                pathname={pathname}
                                variant="mobile"
                            />
                        ))}
                    </ul>
                </nav>
            </dialog>
        </header>
    )
}
