import { site } from '@/lib/content'
import { cn } from '@/lib/utils'

import type { PathBarProps } from './path-bar.types'

export function PathBar({ className, meta, segment }: PathBarProps) {
    return (
        <div className={cn('border-b', className)}>
            <div className="container-default text-muted-foreground flex h-10 items-center justify-between text-xs">
                <span>
                    <span aria-hidden className="mr-1 select-none">
                        ~/
                    </span>
                    <span className="text-foreground">
                        {segment ? `${site.handle}/${segment}` : site.handle}
                    </span>
                </span>
                {meta ? <span className="truncate pl-4">· {meta}</span> : null}
            </div>
        </div>
    )
}
