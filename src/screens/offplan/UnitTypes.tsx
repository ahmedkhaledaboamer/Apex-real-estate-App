import { StyleSheet, View } from 'react-native'

import { useCurrency } from '@/features/favorites/hooks'
import { formatNumber, formatPrice } from '@/lib/format'
import { colors, radius } from '@/theme'
import type { UnitType } from '@/types'
import { Button } from '@/ui/Button'
import { Text } from '@/ui/Text'

function Availability({ n }: { n: number }) {
  if (n <= 0)
    return (
      <Text size={13} weight={600} color="muted">
        Sold out
      </Text>
    )
  const low = n <= 5
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
      <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: low ? colors.aura : colors.success }} />
      <Text size={13} weight={600} color={low ? 'aura' : 'success'}>
        {low ? `Only ${n} left` : `${n} available`}
      </Text>
    </View>
  )
}

/** Unit mix as stacked cards (site: UnitTypesTable mobile layout). "Enquire" hands the unit type to the form. */
export function UnitTypes({ units, onEnquire }: { units: UnitType[]; onEnquire: (u: UnitType) => void }) {
  const currency = useCurrency()
  return (
    <View style={{ gap: 12 }}>
      {units.map((u) => (
        <View key={u.type} style={styles.card}>
          <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
            <View style={{ flex: 1 }}>
              <Text size={15.5} weight={600}>
                {u.type}
              </Text>
              <Text size={13} color="muted">
                {formatNumber(u.sizeFrom)} – {formatNumber(u.sizeTo)} sq ft
              </Text>
            </View>
            <Availability n={u.available} />
          </View>
          <View style={styles.foot}>
            <View style={{ flex: 1 }}>
              <Text size={12} color="muted">
                From
              </Text>
              <Text size={17} weight={700} color="plum">
                {formatPrice(u.fromAed, currency)}
              </Text>
            </View>
            <Button title="Enquire" variant="outline" size="md" disabled={u.available <= 0} onPress={() => onEnquire(u)} accessibilityLabel={`Enquire about ${u.type}`} />
          </View>
        </View>
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  card: { borderRadius: radius.card, borderWidth: 1, borderColor: colors.line, backgroundColor: colors.white, padding: 16 },
  foot: { flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 12, paddingTop: 12, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: colors.line },
})
