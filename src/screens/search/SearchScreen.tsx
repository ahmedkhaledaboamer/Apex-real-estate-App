import { useLocalSearchParams } from 'expo-router'
import { List, Map as MapIcon, MousePointerClick, SlidersHorizontal, X } from 'lucide-react-native'
import { useEffect, useMemo, useRef, useState } from 'react'
import { FlatList, Pressable, StyleSheet, useWindowDimensions, View } from 'react-native'

import { useCurrency } from '@/features/favorites/hooks'
import { bedLabel, COMPLETION_LABEL, FURNISHING_LABEL, SORT_OPTIONS } from '@/features/search/options'
import type { SearchParams } from '@/features/search/schemas'
import { formatPrice } from '@/lib/format'
import { PROJECT_DETAILS } from '@/mocks/projects'
import { colors, GUTTER, radius } from '@/theme'
import type { Property } from '@/types'
import { AppBar } from '@/ui/brand'
import { Button } from '@/ui/Button'
import { SelectField } from '@/ui/Field'
import { LocationMap, type MapMarker } from '@/ui/LocationMap'
import { EmptyState } from '@/ui/primitives'
import { PropertyCard } from '@/ui/PropertyCard'
import { Segmented } from '@/ui/Segmented'
import { Heading, Text } from '@/ui/Text'
import { Carousel, ProjectCard } from '../home/common'
import { activeKeys, filtersFromParams, NOUN, results, SCOPE_TABS, scopeFromParam, TITLE, type FilterKey, type Filters, type Scope } from './filters'
import { FilterSheet } from './FilterSheet'
import { LocationInput } from './LocationInput'

type View_ = 'list' | 'map'

