import { useCallback, useEffect, useState } from 'react'

import { completeIntro, getSessionState } from './terminal-session'

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
