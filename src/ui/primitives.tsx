import { Pressable, StyleSheet, View, type StyleProp, type ViewProps, type ViewStyle } from 'react-native'

import { colors, GUTTER, radius, shadow } from '@/theme'
import { Heading, Text } from './Text'

/** White content card (site: rounded-[16px] bg-white shadow-soft). */
export function Card({ style, padded = true, ...rest }: ViewProps & { padded?: boolean }) {
  return <View style={[styles.card, padded && { padding: 20 }, style]} {...rest} />
}

/** Page-width block with the standard gutter. */
export function Container({ style, ...rest }: ViewProps) {
  return <View style={[{ paddingHorizontal: GUTTER }, style]} {...rest} />
}

/** Vertical section spacing (site: py-16). */
export function Section({ style, tone = 'paper', ...rest }: ViewProps & { tone?: 'paper' | 'white' | 'mist' }) {
  return <View style={[{ paddingVertical: 40, backgroundColor: colors[tone] }, style]} {...rest} />
}

type BadgeTone = 'mist' | 'white' | 'plum' | 'success' | 'glass'
const BADGE_BG: Record<BadgeTone, string> = {
  mist: colors.mist,
  white: 'rgba(255,255,255,0.95)',
  plum: colors.plum,
  success: 'rgba(255,255,255,0.95)',
  glass: 'rgba(255,255,255,0.18)',
}
const BADGE_FG: Record<BadgeTone, keyof typeof colors> = { mist: 'plum', white: 'plum', plum: 'white', success: 'success', glass: 'white' }

export function Badge({ children, tone = 'mist', icon, style }: { children: React.ReactNode; tone?: BadgeTone; icon?: React.ReactNode; style?: StyleProp<ViewStyle> }) {
  return (
    <View style={[styles.badge, { backgroundColor: BADGE_BG[tone] }, style]}>
      {icon}
      <Text size={12} weight={600} color={BADGE_FG[tone]}>
        {children}
      </Text>
    </View>
  )
}

/** Filter chip (site: Chip). */
export function Chip({ label, active, onPress, style }: { label: string; active?: boolean; onPress?: () => void; style?: StyleProp<ViewStyle> }) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected: active }}
      onPress={onPress}
      style={[styles.chip, active ? { backgroundColor: colors.plum, borderColor: colors.plum } : { backgroundColor: colors.white, borderColor: colors.line }, style]}
    >
      <Text size={13.5} weight={500} color={active ? 'white' : 'plum'}>
        {label}
      </Text>
    </Pressable>
  )
}

/** Section title block: serif title, supporting line, optional action (site: SectionHead). */
export function SectionHead({ title, sub, action, style, light }: { title: string; sub?: string; action?: React.ReactNode; style?: StyleProp<ViewStyle>; light?: boolean }) {
  return (
    <View style={[{ marginBottom: 20, gap: 8 }, style]}>
      <View style={{ flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', gap: 12 }}>
        <Heading size={30} color={light ? 'white' : 'plum'} style={{ flex: 1 }}>
          {title}
        </Heading>
        {action}
      </View>
      {sub ? (
        <Text size={14.5} color={light ? 'white' : 'muted'} style={light ? { opacity: 0.8 } : undefined}>
          {sub}
        </Text>
      ) : null}
    </View>
  )
}

export function Stat({ label, value, sub, light }: { label: string; value: string; sub?: string; light?: boolean }) {
  return (
    <View style={{ gap: 2 }}>
      <Text size={12} color={light ? 'white' : 'muted'} style={light ? { opacity: 0.7 } : undefined}>
        {label}
      </Text>
      <Text size={19} weight={700} color={light ? 'white' : 'plum'}>
        {value}
      </Text>
      {sub ? (
        <Text size={11.5} color="muted">
          {sub}
        </Text>
      ) : null}
    </View>
  )
}

export function EmptyState({ title, body, action }: { title: string; body?: string; action?: React.ReactNode }) {
  return (
    <Card style={{ alignItems: 'center', paddingVertical: 40, borderWidth: 1, borderColor: colors.line, boxShadow: 'none' }}>
      <Heading size={26} align="center">
        {title}
      </Heading>
      {body ? (
        <Text size={14.5} color="muted" align="center" style={{ marginTop: 8, maxWidth: 320 }}>
          {body}
        </Text>
      ) : null}
      {action ? <View style={{ marginTop: 20 }}>{action}</View> : null}
    </Card>
  )
}

export function Divider({ style }: { style?: StyleProp<ViewStyle> }) {
  return <View style={[{ height: StyleSheet.hairlineWidth, backgroundColor: colors.line }, style]} />
}

const styles = StyleSheet.create({
  card: { backgroundColor: colors.white, borderRadius: radius.card, ...shadow.soft },
  badge: { flexDirection: 'row', alignItems: 'center', gap: 4, alignSelf: 'flex-start', borderRadius: radius.pill, paddingHorizontal: 10, paddingVertical: 4 },
  chip: { borderWidth: 1, borderRadius: radius.pill, paddingHorizontal: 14, paddingVertical: 7 },
})
