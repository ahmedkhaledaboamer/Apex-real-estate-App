import { FILTER_KEYS, type SearchScope } from '@/features/search/options'
import { validateSearchParams, type SearchParams } from '@/features/search/schemas'
import { filterProperties } from '@/lib/filterProperties'
import { PROPERTIES } from '@/mocks/properties'

/** The app's Search tab has three pools: Buy (sale + off-plan), Rent, Off-plan (units only). */
export type Scope = 'buy' | 'rent' | 'offplan'
export type Filters = Omit<SearchParams, 'kind' | 'view' | 'page'>
export type FilterKey = (typeof FILTER_KEYS)[number]

export const SCOPE_TABS: { key: Scope; label: string }[] = [
  { key: 'buy', label: 'Buy' },
  { key: 'rent', label: 'Rent' },
  { key: 'offplan', label: 'Off-Plan' },
]

/** Price presets / labels: off-plan uses the sale presets. */
export const presetScope = (s: Scope): SearchScope => (s === 'rent' ? 'rent' : 'buy')

export function scopeFromParam(kind: unknown): Scope {
  return kind === 'rent' ? 'rent' : kind === 'offplan' ? 'offplan' : 'buy'
}

/** Route params (strings) → typed filters, via the website's validator. */
export function filtersFromParams(params: Record<string, unknown>): Filters {
  const { kind: _k, view: _v, page: _p, ...rest } = validateSearchParams(params)
  return rest
}

/** Filters that apply to this scope (completion: Buy only, furnishing: Rent only). */
export function activeKeys(scope: Scope, f: Filters): FilterKey[] {
  return FILTER_KEYS.filter((k) => {
    if (k === 'completion' && scope !== 'buy') return false
    if (k === 'furnishing' && scope !== 'rent') return false
    const v = f[k]
    return v !== undefined && v !== ''
  })
}

/** Same pools as the website's useListingResults (Buy = everything except rentals). */
export function results(scope: Scope, f: Filters) {
  const base = { ...f, completion: scope === 'buy' ? f.completion : undefined, furnishing: scope === 'rent' ? f.furnishing : undefined }
  if (scope === 'rent') return filterProperties(PROPERTIES, { ...base, kind: 'rent' })
  if (scope === 'offplan') return filterProperties(PROPERTIES, { ...base, kind: 'offplan' })
  return filterProperties(PROPERTIES, base).filter((p) => p.kind !== 'rent')
}

export const NOUN: Record<Scope, [string, string]> = {
  buy: ['property', 'properties'],
  rent: ['rental', 'rentals'],
  offplan: ['off-plan home', 'off-plan homes'],
}

export const TITLE: Record<Scope, { title: string; sub: string }> = {
  buy: {
    title: 'Properties for sale in Dubai',
    sub: 'Ready and off-plan homes with a valid Trakheesi permit and a verified agent. Filter by community, budget and size.',
  },
  rent: {
    title: 'Properties for rent in Dubai',
    sub: 'Annual rentals with transparent cheque options, deposits and fees. Every listing carries its Trakheesi permit.',
  },
  offplan: {
    title: 'Off-plan projects in Dubai',
    sub: 'New launches from Dubai’s leading developers, with the payment plan, handover date and regulatory details on every project.',
  },
}
