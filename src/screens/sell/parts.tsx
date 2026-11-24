import { LinearGradient } from 'expo-linear-gradient'
import { Star } from 'lucide-react-native'
import { StyleSheet, View } from 'react-native'

import { TESTIMONIALS } from '@/mocks/testimonials'
import { Carousel, useCardWidth } from '@/screens/calculators/page'
import { colors, gradients, radius, shadow } from '@/theme'
import { Img } from '@/ui/Img'
import { Heading, Text } from '@/ui/Text'

export type ProcessStep = { title: string; body: string; meta?: string }

/** Vertical numbered timeline with a rail (site: ProcessTimeline). */
export function ProcessTimeline({ steps }: { steps: ProcessStep[] }) {
  return (
    <View>
      {steps.map((s, i) => (
        <View key={s.title} style={{ flexDirection: 'row', gap: 18, paddingBottom: i < steps.length - 1 ? 32 : 0 }} accessible accessibilityLabel={`Step ${i + 1}: ${s.title}${s.meta ? `, ${s.meta}` : ''}. ${s.body}`}>
          {i < steps.length - 1 ? <View style={styles.rail} /> : null}
          <LinearGradient colors={gradients.aura.colors} start={gradients.aura.start} end={gradients.aura.end} style={[styles.dot, shadow.soft]}>
            <Text size={15} weight={700} color="white">
              {i + 1}
            </Text>
          </LinearGradient>
          <View style={{ flex: 1, paddingTop: 4 }}>
            <Heading size={25}>{s.title}</Heading>
            {s.meta ? (
              <View style={styles.meta}>
                <Text size={12} weight={600} color="plum">
                  {s.meta}
                </Text>
              </View>
            ) : null}
            <Text size={15} color="muted" lineHeight={23} style={{ marginTop: 8 }}>
              {s.body}
            </Text>
          </View>
        </View>
      ))}
    </View>
  )
}

/** Client reviews as a snapping carousel (site: TestimonialGrid). */
export function TestimonialCarousel() {
  const w = useCardWidth()
  return (
    <Carousel
      data={TESTIMONIALS}
      keyOf={(t) => t.name}
      itemWidth={w}
      render={(t) => (
        <View style={styles.quote}>
          <View style={{ flexDirection: 'row', gap: 2 }} accessibilityLabel={`${t.rating} out of 5 stars`}>
            {Array.from({ length: t.rating }).map((_, s) => (
              <Star key={s} size={16} color={colors.aura} fill={colors.aura} />
            ))}
          </View>
          <Text display weight={500} size={22} lineHeight={29} color="plum" style={{ marginTop: 14, flex: 1 }}>
            “{t.quote}”
          </Text>
          <View style={styles.author}>
            <Img src={t.avatar} style={{ width: 44, height: 44, borderRadius: 22 }} accessibilityIgnoresInvertColors />
            <View style={{ flex: 1 }}>
              <Text size={14.5} weight={600} color="ink">
                {t.name}
              </Text>
              <Text size={12.5} color="muted">
                {t.context}
              </Text>
            </View>
          </View>
        </View>
      )}
    />
  )
}

const styles = StyleSheet.create({
  rail: { position: 'absolute', left: 21.5, top: 50, bottom: 4, width: StyleSheet.hairlineWidth * 2, backgroundColor: colors.line },
  dot: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  meta: { alignSelf: 'flex-start', marginTop: 6, backgroundColor: colors.mist, borderRadius: radius.pill, paddingHorizontal: 10, paddingVertical: 4 },
  quote: { flex: 1, backgroundColor: colors.white, borderRadius: radius.card, padding: 22, ...shadow.soft },
  author: { flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 20, paddingTop: 18, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: colors.line },
})
