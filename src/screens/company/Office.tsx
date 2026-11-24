import { ArrowRight, Clock, Mail, MapPin, Navigation, Phone } from 'lucide-react-native'
import { Pressable, StyleSheet, View } from 'react-native'

import { CONTACT_EMAIL, CONTACT_PHONE, CONTACT_PHONE_HREF, OFFICE_ADDRESS, OFFICE_LOCATION, WHATSAPP_NUMBER } from '@/lib/constants'
import { call, email, openUrl, whatsapp } from '@/ui/brand'
import { Button } from '@/ui/Button'
import { WhatsAppIcon } from '@/ui/icons'
import { LocationMap } from '@/ui/LocationMap'
import { Heading, Text } from '@/ui/Text'
import { colors, radius, shadow } from '@/theme'
import { IconCircle } from './Bands'

/** Same as the website's OFFICE_DIRECTIONS_URL (Google Maps directions to Marina Plaza). */
export const OFFICE_DIRECTIONS_URL = `https://www.google.com/maps/dir/?api=1&destination=${OFFICE_LOCATION.lat},${OFFICE_LOCATION.lng}`

export const OFFICE_HOURS: { days: string; hours: string }[] = [
  { days: 'Monday – Friday', hours: '9:00 – 19:00' },
  { days: 'Saturday', hours: '10:00 – 18:00' },
  { days: 'Sunday', hours: '11:00 – 17:00' },
  { days: 'Viewings', hours: '7 days, until 21:00 by appointment' },
]

/** Office card: map pin + address, contact lines and directions (site: OfficeCard). */
export function OfficeCard() {
  return (
    <View style={styles.card}>
      <LocationMap markers={[{ id: 'office', position: OFFICE_LOCATION, label: 'Apex Aura' }]} style={{ height: 220, borderRadius: 0 }} />
      <View style={{ padding: 20 }}>
        <Text size={12.5} weight={600} color="aura">
          Head office
        </Text>
        <Heading size={28} style={{ marginTop: 4 }}>
          Marina Plaza, Dubai Marina
        </Heading>
        <View style={{ gap: 12, marginTop: 16 }}>
          <Line icon={<MapPin size={16} color={colors.muted} />} text={OFFICE_ADDRESS} />
          <Line icon={<Phone size={16} color={colors.muted} />} text={CONTACT_PHONE} onPress={() => call(CONTACT_PHONE_HREF)} label={`Call ${CONTACT_PHONE}`} />
          <Line icon={<Mail size={16} color={colors.muted} />} text={CONTACT_EMAIL} onPress={() => email(CONTACT_EMAIL)} label={`Email ${CONTACT_EMAIL}`} />
          <Line icon={<Clock size={16} color={colors.muted} />} text="Mon–Fri 9:00–19:00 · Sat–Sun by appointment" />
        </View>
        <Text size={13} color="muted" lineHeight={20} style={{ marginTop: 16 }}>
          Visitor parking in the Marina Plaza basement. Two minutes’ walk from Dubai Marina tram stop and DMCC metro station.
        </Text>
        <Button
          title="Get directions"
          variant="outline"
          icon={<Navigation size={16} color={colors.plum} />}
          onPress={() => openUrl(OFFICE_DIRECTIONS_URL)}
          style={{ marginTop: 18 }}
          accessibilityLabel="Get directions to our office"
        />
      </View>
    </View>
  )
}

function Line({ icon, text, onPress, label }: { icon: React.ReactNode; text: string; onPress?: () => void; label?: string }) {
  const body = (
    <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 12 }}>
      <View style={{ marginTop: 2 }}>{icon}</View>
      <Text size={14.5} color={onPress ? 'plum' : 'ink'} weight={onPress ? 600 : 400} style={{ flex: 1, opacity: onPress ? 1 : 0.85 }}>
        {text}
      </Text>
    </View>
  )
  return onPress ? (
    <Pressable accessibilityRole="link" accessibilityLabel={label} onPress={onPress} hitSlop={8} style={{ minHeight: 24 }}>
      {body}
    </Pressable>
  ) : (
    body
  )
}

const OPTIONS = [
  { key: 'call', title: 'Call us', value: CONTACT_PHONE, note: 'Mon–Fri 9:00–19:00, weekends 10:00–18:00', onPress: () => call(CONTACT_PHONE_HREF) },
  { key: 'wa', title: 'WhatsApp', value: 'Chat with an adviser', note: 'Usually replies within 15 minutes', onPress: () => whatsapp(WHATSAPP_NUMBER, 'Hi Apex Aura, I have a question.') },
  { key: 'mail', title: 'Email', value: CONTACT_EMAIL, note: 'We reply within one working day', onPress: () => email(CONTACT_EMAIL) },
  { key: 'visit', title: 'Visit', value: 'Marina Plaza, Dubai Marina', note: OFFICE_ADDRESS, onPress: () => openUrl(OFFICE_DIRECTIONS_URL) },
] as const

function OptionIcon({ k }: { k: (typeof OPTIONS)[number]['key'] }) {
  if (k === 'call') return <Phone size={20} color={colors.indigo} />
  if (k === 'wa') return <WhatsAppIcon size={20} color={colors.indigo} />
  if (k === 'mail') return <Mail size={20} color={colors.indigo} />
  return <MapPin size={20} color={colors.indigo} />
}

/** Four contact channels as tappable cards (site: ContactOptions). */
export function ContactOptions() {
  return (
    <View style={{ gap: 12 }}>
      {OPTIONS.map((o) => (
        <Pressable
          key={o.key}
          accessibilityRole="button"
          accessibilityLabel={`${o.title}: ${o.value}`}
          onPress={o.onPress}
          style={({ pressed }) => [styles.option, { transform: [{ scale: pressed ? 0.98 : 1 }] }]}
        >
          <IconCircle>
            <OptionIcon k={o.key} />
          </IconCircle>
          <View style={{ flex: 1 }}>
            <Text size={12.5} weight={600} color="muted">
              {o.title}
            </Text>
            <Text size={16} weight={600} color="plum">
              {o.value}
            </Text>
            <Text size={13} color="muted" lineHeight={19}>
              {o.note}
            </Text>
          </View>
          <ArrowRight size={18} color={colors.muted} />
        </Pressable>
      ))}
    </View>
  )
}

export function OfficeHours() {
  return (
    <View>
      <View style={styles.hoursTable}>
        {OFFICE_HOURS.map((h, i) => (
          <View key={h.days} style={[styles.hoursRow, i > 0 && { borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: colors.line }]}>
            <Text size={14} weight={500} style={{ flexShrink: 0 }}>
              {h.days}
            </Text>
            <Text size={14} color="muted" align="right" style={{ flex: 1 }}>
              {h.hours}
            </Text>
          </View>
        ))}
      </View>
      <Text size={12.5} color="muted" style={{ marginTop: 10 }}>
        All times Gulf Standard Time (GMT+4). Closed on UAE public holidays.
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  card: { backgroundColor: colors.white, borderRadius: radius.panel, overflow: 'hidden', ...shadow.soft },
  option: { flexDirection: 'row', alignItems: 'center', gap: 14, backgroundColor: colors.white, borderRadius: radius.card, padding: 16, ...shadow.soft },
  hoursTable: { borderTopWidth: StyleSheet.hairlineWidth, borderBottomWidth: StyleSheet.hairlineWidth, borderColor: colors.line },
  hoursRow: { flexDirection: 'row', alignItems: 'center', gap: 16, paddingVertical: 12 },
})
