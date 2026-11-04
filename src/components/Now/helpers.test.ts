import { describe, expect, it } from 'vitest'
import { linePoints, nextTab } from './helpers.ts'

describe('nextTab', () => {
  it('moves right and left, wrapping at the ends', () => {
    expect(nextTab('ArrowRight', 0, 4)).toBe(1)
    expect(nextTab('ArrowRight', 3, 4)).toBe(0)
    expect(nextTab('ArrowLeft', 0, 4)).toBe(3)
  })

  it('jumps to the first and last tab', () => {
    expect(nextTab('Home', 2, 4)).toBe(0)
    expect(nextTab('End', 1, 4)).toBe(3)
  })

  it('ignores other keys', () => {
    expect(nextTab('Enter', 1, 4)).toBeNull()
  })
})

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
