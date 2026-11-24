import { router } from 'expo-router'
import { Building2, CalendarClock, Check, Clock, MapPin } from 'lucide-react-native'
import { useRef, useState } from 'react'
import { Pressable, ScrollView, StyleSheet, View, type ScrollViewInstance } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { useCurrency } from '@/features/favorites/hooks'
import { formatNumber, formatPrice } from '@/lib/format'
import { agentProfileById } from '@/mocks/agents'
import { communityBySlug } from '@/mocks/communities'
import { PROJECT_DETAILS, projectBySlug } from '@/mocks/projects'
import { PROPERTIES } from '@/mocks/properties'
import { colors, GUTTER, radius, shadow } from '@/theme'
import type { UnitType } from '@/types'
import { BackButton } from '@/ui/brand'
import { Button } from '@/ui/Button'
import { Gallery } from '@/ui/Gallery'
import { LocationMap } from '@/ui/LocationMap'
import { Card, Container, SectionHead, Stat } from '@/ui/primitives'
import { PropertyCard } from '@/ui/PropertyCard'
import { Heading, Text } from '@/ui/Text'
import { ArrowLink, Block, goOffplanSearch, NotFound } from './Bits'
import { Carousel, useCarouselWidth } from './Carousel'
import { PaymentPlan } from './PaymentPlan'
import { ProjectCard, StatusPill } from './ProjectCard'
import { ProjectEnquiry } from './ProjectEnquiry'
import { RegulatoryBox } from './RegulatoryBox'
import { UnitTypes } from './UnitTypes'

const BAR_HEIGHT = 72

