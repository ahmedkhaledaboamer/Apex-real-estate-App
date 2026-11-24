import { LinearGradient } from 'expo-linear-gradient'
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native'

import { InfinityMark } from '@/ui/icons'
import { Heading, Text } from '@/ui/Text'
import { colors, GUTTER, gradients, radius } from '@/theme'

/**
 * Header band for inner pages (site: PageHero without image) — plum → royal gradient,
 * infinity watermark, serif title and supporting line. Sits under the pushed-screen header.
 */
export function PageHero({ title, sub, children, style }: { title: string; sub?: string; children?: React.ReactNode; style?: StyleProp<ViewStyle> }) {
  return (
    <LinearGradient colors={gradients.band.colors} start={gradients.band.start} end={gradients.band.end} style={[styles.hero, style]}>
      <View style={styles.heroMark} pointerEvents="none">
        <InfinityMark width={360} strokeWidth={14} opacity={0.22} />
      </View>
      <Heading size={40} color="white" accessibilityRole="header">
        {title}
      </Heading>
      {sub ? (
        <Text size={15.5} color="white" lineHeight={24} style={{ marginTop: 12, opacity: 0.82 }}>
          {sub}
        </Text>
      ) : null}
      {children ? <View style={{ marginTop: 22 }}>{children}</View> : null}
    </LinearGradient>
  )
}

/** Rounded dark CTA panel (site: the gradient bands at the bottom of pages). */
export function CtaBand({ title, body, children, style }: { title: string; body?: string; children?: React.ReactNode; style?: StyleProp<ViewStyle> }) {
  return (
    <View style={[{ paddingHorizontal: GUTTER }, style]}>
      <LinearGradient colors={gradients.band.colors} start={gradients.band.start} end={gradients.band.end} style={styles.band}>
        <View style={styles.bandMark} pointerEvents="none">
          <InfinityMark width={380} strokeWidth={14} opacity={0.22} />
        </View>
        <Heading size={34} color="white">
          {title}
        </Heading>
        {body ? (
          <Text size={15} color="white" lineHeight={23} style={{ marginTop: 12, opacity: 0.82 }}>
            {body}
          </Text>
        ) : null}
        {children ? <View style={{ marginTop: 24, gap: 10 }}>{children}</View> : null}
      </LinearGradient>
    </View>
  )
}

/** Round mist icon holder used on value / option cards. */
export function IconCircle({ children, size = 48, tone = 'mist' }: { children: React.ReactNode; size?: number; tone?: 'mist' | 'white' }) {
  return <View style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: tone === 'mist' ? colors.mist : colors.white, alignItems: 'center', justifyContent: 'center' }}>{children}</View>
}

/** Small aura eyebrow line above serif titles. */
export function Eyebrow({ children }: { children: string }) {
  return (
    <Text size={13} weight={600} color="aura">
      {children}
    </Text>
  )
}

const styles = StyleSheet.create({
  hero: { paddingHorizontal: GUTTER, paddingTop: 28, paddingBottom: 36, overflow: 'hidden' },
  heroMark: { position: 'absolute', right: -110, bottom: -60 },
  band: { borderRadius: radius.panel, paddingHorizontal: 24, paddingVertical: 36, overflow: 'hidden' },
  bandMark: { position: 'absolute', right: -120, bottom: -60 },
})
