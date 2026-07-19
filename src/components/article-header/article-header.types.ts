import type { ReactNode } from 'react'

export interface ArticleHeaderProps {
    children?: ReactNode
    lead: string
    meta: ReactNode
    tags?: ReactNode
    title: string
}
