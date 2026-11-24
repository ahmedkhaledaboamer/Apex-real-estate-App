import { router, useLocalSearchParams } from 'expo-router'
import { BadgeCheck, Check, Heart, MapPin, Phone, Scale, Share2 } from 'lucide-react-native'
import { useRef, useState } from 'react'
import { Pressable, ScrollView, Share, StyleSheet, useWindowDimensions, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { useCompare, useCurrency, useFavorite } from '@/features/favorites/hooks'
import { formatNumber, formatPrice } from '@/lib/format'
import { agentProfileById } from '@/mocks/agents'
import { propertyById } from '@/mocks/properties'
import { colors, GUTTER, radius, shadow } from '@/theme'
import type { Property } from '@/types'
import { BackButton, call, whatsapp } from '@/ui/brand'
import { Button } from '@/ui/Button'
import { Gallery } from '@/ui/Gallery'
import { WhatsAppIcon } from '@/ui/icons'
import { LeadForm } from '@/ui/LeadForm'
import { Badge, Container, EmptyState, SectionHead } from '@/ui/primitives'
import { PropertyCard } from '@/ui/PropertyCard'
import { Screen } from '@/ui/Screen'
import { Segmented } from '@/ui/Segmented'
import { Heading, Text } from '@/ui/Text'
import { Carousel, goToSearch, LinkAction } from '../home/common'
import { CostBreakdown } from './CostBreakdown'
import { AgentCard, agentMessage, Amenities, KeyFacts, LocationSection, OffPlanDetails, Panel, RegulatoryInfo, similarTo } from './parts'

const KIND_LABEL: Record<Property['kind'], string> = { sale: 'For sale', rent: 'For rent', offplan: 'Off-plan' }

export function PropertyScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const property = id ? propertyById(id) : undefined
  if (!property) {
    return (
      <Screen variant="pushed" title="Property">
        <Container style={{ paddingTop: 24 }}>
          <EmptyState
            title="We couldn’t find this property"
            body="It may have been sold, let or withdrawn. Browse the latest verified listings instead."
            action={<Button title="Back to search" onPress={() => goToSearch({ kind: 'buy' })} />}
          />
        </Container>
      </Screen>
    )
  }
  return <PropertyDetail key={property.id} property={property} />
}

