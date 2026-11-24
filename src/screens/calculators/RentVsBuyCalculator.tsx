import { useMemo, useState } from 'react'
import { View } from 'react-native'

import { rentVsBuy } from '@/features/calculators/lib'
import { useCurrency } from '@/features/favorites/hooks'
import { formatPrice } from '@/lib/format'
import { Heading, Text } from '@/ui/Text'
import { CHART, LineChart } from './charts'
import { Breakdown, CalculatorShell, Disclaimer, GroupTitle, NumberField, ResultHeadline } from './ui'

const DEFAULTS = {
  price: 2_000_000,
  annualRent: 130_000,
  years: 7,
  growthPct: 3,
  rentIncreasePct: 4,
  rate: 4.25,
  downPct: 20,
  investReturnPct: 5,
  ownershipCosts: 20_000,
}

export function RentVsBuyCalculator({ initial }: { initial?: { price?: number; rent?: number } }) {
  const currency = useCurrency()
  const start = { ...DEFAULTS, price: initial?.price ?? DEFAULTS.price, annualRent: initial?.rent ?? DEFAULTS.annualRent }
  const [s, setS] = useState(start)
  const set = (k: keyof typeof DEFAULTS) => (v: number) => setS((p) => ({ ...p, [k]: v }))
  const fmt = (n: number) => formatPrice(Math.round(n), currency)
  const fmtC = (n: number) => formatPrice(Math.round(n), currency, { compact: true })

  const r = useMemo(() => rentVsBuy(s), [s])
  const buyingWins = r.final.buyCost < r.final.rentCost
  const diff = Math.abs(r.final.rentCost - r.final.buyCost)
  const verdict =
    r.breakEvenYear !== null && buyingWins ? `Buying looks cheaper after year ${r.breakEvenYear}` : `Renting stays cheaper over ${s.years} year${s.years === 1 ? '' : 's'}`

  return (
    <CalculatorShell
      title="Rent vs buy"
      onReset={() => setS(start)}
      inputs={
        <>
          <NumberField label="Home price (AED)" prefix="AED" value={s.price} onChange={set('price')} min={300_000} max={200_000_000} step={50_000} />
          <NumberField label="Current annual rent (AED)" prefix="AED" value={s.annualRent} onChange={set('annualRent')} min={20_000} max={10_000_000} step={5_000} />
          <NumberField
            label="Years you plan to stay"
            suffix="yrs"
            value={s.years}
            onChange={set('years')}
            min={1}
            max={25}
            presets={[3, 5, 7, 10].map((v) => ({ value: v, label: `${v} yrs` }))}
          />
          <GroupTitle>Assumptions</GroupTitle>
          <NumberField label="Price growth (% / yr)" suffix="%" value={s.growthPct} onChange={set('growthPct')} min={-5} max={12} step={0.5} decimals={1} />
          <NumberField label="Rent increase (% / yr)" suffix="%" value={s.rentIncreasePct} onChange={set('rentIncreasePct')} min={0} max={12} step={0.5} decimals={1} />
          <NumberField label="Mortgage rate (%)" suffix="%" value={s.rate} onChange={set('rate')} min={1} max={9} step={0.05} decimals={2} />
          <NumberField label="Down payment (%)" suffix="%" value={s.downPct} onChange={set('downPct')} min={15} max={100} />
          <NumberField label="Return on cash (% / yr)" suffix="%" value={s.investReturnPct} onChange={set('investReturnPct')} min={0} max={12} step={0.5} decimals={1} />
          <NumberField label="Service charge + upkeep (AED / yr)" prefix="AED" value={s.ownershipCosts} onChange={set('ownershipCosts')} min={0} max={1_000_000} step={500} />
        </>
      }
      results={
        <>
          <View accessibilityLiveRegion="polite">
            <Text size={13} weight={600} color="aura">
              Verdict
            </Text>
            <Heading size={30} style={{ marginTop: 4 }}>
              {verdict}
            </Heading>
            <Text size={13.5} color="muted" style={{ marginTop: 6 }}>
              Over {s.years} year{s.years === 1 ? '' : 's'}, {buyingWins ? 'buying' : 'renting'} comes out about {fmt(diff)} ahead on these assumptions.
            </Text>
          </View>
          <View style={{ flexDirection: 'row', gap: 16 }}>
            <ResultHeadline label="Total cost of renting" value={fmtC(r.final.rentCost)} size={24} valueColor={!buyingWins ? 'aura' : 'plum'} />
            <ResultHeadline label="Net cost of buying" value={fmtC(r.final.buyCost)} size={24} valueColor={buyingWins ? 'aura' : 'plum'} />
          </View>
          <LineChart
            label="Cumulative cost of renting versus net cost of buying by year"
            xLabels={r.rows.map((x) => `Yr ${x.year}`)}
            marker={r.breakEvenYear !== null ? r.breakEvenYear - 1 : null}
            series={[
              { key: 'rent', label: 'Renting', color: CHART.royal, values: r.rows.map((x) => x.rentCost), display: fmtC(r.final.rentCost) },
              { key: 'buy', label: 'Buying (net)', color: CHART.aura, values: r.rows.map((x) => x.buyCost), display: fmtC(r.final.buyCost) },
            ]}
          />
          <Breakdown
            rows={[
              { label: 'Upfront cash to buy', value: fmt(r.upfrontCash), note: 'Down payment + DLD, trustee, agency and mortgage fees' },
              { label: 'Monthly mortgage', value: fmt(r.monthlyMortgage), note: '25-year term' },
              { label: `Home value after ${s.years} yrs`, value: fmt(r.final.homeValue) },
              { label: 'Your equity at that point', value: fmt(r.final.equity) },
              { label: 'Break-even year', value: r.breakEvenYear ? `Year ${r.breakEvenYear}` : 'Not within this period', strong: true },
            ]}
          />
          <Disclaimer>
            Indicative only. Buying cost = upfront cash + mortgage payments + service charges and upkeep + the return your upfront cash could have earned, minus what you would keep
            after selling (value less 2% + VAT selling fee and the remaining loan). Rent is cumulative with yearly increases. Ignores tax, moving costs and renting deposits.
          </Disclaimer>
        </>
      }
    />
  )
}
