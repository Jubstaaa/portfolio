export interface CategoryGridProps<T extends string> {
    buckets: Record<T, { name: string }[]>
    className?: string
    label: Record<T, string>
    order: T[]
}
