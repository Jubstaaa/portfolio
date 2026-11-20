import { useCallback, useEffect, useState } from 'react'

import { completeIntro, getSessionState } from './terminal-session'

// The typing itself is CSS (`.terminal-typing`), so it starts with the first
// paint, before hydration. This only decides whether it runs: once per session,
// so returning to the home page shows the transcript directly, and a key press
// or click ends it early.
export function useTerminalIntro() {
    const [playing, setPlaying] = useState(() => !getSessionState().introPlayed)

    useEffect(() => {
        completeIntro()
    }, [])

    const skipIntro = useCallback(() => {
        setPlaying(false)
    }, [])

    return { playing, skipIntro }
}
