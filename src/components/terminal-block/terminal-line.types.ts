import type { ReactNode } from 'react'

export interface TerminalLineProps {
    children?: ReactNode
    className?: string
    command: string
}
