import { describe, expect, it } from 'vitest'
import {
  addOrder,
  advance,
  isFinished,
  missingParts,
  nextStep,
  restock,
  START,
  STEPS,
  stepsFor,
  type Options,
  type Workshop,
} from './workshop.ts'

const noLights: Options = { frame: 'S', wheels: '27.5', gears: 'single', brakes: 'rim', lights: false }

// Plenty of every part, so only the test's own changes can block a step.
const stocked = (): Workshop => ({
  stock: Object.fromEntries(Object.keys(START.stock).map((part) => [part, 10])),
  orders: [{ id: 1, options: noLights, done: 0 }],
  log: [],
})

describe('stepsFor', () => {
  it('only includes the lights step when lights were ordered', () => {
    expect(stepsFor(noLights)).toHaveLength(STEPS.length - 1)
    expect(stepsFor({ ...noLights, lights: true })).toHaveLength(STEPS.length)
  })
})

describe('advance', () => {
  it('does the next step: takes its parts, logs them and moves the order on', () => {
    const after = advance(stocked(), 1)
    expect(after.stock['frame-S']).toBe(9)
    expect(after.orders[0]?.done).toBe(1)
    expect(after.log).toEqual([{ orderId: 1, step: 'Prepare the frame', part: 'frame-S', qty: 1 }])
  })

  it('does nothing when a part is short, even if the step has other parts in stock', () => {
    // The fork step needs a fork and a headset. Only the headset (its second part) is missing.
    const order = { id: 1, options: noLights, done: 1 }
    const before = { ...stocked(), stock: { ...stocked().stock, headset: 0 }, orders: [order] }
    expect(missingParts(before, order)).toEqual({ headset: 1 })
    expect(advance(before, 1)).toBe(before)
  })

  it('does not change the state it was given', () => {
    const before = stocked()
    advance(before, 1)
    expect(before.stock['frame-S']).toBe(10)
    expect(before.orders[0]?.done).toBe(0)
  })

  it('stops at the end of the line and ignores unknown orders', () => {
    let state = stocked()
    for (let i = 0; i < 20; i++) state = advance(state, 1)
    const order = state.orders[0]
    expect(order?.done).toBe(stepsFor(noLights).length)
    expect(order && isFinished(order)).toBe(true)
    expect(order && nextStep(order)).toBeUndefined()
    expect(advance(state, 1)).toBe(state)
    expect(advance(state, 99)).toBe(state)
  })

  it('never uses lights for an order without them', () => {
    let state = stocked()
    for (let i = 0; i < 20; i++) state = advance(state, 1)
    expect(state.log.some((entry) => entry.part === 'lights')).toBe(false)
    expect(state.stock.lights).toBe(10)
  })
})

describe('restock', () => {
  it('unblocks a step that was short', () => {
    const blocked = { ...stocked(), stock: { ...stocked().stock, 'frame-S': 0 } }
    expect(advance(blocked, 1)).toBe(blocked)
    expect(advance(restock(blocked, 'frame-S', 1), 1).orders[0]?.done).toBe(1)
  })
})

describe('addOrder', () => {
  it('numbers each new order one past the highest so far', () => {
    const state = addOrder(addOrder(stocked(), noLights), noLights)
    expect(state.orders.map((o) => o.id)).toEqual([1, 2, 3])
    expect(state.orders[2]?.done).toBe(0)
  })
})

describe('START', () => {
  it('has a name-able stock entry for every part a step can use', () => {
    const options: Options[] = [
      { frame: 'S', wheels: '27.5', gears: 'single', brakes: 'rim', lights: true },
      { frame: 'M', wheels: '29', gears: '10-speed', brakes: 'disc', lights: true },
      { frame: 'L', wheels: '29', gears: '10-speed', brakes: 'disc', lights: true },
    ]
    for (const o of options)
      for (const step of stepsFor(o))
        for (const part of Object.keys(step.parts(o))) expect(START.stock[part], part).toBeDefined()
  })
})
