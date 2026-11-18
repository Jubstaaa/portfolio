export function isActive(pathname: string, href: string): boolean {
    if (href === '/') return pathname === '/'
    return pathname === href || pathname.startsWith(`${href}/`)
}

export function routeLabel(href: string): string {
    return `.${href}`
}
