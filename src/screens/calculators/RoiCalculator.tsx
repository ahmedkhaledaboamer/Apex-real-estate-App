import { router } from 'expo-router'
import { useMemo, useState } from 'react'
import { View, type StyleProp, type ViewStyle } from 'react-native'

import { MAX_TERM_YEARS, roi } from '@/features/calculators/lib'
import { useCurrency } from '@/features/favorites/hooks'
import { formatPrice } from '@/lib/format'
import { BarRows, CHART } from './charts'
import { ArrowLink } from './page'
import { Breakdown, CalculatorShell, ChoiceChips, Disclaimer, GroupTitle, NumberField, pct, ResultHeadline, ResultLabel } from './ui'

const DEFAULTS = {
  price: 1_500_000,
  annualRent: 110_000,
  scMode: 'psf' as 'psf' | 'annual',
  scPsf: 16,
  size: 900,
  scAnnual: 14_400,
  maintenancePct: 5,
  vacancyWeeks: 2,
  managementPct: 5,
  mortgage: false,
  downPct: 25,
  rate: 4.25,
  years: 25,
}

/** Rental ROI / yield calculator. `compact` hides mortgage, running-cost inputs and the chart (site: RoiCalculator). */
export function RoiCalculator({ initial, compact = false, style }: { initial?: { price?: number; rent?: number }; compact?: boolean; style?: StyleProp<ViewStyle> }) {
  const currency = useCurrency()
  const start = { ...DEFAULTS, price: initial?.price ?? DEFAULTS.price, annualRent: initial?.rent ?? DEFAULTS.annualRent }
  const [s, setS] = useState(start)
  const set =
    <K extends keyof typeof DEFAULTS>(k: K) =>
    (v: (typeof DEFAULTS)[K]) =>
      setS((p) => ({ ...p, [k]: v }))
  const fmt = (n: number) => formatPrice(Math.round(n), currency)

  const serviceCharge = s.scMode === 'psf' ? s.scPsf * s.size : s.scAnnual
  const mortgage = !compact && s.mortgage
  const r = useMemo(
    () =>
      roi({
        price: s.price,
        annualRent: s.annualRent,
        serviceCharge,
        maintenancePct: s.maintenancePct,
        vacancyWeeks: s.vacancyWeeks,
        managementPct: s.managementPct,
        mortgage,
        downPct: s.downPct,
        rate: s.rate,
        years: s.years,
      }),
    [s, serviceCharge, mortgage],
  )

  return (
    <CalculatorShell
      style={style}
      title={compact ? 'Quick yield check' : 'Rental ROI calculator'}
      onReset={() => setS(start)}
      inputs={
        <>
          <NumberField label="Purchase price (AED)" prefix="AED" value={s.price} onChange={set('price')} min={300_000} max={200_000_000} step={50_000} />
          <NumberField label="Annual rent (AED)" prefix="AED" value={s.annualRent} onChange={set('annualRent')} min={20_000} max={20_000_000} step={5_000} />
          <ChoiceChips
            label="Service charge"
            value={s.scMode}
            onChange={set('scMode')}
            options={[
              { value: 'psf', label: 'AED per sq ft' },
              { value: 'annual', label: 'Annual amount' },
            ]}
          />
          {s.scMode === 'psf' ? (
            <>
              <NumberField label="Service charge (AED / sq ft)" prefix="AED" value={s.scPsf} onChange={set('scPsf')} min={0} max={40} step={0.5} decimals={1} />
              <NumberField label="Size (sq ft)" suffix="sq ft" value={s.size} onChange={set('size')} min={300} max={50_000} step={50} hint={`${fmt(serviceCharge)} a year`} />
            </>
          ) : (
            <NumberField label="Service charge (AED / year)" prefix="AED" value={s.scAnnual} onChange={set('scAnnual')} min={0} max={1_000_000} step={500} />
          )}
          {!compact ? (
            <>
              <NumberField label="Maintenance (% of rent)" suffix="%" value={s.maintenancePct} onChange={set('maintenancePct')} min={0} max={20} step={0.5} decimals={1} />
              <NumberField label="Vacancy (weeks / yr)" suffix="wks" value={s.vacancyWeeks} onChange={set('vacancyWeeks')} min={0} max={26} />
              <NumberField label="Management (% of rent)" suffix="%" value={s.managementPct} onChange={set('managementPct')} min={0} max={20} step={0.5} decimals={1} />
              <ChoiceChips
                label="How are you buying?"
                value={s.mortgage ? 'mortgage' : 'cash'}
                onChange={(v) => set('mortgage')(v === 'mortgage')}
                options={[
                  { value: 'cash', label: 'Cash' },
                  { value: 'mortgage', label: 'With a mortgage' },
                ]}
              />
              {s.mortgage ? (
                <>
                  <GroupTitle>Mortgage</GroupTitle>
                  <NumberField label="Down payment (%)" suffix="%" value={s.downPct} onChange={set('downPct')} min={15} max={90} hint={`${fmt((s.price * s.downPct) / 100)} down`} />
                  <NumberField label="Interest rate (%)" suffix="%" value={s.rate} onChange={set('rate')} min={1} max={9} step={0.05} decimals={2} />
                  <NumberField label="Term (years)" suffix="yrs" value={s.years} onChange={set('years')} min={5} max={MAX_TERM_YEARS} />
                </>
              ) : null}
            </>
          ) : null}
        </>
      }
      results={
        <>
          <View style={{ flexDirection: 'row', gap: 16 }}>
            <ResultHeadline label="Gross yield" value={pct(r.grossYield)} size={30} />
            <ResultHeadline label="Net yield" value={pct(r.netYield)} size={30} sub="After costs, on price + buying fees" />
          </View>
          <Breakdown
            rows={[
              { label: 'Annual net income', value: fmt(r.netIncome), strong: true },
              ...(mortgage
                ? [
                    { label: 'Mortgage payments / year', value: fmt(r.annualDebtService) },
                    { label: 'Monthly cash flow', value: fmt(r.monthlyCashFlow), strong: true },
                    { label: 'Cash invested (down payment + fees)', value: fmt(r.cashInvested) },
                    { label: 'Cash-on-cash return', value: pct(r.cashOnCash ?? 0), strong: true },
                  ]
                : [
                    { label: 'Monthly net income', value: fmt(r.monthlyCashFlow) },
                    { label: 'Buying fees included', value: fmt(r.purchaseCosts), note: 'DLD 4%, trustee, title deed, agency 2% + VAT' },
                  ]),
            ]}
          />
          {!compact ? (
            <View>
              <ResultLabel>Where the rent goes (per year)</ResultLabel>
              <BarRows
                label="Annual rent versus running costs"
                max={s.annualRent}
                rows={[
                  { key: 'rent', label: 'Gross rent', value: s.annualRent, display: fmt(s.annualRent), color: CHART.indigo },
                  { key: 'vac', label: 'Vacancy', value: r.vacancyLoss, display: `−${fmt(r.vacancyLoss)}`, color: CHART.aura },
                  { key: 'sc', label: 'Service charge', value: r.serviceCharge, display: `−${fmt(r.serviceCharge)}`, color: CHART.aura },
                  { key: 'mnt', label: 'Maintenance', value: r.maintenance, display: `−${fmt(r.maintenance)}`, color: CHART.aura },
                  { key: 'mgmt', label: 'Management', value: r.management, display: `−${fmt(r.management)}`, color: CHART.aura },
                  ...(mortgage ? [{ key: 'debt', label: 'Mortgage payments', value: r.annualDebtService, display: `−${fmt(r.annualDebtService)}`, color: CHART.royal }] : []),
                  {
                    key: 'net',
                    label: mortgage ? 'Cash flow' : 'Net income',
                    value: mortgage ? r.annualCashFlow : r.netIncome,
                    display: fmt(mortgage ? r.annualCashFlow : r.netIncome),
                    color: CHART.cyan,
                  },
                ]}
              />
            </View>
          ) : (
            <ArrowLink label="Open the full ROI calculator with mortgage" onPress={() => router.push({ pathname: '/tools/roi', params: { price: String(s.price), rent: String(s.annualRent) } })} />
          )}
          <Disclaimer>Indicative only, before tax and not a forecast. Rents, service charges and vacancy vary by building; returns are not guaranteed.</Disclaimer>
        </>
      }
    />
  )
}
