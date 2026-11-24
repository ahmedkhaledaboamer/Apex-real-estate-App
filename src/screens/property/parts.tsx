import { router } from 'expo-router'
import {
  AirVent,
  Armchair,
  Baby,
  BadgeCheck,
  Bath,
  BedDouble,
  BedSingle,
  Building2,
  CalendarClock,
  CalendarDays,
  Car,
  Check,
  Clock,
  ConciergeBell,
  CookingPot,
  Dumbbell,
  ExternalLink,
  Eye,
  Flame,
  Flower2,
  Footprints,
  Hash,
  KeyRound,
  MapPin,
  Maximize2,
  Phone,
  ShieldCheck,
  Shirt,
  Smartphone,
  SquareParking,
  Sun,
  Trees,
  Wallet,
  Waves,
  type LucideIcon,
} from 'lucide-react-native'
import { StyleSheet, View } from 'react-native'

import { useCurrency } from '@/features/favorites/hooks'
import { FURNISHING_LABEL } from '@/features/search/options'
import { formatDate, formatNumber, formatPrice } from '@/lib/format'
import { communityBySlug } from '@/mocks/communities'
import { PROPERTIES } from '@/mocks/properties'
import { projectBySlug } from '@/mocks/projects'
import { colors, radius, shadow } from '@/theme'
import type { AgentProfile, Property } from '@/types'
import { call, openUrl, whatsapp } from '@/ui/brand'
import { Button } from '@/ui/Button'
import { WhatsAppIcon } from '@/ui/icons'
import { Img } from '@/ui/Img'
import { LocationMap } from '@/ui/LocationMap'
import { Heading, Text } from '@/ui/Text'
import { goToSearch, LinkAction } from '../home/common'

/** White panel with a serif title (site: PropertyDetail Panel). */
export function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={styles.panel}>
      <Heading size={28} lineHeight={30} style={{ marginBottom: 18 }} accessibilityRole="header">
        {title}
      </Heading>
      {children}
    </View>
  )
}

/* ---------- Key facts ---------- */

export function KeyFacts({ property: p }: { property: Property }) {
  const facts: { icon: LucideIcon; label: string; value: string }[] = [
    { icon: BedDouble, label: 'Bedrooms', value: p.beds === 0 ? 'Studio' : String(p.beds) },
    { icon: Bath, label: 'Bathrooms', value: String(p.baths) },
    { icon: Maximize2, label: 'Built-up area', value: `${formatNumber(p.sqft)} sq ft` },
    { icon: Building2, label: 'Property type', value: p.type },
    { icon: KeyRound, label: 'Completion', value: p.completion === 'offplan' ? `Off-plan${p.handover ? ` · ${p.handover}` : ''}` : 'Ready' },
    { icon: Armchair, label: 'Furnishing', value: FURNISHING_LABEL[p.furnishing] },
    { icon: SquareParking, label: 'Parking', value: `${p.parking} space${p.parking > 1 ? 's' : ''}` },
    { icon: Eye, label: 'View', value: p.view },
    { icon: Hash, label: 'Reference', value: p.reference },
    { icon: CalendarDays, label: 'Listed', value: formatDate(p.listedOn) },
  ]
  return (
    <View style={styles.grid}>
      {facts.map((f) => (
        <View key={f.label} style={styles.fact} accessible accessibilityLabel={`${f.label}: ${f.value}`}>
          <View style={styles.factIcon}>
            <f.icon size={18} color={colors.aura} />
          </View>
          <View style={{ flex: 1 }}>
            <Text size={12} color="muted">
              {f.label}
            </Text>
            <Text size={14.5} weight={600} color="plum">
              {f.value}
            </Text>
          </View>
        </View>
      ))}
    </View>
  )
}

/* ---------- Amenities ---------- */

const ICONS: [RegExp, LucideIcon][] = [
  [/pool|lagoon/i, Waves],
  [/gym/i, Dumbbell],
  [/security/i, ShieldCheck],
  [/parking/i, Car],
  [/concierge/i, ConciergeBell],
  [/wardrobe/i, Shirt],
  [/a\/c|air/i, AirVent],
  [/balcony|terrace/i, Sun],
  [/kitchen/i, CookingPot],
  [/smart/i, Smartphone],
  [/maid|driver/i, BedSingle],
  [/spa/i, Flower2],
  [/garden|park/i, Trees],
  [/kids|play/i, Baby],
  [/jogging|track/i, Footprints],
  [/bbq/i, Flame],
]
const iconFor = (name: string) => ICONS.find(([re]) => re.test(name))?.[1] ?? Check

