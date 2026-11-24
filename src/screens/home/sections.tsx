import { router } from 'expo-router'
import { LinearGradient } from 'expo-linear-gradient'
import { ArrowRight, ArrowUpRight, Building2, Download, KeyRound, Languages, LineChart, MapPin, Search, Star, Tag, Wrench } from 'lucide-react-native'
import { useState } from 'react'
import { FlatList, Pressable, StyleSheet, useWindowDimensions, View } from 'react-native'
import Svg, { Circle, Defs, LinearGradient as SvgGradient, Path, Stop } from 'react-native-svg'

import { IMG } from '@/assets/images'
import { formatNumber } from '@/lib/format'
import { AGENT_PROFILES } from '@/mocks/agents'
import { COMMUNITIES } from '@/mocks/communities'
import { DEVELOPER_PROFILES } from '@/mocks/developers'
import { ARTICLE_DETAILS } from '@/mocks/insights'
import { LISTINGS } from '@/mocks/properties'
import { PROJECT_DETAILS } from '@/mocks/projects'
import { TESTIMONIALS } from '@/mocks/testimonials'
import { colors, gradients, GUTTER, radius, shadow } from '@/theme'
import type { ListingKind } from '@/types'
import { whatsapp } from '@/ui/brand'
import { Button } from '@/ui/Button'
import { InfinityMark, WhatsAppIcon } from '@/ui/icons'
import { Img } from '@/ui/Img'
import { LeadForm } from '@/ui/LeadForm'
import { Container, SectionHead } from '@/ui/primitives'
import { PropertyCard } from '@/ui/PropertyCard'
import { Segmented } from '@/ui/Segmented'
import { Heading, Text } from '@/ui/Text'
import { Carousel, goToSearch, LinkAction, ProjectCard } from './common'

/* ---------------- Stats strip ---------------- */

const STATS = [
  { value: '29%', label: 'of Dubai residential sales were ready homes in Q3 2026', source: 'betterhomes' },
  { value: '84%', label: 'of sales were priced under AED 3 million', source: 'Springfield Properties' },
  { value: '44%', label: 'of rental contracts were new leases', source: 'Savills' },
  { value: '4%', label: 'DLD transfer fee paid by the buyer on purchase', source: 'Dubai Land Department' },
]

export function StatsStrip() {
  return (
    <View style={styles.stats} accessibilityLabel="Dubai market at a glance">
      <View style={styles.statsGrid}>
        {STATS.map((s) => (
          <View key={s.value} style={styles.stat}>
            <Text display weight={600} size={46} lineHeight={46} color="plum">
              {s.value}
            </Text>
            <Text size={13.5} lineHeight={19} color="ink" style={{ marginTop: 8, opacity: 0.8 }}>
              {s.label}
            </Text>
            <Text size={12} color="muted" style={{ marginTop: 4 }}>
              {s.source}
            </Text>
          </View>
        ))}
      </View>
      <Text size={12} color="muted" style={{ marginTop: 20 }}>
        Q3 2026 market snapshot. Sources named per figure; methodologies differ between reports. Refreshed quarterly.
      </Text>
    </View>
  )
}

/* ---------------- Featured properties ---------------- */

const FEATURED_TABS: { key: ListingKind; label: string }[] = [
  { key: 'sale', label: 'For Sale' },
  { key: 'rent', label: 'For Rent' },
  { key: 'offplan', label: 'Off-Plan' },
]