export function ProjectScreen({ slug }: { slug: string }) {
  const project = projectBySlug(slug)
  const currency = useCurrency()
  const insets = useSafeAreaInsets()
  const cardWidth = useCarouselWidth()
  const scroll = useRef<ScrollViewInstance>(null)
  const formY = useRef(0)
  const [selectedUnit, setSelectedUnit] = useState<string | null>(null)

  if (!project)
    return <NotFound title="Project not found" body="This launch may have sold out or been removed. Browse the projects we’re selling now." cta="Browse off-plan projects" href={{ pathname: '/search', params: { kind: 'offplan' } }} />

  const agent = agentProfileById('daniel')
  const community = communityBySlug(project.communitySlug)
  const units = PROPERTIES.filter((p) => p.projectSlug === project.slug)
  const others = PROJECT_DETAILS.filter((p) => p.slug !== project.slug)

  const scrollToForm = () => scroll.current?.scrollTo({ y: Math.max(0, formY.current - insets.top - 12), animated: true })
  const enquire = (u: UnitType) => {
    setSelectedUnit(u.type)
    scrollToForm()
  }

  const facts = [
    { label: 'Launch date', value: project.launchDate },
    { label: 'Handover', value: project.handover },
    { label: 'Floors', value: formatNumber(project.floors) },
    { label: 'Total units', value: formatNumber(project.totalUnits) },
    { label: 'DLD project no.', value: project.dldProjectNumber },
    { label: 'Escrow bank', value: project.escrowBank },
  ]

  return (
    <View style={{ flex: 1, backgroundColor: colors.paper }}>
      <ScrollView ref={scroll} keyboardShouldPersistTaps="handled" contentContainerStyle={{ paddingBottom: BAR_HEIGHT + insets.bottom + 32 }}>
        <Gallery images={project.gallery} height={340} alt={project.name}>
          <BackButton style={{ position: 'absolute', top: insets.top + 8, left: 16 }} />
          <StatusPill status={project.status} style={{ position: 'absolute', top: insets.top + 16, right: 16 }} />
        </Gallery>

        {/* Title block (site: PageHero) */}
        <Container style={{ paddingTop: 22 }}>
          <View style={styles.chips}>
            <LinkChip icon={<Building2 size={14} color={colors.plum} />} label={project.developer} a11y={`Developer: ${project.developer}`} onPress={() => router.push(`/developer/${project.developerSlug}`)} />
            <LinkChip icon={<MapPin size={14} color={colors.plum} />} label={project.community} a11y={`Community: ${project.community}`} onPress={() => router.push(`/community/${project.communitySlug}`)} />
          </View>
          <Heading size={40} style={{ marginTop: 14 }}>
            {project.name}
          </Heading>
          <Text size={15.5} color="muted" style={{ marginTop: 8 }}>
            {project.summary}
          </Text>
          <View style={styles.headline}>
            <View>
              <Text size={12} color="muted">
                From
              </Text>
              <Text size={22} weight={700} color="plum">
                {formatPrice(project.fromAed, currency)}
              </Text>
            </View>
            <View>
              <Text size={12} color="muted">
                Handover
              </Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <CalendarClock size={18} color={colors.plum} />
                <Text size={22} weight={700} color="plum">
                  {project.handover}
                </Text>
              </View>
            </View>
            <View>
              <Text size={12} color="muted">
                Payment plan
              </Text>
              <Text size={22} weight={700} color="plum">
                {project.plan}
              </Text>
            </View>
          </View>
        </Container>

        <Container style={{ gap: 20, marginTop: 24 }}>
          <Card accessibilityLabel="Key facts">
            <View style={styles.factGrid}>
              {facts.map((f) => (
                <View key={f.label} style={styles.factCell}>
                  <Stat label={f.label} value={f.value} />
                </View>
              ))}
            </View>
          </Card>

          <Block title="Overview">
            <View style={{ gap: 12 }}>
              {project.description.map((p) => (
                <Text key={p} size={15.5} lineHeight={24} color="ink" style={{ opacity: 0.85 }}>
                  {p}
                </Text>
              ))}
            </View>
            <Text size={17} weight={600} color="plum" style={{ marginTop: 24 }}>
              Amenities
            </Text>
            <View style={{ gap: 8, marginTop: 12 }}>
              {project.amenities.map((a) => (
                <View key={a} style={styles.amenity}>
                  <Check size={16} color={colors.aura} />
                  <Text size={14.5} weight={500}>
                    {a}
                  </Text>
                </View>
              ))}
            </View>
          </Block>

          <Block title={`${project.plan} payment plan`} sub="Construction-linked instalments paid into the project escrow account, with the balance on handover.">
            <PaymentPlan milestones={project.paymentPlan} unitTypes={project.unitTypes} plan={project.plan} />
          </Block>

          <Block title="Unit types & prices" sub="Starting prices from the developer’s current price list. Availability changes daily.">
            <UnitTypes units={project.unitTypes} onEnquire={enquire} />
          </Block>

          <Block title="Location" sub={`${project.name}, ${project.community}`}>
            <LocationMap markers={[{ id: project.slug, position: project.location, label: project.name, active: true }]} style={{ height: 260 }} />
            {community ? (
              <View style={{ marginTop: 20 }}>
                <Text size={16} weight={600} color="plum">
                  About {community.name}
                </Text>
                <Text size={14.5} color="muted" style={{ marginTop: 6 }}>
                  {community.summary}
                </Text>
                <View style={styles.tags}>
                  {community.lifestyle.map((l) => (
                    <View key={l} style={styles.tag}>
                      <Text size={13} weight={500} color="plum">
                        {l}
                      </Text>
                    </View>
                  ))}
                </View>
                <Text size={16} weight={600} color="plum" style={{ marginTop: 20 }}>
                  Drive times
                </Text>
                <View style={{ marginTop: 4 }}>
                  {community.commute.map((c, i) => (
                    <View key={c.to} style={[styles.commute, i > 0 && { borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: colors.line }]}>
                      <Text size={14.5} style={{ flex: 1 }}>
                        {c.to}
                      </Text>
                      <Clock size={15} color={colors.muted} />
                      <Text size={14.5} weight={600} color="plum">
                        {c.minutes} min
                      </Text>
                    </View>
                  ))}
                </View>
                <ArrowLink label={`${community.name} guide`} onPress={() => router.push(`/community/${community.slug}`)} style={{ marginTop: 10 }} />
              </View>
            ) : null}
          </Block>
        </Container>

        {units.length > 0 ? (
          <View style={{ marginTop: 36 }}>
            <Container>
              <SectionHead title={`Available units in ${project.name}`} sub="Individual units listed with a DLD advertising permit." />
            </Container>
            <Carousel data={units} itemWidth={cardWidth} keyExtractor={(u) => u.id} renderItem={(u) => <PropertyCard listing={u} width={cardWidth} />} label={`Units in ${project.name}`} />
          </View>
        ) : null}

        <Container style={{ marginTop: 36 }}>
          <RegulatoryBox project={project} />
        </Container>

        <View
          style={{ marginTop: 24, paddingHorizontal: GUTTER }}
          onLayout={(e) => {
            formY.current = e.nativeEvent.layout.y
          }}
          accessibilityLabel={`Enquire about ${project.name}`}
        >
          <ProjectEnquiry project={project} agent={agent} selectedUnit={selectedUnit} />
        </View>

        {others.length > 0 ? (
          <View style={{ marginTop: 40, paddingVertical: 40, backgroundColor: colors.white }}>
            <Container>
              <SectionHead title="Other launches" sub="More DLD-registered projects we’re selling now." action={<ArrowLink label="All" onPress={() => goOffplanSearch()} />} />
            </Container>
            <Carousel data={others} itemWidth={cardWidth} keyExtractor={(p) => p.slug} renderItem={(p) => <ProjectCard project={p} width={cardWidth} />} label="Other launches" />
          </View>
        ) : null}
      </ScrollView>

      {/* Sticky action bar */}
      <View style={[styles.bar, { paddingBottom: insets.bottom + 12 }]}>
        <View style={{ flex: 1 }}>
          <Text size={11.5} color="muted">
            From
          </Text>
          <Text size={18} weight={700} color="plum" numberOfLines={1}>
            {formatPrice(project.fromAed, currency, { compact: true })}
          </Text>
        </View>
        <Button title="Register interest" size="lg" onPress={scrollToForm} />
      </View>
    </View>
  )
}

function LinkChip({ icon, label, a11y, onPress }: { icon: React.ReactNode; label: string; a11y: string; onPress: () => void }) {
  return (
    <Pressable accessibilityRole="link" accessibilityLabel={a11y} onPress={onPress} style={({ pressed }) => [styles.linkChip, pressed && { backgroundColor: colors.mist }]}>
      {icon}
      <Text size={13.5} weight={600} color="plum">
        {label}
      </Text>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  linkChip: { flexDirection: 'row', alignItems: 'center', gap: 6, minHeight: 36, paddingHorizontal: 14, borderRadius: radius.pill, borderWidth: 1, borderColor: colors.line, backgroundColor: colors.white },
  headline: { flexDirection: 'row', flexWrap: 'wrap', columnGap: 28, rowGap: 14, marginTop: 20 },
  factGrid: { flexDirection: 'row', flexWrap: 'wrap', rowGap: 18 },
  factCell: { width: '50%', paddingRight: 10 },
  amenity: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: colors.mist, borderRadius: radius.md, paddingHorizontal: 16, paddingVertical: 12 },
  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 12 },
  tag: { backgroundColor: colors.mist, borderRadius: radius.pill, paddingHorizontal: 12, paddingVertical: 5 },
  commute: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingVertical: 11 },
  bar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingTop: 12,
    paddingHorizontal: GUTTER,
    backgroundColor: 'rgba(255,255,255,0.97)',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.line,
    ...shadow.lift,
  },
})
