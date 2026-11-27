import Link from 'next/link'

import { navLabel } from '@/features/content/site'
import { cn } from '@/lib/utils'

import { isActive } from './nav.utils'

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
    label: string
    onNavigate?: () => void
    pathname: string
    variant: keyof typeof NAV_ITEM_VARIANT
}

export function NavItem({
    href,
    label,
    onNavigate,
    pathname,
    variant,
}: NavItemProps) {
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
                {navLabel(label)}
            </Link>
        </li>
    )
}