export function FeaturedProperties() {
  const { width } = useWindowDimensions()
  const [tab, setTab] = useState<ListingKind>('sale')
  const items = LISTINGS.filter((l) => l.kind === tab)
  const cardW = Math.round(width * 0.85)
  return (
    <View style={{ paddingVertical: 48 }}>
      <Container>
        <SectionHead title="Featured properties" sub="Hand-picked by our agents this week. Every listing carries its Trakheesi permit and a verified agent." />
        <Segmented tabs={FEATURED_TABS} value={tab} onChange={setTab} style={{ alignSelf: 'flex-start', marginBottom: 20 }} />
      </Container>
      <Carousel key={tab} data={items} itemWidth={cardW} keyExtractor={(l) => l.id} label="Featured properties" renderItem={({ item }) => <PropertyCard listing={item} width={cardW} />} />
      <Container style={{ alignItems: 'center', marginTop: 24 }}>
        <Button
          variant="outline"
          title={`View all ${tab === 'sale' ? 'properties for sale' : tab === 'rent' ? 'rentals' : 'off-plan homes'}`}
          iconRight={<ArrowRight size={16} color={colors.plum} />}
          onPress={() => goToSearch({ kind: tab === 'sale' ? 'buy' : tab })}
          style={{ alignSelf: 'center' }}
        />
      </Container>
    </View>
  )
}

/* ---------------- Communities ---------------- */

export function Communities() {
  const { width } = useWindowDimensions()
  const tileW = Math.round(width * 0.72)
  return (
    <View style={{ paddingVertical: 48, backgroundColor: colors.white }}>
      <Container>
        <SectionHead title="Explore communities" sub="Asking price per sq ft and gross yield by area, from Bayut and Engel & Völkers Q3 2026 data." />
        <LinkAction label="All communities" onPress={() => router.push('/communities')} style={{ marginTop: -8, marginBottom: 16 }} />
      </Container>
      <Carousel
        data={COMMUNITIES}
        itemWidth={tileW}
        keyExtractor={(c) => c.slug}
        label="Communities"
        renderItem={({ item: c }) => (
          <Pressable accessibilityRole="link" accessibilityLabel={`${c.name} community guide`} onPress={() => router.push(`/community/${c.slug}`)} style={[styles.tile, { width: tileW }]}>
            <Img src={c.image} style={StyleSheet.absoluteFill} />
            <LinearGradient colors={['rgba(30,24,40,0)', 'rgba(30,24,40,0.2)', 'rgba(30,24,40,0.82)']} locations={[0, 0.45, 1]} style={StyleSheet.absoluteFill} />
            <View style={styles.tag}>
              <Text size={12} weight={600} color="plum">
                {c.tag}
              </Text>
            </View>
            <View style={{ padding: 18 }}>
              <Text display weight={600} size={28} lineHeight={30} color="white">
                {c.name}
              </Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', columnGap: 12, marginTop: 4 }}>
                <Text size={13} color="white" style={{ opacity: 0.88 }}>
                  {c.ppsf ? `${c.approx ? '~' : ''}AED ${formatNumber(c.ppsf)} / sq ft` : 'Prime market'}
                </Text>
                {c.yieldPct ? (
                  <Text size={13} color="white" style={{ opacity: 0.88 }}>
                    {c.yieldPct.toFixed(2)}% gross yield
                  </Text>
                ) : null}
              </View>
            </View>
          </Pressable>
        )}
      />
      <Container>
        <Text size={12} color="muted" style={{ marginTop: 14 }}>
          ~ Earlier mid-2025 snapshot (Gulf News). Yields are gross and vary by unit size.
        </Text>
      </Container>
    </View>
  )
}

/* ---------------- Photo band ---------------- */

export function PhotoBand() {
  const { width } = useWindowDimensions()
  return (
    <View style={{ height: Math.max(300, width * 0.85), justifyContent: 'center', overflow: 'hidden' }}>
      <Img src={IMG.coastBand} style={StyleSheet.absoluteFill} accessibilityLabel="Dubai coastline and Palm Jumeirah from above at dusk" />
      <LinearGradient colors={['rgba(56,26,76,0.8)', 'rgba(56,26,76,0.35)', 'rgba(56,26,76,0.05)']} start={{ x: 0, y: 0.5 }} end={{ x: 1, y: 0.5 }} style={StyleSheet.absoluteFill} />
      <View style={{ paddingHorizontal: GUTTER, maxWidth: 360 }}>
        <Text display italic size={38} lineHeight={40} color="white">
          Beyond the address.
        </Text>
        <Text size={15} lineHeight={24} color="white" style={{ marginTop: 14, opacity: 0.88 }}>
          We look at the light, the commute, the service charge and the resale data before we show you a single door.
        </Text>
      </View>
    </View>
  )
}