function PropertyDetail({ property: p }: { property: Property }) {
  const insets = useSafeAreaInsets()
  const { width } = useWindowDimensions()
  const currency = useCurrency()
  const fav = useFavorite(p.id)
  const cmp = useCompare(p.id)
  const agent = agentProfileById(p.agentId)
  const rent = p.kind === 'rent'
  const pricePerSqft = Math.round(p.priceAed / p.sqft)
  const scrollRef = useRef<React.ComponentRef<typeof ScrollView>>(null)
  const enquiryY = useRef(0)
  const bodyY = useRef(0)
  const [tab, setTab] = useState<'enquiry' | 'viewing'>('enquiry')
  const similar = similarTo(p)
  const cardW = Math.round(width * 0.85)
  const barHeight = 72 + insets.bottom

  const share = () =>
    Share.share({
      title: p.title,
      message: `${p.title} — ${p.building}, ${p.community}. ${formatPrice(p.priceAed, currency)}${rent ? ' /year' : ''}. Permit ${p.permit}. Apex Aura`,
    }).catch(() => undefined)

  const context = { propertyId: p.id, agentId: agent.id }

  return (
    <View style={{ flex: 1, backgroundColor: colors.paper }}>
      <ScrollView ref={scrollRef} keyboardShouldPersistTaps="handled" contentContainerStyle={{ paddingBottom: barHeight + 24 }}>
        <Gallery images={p.images} height={340} alt={p.title}>
          <View style={[styles.overlay, { top: insets.top + 8 }]} pointerEvents="box-none">
            <BackButton />
            <View style={{ flexDirection: 'row', gap: 10 }}>
              <RoundButton label={fav.favorite ? 'Remove from favourites' : 'Save to favourites'} selected={fav.favorite} onPress={fav.toggle}>
                <Heart size={20} color={fav.favorite ? colors.aura : colors.plum} fill={fav.favorite ? colors.aura : 'transparent'} />
              </RoundButton>
              <RoundButton label="Share" onPress={share}>
                <Share2 size={19} color={colors.plum} />
              </RoundButton>
              <RoundButton
                label={cmp.inCompare ? 'Remove from compare' : cmp.full ? 'Compare list is full (4 properties)' : 'Add to compare'}
                selected={cmp.inCompare}
                disabled={cmp.full}
                onPress={cmp.toggle}
              >
                {cmp.inCompare ? <Check size={19} color={colors.aura} /> : <Scale size={19} color={colors.plum} />}
              </RoundButton>
            </View>
          </View>
        </Gallery>

        {/* Title + price */}
        <Container style={{ paddingTop: 22 }}>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
            <Badge tone="plum">{KIND_LABEL[p.kind]}</Badge>
            <Badge icon={<BadgeCheck size={13} color={colors.success} />}>
              <Text size={12} weight={600} color="success">
                Verified listing
              </Text>
            </Badge>
            <Badge>{p.type}</Badge>
          </View>
          <Heading size={36} lineHeight={38} style={{ marginTop: 12 }} accessibilityRole="header">
            {p.title}
          </Heading>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 6 }}>
            <MapPin size={15} color={colors.aura} />
            <Text size={14.5} color="muted" style={{ flex: 1 }}>
              {p.building}, {p.community}
            </Text>
          </View>
          <Text size={30} weight={700} color="plum" tracking={-0.01} style={{ marginTop: 16 }}>
            {formatPrice(p.priceAed, currency)}
            {rent ? (
              <Text size={16} weight={500} color="muted">
                {' '}
                /year
              </Text>
            ) : null}
          </Text>
          <Text size={13} color="muted">
            {rent ? `${p.cheques ?? 1} cheque${(p.cheques ?? 1) > 1 ? 's' : ''} accepted` : `${formatPrice(pricePerSqft, currency)} per sq ft · ${formatNumber(p.sqft)} sq ft`}
          </Text>
          {cmp.inCompare ? <LinkAction label="View compare list" onPress={() => router.push('/compare')} style={{ marginTop: 8 }} /> : null}
        </Container>

        {/* Body */}
        <Container style={{ gap: 16, marginTop: 24 }} onLayout={(e) => (bodyY.current = e.nativeEvent.layout.y)}>
          <Panel title="Key facts">
            <KeyFacts property={p} />
          </Panel>

          <Panel title="About this property">
            <View style={{ gap: 14 }}>
              {p.description.map((para, i) => (
                <Text key={i} size={15} lineHeight={24} color="ink" style={{ opacity: 0.85 }}>
                  {para}
                </Text>
              ))}
            </View>
            {!rent ? (
              <Text size={13} color="muted" style={{ marginTop: 16 }}>
                Service charge approx. {formatPrice(p.serviceChargePerSqft, currency)} per sq ft per year ({formatPrice(p.serviceChargePerSqft * p.sqft, currency)} a year).
              </Text>
            ) : null}
          </Panel>

          <Panel title="Amenities">
            <Amenities items={p.amenities} />
          </Panel>

          {p.kind === 'offplan' ? (
            <Panel title="Off-plan details">
              <OffPlanDetails property={p} />
            </Panel>
          ) : null}

          <Panel title={rent ? 'Move-in costs' : 'Cost to buy'}>
            <CostBreakdown property={p} />
          </Panel>

          <Panel title="Location">
            <LocationSection property={p} />
          </Panel>

          <Panel title="Regulatory information">
            <RegulatoryInfo property={p} agent={agent} />
          </Panel>

          <AgentCard property={p} agent={agent} />

          <View
            onLayout={(e) => {
              enquiryY.current = e.nativeEvent.layout.y
            }}
            style={styles.enquiry}
          >
            <Segmented
              tabs={[
                { key: 'enquiry', label: 'Enquire' },
                { key: 'viewing', label: 'Book a viewing' },
              ]}
              value={tab}
              onChange={setTab}
              style={{ marginBottom: 18, alignSelf: 'flex-start' }}
            />
            {tab === 'enquiry' ? (
              <LeadForm
                key="enquiry"
                type="enquiry"
                context={context}
                withMessage
                defaultMessage={`Hi, I'd like more details on ${p.title} in ${p.community} (ref ${p.reference}).`}
                submitLabel="Send enquiry"
              />
            ) : (
              <LeadForm
                key="viewing"
                type="viewing"
                context={context}
                withDate
                submitLabel="Request viewing"
                successText={`Thanks — ${agent.name.split(' ')[0]} will confirm your viewing time shortly.`}
              />
            )}
          </View>
        </Container>

        {similar.length > 0 ? (
          <View style={{ marginTop: 40 }}>
            <Container>
              <SectionHead
                title="Similar properties"
                sub={`More ${rent ? 'rentals' : p.kind === 'offplan' ? 'off-plan homes' : 'homes for sale'} like this one, picked by community, type and price.`}
              />
              <LinkAction
                label={`View all ${rent ? 'rentals' : p.kind === 'offplan' ? 'off-plan homes' : 'properties for sale'}`}
                onPress={() => goToSearch({ kind: rent ? 'rent' : p.kind === 'offplan' ? 'offplan' : 'buy' })}
                style={{ marginTop: -8, marginBottom: 16 }}
              />
            </Container>
            <Carousel data={similar} itemWidth={cardW} keyExtractor={(l) => l.id} label="Similar properties" renderItem={({ item }) => <PropertyCard listing={item} width={cardW} />} />
          </View>
        ) : null}
      </ScrollView>

      {/* Sticky action bar */}
      <View style={[styles.bar, { paddingBottom: insets.bottom + 12 }]}>
        <Pressable accessibilityRole="button" accessibilityLabel={`Call ${agent.name}`} onPress={() => call(agent.phone)} style={styles.barCall}>
          <Phone size={18} color={colors.plum} />
        </Pressable>
        <Pressable accessibilityRole="button" accessibilityLabel={`WhatsApp ${agent.name}`} onPress={() => whatsapp(agent.whatsapp, agentMessage(agent, p))} style={styles.barWa}>
          <WhatsAppIcon size={20} />
        </Pressable>
        <Button
          title="Enquire"
          accessibilityLabel="Enquire about this property"
          size="lg"
          style={{ flex: 1 }}
          onPress={() => {
            setTab('enquiry')
            scrollRef.current?.scrollTo({ y: Math.max(0, bodyY.current + enquiryY.current - insets.top - 16), animated: true })
          }}
        />
      </View>
    </View>
  )
}

