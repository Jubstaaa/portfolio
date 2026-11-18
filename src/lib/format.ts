import { UTCDate } from '@date-fns/utc'
import { format, isMatch, parse } from 'date-fns'

const YEAR_MONTH = 'yyyy-MM'

export function formatDate(iso: string): string {
    return format(new UTCDate(iso), 'yyyy-MM-dd')
}

export function formatMonth(value: string | undefined): string {
    if (!value) return 'present'
    if (!isYearMonth(value)) {
        throw new RangeError(`expected YYYY-MM, got "${value}"`)
    }
    const month = parse(value, YEAR_MONTH, new UTCDate(0))
    return format(month, 'MMM yyyy').toLowerCase()
}

// isMatch alone accepts "2024-3"; the round trip also requires the zero padding
// that string-sorting these values relies on.
export function isYearMonth(value: string): boolean {
    return (
        isMatch(value, YEAR_MONTH) &&
        format(parse(value, YEAR_MONTH, new UTCDate(0)), YEAR_MONTH) === value
    )
}
