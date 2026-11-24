import { Check, ChevronDown } from 'lucide-react-native'
import { forwardRef, useState } from 'react'
import { Pressable, StyleSheet, TextInput, View, type StyleProp, type TextInputProps, type ViewStyle } from 'react-native'

import { colors, fonts, radius } from '@/theme'
import { Sheet } from './Sheet'
import { Text } from './Text'

/**
 * Stacked-label fields, same look as the site's Field.tsx:
 * tone="outline" (white box + hairline border) on paper/white, tone="solid" (white box) on dark/glass.
 */
type Tone = 'outline' | 'solid'

function boxStyle(tone: Tone, focused: boolean, error?: string) {
  return [
    styles.box,
    tone === 'outline' && { borderWidth: 1, borderColor: error ? colors.danger : focused ? colors.aura : colors.line },
  ]
}

function Note({ error, hint }: { error?: string; hint?: string }) {
  if (error)
    return (
      <Text size={12} weight={500} color="danger" style={{ marginTop: 4, paddingStart: 4 }}>
        {error}
      </Text>
    )
  if (hint)
    return (
      <Text size={12} color="muted" style={{ marginTop: 4, paddingStart: 4 }}>
        {hint}
      </Text>
    )
  return null
}

type TextFieldProps = TextInputProps & { label: string; tone?: Tone; error?: string; hint?: string; containerStyle?: StyleProp<ViewStyle> }

export const TextField = forwardRef<React.ComponentRef<typeof TextInput>, TextFieldProps>(function TextField({ label, tone = 'outline', error, hint, containerStyle, style, onFocus, onBlur, ...rest }, ref) {
  const [focused, setFocused] = useState(false)
  return (
    <View style={containerStyle}>
      <View style={boxStyle(tone, focused, error)}>
        <Text size={11.5} weight={600} color="muted">
          {label}
        </Text>
        <TextInput
          ref={ref}
          placeholderTextColor="rgba(107,97,120,0.7)"
          onFocus={(e) => {
            setFocused(true)
            onFocus?.(e)
          }}
          onBlur={(e) => {
            setFocused(false)
            onBlur?.(e)
          }}
          style={[styles.input, style]}
          {...rest}
        />
      </View>
      <Note error={error} hint={hint} />
    </View>
  )
})

export type Option = string | { value: string; label: string }
const norm = (o: Option) => (typeof o === 'string' ? { value: o, label: o } : o)

/** Branded select: tapping opens a bottom sheet with the options (site: Select.tsx dropdown). */
export function SelectField({
  label,
  options,
  value,
  onChange,
  tone = 'outline',
  placeholder = 'Select',
  error,
  hint,
  containerStyle,
}: {
  label: string
  options: Option[]
  value: string | undefined
  onChange: (value: string) => void
  tone?: Tone
  placeholder?: string
  error?: string
  hint?: string
  containerStyle?: StyleProp<ViewStyle>
}) {
  const [open, setOpen] = useState(false)
  const items = options.map(norm)
  const selected = items.find((o) => o.value === value)
  return (
    <View style={containerStyle}>
      <Pressable accessibilityRole="button" accessibilityLabel={`${label}: ${selected?.label ?? placeholder}`} onPress={() => setOpen(true)} style={boxStyle(tone, open, error)}>
        <Text size={11.5} weight={600} color="muted">
          {label}
        </Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
          <Text size={15} weight={500} color={selected ? 'ink' : 'muted'} numberOfLines={1} style={{ flex: 1 }}>
            {selected?.label ?? placeholder}
          </Text>
          <ChevronDown size={16} color={colors.muted} />
        </View>
      </Pressable>
      <Note error={error} hint={hint} />
      <Sheet open={open} onClose={() => setOpen(false)} title={label}>
        <View style={{ gap: 2 }}>
          {items.map((o) => {
            const active = o.value === value
            return (
              <Pressable
                key={o.value}
                accessibilityRole="button"
                accessibilityState={{ selected: active }}
                onPress={() => {
                  onChange(o.value)
                  setOpen(false)
                }}
                style={({ pressed }) => [styles.option, (pressed || active) && { backgroundColor: colors.mist }]}
              >
                <Text size={15.5} weight={active ? 600 : 400} color={active ? 'plum' : 'ink'} style={{ flex: 1 }}>
                  {o.label}
                </Text>
                {active ? <Check size={18} color={colors.aura} /> : null}
              </Pressable>
            )
          })}
        </View>
      </Sheet>
    </View>
  )
}

const styles = StyleSheet.create({
  box: { backgroundColor: colors.white, borderRadius: radius.md, paddingHorizontal: 16, paddingVertical: 10, gap: 2 },
  input: { fontFamily: fonts.sans[500], fontSize: 15, color: colors.ink, paddingVertical: 2, minHeight: 24 },
  option: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 14, borderRadius: radius.md },
})
