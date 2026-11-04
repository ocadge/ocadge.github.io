import { describe, expect, it } from 'vitest'
import { data, trendRows, trendSummary, type LifeData } from './data.ts'

const sample: LifeData = {
  source: 'test',
  years: ['2019', '2020'],
  countries: { DE: 'Germany', FR: 'France' },
  values: { T: { DE: { '2019': 81.3, '2020': 81.1 }, FR: { '2019': 82.9 } }, M: {}, F: {} },
}

describe('trendRows', () => {
  it('makes one row per year with a value per country', () => {
    expect(trendRows(sample, 'T', ['DE', 'FR'])).toEqual([
      { year: '2019', DE: 81.3, FR: 82.9 },
      { year: '2020', DE: 81.1, FR: undefined },
    ])
  })

  it('leaves a gap for a country with no data', () => {
    expect(trendRows(sample, 'M', ['DE'])).toEqual([
      { year: '2019', DE: undefined },
      { year: '2020', DE: undefined },
    ])
  })
})

describe('trendSummary', () => {
  it('names each line with its latest value, skipping missing years', () => {
    expect(trendSummary(sample, 'T', ['DE', 'FR'])).toBe(
      'Total life expectancy at birth, 2019 to 2020. Latest values: Germany 81.1 years (2020), France 82.9 years (2019).',
    )
  })

  it('says when a country has no data', () => {
    expect(trendSummary(sample, 'M', ['DE'])).toBe(
      'Male life expectancy at birth, 2019 to 2020. Latest values: Germany no data.',
    )
  })
})

describe('saved Eurostat data', () => {
  it('has every country for all three sexes', () => {
    for (const sex of ['T', 'M', 'F'] as const) {
      expect(Object.keys(data.values[sex]).sort()).toEqual(Object.keys(data.countries).sort())
    }
  })
})
