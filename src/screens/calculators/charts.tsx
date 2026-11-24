/**
 * Calculator charts drawn with react-native-svg — same shapes and colours as
 * website/src/features/calculators/components/charts.tsx.
 */
import { useState } from 'react'
import { View } from 'react-native'
import Svg, { Circle, Defs, G, Line, LinearGradient, Path, Rect, Stop } from 'react-native-svg'

import { Text } from '@/ui/Text'

export const CHART = { indigo: '#563D96', aura: '#843F96', royal: '#275BA8', cyan: '#3CB4E8', line: '#D9CFE3' } as const

/* ---------- Donut ---------- */

export function Donut({
  segments,
  label,
  centerLabel,
  centerValue,
}: {
  segments: { label: string; value: number; color: string; display: string }[]
  label: string
  centerLabel?: string
  centerValue?: string
}) {
  const total = segments.reduce((s, x) => s + Math.max(0, x.value), 0) || 1
  const r = 42
  const c = 2 * Math.PI * r
  let offset = 0
  return (
    <View accessible accessibilityLabel={`${label}: ${segments.map((s) => `${s.label} ${s.display}`).join(', ')}`} style={{ flexDirection: 'row', alignItems: 'center', gap: 18 }}>
      <View style={{ width: 128, height: 128 }}>
        <Svg width={128} height={128} viewBox="0 0 100 100">
          <G transform="rotate(-90 50 50)">
            <Circle cx={50} cy={50} r={r} fill="none" stroke={CHART.line} strokeWidth={12} />
            {segments.map((s) => {
              const len = (Math.max(0, s.value) / total) * c
              const el = <Circle key={s.label} cx={50} cy={50} r={r} fill="none" stroke={s.color} strokeWidth={12} strokeDasharray={`${len} ${c - len}`} strokeDashoffset={-offset} />
              offset += len
              return el
            })}
          </G>
        </Svg>
        {centerValue ? (
          <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, alignItems: 'center', justifyContent: 'center' }}>
            <Text size={11} color="muted">
              {centerLabel}
            </Text>
            <Text size={13} weight={700} color="plum">
              {centerValue}
            </Text>
          </View>
        ) : null}
      </View>
      <View style={{ flex: 1, gap: 10 }}>
        {segments.map((s) => (
          <View key={s.label} style={{ flexDirection: 'row', gap: 8 }}>
            <View style={{ width: 10, height: 10, borderRadius: 3, backgroundColor: s.color, marginTop: 4 }} />
            <Text size={13} color="ink" style={{ flex: 1 }}>
              {s.label}{' '}
              <Text size={13} weight={600} color="plum">
                {s.display}
              </Text>
              <Text size={13} color="muted"> · {Math.round((Math.max(0, s.value) / total) * 100)}%</Text>
            </Text>
          </View>
        ))}
      </View>
    </View>
  )
}

/* ---------- Horizontal bars ---------- */

export function Bar({ value, max, color, height = 8 }: { value: number; max: number; color: string; height?: number }) {
  const w = Math.max(0, Math.min(100, (Math.abs(value) / (max || 1)) * 100))
  return (
    <Svg width="100%" height={height}>
      <Rect x={0} y={0} width="100%" height={height} rx={height / 2} fill={CHART.line} fillOpacity={0.55} />
      {w > 0 ? <Rect x={0} y={0} width={`${Math.max(w, 1.5)}%`} height={height} rx={height / 2} fill={color} /> : null}
    </Svg>
  )
}

export function BarRows({ rows, label, max }: { rows: { key: string; label: string; value: number; display: string; color: string }[]; label: string; max?: number }) {
  const top = max ?? Math.max(1, ...rows.map((r) => Math.abs(r.value)))
  return (
    <View accessible accessibilityLabel={`${label}: ${rows.map((r) => `${r.label} ${r.display}`).join(', ')}`} style={{ gap: 12 }}>
      {rows.map((r) => (
        <View key={r.key}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 12, marginBottom: 4 }}>
            <Text size={13} color="ink" style={{ flex: 1, opacity: 0.85 }}>
              {r.label}
            </Text>
            <Text size={13} weight={600} color="plum" style={{ fontVariant: ['tabular-nums'] }}>
              {r.display}
            </Text>
          </View>
          <Bar value={r.value} max={top} color={r.color} />
        </View>
      ))}
    </View>
  )
}

