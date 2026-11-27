import { expect, test } from 'bun:test'
import { renderToStaticMarkup } from 'react-dom/server'

import { IntroTranscript, typingSchedule } from './intro-transcript'

test('each command starts typing after the characters before it', () => {
    expect(typingSchedule(['whoami', 'ls', 'now-playing'])).toEqual([
        { chars: 6, command: 'whoami', index: 0, offset: 0 },
        { chars: 2, command: 'ls', index: 1, offset: 6 },
        { chars: 11, command: 'now-playing', index: 2, offset: 8 },
    ])
})

test('the output is server-rendered visible and only the command is typed', () => {
    const html = renderToStaticMarkup(<IntroTranscript commands={['ls']} />)
    expect(html).not.toMatch(/class="[^"]*\bhidden\b/)
    expect(html).toContain('about')
    expect(html).toMatch(
        /<span class="terminal-typing" style="--typing-chars:2;--typing-index:0;--typing-offset:0">ls<\/span>/
    )
})

test.each(['nope', 'constructor'])(
    'an unknown intro command %s fails the render',
    name => {
        expect(() =>
            renderToStaticMarkup(<IntroTranscript commands={[name]} />)
        ).toThrow(`unknown command '${name}'`)
    }
)