/* ---------------- Off-plan launches ---------------- */

export function OffPlanLaunches() {
  return (
    <Container style={{ paddingVertical: 48 }}>
      <SectionHead title="New off-plan launches" sub="Developer, DLD project registration and escrow checked before we list. No guaranteed-return claims." />
      <LinkAction label="Off-plan hub" onPress={() => goToSearch({ kind: 'offplan' })} style={{ marginTop: -8, marginBottom: 16 }} />
      <View style={{ gap: 16 }}>
        {PROJECT_DETAILS.map((p, i) => (
          <ProjectCard key={p.id} project={p} large={i === 0} height={i === 0 ? 440 : 360} />
        ))}
      </View>
    </Container>
  )
}

/* ---------------- Developers ---------------- */

export function Developers() {
  const { width } = useWindowDimensions()
  const cardW = Math.round(width * 0.78)
  const [progress, setProgress] = useState(0)
  return (
    <View style={styles.devSection}>
      <Container>
        <SectionHead title="Selling for Dubai’s top developers" sub="Launches and resales from the city’s most established master developers — every project DLD-registered." />
        <LinkAction label="All developers" onPress={() => router.push('/developers')} style={{ marginTop: -8, marginBottom: 16 }} />
      </Container>
      <FlatList
        horizontal
        data={DEVELOPER_PROFILES}
        keyExtractor={(d) => d.slug}
        showsHorizontalScrollIndicator={false}
        snapToInterval={cardW + 14}
        decelerationRate="fast"
        disableIntervalMomentum
        contentContainerStyle={{ paddingHorizontal: GUTTER, gap: 14 }}
        scrollEventThrottle={32}
        onScroll={(e) => {
          const { contentOffset, contentSize, layoutMeasurement } = e.nativeEvent
          const max = contentSize.width - layoutMeasurement.width
          setProgress(max > 0 ? contentOffset.x / max : 0)
        }}
        accessibilityLabel="Developers"
        renderItem={({ item: d }) => {
          const projects = PROJECT_DETAILS.filter((p) => p.developerSlug === d.slug).length
          return (
            <Pressable accessibilityRole="link" accessibilityLabel={`${d.name} developer profile`} onPress={() => router.push(`/developer/${d.slug}`)} style={[styles.devCard, { width: cardW, height: cardW * 1.2 }]}>
              <Img src={d.image} style={StyleSheet.absoluteFill} />
              <LinearGradient colors={['rgba(30,24,40,0.05)', 'rgba(30,24,40,0.35)', 'rgba(30,24,40,0.9)']} locations={[0, 0.45, 1]} style={StyleSheet.absoluteFill} />
              {projects > 0 ? (
                <View style={[styles.tag, { top: 16, left: 16 }]}>
                  <Text size={12} weight={600} color="plum">
                    {projects} {projects === 1 ? 'launch' : 'launches'} listed
                  </Text>
                </View>
              ) : null}
              <View style={styles.devArrow}>
                <ArrowUpRight size={16} color={colors.white} />
              </View>
              <View style={{ padding: 20 }}>
                <Text size={22} weight={700} color="white" tracking={0.12}>
                  {d.name.toUpperCase()}
                </Text>
                <Text size={13.5} color="white" numberOfLines={2} style={{ marginTop: 4, opacity: 0.8 }}>
                  {d.signatureProjects.slice(0, 2).join(' · ')}
                </Text>
                <View style={styles.devFacts}>
                  <View>
                    <Text size={12} color="white" style={{ opacity: 0.6 }}>
                      Since
                    </Text>
                    <Text size={15} weight={600} color="white">
                      {d.founded}
                    </Text>
                  </View>
                  <View>
                    <Text size={12} color="white" style={{ opacity: 0.6 }}>
                      Delivered
                    </Text>
                    <Text size={15} weight={600} color="white">
                      {d.deliveredUnits} units
                    </Text>
                  </View>
                </View>
              </View>
            </Pressable>
          )
        }}
      />
      <View style={styles.progressTrack}>
        <LinearGradient colors={gradients.aura.colors} start={gradients.aura.start} end={gradients.aura.end} style={{ height: 3, borderRadius: 2, width: `${Math.max(12, progress * 100)}%` }} />
      </View>
    </View>
  )
}

