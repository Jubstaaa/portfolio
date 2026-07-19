import { Callout } from './callout'
import type { CalloutWrapperProps } from './callout.types'

export function Warn({ children, label }: CalloutWrapperProps) {
    return (
        <Callout tone="warn" {...(label !== undefined ? { label } : {})}>
            {children}
        </Callout>
    )
}
