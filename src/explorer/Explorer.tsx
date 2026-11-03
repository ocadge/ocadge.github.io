import { useState } from 'react'
import { data, type Sex } from './data.ts'
import TrendChart from './TrendChart.tsx'

const SEXES: Record<Sex, string> = { T: 'Total', M: 'Male', F: 'Female' }

export default function Explorer() {
  // useState keeps a value between renders. Calling setSex(...) changes it and React redraws the page.
  // <Sex> tells TypeScript the state can only ever be 'T', 'M' or 'F'.
  const [sex, setSex] = useState<Sex>('T')
  const [selected, setSelected] = useState<string[]>(['ES', 'BG', 'DE'])

  function toggleCountry(code: string) {
    setSelected(selected.includes(code) ? selected.filter((c) => c !== code) : [...selected, code])
  }

  return (
    <section>
      <h1>EU Life Expectancy Explorer</h1>
      <p>
        Life expectancy at birth, {data.years[0]} to {data.years.at(-1)}. {data.source}.
      </p>

      <div className="controls" role="group" aria-label="Sex">
        {(Object.keys(SEXES) as Sex[]).map((code) => (
          <button key={code} aria-pressed={sex === code} onClick={() => setSex(code)}>
            {SEXES[code]}
          </button>
        ))}
      </div>

      <div className="panel">
        <h2>Trend over time</h2>
        <TrendChart sex={sex} countries={selected} />
        <div className="controls" role="group" aria-label="Countries">
          {Object.entries(data.countries)
            .filter(([code]) => code !== 'EU27_2020')
            .map(([code, name]) => (
              <button key={code} aria-pressed={selected.includes(code)} onClick={() => toggleCountry(code)}>
                {name}
              </button>
            ))}
        </div>
      </div>

      {/* Your turn: replace these with GenderGapChart, Heatmap and RecoveryChart components. */}
      <div className="panel">
        <h2>Gender gap</h2>
        <p>To build.</p>
      </div>
      <div className="panel">
        <h2>Country by year heatmap</h2>
        <p>To build.</p>
      </div>
      <div className="panel">
        <h2>2019 vs latest year</h2>
        <p>To build.</p>
      </div>
    </section>
  )
}
