import { router, type Href } from 'expo-router'
import { View } from 'react-native'

import { openUrl } from '@/ui/brand'
import { Text } from '@/ui/Text'
import { colors } from '@/theme'

/** Long-form legal typography (site: LegalPage `prose`). Inline <B> and <A> nest inside <P> / <LI>. */
export function P({ children, first }: { children: React.ReactNode; first?: boolean }) {
  return (
    <Text size={15.5} lineHeight={25} style={{ marginTop: first ? 0 : 14, opacity: 0.88 }}>
      {children}
    </Text>
  )
}

export function H3({ children }: { children: string }) {
  return (
    <Text size={17} weight={600} color="plum" style={{ marginTop: 22 }}>
      {children}
    </Text>
  )
}

export function UL({ items }: { items: React.ReactNode[] }) {
  return (
    <View style={{ marginTop: 14, gap: 8 }}>
      {items.map((it, i) => (
        <View key={i} style={{ flexDirection: 'row', gap: 12, paddingLeft: 2 }}>
          <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: colors.aura, marginTop: 10 }} />
          <Text size={15.5} lineHeight={25} style={{ flex: 1, opacity: 0.88 }}>
            {it}
          </Text>
        </View>
      ))}
    </View>
  )
}

export function B({ children }: { children: React.ReactNode }) {
  return (
    <Text size={15.5} weight={600} color="ink">
      {children}
    </Text>
  )
}

/** Inline link: app route (`/legal/...`) or external (`mailto:`, `tel:`, `https:`). */
export function A({ to, children }: { to: string; children: React.ReactNode }) {
  return (
    <Text
      size={15.5}
      weight={600}
      color="aura"
      accessibilityRole="link"
      suppressHighlighting
      onPress={() => (to.startsWith('/') ? router.push(to as Href) : openUrl(to))}
    >
      {children}
    </Text>
  )
}
