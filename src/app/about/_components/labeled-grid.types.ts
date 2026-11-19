export interface LabeledGridGroup {
    items: string[]
    label: string
}

export interface LabeledGridProps {
    className?: string
    groups: LabeledGridGroup[]
}
