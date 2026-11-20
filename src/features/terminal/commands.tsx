import type { ReactNode } from 'react'

import { NavLinks } from '@/components/nav-links'
import { site } from '@/features/content/content'
import { handlePath } from '@/features/content/site'
import { NowPlaying } from '@/features/now-playing/now-playing'

import type { CommandContext, TerminalCommand } from './commands.types'

import { CommandLine } from './command-line'
import { CommandPre } from './command-pre'
import {
    ENV_OUTPUT,
    HIDDEN_FILES,
    NEOFETCH_OUTPUT,
    TOP_OUTPUT,
} from './terminal-output.constants'
import { resolvePage } from './terminal-parser'

const VIM_ESCAPE_MESSAGE =
    "E37: no write since last change — just kidding, you're free."

// Context for rendering command output on the server, where nothing can navigate.
const STATIC_CTX: CommandContext = {
    getHistory: () => [],
    glitch: () => undefined,
    navigate: () => undefined,
}

function goTo(args: string, ctx: CommandContext): ReactNode {
    const href = resolvePage(args)
    if (!href) {
        return (
            <CommandLine>{`cd: no such file or directory: ${args}`}</CommandLine>
        )
    }
    ctx.navigate(href)
    return null
}

function line(text: string): TerminalCommand['run'] {
    return function LineRun() {
        return <CommandLine>{text}</CommandLine>
    }
}

function pre(text: string): TerminalCommand['run'] {
    return function PreRun() {
        return <CommandPre>{text}</CommandPre>
    }
}

