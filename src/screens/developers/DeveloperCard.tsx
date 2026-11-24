import { router } from 'expo-router'
import { ArrowUpRight } from 'lucide-react-native'
import { Pressable, StyleSheet, View } from 'react-native'

import { PROJECT_DETAILS } from '@/mocks/projects'
import { colors, radius, shadow } from '@/theme'
import type { Developer } from '@/types'
import { Img } from '@/ui/Img'
import { Text } from '@/ui/Text'

export const activeProjectCount = (slug: string) => PROJECT_DETAILS.filter((p) => p.developerSlug === slug).length

/** Developer card: photo, uppercase wordmark, summary, facts and listed-project count (site: DeveloperCard). */
export function DeveloperCard({ developer: d }: { developer: Developer }) {
  const count = activeProjectCount(d.slug)
  return (
    <Pressable
      accessibilityRole="link"
      accessibilityLabel={`${d.name}. ${d.summary} View profile`}
      onPress={() => router.push(`/developer/${d.slug}`)}
      style={({ pressed }) => [styles.card, { transform: [{ scale: pressed ? 0.98 : 1 }] }]}
    >
      <Img src={d.image} style={styles.photo} />
      <View style={{ padding: 20 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
          <Text size={21} weight={700} color="ink" tracking={0.08} style={{ flex: 1, opacity: 0.85 }}>
            {d.name.toUpperCase()}
          </Text>
          <ArrowUpRight size={20} color={colors.muted} />
        </View>
        <Text size={14.5} color="muted" style={{ marginTop: 8 }}>
          {d.summary}
        </Text>
        <View style={styles.facts}>
          <Fact label="Founded" value={String(d.founded)} />
          <Fact label="HQ" value={d.hq} />
          <Fact label="Delivered" value={d.deliveredUnits} />
        </View>
        <View style={{ marginTop: 14 }}>
          {count > 0 ? (
            <View style={styles.count}>
              <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: colors.success }} />
              <Text size={13} weight={600} color="plum">
                {count} active {count === 1 ? 'project' : 'projects'} listed
              </Text>
            </View>
          ) : (
            <Text size={13} weight={600} color="muted">
              Resale and upcoming launches on request
            </Text>
          )}
        </View>
      </View>
    </Pressable>
  )
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <View style={{ flex: 1 }}>
      <Text size={11.5} color="muted">
        {label}
      </Text>
      <Text size={15} weight={700} color="plum" numberOfLines={1}>
        {value}
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  card: { backgroundColor: colors.white, borderRadius: radius.card, overflow: 'hidden', ...shadow.soft },
  photo: { width: '100%', height: 150, backgroundColor: colors.mist },
  facts: { flexDirection: 'row', gap: 12, marginTop: 16, paddingTop: 14, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: colors.line },
  count: { flexDirection: 'row', alignItems: 'center', gap: 6, alignSelf: 'flex-start', backgroundColor: colors.mist, borderRadius: radius.pill, paddingHorizontal: 10, paddingVertical: 4 },
})
