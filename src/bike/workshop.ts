// The rules of the bike workshop, kept apart from the screens so they can be tested on their own.
// Every function returns a new state instead of changing the old one. React relies on that: it
// compares old and new state to decide what to redraw, and in development it runs updates twice.

export type FrameSize = 'S' | 'M' | 'L'
export type WheelSize = '27.5' | '29'
export type Gears = 'single' | '10-speed'
export type Brakes = 'rim' | 'disc'

// What the customer chose.
export interface Options {
  frame: FrameSize
  wheels: WheelSize
  gears: Gears
  brakes: Brakes
  lights: boolean
}

export interface Order {
  id: number
  options: Options
  // How many steps are finished. The order is complete when this equals its number of steps.
  done: number
}

// One line of the parts log: which order used which part, and at which step.
export interface LogEntry {
  orderId: number
  step: string
  part: string
  qty: number
}

export interface Workshop {
  stock: Record<string, number>
  orders: Order[]
  log: LogEntry[]
}

// Parts are identified by a short id; this gives each one a readable name.
export const PART_NAMES: Record<string, string> = {
  'frame-S': 'Frame, small',
  'frame-M': 'Frame, medium',
  'frame-L': 'Frame, large',
  fork: 'Fork',
  headset: 'Headset',
  'wheel-27.5': 'Wheel, 27.5 inch',
  'wheel-29': 'Wheel, 29 inch',
  'gears-single': 'Single-speed drivetrain',
  'gears-10-speed': '10-speed drivetrain',
  chain: 'Chain',
  'brakes-rim': 'Rim brake set',
  'brakes-disc': 'Disc brake set',
  lights: 'Light set',
  saddle: 'Saddle',
  handlebar: 'Handlebar',
}

// At or below this many, a part is shown as running low.
export const LOW_STOCK = 2

export interface Step {
  name: string
  // The parts this step uses for a given order, as { partId: quantity }.
  parts: (o: Options) => Record<string, number>
  // Leave out to always include the step.
  needed?: (o: Options) => boolean
}

// My own production line, in the order it has to happen.
export const STEPS: Step[] = [
  { name: 'Prepare the frame', parts: (o) => ({ [`frame-${o.frame}`]: 1 }) },
  { name: 'Fit the fork and headset', parts: () => ({ fork: 1, headset: 1 }) },
  { name: 'Build the wheels', parts: (o) => ({ [`wheel-${o.wheels}`]: 2 }) },
  { name: 'Fit the drivetrain', parts: (o) => ({ [`gears-${o.gears}`]: 1, chain: 1 }) },
  { name: 'Fit the brakes', parts: (o) => ({ [`brakes-${o.brakes}`]: 1 }) },
  { name: 'Fit the lights', parts: () => ({ lights: 1 }), needed: (o) => o.lights },
  { name: 'Fit the saddle and handlebar', parts: () => ({ saddle: 1, handlebar: 1 }) },
  { name: 'Quality check', parts: () => ({}) },
]

// The steps this order goes through: everything, minus lights if the customer didn't want them.
export function stepsFor(o: Options): Step[] {
  return STEPS.filter((step) => step.needed?.(o) ?? true)
}

export function isFinished(order: Order): boolean {
  return order.done >= stepsFor(order.options).length
}

// The next step for an order, or undefined once it's finished.
export function nextStep(order: Order): Step | undefined {
  return stepsFor(order.options)[order.done]
}

// Parts the next step needs that aren't in stock, with how many are missing. Empty means it can go ahead.
export function missingParts(state: Workshop, order: Order): Record<string, number> {
  const missing: Record<string, number> = {}
  const step = nextStep(order)
  if (!step) return missing
  for (const [part, qty] of Object.entries(step.parts(order.options))) {
    const have = state.stock[part] ?? 0
    if (have < qty) missing[part] = qty - have
  }
  return missing
}

export function addOrder(state: Workshop, options: Options): Workshop {
  // Worked out from the existing orders, not a counter kept elsewhere, so it can't drift.
  const id = Math.max(0, ...state.orders.map((o) => o.id)) + 1
  return { ...state, orders: [...state.orders, { id, options, done: 0 }] }
}

// Does an order's next step: takes its parts from stock and logs them. If the order is finished,
// unknown, or any part is short, nothing changes at all: a step never takes half its parts.
export function advance(state: Workshop, orderId: number): Workshop {
  const order = state.orders.find((o) => o.id === orderId)
  if (!order) return state
  const step = nextStep(order)
  if (!step || Object.keys(missingParts(state, order)).length > 0) return state

  const used = Object.entries(step.parts(order.options))
  const stock = { ...state.stock }
  for (const [part, qty] of used) stock[part] = (stock[part] ?? 0) - qty
  return {
    stock,
    orders: state.orders.map((o) => (o.id === orderId ? { ...o, done: o.done + 1 } : o)),
    log: [...state.log, ...used.map(([part, qty]) => ({ orderId, step: step.name, part, qty }))],
  }
}

export function restock(state: Workshop, part: string, qty: number): Workshop {
  return { ...state, stock: { ...state.stock, [part]: (state.stock[part] ?? 0) + qty } }
}

// What the demo starts with: two orders, and a few parts already low so a blocked step shows up quickly.
export const START: Workshop = {
  stock: {
    'frame-S': 3,
    'frame-M': 4,
    'frame-L': 2,
    fork: 6,
    headset: 6,
    'wheel-27.5': 6,
    'wheel-29': 2,
    'gears-single': 3,
    'gears-10-speed': 4,
    chain: 6,
    'brakes-rim': 3,
    'brakes-disc': 4,
    lights: 1,
    saddle: 6,
    handlebar: 6,
  },
  orders: [
    {
      id: 1,
      options: { frame: 'M', wheels: '29', gears: '10-speed', brakes: 'disc', lights: true },
      done: 2,
    },
    { id: 2, options: { frame: 'L', wheels: '29', gears: 'single', brakes: 'rim', lights: false }, done: 0 },
  ],
  log: [
    { orderId: 1, step: 'Prepare the frame', part: 'frame-M', qty: 1 },
    { orderId: 1, step: 'Fit the fork and headset', part: 'fork', qty: 1 },
    { orderId: 1, step: 'Fit the fork and headset', part: 'headset', qty: 1 },
  ],
}
