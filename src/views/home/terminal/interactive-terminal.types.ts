import type { ReactNode } from 'react'

export interface InteractiveTerminalProps {
    children?: ReactNode
    className?: string
    introCommands?: string[]
}
