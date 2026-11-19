import type { HTMLAttributes } from 'react'

import { CodeBlock } from './code-block'

export function Pre(props: HTMLAttributes<HTMLPreElement>) {
    return <CodeBlock {...props} />
}
