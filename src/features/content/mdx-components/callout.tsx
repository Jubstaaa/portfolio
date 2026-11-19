import { cn } from '@/lib/utils'

import type { CalloutProps } from './callout.types'

import { BorderRow } from './border-row'

export function Callout({ children, label, tone = 'note' }: CalloutProps) {
    const labelText = label ?? tone
    const labelClass =
        tone === 'warn' ? 'text-warning' : 'text-muted-foreground'
    return (
        <aside
            className={cn('my-6 text-sm leading-relaxed', 'text-foreground')}
            data-callout={tone}>
            <BorderRow
                label={
                    <span className={cn('label-caps', labelClass)}>
                        {labelText}
                    </span>
                }
                left="╭─"
                right="╮"
            />
            <div className="px-1 py-3">{children}</div>
            <BorderRow left="╰" right="╯" />
        </aside>
    )
}
