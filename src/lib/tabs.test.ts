import { describe, expect, it } from 'vitest'
import { nextTab } from './tabs.ts'

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
