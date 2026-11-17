import { Fragment } from 'react'
import { data, recoveryRows, recoverySummary } from './data.ts'

const FROM = '2019'
const TO = data.years.at(-1) ?? ''

export default function RecoveryChart() {
  const rows = recoveryRows(data, 'T', FROM, TO)
  const values = rows.flatMap((row) => [row.before, row.after])
  // Round outwards to whole years, so the axis starts and ends on a round number.
  const min = Math.floor(Math.min(...values))
  const max = Math.ceil(Math.max(...values))
  // How far along the axis a value sits, as a CSS percentage.
  const at = (value: number) => `${((value - min) / (max - min)) * 100}%`
  const ticks: number[] = []
  for (let tick = min; tick <= max; tick += 2) ticks.push(tick)

  return (
    <div role="img" aria-label={recoverySummary(data, 'T', FROM, TO)}>
      {/* Three columns: name, the dumbbell track, and the change printed as a number. */}
      <div className="recovery">
        {rows.map((row) => (
          <Fragment key={row.code}>
            <span className={row.code === 'EU27_2020' ? 'recovery-name heatmap-eu' : 'recovery-name'}>
              {row.name}
            </span>
            <span
              className={`recovery-track ${row.recovered ? 'recovery-up' : 'recovery-down'}`}
              title={`${row.name}: ${row.before} years in ${FROM}, ${row.after} in ${TO}`}
            >
              <span
                className="recovery-line"
                style={{
                  left: at(Math.min(row.before, row.after)),
                  width: `${(Math.abs(row.after - row.before) / (max - min)) * 100}%`,
                }}
              />
              {/* The 2019 ring is bigger than the latest dot, so both show when they sit on the same spot. */}
              <span className="recovery-before" style={{ left: at(row.before) }} />
              <span className="recovery-after" style={{ left: at(row.after) }} />
            </span>
            {/* The number says the same as the colour, so the chart doesn't rely on colour alone. */}
            <span className="recovery-change">
              {row.change > 0 ? '+' : ''}
              {row.change}
            </span>
          </Fragment>
        ))}

        <span />
        <span className="recovery-axis">
          {ticks.map((tick) => (
            <span key={tick} style={{ left: at(tick) }}>
              {tick}
            </span>
          ))}
        </span>
        <span />
      </div>

      <div className="heatmap-legend">
        <span className="heatmap-scale">
          <span className="recovery-key recovery-before" /> {FROM}
        </span>
        <span className="heatmap-scale recovery-up">
          <span className="recovery-key recovery-after" /> {TO}, back to {FROM} level or above
        </span>
        <span className="heatmap-scale recovery-down">
          <span className="recovery-key recovery-after" /> {TO}, still below
        </span>
      </div>
    </div>
  )
}
