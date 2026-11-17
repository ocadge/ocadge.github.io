import { Fragment } from 'react'
import { colourBand, data, heatmapRows, heatmapSummary } from './data.ts'

// ColorBrewer's YlGnBu scale with 9 classes, the one my report used: light yellow is low, dark blue is high.
// Copied from ColorBrewer's own colorbrewer.js. It's designed to stay readable with colour blindness.
const YLGNBU = [
  '#ffffd9',
  '#edf8b1',
  '#c7e9b4',
  '#7fcdbb',
  '#41b6c4',
  '#1d91c0',
  '#225ea8',
  '#253494',
  '#081d58',
]

export default function Heatmap() {
  const rows = heatmapRows(data, 'T')
  // Every value in the table, without the gaps. `v is number` tells TypeScript the filter removes undefined.
  const values = rows.flatMap((row) => row.values).filter((v): v is number => v !== undefined)
  const min = Math.min(...values)
  const max = Math.max(...values)

  return (
    <div role="img" aria-label={heatmapSummary(data, 'T')}>
      {/* One column for the names, then one equal column per year. minmax(0, 1fr) lets a year label
          spill over its neighbours instead of widening its own column, so it fits a phone without scrolling. */}
      <div
        className="heatmap"
        style={{ gridTemplateColumns: `max-content repeat(${data.years.length}, minmax(0, 1fr))` }}
      >
        <span />
        {data.years.map((year) => (
          // Only every fifth year is labelled, or the labels would overlap on a phone.
          <span key={year} className="heatmap-year">
            {Number(year) % 5 === 0 ? year : ''}
          </span>
        ))}

        {rows.map((row) => (
          // Fragment groups a row's cells without adding an element, so they stay direct children of the grid.
          <Fragment key={row.code}>
            <span className={row.code === 'EU27_2020' ? 'heatmap-name heatmap-eu' : 'heatmap-name'}>
              {row.name}
            </span>
            {row.values.map((value, i) => {
              const year = data.years[i] ?? ''
              const classes = ['heatmap-cell']
              if (value === undefined) classes.push('heatmap-missing')
              if (year === '2020') classes.push('heatmap-2020')
              return (
                <span
                  key={year}
                  className={classes.join(' ')}
                  // A hover label for mouse users; screen readers get the summary above instead.
                  title={`${row.name}, ${year}: ${value === undefined ? 'no data' : `${value} years`}`}
                  style={
                    value === undefined ? undefined : { background: YLGNBU[colourBand(value, min, max, 9)] }
                  }
                />
              )
            })}
          </Fragment>
        ))}
      </div>

      <div className="heatmap-legend">
        <span className="heatmap-scale">
          {min} years
          {YLGNBU.map((colour) => (
            <span key={colour} className="heatmap-swatch" style={{ background: colour }} />
          ))}
          {max} years
        </span>
        <span className="heatmap-scale">
          <span className="heatmap-swatch heatmap-missing" /> No data
        </span>
        <span className="heatmap-scale">
          <span className="heatmap-swatch heatmap-2020" /> 2020, the first pandemic year
        </span>
      </div>
    </div>
  )
}
