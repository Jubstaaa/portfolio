import { describe, expect, test } from 'bun:test'

import { formatDate, formatMonth } from '@/lib/format'

describe('formatMonth', () => {
    test('formats YYYY-MM as a short lowercase month', () => {
        expect(formatMonth('2024-03')).toBe('mar 2024')
        expect(formatMonth('2024-12')).toBe('dec 2024')
    })

    test('a missing value means ongoing', () => {
        expect(formatMonth(undefined)).toBe('present')
    })

    test.each(['2024', '2024-13', 'march 2024'])('rejects %p', value => {
        expect(() => formatMonth(value)).toThrow()
    })
})

describe('formatDate', () => {
    test('keeps the calendar date of a UTC ISO timestamp', () => {
        expect(formatDate('2026-04-20T00:00:00.000Z')).toBe('2026-04-20')
    })
})
