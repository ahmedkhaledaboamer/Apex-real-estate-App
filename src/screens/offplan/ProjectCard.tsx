import { LinearGradient } from 'expo-linear-gradient'
import { router } from 'expo-router'
import { ArrowRight, CalendarClock } from 'lucide-react-native'
import { Pressable, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native'

import { useCurrency } from '@/features/favorites/hooks'
import { formatPrice } from '@/lib/format'
import { colors, radius, shadow } from '@/theme'
import type { OffPlanProject, OffPlanProjectDetail } from '@/types'
import { Img } from '@/ui/Img'
import { Heading, Text } from '@/ui/Text'

/** Status → dot colour (same mapping as the website's StatusPill). */
export const STATUS_DOT: Record<string, string> = {
  Launching: colors.cyan,
  Selling: colors.success,
  'Last units': colors.aura,
}

export function StatusPill({ status, style }: { status: string; style?: StyleProp<ViewStyle> }) {
  return (
    <View style={[styles.status, style]}>
      <View style={[styles.statusDot, { backgroundColor: STATUS_DOT[status] ?? colors.indigo }]} />
      <Text size={12} weight={600} color="plum">
        {status}
      </Text>
    </View>
  )
}

export const projectHref = (p: Pick<OffPlanProjectDetail, 'slug'>) => `/project/${p.slug}` as const

/**
 * Photo-led off-plan project card (site: offplan ProjectCard). Self-contained: tap opens the project.
 * `width` fixes the card width (carousels); otherwise it fills its parent.
 */
export function ProjectCard({ project: p, width, height = 380, style }: { project: OffPlanProjectDetail | (OffPlanProject & { slug: string }); width?: number; height?: number; style?: StyleProp<ViewStyle> }) {
  const currency = useCurrency()
  return (
    <Pressable
      accessibilityRole="link"
      accessibilityLabel={`${p.name} by ${p.developer} in ${p.community}. From ${formatPrice(p.fromAed, currency)}. Handover ${p.handover}. View project`}
      onPress={() => router.push(projectHref(p))}
      style={({ pressed }) => [styles.card, { height }, width ? { width } : null, { transform: [{ scale: pressed ? 0.98 : 1 }] }, style]}
    >
      <Img src={p.image} style={StyleSheet.absoluteFill} accessibilityLabel={`${p.name} render`} />
      <LinearGradient colors={['rgba(30,24,40,0)', 'rgba(30,24,40,0.25)', 'rgba(30,24,40,0.88)']} locations={[0, 0.4, 1]} style={StyleSheet.absoluteFill} />

      <View style={styles.top}>
        <View style={styles.wordmark}>
          <Text size={13} weight={700} color="plum" tracking={0.06}>
            {p.developer.toUpperCase()}
          </Text>
        </View>
        <StatusPill status={p.status} />
      </View>

      <View style={styles.body}>
        <Text size={13} color="white" style={{ opacity: 0.75 }}>
          {p.community}
        </Text>
        <Heading size={30} color="white" numberOfLines={2}>
          {p.name}
        </Heading>
        <View style={styles.meta}>
          <Text size={14} color="white" style={{ opacity: 0.9 }}>
            From{' '}
            <Text size={14} weight={700} color="white">
              {formatPrice(p.fromAed, currency, { compact: true })}
            </Text>
          </Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
            <CalendarClock size={15} color={colors.white} />
            <Text size={14} color="white" style={{ opacity: 0.9 }}>
              Handover {p.handover}
            </Text>
          </View>
        </View>
        <View style={styles.planPill}>
          <Text size={12.5} weight={600} color="white">
            {p.plan} payment plan
          </Text>
        </View>
        <View style={styles.cta}>
          <Text size={14} weight={600} color="plum">
            View project
          </Text>
          <ArrowRight size={16} color={colors.plum} />
        </View>
      </View>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  card: { borderRadius: radius.card, overflow: 'hidden', backgroundColor: colors.plum, justifyContent: 'flex-end', ...shadow.soft },
  top: { position: 'absolute', top: 14, left: 14, right: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 10 },
  wordmark: { height: 34, justifyContent: 'center', borderRadius: 8, backgroundColor: 'rgba(255,255,255,0.95)', paddingHorizontal: 10 },
  status: { flexDirection: 'row', alignItems: 'center', gap: 6, alignSelf: 'flex-start', borderRadius: radius.pill, backgroundColor: 'rgba(255,255,255,0.95)', paddingHorizontal: 12, paddingVertical: 5 },
  statusDot: { width: 7, height: 7, borderRadius: 4 },
  body: { padding: 20, gap: 4 },
  meta: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', columnGap: 16, rowGap: 4, marginTop: 10 },
  planPill: { alignSelf: 'flex-start', borderWidth: 1, borderColor: 'rgba(255,255,255,0.4)', borderRadius: radius.pill, paddingHorizontal: 10, paddingVertical: 3, marginTop: 8 },
  cta: { flexDirection: 'row', alignItems: 'center', gap: 6, alignSelf: 'flex-start', backgroundColor: colors.white, borderRadius: radius.pill, paddingHorizontal: 18, height: 44, marginTop: 14 },
})
