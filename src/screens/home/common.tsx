import { router } from 'expo-router'
import { ArrowRight, CalendarClock } from 'lucide-react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { FlatList, Pressable, StyleSheet, View, type ListRenderItem, type StyleProp, type ViewStyle } from 'react-native'

import { useCurrency } from '@/features/favorites/hooks'
import { formatPrice } from '@/lib/format'
import { colors, GUTTER, radius, shadow } from '@/theme'
import type { OffPlanProjectDetail } from '@/types'
import { Img } from '@/ui/Img'
import { Text } from '@/ui/Text'

/** Inline text action with an arrow (site: "All communities →" links). */
export function LinkAction({ label, onPress, light, style }: { label: string; onPress: () => void; light?: boolean; style?: StyleProp<ViewStyle> }) {
  return (
    <Pressable accessibilityRole="link" accessibilityLabel={label} onPress={onPress} hitSlop={10} style={[styles.link, style]}>
      <Text size={14.5} weight={600} color={light ? 'white' : 'aura'}>
        {label}
      </Text>
      <ArrowRight size={16} color={light ? colors.white : colors.aura} />
    </Pressable>
  )
}

/** Horizontal snapping carousel with the page gutter on both ends. */
export function Carousel<T>({
  data,
  renderItem,
  itemWidth,
  gap = 14,
  keyExtractor,
  label,
}: {
  data: readonly T[]
  renderItem: ListRenderItem<T>
  itemWidth: number
  gap?: number
  keyExtractor: (item: T, index: number) => string
  label?: string
}) {
  return (
    <FlatList
      horizontal
      data={data as T[]}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      showsHorizontalScrollIndicator={false}
      snapToInterval={itemWidth + gap}
      snapToAlignment="start"
      decelerationRate="fast"
      disableIntervalMomentum
      contentContainerStyle={{ paddingHorizontal: GUTTER, gap, paddingBottom: 6, paddingTop: 2 }}
      accessibilityLabel={label}
    />
  )
}

export const STATUS_DOT: Record<string, string> = {
  Launching: colors.cyan,
  Selling: colors.success,
  'Last units': colors.aura,
}

/** Photo-led off-plan project card (site: OffPlanLaunches / ProjectCard). */
export function ProjectCard({ project: p, height = 380, large, width }: { project: OffPlanProjectDetail; height?: number; large?: boolean; width?: number }) {
  const currency = useCurrency()
  return (
    <Pressable
      accessibilityRole="link"
      accessibilityLabel={`${p.name} by ${p.developer}, ${p.community}`}
      onPress={() => router.push(`/project/${p.slug}`)}
      style={({ pressed }) => [styles.project, { height, width }, pressed && { transform: [{ scale: 0.99 }] }]}
    >
      <Img src={p.image} style={StyleSheet.absoluteFill} accessibilityLabel={`${p.name} render`} />
      <LinearGradient colors={['rgba(30,24,40,0)', 'rgba(30,24,40,0.25)', 'rgba(30,24,40,0.88)']} locations={[0, 0.4, 1]} style={StyleSheet.absoluteFill} />
      <View style={styles.projectTop}>
        <View style={styles.devBadge}>
          <Text size={12.5} weight={700} color="plum" tracking={0.06}>
            {p.developer.toUpperCase()}
          </Text>
        </View>
        <StatusPill status={p.status} />
      </View>
      <View style={{ padding: 20 }}>
        <Text size={13} color="white" style={{ opacity: 0.75 }}>
          {p.community}
        </Text>
        <Text display weight={600} size={large ? 38 : 30} color="white" lineHeight={large ? 40 : 32}>
          {p.name}
        </Text>
        <View style={styles.projectMeta}>
          <Text size={13.5} color="white" style={{ opacity: 0.92 }}>
            From{' '}
            <Text size={13.5} weight={600} color="white">
              {formatPrice(p.fromAed, currency, { compact: true })}
            </Text>
          </Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
            <CalendarClock size={14} color={colors.white} />
            <Text size={13.5} color="white" style={{ opacity: 0.92 }}>
              Handover {p.handover}
            </Text>
          </View>
          <View style={styles.planPill}>
            <Text size={12} weight={600} color="white">
              {p.plan} payment plan
            </Text>
          </View>
        </View>
        <View style={styles.viewBtn}>
          <Text size={14} weight={600} color="plum">
            View project
          </Text>
          <ArrowRight size={15} color={colors.plum} />
        </View>
      </View>
    </Pressable>
  )
}

export function StatusPill({ status }: { status: string }) {
  return (
    <View style={styles.status}>
      <View style={[styles.dot, { backgroundColor: STATUS_DOT[status] ?? colors.indigo }]} />
      <Text size={12} weight={600} color="plum">
        {status}
      </Text>
    </View>
  )
}

/** Drop empty values so they don't reach the URL as "undefined". */
export const compactParams = (o: Record<string, string | number | undefined>) =>
  Object.fromEntries(Object.entries(o).filter(([, v]) => v !== undefined && v !== '').map(([k, v]) => [k, String(v)])) as Record<string, string>

/** Opens the Search tab with filters (a fresh `t` makes repeated searches re-apply). */
export function goToSearch(params: Record<string, string | number | undefined>) {
  router.push({ pathname: '/search', params: { ...compactParams(params), t: String(Date.now()) } })
}

const styles = StyleSheet.create({
  link: { flexDirection: 'row', alignItems: 'center', gap: 6, minHeight: 32 },
  project: { borderRadius: radius.card, overflow: 'hidden', justifyContent: 'flex-end', backgroundColor: colors.plum, ...shadow.soft },
  projectTop: { position: 'absolute', top: 16, left: 16, right: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 10 },
  devBadge: { height: 34, justifyContent: 'center', borderRadius: radius.sm, backgroundColor: 'rgba(255,255,255,0.95)', paddingHorizontal: 12 },
  status: { flexDirection: 'row', alignItems: 'center', gap: 6, borderRadius: radius.pill, backgroundColor: 'rgba(255,255,255,0.95)', paddingHorizontal: 12, paddingVertical: 5 },
  dot: { width: 7, height: 7, borderRadius: 4 },
  projectMeta: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', columnGap: 16, rowGap: 8, marginTop: 12 },
  planPill: { borderWidth: 1, borderColor: 'rgba(255,255,255,0.4)', borderRadius: radius.pill, paddingHorizontal: 10, paddingVertical: 2 },
  viewBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, alignSelf: 'flex-start', marginTop: 16, backgroundColor: colors.white, borderRadius: radius.pill, paddingHorizontal: 18, height: 44 },
})
