import type { ReactNode } from 'react'

export interface CalloutProps {
    children: ReactNode
    label?: string
    tone?: CalloutTone
}

export type CalloutTone = 'note' | 'warn'

export interface CalloutWrapperProps {
    children: ReactNode
    label?: string
}