function RoundButton({ label, onPress, children, selected, disabled }: { label: string; onPress: () => void; children: React.ReactNode; selected?: boolean; disabled?: boolean }) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ selected, disabled }}
      disabled={disabled}
      onPress={onPress}
      hitSlop={4}
      style={({ pressed }) => [styles.round, disabled && { opacity: 0.5 }, pressed && { transform: [{ scale: 0.94 }] }]}
    >
      {children}
    </Pressable>
  )
}

const styles = StyleSheet.create({
  overlay: { position: 'absolute', left: GUTTER, right: GUTTER, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  round: { width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(255,255,255,0.95)', alignItems: 'center', justifyContent: 'center', ...shadow.soft },
  enquiry: { backgroundColor: colors.white, borderRadius: radius.card, padding: 20, ...shadow.soft },
  bar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: GUTTER,
    paddingTop: 12,
    backgroundColor: 'rgba(255,255,255,0.97)',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.line,
    ...shadow.lift,
  },
  barCall: { width: 52, height: 52, borderRadius: 26, borderWidth: 1, borderColor: 'rgba(56,26,76,0.2)', alignItems: 'center', justifyContent: 'center' },
  barWa: { width: 52, height: 52, borderRadius: 26, backgroundColor: colors.whatsapp, alignItems: 'center', justifyContent: 'center' },
})
