import { expect, test } from 'bun:test'
import { renderToStaticMarkup } from 'react-dom/server'
import { compile } from 'tailwindcss'

import { TimelineRow } from './timeline-row'

async function cssFor(markup: string): Promise<string> {
    const classes = [...markup.matchAll(/class="([^"]*)"/g)].flatMap(
        ([, value]) => value?.split(' ') ?? []
    )
    const compiler = await compile(
        '@theme { --breakpoint-md: 48rem; } @tailwind utilities;'
    )
    return compiler.build(classes)
}

test('puts the date range beside the entry on desktop', async () => {
    const css = await cssFor(
        renderToStaticMarkup(
            <TimelineRow dateRange="2024 — present">entry</TimelineRow>
        )
    )
    expect(css).toContain('grid-template-columns: 14rem minmax(0,1fr);')
})
