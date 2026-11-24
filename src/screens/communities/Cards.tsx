import { router } from 'expo-router'
import { CalendarClock, Phone } from 'lucide-react-native'
import { Pressable, StyleSheet, View } from 'react-native'

import { useCurrency } from '@/features/favorites/hooks'
import { formatPrice } from '@/lib/format'
import { colors, radius, shadow } from '@/theme'
import type { AgentProfile, OffPlanProjectDetail } from '@/types'
import { call, whatsapp } from '@/ui/brand'
import { Button } from '@/ui/Button'
import { WhatsAppIcon } from '@/ui/icons'
import { Img } from '@/ui/Img'
import { Heading, Text } from '@/ui/Text'

/** Compact off-plan project card (site: ProjectMiniCard). */
export function ProjectMiniCard({ project: p, width }: { project: OffPlanProjectDetail; width?: number }) {
  const currency = useCurrency()
  return (
    <Pressable
      accessibilityRole="link"
      accessibilityLabel={`${p.name} by ${p.developer}. From ${formatPrice(p.fromAed, currency)}. View project`}
      onPress={() => router.push(`/project/${p.slug}`)}
      style={({ pressed }) => [styles.card, width ? { width } : null, { transform: [{ scale: pressed ? 0.98 : 1 }] }]}
    >
      <View style={{ aspectRatio: 1.6, backgroundColor: colors.mist }}>
        <Img src={p.image} style={StyleSheet.absoluteFill} />
        <View style={styles.status}>
          <Text size={12} weight={600} color="plum">
            {p.status}
          </Text>
        </View>
      </View>
      <View style={{ padding: 20 }}>
        <Text size={12.5} weight={600} color="aura">
          {p.developer}
        </Text>
        <Heading size={26} style={{ marginTop: 2 }}>
          {p.name}
        </Heading>
        <Text size={14} color="muted" style={{ marginTop: 4 }}>
          {p.summary}
        </Text>
        <View style={styles.foot}>
          <View>
            <Text size={12} color="muted">
              From
            </Text>
            <Text size={18} weight={700} color="plum">
              {formatPrice(p.fromAed, currency)}
            </Text>
          </View>
          <View style={{ alignItems: 'flex-end' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
              <CalendarClock size={15} color={colors.muted} />
              <Text size={13} style={{ opacity: 0.8 }}>
                Handover {p.handover}
              </Text>
            </View>
            <Text size={13} color="muted">
              {p.plan} payment plan
            </Text>
          </View>
        </View>
      </View>
    </Pressable>
  )
}

/** Area specialist card (site: AgentCard) — profile link + call / WhatsApp. */
export function SpecialistCard({ agent: a, whatsappText, width }: { agent: AgentProfile; whatsappText: string; width?: number }) {
  return (
    <View style={[styles.card, { padding: 20 }, width ? { width } : null]}>
      <Pressable accessibilityRole="link" accessibilityLabel={`${a.name}, ${a.role}. View profile`} onPress={() => router.push(`/agent/${a.slug}`)} style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
        <Img src={a.photo} style={styles.avatar} />
        <View style={{ flex: 1 }}>
          <Text size={16} weight={600} numberOfLines={1}>
            {a.name}
          </Text>
          <Text size={13} color="muted">
            {a.role}
          </Text>
          <Text size={12} color="muted">
            BRN {a.brn}
          </Text>
        </View>
      </Pressable>
      <Text size={13} color="muted" style={{ marginTop: 14 }}>
        Speaks {a.languages.join(', ')}
      </Text>
      <Text size={13} color="muted">
        Covers {a.communities.join(', ')}
      </Text>
      <View style={{ flexDirection: 'row', gap: 8, marginTop: 16 }}>
        <Button title="Call" variant="outline" icon={<Phone size={16} color={colors.plum} />} onPress={() => call(a.phone)} style={{ flex: 1 }} accessibilityLabel={`Call ${a.name}`} />
        <Button title="WhatsApp" variant="whatsapp" icon={<WhatsAppIcon size={16} />} onPress={() => whatsapp(a.whatsapp, whatsappText)} style={{ flex: 1 }} accessibilityLabel={`WhatsApp ${a.name}`} />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  card: { backgroundColor: colors.white, borderRadius: radius.card, overflow: 'hidden', ...shadow.soft },
  status: { position: 'absolute', top: 12, left: 12, borderRadius: radius.pill, backgroundColor: 'rgba(255,255,255,0.95)', paddingHorizontal: 10, paddingVertical: 4 },
  foot: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', gap: 12, marginTop: 16, paddingTop: 14, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: colors.line },
  avatar: { width: 64, height: 64, borderRadius: 32 },
})
