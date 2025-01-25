import { useEffect, useState } from "react"

const colorSchemeTypes = {
    dark: "dark",
    light: "light"
} as const

type ColorSchemeType = typeof colorSchemeTypes

type Scheme = ColorSchemeType['dark'] | ColorSchemeType['light']

export const colorSchemes = {
    dark: '(prefers-color-scheme: dark)',
    light: '(prefers-color-scheme: light)'
}

export default function useDetectColorScheme(defaultScheme: Scheme = 'dark') {
    const [scheme, setScheme] = useState<Scheme>(defaultScheme)

    useEffect(() => {
        if (!window.matchMedia) return

        const listener = (event: MediaQueryListEvent | MediaQueryList) => {
            if (!event.matches) return

            const { media } = event
            const schemes = Object.entries(colorSchemes)

            for (let i = 0; i < schemes.length; i++) {
                const [name, matcher] = schemes[i]

                if (media !== matcher) continue

                if (name === 'dark') setScheme('dark')
                else if (name === 'light') setScheme('light')
                else setScheme(defaultScheme)
            }
        }

        const activeMatches: MediaQueryList[] = []
        const schemes = Object.entries(colorSchemes)

        for (let i = 0; i < schemes.length; i++) {
            const [_, matcher] = schemes[i];
            const mq = window.matchMedia(matcher)

            mq.addEventListener("change", listener)
            activeMatches.push(mq)
            listener(mq)
        }

        return () => {
            activeMatches.forEach((mq) => mq.removeEventListener("change", listener))
            activeMatches.splice(0, activeMatches.length)
        }
    }, [])

    return scheme
}
