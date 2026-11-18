import { useCallback, useEffect, useRef, useState } from 'react'

import { writeToClipboard } from '@/lib/clipboard'

import type { CopyStatus } from './use-copy-to-clipboard.types'

const RESET_AFTER_MS = 1600

export function useCopyToClipboard() {
    const [status, setStatus] = useState<CopyStatus>('idle')
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

    useEffect(() => {
        return () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current)
        }
    }, [])

    const copy = useCallback((text: string) => {
        void writeToClipboard(text).then(written => {
            setStatus(written ? 'copied' : 'failed')
            if (timeoutRef.current) clearTimeout(timeoutRef.current)
            timeoutRef.current = setTimeout(
                () => setStatus('idle'),
                RESET_AFTER_MS
            )
        })
    }, [])

    return { copy, status }
}
