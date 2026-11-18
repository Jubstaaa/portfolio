import type { CopyStatus } from '@/hooks/use-copy-to-clipboard.types'

export const COPY_CODE_LABEL: Record<CopyStatus, string> = {
    copied: 'Copied',
    failed: 'Copy failed — select the code instead',
    idle: 'Copy code',
}
