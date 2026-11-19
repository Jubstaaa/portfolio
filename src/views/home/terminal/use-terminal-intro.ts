import { useCallback, useEffect, useEffectEvent, useRef, useState } from 'react'

import {
    abortIntro,
    beginIntro,
    completeIntro,
    getSessionState,
} from './terminal-session'

export type IntroStatus = 'done' | 'idle' | 'playing'

interface IntroConditions {
    commands: string[] | undefined
    introPlayed: boolean
    reducedMotion: boolean
}

interface UseTerminalIntroOptions {
    execute: (raw: string) => void
    introCommands: string[] | undefined
    setInput: (value: string) => void
}

// Plays once per session, on a cold load too: the typing is the first thing a
// visitor sees. Later visits in the session and reduced motion show the output
// directly.
export function shouldPlayIntro({
    commands,
    introPlayed,
    reducedMotion,
}: IntroConditions): boolean {
    return (
        commands !== undefined &&
        commands.length > 0 &&
        !introPlayed &&
        !reducedMotion
    )
}

export function useTerminalIntro({
    execute,
    introCommands,
    setInput,
}: UseTerminalIntroOptions) {
    const [status, setStatus] = useState<IntroStatus>('idle')
    const [revealStatic, setRevealStatic] = useState(
        () => !introCommands || introCommands.length === 0
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
        if (
            !introCommands ||
            !shouldPlayIntro({
                commands: introCommands,
                introPlayed: getSessionState().introPlayed,
                reducedMotion: window.matchMedia(
                    '(prefers-reduced-motion: reduce)'
                ).matches,
            })
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
        // Either a key press (skip) or unmount ends the typing early. Checked
        // separately: AbortSignal.any is newer than the browsers Next supports.
        const { skip } = machineRef.current
        const stopped = () => skip.signal.aborted || lifecycle.signal.aborted

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
                    if (stopped()) {
                        finish(queue)
                        return
                    }
                    setInput(command.slice(0, index))
                    await sleep(35 + Math.random() * 45)
                }
                if (stopped()) {
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
    }, [introCommands, setInput])

    return { revealStatic, skipIntro, status }
}
