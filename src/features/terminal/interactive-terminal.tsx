'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { type ReactNode, useEffect, useRef, useState } from 'react'

import { TerminalCaret } from '@/components/terminal-block/terminal-caret'
import { TerminalLine } from '@/components/terminal-block/terminal-line'
import { cn } from '@/lib/utils'

import { runCommand } from './run-command'
import {
    appendEntry,
    clearTerminal,
    getSessionState,
    pushHistory,
    useTerminalSession,
} from './terminal-session'
import { useCommandHistory } from './use-command-history'
import { useTabCompletion } from './use-tab-completion'
import { useTerminalIntro } from './use-terminal-intro'

interface InteractiveTerminalProps {
    children?: ReactNode
    className?: string
}

export function InteractiveTerminal({
    children,
    className,
}: InteractiveTerminalProps) {
    const router = useRouter()

    const [queryClient] = useState(() => new QueryClient())
    const { cleared, entries, history } = useTerminalSession()

    const [input, setInput] = useState('')
    const [glitching, setGlitching] = useState(false)
    const [focused, setFocused] = useState(false)

    const inputRef = useRef<HTMLInputElement>(null)

    const { handleArrowDown, handleArrowUp, resetHistoryNavigation } =
        useCommandHistory({
            history,
            input,
            setInput,
        })

    const execute = (raw: string) => {
        resetHistoryNavigation()

        const result = runCommand(raw, {
            getHistory: () => [...getSessionState().history],
            glitch: () => {
                setGlitching(true)
            },
            navigate: href => {
                router.push(href)
            },
        })
        if (result.kind === 'empty') {
            appendEntry('', null)
            return
        }

        pushHistory(result.command)
        if (result.kind === 'clear') {
            clearTerminal()
            return
        }
        appendEntry(result.command, result.output)
    }

    const { playing: introPlaying, skipIntro } = useTerminalIntro()

    const { complete, resetCompletion } = useTabCompletion({
        appendEntry,
        input,
        setInput,
    })

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        skipIntro()
        if (event.nativeEvent.isComposing) return

        if (event.key === 'Enter') {
            event.preventDefault()
            resetCompletion()
            execute(input)
            setInput('')
            return
        }

        if (event.key === 'Tab' && !event.shiftKey) {
            if (complete()) {
                event.preventDefault()
            }
            return
        }

        if (event.key === 'ArrowUp') {
            if (handleArrowUp(event)) resetCompletion()
            return
        }

        if (event.key === 'ArrowDown') {
            if (handleArrowDown(event)) resetCompletion()
        }
    }

    useEffect(() => {
        if (window.matchMedia('(pointer: fine)').matches) {
            inputRef.current?.focus({ preventScroll: true })
        }

        const handleDocumentClick = (event: MouseEvent) => {
            skipIntro()
            if (window.getSelection()?.toString()) return
            if (!(event.target instanceof HTMLElement)) return
            if (!event.target.closest('#main')) return
            if (
                event.target.closest(
                    "a, button, input, textarea, select, [role='button']"
                )
            )
                return
            inputRef.current?.focus({ preventScroll: true })
        }
        document.addEventListener('click', handleDocumentClick)
        return () => {
            document.removeEventListener('click', handleDocumentClick)
        }
    }, [skipIntro])

    useEffect(() => {
        if (entries.length === 0) return
        inputRef.current?.scrollIntoView({ block: 'nearest' })
    }, [entries])

    return (
        <QueryClientProvider client={queryClient}>
            <div
                className={cn(
                    'flex flex-col',
                    glitching && 'terminal-glitch',
                    className
                )}
                onAnimationEnd={event => {
                    if (event.animationName === 'terminal-glitch')
                        setGlitching(false)
                }}>
                {cleared ? null : (
                    <div
                        className="mb-3 flex flex-col gap-3"
                        data-terminal-intro={introPlaying || undefined}
                        data-terminal-static>
                        {children}
                    </div>
                )}

                <div
                    aria-live="polite"
                    className="mb-3 flex flex-col gap-3 empty:mb-0">
                    {entries.map(entry => (
                        <TerminalLine command={entry.command} key={entry.id}>
                            {entry.output}
                        </TerminalLine>
                    ))}
                </div>

                <label className="flex cursor-default items-center">
                    <TerminalCaret />
                    <input
                        aria-label="terminal input — type 'help' for commands"
                        autoCapitalize="off"
                        autoComplete="off"
                        autoCorrect="off"

                        className="text-foreground min-w-0 cursor-default bg-transparent p-0 caret-transparent outline-none!"
                        enterKeyHint="go"
                        id="terminal-input"
                        name="terminal-input"
                        onBlur={() => {
                            setFocused(false)
                        }}
                        onChange={event => {
                            resetCompletion()

                            resetHistoryNavigation()
                            setInput(event.target.value)
                        }}
                        onFocus={() => {
                            setFocused(true)
                        }}
                        onKeyDown={handleKeyDown}
                        ref={inputRef}
                        spellCheck={false}
                        style={{ width: `${input.length}ch` }}
                        value={input}
                    />
                    <span
                        aria-hidden
                        className={cn(
                            'shrink-0 select-none',
                            focused ? 'cursor-blink' : 'opacity-40'
                        )}>
                        _
                    </span>
                </label>
            </div>
        </QueryClientProvider>
    )
}