/* ---------------- Services ---------------- */

const SERVICES = [
  { icon: Building2, title: 'Buy', body: "Ready homes and off-plan launches across Dubai's most sought-after communities.", go: () => goToSearch({ kind: 'buy' }) },
  { icon: KeyRound, title: 'Rent', body: 'Verified listings, transparent fees and fast viewings.', go: () => goToSearch({ kind: 'rent' }) },
  { icon: Tag, title: 'Sell', body: 'Free valuation backed by recent transaction data.', go: () => router.push('/sell') },
  { icon: LineChart, title: 'Invest', body: 'Yield-led advice, Golden Visa guidance and off-plan access.', go: () => router.push('/invest') },
  { icon: Wrench, title: 'Property management', body: 'Tenants, maintenance and reporting, handled for owners.', go: () => router.push('/contact') },
]

export function Services() {
  const { width } = useWindowDimensions()
  return (
    <Container style={{ paddingVertical: 48 }}>
      <SectionHead title="One team for every move" sub="Whether you are buying your first apartment or handing over a portfolio, you deal with one licensed adviser from start to finish." />
      <Img src={IMG.living} style={{ width: width - GUTTER * 2, height: (width - GUTTER * 2) * 0.75, borderRadius: radius.card }} accessibilityLabel="Bright furnished living room in a Dubai apartment" />
      <View style={styles.serviceList}>
        {SERVICES.map((s, i) => (
          <Pressable key={s.title} accessibilityRole="link" accessibilityLabel={s.title} onPress={s.go} style={({ pressed }) => [styles.service, i > 0 && styles.serviceDivider, pressed && { opacity: 0.7 }]}>
            <View style={styles.serviceIcon}>
              <s.icon size={20} color={colors.indigo} strokeWidth={1.6} />
            </View>
            <View style={{ flex: 1 }}>
              <Text display weight={600} size={26} lineHeight={30} color="plum">
                {s.title}
              </Text>
              <Text size={14.5} lineHeight={22} color="muted" style={{ marginTop: 2 }}>
                {s.body}
              </Text>
            </View>
            <ArrowRight size={20} color={colors.muted} style={{ marginTop: 6 }} />
          </Pressable>
        ))}
      </View>
    </Container>
  )
}

/* ---------------- Valuation band ---------------- */

export function Valuation() {
  return (
    <Container>
      <LinearGradient colors={gradients.band.colors} start={{ x: 0, y: 0.2 }} end={{ x: 1, y: 0.8 }} style={styles.band}>
        <View style={styles.watermark} pointerEvents="none">
          <InfinityMark width={460} strokeWidth={14} opacity={0.25} />
        </View>
        <Text display weight={600} size={36} lineHeight={38} color="white" accessibilityRole="header">
          What is your home worth today?
        </Text>
        <Text size={15.5} lineHeight={24} color="white" style={{ marginTop: 12, opacity: 0.8 }}>
          A free valuation from a RERA-certified agent, backed by DLD transactions in your building over the last 12 months. Back to you within one working day.
        </Text>
        <View style={styles.glassForm}>
          <LeadForm
            type="valuation"
            tone="solid"
            withEmail={false}
            extraFields={[
              { name: 'address', label: 'Property address', kind: 'text', placeholder: 'Building, community', required: true },
              { name: 'propertyType', label: 'Property type', kind: 'select', options: ['Apartment', 'Villa', 'Townhouse', 'Penthouse'] },
            ]}
            submitLabel="Get my free valuation"
            successText="Thanks. An agent will WhatsApp you within one working day."
          />
        </View>
        <LinkAction label="Full valuation request" light onPress={() => router.push('/sell/valuation')} style={{ marginTop: 16 }} />
      </LinearGradient>
    </Container>
  )
}

