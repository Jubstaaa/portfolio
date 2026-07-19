export interface CategoryGridGroup {
    items: string[]
    label: string
}

export interface CategoryGridProps {
    className?: string
    groups: CategoryGridGroup[]
}
