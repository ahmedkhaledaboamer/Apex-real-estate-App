import { LinearGradient } from 'expo-linear-gradient'
import { MapPin, Search } from 'lucide-react-native'
import { useState } from 'react'
import { Pressable, StyleSheet, TextInput, View } from 'react-native'

import { IMG } from '@/assets/images'
import { colors, fonts, gradients, GUTTER, radius, shadow } from '@/theme'
import { SelectField } from '@/ui/Field'
import { Img } from '@/ui/Img'
import { Text } from '@/ui/Text'
import { goToSearch } from './common'

const TABS = ['Buy', 'Rent', 'Off-Plan'] as const
type Tab = (typeof TABS)[number]
const CHIPS = ['Dubai Marina', 'Downtown', 'Business Bay', 'JVC', 'Palm Jumeirah']
const LOCATIONS = [
  'Dubai Marina', 'Downtown Dubai', 'Business Bay', 'Jumeirah Village Circle (JVC)', 'Palm Jumeirah',
  'Dubai Hills Estate', 'Dubai Creek Harbour', 'DAMAC Lagoons', 'DAMAC Hills 2', 'Meydan City', 'Dubai South', 'Arjan', 'Al Furjan',
]
const TYPES = ['Any type', 'Apartment', 'Villa', 'Townhouse', 'Penthouse', 'Studio']
const BEDS = ['Any', 'Studio', '1', '2', '3', '4', '5+']
const RENT_PRICES = ['Any price', 'Up to AED 80K/yr', 'AED 80K–150K/yr', 'AED 150K+/yr']
const SALE_PRICES = ['Any price', 'Up to AED 1.5M', 'AED 1.5M–3M', 'AED 3M–10M', 'AED 10M+']
const PRICE_RANGES: Record<string, [number | undefined, number | undefined]> = {
  'Up to AED 80K/yr': [undefined, 80_000],
  'AED 80K–150K/yr': [80_000, 150_000],
  'AED 150K+/yr': [150_000, undefined],
  'Up to AED 1.5M': [undefined, 1_500_000],
  'AED 1.5M–3M': [1_500_000, 3_000_000],
  'AED 3M–10M': [3_000_000, 10_000_000],
  'AED 10M+': [10_000_000, undefined],
}

