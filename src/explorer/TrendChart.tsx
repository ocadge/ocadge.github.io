import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { data, trendRows, trendSummary, type Sex } from './data.ts'
import { useDarkMode } from './useDarkMode.ts'

// Okabe-Ito palette: stays distinguishable for the common types of colour blindness.
// The light-theme shades are darker so every line keeps at least 3:1 contrast on white.
const THEMES = {
  dark: {
    grid: '#1f2a38',
    axis: '#8b97a9',
    eu: '#f1f5fa',
    panel: '#0f151e',
    series: ['#E69F00', '#56B4E9', '#009E73', '#F0E442', '#0072B2', '#D55E00', '#CC79A7'],
  },
  light: {
    grid: '#d3dbe6',
    axis: '#536074',
    eu: '#0a0e14',
    panel: '#ffffff',
    series: ['#B26B00', '#0072B2', '#007A5C', '#8A7400', '#1F4E99', '#C2410C', '#A3477F'],
  },
}

// Props are the inputs a component gets from its parent, like function arguments.
// The type lists which props this component accepts.
interface Props {
  sex: Sex
  countries: string[]
}

export default function TrendChart({ sex, countries }: Props) {
  const theme = useDarkMode() ? THEMES.dark : THEMES.light
  const lines = ['EU27_2020', ...countries]
  const rows = trendRows(data, sex, lines)

  return (
    // role="img" with a summary gives screen reader users the chart's content as text.
    <div role="img" aria-label={trendSummary(data, sex, lines)}>
      <ResponsiveContainer width="100%" height={360}>
        <LineChart data={rows} margin={{ top: 8, right: 16, bottom: 0, left: -16 }}>
          <CartesianGrid stroke={theme.grid} />
          <XAxis dataKey="year" stroke={theme.axis} />
          <YAxis domain={['auto', 'auto']} stroke={theme.axis} />
          <Tooltip contentStyle={{ background: theme.panel, border: `1px solid ${theme.grid}` }} />
          <Legend />
          <Line dataKey="EU27_2020" name="EU average" stroke={theme.eu} strokeWidth={3} dot={false} />
          {countries.map((code, i) => (
            <Line
              key={code}
              dataKey={code}
              name={data.countries[code]}
              stroke={theme.series[i % theme.series.length]}
              dot={false}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
