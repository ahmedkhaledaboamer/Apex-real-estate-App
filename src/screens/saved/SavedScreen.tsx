import { router } from 'expo-router'
import { Check, Info, Scale, Share2, Trash2 } from 'lucide-react-native'
import { useMemo, useState } from 'react'
import { Pressable, Share, StyleSheet, View } from 'react-native'
import Animated, { FadeIn, FadeOut, LinearTransition } from 'react-native-reanimated'

import { useCompare } from '@/features/favorites/hooks'
import { propertyById } from '@/mocks/properties'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { MAX_COMPARE } from '@/store/slices/compareSlice'
import { clearFavorites } from '@/store/slices/favoritesSlice'
import type { Listing, Property } from '@/types'
import { whatsapp } from '@/ui/brand'
import { Button } from '@/ui/Button'
import { Container, EmptyState } from '@/ui/primitives'
import { PropertyCard } from '@/ui/PropertyCard'
import { Screen } from '@/ui/Screen'
import { Segmented } from '@/ui/Segmented'
import { Sheet } from '@/ui/Sheet'
import { Heading, Text } from '@/ui/Text'
import { colors, GUTTER, radius, shadow } from '@/theme'

type Sort = 'recent' | 'price-asc' | 'price-desc'
const SORTS: { key: Sort; label: string }[] = [
  { key: 'recent', label: 'Recently saved' },
  { key: 'price-asc', label: 'Price ↑' },
  { key: 'price-desc', label: 'Price ↓' },
]

export const listingWebUrl = (l: Pick<Listing, 'id' | 'kind'>) => `https://apexaora.ae/${l.kind === 'rent' ? 'rent' : 'buy'}/${l.id}`

export function SavedScreen() {
  const dispatch = useAppDispatch()
  const ids = useAppSelector((s) => s.favorites.ids)
  const compareCount = useAppSelector((s) => s.compare.ids.length)
  const [sort, setSort] = useState<Sort>('recent')
  const [confirmOpen, setConfirmOpen] = useState(false)

  const items = useMemo(() => {
    const list = ids.map(propertyById).filter((p): p is Property => p !== undefined)
    if (sort === 'recent') return [...list].reverse()
    return [...list].sort((a, b) => (sort === 'price-asc' ? a.priceAed - b.priceAed : b.priceAed - a.priceAed))
  }, [ids, sort])

  const share = async () => {
    const text = ['My saved properties on Apex Aora:', ...items.map((l, i) => `${i + 1}. ${l.title} (${l.community}) – ${listingWebUrl(l)}`)].join('\n')
    try {
      await Share.share({ title: 'My saved properties', message: text })
    } catch {
      void whatsapp('', text)
    }
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.paper }}>
      <Screen variant="tab" contentContainerStyle={{ paddingBottom: compareCount > 0 && items.length > 0 ? 120 : 48 }}>
        <Container style={{ paddingTop: 22 }}>
          <Heading size={38} accessibilityRole="header">
            Saved properties
          </Heading>
          <Text size={15} color="muted" lineHeight={22} style={{ marginTop: 6 }}>
            Homes you have hearted while browsing. Compare them side by side, share the list or ask an adviser to arrange viewings.
          </Text>
        </Container>

        {items.length === 0 ? (
          <Container style={{ marginTop: 24 }}>
            <EmptyState
              title="No saved properties yet"
              body="Tap the heart on any listing to save it here. Your shortlist stays on this device while you search."
              action={
                <View style={{ gap: 10, alignItems: 'center' }}>
                  <Button title="Browse homes for sale" onPress={() => router.push({ pathname: '/search', params: { kind: 'sale' } })} />
                  <Button title="Browse rentals" variant="outline" onPress={() => router.push({ pathname: '/search', params: { kind: 'rent' } })} />
                </View>
              }
            />
          </Container>
        ) : (
          <>
            <Container style={{ marginTop: 18 }}>
              <View style={styles.toolbar}>
                <View style={{ flex: 1 }}>
                  <Text size={15} color="muted" accessibilityLiveRegion="polite">
                    <Text size={15} weight={600} color="plum">
                      {items.length}
                    </Text>{' '}
                    saved {items.length === 1 ? 'property' : 'properties'}
                  </Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 2 }}>
                    <Info size={13} color={colors.muted} />
                    <Text size={12.5} color="muted">
                      Saved on this device only.
                    </Text>
                  </View>
                </View>
              </View>
              <View style={{ flexDirection: 'row', gap: 8, marginTop: 14 }}>
                <Button title="Share list" variant="outline" size="sm" icon={<Share2 size={15} color={colors.plum} />} onPress={share} />
                <Button title="Clear all" variant="ghost" size="sm" icon={<Trash2 size={15} color={colors.plum} />} onPress={() => setConfirmOpen(true)} />
              </View>
            </Container>

            <Segmented style={{ marginHorizontal: GUTTER, marginTop: 18, alignSelf: 'flex-start' }} value={sort} onChange={setSort} tabs={SORTS} />

            <Container style={{ marginTop: 20, gap: 22 }}>
              {items.map((p) => (
                <Animated.View key={p.id} entering={FadeIn.duration(200)} exiting={FadeOut.duration(180)} layout={LinearTransition.duration(220)}>
                  <SavedItem listing={p} />
                </Animated.View>
              ))}
            </Container>

            <Container style={{ marginTop: 32 }}>
              <View style={styles.viewings}>
                <Heading size={26}>Ready to see them in person?</Heading>
                <Text size={14.5} color="muted" style={{ marginTop: 6 }}>
                  An adviser can line up viewings for your whole shortlist on the same day.
                </Text>
                <Button title="Arrange viewings" onPress={() => router.push('/contact')} style={{ marginTop: 16 }} />
              </View>
            </Container>
          </>
        )}
      </Screen>

      {compareCount > 0 && items.length > 0 ? <CompareTray count={compareCount} /> : null}

      <Sheet open={confirmOpen} onClose={() => setConfirmOpen(false)} title="Clear all saved properties?">
        <Text size={15} color="muted" lineHeight={23}>
          This removes all {items.length} {items.length === 1 ? 'property' : 'properties'} from your saved list. You can’t undo this.
        </Text>
        <View style={{ flexDirection: 'row', gap: 10, marginTop: 22, marginBottom: 6 }}>
          <Button title="Keep them" variant="outline" full style={{ flex: 1 }} onPress={() => setConfirmOpen(false)} />
          <Button
            title="Clear all"
            variant="plum"
            full
            style={{ flex: 1 }}
            onPress={() => {
              dispatch(clearFavorites())
              setConfirmOpen(false)
            }}
          />
        </View>
      </Sheet>
    </View>
  )
}

