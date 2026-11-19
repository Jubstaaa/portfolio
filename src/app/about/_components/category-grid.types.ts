export interface CategoryGridProps<T extends string> {
    buckets: Partial<Record<T, { name: string }[]>>
    className?: string
    label: Record<T, string>
    order: T[]
}
