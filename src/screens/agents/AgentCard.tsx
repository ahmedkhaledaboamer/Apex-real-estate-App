import { router } from 'expo-router'
import { Languages, MapPin } from 'lucide-react-native'
import { Pressable, StyleSheet, View } from 'react-native'

import type { AgentProfile } from '@/types'
import { whatsapp } from '@/ui/brand'
import { Button } from '@/ui/Button'
import { WhatsAppIcon } from '@/ui/icons'
import { Img } from '@/ui/Img'
import { Heading, Text } from '@/ui/Text'
import { colors, radius } from '@/theme'

export const agentHref = (a: Pick<AgentProfile, 'slug'>) => `/agent/${a.slug}` as const

/** Agent card (site: AgentCard): tall photo, BRN badge, serif name, role, languages, areas, WhatsApp. */
export function AgentCard({ agent: a, whatsappText, ratio = 4 / 5 }: { agent: AgentProfile; whatsappText?: string; ratio?: number }) {
  const first = a.name.split(' ')[0]
  const open = () => router.push(agentHref(a))
  return (
    <View>
      <Pressable onPress={open} accessibilityRole="link" accessibilityLabel={`View ${a.name}’s profile`}>
        <View style={[styles.photo, { aspectRatio: ratio }]}>
          <Img src={a.photo} style={StyleSheet.absoluteFill} />
          <View style={styles.brn}>
            <Text size={11.5} weight={600} color="plum">
              BRN {a.brn}
            </Text>
          </View>
        </View>
        <Heading size={26} style={{ marginTop: 14 }}>
          {a.name}
        </Heading>
        <Text size={14} color="muted">
          {a.role}
        </Text>
        <View style={{ gap: 6, marginTop: 10 }}>
          <Meta icon={<Languages size={15} color={colors.muted} />} text={a.languages.join(', ')} />
          <Meta icon={<MapPin size={15} color={colors.muted} />} text={a.communities.join(', ')} />
        </View>
      </Pressable>
      <View style={{ gap: 4, marginTop: 14 }}>
        <Button
          title={`WhatsApp ${first}`}
          variant="outline"
          full
          icon={<WhatsAppIcon size={16} color={colors.whatsapp} />}
          onPress={() => whatsapp(a.whatsapp, whatsappText ?? `Hi ${first}, I found you on the Apex Aora app.`)}
          accessibilityLabel={`WhatsApp ${a.name}`}
        />
        <Button title="View profile" variant="ghost" full onPress={open} accessibilityLabel={`View ${a.name}’s profile`} />
      </View>
    </View>
  )
}

function Meta({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 8 }}>
      <View style={{ marginTop: 2 }}>{icon}</View>
      <Text size={13.5} style={{ flex: 1, opacity: 0.8 }}>
        {text}
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  photo: { aspectRatio: 4 / 5, borderRadius: radius.card, overflow: 'hidden', backgroundColor: colors.mist },
  brn: { position: 'absolute', left: 12, bottom: 12, backgroundColor: 'rgba(255,255,255,0.95)', borderRadius: radius.pill, paddingHorizontal: 10, paddingVertical: 4 },
})
