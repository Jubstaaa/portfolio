import { site } from '@/lib/content'

const HOST = new URL(site.url).host

export const HIDDEN_FILES = ['.env', '.git/', 'secret.txt']

const NEOFETCH_ART = ['   ▲', '  ▲ ▲', ' ▲▲▲▲▲']

const NEOFETCH_INFO = [
    `${site.handle}@${HOST}`,
    '─'.repeat(26),
    'os: next.js 16 (app router)',
    'host: vercel',
    'shell: interactive-terminal',
    'font: hermit v2.0',
    'theme: dark',
    'uptime: shipping since 2023',
]

export const NEOFETCH_OUTPUT = NEOFETCH_INFO.map(
    (info, index) => `${(NEOFETCH_ART[index] ?? '').padEnd(11)}${info}`
).join('\n')

export const ENV_OUTPUT = [
    'SPOTIFY_CLIENT_SECRET=nice_try',
    'AWS_ACCESS_KEY_ID=AKIA_JUST_KIDDING',
    'DATABASE_URL=postgres://you:wish@localhost:5432/nope',
].join('\n')

export const TOP_OUTPUT = [
    'PID   COMMAND            CPU',
    '1     next-server        1.2%',
    '7     spotify-widget     2.4%',
    '42    easter-egg-hunter  99.9%',
].join('\n')