export function Amenities({ items }: { items: string[] }) {
  return (
    <View style={{ gap: 10 }}>
      {items.map((a) => {
        const Icon = iconFor(a)
        return (
          <View key={a} style={styles.amenity}>
            <Icon size={18} color={colors.aura} />
            <Text size={14.5} weight={500} style={{ flex: 1 }}>
              {a}
            </Text>
          </View>
        )
      })}
    </View>
  )
}

/* ---------- Off-plan details ---------- */

export function OffPlanDetails({ property: p }: { property: Property }) {
  const currency = useCurrency()
  const project = p.projectSlug ? projectBySlug(p.projectSlug) : undefined
  const tiles = [
    { icon: CalendarClock, label: 'Expected handover', value: p.handover ?? 'To be confirmed' },
    { icon: Wallet, label: 'Payment plan', value: p.paymentPlan ?? 'On request' },
    { icon: ShieldCheck, label: 'Payments held in', value: project ? project.escrowBank : 'DLD escrow' },
  ]
  return (
    <View>
      <View style={{ gap: 10 }}>
        {tiles.map((t) => (
          <View key={t.label} style={styles.mistTile}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <t.icon size={16} color={colors.aura} />
              <Text size={12} color="muted">
                {t.label}
              </Text>
            </View>
            <Text size={18} weight={700} color="plum" style={{ marginTop: 4 }}>
              {t.value}
            </Text>
          </View>
        ))}
      </View>
      {project ? (
        <>
          <Text size={15} weight={600} color="plum" style={{ marginTop: 24 }}>
            {project.name} payment schedule
          </Text>
          <View style={[styles.table, { marginTop: 12 }]}>
            {project.paymentPlan.map((m, i) => (
              <View key={m.label} style={[styles.milestone, i > 0 && styles.divider]}>
                <Text size={15} weight={700} color="aura" style={{ width: 48 }}>
                  {m.percent}%
                </Text>
                <View style={{ flex: 1 }}>
                  <Text size={14.5} weight={500}>
                    {m.label}
                  </Text>
                  <Text size={12.5} color="muted">
                    {m.due}
                  </Text>
                </View>
                <Text size={14} weight={600} color="plum">
                  {formatPrice((p.priceAed * m.percent) / 100, currency)}
                </Text>
              </View>
            ))}
          </View>
          <Text size={12.5} color="muted" style={{ marginTop: 12 }}>
            Amounts are indicative for this unit’s asking price. DLD project no. {project.dldProjectNumber}. No guaranteed-return claims.
          </Text>
          <LinkAction label={`View the ${project.name} project`} onPress={() => router.push(`/project/${project.slug}`)} style={{ marginTop: 14 }} />
        </>
      ) : (
        <LinkAction label="Explore all off-plan projects" onPress={() => goToSearch({ kind: 'offplan' })} style={{ marginTop: 14 }} />
      )}
    </View>
  )
}

/* ---------- Location ---------- */

export function LocationSection({ property: p }: { property: Property }) {
  const community = communityBySlug(p.communitySlug)
  return (
    <View>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        <MapPin size={16} color={colors.aura} />
        <Text size={15} weight={500} style={{ flex: 1 }}>
          {p.building}, {p.community}, Dubai
        </Text>
      </View>
      <LocationMap markers={[{ id: p.id, position: p.location }]} style={{ height: 260, marginTop: 14 }} />
      {community ? (
        <View style={{ marginTop: 18 }}>
          <Text size={14.5} lineHeight={23} color="muted">
            {community.summary}
          </Text>
          {community.commute?.length ? (
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 14 }}>
              {community.commute.map((c) => (
                <View key={c.to} style={styles.commute}>
                  <Clock size={13} color={colors.plum} />
                  <Text size={12.5} weight={500} color="plum">
                    {c.minutes} min to {c.to}
                  </Text>
                </View>
              ))}
            </View>
          ) : null}
          <LinkAction label={`Explore the ${community.name} guide`} onPress={() => router.push(`/community/${community.slug}`)} style={{ marginTop: 14 }} />
        </View>
      ) : null}
    </View>
  )
}

/* ---------- Regulatory ---------- */

