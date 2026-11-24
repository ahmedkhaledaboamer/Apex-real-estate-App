import { Info, Minus, Plus, RotateCcw } from 'lucide-react-native'
import { useState } from 'react'
import { Pressable, StyleSheet, TextInput, View, type StyleProp, type ViewStyle } from 'react-native'

import { formatNumber } from '@/lib/format'
import { colors, fonts, radius, shadow } from '@/theme'
import { Chip } from '@/ui/primitives'
import { Heading, Text } from '@/ui/Text'

/* ------------------------------------------------------------------ */
/*  Calculator shell: inputs card on top, results panel underneath     */
/*  (site: CalculatorShell — two columns on desktop, stacked here)     */
/* ------------------------------------------------------------------ */

export function CalculatorShell({
  title,
  onReset,
  inputs,
  results,
  style,
}: {
  title: string
  onReset: () => void
  inputs: React.ReactNode
  results: React.ReactNode
  style?: StyleProp<ViewStyle>
}) {
  return (
    <View style={[styles.shell, style]}>
      <View style={{ padding: 20 }}>
        <View style={styles.shellHead}>
          <Heading size={28} style={{ flex: 1 }}>
            {title}
          </Heading>
          <Pressable accessibilityRole="button" accessibilityLabel={`Reset ${title}`} onPress={onReset} hitSlop={6} style={({ pressed }) => [styles.reset, pressed && { backgroundColor: colors.mist }]}>
            <RotateCcw size={14} color={colors.aura} />
            <Text size={13.5} weight={600} color="aura">
              Reset
            </Text>
          </Pressable>
        </View>
        <View style={{ gap: 14 }}>{inputs}</View>
      </View>
      <View style={styles.results}>{results}</View>
    </View>
  )
}

/** Big result figure (site: ResultHeadline). Polite live region so screen readers hear updates. */
export function ResultHeadline({ label, value, sub, size = 34, valueColor = 'plum' }: { label: string; value: string; sub?: string; size?: number; valueColor?: 'plum' | 'aura' }) {
  return (
    <View accessibilityLiveRegion="polite" style={{ flex: 1 }}>
      <Text size={13} weight={600} color="aura">
        {label}
      </Text>
      <Text size={size} weight={700} color={valueColor} lineHeight={Math.round(size * 1.2)} style={{ marginTop: 2 }}>
        {value}
      </Text>
      {sub ? (
        <Text size={13} color="muted" style={{ marginTop: 2 }}>
          {sub}
        </Text>
      ) : null}
    </View>
  )
}

export type BreakdownRow = { label: string; value: string; strong?: boolean; note?: string }

/** Key / value rows with hairlines (site: Breakdown). */
export function Breakdown({ rows, style }: { rows: BreakdownRow[]; style?: StyleProp<ViewStyle> }) {
  return (
    <View style={[styles.breakdown, style]}>
      {rows.map((r, i) => (
        <View key={`${r.label}-${i}`} style={[styles.bdRow, i > 0 && styles.bdDivider]}>
          <View style={{ flex: 1 }}>
            <Text size={14} weight={r.strong ? 600 : 400} color={r.strong ? 'plum' : 'ink'} style={!r.strong ? { opacity: 0.85 } : undefined}>
              {r.label}
            </Text>
            {r.note ? (
              <Text size={12} color="muted">
                {r.note}
              </Text>
            ) : null}
          </View>
          <Text size={14.5} weight={r.strong ? 700 : 600} color={r.strong ? 'plum' : 'ink'} align="right" style={{ fontVariant: ['tabular-nums'] }}>
            {r.value}
          </Text>
        </View>
      ))}
    </View>
  )
}

/** "Indicative only" line under a calculator (site: Disclaimer). */
export function Disclaimer({ children, light, style }: { children: React.ReactNode; light?: boolean; style?: StyleProp<ViewStyle> }) {
  return (
    <View style={[{ flexDirection: 'row', gap: 8 }, style]}>
      <Info size={14} color={light ? colors.white : colors.muted} style={{ marginTop: 2 }} />
      <Text size={12} color={light ? 'white' : 'muted'} lineHeight={18} style={[{ flex: 1 }, light && { opacity: 0.7 }]}>
        {children}
      </Text>
    </View>
  )
}

export function GroupTitle({ children }: { children: string }) {
  return (
    <Text size={13} weight={600} color="plum" style={{ marginTop: 4 }}>
      {children}
    </Text>
  )
}

export function ResultLabel({ children }: { children: string }) {
  return (
    <Text size={13} weight={600} color="aura" style={{ marginBottom: 8 }}>
      {children}
    </Text>
  )
}

/* ------------------------------------------------------------------ */
/*  Numeric field: AED prefix / % suffix, live formatting, +/- steps   */
/* ------------------------------------------------------------------ */

const parse = (s: string) => Number(s.replace(/[^0-9.-]/g, ''))

