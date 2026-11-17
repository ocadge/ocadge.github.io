import { useState } from 'react'
import { data, type Sex } from './data.ts'
import GenderGapChart from './GenderGapChart.tsx'
import Heatmap from './Heatmap.tsx'
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

      <div className="panel">
        <h2>Trend over time</h2>
        {/* Inside this panel because only the trend chart can switch between sexes. */}
        <div className="controls" role="group" aria-label="Sex">
          {(Object.keys(SEXES) as Sex[]).map((code) => (
            <button key={code} aria-pressed={sex === code} onClick={() => setSex(code)}>
              {SEXES[code]}
            </button>
          ))}
        </div>
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

      <div className="panel">
        <h2>Gender gap, {data.years.at(-1)}</h2>
        <p>How many more years women are expected to live than men, largest gap first.</p>
        <GenderGapChart />
      </div>

      <div className="panel">
        <h2>Every country, every year</h2>
        <p>
          Total life expectancy, one row per country, sorted by the latest year. On a computer, hover over a
          square to see its value.
        </p>
        <Heatmap />
      </div>

      {/* Still to build: the recovery chart. Remove this line once it's in. */}
      <p>Coming next: 2019 compared with the latest year.</p>
    </section>
  )
}
