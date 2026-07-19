import Link from 'next/link'

import { site } from '@/lib/content'

import type { NavLinksProps } from './nav-links.types'

export function NavLinks({ includeHome = false }: NavLinksProps) {
    return (
        <p className="flex flex-wrap gap-x-6 gap-y-1">
            {includeHome ? (
                <Link
                    className="hover:text-accent transition-token underline-offset-4 hover:underline"
                    href="/">
                    ./home
                </Link>
            ) : null}
            {site.nav.map(item => (
                <Link
                    key={item.href}
                    className="hover:text-accent transition-token underline-offset-4 hover:underline"
                    href={item.href}>
                    .{item.href}
                </Link>
            ))}
        </p>
    )
}
