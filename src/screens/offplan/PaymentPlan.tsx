import { useState } from 'react'
import { StyleSheet, View } from 'react-native'

import { useCurrency } from '@/features/favorites/hooks'
import { formatNumber, formatPrice } from '@/lib/format'
import { colors, radius } from '@/theme'
import type { PaymentMilestone, UnitType } from '@/types'
import { SelectField, TextField } from '@/ui/Field'
import { Text } from '@/ui/Text'

const SEGMENT = [colors.plum, colors.indigo, colors.royal, colors.aura, colors.cyan, 'rgba(86,61,150,0.6)']
const CUSTOM = 'custom'

/** Payment plan: proportional bar, vertical milestone timeline and an instalment calculator (site: PaymentPlanTimeline). */
export function PaymentPlan({ milestones, unitTypes, plan }: { milestones: PaymentMilestone[]; unitTypes: UnitType[]; plan: string }) {
  const currency = useCurrency()
  const [choice, setChoice] = useState('0')
  const [custom, setCustom] = useState('')

  const customValue = Number(custom.replace(/[^0-9]/g, ''))
  const price = choice === CUSTOM ? customValue : (unitTypes[Number(choice)]?.fromAed ?? 0)

  let running = 0
  const rows = milestones.map((m) => {
    running += m.percent
    return { ...m, cumulative: running, amount: (price * m.percent) / 100 }
  })

  return (
    <View>
      <View style={styles.bar} accessibilityLabel={`Payment split: ${rows.map((r) => `${r.percent}% ${r.label}`).join(', ')}`}>
        {rows.map((m, i) => (
          <View key={m.label} style={{ width: `${m.percent}%`, backgroundColor: SEGMENT[i % SEGMENT.length], borderRightWidth: i === rows.length - 1 ? 0 : 2, borderColor: colors.white }} />
        ))}
      </View>

      <View style={{ marginTop: 26 }}>
        {rows.map((m, i) => {
          const last = i === rows.length - 1
          return (
            <View key={m.label} style={{ flexDirection: 'row', gap: 16, paddingBottom: last ? 0 : 22 }}>
              {!last ? <View style={styles.connector} /> : null}
              <View style={[styles.node, { backgroundColor: SEGMENT[i % SEGMENT.length] }]}>
                <View style={styles.nodeDot} />
              </View>
              <View style={{ flex: 1 }}>
                <Text size={24} weight={700} color="plum" lineHeight={26}>
                  {m.percent}%
                </Text>
                <Text size={14.5} weight={600} style={{ marginTop: 4 }}>
                  {m.label}
                </Text>
                <Text size={13} color="muted">
                  {m.due}
                </Text>
                <Text size={12.5} color="muted" style={{ marginTop: 2 }}>
                  Cumulative {m.cumulative}%
                </Text>
              </View>
            </View>
          )
        })}
      </View>

      <View style={styles.calc}>
        <Text size={17} weight={600} color="plum">
          Payment calculator
        </Text>
        <Text size={14} color="muted" style={{ marginTop: 4 }}>
          See what each instalment of the {plan} plan comes to for a unit type, or enter your own price.
        </Text>
        <View style={{ gap: 10, marginTop: 16 }}>
          <SelectField
            label="Unit type"
            value={choice}
            onChange={setChoice}
            options={[...unitTypes.map((u, i) => ({ value: String(i), label: `${u.type} · from ${formatPrice(u.fromAed, currency, { compact: true })}` })), { value: CUSTOM, label: 'Enter a price' }]}
          />
          <TextField
            label="Purchase price (AED)"
            keyboardType="number-pad"
            placeholder="e.g. 2,500,000"
            value={choice === CUSTOM ? custom : formatNumber(price)}
            onChangeText={(t) => {
              setChoice(CUSTOM)
              const digits = t.replace(/[^0-9]/g, '')
              setCustom(digits ? formatNumber(Number(digits)) : '')
            }}
          />
        </View>

        {price > 0 ? (
          <View style={styles.table} accessibilityLabel={`Instalments for a purchase price of ${formatPrice(price, currency)}`}>
            <View style={[styles.tr, styles.thead]}>
              <Text size={12} weight={600} color="muted" style={{ flex: 1 }}>
                Milestone
              </Text>
              <Text size={12} weight={600} color="muted">
                Amount
              </Text>
            </View>
            {rows.map((m) => (
              <View key={m.label} style={[styles.tr, styles.row]}>
                <View style={{ flex: 1 }}>
                  <Text size={14} weight={500}>
                    {m.label}
                  </Text>
                  <Text size={12.5} color="muted">
                    {m.percent}% · {m.due}
                  </Text>
                </View>
                <Text size={14.5} weight={600} color="plum">
                  {formatPrice(m.amount, currency)}
                </Text>
              </View>
            ))}
            <View style={[styles.tr, styles.row, { backgroundColor: colors.paper, borderTopColor: colors.line }]}>
              <Text size={14} weight={600} style={{ flex: 1 }}>
                Total · {running}%
              </Text>
              <Text size={15} weight={700} color="plum">
                {formatPrice(price, currency)}
              </Text>
            </View>
          </View>
        ) : (
          <Text size={14} color="muted" style={{ marginTop: 16 }}>
            Enter a purchase price to see each instalment.
          </Text>
        )}
        <Text size={12} color="muted" style={{ marginTop: 12 }}>
          Indicative only. Excludes the 4% DLD fee, Oqood registration and admin fees. Construction-linked dates can move with the build schedule; your SPA sets the final terms.
        </Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  bar: { flexDirection: 'row', height: 12, borderRadius: radius.pill, overflow: 'hidden', backgroundColor: colors.mist },
  connector: { position: 'absolute', left: 11.5, top: 26, bottom: 0, width: 1, backgroundColor: colors.line },
  node: { width: 24, height: 24, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginTop: 1, borderWidth: 3, borderColor: colors.white, boxShadow: `0 0 0 1px ${colors.line}` },
  nodeDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: colors.white },
  calc: { marginTop: 30, borderRadius: radius.card, borderWidth: 1, borderColor: colors.line, backgroundColor: colors.paper, padding: 14 },
  table: { marginTop: 16, borderRadius: radius.md, borderWidth: 1, borderColor: colors.line, backgroundColor: colors.white, overflow: 'hidden' },
  tr: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 12 },
  thead: { backgroundColor: colors.mist, paddingVertical: 9 },
  row: { paddingVertical: 11, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: colors.line },
})