export function NumberField({
  label,
  value,
  onChange,
  min,
  max,
  step = 1,
  prefix,
  suffix,
  hint,
  hintStrong,
  decimals = 0,
  presets,
  style,
}: {
  label: string
  value: number
  onChange: (n: number) => void
  min: number
  /** Highest value accepted (typed or stepped). */
  max: number
  step?: number
  prefix?: string
  suffix?: string
  hint?: string
  /** Optional highlighted part of the hint (e.g. a warning). */
  hintStrong?: string
  decimals?: number
  /** Quick-pick values shown as chips under the field. */
  presets?: { value: number; label: string }[]
  style?: StyleProp<ViewStyle>
}) {
  const [draft, setDraft] = useState<string | null>(null)
  const [focused, setFocused] = useState(false)
  const fmt = (n: number) => (decimals ? String(Number(n.toFixed(decimals))) : formatNumber(Math.round(n)))
  const shown = draft ?? fmt(value)
  const clampV = (n: number) => Math.min(max, Math.max(min, n))
  const bump = (dir: 1 | -1) => {
    const next = clampV(Math.round((value + dir * step) / step) * step)
    onChange(Number(next.toFixed(Math.max(decimals, 2))))
    setDraft(null)
  }

  return (
    <View style={style}>
      <View style={[styles.box, { borderColor: focused ? colors.aura : colors.line }, focused && shadow.soft]}>
        <Text size={11.5} weight={600} color="muted">
          {label}
        </Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          {prefix ? (
            <Text size={14} weight={600} color="muted">
              {prefix}
            </Text>
          ) : null}
          <TextInput
            accessibilityLabel={label}
            value={shown}
            keyboardType={decimals ? 'decimal-pad' : 'numeric'}
            inputMode={decimals ? 'decimal' : 'numeric'}
            returnKeyType="done"
            selectTextOnFocus
            onFocus={() => {
              setFocused(true)
              setDraft(shown.replace(/,/g, ''))
            }}
            onChangeText={(t) => {
              setDraft(t)
              const n = parse(t)
              if (t.trim() !== '' && Number.isFinite(n)) onChange(Math.min(n, max))
            }}
            onBlur={() => {
              setFocused(false)
              setDraft(null)
              onChange(clampV(value))
            }}
            style={styles.input}
          />
          {suffix ? (
            <Text size={14} weight={600} color="muted">
              {suffix}
            </Text>
          ) : null}
          <StepButton label={`Decrease ${label}`} onPress={() => bump(-1)} disabled={value <= min} icon="minus" />
          <StepButton label={`Increase ${label}`} onPress={() => bump(1)} disabled={value >= max} icon="plus" />
        </View>
      </View>
      {presets ? (
        <View style={styles.presets}>
          {presets.map((p) => (
            <Chip key={p.label} label={p.label} active={Math.abs(value - p.value) < 1e-9} onPress={() => onChange(p.value)} style={{ paddingHorizontal: 12, paddingVertical: 6 }} />
          ))}
        </View>
      ) : null}
      {hint || hintStrong ? (
        <Text size={12} color="muted" style={{ marginTop: 6, paddingStart: 4 }}>
          {hint}
          {hint && hintStrong ? ' ' : ''}
          {hintStrong ? (
            <Text size={12} weight={600} color="aura">
              {hintStrong}
            </Text>
          ) : null}
        </Text>
      ) : null}
    </View>
  )
}

function StepButton({ label, onPress, disabled, icon }: { label: string; onPress: () => void; disabled?: boolean; icon: 'plus' | 'minus' }) {
  const Icon = icon === 'plus' ? Plus : Minus
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      disabled={disabled}
      hitSlop={4}
      style={({ pressed }) => [styles.step, pressed && { backgroundColor: colors.line }, disabled && { opacity: 0.4 }]}
    >
      <Icon size={16} color={colors.plum} />
    </Pressable>
  )
}

/** Pill options, radio-like (site: ChoiceChips). */
export function ChoiceChips<T extends string>({ label, value, onChange, options }: { label: string; value: T; onChange: (v: T) => void; options: { value: T; label: string }[] }) {
  return (
    <View accessibilityRole="radiogroup" accessibilityLabel={label}>
      <Text size={11.5} weight={600} color="muted" style={{ marginBottom: 8 }}>
        {label}
      </Text>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
        {options.map((o) => (
          <Chip key={o.value} label={o.label} active={value === o.value} onPress={() => onChange(o.value)} style={{ minHeight: 40, justifyContent: 'center' }} />
        ))}
      </View>
    </View>
  )
}

export const pct = (n: number, d = 2) => `${(Number.isFinite(n) ? n : 0).toFixed(d)}%`

/** Read a numeric route param (`?price=` / `?rent=`), like the site's validateCalcSearch. */
export function numParam(v: string | string[] | undefined): number | undefined {
  const s = Array.isArray(v) ? v[0] : v
  if (!s) return undefined
  const n = Number(s)
  return Number.isFinite(n) && n > 0 && n <= 1_000_000_000 ? Math.round(n) : undefined
}

const styles = StyleSheet.create({
  shell: { backgroundColor: colors.white, borderRadius: radius.panel, overflow: 'hidden', ...shadow.soft },
  shellHead: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginBottom: 18 },
  reset: { flexDirection: 'row', alignItems: 'center', gap: 6, minHeight: 40, paddingHorizontal: 12, borderRadius: radius.pill },
  results: { backgroundColor: 'rgba(242,237,247,0.6)', borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: colors.line, padding: 20, gap: 22 },
  breakdown: { borderTopWidth: StyleSheet.hairlineWidth, borderBottomWidth: StyleSheet.hairlineWidth, borderColor: colors.line },
  bdRow: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: 14, paddingVertical: 10 },
  bdDivider: { borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: colors.line },
  box: { backgroundColor: colors.white, borderRadius: radius.md, borderWidth: 1, paddingStart: 16, paddingEnd: 8, paddingVertical: 8, gap: 2 },
  input: { flex: 1, minWidth: 0, fontFamily: fonts.sans[600], fontSize: 16, color: colors.ink, paddingVertical: 6, fontVariant: ['tabular-nums'] },
  step: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.mist, alignItems: 'center', justifyContent: 'center' },
  presets: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 8 },
})
