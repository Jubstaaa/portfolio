import type { ReactNode } from 'react'

export interface ContentCardProps {
    className?: string
    description: string
    href: string
    meta: ReactNode
    tags?: ReactNode
    title: string
}
