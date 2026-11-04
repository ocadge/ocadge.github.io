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
