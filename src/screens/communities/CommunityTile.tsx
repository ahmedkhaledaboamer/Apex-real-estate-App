import { LinearGradient } from 'expo-linear-gradient'
import { router } from 'expo-router'
import { Pressable, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native'

import { colors, radius, shadow } from '@/theme'
import type { Community } from '@/types'
import { Img } from '@/ui/Img'
import { Heading, Text } from '@/ui/Text'
import { ppsfLabel } from './helpers'

/** Photo tile (site: CommunityTile) → community guide. */
export function CommunityTile({ community: c, height = 240, width, style }: { community: Community; height?: number; width?: number; style?: StyleProp<ViewStyle> }) {
  const yieldText = c.yieldPct ? `${c.yieldPct.toFixed(2)}% gross yield` : null
  return (
    <Pressable
      accessibilityRole="link"
      accessibilityLabel={`${c.name}, ${c.tag}. ${ppsfLabel(c)}${yieldText ? `, ${yieldText}` : ''}. Community guide`}
      onPress={() => router.push(`/community/${c.slug}`)}
      style={({ pressed }) => [styles.tile, { height }, width ? { width } : null, { transform: [{ scale: pressed ? 0.98 : 1 }] }, style]}
    >
      <Img src={c.image} style={StyleSheet.absoluteFill} />
      <LinearGradient colors={['rgba(30,24,40,0)', 'rgba(30,24,40,0.2)', 'rgba(30,24,40,0.8)']} locations={[0, 0.45, 1]} style={StyleSheet.absoluteFill} />
      <View style={styles.tag}>
        <Text size={12} weight={600} color="plum">
          {c.tag}
        </Text>
      </View>
      <View style={{ padding: 18 }}>
        <Heading size={30} color="white">
          {c.name}
        </Heading>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', columnGap: 12, marginTop: 4 }}>
          <Text size={13.5} color="white" style={{ opacity: 0.88 }}>
            {ppsfLabel(c)}
          </Text>
          {yieldText ? (
            <Text size={13.5} color="white" style={{ opacity: 0.88 }}>
              {yieldText}
            </Text>
          ) : null}
        </View>
      </View>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  tile: { borderRadius: radius.card, overflow: 'hidden', justifyContent: 'flex-end', backgroundColor: colors.plum, ...shadow.soft },
  tag: { position: 'absolute', top: 12, left: 12, borderRadius: radius.pill, backgroundColor: 'rgba(255,255,255,0.92)', paddingHorizontal: 10, paddingVertical: 4 },
})
