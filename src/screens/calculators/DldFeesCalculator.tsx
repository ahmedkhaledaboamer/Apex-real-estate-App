import { Share2 } from 'lucide-react-native'
import { useMemo, useState } from 'react'
import { Share, StyleSheet, View } from 'react-native'

import { clamp, purchaseCosts, sumCosts, TRUSTEE_THRESHOLD } from '@/features/calculators/lib'
import { useCurrency } from '@/features/favorites/hooks'
import { formatPrice } from '@/lib/format'
import { colors } from '@/theme'
import { Button } from '@/ui/Button'
import { Text } from '@/ui/Text'
import { BarRows, CHART } from './charts'
import { CalculatorShell, ChoiceChips, Disclaimer, NumberField, pct, ResultHeadline } from './ui'

type Status = 'ready' | 'offplan'

export function DldFeesCalculator({ initialPrice }: { initialPrice?: number }) {
  const currency = useCurrency()
  const start = { price: initialPrice ?? 2_000_000, status: 'ready' as Status, mortgage: false, loan: Math.round((initialPrice ?? 2_000_000) * 0.75), agency: true }
  const [price, setPrice] = useState(start.price)
  const [status, setStatus] = useState<Status>(start.status)
  const [mortgage, setMortgage] = useState(start.mortgage)
  const [loan, setLoan] = useState(start.loan)
  const [agency, setAgency] = useState(start.agency)
  const fmt = (n: number) => formatPrice(Math.round(n), currency)

  const reset = () => {
    setPrice(start.price)
    setStatus(start.status)
    setMortgage(start.mortgage)
    setLoan(start.loan)
    setAgency(start.agency)
  }

  const loanAmount = clamp(loan, 0, price * 0.85)
  const items = useMemo(() => purchaseCosts(price, { offPlan: status === 'offplan', mortgage, loanAmount, agency }), [price, status, mortgage, loanAmount, agency])
  const total = sumCosts(items)
  const top = items.reduce((m, i) => Math.max(m, i.amount), 1)

  const share = () => {
    const lines = [
      `Dubai buying costs — ${status === 'ready' ? 'ready (resale)' : 'off-plan'} purchase at ${fmt(price)}${mortgage ? `, loan ${fmt(loanAmount)}` : ''}`,
      '',
      ...items.map((i) => `${i.label}: ${fmt(i.amount)}`),
      '',
      `Total: ${fmt(total)} (${pct(price ? (total / price) * 100 : 0)} of the price)`,
      `Price + fees: ${fmt(price + total)}`,
      '',
      'Indicative only — Apex Aura DLD fees calculator.',
    ]
    void Share.share({ title: 'DLD & buying fees', message: lines.join('\n') })
  }

  return (
    <CalculatorShell
      title="DLD & buying fees"
      onReset={reset}
      inputs={
        <>
          <NumberField
            label="Purchase price (AED)"
            prefix="AED"
            value={price}
            onChange={setPrice}
            min={200_000}
            max={500_000_000}
            step={25_000}
            hint={status === 'ready' ? (price < TRUSTEE_THRESHOLD ? 'Under AED 500K: lower trustee fee applies.' : 'AED 500K and over: standard trustee fee applies.') : undefined}
          />
          <ChoiceChips
            label="Property status"
            value={status}
            onChange={(v) => {
              setStatus(v)
              setAgency(v === 'ready')
            }}
            options={[
              { value: 'ready', label: 'Ready (resale)' },
              { value: 'offplan', label: 'Off-plan from developer' },
            ]}
          />
          <ChoiceChips
            label="Buying with a mortgage?"
            value={mortgage ? 'yes' : 'no'}
            onChange={(v) => setMortgage(v === 'yes')}
            options={[
              { value: 'no', label: 'No, cash' },
              { value: 'yes', label: 'Yes' },
            ]}
          />
          {mortgage ? (
            <NumberField
              label="Loan amount (AED)"
              prefix="AED"
              value={loanAmount}
              onChange={setLoan}
              min={0}
              max={Math.max(100_000, Math.round(price * 0.85))}
              step={10_000}
              hint={`${pct(price ? (loanAmount / price) * 100 : 0, 0)} loan-to-value`}
            />
          ) : null}
          <ChoiceChips
            label="Buying through an agency?"
            value={agency ? 'yes' : 'no'}
            onChange={(v) => setAgency(v === 'yes')}
            options={[
              { value: 'yes', label: 'Yes, 2% + VAT' },
              { value: 'no', label: 'No agency fee' },
            ]}
          />
          {status === 'offplan' ? (
            <Disclaimer>
              On off-plan, the 4% Oqood registration is paid to DLD, usually collected through the developer. Some developers run fee-waiver offers; the title deed is issued at
              handover.
            </Disclaimer>
          ) : null}
        </>
      }
      results={
        <>
          <ResultHeadline label="Total buying costs" value={fmt(total)} sub={`${pct(price ? (total / price) * 100 : 0)} of the purchase price, on top of the price`} />
          <View accessibilityLabel="Itemised buying costs">
            <View style={[styles.tr, { paddingVertical: 8 }]}>
              <Text size={12} weight={600} color="muted" style={{ flex: 1 }}>
                Item
              </Text>
              <Text size={12} weight={600} color="muted">
                Amount
              </Text>
            </View>
            {items.map((i) => (
              <View key={i.key} style={[styles.tr, styles.divider]}>
                <View style={{ flex: 1 }}>
                  <Text size={14} color="ink" style={{ opacity: 0.85 }}>
                    {i.label}
                  </Text>
                  {i.note ? (
                    <Text size={12} color="muted">
                      {i.note}
                    </Text>
                  ) : null}
                </View>
                <Text size={14} weight={600} color="ink" style={{ fontVariant: ['tabular-nums'] }}>
                  {fmt(i.amount)}
                </Text>
              </View>
            ))}
            <View style={[styles.tr, { borderTopWidth: 2, borderTopColor: 'rgba(56,26,76,0.2)', paddingVertical: 12 }]}>
              <Text size={14.5} weight={600} color="plum" style={{ flex: 1 }}>
                Total
              </Text>
              <Text size={14.5} weight={700} color="plum">
                {fmt(total)}
              </Text>
            </View>
            <View style={[styles.tr, { paddingTop: 0 }]}>
              <Text size={14} color="muted" style={{ flex: 1 }}>
                Price + fees
              </Text>
              <Text size={14} weight={600} color="ink">
                {fmt(price + total)}
              </Text>
            </View>
          </View>
          <BarRows
            label="Share of each fee"
            max={top}
            rows={items
              .filter((i) => i.amount >= 1_000)
              .map((i, n) => ({
                key: i.key,
                label: i.label.replace(/ \(.*\)/, ''),
                value: i.amount,
                display: pct(price ? (i.amount / price) * 100 : 0),
                color: [CHART.indigo, CHART.aura, CHART.royal, CHART.cyan][n % 4],
              }))}
          />
          <Button variant="outline" title="Share this breakdown" icon={<Share2 size={16} color={colors.plum} />} onPress={share} />
          <Disclaimer>
            Indicative only, at the time of writing. Small DLD admin and knowledge fees change from time to time; confirm the final figures with the trustee office, your bank and
            your agent before transfer.
          </Disclaimer>
        </>
      }
    />
  )
}

const styles = StyleSheet.create({
  tr: { flexDirection: 'row', alignItems: 'flex-start', gap: 14, paddingVertical: 10 },
  divider: { borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: colors.line },
})