export function RegulatoryInfo({ property: p, agent }: { property: Property; agent: AgentProfile }) {
  const rows = [
    { label: 'Trakheesi permit', value: p.permit },
    { label: 'Agent BRN', value: `${agent.brn} · ${agent.name}` },
    { label: 'Brokerage ORN', value: '[placeholder]' },
    { label: 'Listing reference', value: p.reference },
  ]
  return (
    <View>
      <View style={{ flexDirection: 'row', gap: 8, alignItems: 'flex-start' }}>
        <BadgeCheck size={20} color={colors.success} style={{ marginTop: 1 }} />
        <Text size={14.5} lineHeight={22} color="muted" style={{ flex: 1 }}>
          This advert is licensed by the Dubai Land Department. Check the permit number before you pay any deposit.
        </Text>
      </View>
      <View style={{ gap: 10, marginTop: 16 }}>
        {rows.map((r) => (
          <View key={r.label} style={styles.regRow}>
            <Text size={12} color="muted">
              {r.label}
            </Text>
            <Text size={15} weight={600} color="plum" style={{ marginTop: 2 }}>
              {r.value}
            </Text>
          </View>
        ))}
      </View>
      <Button
        variant="ghost"
        title="Verify on DLD"
        iconRight={<ExternalLink size={16} color={colors.plum} />}
        onPress={() => openUrl('https://dubailand.gov.ae')}
        style={{ marginTop: 8, marginLeft: -20 }}
        accessibilityHint="Opens the Dubai Land Department website"
      />
    </View>
  )
}

/* ---------- Agent ---------- */

export const agentMessage = (agent: AgentProfile, p: Property) =>
  `Hi ${agent.name.split(' ')[0]}, I'm interested in ${p.title} in ${p.community} (ref ${p.reference}, permit ${p.permit}).`

export function AgentCard({ property: p, agent }: { property: Property; agent: AgentProfile }) {
  return (
    <View style={styles.panel}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
        <Img src={agent.photo} style={{ width: 64, height: 64, borderRadius: 32 }} accessibilityLabel={agent.name} />
        <View style={{ flex: 1 }}>
          <Text size={17} weight={600} color="plum" numberOfLines={1}>
            {agent.name}
          </Text>
          <Text size={13.5} color="muted">
            {agent.role}
          </Text>
          <Text size={12} color="muted">
            BRN {agent.brn}
          </Text>
        </View>
      </View>
      <Text size={13.5} color="muted" style={{ marginTop: 14 }}>
        Speaks{' '}
        <Text size={13.5} weight={500}>
          {agent.languages.join(', ')}
        </Text>
      </Text>
      <LinkAction label="View profile" onPress={() => router.push(`/agent/${agent.slug}`)} style={{ marginTop: 6 }} />
      <View style={{ flexDirection: 'row', gap: 10, marginTop: 16 }}>
        <Button variant="outline" title="Call" icon={<Phone size={16} color={colors.plum} />} onPress={() => call(agent.phone)} style={{ flex: 1 }} accessibilityLabel={`Call ${agent.name}`} />
        <Button
          variant="whatsapp"
          title="WhatsApp"
          icon={<WhatsAppIcon size={16} />}
          onPress={() => whatsapp(agent.whatsapp, agentMessage(agent, p))}
          style={{ flex: 1 }}
          accessibilityLabel={`WhatsApp ${agent.name}`}
        />
      </View>
    </View>
  )
}

/* ---------- Similar ---------- */

/** Up to `limit` listings of the same kind, ranked by same community, then type, then closest price (site: similarTo). */
export function similarTo(p: Property, limit = 6): Property[] {
  return PROPERTIES.filter((x) => x.kind === p.kind && x.id !== p.id)
    .map((x) => ({
      x,
      score: (x.communitySlug === p.communitySlug ? 2 : 0) + (x.type === p.type ? 1 : 0),
      gap: Math.abs(Math.log(x.priceAed / p.priceAed)),
    }))
    .sort((a, b) => b.score - a.score || a.gap - b.gap)
    .slice(0, limit)
    .map((s) => s.x)
}

const styles = StyleSheet.create({
  panel: { backgroundColor: colors.white, borderRadius: radius.card, padding: 20, ...shadow.soft },
  grid: { flexDirection: 'row', flexWrap: 'wrap', rowGap: 18 },
  fact: { width: '50%', flexDirection: 'row', alignItems: 'flex-start', gap: 10, paddingRight: 8 },
  factIcon: { width: 38, height: 38, borderRadius: 19, backgroundColor: colors.mist, alignItems: 'center', justifyContent: 'center' },
  amenity: { flexDirection: 'row', alignItems: 'center', gap: 12, borderWidth: 1, borderColor: 'rgba(217,207,227,0.7)', borderRadius: radius.md, paddingHorizontal: 16, paddingVertical: 12 },
  mistTile: { backgroundColor: colors.mist, borderRadius: radius.md, padding: 16 },
  table: { borderTopWidth: StyleSheet.hairlineWidth, borderBottomWidth: StyleSheet.hairlineWidth, borderColor: colors.line },
  milestone: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12 },
  divider: { borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: colors.line },
  commute: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: colors.mist, borderRadius: radius.pill, paddingHorizontal: 12, paddingVertical: 6 },
  regRow: { borderWidth: 1, borderColor: 'rgba(217,207,227,0.7)', borderRadius: radius.md, paddingHorizontal: 16, paddingVertical: 12 },
})
