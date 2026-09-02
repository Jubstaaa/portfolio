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
                    'w-full min-w-[32rem] border-collapse text-left text-sm',
                    className
                )}
                {...props}
            />
        </div>
    )
}

export function Thead({
    className,
    ...props
}: HTMLAttributes<HTMLTableSectionElement>) {
    return <thead className={cn('hairline border-b', className)} {...props} />
}

export function Tbody({
    className,
    ...props
}: HTMLAttributes<HTMLTableSectionElement>) {
    return (
        <tbody
            className={cn('[&>tr:not(:last-child)]:border-b', className)}
            {...props}
        />
    )
}

export function Tr({
    className,
    ...props
}: HTMLAttributes<HTMLTableRowElement>) {
    return <tr className={cn('hairline align-top', className)} {...props} />
}

export function Th({
    className,
    ...props
}: HTMLAttributes<HTMLTableCellElement>) {
    return (
        <th
            className={cn(
                'text-foreground px-3 py-2 font-medium first:pl-0 last:pr-0',
                className
            )}
            {...props}
        />
    )
}

export function Td({
    className,
    ...props
}: HTMLAttributes<HTMLTableCellElement>) {
    return (
        <td
            className={cn(
                'text-muted-foreground px-3 py-2 first:pl-0 last:pr-0',
                className
            )}
            {...props}
        />
    )
}
