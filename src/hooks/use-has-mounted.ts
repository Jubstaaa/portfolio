import { noop } from 'lodash-es'
import { useSyncExternalStore } from 'react'

const emptySubscribe = () => noop
const getSnapshot = () => true
const getServerSnapshot = () => false

export function useHasMounted(): boolean {
    return useSyncExternalStore(emptySubscribe, getSnapshot, getServerSnapshot)
}
