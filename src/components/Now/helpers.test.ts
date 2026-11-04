import { describe, expect, it } from 'vitest'
import { linePoints } from './helpers.ts'

describe('linePoints', () => {
  it('puts the lowest value at the bottom and the highest at the top', () => {
    expect(linePoints([1, 3, 2], 100, 50)).toEqual([
      { x: 0, y: 50 },
      { x: 50, y: 0 },
      { x: 100, y: 25 },
    ])
  })

  it('draws a flat line along the bottom without dividing by zero', () => {
    expect(linePoints([5, 5], 10, 20)).toEqual([
      { x: 0, y: 20 },
      { x: 10, y: 20 },
    ])
  })
})
