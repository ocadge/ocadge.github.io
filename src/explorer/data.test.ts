import { describe, expect, it } from 'vitest'
import { data, gapSummary, genderGapRows, trendRows, trendSummary, type LifeData } from './data.ts'

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

// Made-up numbers. 'XX' has no male value, so it should be left out.
const gapSample: LifeData = {
  source: 'test',
  years: ['2024'],
  countries: { DE: 'Germany', LT: 'Lithuania', XX: 'Nowhere' },
  values: {
    T: {},
    M: { DE: { '2024': 78.9 }, LT: { '2024': 73 } },
    F: { DE: { '2024': 83.6 }, LT: { '2024': 81.6 }, XX: { '2024': 80 } },
  },
}

describe('genderGapRows', () => {
  it('works out women minus men, rounded, largest gap first, skipping missing data', () => {
    expect(genderGapRows(gapSample, '2024')).toEqual([
      { code: 'LT', name: 'Lithuania', gap: 8.6 },
      { code: 'DE', name: 'Germany', gap: 4.7 },
    ])
  })
})

describe('gapSummary', () => {
  it('names the largest and smallest gaps', () => {
    expect(gapSummary(gapSample, '2024')).toBe(
      'Years women are expected to outlive men in 2024, for 2 countries. Largest gap: Lithuania, 8.6 years. Smallest: Germany, 4.7 years.',
    )
  })

  it('adds the EU average without counting it as a country', () => {
    const summary = gapSummary(data, '2024')
    expect(summary).toContain('for 27 countries')
    expect(summary).toMatch(/EU average: [\d.]+ years\.$/)
  })

  it('says when there is no data for the year', () => {
    expect(gapSummary(gapSample, '1999')).toBe('No gender gap data for 1999.')
  })
})
