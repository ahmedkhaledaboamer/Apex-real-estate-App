import { Plus } from 'lucide-react-native'
import { useState } from 'react'
import { LayoutAnimation, Pressable, StyleSheet, View } from 'react-native'

import { colors } from '@/theme'
import { Text } from './Text'

export type AccordionItem = { q: string; a: string }

/** FAQ accordion with hairline dividers (site: Accordion). */
export function Accordion({ items, defaultOpen = null }: { items: AccordionItem[]; defaultOpen?: number | null }) {
  const [open, setOpen] = useState<number | null>(defaultOpen)
  return (
    <View style={styles.list}>
      {items.map((it, i) => {
        const isOpen = open === i
        return (
          <View key={it.q} style={[styles.item, i > 0 && styles.divider]}>
            <Pressable
              accessibilityRole="button"
              accessibilityState={{ expanded: isOpen }}
              onPress={() => {
                LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
                setOpen(isOpen ? null : i)
              }}
              style={styles.head}
            >
              <Text size={16} weight={600} color="plum" style={{ flex: 1 }}>
                {it.q}
              </Text>
              <View style={[styles.icon, isOpen && { transform: [{ rotate: '45deg' }] }]}>
                <Plus size={16} color={colors.indigo} />
              </View>
            </Pressable>
            {isOpen ? (
              <Text size={14.5} color="muted" lineHeight={23} style={{ paddingBottom: 18 }}>
                {it.a}
              </Text>
            ) : null}
          </View>
        )
      })}
    </View>
  )
}

const styles = StyleSheet.create({
  list: { borderTopWidth: StyleSheet.hairlineWidth, borderBottomWidth: StyleSheet.hairlineWidth, borderColor: colors.line },
  item: {},
  divider: { borderTopWidth: StyleSheet.hairlineWidth, borderColor: colors.line },
  head: { flexDirection: 'row', alignItems: 'center', gap: 16, paddingVertical: 18 },
  icon: { width: 32, height: 32, borderRadius: 16, backgroundColor: colors.mist, alignItems: 'center', justifyContent: 'center' },
})
