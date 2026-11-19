import Link from 'next/link'

import { cn } from '@/lib/utils'

import { isActive, routeLabel } from './nav.utils'

const NAV_ITEM_VARIANT = {
    desktop: {
        active: 'text-accent',
        base: 'transition-token',
        idle: 'text-muted-foreground hover:text-foreground',
    },
    mobile: {
        active: 'text-accent',
        base: 'transition-token inline-block',
        idle: 'text-foreground hover:text-accent',
    },
} as const

interface NavItemProps {
    href: string
    onNavigate?: () => void
    pathname: string
    variant: keyof typeof NAV_ITEM_VARIANT
}

export function NavItem({ href, onNavigate, pathname, variant }: NavItemProps) {
    const active = isActive(pathname, href)
    const styles = NAV_ITEM_VARIANT[variant]
    return (
        <li>
            <Link
                aria-current={active ? 'page' : undefined}
                className={cn(
                    styles.base,
                    active ? styles.active : styles.idle
                )}
                href={href}
                {...(onNavigate ? { onClick: onNavigate } : {})}>
                {routeLabel(href)}
            </Link>
        </li>
    )
}
