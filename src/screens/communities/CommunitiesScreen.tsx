import { router } from 'expo-router'
import { useMemo, useState } from 'react'
import { Pressable, ScrollView, StyleSheet, View } from 'react-native'

import { useCurrency } from '@/features/favorites/hooks'
import { COMMUNITY_DETAILS } from '@/mocks/communities'
import { colors, GUTTER, radius, shadow } from '@/theme'
import type { CommunityDetail } from '@/types'
import { Button } from '@/ui/Button'
import { SelectField } from '@/ui/Field'
import { LocationMap } from '@/ui/LocationMap'
import { Chip, Container, EmptyState, SectionHead } from '@/ui/primitives'
import { Screen } from '@/ui/Screen'
import { Segmented } from '@/ui/Segmented'
import { Heading, Text } from '@/ui/Text'
import { CommunityTile } from './CommunityTile'
import { ppsfValue, rentLabel, yieldLabel } from './helpers'

type Sort = 'name' | 'ppsf' | 'yield'
type View_ = 'grid' | 'map'

const TAGS = Array.from(new Set(COMMUNITY_DETAILS.map((c) => c.tag)))

const SORTS: { value: Sort; label: string }[] = [
  { value: 'name', label: 'Name (A–Z)' },
  { value: 'ppsf', label: 'Price / sq ft (high to low)' },
  { value: 'yield', label: 'Gross yield (high to low)' },
]

/** Nulls ("Prime market", no yield data) always sort last. */
function sortCommunities(list: CommunityDetail[], sort: Sort) {
  const byNum = (get: (c: CommunityDetail) => number | null) => (a: CommunityDetail, b: CommunityDetail) => (get(b) ?? -Infinity) - (get(a) ?? -Infinity) || a.name.localeCompare(b.name)
  if (sort === 'ppsf') return [...list].sort(byNum((c) => c.ppsf))
  if (sort === 'yield') return [...list].sort(byNum((c) => c.yieldPct))
  return [...list].sort((a, b) => a.name.localeCompare(b.name))
}

export function CommunitiesScreen() {
  const currency = useCurrency()
  const [tag, setTag] = useState<string | null>(null)
  const [sort, setSort] = useState<Sort>('name')
  const [view, setView] = useState<View_>('grid')

  const list = useMemo(() => sortCommunities(tag ? COMMUNITY_DETAILS.filter((c) => c.tag === tag) : COMMUNITY_DETAILS, sort), [tag, sort])
  const compared = list.length ? list : COMMUNITY_DETAILS

  return (
    <Screen variant="pushed" title="Communities">
      <Container style={{ paddingTop: 4 }}>
        <Heading size={40}>Dubai communities</Heading>
        <Text size={15.5} color="muted" style={{ marginTop: 8 }}>
          Compare Dubai’s most popular freehold areas by price per sq ft, rental yield and lifestyle, then dive into a guide for each one.
        </Text>
      </Container>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips} accessibilityLabel="Filter by type of community" style={{ flexGrow: 0, marginTop: 20 }}>
        <Chip label="All" active={tag === null} onPress={() => setTag(null)} style={styles.chip} />
        {TAGS.map((t) => (
          <Chip key={t} label={t} active={tag === t} onPress={() => setTag(tag === t ? null : t)} style={styles.chip} />
        ))}
      </ScrollView>

      <Container style={{ marginTop: 14, gap: 12 }}>
        <SelectField label="Sort by" value={sort} onChange={(v) => setSort(v as Sort)} options={SORTS} />
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
          <Text size={13.5} color="muted" style={{ flex: 1 }} accessibilityLiveRegion="polite">
            Showing {list.length} {list.length === 1 ? 'community' : 'communities'}
            {tag ? ` tagged “${tag}”` : ''}
          </Text>
          <Segmented<View_>
            tabs={[
              { key: 'grid', label: 'Grid' },
              { key: 'map', label: 'Map' },
            ]}
            value={view}
            onChange={setView}
          />
        </View>

        <View style={{ marginTop: 4 }}>
          {list.length === 0 ? (
            <EmptyState title="No communities match" body="Try another filter to see more areas." action={<Button title="Show all communities" onPress={() => setTag(null)} />} />
          ) : view === 'grid' ? (
            <View style={{ gap: 14 }}>
              {list.map((c) => (
                <CommunityTile key={c.slug} community={c} height={260} />
              ))}
            </View>
          ) : (
            <View>
              <LocationMap
                markers={list.map((c) => ({ id: c.slug, position: c.location, label: c.name }))}
                onMarkerPress={(id) => router.push(`/community/${id}`)}
                style={{ height: 460 }}
              />
              <Text size={12.5} color="muted" style={{ marginTop: 8 }}>
                Tap a pin to open the community guide.
              </Text>
            </View>
          )}
        </View>
        <Text size={12} color="muted">
          ~ Earlier mid-2025 snapshot (Gulf News). Other prices and yields from Bayut and Engel & Völkers Q3 2026 data. Yields are gross and vary by unit size.
        </Text>
      </Container>

      {/* Comparison */}
      <View style={{ marginTop: 40, paddingVertical: 40, backgroundColor: colors.white }}>
        <Container>
          <SectionHead title="Compare at a glance" sub="Average asking price, gross yield and typical annual rents side by side. Rents are indicative annual figures in AED." />
          <View style={{ gap: 12 }}>
            {compared.map((c) => (
              <Pressable
                key={c.slug}
                accessibilityRole="link"
                accessibilityLabel={`${c.name} community guide`}
                onPress={() => router.push(`/community/${c.slug}`)}
                style={({ pressed }) => [styles.compare, pressed && { backgroundColor: colors.mist }]}
              >
                <Heading size={25}>{c.name}</Heading>
                <View style={styles.grid}>
                  <Row label="Avg AED / sq ft" value={ppsfValue(c)} />
                  <Row label="Gross yield" value={yieldLabel(c)} />
                  <Row label="Avg 1-bed rent" value={rentLabel(c.avgRent1Bed, currency)} />
                  <Row label="Avg 2-bed rent" value={rentLabel(c.avgRent2Bed, currency)} />
                  <Row label="Property types" value={c.propertyTypes.join(', ')} full />
                </View>
              </Pressable>
            ))}
          </View>
          <Text size={12} color="muted" style={{ marginTop: 14 }}>
            ~ Earlier mid-2025 snapshot. Yields are gross (before service charges, vacancy and maintenance) and vary by unit size. “On request” means we do not publish a reliable average
            for that area; ask an adviser for current comparables.
          </Text>
        </Container>
      </View>
    </Screen>
  )
}

function Row({ label, value, full }: { label: string; value: string; full?: boolean }) {
  return (
    <View style={{ width: full ? '100%' : '50%', paddingRight: 8 }}>
      <Text size={12} color="muted">
        {label}
      </Text>
      <Text size={14} weight={600}>
        {value}
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  chips: { paddingHorizontal: GUTTER, gap: 8 },
  chip: { minHeight: 40, justifyContent: 'center' },
  compare: { borderRadius: radius.card, backgroundColor: colors.white, padding: 20, borderWidth: StyleSheet.hairlineWidth, borderColor: colors.line, ...shadow.soft },
  grid: { flexDirection: 'row', flexWrap: 'wrap', rowGap: 12, marginTop: 12 },
})
