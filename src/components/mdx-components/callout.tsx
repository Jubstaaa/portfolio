import { cn } from '@/lib/utils'

import { BorderRow } from './border-row'
import type { CalloutProps } from './callout.types'

export function Callout({ children, label, tone = 'note' }: CalloutProps) {
    const labelText = label ?? tone
    const labelClass =
        tone === 'warn' ? 'text-warning' : 'text-muted-foreground'
    return (
        <aside
            className={cn('my-6 text-sm leading-relaxed', 'text-foreground')}
            data-callout={tone}>
            <BorderRow
                left="╭─"
                right="╮"
                label={
                    <span className={cn('label-caps', labelClass)}>
                        {labelText}
                    </span>
                }
            />
            <div className="px-1 py-3">{children}</div>
            <BorderRow left="╰" right="╯" />
        </aside>
    )
}
