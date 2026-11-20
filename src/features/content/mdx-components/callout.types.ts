import type { ReactNode } from 'react'

export interface CalloutProps {
    children: ReactNode
    label?: string
    tone?: CalloutTone
}

export interface CalloutWrapperProps {
    children: ReactNode
    label?: string
}

type CalloutTone = 'note' | 'warn'
