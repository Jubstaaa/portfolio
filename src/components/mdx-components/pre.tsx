import type { HTMLAttributes } from 'react'

import { CodeBlock } from '@/components/code-block/code-block'

export function Pre(props: HTMLAttributes<HTMLPreElement>) {
    return <CodeBlock {...props} />
}
