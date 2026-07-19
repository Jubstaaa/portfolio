import { Callout } from './callout'
import type { CalloutWrapperProps } from './callout.types'

export function Note({ children, label }: CalloutWrapperProps) {
    return (
        <Callout tone="note" {...(label !== undefined ? { label } : {})}>
            {children}
        </Callout>
    )
}
