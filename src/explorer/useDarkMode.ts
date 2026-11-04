import { useSyncExternalStore } from 'react'

const query = '(prefers-color-scheme: dark)'

// The chart library needs real colour values, not CSS variables, so components that draw charts
// read the visitor's theme here and re-render when it changes.
export function useDarkMode(): boolean {
  return useSyncExternalStore(
    (onChange) => {
      const media = matchMedia(query)
      media.addEventListener('change', onChange)
      return () => media.removeEventListener('change', onChange)
    },
    () => matchMedia(query).matches,
  )
}
