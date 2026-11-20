import type { HTMLAttributes } from 'react'

import { cn } from '@/lib/utils'

export function Table({
    className,
    ...props
}: HTMLAttributes<HTMLTableElement>) {
    return (
        <div className="-mx-1 my-6 overflow-x-auto px-1">
            <table
                className={cn(
                    'w-full min-w-128 border-collapse text-left text-sm',
                    className
                )}
                {...props}
            />
        </div>
    )
}
