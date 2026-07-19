import type { ComponentType, ElementType } from 'react'

export type MdxComponent = ComponentType<{
    components?: Record<string, ElementType>
}>

export interface MdxProps {
    code: string
    components?: Record<string, ElementType>
}