export const commands: Record<string, TerminalCommand> = {
    ':q': {
        description: '',
        hidden: true,
        run: line(VIM_ESCAPE_MESSAGE),
    },
    ':q!': {
        description: '',
        hidden: true,
        run: line(VIM_ESCAPE_MESSAGE),
    },
    'cat': {
        description: '',
        hidden: true,
        run: args => {
            const target = args.trim().replace(/^\.\//, '')
            if (target === 'secret.txt') {
                return (
                    <CommandLine>
                        {
                            "you found it. now try 'rm -rf /' — what could go wrong?"
                        }
                    </CommandLine>
                )
            }
            if (target === '.env') {
                return <CommandPre>{ENV_OUTPUT}</CommandPre>
            }
            if (target === '.git' || target === '.git/') {
                return <CommandLine>{'cat: .git: Is a directory'}</CommandLine>
            }
            return (
                <CommandLine>{`cat: ${target || 'missing operand'}: no such file or directory`}</CommandLine>
            )
        },
    },
    'cd': {
        description: 'go to a page — cd blog',
        run: goTo,
    },
    'clear': {
        description: 'clear the terminal',
        run: () => null,
    },
    'echo': {
        description: 'echo <text>',
        run: args => <p>{args}</p>,
    },
    'exit': {
        description: '',
        hidden: true,
        run: line('logout: there is no escape.'),
    },
    'git': {
        description: '',
        hidden: true,
        run: args => {
            const sub = args.trim().split(/\s+/)[0] ?? ''
            if (sub === 'status') {
                return (
                    <>
                        <CommandLine>{'on branch main'}</CommandLine>
                        <CommandLine>
                            {'nothing to commit, working tree clean.'}
                        </CommandLine>
                    </>
                )
            }
            if (sub === 'push') {
                return (
                    <CommandLine>
                        {'push to main? not on my watch.'}
                    </CommandLine>
                )
            }
            if (!sub) {
                return <CommandLine>{'usage: git <command>'}</CommandLine>
            }
            return (
                <CommandLine>{`git: '${sub}' is not a git command. but nice try.`}</CommandLine>
            )
        },
    },
    'help': {
        description: 'list available commands',
        run: () => (
            <div className="space-y-0.5">
                {Object.entries(commands)
                    .filter(([, command]) => !command.hidden)
                    .map(([name, command]) => (
                        <p key={name}>
                            <span className="text-foreground inline-block w-[14ch]">
                                {name}
                            </span>
                            <span className="text-muted-foreground">
                                {command.description}
                            </span>
                        </p>
                    ))}
                <p className="text-muted-foreground pt-2 text-xs">
                    ...and a few undocumented ones. real terminals have hidden
                    corners.
                </p>
            </div>
        ),
    },
    'history': {
        description: 'commands typed this session',
        run: (_args, ctx) => (
            <div className="space-y-0.5">
                {ctx.getHistory().map((entry, index) => (
                    <p key={index}>
                        <span className="text-muted-foreground inline-block w-[5ch]">
                            {index + 1}
                        </span>
                        {entry}
                    </p>
                ))}
            </div>
        ),
    },
    'htop': {
        description: '',
        hidden: true,
        run: pre(TOP_OUTPUT),
    },
    'ls': {
        description: 'list pages',
        run: args => {
            const showAll = /(^|\s)-\w*a/.test(args)
            return (
                <>
                    {showAll ? (
                        <p className="text-muted-foreground flex flex-wrap gap-x-6 gap-y-1">
                            {HIDDEN_FILES.map(file => (
                                <span key={file}>{file}</span>
                            ))}
                        </p>
                    ) : null}
                    <NavLinks />
                </>
            )
        },
    },
    'man': {
        description: '',
        hidden: true,
        run: args =>
            args.trim() ? (
                <CommandLine>
                    {"what do I look like, documentation? try 'help'."}
                </CommandLine>
            ) : (
                <CommandLine>{'what manual page do you want?'}</CommandLine>
            ),
    },
    'neofetch': {
        description: '',
        hidden: true,
        run: pre(NEOFETCH_OUTPUT),
    },
    'now-playing': {
        description: "what's on spotify right now",
        run: () => <NowPlaying />,
    },
    'open': {
        description: 'alias for cd',
        run: goTo,
    },
    'ping': {
        description: '',
        hidden: true,
        run: args => (
            <CommandLine>{`PING ${args.trim() || 'localhost'}: pong. 0% packet loss, 100% vibes.`}</CommandLine>
        ),
    },
    'pwd': {
        description: 'print working directory',
        run: () => <p>{handlePath()}</p>,
    },
    'rm': {
        description: '',
        hidden: true,
        run: (args, ctx) => {
            if (args.startsWith('-rf')) {
                ctx.glitch()
                return (
                    <CommandLine>{'site deleted. just kidding.'}</CommandLine>
                )
            }
            return <CommandLine>{'rm: permission denied'}</CommandLine>
        },
    },
    'ssh': {
        description: '',
        hidden: true,
        run: line(
            "ssh: connection refused. this terminal doesn't go anywhere."
        ),
    },
    'sudo': {
        description: '',
        hidden: true,
        run: line("nice try. you're not root here."),
    },
    'top': {
        description: '',
        hidden: true,
        run: pre(TOP_OUTPUT),
    },
    'uname': {
        description: '',
        hidden: true,
        run: line('ilkerOS 1.0 (web) hermit/2.0'),
    },
    'vim': {
        description: '',
        hidden: true,
        run: line("you've entered vim. you can never leave. (hint: :q)"),
    },
    'whoami': {
        description: 'who is this guy',
        run: () => (
            <>
                <p>{site.name}</p>
                <p className="text-muted-foreground">
                    {site.role} · {site.location}
                </p>
            </>
        ),
    },
}

export const COMMAND_NAMES = Object.entries(commands)
    .filter(([, command]) => !command.hidden)
    .map(([name]) => name)

export function renderCommandOutput(name: string, args = ''): ReactNode {
    const command = Object.hasOwn(commands, name) ? commands[name] : undefined
    if (!command)
        throw new Error(`renderCommandOutput: unknown command '${name}'`)
    return command.run(args, STATIC_CTX)
}
