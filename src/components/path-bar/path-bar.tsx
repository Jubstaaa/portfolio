import { cn } from '@/lib/utils'

export interface PathBarProps {
    className?: string
    meta?: string
    path: string
}

export function PathBar({ className, meta, path }: PathBarProps) {
    return (
        <div className={cn('border-b', className)}>
            <div className="container-default text-muted-foreground flex h-10 items-center justify-between text-xs">
                <span>
                    <span aria-hidden className="mr-1 select-none">
                        ~/
                    </span>
                    <span className="text-foreground">
                        {path.replace(/^~\//, '')}
                    </span>
                </span>
                {meta ? <span className="truncate pl-4">· {meta}</span> : null}
            </div>
        </div>
    )
}
