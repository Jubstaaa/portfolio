import Link from 'next/link'

import { cn } from '@/lib/utils'

import type { NavItemProps } from './nav-item.types'
import { NAV_ITEM_VARIANT } from './nav.constants'
import { isActive, routeLabel } from './nav.utils'

export function NavItem({ href, pathname, variant, onNavigate }: NavItemProps) {
    const active = isActive(pathname, href)
    const styles = NAV_ITEM_VARIANT[variant]
    return (
        <li>
            <Link
                aria-current={active ? 'page' : undefined}
                href={href}
                className={cn(
                    styles.base,
                    active ? styles.active : styles.idle
                )}
                {...(onNavigate ? { onClick: onNavigate } : {})}>
                {routeLabel(href)}
            </Link>
        </li>
    )
}
