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
