import { CircleAlert, CircleCheck, Clock } from 'lucide-react-native'
import { useMemo, useState } from 'react'
import { View } from 'react-native'

import { clamp, goldenVisaCheck } from '@/features/calculators/lib'
import { useCurrency } from '@/features/favorites/hooks'
import { GOLDEN_VISA_THRESHOLD } from '@/lib/constants'
import { formatPrice } from '@/lib/format'
import { colors, shadow } from '@/theme'
import { Heading, Text } from '@/ui/Text'
import { BarRows, CHART } from './charts'
import { CalculatorShell, ChoiceChips, Disclaimer, NumberField } from './ui'

const DEFAULTS = { totalValue: 2_200_000, offPlan: false, mortgaged: false, amountPaid: 1_100_000 }

/** Golden Visa (property route) eligibility checker (site: GoldenVisaChecker). */
export function GoldenVisaChecker() {
  const currency = useCurrency()
  const [s, setS] = useState(DEFAULTS)
  const fmt = (n: number) => formatPrice(Math.round(n), currency)
  const needsPaid = s.offPlan || s.mortgaged
  const paid = clamp(s.amountPaid, 0, s.totalValue)
  const res = useMemo(() => goldenVisaCheck({ ...s, amountPaid: paid }), [s, paid])

  const view = {
    likely: {
      icon: CircleCheck,
      title: 'Likely eligible',
      body: needsPaid
        ? `Your property value and the ${fmt(paid)} paid both meet the AED 2M mark. Final approval rests with DLD and ICP/GDRFA.`
        : 'A ready, fully paid property worth AED 2M or more typically meets the property route. Final approval rests with DLD and ICP/GDRFA.',
      tone: 'success' as const,
    },
    check: {
      icon: Clock,
      title: 'Value qualifies — conditions apply',
      body: `${s.mortgaged ? 'Mortgaged homes typically need a bank NOC; ' : ''}${s.offPlan ? 'off-plan units typically need an approved developer and project; ' : ''}under the stricter reading applied in some cases, the amount paid must itself reach AED 2M. You would need ${fmt(res.shortfall)} more paid.`,
      tone: 'aura' as const,
    },
    'not-yet': {
      icon: CircleAlert,
      title: `Not yet — you need ${fmt(res.shortfall)} more`,
      body: 'Total property value must typically be AED 2M or more. You can combine several properties to reach it.',
      tone: 'plum' as const,
    },
  }[res.status]
  const Icon = view.icon

  return (
    <CalculatorShell
      title="Eligibility checker"
      onReset={() => setS(DEFAULTS)}
      inputs={
        <>
          <NumberField
            label="Total property value (AED)"
            prefix="AED"
            value={s.totalValue}
            onChange={(v) => setS((p) => ({ ...p, totalValue: v }))}
            min={500_000}
            max={500_000_000}
            step={50_000}
            hint="Add up all the units you own in Dubai, using the purchase value on the title deed / Oqood."
          />
          <ChoiceChips
            label="Property status"
            value={s.offPlan ? 'offplan' : 'ready'}
            onChange={(v) => setS((p) => ({ ...p, offPlan: v === 'offplan' }))}
            options={[
              { value: 'ready', label: 'Ready' },
              { value: 'offplan', label: 'Off-plan' },
            ]}
          />
          <ChoiceChips
            label="Is it mortgaged?"
            value={s.mortgaged ? 'yes' : 'no'}
            onChange={(v) => setS((p) => ({ ...p, mortgaged: v === 'yes' }))}
            options={[
              { value: 'no', label: 'No' },
              { value: 'yes', label: 'Yes' },
            ]}
          />
          {needsPaid ? (
            <NumberField
              label="Amount paid so far (AED)"
              prefix="AED"
              value={paid}
              onChange={(v) => setS((p) => ({ ...p, amountPaid: v }))}
              min={0}
              max={Math.max(100_000, s.totalValue)}
              step={25_000}
              hint={s.mortgaged ? 'Your equity: price minus the outstanding loan.' : 'Instalments paid to the developer to date.'}
            />
          ) : null}
        </>
      }
      results={
        <>
          <View accessibilityLiveRegion="polite" style={{ flexDirection: 'row', gap: 14 }}>
            <View style={[{ width: 48, height: 48, borderRadius: 24, backgroundColor: colors.white, alignItems: 'center', justifyContent: 'center' }, shadow.soft]}>
              <Icon size={24} color={colors.indigo} strokeWidth={1.8} />
            </View>
            <View style={{ flex: 1 }}>
              <Text size={13} weight={600} color="aura">
                Result
              </Text>
              <Heading size={28} color={view.tone} style={{ marginTop: 4 }}>
                {view.title}
              </Heading>
              <Text size={14.5} color="ink" lineHeight={22} style={{ marginTop: 8, opacity: 0.85 }}>
                {view.body}
              </Text>
            </View>
          </View>
          <BarRows
            label="Progress towards the AED 2M threshold"
            max={Math.max(GOLDEN_VISA_THRESHOLD, s.totalValue)}
            rows={[
              { key: 'need', label: 'Threshold', value: GOLDEN_VISA_THRESHOLD, display: fmt(GOLDEN_VISA_THRESHOLD), color: CHART.indigo },
              { key: 'value', label: 'Your property value', value: s.totalValue, display: fmt(s.totalValue), color: CHART.aura },
              ...(needsPaid ? [{ key: 'paid', label: 'Amount paid', value: paid, display: fmt(paid), color: CHART.cyan }] : []),
            ]}
          />
          <Disclaimer>
            Indicative only, not legal or immigration advice. Golden Visa rules are set by ICP/GDRFA and DLD and change from time to time; check current rules before you buy or
            apply.
          </Disclaimer>
        </>
      }
    />
  )
}