/* ---------- Two-line chart over years ---------- */

export function LineChart({
  series,
  xLabels,
  label,
  marker,
}: {
  series: { key: string; label: string; color: string; values: number[]; display: string }[]
  xLabels: string[]
  label: string
  marker?: number | null
}) {
  const [w, setW] = useState(0)
  const h = 150
  const pad = 6
  const all = series.flatMap((s) => s.values)
  const minV = Math.min(0, ...all)
  const maxV = Math.max(1, ...all)
  const n = Math.max(2, xLabels.length)
  const iw = Math.max(1, w - pad * 2)
  const x = (i: number) => pad + (i / (n - 1)) * iw
  const y = (v: number) => pad + (h - ((v - minV) / (maxV - minV || 1)) * h)
  const path = (vals: number[]) => vals.map((v, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(' ')
  const ticks = xLabels.length <= 6 ? xLabels : xLabels.filter((_, i) => i === 0 || i === xLabels.length - 1 || i % Math.ceil(xLabels.length / 5) === 0)

  return (
    <View accessible accessibilityLabel={`${label}. ${series.map((s) => `${s.label} ${s.display}`).join(', ')}`}>
      <View style={{ height: h + pad * 2 }} onLayout={(e) => setW(e.nativeEvent.layout.width)}>
        {w > 0 ? (
          <Svg width={w} height={h + pad * 2}>
            <Defs>
              <LinearGradient id="rvb-fill" x1="0" y1="0" x2="0" y2="1">
                <Stop offset="0" stopColor={series[0]?.color ?? CHART.indigo} stopOpacity={0.18} />
                <Stop offset="1" stopColor={series[0]?.color ?? CHART.indigo} stopOpacity={0} />
              </LinearGradient>
            </Defs>
            {[0, 0.5, 1].map((t) => (
              <Line key={t} x1={pad} x2={w - pad} y1={pad + h * t} y2={pad + h * t} stroke={CHART.line} strokeDasharray="3 4" strokeWidth={1} />
            ))}
            {minV < 0 ? <Line x1={pad} x2={w - pad} y1={y(0)} y2={y(0)} stroke={CHART.line} strokeWidth={1.5} /> : null}
            {series[0] ? <Path d={`${path(series[0].values)} L${x(series[0].values.length - 1)},${pad + h} L${pad},${pad + h} Z`} fill="url(#rvb-fill)" /> : null}
            {marker != null && marker >= 0 ? <Line x1={x(marker)} x2={x(marker)} y1={pad} y2={pad + h} stroke={CHART.aura} strokeDasharray="4 4" strokeWidth={1.5} /> : null}
            {series.map((s) => (
              <G key={s.key}>
                <Path d={path(s.values)} fill="none" stroke={s.color} strokeWidth={2.5} strokeLinejoin="round" strokeLinecap="round" />
                {s.values.length > 0 ? <Circle cx={x(s.values.length - 1)} cy={y(s.values[s.values.length - 1])} r={4.5} fill="#fff" stroke={s.color} strokeWidth={2.5} /> : null}
              </G>
            ))}
          </Svg>
        ) : null}
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 6 }}>
        {ticks.map((t) => (
          <Text key={t} size={11} color="muted">
            {t}
          </Text>
        ))}
      </View>
      <View style={{ marginTop: 12, gap: 6 }}>
        {series.map((s) => (
          <View key={s.key} style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <View style={{ width: 16, height: 4, borderRadius: 2, backgroundColor: s.color }} />
            <Text size={13} color="ink">
              {s.label}{' '}
              <Text size={13} weight={600} color="plum">
                {s.display}
              </Text>
            </Text>
          </View>
        ))}
      </View>
    </View>
  )
}
