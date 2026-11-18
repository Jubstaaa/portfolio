import type { CalloutWrapperProps } from './callout.types'

import { Callout } from './callout'

export function Warn({ children, label }: CalloutWrapperProps) {
    return (
        <Callout tone="warn" {...(label !== undefined ? { label } : {})}>
            {children}
        </Callout>
    )
}
