import { View } from 'react-native'

import { useCurrency } from '@/features/favorites/hooks'
import { BATH_OPTIONS, BED_OPTIONS, COMPLETION_LABEL, FURNISHING_LABEL, PRICE_PRESETS, PROPERTY_TYPES } from '@/features/search/options'
import type { SearchParams } from '@/features/search/schemas'
import { formatPrice } from '@/lib/format'
import { Button } from '@/ui/Button'
import { SelectField } from '@/ui/Field'
import { Chip } from '@/ui/primitives'
import { Sheet } from '@/ui/Sheet'
import { Text } from '@/ui/Text'
import { presetScope, type Filters, type Scope } from './filters'

const num = (v: string) => (v === '' ? undefined : Number(v))

/** All search filters in a bottom sheet (site: FilterDrawer + FilterFields layout="drawer"). Applies live. */
export function FilterSheet({
  open,
  onClose,
  scope,
  filters,
  setFilters,
  onClearAll,
  count,
}: {
  open: boolean
  onClose: () => void
  scope: Scope
  filters: Filters
  setFilters: (next: Partial<Filters>) => void
  onClearAll: () => void
  count: number
}) {
  const currency = useCurrency()
  const presets = PRICE_PRESETS[presetScope(scope)]
  const suffix = scope === 'rent' ? ' /yr' : ''
  const priceOpts = (values: number[], anyLabel: string) => [
    { value: '', label: anyLabel },
    ...values.map((v) => ({ value: String(v), label: `${formatPrice(v, currency, { compact: true })}${suffix}` })),
  ]
  const minOpts = priceOpts(filters.maxPrice === undefined ? presets : presets.filter((v) => v <= filters.maxPrice!), 'No min')
  const maxOpts = priceOpts(filters.minPrice === undefined ? presets : presets.filter((v) => v >= filters.minPrice!), 'No max')
  const plural = scope === 'rent' ? 'rentals' : 'properties'

  return (
    <Sheet open={open} onClose={onClose} title="Filters">
      <View style={{ gap: 16, paddingBottom: 8 }}>
        <SelectField
          label="Property type"
          value={filters.type ?? ''}
          onChange={(v) => setFilters({ type: v || undefined })}
          options={[{ value: '', label: 'Any type' }, ...PROPERTY_TYPES.map((t) => ({ value: t, label: t }))]}
        />

        <View>
          <Text size={13} weight={600} color="plum" style={{ marginBottom: 8 }}>
            Bedrooms
          </Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
            <Chip label="Any" active={filters.beds === undefined} onPress={() => setFilters({ beds: undefined })} style={{ minHeight: 40, justifyContent: 'center' }} />
            {BED_OPTIONS.map((b) => (
              <Chip
                key={b.value}
                label={b.label}
                active={filters.beds === b.value}
                onPress={() => setFilters({ beds: filters.beds === b.value ? undefined : b.value })}
                style={{ minHeight: 40, justifyContent: 'center' }}
              />
            ))}
          </View>
        </View>

        <View style={{ flexDirection: 'row', gap: 12 }}>
          <SelectField
            label={scope === 'rent' ? 'Min rent' : 'Min price'}
            value={filters.minPrice === undefined ? '' : String(filters.minPrice)}
            onChange={(v) => setFilters({ minPrice: num(v) })}
            options={minOpts}
            containerStyle={{ flex: 1 }}
          />
          <SelectField
            label={scope === 'rent' ? 'Max rent' : 'Max price'}
            value={filters.maxPrice === undefined ? '' : String(filters.maxPrice)}
            onChange={(v) => setFilters({ maxPrice: num(v) })}
            options={maxOpts}
            containerStyle={{ flex: 1 }}
          />
        </View>

        <View style={{ flexDirection: 'row', gap: 12 }}>
          <SelectField
            label="Bathrooms"
            value={filters.baths === undefined ? '' : String(filters.baths)}
            onChange={(v) => setFilters({ baths: num(v) })}
            options={[{ value: '', label: 'Any' }, ...BATH_OPTIONS.map((b) => ({ value: String(b), label: `${b}+` }))]}
            containerStyle={{ flex: 1 }}
          />
          {scope === 'buy' ? (
            <SelectField
              label="Completion"
              value={filters.completion ?? ''}
              onChange={(v) => setFilters({ completion: (v || undefined) as SearchParams['completion'] })}
              options={[{ value: '', label: 'Any' }, ...Object.entries(COMPLETION_LABEL).map(([value, label]) => ({ value, label }))]}
              containerStyle={{ flex: 1 }}
            />
          ) : scope === 'rent' ? (
            <SelectField
              label="Furnishing"
              value={filters.furnishing ?? ''}
              onChange={(v) => setFilters({ furnishing: (v || undefined) as SearchParams['furnishing'] })}
              options={[{ value: '', label: 'Any' }, ...Object.entries(FURNISHING_LABEL).map(([value, label]) => ({ value, label }))]}
              containerStyle={{ flex: 1 }}
            />
          ) : (
            <View style={{ flex: 1 }} />
          )}
        </View>

        <View style={{ flexDirection: 'row', gap: 10, marginTop: 8 }}>
          <Button title="Clear all" variant="outline" size="lg" onPress={onClearAll} />
          <Button title={`Show ${count} ${count === 1 ? plural.replace(/ies$/, 'y').replace(/s$/, '') : plural}`} size="lg" onPress={onClose} style={{ flex: 1 }} />
        </View>
      </View>
    </Sheet>
  )
}
