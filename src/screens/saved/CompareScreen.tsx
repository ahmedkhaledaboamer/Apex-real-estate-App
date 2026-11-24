import { router } from 'expo-router'
import { Heart, Info, Plus, Scale, X } from 'lucide-react-native'
import { Pressable, ScrollView, StyleSheet, View } from 'react-native'

import { useCurrency } from '@/features/favorites/hooks'
import { formatArea, formatNumber, formatPrice } from '@/lib/format'
import { agentProfileById } from '@/mocks/agents'
import { propertyById } from '@/mocks/properties'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { clearCompare, MAX_COMPARE, toggleCompare } from '@/store/slices/compareSlice'
import type { Currency, Property } from '@/types'
import { Button } from '@/ui/Button'
import { Img } from '@/ui/Img'
import { Container, EmptyState } from '@/ui/primitives'
import { Screen } from '@/ui/Screen'
import { Heading, Text } from '@/ui/Text'
import { colors, radius, shadow } from '@/theme'

type Cell = { text: string; onPress?: () => void; avatar?: string }
type Row = { label: string; value?: (p: Property) => number; best?: 'min' | 'max'; render: (p: Property, c: Currency) => Cell }

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)

const ROWS: Row[] = [
  { label: 'Price', value: (p) => p.priceAed, best: 'min', render: (p, c) => ({ text: `${formatPrice(p.priceAed, c)}${p.kind === 'rent' ? ' /year' : ''}` }) },
  { label: 'Price per sq ft', value: (p) => p.priceAed / p.sqft, best: 'min', render: (p, c) => ({ text: formatPrice(p.priceAed / p.sqft, c) }) },
  { label: 'Community', render: (p) => ({ text: p.community, onPress: () => router.push(`/community/${p.communitySlug}`) }) },
  { label: 'Building', render: (p) => ({ text: p.building }) },
  { label: 'Type', render: (p) => ({ text: p.type }) },
  { label: 'Bedrooms', value: (p) => p.beds, best: 'max', render: (p) => ({ text: p.beds === 0 ? 'Studio' : String(p.beds) }) },
  { label: 'Bathrooms', value: (p) => p.baths, best: 'max', render: (p) => ({ text: String(p.baths) }) },
  { label: 'Size', value: (p) => p.sqft, best: 'max', render: (p) => ({ text: formatArea(p.sqft) }) },
  { label: 'Completion', render: (p) => ({ text: p.completion === 'ready' ? 'Ready' : `Off-plan${p.handover ? ` · handover ${p.handover}` : ''}` }) },
  { label: 'Payment plan', render: (p) => ({ text: p.paymentPlan ?? '—' }) },
  { label: 'Furnishing', render: (p) => ({ text: p.furnishing === 'partly' ? 'Partly furnished' : cap(p.furnishing) }) },
  { label: 'Parking', value: (p) => p.parking, best: 'max', render: (p) => ({ text: `${p.parking} space${p.parking === 1 ? '' : 's'}` }) },
  { label: 'View', render: (p) => ({ text: p.view }) },
  { label: 'Service charge', value: (p) => p.serviceChargePerSqft, best: 'min', render: (p) => ({ text: `AED ${formatNumber(p.serviceChargePerSqft)} / sq ft` }) },
  { label: 'Est. annual service charge', value: (p) => p.serviceChargePerSqft * p.sqft, best: 'min', render: (p, c) => ({ text: formatPrice(p.serviceChargePerSqft * p.sqft, c) }) },
  { label: 'Trakheesi permit', render: (p) => ({ text: p.permit }) },
  { label: 'Reference', render: (p) => ({ text: p.reference }) },
  {
    label: 'Agent',
    render: (p) => {
      const a = agentProfileById(p.agentId)
      return { text: a.name, avatar: a.photo, onPress: () => router.push(`/agent/${a.slug}`) }
    },
  },
]

function bestIndexes(items: Property[], row: Row) {
  if (!row.value || !row.best || items.length < 2) return new Set<number>()
  const vals = items.map(row.value)
  const target = row.best === 'min' ? Math.min(...vals) : Math.max(...vals)
  if (vals.every((v) => v === target)) return new Set<number>()
  return new Set(vals.flatMap((v, i) => (v === target ? [i] : [])))
}

const LABEL_W = 116
const COL_W = 184
const HEAD_H = 236
const ROW_H = 62

