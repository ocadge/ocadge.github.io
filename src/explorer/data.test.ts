import { describe, expect, it } from 'vitest'
import {
  colourBand,
  data,
  gapSummary,
  genderGapRows,
  heatmapRows,
  heatmapSummary,
  recoveryRows,
  recoverySummary,
  trendRows,
  trendSummary,
  type LifeData,
} from './data.ts'

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

// Made-up numbers with the awkward cases built in: an EU row that mustn't count as a country,
// Croatia missing 2019, and Latvia missing the latest year.
const heatSample: LifeData = {
  source: 'test',
  years: ['2019', '2020', '2021'],
  countries: { EU27_2020: 'EU average', ES: 'Spain', BG: 'Bulgaria', HR: 'Croatia', LV: 'Latvia' },
  values: {
    T: {
      EU27_2020: { '2019': 81.3, '2020': 80.4, '2021': 80.1 },
      ES: { '2019': 84, '2020': 82.4, '2021': 83.3 },
      BG: { '2019': 75.1, '2020': 73.6, '2021': 71.4 },
      HR: { '2020': 77.8, '2021': 76.7 },
      LV: { '2019': 75.5 },
    },
    M: {},
    F: {},
  },
}

describe('heatmapRows', () => {
  it('lines up each country with the years, sorted by the latest value, missing latest last', () => {
    const rows = heatmapRows(heatSample, 'T')
    expect(rows.map((row) => row.code)).toEqual(['ES', 'EU27_2020', 'HR', 'BG', 'LV'])
    expect(rows[2]).toEqual({ code: 'HR', name: 'Croatia', values: [undefined, 77.8, 76.7] })
  })
})

describe('colourBand', () => {
  it('puts the lowest value in band 0 and the highest in the top band', () => {
    expect(colourBand(70, 70, 80, 9)).toBe(0)
    expect(colourBand(80, 70, 80, 9)).toBe(8)
    expect(colourBand(75, 70, 80, 9)).toBe(4)
  })

  it('copes with a range of zero', () => {
    expect(colourBand(70, 70, 70, 9)).toBe(0)
  })
})

describe('heatmapSummary', () => {
  it('names the highest and lowest, and counts 2020 falls without the EU or incomplete countries', () => {
    expect(heatmapSummary(heatSample, 'T')).toBe(
      'Total life expectancy at birth by country, 2019 to 2021. Darker colours are higher. Highest in 2021: Spain, 83.3 years. Lowest: Bulgaria, 71.4 years. 2 of 2 countries fell in 2020 compared with 2019.',
    )
  })
})

// Made-up numbers covering a gain, no change (counts as recovered), a fall, an EU row that
// mustn't count as a country, and Poland missing the latest year.
const recoverySample: LifeData = {
  source: 'test',
  years: ['2019', '2024'],
  countries: { EU27_2020: 'EU average', ES: 'Spain', DE: 'Germany', NL: 'Netherlands', PL: 'Poland' },
  values: {
    T: {
      EU27_2020: { '2019': 81.1, '2024': 81.5 },
      ES: { '2019': 83.5, '2024': 84 },
      DE: { '2019': 81.2, '2024': 81.2 },
      NL: { '2019': 82.1, '2024': 81.9 },
      PL: { '2019': 77.9 },
    },
    M: {},
    F: {},
  },
}

describe('recoveryRows', () => {
  it('pairs 2019 with the latest year, highest first, and marks zero change as recovered', () => {
    expect(recoveryRows(recoverySample, 'T', '2019', '2024')).toEqual([
      { code: 'ES', name: 'Spain', before: 83.5, after: 84, change: 0.5, recovered: true },
      { code: 'NL', name: 'Netherlands', before: 82.1, after: 81.9, change: -0.2, recovered: false },
      { code: 'EU27_2020', name: 'EU average', before: 81.1, after: 81.5, change: 0.4, recovered: true },
      { code: 'DE', name: 'Germany', before: 81.2, after: 81.2, change: 0, recovered: true },
    ])
  })
})

describe('recoverySummary', () => {
  it('counts countries without the EU, and names the ones still below', () => {
    expect(recoverySummary(recoverySample, 'T', '2019', '2024')).toBe(
      'Total life expectancy at birth, 2019 compared with 2024. 2 of 3 countries are back to or above their 2019 level. Still below: Netherlands, down 0.2 years. EU average: 81.1 to 81.5 years.',
    )
  })
})
