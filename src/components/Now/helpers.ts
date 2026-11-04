// Which tab arrow keys move to, following the standard tabs keyboard pattern (wraps at the ends).
export function nextTab(key: string, current: number, count: number): number | null {
  if (key === 'ArrowRight') return (current + 1) % count
  if (key === 'ArrowLeft') return (current - 1 + count) % count
  if (key === 'Home') return 0
  if (key === 'End') return count - 1
  return null
}

export interface Point {
  x: number
  y: number
}

// Scales values into a width x height box, highest value at the top, for an SVG polyline.
export function linePoints(values: number[], width: number, height: number): Point[] {
  const min = Math.min(...values)
  const range = Math.max(...values) - min || 1
  const step = values.length > 1 ? width / (values.length - 1) : 0
  return values.map((v, i) => ({ x: i * step, y: height - ((v - min) / range) * height }))
}
