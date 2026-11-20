import { expect, test } from 'bun:test'
import { renderToStaticMarkup } from 'react-dom/server'

import { completeIntro } from './terminal-session'
import { useTerminalIntro } from './use-terminal-intro'

function IntroProbe() {
    const { playing } = useTerminalIntro()
    return <i data-playing={playing} />
}

test('the intro plays once per session, then the output shows directly', () => {
    expect(renderToStaticMarkup(<IntroProbe />)).toContain(
        'data-playing="true"'
    )
    completeIntro()
    expect(renderToStaticMarkup(<IntroProbe />)).toContain(
        'data-playing="false"'
    )
})
