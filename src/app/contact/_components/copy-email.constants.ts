import type { CopyStatus } from '@/hooks/use-copy-to-clipboard.types'

export const COPY_EMAIL_LABEL: Record<CopyStatus, string> = {
    copied: 'Email copied',
    failed: 'Copy failed — select the address instead',
    idle: 'Copy email',
}
