import type { NAV_ITEM_VARIANT } from './nav.constants'

export interface NavItemProps {
    href: string
    pathname: string
    variant: keyof typeof NAV_ITEM_VARIANT
    onNavigate?: () => void
}
