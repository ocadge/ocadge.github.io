import json from '../data/life_expectancy.json'

// A type describes the shape of some data, so TypeScript can catch typos and missing fields.
// 'T' is total, 'M' male, 'F' female (Eurostat's codes).
export type Sex = 'T' | 'M' | 'F'

export interface LifeData {
  source: string
  years: string[]
  countries: Record<string, string>
  // values[sex][countryCode][year] = life expectancy in years
  values: Record<Sex, Record<string, Record<string, number>>>
}

export const data = json as LifeData

export type TrendRow = { year: string } & Record<string, number | string | undefined>

// Recharts wants one object per x-axis point: { year: '2020', EU27_2020: 80.3, DE: 81.1, ... }
export function trendRows(d: LifeData, sex: Sex, countries: string[]): TrendRow[] {
  return d.years.map((year) => {
    const row: TrendRow = { year }
    for (const code of countries) row[code] = d.values[sex][code]?.[year]
    return row
  })
}

const SEX_WORDS: Record<Sex, string> = { T: 'Total', M: 'Male', F: 'Female' }

// A text version of the trend chart for screen readers: what it shows and each line's latest value.
export function trendSummary(d: LifeData, sex: Sex, countries: string[]): string {
  const latest = countries.map((code) => {
    const year = [...d.years].reverse().find((y) => d.values[sex][code]?.[y] !== undefined)
    const name = d.countries[code] ?? code
    return year ? `${name} ${d.values[sex][code]?.[year]} years (${year})` : `${name} no data`
  })
  return `${SEX_WORDS[sex]} life expectancy at birth, ${d.years[0]} to ${d.years.at(-1)}. Latest values: ${latest.join(', ')}.`
}

// One lollipop in the gender gap chart.
export interface GapRow {
  code: string
  name: string
  // How many more years women are expected to live than men.
  gap: number
}

// Female minus male life expectancy for each country in `year`, largest gap first.
// Countries missing either value are left out rather than shown as zero.
export function genderGapRows(d: LifeData, year: string): GapRow[] {
  const rows: GapRow[] = []
  for (const code of Object.keys(d.countries)) {
    const female = d.values.F[code]?.[year]
    const male = d.values.M[code]?.[year]
    if (female === undefined || male === undefined) continue
    // Round to 1 decimal place: 81.6 - 73 is 8.599999999999994 in floating point.
    rows.push({ code, name: d.countries[code] ?? code, gap: Math.round((female - male) * 10) / 10 })
  }
  return rows.sort((a, b) => b.gap - a.gap)
}

// A text version of the gender gap chart for screen readers: the largest, smallest and EU gaps.
export function gapSummary(d: LifeData, year: string): string {
  const rows = genderGapRows(d, year)
  const largest = rows[0]
  const smallest = rows.at(-1)
  if (!largest || !smallest) return `No gender gap data for ${year}.`
  const eu = rows.find((row) => row.code === 'EU27_2020')
  const countries = rows.filter((row) => row.code !== 'EU27_2020').length
  const euText = eu ? ` EU average: ${eu.gap} years.` : ''
  return `Years women are expected to outlive men in ${year}, for ${countries} countries. Largest gap: ${largest.name}, ${largest.gap} years. Smallest: ${smallest.name}, ${smallest.gap} years.${euText}`
}

// One row of the heatmap: a country and its value for every year (undefined where Eurostat has none).
export interface HeatRow {
  code: string
  name: string
  values: (number | undefined)[]
}

// Every country's values in year order, sorted by the latest year (highest first), as in my report.
export function heatmapRows(d: LifeData, sex: Sex): HeatRow[] {
  const latest = d.years.at(-1) ?? ''
  const rows = Object.entries(d.countries).map(([code, name]) => ({
    code,
    name,
    values: d.years.map((year) => d.values[sex][code]?.[year]),
  }))
  // A country with no latest value sorts last (-Infinity is below every number).
  const last = (row: HeatRow) => d.values[sex][row.code]?.[latest] ?? -Infinity
  return rows.sort((a, b) => last(b) - last(a))
}

// Which of `steps` colour bands a value falls in: 0 for the lowest band, steps - 1 for the highest.
export function colourBand(value: number, min: number, max: number, steps: number): number {
  if (max === min) return 0
  const band = Math.floor(((value - min) / (max - min)) * steps)
  // The maximum itself would land one past the end, so clamp it into the top band.
  return Math.min(steps - 1, Math.max(0, band))
}

// A text version of the heatmap for screen readers: the latest highest and lowest, and the 2020 drop.
export function heatmapSummary(d: LifeData, sex: Sex): string {
  const latest = d.years.at(-1) ?? ''
  const value = (code: string, year: string) => d.values[sex][code]?.[year]
  const intro = `${SEX_WORDS[sex]} life expectancy at birth by country, ${d.years[0]} to ${latest}. Darker colours are higher.`

  // Real countries only: the EU average isn't counted as one.
  const countries = Object.keys(d.countries).filter((code) => code !== 'EU27_2020')
  const ranked = countries
    .flatMap((code) => {
      const v = value(code, latest)
      return v === undefined ? [] : [{ name: d.countries[code] ?? code, v }]
    })
    .sort((a, b) => b.v - a.v)
  const highest = ranked[0]
  const lowest = ranked.at(-1)
  if (!highest || !lowest) return intro

  // Only countries with both years can be compared.
  let compared = 0
  let fell = 0
  for (const code of countries) {
    const before = value(code, '2019')
    const after = value(code, '2020')
    if (before === undefined || after === undefined) continue
    compared++
    if (after < before) fell++
  }
  return `${intro} Highest in ${latest}: ${highest.name}, ${highest.v} years. Lowest: ${lowest.name}, ${lowest.v} years. ${fell} of ${compared} countries fell in 2020 compared with 2019.`
}