/** Saved card + "Add to compare" toggle underneath (site: FavoriteItem). */
function SavedItem({ listing }: { listing: Listing }) {
  const { inCompare, full, toggle } = useCompare(listing.id)
  return (
    <View style={{ gap: 10 }}>
      <PropertyCard listing={listing} />
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ selected: inCompare, disabled: full }}
        accessibilityLabel={inCompare ? `Remove ${listing.title} from compare` : `Add ${listing.title} to compare`}
        disabled={full}
        onPress={toggle}
        style={[styles.compareBtn, inCompare ? { backgroundColor: colors.plum, borderColor: colors.plum } : { backgroundColor: colors.white, borderColor: colors.line }, full && { opacity: 0.5 }]}
      >
        {inCompare ? <Check size={16} color={colors.white} /> : <Scale size={16} color={colors.plum} />}
        <Text size={13.5} weight={600} color={inCompare ? 'white' : 'plum'}>
          {inCompare ? 'Added to compare' : full ? `Compare list full (${MAX_COMPARE})` : 'Add to compare'}
        </Text>
      </Pressable>
    </View>
  )
}

function CompareTray({ count }: { count: number }) {
  return (
    <Animated.View entering={FadeIn.duration(200)} exiting={FadeOut.duration(150)} style={styles.tray}>
      <Scale size={20} color={colors.aura} />
      <View style={{ flex: 1 }}>
        <Text size={14} weight={600} color="plum">
          {count} selected to compare
        </Text>
        <Text size={12} color="muted">
          Up to {MAX_COMPARE} side by side
        </Text>
      </View>
      <Button title={`Compare (${count})`} variant="plum" size="sm" onPress={() => router.push('/compare')} />
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  toolbar: { flexDirection: 'row', alignItems: 'center', borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.line, paddingBottom: 14 },
  compareBtn: { height: 44, borderRadius: radius.pill, borderWidth: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  viewings: { backgroundColor: colors.white, borderRadius: radius.card, padding: 22, ...shadow.soft },
  tray: {
    position: 'absolute',
    left: GUTTER,
    right: GUTTER,
    bottom: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: 'rgba(255,255,255,0.97)',
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.line,
    paddingVertical: 8,
    paddingLeft: 18,
    paddingRight: 8,
    ...shadow.lift,
  },
})
