import type { CSSProperties } from 'react'

import { TerminalLine } from '@/components/terminal-block/terminal-line'

import { renderCommandOutput } from './commands'

interface IntroTranscriptProps {
    commands: readonly string[]
}

interface TypedCommand {
    chars: number
    command: string
    index: number
    offset: number
}

// Read by `.terminal-typing` in globals.css, which turns them into a delay and a
// steps() count; the durations come from tokens so reduced motion zeroes them.
interface TypingStyle extends CSSProperties {
    '--typing-chars': number
    '--typing-index': number
    '--typing-offset': number
}

export function IntroTranscript({ commands }: IntroTranscriptProps) {
    return typingSchedule(commands).map(({ chars, command, index, offset }) => {
        const style: TypingStyle = {
            '--typing-chars': chars,
            '--typing-index': index,
            '--typing-offset': offset,
        }
        return (
            <TerminalLine
                command={
                    <span className="terminal-typing" style={style}>
                        {command}
                    </span>
                }
                key={command}>
                {renderCommandOutput(command)}
            </TerminalLine>
        )
    })
}

export function typingSchedule(commands: readonly string[]): TypedCommand[] {
    let offset = 0
    return commands.map((command, index) => {
        const typed = { chars: command.length, command, index, offset }
        offset += command.length
        return typed
    })
}
