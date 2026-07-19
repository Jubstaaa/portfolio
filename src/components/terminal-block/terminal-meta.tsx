import { cn } from '@/lib/utils'

export interface TerminalMetaProps {
    branch?: string
    className?: string
    path: string
}

export function TerminalMeta({ branch, className, path }: TerminalMetaProps) {
    return (
        <p className={cn('text-muted-foreground text-sm', className)}>
            <span className="text-foreground">{path}</span>
            {branch ? (
                <>
                    {' on '}
                    <span>{branch}</span>
                </>
            ) : null}
        </p>
    )
}
