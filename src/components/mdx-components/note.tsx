import type { CalloutWrapperProps } from './callout.types'

import { Callout } from './callout'

export function Note({ children, label }: CalloutWrapperProps) {
    return (
        <Callout tone="note" {...(label !== undefined ? { label } : {})}>
            {children}
        </Callout>
    )
}