/* ---------------- Insights ---------------- */

const SERIES = [
  { q: 'Q3 25', v: 1745 },
  { q: 'Q4 25', v: 1802 },
  { q: 'Q1 26', v: 1868 },
  { q: 'Q2 26', v: 1908 },
  { q: 'Q3 26', v: 1817 },
]

function AreaChart({ width }: { width: number }) {
  const w = 360
  const h = 120
  const min = 1700
  const max = 1940
  const pts = SERIES.map((d, i) => [(i / (SERIES.length - 1)) * w, h - ((d.v - min) / (max - min)) * h] as const)
  const line = pts.map(([x, y], i) => `${i ? 'L' : 'M'}${x},${y}`).join(' ')
  const area = `${line} L${w},${h} L0,${h} Z`
  const [lx, ly] = pts[pts.length - 1]
  return (
    <View accessibilityLabel="Average apartment price per sq ft, Q3 2025 to Q3 2026">
      <Svg width={width} height={(width * (h + 16)) / (w + 16)} viewBox={`-8 -8 ${w + 16} ${h + 16}`}>
        <Defs>
          <SvgGradient id="insArea" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor="#563D96" stopOpacity={0.22} />
            <Stop offset="1" stopColor="#563D96" stopOpacity={0} />
          </SvgGradient>
        </Defs>
        <Path d={area} fill="url(#insArea)" />
        <Path d={line} fill="none" stroke="#563D96" strokeWidth={2.5} strokeLinejoin="round" strokeLinecap="round" />
        <Circle cx={lx} cy={ly} r={5} fill="#fff" stroke="#843F96" strokeWidth={2.5} />
      </Svg>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 6 }}>
        {SERIES.map((d) => (
          <Text key={d.q} size={11} color="muted">
            {d.q}
          </Text>
        ))}
      </View>
    </View>
  )
}

export function Insights() {
  const { width } = useWindowDimensions()
  const inner = width - GUTTER * 2 - 40
  return (
    <Container style={{ paddingVertical: 48 }}>
      <SectionHead title="Market insights" sub="The Dubai market is stabilising: volumes are below the 2025 peak, ready homes are gaining share and leasing demand is at a record high." />
      <LinkAction label="All insights" onPress={() => router.push('/insights')} style={{ marginTop: -8, marginBottom: 16 }} />

      <View style={styles.report}>
        <Img src={IMG.report} style={{ width: '100%', aspectRatio: 21 / 9 }} accessibilityLabel="Dubai skyline at dusk" />
        <View style={{ padding: 20 }}>
          <Text size={13} weight={600} color="aura">
            Quarterly report · Q3 2026
          </Text>
          <Heading size={28} lineHeight={31} style={{ marginTop: 6 }}>
            Apartment prices ease 4.8% as ready homes reach 29% of sales
          </Heading>
          <View style={{ marginTop: 20 }}>
            <AreaChart width={inner} />
          </View>
          <View style={{ flexDirection: 'row', gap: 16, marginTop: 18 }}>
            <View style={{ flex: 1 }}>
              <Text size={12} color="muted">
                Avg apartment price
              </Text>
              <Text size={20} weight={700} color="plum">
                AED 1,817
                <Text size={12.5} weight={500} color="muted">
                  {' '}
                  /sq ft
                </Text>
              </Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text size={12} color="muted">
                Residential deals
              </Text>
              <Text size={20} weight={700} color="plum">
                ~34,500
              </Text>
            </View>
          </View>
          <Text size={11.5} color="muted" style={{ marginTop: 10 }}>
            Source: Savills Dubai Residential Market Report Q3 2026.
          </Text>
          <Button
            title="Download the full report"
            icon={<Download size={16} color={colors.white} />}
            style={{ marginTop: 18 }}
            onPress={() => router.push(`/article/${ARTICLE_DETAILS[0].slug}`)}
          />
        </View>
      </View>

      <View style={{ gap: 12, marginTop: 16 }}>
        {ARTICLE_DETAILS.slice(0, 3).map((a) => (
          <Pressable key={a.id} accessibilityRole="link" accessibilityLabel={a.title} onPress={() => router.push(`/article/${a.slug}`)} style={({ pressed }) => [styles.article, pressed && { opacity: 0.85 }]}>
            <Img src={a.image} style={styles.articleImg} />
            <View style={{ flex: 1, paddingVertical: 2 }}>
              <Text size={12} weight={600} color="aura">
                {a.category}
              </Text>
              <Text size={15} weight={600} lineHeight={20} numberOfLines={3} style={{ marginTop: 2 }}>
                {a.title}
              </Text>
              <Text size={12} color="muted" style={{ marginTop: 'auto', paddingTop: 6 }}>
                {a.date} · {a.read} read
              </Text>
            </View>
          </Pressable>
        ))}
      </View>
    </Container>
  )
}

