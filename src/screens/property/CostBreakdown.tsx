import { router } from 'expo-router'
import { useState } from 'react'
import { Pressable, StyleSheet, View } from 'react-native'

import { useCurrency } from '@/features/favorites/hooks'
import {
  AGENCY_COMMISSION,
  DLD_TRANSFER_FEE,
  MORTGAGE_REGISTRATION,
  MORTGAGE_REGISTRATION_ADMIN,
  TITLE_DEED_FEE,
  TRUSTEE_FEE_HIGH,
  TRUSTEE_FEE_LOW,
  VAT,
} from '@/lib/constants'
import { formatPrice } from '@/lib/format'
import { colors, radius, shadow } from '@/theme'
import type { Currency, Property } from '@/types'
import { Text } from '@/ui/Text'
import { LinkAction } from '../home/common'

/** Rental-side costs (indicative Dubai norms) — same as the website's CostBreakdown. */
const RENT_AGENCY_FEE = 0.05
const EJARI_FEE = 220
const DEWA_DEPOSIT = 2_000

type Row = { label: string; sub?: string; aed: number }

/** Upfront cost estimate: buyer fees (sale / off-plan) or move-in costs (rent). */
export function CostBreakdown({ property: p }: { property: Property }) {
  return p.kind === 'rent' ? <RentCosts property={p} /> : <SaleCosts property={p} />
}

function SaleCosts({ property: p }: { property: Property }) {
  const currency = useCurrency()
  const [mortgage, setMortgage] = useState(false)
  const price = p.priceAed
  const ltv = price > 5_000_000 ? 0.7 : 0.8
  const loan = price * ltv

  const fees: Row[] = [
    { label: 'DLD transfer fee', sub: `${DLD_TRANSFER_FEE * 100}% of the price`, aed: price * DLD_TRANSFER_FEE },
    { label: 'Agency commission', sub: `${AGENCY_COMMISSION * 100}% + ${VAT * 100}% VAT`, aed: price * AGENCY_COMMISSION * (1 + VAT) },
    {
      label: 'Trustee office fee',
      sub: `${price >= 500_000 ? 'Property AED 500k+' : 'Property under AED 500k'}, incl. VAT`,
      aed: (price >= 500_000 ? TRUSTEE_FEE_HIGH : TRUSTEE_FEE_LOW) * (1 + VAT),
    },
    { label: 'Title deed issuance', aed: TITLE_DEED_FEE },
  ]
  if (mortgage) {
    fees.push({ label: 'Mortgage registration', sub: `${MORTGAGE_REGISTRATION * 100}% of the loan + admin`, aed: loan * MORTGAGE_REGISTRATION + MORTGAGE_REGISTRATION_ADMIN })
  }
  const feeTotal = fees.reduce((s, r) => s + r.aed, 0)
  const base: Row = mortgage
    ? { label: 'Down payment', sub: `${Math.round((1 - ltv) * 100)}% deposit · loan ${formatPrice(loan, currency)}`, aed: price - loan }
    : { label: 'Purchase price', aed: price }

  return (
    <View>
      <Pressable
        accessibilityRole="switch"
        accessibilityState={{ checked: mortgage }}
        accessibilityLabel="Buying with a mortgage?"
        onPress={() => setMortgage((m) => !m)}
        style={styles.switchRow}
      >
        <Text size={14.5} weight={600} color="plum" style={{ flex: 1 }}>
          Buying with a mortgage?
        </Text>
        <View style={[styles.track, { backgroundColor: mortgage ? colors.plum : colors.line }]}>
          <View style={[styles.thumb, { left: mortgage ? 24 : 4 }]} />
        </View>
      </Pressable>

      <CostTable rows={[base, ...fees]} currency={currency} />

      <View style={{ gap: 10, marginTop: 16 }}>
        <Total label="Fees and charges" value={formatPrice(feeTotal, currency)} />
        <Total label="Total cash needed" value={formatPrice(base.aed + feeTotal, currency)} strong />
      </View>
      <Text size={12.5} color="muted" style={{ marginTop: 12 }}>
        Estimates only. {mortgage ? `Assumes ${Math.round(ltv * 100)}% loan-to-value for a first home; bank valuation and arrangement fees are extra.` : 'Fees are set by DLD and may change.'}
      </Text>
      <LinkAction label="Estimate your monthly payments" onPress={() => router.push('/tools/mortgage')} style={{ marginTop: 14 }} />
    </View>
  )
}

