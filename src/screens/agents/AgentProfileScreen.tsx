import { LinearGradient } from 'expo-linear-gradient'
import { router } from 'expo-router'
import { BadgeCheck, ExternalLink, Languages, Mail, MapPin, Phone, Star } from 'lucide-react-native'
import { useMemo, useState } from 'react'
import { Pressable, StyleSheet, useWindowDimensions, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { agentBySlug } from '@/mocks/agents'
import { PROPERTIES } from '@/mocks/properties'
import { TESTIMONIALS } from '@/mocks/testimonials'
import type { AgentProfile, ListingKind, Testimonial } from '@/types'
import { BackButton, call, email, openUrl, whatsapp } from '@/ui/brand'
import { Button } from '@/ui/Button'
import { WhatsAppIcon } from '@/ui/icons'
import { Img } from '@/ui/Img'
import { LeadForm } from '@/ui/LeadForm'
import { Badge, Card, Container, EmptyState, SectionHead, Stat } from '@/ui/primitives'
import { PropertyCard } from '@/ui/PropertyCard'
import { Screen } from '@/ui/Screen'
import { Segmented } from '@/ui/Segmented'
import { Heading, Text } from '@/ui/Text'
import { colors, GUTTER, radius, shadow } from '@/theme'
import { Carousel } from '../company/Carousel'
import { DLD_URL } from './AgentsScreen'

const LABELS: Record<ListingKind, string> = { sale: 'For sale', rent: 'For rent', offplan: 'Off-plan' }
const ORDER: ListingKind[] = ['sale', 'rent', 'offplan']

export function AgentProfileScreen({ slug }: { slug: string }) {
  const a = agentBySlug(slug)
  if (!a) {
    return (
      <Screen variant="pushed" title="Agent">
        <Container style={{ paddingTop: 24 }}>
          <EmptyState title="Agent not found" body="This adviser profile may have moved. Meet the rest of the team instead." action={<Button title="All agents" onPress={() => router.replace('/agents')} />} />
        </Container>
      </Screen>
    )
  }
  return <Profile a={a} />
}

function Profile({ a }: { a: AgentProfile }) {
  const insets = useSafeAreaInsets()
  const { width } = useWindowDimensions()
  const first = a.name.split(' ')[0]
  const listings = useMemo(() => PROPERTIES.filter((p) => p.agentId === a.id), [a.id])
  const reviews = useMemo(() => TESTIMONIALS.filter((t) => t.quote.includes(first)), [first])
  const kinds = ORDER.filter((k) => listings.some((p) => p.kind === k))
  const [kind, setKind] = useState<ListingKind>(kinds[0] ?? 'sale')
  const waText = `Hi ${first}, I found your profile on the Apex Aura app.`

  return (
    <View style={{ flex: 1, backgroundColor: colors.paper }}>
      <Screen variant="bare" contentContainerStyle={{ paddingBottom: 110 + insets.bottom }}>
        {/* Photo header */}
        <View style={{ height: Math.min(width * 1.05, 480), backgroundColor: colors.mist }}>
          <Img src={a.photo} style={StyleSheet.absoluteFill} accessibilityLabel={a.name} />
          <LinearGradient colors={['rgba(30,24,40,0)', 'rgba(56,26,76,0.85)']} style={styles.shade} />
          <BackButton style={{ position: 'absolute', top: insets.top + 8, left: GUTTER }} />
          <View style={styles.headText}>
            <View style={styles.brn}>
              <Text size={12.5} weight={600} color="plum">
                BRN {a.brn}
              </Text>
            </View>
            <Text size={14} weight={600} color="white" style={{ marginTop: 12, opacity: 0.9 }}>
              {a.role}
            </Text>
            <Heading size={42} color="white" accessibilityRole="header">
              {a.name}
            </Heading>
          </View>
        </View>

        <Container style={{ paddingTop: 20 }}>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', columnGap: 14, rowGap: 6 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <BadgeCheck size={16} color={colors.success} />
              <Text size={14} weight={600} color="success">
                RERA-licensed · BRN {a.brn}
              </Text>
            </View>
            <Pressable accessibilityRole="link" accessibilityLabel="Verify on DLD (opens the Dubai Land Department site)" onPress={() => openUrl(DLD_URL)} hitSlop={10} style={{ flexDirection: 'row', alignItems: 'center', gap: 4, paddingVertical: 6 }}>
              <Text size={14} weight={600} color="aura">
                Verify on DLD
              </Text>
              <ExternalLink size={14} color={colors.aura} />
            </Pressable>
          </View>

          <View style={styles.stats}>
            <View style={{ flex: 1 }}>
              <Stat label="Years of experience" value={String(a.yearsExperience)} />
            </View>
            <View style={{ flex: 1 }}>
              <Stat label="Deals closed" value={`${a.dealsClosed}+`} />
            </View>
          </View>

          <Text size={16} lineHeight={26} style={{ marginTop: 20, opacity: 0.85 }}>
            {a.bio}
          </Text>

          <View style={{ gap: 16, marginTop: 20 }}>
            <Fact icon={<Languages size={14} color={colors.muted} />} label="Languages" value={a.languages.join(', ')} />
            <Fact icon={<MapPin size={14} color={colors.muted} />} label="Communities" value={a.communities.join(', ')} />
            <View>
              <Text size={12} color="muted">
                Specialities
              </Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 8 }}>
                {a.specialities.map((s) => (
                  <Badge key={s}>{s}</Badge>
                ))}
              </View>
            </View>
          </View>

          <View style={{ gap: 10, marginTop: 24 }}>
            <Button title={`Call ${first}`} variant="plum" full icon={<Phone size={16} color={colors.white} />} onPress={() => call(a.phone)} />
            <Button title="WhatsApp" variant="whatsapp" full icon={<WhatsAppIcon size={16} />} onPress={() => whatsapp(a.whatsapp, waText)} />
            <Button title={`Email ${first}`} variant="outline" full icon={<Mail size={16} color={colors.plum} />} onPress={() => email(a.email, 'Enquiry from the Apex Aura app')} />
          </View>
        </Container>

        {/* Listings */}
        <View style={{ marginTop: 44 }}>
          <Container>
            <SectionHead title={`${first}’s listings`} sub="Every listing carries a valid DLD Trakheesi permit." />
          </Container>
          {kinds.length === 0 ? (
            <Container>
              <EmptyState
                title="No live listings right now"
                body={`${first} is between listings. Browse the full market or send a message to hear about new homes first.`}
                action={<Button title="Browse homes for sale" onPress={() => router.push({ pathname: '/search', params: { kind: 'sale' } })} />}
              />
            </Container>
          ) : (
            <>
              <Segmented
                style={{ marginHorizontal: GUTTER, alignSelf: 'flex-start', marginBottom: 14 }}
                value={kind}
                onChange={setKind}
                tabs={kinds.map((k) => ({ key: k, label: `${LABELS[k]} (${listings.filter((p) => p.kind === k).length})` }))}
              />
              <Carousel key={kind} data={listings.filter((p) => p.kind === kind)} keyOf={(p) => p.id} render={(p, w) => <PropertyCard listing={p} width={w} />} />
            </>
          )}
        </View>

        {reviews.length > 0 ? (
          <Container style={{ marginTop: 44 }}>
            <SectionHead title="What clients say" />
            <View style={{ gap: 14 }}>
              {reviews.map((t) => (
                <TestimonialCard key={t.name} t={t} />
              ))}
            </View>
          </Container>
        ) : null}

        <Container style={{ marginTop: 44 }}>
          <Card style={{ padding: 22 }}>
            <Heading size={28}>Request a callback from {first}</Heading>
            <Text size={14.5} color="muted" style={{ marginTop: 8, marginBottom: 18 }}>
              Leave your number and {first} will call you back, usually the same day.
            </Text>
            <LeadForm
              type="callback"
              context={{ agentId: a.id }}
              withMessage
              extraFields={[{ name: 'time', label: 'Best time to call', kind: 'select', options: ['Any time', 'Morning', 'Afternoon', 'Evening'] }]}
              submitLabel="Request a callback"
              successText={`Thanks — ${first} will call you back shortly.`}
            />
          </Card>
        </Container>
      </Screen>

      {/* Sticky action bar */}
      <View style={[styles.bar, { paddingBottom: insets.bottom + 12 }]}>
        <Button title={`Call ${first}`} variant="plum" icon={<Phone size={16} color={colors.white} />} onPress={() => call(a.phone)} style={{ flex: 1 }} full accessibilityLabel={`Call ${a.name}`} />
        <Button title="WhatsApp" variant="whatsapp" icon={<WhatsAppIcon size={16} />} onPress={() => whatsapp(a.whatsapp, waText)} style={{ flex: 1 }} full accessibilityLabel={`WhatsApp ${a.name}`} />
      </View>
    </View>
  )
}