/* ---------------- Agents ---------------- */

export function Agents() {
  const { width } = useWindowDimensions()
  const cardW = Math.round(width * 0.68)
  return (
    <View style={{ paddingVertical: 48, backgroundColor: colors.white }}>
      <Container>
        <SectionHead title="Meet our agents" sub="Every adviser is RERA-licensed. Check any BRN on the Dubai Land Department site." />
        <LinkAction label="All agents" onPress={() => router.push('/agents')} style={{ marginTop: -8, marginBottom: 16 }} />
      </Container>
      <Carousel
        data={AGENT_PROFILES}
        itemWidth={cardW}
        keyExtractor={(a) => a.id}
        label="Agents"
        renderItem={({ item: a }) => (
          <View style={{ width: cardW }}>
            <Pressable accessibilityRole="link" accessibilityLabel={`${a.name}, ${a.role}`} onPress={() => router.push(`/agent/${a.slug}`)}>
              <View style={styles.agentPhoto}>
                <Img src={a.photo} style={StyleSheet.absoluteFill} />
                <View style={styles.brn}>
                  <Text size={11.5} weight={600} color="plum">
                    BRN {a.brn}
                  </Text>
                </View>
              </View>
              <Text display weight={600} size={24} lineHeight={27} color="plum" style={{ marginTop: 14 }}>
                {a.name}
              </Text>
              <Text size={14} color="muted">
                {a.role}
              </Text>
              <View style={{ gap: 6, marginTop: 10 }}>
                <View style={styles.agentRow}>
                  <Languages size={15} color={colors.muted} style={{ marginTop: 2 }} />
                  <Text size={13.5} color="ink" style={{ flex: 1, opacity: 0.8 }}>
                    {a.languages.join(', ')}
                  </Text>
                </View>
                <View style={styles.agentRow}>
                  <MapPin size={15} color={colors.muted} style={{ marginTop: 2 }} />
                  <Text size={13.5} color="ink" numberOfLines={2} style={{ flex: 1, opacity: 0.8 }}>
                    {a.communities.join(', ')}
                  </Text>
                </View>
              </View>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={`WhatsApp ${a.name}`}
              onPress={() => whatsapp(a.whatsapp)}
              style={({ pressed }) => [styles.waBtn, pressed && { backgroundColor: colors.whatsapp, borderColor: colors.whatsapp }]}
            >
              {({ pressed }) => (
                <>
                  <WhatsAppIcon size={16} color={pressed ? colors.white : colors.whatsapp} />
                  <Text size={14} weight={600} color={pressed ? 'white' : 'plum'}>
                    WhatsApp {a.name.split(' ')[0]}
                  </Text>
                </>
              )}
            </Pressable>
          </View>
        )}
      />
    </View>
  )
}

