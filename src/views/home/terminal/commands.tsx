import type { ReactNode } from 'react'

import { NavLinks } from '@/components/nav-links/nav-links'
import { NowPlaying } from '@/components/now-playing/now-playing'
import { site } from '@/lib/content'
import { handlePath } from '@/lib/site'

import { Line } from './command-line'
import { Pre } from './command-pre'
import type { CommandContext, TerminalCommand } from './commands.types'
import {
    ENV_OUTPUT,
    HIDDEN_FILES,
    NEOFETCH_OUTPUT,
    TOP_OUTPUT,
} from './terminal-output.constants'

const PAGES: Record<string, string> = {
    '~': '/',
    'home': '/',
    ...Object.fromEntries(site.nav.map(item => [item.label, item.href])),
}

export const PAGE_TARGETS = Object.keys(PAGES)

function resolvePage(arg: string): string | undefined {
    const key = arg.replace(/^\.?\//, '').replace(/\/$/, '') || '~'
    return PAGES[key]
}

function line(text: string): TerminalCommand['run'] {
    return function LineRun() {
        return <Line>{text}</Line>
    }
}

function pre(text: string): TerminalCommand['run'] {
    return function PreRun() {
        return <Pre>{text}</Pre>
    }
}

function goTo(args: string, ctx: CommandContext): ReactNode {
    const href = resolvePage(args)
    if (!href) {
        return <Line>{`cd: no such file or directory: ${args}`}</Line>
    }
    ctx.navigate(href)
    return null
}

const VIM_ESCAPE = line(
    "E37: no write since last change — just kidding, you're free."
)

export const commands: Record<string, TerminalCommand> = {
    ':q': {
        description: '',
        hidden: true,
        run: VIM_ESCAPE,
    },
    ':q!': {
        description: '',
        hidden: true,
        run: VIM_ESCAPE,
    },
    'cat': {
        description: '',
        hidden: true,
        run: args => {
            const target = args.trim().replace(/^\.\//, '')
            if (target === 'secret.txt') {
                return (
                    <Line>
                        {
                            "you found it. now try 'rm -rf /' — what could go wrong?"
                        }
                    </Line>
                )
            }
            if (target === '.env') {
                return <Pre>{ENV_OUTPUT}</Pre>
            }
            if (target === '.git' || target === '.git/') {
                return <Line>{'cat: .git: Is a directory'}</Line>
            }
            return (
                <Line>{`cat: ${target || 'missing operand'}: no such file or directory`}</Line>
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
                        <Line>{'on branch main'}</Line>
                        <Line>{'nothing to commit, working tree clean.'}</Line>
                    </>
                )
            }
            if (sub === 'push') {
                return <Line>{'push to main? not on my watch.'}</Line>
            }
            if (!sub) {
                return <Line>{'usage: git <command>'}</Line>
            }
            return (
                <Line>{`git: '${sub}' is not a git command. but nice try.`}</Line>
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
                <Line>{"what do I look like, documentation? try 'help'."}</Line>
            ) : (
                <Line>{'what manual page do you want?'}</Line>
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
            <Line>{`PING ${args.trim() || 'localhost'}: pong. 0% packet loss, 100% vibes.`}</Line>
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
                return <Line>{'site deleted. just kidding.'}</Line>
            }
            return <Line>{'rm: permission denied'}</Line>
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

const STATIC_CTX: CommandContext = {
    getHistory: () => [],
    glitch: () => undefined,
    navigate: () => undefined,
}

export function renderCommandOutput(name: string, args = ''): ReactNode {
    return commands[name]?.run(args, STATIC_CTX) ?? null
}
