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
