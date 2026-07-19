import type { ReactNode } from 'react'

export type CalloutTone = 'note' | 'warn'

export interface CalloutProps {
    children: ReactNode
    label?: string
    tone?: CalloutTone
}

export interface CalloutWrapperProps {
    children: ReactNode
    label?: string
}
