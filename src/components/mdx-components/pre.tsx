import type { HTMLAttributes } from 'react'

import { CodeBlock } from '@/components/code-block'

export function Pre(props: HTMLAttributes<HTMLPreElement>) {
    return <CodeBlock {...props} />
}
