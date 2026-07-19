import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export const LINK_CLASS =
    'text-foreground hover:text-accent transition-token underline underline-offset-4'
