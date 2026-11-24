import { LinearGradient } from 'expo-linear-gradient'
import { router } from 'expo-router'
import { ArrowRight, BadgeCheck, Building2, Car, GraduationCap, HeartPulse, ShoppingBag, Sparkles, TrainFront, Trees, Waves } from 'lucide-react-native'
import { useMemo, useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { useCurrency } from '@/features/favorites/hooks'
import { formatNumber, formatPrice } from '@/lib/format'
import { COMMUNITY_DETAILS, communityBySlug } from '@/mocks/communities'
import { PROJECT_DETAILS } from '@/mocks/projects'
import { PROPERTIES } from '@/mocks/properties'
import { colors, gradients, radius, shadow } from '@/theme'
import type { ListingKind } from '@/types'
import { BackButton } from '@/ui/brand'
import { Button } from '@/ui/Button'
import { Img } from '@/ui/Img'
import { LeadForm } from '@/ui/LeadForm'
import { LocationMap, type MapMarker } from '@/ui/LocationMap'
import { Badge, Card, Container, EmptyState, SectionHead, Stat } from '@/ui/primitives'
import { PropertyCard, propertyHref } from '@/ui/PropertyCard'
import { Screen } from '@/ui/Screen'
import { Segmented } from '@/ui/Segmented'
import { Heading, Text } from '@/ui/Text'
import { ArrowLink, goOffplanSearch, HERO_OVERLAY, NotFound } from '../offplan/Bits'
import { Carousel, useCarouselWidth } from '../offplan/Carousel'
import { ProjectMiniCard, SpecialistCard } from './Cards'
import { CommunityTile } from './CommunityTile'
import { specialistsFor } from './helpers'

const ICONS: [RegExp, typeof Sparkles][] = [
  [/mall|avenue|retail|shop/i, ShoppingBag],
  [/beach|lagoon|canal|marina|creek|waterfront|yacht|wave|pool/i, Waves],
  [/park|golf|green|sanctuary|garden|cycling|track/i, Trees],
  [/metro|tram|monorail|road|access/i, TrainFront],
  [/school|nurser/i, GraduationCap],
  [/hospital|clinic/i, HeartPulse],
]
const iconFor = (text: string) => ICONS.find(([re]) => re.test(text))?.[1] ?? Sparkles

const LABELS: Record<ListingKind, string> = { sale: 'For sale', rent: 'For rent', offplan: 'Off-plan' }
const ORDER: ListingKind[] = ['sale', 'rent', 'offplan']

export function CommunityScreen({ slug }: { slug: string }) {
  const c = communityBySlug(slug)
  const currency = useCurrency()
  const insets = useSafeAreaInsets()
  const cardWidth = useCarouselWidth()
  const tileWidth = useCarouselWidth(70, 320)

  const properties = useMemo(() => PROPERTIES.filter((p) => p.communitySlug === slug), [slug])
  const kinds = ORDER.filter((k) => properties.some((p) => p.kind === k))
  const [kind, setKind] = useState<ListingKind>(kinds[0] ?? 'sale')

  if (!c) return <NotFound title="Community not found" body="We don’t have a guide for this area yet. Browse all Dubai communities." cta="All communities" href="/communities" />

  const projects = PROJECT_DETAILS.filter((p) => p.communitySlug === c.slug)
  const specialists = specialistsFor(c.name)
  const others = COMMUNITY_DETAILS.filter((o) => o.slug !== c.slug)
  const shown = properties.filter((p) => p.kind === kind)
  const scale = Math.max(45, ...c.commute.map((x) => x.minutes))

  const markers: MapMarker[] = [
    { id: 'centre', position: c.location, label: c.name, active: true },
    ...properties.map((p) => ({ id: p.id, position: p.location, label: formatPrice(p.priceAed, currency, { compact: true }) })),
  ]

  const seeAll = () => router.push({ pathname: '/search', params: { kind, location: c.name } })
  const seeAllLabel = kind === 'rent' ? `All rentals in ${c.name}` : kind === 'offplan' ? `Off-plan in ${c.name}` : `All sales in ${c.name}`

  return (
    <Screen variant="bare">
      {/* Hero */}
      <View style={[styles.hero, { paddingTop: insets.top + 120 }]}>
        <Img src={c.image} style={StyleSheet.absoluteFill} />
        <LinearGradient {...HERO_OVERLAY} style={StyleSheet.absoluteFill} />
        <BackButton style={{ position: 'absolute', top: insets.top + 8, left: 16 }} />
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
          <Badge tone="white">{c.tag}</Badge>
          {c.freehold ? (
            <Badge tone="white" icon={<BadgeCheck size={14} color={colors.plum} />}>
              Freehold for all nationalities
            </Badge>
          ) : null}
        </View>
        <Heading size={48} color="white" style={{ marginTop: 14 }}>
          {c.name}
        </Heading>
        <Text size={16} color="white" style={{ marginTop: 10, opacity: 0.85 }}>
          {c.summary}
        </Text>
      </View>

      {/* Key figures */}
      <Container style={{ marginTop: -32 }}>
        <Card style={[styles.stats, shadow.lift]}>
          <View style={styles.cell}>
            <Stat label="Avg price" value={c.ppsf ? `${c.approx ? '~' : ''}AED ${formatNumber(c.ppsf)}` : 'Prime market'} sub={c.ppsf ? `per sq ft${c.approx ? ' · earlier snapshot' : ''}` : 'Priced per unit'} />
          </View>
          <View style={styles.cell}>
            <Stat label="Gross yield" value={c.yieldPct ? `${c.yieldPct.toFixed(2)}%` : 'On request'} sub="Before costs" />
          </View>
          <View style={styles.cell}>
            <Stat label="Avg rent, 1-bed" value={c.avgRent1Bed ? formatPrice(c.avgRent1Bed, currency) : 'On request'} sub={c.avgRent1Bed ? 'per year' : undefined} />
          </View>
          <View style={styles.cell}>
            <Stat label="Avg rent, 2-bed" value={c.avgRent2Bed ? formatPrice(c.avgRent2Bed, currency) : 'On request'} sub={c.avgRent2Bed ? 'per year' : undefined} />
          </View>
          <View style={[styles.cell, { width: '100%' }]}>
            <Stat label="Ownership" value={c.freehold ? 'Freehold' : 'Leasehold'} sub={c.freehold ? 'Open to all nationalities' : 'GCC nationals only'} />
          </View>
        </Card>
        <Text size={12} color="muted" style={{ marginTop: 10 }}>
          ~ Earlier mid-2025 snapshot. Yields are gross and vary by unit size; rents are indicative annual figures.
        </Text>
      </Container>

      {/* Guide */}
      <Container style={{ marginTop: 36, gap: 36 }}>
        <View>
          <Heading size={34}>Living in {c.name}</Heading>
          <View style={{ gap: 12, marginTop: 14 }}>
            {c.description.map((p) => (
              <Text key={p} size={16} lineHeight={25} style={{ opacity: 0.85 }}>
                {p}
              </Text>
            ))}
          </View>
        </View>

        <View>
          <Heading size={28}>Lifestyle highlights</Heading>
          <View style={{ gap: 10, marginTop: 16 }}>
            {c.lifestyle.map((item) => {
              const Icon = iconFor(item)
              return (
                <View key={item} style={styles.lifestyle}>
                  <View style={styles.roundIcon}>
                    <Icon size={20} color={colors.aura} />
                  </View>
                  <Text size={15} weight={500} style={{ flex: 1 }}>
                    {item}
                  </Text>
                </View>
              )
            })}
          </View>
        </View>

        <View>
          <Heading size={28}>Property types</Heading>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 16 }}>
            {c.propertyTypes.map((t) => (
              <View key={t} style={styles.typeChip}>
                <Building2 size={16} color={colors.aura} />
                <Text size={14} weight={500} color="plum">
                  {t}
                </Text>
              </View>
            ))}
          </View>
        </View>

        <View>
          <Heading size={28}>Schools nearby</Heading>
          <Card padded={false} style={{ marginTop: 16 }}>
            {c.schools.map((s, i) => (
              <View key={s} style={[styles.school, i > 0 && { borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: colors.line }]}>
                <GraduationCap size={20} color={colors.aura} />
                <Text size={15} style={{ flex: 1 }}>
                  {s}
                </Text>
              </View>
            ))}
          </Card>
        </View>

        <View>
          <Heading size={28}>Commute times</Heading>
          <Text size={13} color="muted" style={{ marginTop: 4 }}>
            Typical off-peak drive
          </Text>
          <Card style={{ marginTop: 14, gap: 16 }}>
            {c.commute.map((x) => (
              <View key={x.to} accessibilityLabel={`${x.to}: ${x.minutes} minutes`}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <Car size={16} color={colors.muted} />
                  <Text size={14.5} weight={500} style={{ flex: 1 }}>
                    {x.to}
                  </Text>
                  <Text size={14.5} weight={600} color="plum">
                    {x.minutes} min
                  </Text>
                </View>
                <View style={styles.track}>
                  <LinearGradient colors={gradients.aura.colors} start={gradients.aura.start} end={gradients.aura.end} style={{ height: '100%', width: `${(x.minutes / scale) * 100}%`, borderRadius: radius.pill }} />
                </View>
              </View>
            ))}
          </Card>
        </View>
      </Container>

      {/* Map */}
      <View style={{ marginTop: 40, paddingVertical: 40, backgroundColor: colors.white }}>
        <Container>
          <SectionHead title="On the map" sub={`The heart of ${c.name}, with every live Apex Aora listing in the community.`} />
          <LocationMap markers={markers} onMarkerPress={(id) => id !== 'centre' && router.push(propertyHref({ id }))} style={{ height: 340 }} />
        </Container>
      </View>

      {/* Listings */}
      <View style={{ paddingTop: 40 }}>
        <Container>
          <SectionHead title={`Properties in ${c.name}`} sub="Verified listings with a valid Trakheesi permit." />
        </Container>
        {kinds.length === 0 ? (
          <Container>
            <EmptyState
              title="No live listings right now"
              body={`New homes in ${c.name} come up every week. Browse the wider market or ask an adviser to alert you first.`}
              action={<Button title="Search all homes for sale" onPress={() => router.push({ pathname: '/search', params: { kind: 'sale', location: c.name } })} />}
            />
          </Container>
        ) : (
          <>
            <Container style={{ marginBottom: 14 }}>
              <Segmented<ListingKind> tabs={kinds.map((k) => ({ key: k, label: `${LABELS[k]} (${properties.filter((p) => p.kind === k).length})` }))} value={kind} onChange={setKind} />
            </Container>
            {shown.length === 1 ? (
              <Container>
                <PropertyCard listing={shown[0]} />
              </Container>
            ) : (
              <Carousel data={shown} itemWidth={cardWidth} keyExtractor={(p) => p.id} renderItem={(p) => <PropertyCard listing={p} width={cardWidth} />} label={`${LABELS[kind]} in ${c.name}`} />
            )}
            <Container style={{ marginTop: 14 }}>
              <Button title={seeAllLabel} variant="outline" full iconRight={<ArrowRight size={16} color={colors.plum} />} onPress={seeAll} />
            </Container>
          </>
        )}
      </View>

      {/* Off-plan projects */}
      {projects.length > 0 ? (
        <View style={{ marginTop: 40, paddingVertical: 40, backgroundColor: colors.white }}>
          <Container>
            <SectionHead title={`Off-plan in ${c.name}`} sub="DLD-registered projects with escrow-protected payment plans." action={<ArrowLink label="All" onPress={() => goOffplanSearch()} />} />
            <View style={{ gap: 16 }}>
              {projects.map((p) => (
                <ProjectMiniCard key={p.slug} project={p} />
              ))}
            </View>
          </Container>
        </View>
      ) : null}

      {/* Specialists */}
      <View style={{ paddingTop: 40 }}>
        <Container>
          <SectionHead
            title={specialists.length > 1 ? 'Your area specialists' : 'Your area specialist'}
            sub={`RERA-licensed advisers who work ${c.name} every day.`}
            action={<ArrowLink label="All agents" onPress={() => router.push('/agents')} />}
          />
        </Container>
        {specialists.length > 1 ? (
          <Carousel
            data={specialists}
            itemWidth={cardWidth}
            keyExtractor={(a) => a.id}
            renderItem={(a) => <SpecialistCard agent={a} width={cardWidth} whatsappText={`Hi ${a.name.split(' ')[0]}, I’m interested in ${c.name}.`} />}
            label="Area specialists"
          />
        ) : (
          <Container>
            {specialists.map((a) => (
              <SpecialistCard key={a.id} agent={a} whatsappText={`Hi ${a.name.split(' ')[0]}, I’m interested in ${c.name}.`} />
            ))}
          </Container>
        )}
      </View>

      {/* Shortlist form */}
      <Container style={{ marginTop: 40 }}>
        <Card style={{ padding: 22 }}>
          <Heading size={28}>Get a shortlist in {c.name}</Heading>
          <Text size={14.5} color="muted" style={{ marginTop: 8, marginBottom: 18 }}>
            Tell us your budget and must-haves. An area specialist will send matching homes within one working day.
          </Text>
          <LeadForm
            type="enquiry"
            context={{ agentId: specialists[0]?.id }}
            withMessage
            defaultMessage={`I’d like a shortlist of homes in ${c.name}.`}
            extraFields={[
              { name: 'intent', label: 'I’m looking to', kind: 'select', options: ['Buy to live', 'Buy to invest', 'Rent', 'Off-plan'] },
              { name: 'budget', label: 'Budget', kind: 'text', placeholder: 'e.g. AED 2–3M' },
            ]}
            submitLabel="Get my shortlist"
          />
        </Card>
      </Container>

      {/* Other communities */}
      <View style={{ marginTop: 40, paddingVertical: 40, backgroundColor: colors.white }}>
        <Container>
          <SectionHead title="Explore other communities" action={<ArrowLink label="All" onPress={() => router.push('/communities')} />} />
        </Container>
        <Carousel data={others} itemWidth={tileWidth} keyExtractor={(o) => o.slug} renderItem={(o) => <CommunityTile community={o} width={tileWidth} height={230} />} label="Other communities" />
      </View>
    </Screen>
  )
}

const styles = StyleSheet.create({
  hero: { paddingHorizontal: 20, paddingBottom: 64, overflow: 'hidden', backgroundColor: colors.plum },
  stats: { flexDirection: 'row', flexWrap: 'wrap', rowGap: 18, padding: 22 },
  cell: { width: '50%', paddingRight: 10 },
  lifestyle: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: colors.white, borderRadius: radius.card, padding: 14, ...shadow.soft },
  roundIcon: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.mist, alignItems: 'center', justifyContent: 'center' },
  typeChip: { flexDirection: 'row', alignItems: 'center', gap: 8, borderRadius: radius.pill, borderWidth: 1, borderColor: colors.line, backgroundColor: colors.white, paddingHorizontal: 16, paddingVertical: 9 },
  school: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 20, paddingVertical: 15 },
  track: { height: 8, borderRadius: radius.pill, backgroundColor: colors.mist, overflow: 'hidden', marginTop: 8 },
})
