'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

export function useCopyToClipboard() {
    const [copied, setCopied] = useState(false)
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

    useEffect(() => {
        return () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current)
        }
    }, [])

    const copy = useCallback((text: string) => {
        void navigator.clipboard.writeText(text).then(() => {
            setCopied(true)
            if (timeoutRef.current) clearTimeout(timeoutRef.current)
            timeoutRef.current = setTimeout(() => setCopied(false), 1600)
        })
    }, [])

    return { copied, copy }
}
