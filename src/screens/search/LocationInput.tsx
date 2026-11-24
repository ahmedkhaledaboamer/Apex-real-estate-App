import { MapPin, X } from 'lucide-react-native'
import { useEffect, useState } from 'react'
import { Pressable, StyleSheet, TextInput, View } from 'react-native'

import { COMMUNITY_NAMES } from '@/features/search/options'
import { colors, fonts, radius, shadow } from '@/theme'
import { Text } from '@/ui/Text'

/** Free-text location with community suggestions (site: LocationInput + datalist). */
export function LocationInput({ value, onCommit }: { value: string | undefined; onCommit: (location: string | undefined) => void }) {
  const [text, setText] = useState(value ?? '')
  const [focused, setFocused] = useState(false)

  // Pull external changes (chip removed, "Clear all", new params) back into the box.
  useEffect(() => {
    if ((value ?? '') !== text.trim()) setText(value ?? '')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value])

  const q = text.trim().toLowerCase()
  const suggestions = focused ? COMMUNITY_NAMES.filter((n) => (q ? n.toLowerCase().includes(q) && n.toLowerCase() !== q : true)).slice(0, 6) : []

  const change = (t: string) => {
    setText(t)
    onCommit(t.trim() || undefined)
  }

  return (
    <View style={{ flex: 1, zIndex: 20 }}>
      <View style={[styles.box, focused && { borderColor: colors.aura }]}>
        <MapPin size={17} color={colors.aura} />
        <TextInput
          value={text}
          onChangeText={change}
          onFocus={() => setFocused(true)}
          onBlur={() => setTimeout(() => setFocused(false), 150)}
          placeholder="Community or building"
          placeholderTextColor="rgba(107,97,120,0.7)"
          returnKeyType="search"
          autoCorrect={false}
          accessibilityLabel="Location"
          style={styles.input}
        />
        {text ? (
          <Pressable accessibilityRole="button" accessibilityLabel="Clear location" hitSlop={10} onPress={() => change('')} style={styles.clear}>
            <X size={14} color={colors.plum} />
          </Pressable>
        ) : null}
      </View>
      {suggestions.length > 0 ? (
        <View style={styles.dropdown}>
          {suggestions.map((s) => (
            <Pressable key={s} accessibilityRole="button" onPress={() => change(s)} style={({ pressed }) => [styles.option, pressed && { backgroundColor: colors.mist }]}>
              <MapPin size={14} color={colors.muted} />
              <Text size={14}>{s}</Text>
            </Pressable>
          ))}
        </View>
      ) : null}
    </View>
  )
}

const styles = StyleSheet.create({
  box: { flexDirection: 'row', alignItems: 'center', gap: 10, height: 48, borderRadius: radius.pill, borderWidth: 1, borderColor: colors.line, backgroundColor: colors.white, paddingLeft: 16, paddingRight: 8 },
  input: { flex: 1, fontFamily: fonts.sans[500], fontSize: 15, color: colors.ink, paddingVertical: 0, height: '100%' },
  clear: { width: 28, height: 28, borderRadius: 14, backgroundColor: colors.mist, alignItems: 'center', justifyContent: 'center' },
  dropdown: { position: 'absolute', top: 54, left: 0, right: 0, backgroundColor: colors.white, borderRadius: radius.md, paddingVertical: 4, elevation: 8, ...shadow.lift },
  option: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 16, minHeight: 44 },
})
