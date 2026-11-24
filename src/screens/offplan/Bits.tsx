import { router } from 'expo-router'
import { ArrowUpRight } from 'lucide-react-native'
import { Pressable, View, type StyleProp, type ViewProps, type ViewStyle } from 'react-native'

import { colors } from '@/theme'
import { Button } from '@/ui/Button'
import { Card, Container, EmptyState } from '@/ui/primitives'
import { Screen } from '@/ui/Screen'
import { Heading, Text } from '@/ui/Text'

/** Inline aura link with an arrow (site: "All off-plan projects ↗"). */
export function ArrowLink({ label, onPress, style }: { label: string; onPress: () => void; style?: StyleProp<ViewStyle> }) {
  return (
    <Pressable accessibilityRole="link" onPress={onPress} hitSlop={10} style={[{ flexDirection: 'row', alignItems: 'center', gap: 4, minHeight: 32 }, style]}>
      <Text size={14.5} weight={600} color="aura">
        {label}
      </Text>
      <ArrowUpRight size={16} color={colors.aura} />
    </Pressable>
  )
}

/** White content block with a serif heading (site: `block` + `h2` on the project page). */
export function Block({ title, sub, children, style, onLayout }: { title?: string; sub?: string; children: React.ReactNode; style?: StyleProp<ViewStyle>; onLayout?: ViewProps['onLayout'] }) {
  return (
    <Card style={[{ padding: 22 }, style]} onLayout={onLayout}>
      {title ? <Heading size={30}>{title}</Heading> : null}
      {sub ? (
        <Text size={14.5} color="muted" style={{ marginTop: 6 }}>
          {sub}
        </Text>
      ) : null}
      <View style={{ marginTop: title || sub ? 18 : 0 }}>{children}</View>
    </Card>
  )
}

/** Full screen "not found" for unknown slugs. */
export function NotFound({ title, body, cta, href }: { title: string; body: string; cta: string; href: Parameters<typeof router.push>[0] }) {
  return (
    <Screen variant="pushed">
      <Container style={{ paddingTop: 24 }}>
        <EmptyState title={title} body={body} action={<Button title={cta} onPress={() => router.replace(href)} />} />
      </Container>
    </Screen>
  )
}

/** Opens the Search tab on the off-plan results. */
export const goOffplanSearch = (location?: string) =>
  router.push({ pathname: '/search', params: location ? { kind: 'offplan', location } : { kind: 'offplan' } })

/** Image hero overlay — same angle and stops as the website's PageHero photo variant. */
export const HERO_OVERLAY = {
  colors: ['rgba(56,26,76,0.88)', 'rgba(86,61,150,0.6)', 'rgba(39,91,168,0.3)'] as const,
  start: { x: 0, y: 0.2 },
  end: { x: 1, y: 0.8 },
}
