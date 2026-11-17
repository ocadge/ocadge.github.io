import { Bar, BarChart, CartesianGrid, LabelList, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { data, gapSummary, genderGapRows, type GapRow } from './data.ts'
import { token, useDarkMode } from './useDarkMode.ts'

// The newest year in the saved data. `?? ''` covers an empty list, which TypeScript can't rule out.
const YEAR = data.years.at(-1) ?? ''
const EU = 'EU27_2020'

// What Recharts passes to a custom bar shape: where the bar would be drawn, and its data row.
interface ShapeProps {
  x?: number
  y?: number
  width?: number
  height?: number
  payload?: GapRow
  colours: { bar: string; eu: string }
}

// Draws one lollipop: a thin line from zero to the value, with a dot at the end.
// Length from a shared zero is easy to compare by eye, which is why my report used this chart.
function Lollipop({ x = 0, y = 0, width = 0, height = 0, payload, colours }: ShapeProps) {
  const colour = payload?.code === EU ? colours.eu : colours.bar
  const middle = y + height / 2
  return (
    <g>
      <line x1={x} x2={x + width} y1={middle} y2={middle} stroke={colour} strokeWidth={2} />
      <circle cx={x + width} cy={middle} r={5} fill={colour} />
    </g>
  )
}

export default function GenderGapChart() {
  const dark = useDarkMode()
  const theme = {
    grid: token('--border'),
    axis: token('--muted'),
    panel: token('--panel'),
    text: token('--text'),
    // Same blue as the trend chart's second series; the EU average stands out like its EU line.
    colours: { bar: dark ? '#56B4E9' : '#0072B2', eu: token('--heading') },
  }
  const rows = genderGapRows(data, YEAR)

  return (
    <div role="img" aria-label={gapSummary(data, YEAR)}>
      {/* About 24px per country, plus room for the axis. */}
      <ResponsiveContainer width="100%" height={rows.length * 24 + 40}>
        <BarChart data={rows} layout="vertical" margin={{ top: 8, right: 32, bottom: 0, left: 0 }}>
          <CartesianGrid stroke={theme.grid} horizontal={false} />
          <XAxis type="number" domain={[0, 'auto']} stroke={theme.axis} />
          {/* interval={0} shows every country name instead of skipping some. */}
          <YAxis type="category" dataKey="name" width={110} interval={0} stroke={theme.axis} />
          <Tooltip
            cursor={{ fill: theme.grid }}
            contentStyle={{ background: theme.panel, border: `1px solid ${theme.grid}` }}
            // Without this the value line is black, because the custom lollipop shape has no single fill colour.
            itemStyle={{ color: theme.text }}
          />
          <Bar dataKey="gap" name="Years women outlive men" shape={<Lollipop colours={theme.colours} />}>
            {/* Prints each value beside its dot, so it can be read without hovering. */}
            <LabelList dataKey="gap" position="right" offset={10} fill={theme.axis} fontSize={12} />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