function RentCosts({ property: p }: { property: Property }) {
  const currency = useCurrency()
  const rent = p.priceAed
  const cheques = p.cheques ?? 1
  const perCheque = rent / cheques
  const depositPct = p.furnishing === 'unfurnished' ? 0.05 : 0.1
  const rows: Row[] = [
    { label: 'First cheque', sub: `${cheques} cheque${cheques > 1 ? 's' : ''} of ${formatPrice(perCheque, currency)}`, aed: perCheque },
    { label: 'Security deposit', sub: `${depositPct * 100}% of annual rent (${p.furnishing === 'unfurnished' ? 'unfurnished' : 'furnished'}), refundable`, aed: rent * depositPct },
    { label: 'Agency fee', sub: `${RENT_AGENCY_FEE * 100}% + ${VAT * 100}% VAT`, aed: rent * RENT_AGENCY_FEE * (1 + VAT) },
    { label: 'Ejari registration', sub: 'Approximate', aed: EJARI_FEE },
    { label: 'DEWA deposit', sub: 'Approximate, refundable', aed: DEWA_DEPOSIT },
  ]
  const upfront = rows.reduce((s, r) => s + r.aed, 0)

  return (
    <View>
      <View style={{ flexDirection: 'row', gap: 10 }}>
        <Total label="Annual rent" value={formatPrice(rent, currency)} style={{ flex: 1 }} />
        <Total label={`Per cheque (${cheques})`} value={formatPrice(perCheque, currency)} style={{ flex: 1 }} />
      </View>
      <CostTable rows={rows} currency={currency} />
      <Total label="Total to move in" value={formatPrice(upfront, currency)} strong style={{ marginTop: 16 }} />
      <Text size={12.5} color="muted" style={{ marginTop: 12 }}>
        Estimates only. Cheque terms are agreed with the landlord; deposits are returned at the end of the tenancy subject to condition.
      </Text>
      <LinkAction label="Compare renting with buying" onPress={() => router.push('/tools/rent-vs-buy')} style={{ marginTop: 14 }} />
    </View>
  )
}

function CostTable({ rows, currency }: { rows: Row[]; currency: Currency }) {
  return (
    <View style={styles.table}>
      {rows.map((r, i) => (
        <View key={r.label} style={[styles.row, i > 0 && { borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: colors.line }]}>
          <View style={{ flex: 1 }}>
            <Text size={14.5} weight={500}>
              {r.label}
            </Text>
            {r.sub ? (
              <Text size={12.5} color="muted">
                {r.sub}
              </Text>
            ) : null}
          </View>
          <Text size={14.5} weight={600} color="plum">
            {formatPrice(r.aed, currency)}
          </Text>
        </View>
      ))}
    </View>
  )
}

function Total({ label, value, strong, style }: { label: string; value: string; strong?: boolean; style?: object }) {
  return (
    <View style={[styles.total, { backgroundColor: strong ? colors.plum : colors.mist }, style]}>
      <Text size={12} color={strong ? 'white' : 'muted'} style={strong ? { opacity: 0.7 } : undefined}>
        {label}
      </Text>
      <Text size={20} weight={700} color={strong ? 'white' : 'plum'}>
        {value}
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  switchRow: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: colors.mist, borderRadius: radius.md, paddingHorizontal: 16, minHeight: 52 },
  track: { width: 48, height: 28, borderRadius: 14 },
  thumb: { position: 'absolute', top: 4, width: 20, height: 20, borderRadius: 10, backgroundColor: colors.white, ...shadow.soft },
  table: { marginTop: 16, borderTopWidth: StyleSheet.hairlineWidth, borderBottomWidth: StyleSheet.hairlineWidth, borderColor: colors.line },
  row: { flexDirection: 'row', alignItems: 'flex-start', gap: 16, paddingVertical: 12 },
  total: { borderRadius: radius.md, paddingHorizontal: 16, paddingVertical: 12 },
})
