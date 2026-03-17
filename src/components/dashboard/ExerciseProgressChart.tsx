import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid,
} from 'recharts'
import { type ExerciseHistoryEntry } from '@/store/selectors'
import { useAppStore } from '@/hooks/useAppStore'
import { WeightUnit } from '@/types'

interface Props {
  entries: ExerciseHistoryEntry[]
}

export function ExerciseProgressChart({ entries }: Props) {
  const { state } = useAppStore()
  const useLbs = state.settings.weightUnit === WeightUnit.LBS

  if (entries.length < 2) {
    return (
      <div className="flex items-center justify-center h-48 text-sm text-notion-text-secondary">
        {entries.length === 0
          ? 'No data yet — log some sets to see progress'
          : 'Log at least 2 sessions to see the chart'}
      </div>
    )
  }

  const data = entries.map(e => ({
    date: e.date.slice(5), // MM-DD
    weight: useLbs
      ? Math.round(e.maxWeightLbs * 10) / 10
      : Math.round(e.maxWeightKg * 10) / 10,
  }))

  const unit = useLbs ? 'lbs' : 'kg'

  return (
    <ResponsiveContainer width="100%" height={200}>
      <LineChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: -10 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e9e9e7" />
        <XAxis
          dataKey="date"
          tick={{ fontSize: 11, fill: '#9b9a97' }}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          tick={{ fontSize: 11, fill: '#9b9a97' }}
          tickLine={false}
          axisLine={false}
          unit={` ${unit}`}
          width={50}
        />
        <Tooltip
          contentStyle={{
            background: '#fff',
            border: '1px solid #e9e9e7',
            borderRadius: '8px',
            fontSize: '13px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
          }}
          formatter={(val) => [`${val} ${unit}`, 'Top weight']}
        />
        <Line
          type="monotone"
          dataKey="weight"
          stroke="#2f80ed"
          strokeWidth={2}
          dot={{ r: 3, fill: '#2f80ed', strokeWidth: 0 }}
          activeDot={{ r: 5 }}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