/* ---------------- Testimonials ---------------- */

const GOOGLE = [
  ['G', '#4285F4'],
  ['o', '#EA4335'],
  ['o', '#FBBC05'],
  ['g', '#4285F4'],
  ['l', '#34A853'],
  ['e', '#EA4335'],
] as const

export function Testimonials() {
  const { width } = useWindowDimensions()
  const cardW = width - GUTTER * 2
  const [index, setIndex] = useState(0)
  return (
    <View style={{ paddingVertical: 56, overflow: 'hidden' }}>
      <View style={styles.testimonialMark} pointerEvents="none">
        <InfinityMark width={width * 1.6} strokeWidth={6} opacity={0.07} />
      </View>
      <View style={styles.google}>
        <Text size={15} weight={700}>
          {GOOGLE.map(([ch, c], i) => (
            <Text key={i} size={15} weight={700} style={{ color: c }}>
              {ch}
            </Text>
          ))}
        </Text>
        <View style={{ flexDirection: 'row', gap: 2 }} accessibilityLabel="Rated 4.9 out of 5">
          {Array.from({ length: 5 }).map((_, s) => (
            <Star key={s} size={13} color="#FBBC05" fill="#FBBC05" />
          ))}
        </View>
        <Text size={13} weight={600}>
          4.9 · 312 reviews
        </Text>
      </View>
      <FlatList
        horizontal
        data={TESTIMONIALS}
        keyExtractor={(t) => t.name}
        showsHorizontalScrollIndicator={false}
        snapToInterval={cardW + GUTTER}
        decelerationRate="fast"
        disableIntervalMomentum
        contentContainerStyle={{ paddingHorizontal: GUTTER, gap: GUTTER, marginTop: 28 }}
        onMomentumScrollEnd={(e) => setIndex(Math.round(e.nativeEvent.contentOffset.x / (cardW + GUTTER)))}
        renderItem={({ item: t }) => (
          <View style={[styles.quoteCard, { width: cardW }]}>
            <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 4 }} accessibilityLabel={`${t.rating} out of 5 stars`}>
              {Array.from({ length: t.rating }).map((_, s) => (
                <Star key={s} size={18} color={colors.aura} fill={colors.aura} />
              ))}
            </View>
            <Text display weight={500} size={24} lineHeight={31} color="plum" align="center" style={{ marginTop: 18 }}>
              “{t.quote}”
            </Text>
            <View style={styles.quoteAuthor}>
              <Img src={t.avatar} style={{ width: 48, height: 48, borderRadius: 24 }} />
              <View style={{ flexShrink: 1 }}>
                <Text size={15} weight={600}>
                  {t.name}
                </Text>
                <Text size={13} color="muted">
                  {t.context}
                </Text>
              </View>
            </View>
          </View>
        )}
      />
      <View style={styles.dots}>
        {TESTIMONIALS.map((_, d) => (
          <View key={d} style={[styles.dot, d === index && { width: 24, backgroundColor: colors.plum }]} />
        ))}
      </View>
    </View>
  )
}

/* ---------------- Final CTA ---------------- */

export function FinalCta() {
  return (
    <Container style={{ paddingBottom: 24 }}>
      <View style={styles.cta}>
        <Img src={IMG.pool} style={StyleSheet.absoluteFill} accessibilityLabel="Infinity pool overlooking the Dubai skyline" />
        <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(56,26,76,0.7)' }]} />
        <Text display weight={600} size={40} lineHeight={41} color="white" accessibilityRole="header">
          Ready to make your move?
        </Text>
        <Text size={15.5} color="white" style={{ marginTop: 12, opacity: 0.8 }}>
          Talk to an adviser today, or start browsing verified homes across Dubai.
        </Text>
        <View style={{ gap: 12, marginTop: 28 }}>
          <Button title="Speak to an adviser" size="lg" full onPress={() => router.push('/contact')} />
          <Button title="Browse properties" variant="white" size="lg" full icon={<Search size={16} color={colors.plum} />} onPress={() => goToSearch({ kind: 'buy' })} />
        </View>
      </View>
    </Container>
  )
}

