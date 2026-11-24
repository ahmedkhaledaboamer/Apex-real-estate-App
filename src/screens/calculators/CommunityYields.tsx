import { router } from 'expo-router'
import { ArrowRight } from 'lucide-react-native'
import { useMemo, useState } from 'react'
import { Pressable, StyleSheet, View } from 'react-native'

import { useCurrency } from '@/features/favorites/hooks'
import { formatPrice } from '@/lib/format'
import { COMMUNITY_DETAILS } from '@/mocks/communities'
import { colors, radius, shadow } from '@/theme'
import { Chip } from '@/ui/primitives'
import { Text } from '@/ui/Text'
import { Bar, CHART } from './charts'
import { pct } from './ui'

/** Communities that have a published gross yield, highest first (site: YIELD_COMMUNITIES). */
export const YIELD_COMMUNITIES = COMMUNITY_DETAILS.filter((c): c is typeof c & { yieldPct: number } => c.yieldPct !== null).sort((a, b) => b.yieldPct - a.yieldPct)

type SortKey = 'yield' | 'ppsf'
const openCommunity = (slug: string) => router.push(`/community/${slug}`)

/** Community yield table as stacked cards (site: CommunityYieldTable). */
export function CommunityYieldTable({ sortable = false }: { sortable?: boolean }) {
  const currency = useCurrency()
  const [sort, setSort] = useState<{ key: SortKey; dir: 'asc' | 'desc' }>({ key: 'yield', dir: 'desc' })
  const rows = useMemo(() => {
    const val = (c: (typeof YIELD_COMMUNITIES)[number]) => (sort.key === 'yield' ? c.yieldPct : (c.ppsf ?? -1))
    return [...YIELD_COMMUNITIES].sort((a, b) => (sort.dir === 'desc' ? val(b) - val(a) : val(a) - val(b)))
  }, [sort])

  const sortChip = (key: SortKey, label: string) => {
    const active = sort.key === key
    const arrow = active ? (sort.dir === 'desc' ? ' ↓' : ' ↑') : ''
    return <Chip label={`${label}${arrow}`} active={active} onPress={() => setSort({ key, dir: active && sort.dir === 'desc' ? 'asc' : 'desc' })} style={{ minHeight: 40, justifyContent: 'center' }} />
  }

  return (
    <View style={{ gap: 12 }}>
      {sortable ? (
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          <Text size={12.5} weight={600} color="muted">
            Sort by
          </Text>
          {sortChip('yield', 'Gross yield')}
          {sortChip('ppsf', 'Price / sq ft')}
        </View>
      ) : null}
      {rows.map((c) => (
        <Pressable
          key={c.slug}
          accessibilityRole="link"
          accessibilityLabel={`${c.name}, gross yield ${pct(c.yieldPct)}. Open community guide`}
          onPress={() => openCommunity(c.slug)}
          style={({ pressed }) => [styles.row, pressed && { opacity: 0.9 }]}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <View style={{ flex: 1 }}>
              <Text size={16} weight={600} color="plum">
                {c.name}
              </Text>
              <Text size={12} color="muted">
                {c.tag}
              </Text>
            </View>
            <Text size={20} weight={700} color="plum" style={{ fontVariant: ['tabular-nums'] }}>
              {pct(c.yieldPct)}
            </Text>
            <View style={styles.go}>
              <ArrowRight size={16} color={colors.indigo} />
            </View>
          </View>
          <View style={{ marginTop: 10 }}>
            <Bar value={c.yieldPct} max={8} color={CHART.aura} height={6} />
          </View>
          <View style={styles.facts}>
            <Fact label="Price / sq ft" value={c.ppsf ? `${formatPrice(c.ppsf, currency)}${c.approx ? '*' : ''}` : 'n/a'} />
            <Fact label="Avg rent 1 bed" value={c.avgRent1Bed ? formatPrice(c.avgRent1Bed, currency) : 'n/a'} />
            <Fact label="Avg rent 2 bed" value={c.avgRent2Bed ? formatPrice(c.avgRent2Bed, currency) : 'n/a'} />
          </View>
        </Pressable>
      ))}
      <Text size={12} color="muted" lineHeight={18}>
        Gross yields and prices from the Apex Aora data pack; rents are indicative annual figures. * Earlier snapshot. Past performance is not a guide to future returns.
      </Text>
    </View>
  )
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <View style={{ flex: 1 }}>
      <Text size={11} color="muted">
        {label}
      </Text>
      <Text size={13} weight={600} color={value === 'n/a' ? 'muted' : 'ink'} numberOfLines={1} adjustsFontSizeToFit>
        {value}
      </Text>
    </View>
  )
}

/** Horizontal yield bars, each opening the community guide (site: YieldBarChart). */
export function YieldBarChart({ tone = 'white' }: { tone?: 'white' | 'paper' }) {
  const max = Math.ceil(Math.max(...YIELD_COMMUNITIES.map((c) => c.yieldPct)))
  return (
    <View style={[styles.chart, tone === 'paper' ? styles.paper : shadow.soft]}>
      <View style={{ gap: 6 }}>
        {YIELD_COMMUNITIES.map((c, i) => (
          <Pressable key={c.slug} accessibilityRole="link" accessibilityLabel={`${c.name}: ${pct(c.yieldPct)} gross yield`} onPress={() => openCommunity(c.slug)} style={({ pressed }) => [{ paddingVertical: 6, gap: 6 }, pressed && { opacity: 0.7 }]}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 12 }}>
              <Text size={15} weight={600} color="plum">
                {c.name}
              </Text>
              <Text size={15} weight={700} color="plum" style={{ fontVariant: ['tabular-nums'] }}>
                {pct(c.yieldPct)}
              </Text>
            </View>
            <Bar value={c.yieldPct} max={max} color={i === 0 ? CHART.aura : CHART.indigo} height={10} />
          </Pressable>
        ))}
      </View>
      <Text size={12} color="muted" style={{ marginTop: 14 }}>
        Gross yield, data pack §4. Communities without a published yield are not shown.
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  row: { backgroundColor: colors.white, borderRadius: radius.card, padding: 16, ...shadow.soft },
  go: { width: 36, height: 36, borderRadius: 18, backgroundColor: colors.mist, alignItems: 'center', justifyContent: 'center' },
  facts: { flexDirection: 'row', gap: 10, marginTop: 12, paddingTop: 12, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: colors.line },
  chart: { backgroundColor: colors.white, borderRadius: radius.card, padding: 20 },
  paper: { backgroundColor: colors.paper, borderWidth: StyleSheet.hairlineWidth, borderColor: colors.line },
})