/** Home hero: skyline photo, brand overlay, headline and the glass search card (site: HeroSection). */
export function Hero() {
  const [tab, setTab] = useState<Tab>('Buy')
  const [query, setQuery] = useState('')
  const [focused, setFocused] = useState(false)
  const [type, setType] = useState('Any type')
  const [beds, setBeds] = useState('Any')
  const [price, setPrice] = useState('Any price')
  const suggestions = query.length > 0 ? LOCATIONS.filter((l) => l.toLowerCase().includes(query.toLowerCase()) && l !== query).slice(0, 5) : []

  const submit = () => {
    const location = query.match(/\((\w+)\)$/)?.[1] ?? query.trim()
    const [minPrice, maxPrice] = PRICE_RANGES[price] ?? []
    goToSearch({
      kind: tab === 'Rent' ? 'rent' : tab === 'Off-Plan' ? 'offplan' : 'buy',
      location: location || undefined,
      type: type !== 'Any type' ? type : undefined,
      beds: beds === 'Studio' ? 0 : beds !== 'Any' ? parseInt(beds, 10) : undefined,
      minPrice,
      maxPrice,
    })
  }

  return (
    <View style={styles.hero}>
      <Img src={IMG.hero} style={StyleSheet.absoluteFill} contentPosition={{ left: '50%', top: '40%' }} accessibilityLabel="Dubai skyline with Burj Khalifa at golden hour" />
      <LinearGradient
        colors={['rgba(56,26,76,0.86)', 'rgba(86,61,150,0.6)', 'rgba(39,91,168,0.35)']}
        locations={[0, 0.5, 1]}
        start={{ x: 0, y: 0.2 }}
        end={{ x: 1, y: 0.8 }}
        style={StyleSheet.absoluteFill}
      />
      <LinearGradient colors={['rgba(30,24,40,0)', 'rgba(30,24,40,0.5)']} style={styles.bottomFade} />

      <View style={{ paddingHorizontal: GUTTER, paddingTop: 44, paddingBottom: 36 }}>
        <Text display weight={600} size={50} lineHeight={48} color="white" accessibilityRole="header">
          Find your place in Dubai.
        </Text>
        <Text size={17} color="white" lineHeight={26} style={{ marginTop: 14, opacity: 0.85 }}>
          Buy, rent and invest with confidence.
        </Text>

        {/* Glass search */}
        <View style={{ marginTop: 28 }}>
          <View accessibilityRole="tablist" style={styles.tabs}>
            {TABS.map((t) => (
              <Pressable
                key={t}
                accessibilityRole="tab"
                accessibilityState={{ selected: tab === t }}
                onPress={() => {
                  setTab(t)
                  setPrice('Any price')
                }}
                style={[styles.tab, tab === t && { backgroundColor: colors.white }]}
              >
                <Text size={14} weight={600} color={tab === t ? 'plum' : 'white'}>
                  {t}
                </Text>
              </Pressable>
            ))}
          </View>
          <View style={styles.glass}>
            <View style={styles.locationBox}>
              <Text size={11.5} weight={600} color="muted">
                Location
              </Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <MapPin size={16} color={colors.aura} />
                <TextInput
                  value={query}
                  onChangeText={setQuery}
                  onFocus={() => setFocused(true)}
                  onBlur={() => setTimeout(() => setFocused(false), 150)}
                  placeholder="Community or building"
                  placeholderTextColor="rgba(107,97,120,0.7)"
                  returnKeyType="search"
                  onSubmitEditing={submit}
                  accessibilityLabel="Location"
                  style={styles.input}
                />
              </View>
            </View>
            {focused && suggestions.length > 0 ? (
              <View style={styles.suggestions}>
                {suggestions.map((s) => (
                  <Pressable key={s} accessibilityRole="button" onPress={() => setQuery(s)} style={({ pressed }) => [styles.suggestion, pressed && { backgroundColor: colors.mist }]}>
                    <MapPin size={14} color={colors.muted} />
                    <Text size={14}>{s}</Text>
                  </Pressable>
                ))}
              </View>
            ) : null}
            <SelectField tone="solid" label="Property type" options={TYPES} value={type} onChange={setType} />
            <View style={{ flexDirection: 'row', gap: 8 }}>
              <SelectField tone="solid" label="Beds" options={BEDS} value={beds} onChange={setBeds} containerStyle={{ flex: 0.8 }} />
              <SelectField tone="solid" label="Price" options={tab === 'Rent' ? RENT_PRICES : SALE_PRICES} value={price} onChange={setPrice} containerStyle={{ flex: 1.2 }} />
            </View>
            <Pressable accessibilityRole="button" accessibilityLabel="Search" onPress={submit} style={({ pressed }) => [{ transform: [{ scale: pressed ? 0.98 : 1 }] }]}>
              <LinearGradient colors={gradients.aura.colors} start={gradients.aura.start} end={gradients.aura.end} style={styles.searchBtn}>
                <Search size={18} color={colors.white} />
                <Text size={15} weight={600} color="white">
                  Search
                </Text>
              </LinearGradient>
            </Pressable>
          </View>

          <View style={styles.chips}>
            <Text size={13} color="white" style={{ opacity: 0.7, marginRight: 2 }}>
              Popular:
            </Text>
            {CHIPS.map((c) => (
              <Pressable key={c} accessibilityRole="button" accessibilityLabel={`Search ${c}`} onPress={() => setQuery(c)} style={styles.chip}>
                <Text size={13} weight={500} color="white">
                  {c}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  hero: { backgroundColor: colors.plum, overflow: 'hidden' },
  bottomFade: { position: 'absolute', left: 0, right: 0, bottom: 0, height: 160 },
  tabs: {
    flexDirection: 'row',
    alignSelf: 'flex-start',
    padding: 4,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    borderWidth: 1,
    borderBottomWidth: 0,
    borderColor: 'rgba(255,255,255,0.25)',
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  tab: { paddingHorizontal: 18, paddingVertical: 9, borderRadius: 12 },
  glass: {
    gap: 8,
    padding: 8,
    borderRadius: 16,
    borderTopLeftRadius: 0,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.25)',
    backgroundColor: 'rgba(255,255,255,0.15)',
    ...shadow.glass,
  },
  locationBox: { backgroundColor: colors.white, borderRadius: radius.md, paddingHorizontal: 16, paddingVertical: 10, gap: 2 },
  input: { flex: 1, fontFamily: fonts.sans[500], fontSize: 15, color: colors.ink, paddingVertical: 2, minHeight: 24 },
  suggestions: { backgroundColor: colors.white, borderRadius: radius.md, paddingVertical: 4, ...shadow.lift },
  suggestion: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 16, minHeight: 44 },
  searchBtn: { height: 54, borderRadius: radius.md, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: 8, marginTop: 18 },
  chip: { borderWidth: 1, borderColor: 'rgba(255,255,255,0.3)', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: radius.pill, paddingHorizontal: 14, paddingVertical: 7 },
})
