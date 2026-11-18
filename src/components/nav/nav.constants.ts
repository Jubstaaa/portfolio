export const NAV_ITEM_VARIANT = {
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
