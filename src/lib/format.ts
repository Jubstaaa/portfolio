export const YEAR_MONTH = /^\d{4}-(0[1-9]|1[0-2])$/

export function formatDate(iso: string): string {
    return new Date(iso).toISOString().slice(0, 10)
}

export function formatMonth(value: string | undefined): string {
    if (!value) return 'present'
    if (!YEAR_MONTH.test(value)) {
        throw new RangeError(`expected YYYY-MM, got "${value}"`)
    }
    const [year, month] = value.split('-')
    const monthName = new Date(`${year}-${month}-01T00:00:00Z`).toLocaleString(
        'en',
        {
            month: 'short',
            timeZone: 'UTC',
        }
    )
    return `${monthName.toLowerCase()} ${year}`
}
