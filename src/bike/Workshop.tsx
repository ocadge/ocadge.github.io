import { useReducer, useState, type FormEvent } from 'react'
import {
  addOrder,
  advance,
  isFinished,
  LOW_STOCK,
  missingParts,
  nextStep,
  PART_NAMES,
  restock,
  START,
  stepsFor,
  type Brakes,
  type FrameSize,
  type Gears,
  type Options,
  type Order,
  type WheelSize,
  type Workshop as State,
} from './workshop.ts'

// Everything the screens can ask for. The reducer below turns each one into a new state.
type Action =
  | { type: 'add'; options: Options }
  | { type: 'advance'; id: number }
  | { type: 'restock'; part: string }
  | { type: 'reset' }

const RESTOCK_BY = 5

// A reducer takes the current state and an action and returns the next state. All the rules live in
// workshop.ts, so this only picks which one to call.
function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'add':
      return addOrder(state, action.options)
    case 'advance':
      return advance(state, action.id)
    case 'restock':
      return restock(state, action.part, RESTOCK_BY)
    case 'reset':
      return START
  }
}

const FRAME_NAMES: Record<FrameSize, string> = { S: 'Small', M: 'Medium', L: 'Large' }

function describe(o: Options): string {
  const gears = o.gears === 'single' ? 'single-speed' : '10-speed'
  return `${FRAME_NAMES[o.frame]} frame, ${o.wheels}-inch wheels, ${gears}, ${o.brakes} brakes, ${o.lights ? 'lights' : 'no lights'}`
}

// "2 × Wheel, 29 inch and 1 × Headset"
function listParts(parts: Record<string, number>): string {
  return Object.entries(parts)
    .map(([part, qty]) => `${qty} × ${PART_NAMES[part] ?? part}`)
    .join(' and ')
}

export default function Workshop() {
  // useReducer is like useState, but every change goes through the reducer function.
  const [state, dispatch] = useReducer(reducer, START)
  const [announcement, setAnnouncement] = useState('')

  function onAddOrder(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    // The values can only be ones offered in the selects below, so these casts are safe.
    const options: Options = {
      frame: form.get('frame') as FrameSize,
      wheels: form.get('wheels') as WheelSize,
      gears: form.get('gears') as Gears,
      brakes: form.get('brakes') as Brakes,
      lights: form.get('lights') === 'on',
    }
    dispatch({ type: 'add', options })
    setAnnouncement(`Order ${Math.max(0, ...state.orders.map((o) => o.id)) + 1} added.`)
  }

  return (
    <section className="bike">
      <h1>Bike Workshop</h1>
      <p>
        A bike production line you can run. Take an order, then build it one step at a time. Each step uses
        parts from stock, and a step can&apos;t start until every part it needs is there. My own rebuild of a
        university project idea, written from scratch.
      </p>

      <div className="panel">
        <h2>New order</h2>
        <form className="bike-form" onSubmit={onAddOrder}>
          <label>
            Frame size
            <select name="frame" defaultValue="M">
              <option value="S">Small</option>
              <option value="M">Medium</option>
              <option value="L">Large</option>
            </select>
          </label>
          <label>
            Wheels
            <select name="wheels" defaultValue="29">
              <option value="27.5">27.5 inch</option>
              <option value="29">29 inch</option>
            </select>
          </label>
          <label>
            Gears
            <select name="gears" defaultValue="10-speed">
              <option value="single">Single-speed</option>
              <option value="10-speed">10-speed</option>
            </select>
          </label>
          <label>
            Brakes
            <select name="brakes" defaultValue="disc">
              <option value="rim">Rim</option>
              <option value="disc">Disc</option>
            </select>
          </label>
          <label className="bike-check">
            <input type="checkbox" name="lights" /> Lights
          </label>
          <button type="submit">Add order</button>
        </form>
        {/* Read out by screen readers, since a new order appears further down the page. */}
        <p role="status">{announcement}</p>
      </div>

      <div className="panel">
        <h2>Orders</h2>
        <ul className="bike-orders">
          {state.orders.map((order) => (
            <OrderCard key={order.id} order={order} state={state} dispatch={dispatch} />
          ))}
        </ul>
      </div>

      <div className="panel">
        <h2>Parts stock</h2>
        <table className="bike-table">
          <thead>
            <tr>
              <th scope="col">Part</th>
              <th scope="col">In stock</th>
              <th scope="col">
                <span className="sr-only">Restock</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(state.stock).map(([part, qty]) => (
              <tr key={part}>
                <th scope="row">{PART_NAMES[part] ?? part}</th>
                {/* Low stock is shown in words as well as colour. */}
                <td className={qty <= LOW_STOCK ? 'bike-low' : undefined}>
                  {qty}
                  {qty === 0 ? ' (out)' : qty <= LOW_STOCK ? ' (low)' : ''}
                </td>
                <td>
                  <button
                    type="button"
                    className="bike-small"
                    aria-label={`Add ${RESTOCK_BY} × ${PART_NAMES[part] ?? part}`}
                    onClick={() => dispatch({ type: 'restock', part })}
                  >
                    +{RESTOCK_BY}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="panel">
        <h2>Parts log</h2>
        <p>Every part used, newest first.</p>
        <table className="bike-table">
          <thead>
            <tr>
              <th scope="col">Order</th>
              <th scope="col">Step</th>
              <th scope="col">Part</th>
            </tr>
          </thead>
          <tbody>
            {/* [...log] copies the list first, because reverse() would otherwise change the state itself. */}
            {[...state.log].reverse().map((entry, i) => (
              <tr key={state.log.length - i}>
                <td>{entry.orderId}</td>
                <td>{entry.step}</td>
                <td>
                  {entry.qty} × {PART_NAMES[entry.part] ?? entry.part}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button type="button" onClick={() => dispatch({ type: 'reset' })}>
        Start the demo again
      </button>
    </section>
  )
}

interface CardProps {
  order: Order
  state: State
  dispatch: (action: Action) => void
}

function OrderCard({ order, state, dispatch }: CardProps) {
  const steps = stepsFor(order.options)
  const step = nextStep(order)
  const missing = missingParts(state, order)
  const blocked = Object.keys(missing).length > 0
  const finished = isFinished(order)
  const statusId = `order-${order.id}-status`

  return (
    <li className="bike-order">
      <h3>Order {order.id}</h3>
      <p>{describe(order.options)}</p>
      <progress value={order.done} max={steps.length} aria-labelledby={statusId} />
      {/* aria-live reads changes out, e.g. when a step finishes or a restock unblocks it. */}
      <p id={statusId} aria-live="polite">
        {finished || !step
          ? `Finished: all ${steps.length} steps done.`
          : `Step ${order.done + 1} of ${steps.length}: ${step.name}.`}
        {blocked && (
          <span className="bike-blocked"> Blocked: needs {listParts(missing)}. Restock below.</span>
        )}
      </p>
      {/* The button stays in place when it can't be used, so keyboard focus is never lost. */}
      <button
        type="button"
        aria-disabled={finished || blocked}
        aria-describedby={statusId}
        onClick={() => {
          if (!finished && !blocked) dispatch({ type: 'advance', id: order.id })
        }}
      >
        {finished ? 'Done' : 'Do this step'}
      </button>
    </li>
  )
}
