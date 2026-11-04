import { useSyncExternalStore } from 'react'

const media = matchMedia('(prefers-color-scheme: dark)')

// Defined once, outside the hook, so React keeps one listener instead of re-subscribing every render.
function subscribe(onChange: () => void) {
  media.addEventListener('change', onChange)
  return () => media.removeEventListener('change', onChange)
}
const isDark = () => media.matches

// The chart library needs real colour values, not CSS variables, so components that draw charts
// read the visitor's theme here and re-render when it changes.
export function useDarkMode(): boolean {
  return useSyncExternalStore(subscribe, isDark)
}

// Reads a design token's current value (it changes with the theme), e.g. token('--border').
export function token(name: string): string {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim()
}