export function CompareScreen() {
  const dispatch = useAppDispatch()
  const ids = useAppSelector((s) => s.compare.ids)
  const favoritesCount = useAppSelector((s) => s.favorites.ids.length)
  const items = ids.map(propertyById).filter((p): p is Property => p !== undefined)
  const mixed = items.some((p) => p.kind === 'rent') && items.some((p) => p.kind !== 'rent')

  return (
    <Screen variant="pushed" title="Compare">
      <Container style={{ paddingTop: 8 }}>
        <Heading size={36} accessibilityRole="header">
          Compare properties
        </Heading>
        <Text size={15} color="muted" lineHeight={22} style={{ marginTop: 6 }}>
          Put up to {MAX_COMPARE} homes side by side — price per sq ft, size, service charges and more. Best values in each row are highlighted.
        </Text>
      </Container>

      {items.length === 0 ? (
        <Container style={{ marginTop: 24 }}>
          <EmptyState
            title="Nothing to compare yet"
            body={`Open any property and tap “Add to compare”, or add homes from your Saved tab. You can compare up to ${MAX_COMPARE} at a time.`}
            action={
              <View style={{ gap: 10, alignItems: 'center' }}>
                <Button title="Browse homes for sale" onPress={() => router.push({ pathname: '/search', params: { kind: 'sale' } })} />
                <Button title="Browse rentals" variant="outline" onPress={() => router.push({ pathname: '/search', params: { kind: 'rent' } })} />
                {favoritesCount > 0 ? (
                  <Button title={`Saved properties (${favoritesCount})`} variant="ghost" icon={<Heart size={16} color={colors.plum} />} onPress={() => router.push('/saved')} />
                ) : null}
              </View>
            }
          />
        </Container>
      ) : (
        <>
          <Container style={{ marginTop: 18 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <Scale size={16} color={colors.aura} />
              <Text size={14.5} color="muted" style={{ flex: 1 }}>
                Comparing{' '}
                <Text size={14.5} weight={600} color="plum">
                  {items.length}
                </Text>{' '}
                of {MAX_COMPARE} · scroll sideways
              </Text>
            </View>
            <View style={{ flexDirection: 'row', gap: 8, marginTop: 12 }}>
              <Button title="Saved properties" variant="outline" size="sm" icon={<Heart size={15} color={colors.plum} />} onPress={() => router.push('/saved')} />
              <Button title="Clear comparison" variant="ghost" size="sm" onPress={() => dispatch(clearCompare())} />
            </View>
            {mixed ? (
              <View style={styles.warn}>
                <Info size={16} color={colors.plum} style={{ marginTop: 2 }} />
                <Text size={13.5} color="plum" lineHeight={20} style={{ flex: 1 }}>
                  You are comparing rentals with homes for sale. Rental prices are annual rent, so price and price per sq ft are not like-for-like.
                </Text>
              </View>
            ) : null}
          </Container>

          <Container style={{ marginTop: 16 }}>
            <CompareTable items={items} />
            <Text size={12} color="muted" lineHeight={18} style={{ marginTop: 12 }}>
              <Text size={12} weight={600} color="success">
                Green
              </Text>{' '}
              marks the best value in each row (lowest price, price per sq ft and service charge; largest size, most bedrooms, bathrooms and parking). Service charges are
              indicative and set annually by each building’s owners’ association.
            </Text>
          </Container>

          <Container style={{ marginTop: 32 }}>
            <View style={styles.cta}>
              <Heading size={26}>Need a second opinion?</Heading>
              <Text size={14.5} color="muted" style={{ marginTop: 6 }}>
                An adviser can talk you through the trade-offs and arrange back-to-back viewings.
              </Text>
              <Button title="Talk to an adviser" onPress={() => router.push('/contact')} style={{ marginTop: 16 }} />
            </View>
          </Container>
        </>
      )}
    </Screen>
  )
}

/** Side-by-side table: the label column stays put, property columns scroll horizontally. */
function CompareTable({ items }: { items: Property[] }) {
  const currency = useCurrency()
  const dispatch = useAppDispatch()
  const slotsLeft = MAX_COMPARE - items.length
  const best = ROWS.map((r) => bestIndexes(items, r))

  return (
    <View style={styles.table}>
      {/* Sticky label column */}
      <View style={[styles.labels]}>
        <View style={[styles.cell, styles.labelCell, { height: HEAD_H, justifyContent: 'flex-end' }]}>
          <Text size={12} weight={600} color="muted">
            {items.length} of {MAX_COMPARE} selected
          </Text>
        </View>
        {ROWS.map((r) => (
          <View key={r.label} style={[styles.cell, styles.labelCell, { height: ROW_H }]}>
            <Text size={12} weight={600} color="muted" numberOfLines={2}>
              {r.label}
            </Text>
          </View>
        ))}
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ flex: 1 }}>
        {items.map((p, col) => (
          <View key={p.id} style={{ width: COL_W }}>
            <View style={[styles.cell, { height: HEAD_H, paddingTop: 14, justifyContent: 'flex-start' }]}>
              <View style={styles.photo}>
                <Img src={p.images[0]} style={StyleSheet.absoluteFill} />
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={`Remove ${p.title} from comparison`}
                  onPress={() => dispatch(toggleCompare(p.id))}
                  hitSlop={8}
                  style={styles.remove}
                >
                  <X size={16} color={colors.plum} />
                </Pressable>
              </View>
              <Pressable accessibilityRole="link" onPress={() => router.push(`/property/${p.id}`)} hitSlop={4} style={{ marginTop: 10 }}>
                <Text size={14} weight={600} lineHeight={19} numberOfLines={2}>
                  {p.title}
                </Text>
              </Pressable>
              <Text size={16.5} weight={700} color="plum" numberOfLines={1} style={{ marginTop: 4 }}>
                {formatPrice(p.priceAed, currency)}
                {p.kind === 'rent' ? (
                  <Text size={12} weight={500} color="muted">
                    {' '}
                    /year
                  </Text>
                ) : null}
              </Text>
              <Text size={12} color="muted">
                {p.kind === 'rent' ? 'For rent' : p.kind === 'offplan' ? 'Off-plan' : 'For sale'}
              </Text>
            </View>
            {ROWS.map((r, ri) => {
              const cell = r.render(p, currency)
              const isBest = best[ri].has(col)
              const body = (
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  {cell.avatar ? <Img src={cell.avatar} style={{ width: 26, height: 26, borderRadius: 13 }} /> : null}
                  <Text
                    size={13.5}
                    weight={isBest ? 600 : cell.onPress ? 500 : 400}
                    color={isBest ? 'success' : cell.onPress ? 'plum' : 'ink'}
                    numberOfLines={2}
                    style={{ flex: 1 }}
                    accessibilityLabel={isBest ? `${cell.text} (best)` : undefined}
                  >
                    {cell.text}
                  </Text>
                </View>
              )
              return (
                <View key={r.label} style={[styles.cell, { height: ROW_H }]}>
                  {cell.onPress ? (
                    <Pressable accessibilityRole="link" onPress={cell.onPress} hitSlop={6}>
                      {body}
                    </Pressable>
                  ) : (
                    body
                  )}
                </View>
              )
            })}
          </View>
        ))}
        {slotsLeft > 0 ? (
          <View style={{ width: 168 }}>
            <View style={[styles.cell, { height: HEAD_H, paddingTop: 14, justifyContent: 'flex-start' }]}>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Add a property to compare"
                onPress={() => router.push({ pathname: '/search', params: { kind: 'sale' } })}
                style={styles.add}
              >
                <View style={styles.addIcon}>
                  <Plus size={20} color={colors.plum} />
                </View>
                <Text size={13.5} weight={600} color="plum">
                  Add a property
                </Text>
              </Pressable>
              <Text size={12} color="muted" lineHeight={17} style={{ marginTop: 10 }}>
                Add up to {slotsLeft} more from any property screen using “Add to compare”.
              </Text>
            </View>
            {ROWS.map((r) => (
              <View key={r.label} style={[styles.cell, { height: ROW_H }]} />
            ))}
          </View>
        ) : null}
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  table: { flexDirection: 'row', backgroundColor: colors.white, borderRadius: radius.card, overflow: 'hidden', ...shadow.soft },
  labels: { width: LABEL_W, borderRightWidth: StyleSheet.hairlineWidth, borderRightColor: colors.line, backgroundColor: colors.white, zIndex: 1 },
  cell: { paddingHorizontal: 12, justifyContent: 'center', borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.line },
  labelCell: { paddingVertical: 10 },
  photo: { aspectRatio: 1.6, borderRadius: radius.md, overflow: 'hidden', backgroundColor: colors.mist },
  remove: { position: 'absolute', top: 6, right: 6, width: 32, height: 32, borderRadius: 16, backgroundColor: 'rgba(255,255,255,0.95)', alignItems: 'center', justifyContent: 'center' },
  add: { aspectRatio: 1.45, borderRadius: radius.md, borderWidth: 2, borderStyle: 'dashed', borderColor: colors.line, alignItems: 'center', justifyContent: 'center', gap: 8 },
  addIcon: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.mist, alignItems: 'center', justifyContent: 'center' },
  warn: { flexDirection: 'row', gap: 10, marginTop: 14, padding: 14, borderRadius: radius.md, backgroundColor: colors.mist },
  cta: { backgroundColor: colors.white, borderRadius: radius.card, padding: 22, ...shadow.soft },
})
