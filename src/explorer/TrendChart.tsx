import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { data, trendRows, type Sex } from './data.ts'

// Okabe-Ito palette: stays distinguishable for the common types of colour blindness.
const COLOURS = ['#E69F00', '#56B4E9', '#009E73', '#F0E442', '#0072B2', '#D55E00', '#CC79A7']

// Props are the inputs a component gets from its parent, like function arguments.
// The type lists which props this component accepts.
interface Props {
  sex: Sex
  countries: string[]
}

export default function TrendChart({ sex, countries }: Props) {
  const rows = trendRows(data, sex, ['EU27_2020', ...countries])

  return (
    <ResponsiveContainer width="100%" height={360}>
      <LineChart data={rows} margin={{ top: 8, right: 16, bottom: 0, left: -16 }}>
        <CartesianGrid stroke="#1f2a38" />
        <XAxis dataKey="year" stroke="#a9b4c4" />
        <YAxis domain={['auto', 'auto']} stroke="#a9b4c4" />
        <Tooltip contentStyle={{ background: '#0f151e', border: '1px solid #1f2a38' }} />
        <Legend />
        <Line dataKey="EU27_2020" name="EU average" stroke="#f1f5fa" strokeWidth={3} dot={false} />
        {countries.map((code, i) => (
          <Line
            key={code}
            dataKey={code}
            name={data.countries[code]}
            stroke={COLOURS[i % COLOURS.length]}
            dot={false}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  )
}
