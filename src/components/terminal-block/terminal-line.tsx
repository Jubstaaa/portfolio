import { cn } from '@/lib/utils'

import { TerminalCaret } from './terminal-caret'

export interface TerminalLineProps {
    children?: React.ReactNode
    className?: string
    command: string
}

export function TerminalLine({
    children,
    className,
    command,
}: TerminalLineProps) {
    return (
        <div className={cn('flex flex-col gap-1', className)}>
            <div className="flex">
                <TerminalCaret />
                <span className="text-foreground min-w-0 break-all">
                    {command}
                </span>
            </div>
            {children ? (
                <div className="text-foreground space-y-0.5 pl-[2ch] break-words">
                    {children}
                </div>
            ) : null}
        </div>
    )
}
