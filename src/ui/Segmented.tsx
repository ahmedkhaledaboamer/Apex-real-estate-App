import { useEffect, useState } from 'react'
import { Pressable, ScrollView, StyleSheet, View, type LayoutChangeEvent, type StyleProp, type ViewStyle } from 'react-native'
import Animated, { useAnimatedStyle, withTiming, Easing } from 'react-native-reanimated'

import { colors, radius } from '@/theme'
import { Text } from './Text'

/** Pill tabs with a sliding plum indicator — same look as the site's Tabs. */
export function Segmented<T extends string>({
  tabs,
  value,
  onChange,
  style,
}: {
  tabs: { key: T; label: string }[]
  value: T
  onChange: (key: T) => void
  style?: StyleProp<ViewStyle>
}) {
  const [layouts, setLayouts] = useState<Record<string, { x: number; width: number }>>({})
  const active = layouts[value]
  const [ready, setReady] = useState(false)
  useEffect(() => {
    if (active) setReady(true)
  }, [active])

  const indicator = useAnimatedStyle(() => ({
    transform: [{ translateX: withTiming(active?.x ?? 0, { duration: ready ? 220 : 0, easing: Easing.bezier(0.23, 1, 0.32, 1) }) }],
    width: withTiming(active?.width ?? 0, { duration: ready ? 220 : 0, easing: Easing.bezier(0.23, 1, 0.32, 1) }),
  }))

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={[{ flexGrow: 0 }, style]} contentContainerStyle={styles.track}>
      <View style={styles.row}>
        {active ? <Animated.View style={[styles.indicator, indicator]} /> : null}
        {tabs.map((t) => (
          <Pressable
            key={t.key}
            accessibilityRole="tab"
            accessibilityState={{ selected: value === t.key }}
            onPress={() => onChange(t.key)}
            onLayout={(e: LayoutChangeEvent) => {
              const { x, width } = e.nativeEvent.layout
              setLayouts((l) => (l[t.key]?.x === x && l[t.key]?.width === width ? l : { ...l, [t.key]: { x, width } }))
            }}
            style={styles.tab}
          >
            <Text size={14} weight={600} color={value === t.key ? 'white' : 'plum'}>
              {t.label}
            </Text>
          </Pressable>
        ))}
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  track: { backgroundColor: colors.mist, borderRadius: radius.pill, padding: 4 },
  row: { flexDirection: 'row' },
  indicator: { position: 'absolute', top: 0, bottom: 0, left: 0, borderRadius: radius.pill, backgroundColor: colors.plum },
  tab: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: radius.pill },
})