const styles = StyleSheet.create({
  stats: { backgroundColor: colors.white, paddingHorizontal: GUTTER, paddingVertical: 36, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.line },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', rowGap: 28 },
  stat: { width: '50%', paddingRight: 14 },
  tile: { height: 280, borderRadius: radius.card, overflow: 'hidden', justifyContent: 'flex-end', backgroundColor: colors.mist },
  tag: { position: 'absolute', top: 12, left: 12, backgroundColor: 'rgba(255,255,255,0.92)', borderRadius: radius.pill, paddingHorizontal: 10, paddingVertical: 4 },
  brn: { position: 'absolute', bottom: 12, left: 12, backgroundColor: 'rgba(255,255,255,0.95)', borderRadius: radius.pill, paddingHorizontal: 10, paddingVertical: 4 },
  devSection: { paddingVertical: 48, backgroundColor: colors.white, borderTopWidth: StyleSheet.hairlineWidth, borderBottomWidth: StyleSheet.hairlineWidth, borderColor: colors.line },
  devCard: { borderRadius: radius.card, overflow: 'hidden', justifyContent: 'flex-end', backgroundColor: colors.plum, ...shadow.soft },
  devArrow: { position: 'absolute', top: 16, right: 16, width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center' },
  devFacts: { flexDirection: 'row', gap: 20, marginTop: 16, paddingTop: 12, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.2)' },
  progressTrack: { marginHorizontal: GUTTER, marginTop: 24, height: 3, borderRadius: 2, backgroundColor: colors.mist, overflow: 'hidden' },
  serviceList: { marginTop: 24, borderTopWidth: StyleSheet.hairlineWidth, borderBottomWidth: StyleSheet.hairlineWidth, borderColor: colors.line },
  service: { flexDirection: 'row', alignItems: 'flex-start', gap: 16, paddingVertical: 20 },
  serviceDivider: { borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: colors.line },
  serviceIcon: { width: 48, height: 48, borderRadius: 24, backgroundColor: colors.mist, alignItems: 'center', justifyContent: 'center' },
  band: { borderRadius: radius.panel, overflow: 'hidden', paddingHorizontal: 20, paddingVertical: 40 },
  watermark: { position: 'absolute', right: -120, bottom: -60 },
  glassForm: { marginTop: 24, padding: 12, borderRadius: radius.card, borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)', backgroundColor: 'rgba(255,255,255,0.1)' },
  report: { backgroundColor: colors.white, borderRadius: radius.card, overflow: 'hidden', ...shadow.soft },
  article: { flexDirection: 'row', gap: 14, backgroundColor: colors.white, borderRadius: radius.card, padding: 12, ...shadow.soft },
  articleImg: { width: 110, height: 96, borderRadius: radius.md },
  agentPhoto: { aspectRatio: 4 / 5, borderRadius: radius.card, overflow: 'hidden', backgroundColor: colors.mist },
  agentRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 8 },
  waBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, height: 44, marginTop: 16, borderRadius: radius.pill, borderWidth: 1, borderColor: colors.line },
  testimonialMark: { position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, alignItems: 'center', justifyContent: 'center' },
  google: { flexDirection: 'row', alignItems: 'center', gap: 10, alignSelf: 'center', backgroundColor: colors.white, borderRadius: radius.pill, paddingHorizontal: 16, paddingVertical: 8, ...shadow.soft },
  quoteCard: { paddingHorizontal: 4 },
  quoteAuthor: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 12, marginTop: 24 },
  dots: { flexDirection: 'row', justifyContent: 'center', gap: 8, marginTop: 28 },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.line },
  cta: { borderRadius: radius.panel, overflow: 'hidden', paddingHorizontal: 24, paddingVertical: 48 },
})
