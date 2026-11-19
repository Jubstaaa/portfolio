import { expect, test } from 'bun:test'

import { shouldPlayIntro } from './use-terminal-intro'

const commands = ['whoami', 'ls']

test('the intro plays when it has not played yet in this session', () => {
    expect(
        shouldPlayIntro({ commands, introPlayed: false, reducedMotion: false })
    ).toBe(true)
})

test('the intro does not replay once it has played in this session', () => {
    expect(
        shouldPlayIntro({ commands, introPlayed: true, reducedMotion: false })
    ).toBe(false)
})

test('reduced motion shows the static output instead of the typing intro', () => {
    expect(
        shouldPlayIntro({ commands, introPlayed: false, reducedMotion: true })
    ).toBe(false)
})

test('there is nothing to play without intro commands', () => {
    expect(
        shouldPlayIntro({
            commands: undefined,
            introPlayed: false,
            reducedMotion: false,
        })
    ).toBe(false)
    expect(
        shouldPlayIntro({
            commands: [],
            introPlayed: false,
            reducedMotion: false,
        })
    ).toBe(false)
})
