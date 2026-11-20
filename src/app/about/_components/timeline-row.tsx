import type { ReactNode } from 'react'

interface TimelineRowProps {
    children: ReactNode
    dateRange: string
}
export function TimelineRow({ children, dateRange }: TimelineRowProps) {
    return (
        <li className="hairline grid grid-cols-1 gap-x-6 gap-y-2 border-b py-6 last:border-b-0 md:grid-cols-[14rem_minmax(0,1fr)]">
            <div className="text-muted-foreground flex items-start gap-3 text-xs">
                <span className="font-mono tracking-tight">{dateRange}</span>
            </div>
            <div className="space-y-1.5">{children}</div>
        </li>
    )
}
