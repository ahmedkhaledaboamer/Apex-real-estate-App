import { ChevronDown } from 'lucide-react-native'
import { useMemo, useState } from 'react'
import { LayoutAnimation, Pressable, StyleSheet, View } from 'react-native'

import { amortisationByYear, MAX_TERM_YEARS, mortgageSummary, purchaseCosts, sumCosts, typicalMinDownPct } from '@/features/calculators/lib'
import { useCurrency } from '@/features/favorites/hooks'
import { formatPrice } from '@/lib/format'
import { colors, radius, shadow } from '@/theme'
import { Button } from '@/ui/Button'
import { SelectField } from '@/ui/Field'
import { LeadForm } from '@/ui/LeadForm'
import { Sheet } from '@/ui/Sheet'
import { Text } from '@/ui/Text'
import { CHART, Donut } from './charts'
import { Breakdown, CalculatorShell, Disclaimer, NumberField, ResultHeadline, ResultLabel } from './ui'

type Residency = 'expat' | 'national' | 'non-resident'
const DEFAULTS = { price: 2_000_000, downPct: 20, rate: 4.25, years: 25, residency: 'expat' as Residency }

export function MortgageCalculator({ initialPrice }: { initialPrice?: number }) {
  const currency = useCurrency()
  const start = { ...DEFAULTS, price: initialPrice ?? DEFAULTS.price }
  const [price, setPrice] = useState(start.price)
  const [downPct, setDownPct] = useState(start.downPct)
  const [rate, setRate] = useState(start.rate)
  const [years, setYears] = useState(start.years)
  const [residency, setResidency] = useState<Residency>(start.residency)
  const [tableOpen, setTableOpen] = useState(false)
  const [leadOpen, setLeadOpen] = useState(false)

  const reset = () => {
    setPrice(start.price)
    setDownPct(start.downPct)
    setRate(start.rate)
    setYears(start.years)
    setResidency(start.residency)
  }

  const m = useMemo(() => mortgageSummary(price, downPct, rate, years), [price, downPct, rate, years])
  const costs = useMemo(() => purchaseCosts(price, { mortgage: true, loanAmount: m.loan }), [price, m.loan])
  const fees = sumCosts(costs)
  const schedule = useMemo(() => amortisationByYear(m.loan, rate, years), [m.loan, rate, years])
  const minDown = typicalMinDownPct(price, residency)
  const fmt = (n: number) => formatPrice(Math.round(n), currency)

  return (
    <View style={{ gap: 20 }}>
      <CalculatorShell
        title="Mortgage calculator"
        onReset={reset}
        inputs={
          <>
            <NumberField label="Property price (AED)" prefix="AED" value={price} onChange={setPrice} min={300_000} max={200_000_000} step={50_000} />
            <SelectField
              label="Buyer status"
              value={residency}
              onChange={(v) => setResidency(v as Residency)}
              options={[
                { value: 'expat', label: 'UAE resident (expat)' },
                { value: 'national', label: 'UAE national' },
                { value: 'non-resident', label: 'Non-resident' },
              ]}
            />
            <NumberField
              label="Down payment (%)"
              suffix="%"
              value={downPct}
              onChange={setDownPct}
              min={10}
              max={90}
              presets={[15, 20, 25, 30, 40].map((v) => ({ value: v, label: `${v}%` }))}
              hint={`${fmt(m.downPayment)} down.${downPct < minDown ? '' : ` Typical minimum for this profile: ${minDown}%.`}`}
              hintStrong={downPct < minDown ? `Banks typically ask for at least ${minDown}% for this profile and price.` : undefined}
            />
            <NumberField label="Interest rate (%)" suffix="%" value={rate} onChange={setRate} min={1} max={9} step={0.05} decimals={2} />
            <NumberField
              label="Term (years)"
              suffix="yrs"
              value={years}
              onChange={setYears}
              min={5}
              max={MAX_TERM_YEARS}
              presets={[15, 20, 25].map((v) => ({ value: v, label: `${v} yrs` }))}
            />
            <Disclaimer>
              Typical UAE Central Bank limits: expats usually need 20% down on a first home under AED 5M (30% above), UAE nationals 15%. Non-resident lending varies by bank. Rules
              change, so check current terms with your bank.
            </Disclaimer>
          </>
        }
        results={
          <>
            <ResultHeadline label="Monthly repayment" value={fmt(m.monthly)} sub={`Over ${years} years at ${rate.toFixed(2)}%`} />
            <Donut
              label="Principal versus interest over the loan"
              segments={[
                { label: 'Principal', value: m.loan, color: CHART.indigo, display: fmt(m.loan) },
                { label: 'Interest', value: m.totalInterest, color: CHART.cyan, display: fmt(m.totalInterest) },
              ]}
              centerLabel="Total paid"
              centerValue={formatPrice(Math.round(m.totalPaid), currency, { compact: true })}
            />
            <Breakdown
              rows={[
                { label: 'Loan amount', value: fmt(m.loan) },
                { label: 'Total interest', value: fmt(m.totalInterest) },
                { label: 'Total repaid', value: fmt(m.totalPaid) },
              ]}
            />
            <View>
              <ResultLabel>Upfront cash needed</ResultLabel>
              <Breakdown
                rows={[
                  { label: 'Down payment', value: fmt(m.downPayment) },
                  ...costs.map((c) => ({ label: c.label, value: fmt(c.amount), note: c.note })),
                  { label: 'Total upfront cash', value: fmt(m.downPayment + fees), strong: true },
                ]}
              />
            </View>
            <Button title="Get pre-approved" size="lg" full onPress={() => setLeadOpen(true)} />
            <Disclaimer>Indicative only, not a mortgage offer. Rates, fees and eligibility are set by each lender.</Disclaimer>
          </>
        }
      />

      {/* Amortisation schedule */}
      <View style={styles.table}>
        <Pressable
          accessibilityRole="button"
          accessibilityState={{ expanded: tableOpen }}
          onPress={() => {
            LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
            setTableOpen((o) => !o)
          }}
          style={styles.tableHead}
        >
          <View style={{ flex: 1 }}>
            <Text size={16.5} weight={600} color="plum">
              Yearly amortisation schedule
            </Text>
            <Text size={13} color="muted">
              Principal, interest and remaining balance for each year
            </Text>
          </View>
          <View style={[styles.chev, tableOpen && { transform: [{ rotate: '180deg' }] }]}>
            <ChevronDown size={16} color={colors.indigo} />
          </View>
        </Pressable>
        {tableOpen ? (
          <View style={styles.tableBody}>
            <View style={[styles.tr, { paddingVertical: 10 }]}>
              {['Year', 'Principal', 'Interest', 'Balance'].map((h, i) => (
                <Text key={h} size={11.5} weight={600} color="muted" align={i ? 'right' : 'left'} style={i ? styles.td : styles.tdYear}>
                  {h}
                </Text>
              ))}
            </View>
            {schedule.map((r) => (
              <View key={r.year} style={[styles.tr, styles.trDivider]} accessible accessibilityLabel={`Year ${r.year}: principal ${fmt(r.principal)}, interest ${fmt(r.interest)}, balance ${fmt(r.balance)}`}>
                <Text size={13} weight={600} color="plum" style={styles.tdYear}>
                  {r.year}
                </Text>
                {[r.principal, r.interest, r.balance].map((v, i) => (
                  <Text key={i} size={12.5} weight={i === 2 ? 600 : 400} color="ink" align="right" style={[styles.td, { fontVariant: ['tabular-nums'] }]} numberOfLines={1} adjustsFontSizeToFit>
                    {formatPrice(Math.round(v), currency, { compact: true })}
                  </Text>
                ))}
              </View>
            ))}
          </View>
        ) : null}
      </View>

      <Sheet open={leadOpen} onClose={() => setLeadOpen(false)} title="Get pre-approved">
        <Text size={15} color="muted" lineHeight={23} style={{ marginBottom: 18 }}>
          A mortgage adviser will compare offers from UAE banks for a {fmt(price)} home with {downPct}% down, and call you back within one working day.
        </Text>
        <LeadForm
          type="callback"
          submitLabel="Request a callback"
          extraFields={[{ name: 'status', label: 'Employment', kind: 'select', options: ['Salaried', 'Self-employed', 'Business owner'] }]}
          successText="Thanks — a mortgage adviser will call you within one working day."
        />
      </Sheet>
    </View>
  )
}

const styles = StyleSheet.create({
  table: { backgroundColor: colors.white, borderRadius: radius.card, ...shadow.soft },
  tableHead: { flexDirection: 'row', alignItems: 'center', gap: 14, padding: 20, minHeight: 64 },
  chev: { width: 32, height: 32, borderRadius: 16, backgroundColor: colors.mist, alignItems: 'center', justifyContent: 'center' },
  tableBody: { borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: colors.line, paddingHorizontal: 20, paddingBottom: 12 },
  tr: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 9 },
  trDivider: { borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: colors.line },
  tdYear: { width: 40 },
  td: { flex: 1 },
})
