import type { NAV_ITEM_VARIANT } from './nav.constants'

export interface NavItemProps {
    href: string
    onNavigate?: () => void
    pathname: string
    variant: keyof typeof NAV_ITEM_VARIANT
}