function Fact({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <View>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
        {icon}
        <Text size={12} color="muted">
          {label}
        </Text>
      </View>
      <Text size={14.5} weight={500} style={{ marginTop: 3 }}>
        {value}
      </Text>
    </View>
  )
}

export function TestimonialCard({ t }: { t: Testimonial }) {
  return (
    <Card style={{ padding: 22 }}>
      <View style={{ flexDirection: 'row', gap: 4 }} accessibilityLabel={`${t.rating} out of 5 stars`} accessibilityRole="image">
        {Array.from({ length: t.rating }).map((_, s) => (
          <Star key={s} size={16} color={colors.aura} fill={colors.aura} />
        ))}
      </View>
      <Text display weight={500} size={23} lineHeight={30} color="plum" style={{ marginTop: 14 }}>
        “{t.quote}”
      </Text>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 16 }}>
        <Img src={t.avatar} style={{ width: 44, height: 44, borderRadius: 22 }} />
        <View style={{ flex: 1 }}>
          <Text size={15} weight={600}>
            {t.name}
          </Text>
          <Text size={13} color="muted">
            {t.context}
          </Text>
        </View>
      </View>
    </Card>
  )
}

const styles = StyleSheet.create({
  shade: { position: 'absolute', left: 0, right: 0, bottom: 0, height: '55%' },
  headText: { position: 'absolute', left: GUTTER, right: GUTTER, bottom: 22 },
  brn: { alignSelf: 'flex-start', backgroundColor: 'rgba(255,255,255,0.95)', borderRadius: radius.pill, paddingHorizontal: 12, paddingVertical: 5 },
  stats: { flexDirection: 'row', gap: 16, marginTop: 18, backgroundColor: colors.white, borderRadius: radius.card, padding: 18, ...shadow.soft },
  bar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: GUTTER,
    paddingTop: 12,
    backgroundColor: colors.white,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.line,
  },
})
