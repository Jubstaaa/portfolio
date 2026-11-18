import { useCallback, useEffect, useEffectEvent, useRef, useState } from 'react'

import { useHasMounted } from '@/hooks/use-has-mounted'

import {
    abortIntro,
    beginIntro,
    completeIntro,
    getSessionState,
} from './terminal-session'

export type IntroStatus = 'done' | 'idle' | 'playing'

interface UseTerminalIntroOptions {
    execute: (raw: string) => void
    introCommands: string[] | undefined
    setInput: (value: string) => void
}

export function useTerminalIntro({
    execute,
    introCommands,
    setInput,
}: UseTerminalIntroOptions) {
    const [status, setStatus] = useState<IntroStatus>('idle')
    // Latched on the first render: false while hydrating a server-rendered page,
    // true when the terminal mounts after a client-side navigation. A cold load
    // keeps the server-rendered output on screen (it is the LCP element); the
    // typing intro only replays it for visitors arriving from elsewhere on the site.
    const hasMounted = useHasMounted()
    const [coldLoad] = useState(() => !hasMounted)
    const [revealStatic, setRevealStatic] = useState(
        () => coldLoad || !introCommands || introCommands.length === 0
    )

    const machineRef = useRef({ active: false, skip: new AbortController() })
    const timeoutRef = useRef<null | number>(null)

    const runCommand = useEffectEvent(execute)

    const skipIntro = useCallback((): boolean => {
        if (!machineRef.current.active) return false
        machineRef.current.skip.abort()
        return true
    }, [])

    useEffect(() => {
        if (coldLoad || !introCommands || introCommands.length === 0) return
        if (
            getSessionState().introPlayed ||
            window.matchMedia('(prefers-reduced-motion: reduce)').matches
        ) {
            queueMicrotask(() => {
                setRevealStatic(true)
            })
            return
        }

        machineRef.current = { active: true, skip: new AbortController() }
        // Aborted on unmount; a signal (unlike a reassigned local) stays readable
        // to the async loop and to the type checker.
        const lifecycle = new AbortController()
        // Either a key press (skip) or unmount ends the typing early.
        const stop = AbortSignal.any([
            machineRef.current.skip.signal,
            lifecycle.signal,
        ])

        const sleep = (ms: number) =>
            new Promise<void>(resolve => {
                timeoutRef.current = window.setTimeout(resolve, ms)
            })

        const finish = (remaining: string[]) => {
            machineRef.current.active = false
            if (lifecycle.signal.aborted) return
            for (const command of remaining) runCommand(command)
            completeIntro()
            setInput('')
            setStatus('done')
        }

        void (async () => {
            await sleep(0)
            if (lifecycle.signal.aborted) return
            setStatus('playing')
            beginIntro()
            await sleep(400)

            const queue = [...introCommands]
            while (queue.length > 0) {
                const command = queue[0] ?? ''
                for (let index = 1; index <= command.length; index += 1) {
                    if (stop.aborted) {
                        finish(queue)
                        return
                    }
                    setInput(command.slice(0, index))
                    await sleep(35 + Math.random() * 45)
                }
                if (stop.aborted) {
                    finish(queue)
                    return
                }
                await sleep(200)
                runCommand(command)
                setInput('')
                queue.shift()
                await sleep(350)
            }
            machineRef.current.active = false
            completeIntro()
            setStatus('done')
        })()

        return () => {
            lifecycle.abort()
            if (timeoutRef.current !== null)
                window.clearTimeout(timeoutRef.current)
            if (machineRef.current.active) {
                machineRef.current.active = false
                abortIntro()
            }
        }
    }, [coldLoad, introCommands, setInput])

    return { revealStatic, skipIntro, status }
}
