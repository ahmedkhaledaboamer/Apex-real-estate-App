import Constants from 'expo-constants'
import { router, type Href } from 'expo-router'
import {
  BadgeCheck,
  Building2,
  Calculator,
  ChevronRight,
  Cookie,
  FileText,
  Home,
  Info,
  Landmark,
  LineChart,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  Scale,
  Shield,
  Sparkles,
  Tag,
  TrendingUp,
  Users,
} from 'lucide-react-native'
import { Pressable, StyleSheet, View } from 'react-native'

import { CONTACT_EMAIL, CONTACT_PHONE_HREF, WHATSAPP_NUMBER } from '@/lib/constants'
import { useAppSelector } from '@/store/hooks'
import { call, email, whatsapp } from '@/ui/brand'
import { WhatsAppIcon } from '@/ui/icons'
import { Container } from '@/ui/primitives'
import { Screen } from '@/ui/Screen'
import { Heading, Text } from '@/ui/Text'
import { colors, radius, shadow } from '@/theme'

type Item = { label: string; sub?: string; icon: React.ComponentType<{ size?: number; color?: string }>; href: Href; badge?: string }
type Group = { title: string; items: Item[] }

export function MoreScreen() {
  const compareCount = useAppSelector((s) => s.compare.ids.length)
  const version = Constants.expoConfig?.version ?? '1.0.0'

  const GROUPS: Group[] = [
    {
      title: 'Explore',
      items: [
        { label: 'Off-plan', sub: 'New launches & payment plans', icon: Building2, href: { pathname: '/search', params: { kind: 'offplan' } } },
        { label: 'Communities', sub: 'Area guides, prices & yields', icon: MapPin, href: '/communities' },
        { label: 'Developers', sub: 'Track records & projects', icon: Landmark, href: '/developers' },
        { label: 'Agents', sub: 'RERA-licensed advisers', icon: Users, href: '/agents' },
        { label: 'Market insights', sub: 'Reports & guides', icon: LineChart, href: '/insights' },
      ],
    },
    {
      title: 'Services',
      items: [
        { label: 'Invest', sub: 'Yields, strategy & portfolios', icon: TrendingUp, href: '/invest' },
        { label: 'Golden Visa', sub: 'Residency through property', icon: Sparkles, href: '/invest/golden-visa' },
        { label: 'Sell', sub: 'List with Apex Aora', icon: Tag, href: '/sell' },
        { label: 'Free valuation', sub: 'Know what your home is worth', icon: Home, href: '/sell/valuation' },
        { label: 'Calculators', sub: 'Mortgage, fees, ROI, rent vs buy', icon: Calculator, href: '/tools' },
        { label: 'Compare', sub: 'Side-by-side comparison', icon: Scale, href: '/compare', badge: compareCount > 0 ? String(compareCount) : undefined },
      ],
    },
    {
      title: 'Company',
      items: [
        { label: 'About us', icon: Info, href: '/about' },
        { label: 'Contact', sub: 'Call, WhatsApp, email or visit', icon: MessageSquare, href: '/contact' },
      ],
    },
    {
      title: 'Legal',
      items: [
        { label: 'Privacy policy', icon: Shield, href: '/legal/privacy' },
        { label: 'Terms of use', icon: FileText, href: '/legal/terms' },
        { label: 'Cookie policy', icon: Cookie, href: '/legal/cookies' },
      ],
    },
  ]

  return (
    <Screen variant="tab">
      <Container style={{ paddingTop: 22 }}>
        <Heading size={38} accessibilityRole="header">
          More
        </Heading>
        <Text size={15} color="muted" style={{ marginTop: 4 }}>
          Everything else Apex Aora can help you with.
        </Text>

        {/* Contact strip */}
        <View style={styles.contact}>
          <Text size={13} weight={600} color="muted">
            Talk to an adviser
          </Text>
          <View style={{ flexDirection: 'row', gap: 10, marginTop: 12 }}>
            <ContactBtn label="Call" onPress={() => call(CONTACT_PHONE_HREF)} icon={<Phone size={18} color={colors.plum} />} />
            <ContactBtn label="WhatsApp" onPress={() => whatsapp(WHATSAPP_NUMBER, 'Hi Apex Aora, I have a question.')} icon={<WhatsAppIcon size={18} color={colors.whatsapp} />} />
            <ContactBtn label="Email" onPress={() => email(CONTACT_EMAIL)} icon={<Mail size={18} color={colors.plum} />} />
          </View>
        </View>

        {GROUPS.map((g) => (
          <View key={g.title} style={{ marginTop: 26 }}>
            <Text size={12} weight={600} color="muted" uppercase tracking={0.12} style={{ marginBottom: 10, paddingLeft: 4 }} accessibilityRole="header">
              {g.title}
            </Text>
            <View style={styles.group}>
              {g.items.map((it, i) => (
                <Pressable
                  key={it.label}
                  accessibilityRole="button"
                  accessibilityLabel={it.sub ? `${it.label}, ${it.sub}` : it.label}
                  onPress={() => router.push(it.href)}
                  style={({ pressed }) => [styles.row, i > 0 && styles.divider, pressed && { backgroundColor: colors.mist }]}
                >
                  <View style={styles.icon}>
                    <it.icon size={18} color={colors.indigo} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text size={15.5} weight={600} color="plum">
                      {it.label}
                    </Text>
                    {it.sub ? (
                      <Text size={12.5} color="muted">
                        {it.sub}
                      </Text>
                    ) : null}
                  </View>
                  {it.badge ? (
                    <View style={styles.badge}>
                      <Text size={11} weight={700} color="white">
                        {it.badge}
                      </Text>
                    </View>
                  ) : null}
                  <ChevronRight size={18} color={colors.muted} />
                </Pressable>
              ))}
            </View>
          </View>
        ))}

        <View style={{ marginTop: 30, alignItems: 'center', gap: 6 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <BadgeCheck size={15} color={colors.success} />
            <Text size={12.5} weight={600} color="success">
              Licensed by the Dubai Land Department · RERA regulated
            </Text>
          </View>
          <Text size={12} color="muted" align="center">
            Apex Aora Real Estate LLC · RERA ORN [placeholder] · Trade Licence [Trade Licence No.]
          </Text>
          <Text size={12} color="muted">
            Version {version}
          </Text>
        </View>
      </Container>
    </Screen>
  )
}

function ContactBtn({ label, icon, onPress }: { label: string; icon: React.ReactNode; onPress: () => void }) {
  return (
    <Pressable accessibilityRole="button" accessibilityLabel={label} onPress={onPress} style={({ pressed }) => [styles.cBtn, pressed && { backgroundColor: colors.mist }]}>
      {icon}
      <Text size={13} weight={600} color="plum">
        {label}
      </Text>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  contact: { marginTop: 20, backgroundColor: colors.white, borderRadius: radius.card, padding: 16, ...shadow.soft },
  cBtn: { flex: 1, height: 64, borderRadius: radius.md, borderWidth: 1, borderColor: colors.line, alignItems: 'center', justifyContent: 'center', gap: 4 },
  group: { backgroundColor: colors.white, borderRadius: radius.card, overflow: 'hidden', ...shadow.soft },
  row: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingHorizontal: 16, paddingVertical: 12, minHeight: 60 },
  divider: { borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: colors.line },
  icon: { width: 38, height: 38, borderRadius: 19, backgroundColor: colors.mist, alignItems: 'center', justifyContent: 'center' },
  badge: { minWidth: 22, height: 22, borderRadius: 11, paddingHorizontal: 6, backgroundColor: colors.aura, alignItems: 'center', justifyContent: 'center' },
})
