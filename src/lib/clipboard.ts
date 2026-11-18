// Clipboard writes reject without user activation, in insecure contexts, or when
// the permission is denied. Callers get a boolean instead of a rejection.
export async function writeToClipboard(
    text: string,
    clipboard: Pick<Clipboard, 'writeText'> = navigator.clipboard
): Promise<boolean> {
    try {
        await clipboard.writeText(text)
        return true
    } catch (error) {
        console.error('clipboard write failed', error)
        return false
    }
}