/** Search tab — the website's /buy, /rent and /off-plan results in one screen. */
export function SearchScreen() {
  const params = useLocalSearchParams<Record<string, string>>()
  const currency = useCurrency()
  const { width } = useWindowDimensions()
  const listRef = useRef<FlatList<Property>>(null)

  const [scope, setScope] = useState<Scope>(() => scopeFromParam(params.kind))
  const [filters, setFiltersState] = useState<Filters>(() => filtersFromParams(params))
  const [view, setView] = useState<View_>('list')
  const [sheet, setSheet] = useState(false)
  const [activeId, setActiveId] = useState<string | null>(null)

  // Re-apply when the tab is opened with new params (Home hero, "View all", services…).
  const paramKey = JSON.stringify(params)
  useEffect(() => {
    // Any incoming params (kind, location, minPrice, completion… or the `t` nonce) re-apply the search.
    if (Object.keys(params).length === 0) return
    setScope(scopeFromParam(params.kind))
    setFiltersState(filtersFromParams(params))
    setActiveId(null)
    listRef.current?.scrollToOffset({ offset: 0, animated: false })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paramKey])

  const setFilters = (next: Partial<Filters>) => setFiltersState((f) => ({ ...f, ...next }))
  const clearAll = () => setFiltersState((f) => ({ sort: f.sort }))

  const items = useMemo(() => results(scope, filters), [scope, filters])
  const keys = activeKeys(scope, filters)
  const total = items.length
  const [noun, plural] = NOUN[scope]

  const markers: MapMarker[] = useMemo(
    () =>
      items.map((p) => ({
        id: p.id,
        position: p.location,
        label: `${formatPrice(p.priceAed, currency, { compact: true })}${p.kind === 'rent' ? '/yr' : ''}`,
        active: p.id === activeId,
      })),
    [items, currency, activeId],
  )
  const activeListing = items.find((p) => p.id === activeId)

  const chipLabel = (k: FilterKey): string => {
    switch (k) {
      case 'location':
        return `“${filters.location}”`
      case 'type':
        return filters.type!
      case 'beds':
        return bedLabel(filters.beds!)
      case 'baths':
        return `${filters.baths}+ baths`
      case 'minPrice':
        return `From ${formatPrice(filters.minPrice!, currency, { compact: true })}`
      case 'maxPrice':
        return `Up to ${formatPrice(filters.maxPrice!, currency, { compact: true })}`
      case 'completion':
        return COMPLETION_LABEL[filters.completion!]
      case 'furnishing':
        return FURNISHING_LABEL[filters.furnishing!]
    }
  }

  const header = (
    <View>
      {view === 'list' ? (
        <View style={{ paddingHorizontal: GUTTER, paddingTop: 20 }}>
          <Heading size={32} lineHeight={34} accessibilityRole="header">
            {TITLE[scope].title}
          </Heading>
          <Text size={14} color="muted" lineHeight={21} style={{ marginTop: 8 }}>
            {TITLE[scope].sub}
          </Text>
        </View>
      ) : null}

      {scope === 'offplan' && view === 'list' ? (
        <View style={{ marginTop: 24 }}>
          <Text size={17} weight={600} color="plum" style={{ paddingHorizontal: GUTTER, marginBottom: 12 }}>
            Projects launching now
          </Text>
          <Carousel
            data={PROJECT_DETAILS}
            itemWidth={Math.round(width * 0.85)}
            keyExtractor={(p) => p.id}
            label="Off-plan projects"
            renderItem={({ item }) => <ProjectCard project={item} width={Math.round(width * 0.85)} height={340} />}
          />
        </View>
      ) : null}

      <View style={[styles.resultsHead, view === 'map' && { marginTop: 16 }]}>
        <View style={{ flex: 1 }} accessibilityLiveRegion="polite">
          <Heading size={28} lineHeight={30}>
            {total} {total === 1 ? noun : plural}
          </Heading>
          <Text size={13} color="muted" style={{ marginTop: 2 }}>
            {scope === 'buy' ? 'Ready and off-plan homes for sale' : scope === 'rent' ? 'Annual rents' : 'Individual units with a DLD permit'}
          </Text>
        </View>
        <SelectField
          label="Sort by"
          value={filters.sort ?? 'newest'}
          onChange={(v) => setFilters({ sort: v === 'newest' ? undefined : (v as SearchParams['sort']) })}
          options={SORT_OPTIONS}
          containerStyle={{ width: 172 }}
        />
      </View>

      {keys.length > 0 ? (
        <View style={styles.chips}>
          {keys.map((k) => (
            <Pressable key={k} accessibilityRole="button" accessibilityLabel={`Remove filter: ${chipLabel(k)}`} onPress={() => setFilters({ [k]: undefined })} style={styles.activeChip}>
              <Text size={13} weight={500} color="white">
                {chipLabel(k)}
              </Text>
              <X size={13} color={colors.white} />
            </Pressable>
          ))}
          <Pressable accessibilityRole="button" onPress={clearAll} hitSlop={8} style={{ paddingHorizontal: 6, minHeight: 36, justifyContent: 'center' }}>
            <Text size={13.5} weight={600} color="aura">
              Clear all
            </Text>
          </Pressable>
        </View>
      ) : null}
    </View>
  )

  const empty = (
    <View style={{ paddingHorizontal: GUTTER, marginTop: 20 }}>
      <EmptyState
        title={`No ${plural} match your filters`}
        body="Try widening the price range, removing a filter or searching a nearby community."
        action={<Button title="Clear filters" onPress={clearAll} />}
      />
    </View>
  )

  const mapView =
    total > 0 ? (
      <View style={{ paddingHorizontal: GUTTER, marginTop: 20, gap: 16 }}>
        <LocationMap markers={markers} onMarkerPress={setActiveId} style={{ height: 420 }} />
        {activeListing ? (
          <View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <Text size={13} weight={600} color="muted">
                Selected {noun}
              </Text>
              <Pressable accessibilityRole="button" accessibilityLabel="Close preview" onPress={() => setActiveId(null)} hitSlop={10} style={styles.closePreview}>
                <X size={16} color={colors.plum} />
              </Pressable>
            </View>
            <PropertyCard listing={activeListing} />
          </View>
        ) : (
          <View style={styles.hint}>
            <MousePointerClick size={16} color={colors.plum} />
            <Text size={14} color="plum">
              Tap a price pin to preview the {noun}.
            </Text>
          </View>
        )}
      </View>
    ) : (
      empty
    )

  return (
    <View style={{ flex: 1, backgroundColor: colors.paper }}>
      <AppBar />
      <View style={styles.controls}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
          <Segmented
            tabs={SCOPE_TABS}
            value={scope}
            onChange={(s) => {
              setScope(s)
              setActiveId(null)
            }}
          />
          <View style={styles.viewToggle} accessibilityRole="tablist">
            {(['list', 'map'] as const).map((v) => {
              const Icon = v === 'list' ? List : MapIcon
              const on = view === v
              return (
                <Pressable
                  key={v}
                  accessibilityRole="tab"
                  accessibilityLabel={v === 'list' ? 'List view' : 'Map view'}
                  accessibilityState={{ selected: on }}
                  onPress={() => setView(v)}
                  style={[styles.viewBtn, on && { backgroundColor: colors.plum }]}
                >
                  <Icon size={18} color={on ? colors.white : colors.plum} />
                </Pressable>
              )
            })}
          </View>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 10, zIndex: 20 }}>
          <LocationInput value={filters.location} onCommit={(location) => setFilters({ location })} />
          <Pressable accessibilityRole="button" accessibilityLabel={`Filters${keys.length ? `, ${keys.length} active` : ''}`} onPress={() => setSheet(true)} style={styles.filterBtn}>
            <SlidersHorizontal size={17} color={colors.plum} />
            <Text size={14} weight={600} color="plum">
              Filters
            </Text>
            {keys.filter((k) => k !== 'location').length > 0 ? (
              <View style={styles.badge}>
                <Text size={11} weight={700} color="white">
                  {keys.filter((k) => k !== 'location').length}
                </Text>
              </View>
            ) : null}
          </Pressable>
        </View>
      </View>

      <FlatList
        ref={listRef}
        data={view === 'list' ? items : []}
        keyExtractor={(p) => p.id}
        renderItem={({ item }) => <PropertyCard listing={item} style={{ marginHorizontal: GUTTER }} />}
        ItemSeparatorComponent={() => <View style={{ height: 18 }} />}
        ListHeaderComponent={<View style={{ marginBottom: view === 'list' && total > 0 ? 18 : 0 }}>{header}</View>}
        ListFooterComponent={view === 'map' ? mapView : undefined}
        ListEmptyComponent={view === 'list' ? empty : undefined}
        contentContainerStyle={{ paddingBottom: 40 }}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        initialNumToRender={4}
        windowSize={7}
      />

      <FilterSheet
        open={sheet}
        onClose={() => setSheet(false)}
        scope={scope}
        filters={filters}
        setFilters={setFilters}
        onClearAll={clearAll}
        count={total}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  controls: { paddingHorizontal: GUTTER, paddingTop: 12, paddingBottom: 12, backgroundColor: colors.paper, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.line, zIndex: 10 },
  viewToggle: { flexDirection: 'row', backgroundColor: colors.mist, borderRadius: radius.pill, padding: 4 },
  viewBtn: { width: 40, height: 36, borderRadius: radius.pill, alignItems: 'center', justifyContent: 'center' },
  filterBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, height: 48, paddingHorizontal: 14, borderRadius: radius.pill, borderWidth: 1, borderColor: 'rgba(56,26,76,0.2)', backgroundColor: colors.white },
  badge: { minWidth: 20, height: 20, borderRadius: 10, backgroundColor: colors.plum, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 5 },
  resultsHead: { flexDirection: 'row', alignItems: 'flex-end', gap: 12, paddingHorizontal: GUTTER, marginTop: 28 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: 8, paddingHorizontal: GUTTER, marginTop: 16 },
  activeChip: { flexDirection: 'row', alignItems: 'center', gap: 6, minHeight: 36, paddingHorizontal: 14, borderRadius: radius.pill, backgroundColor: colors.plum },
  hint: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: colors.mist, borderRadius: radius.card, padding: 16 },
  closePreview: { width: 36, height: 36, borderRadius: 18, backgroundColor: colors.mist, alignItems: 'center', justifyContent: 'center' },
})
