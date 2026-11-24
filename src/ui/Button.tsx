import * as Haptics from 'expo-haptics'
import { LinearGradient } from 'expo-linear-gradient'
import { ActivityIndicator, Platform, Pressable, StyleSheet, View, type PressableProps, type StyleProp, type ViewStyle } from 'react-native'

import { colors, gradients, radius, shadow } from '@/theme'
import { Text } from './Text'

export type ButtonVariant = 'primary' | 'plum' | 'white' | 'outline' | 'ghost' | 'whatsapp'
export type ButtonSize = 'sm' | 'md' | 'lg'

const HEIGHT: Record<ButtonSize, number> = { sm: 36, md: 44, lg: 52 }
const PAD: Record<ButtonSize, number> = { sm: 14, md: 20, lg: 26 }
const FONT: Record<ButtonSize, number> = { sm: 13.5, md: 14.5, lg: 15.5 }

const TEXT_COLOR: Record<ButtonVariant, keyof typeof colors> = {
  primary: 'white',
  plum: 'white',
  white: 'plum',
  outline: 'plum',
  ghost: 'plum',
  whatsapp: 'white',
}

type Props = Omit<PressableProps, 'style' | 'children'> & {
  title?: string
  children?: React.ReactNode
  variant?: ButtonVariant
  size?: ButtonSize
  icon?: React.ReactNode
  iconRight?: React.ReactNode
  loading?: boolean
  full?: boolean
  style?: StyleProp<ViewStyle>
}

/** Pill button — same recipes as the site (gradient CTA, plum, white-on-dark, outlined). */
export function Button({ title, children, variant = 'primary', size = 'md', icon, iconRight, loading, full, style, disabled, onPress, ...rest }: Props) {
  const content = (
    <View style={[styles.row, { height: HEIGHT[size], paddingHorizontal: PAD[size] }]}>
      {loading ? <ActivityIndicator color={colors[TEXT_COLOR[variant]]} /> : icon}
      {title ? (
        <Text weight={600} size={FONT[size]} color={TEXT_COLOR[variant]} numberOfLines={1}>
          {title}
        </Text>
      ) : (
        children
      )}
      {iconRight}
    </View>
  )

  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled || loading}
      onPress={(e) => {
        if (Platform.OS !== 'web') void Haptics.selectionAsync()
        onPress?.(e)
      }}
      style={({ pressed }) => [
        styles.base,
        full && { alignSelf: 'stretch' },
        variant === 'plum' && { backgroundColor: colors.plum },
        variant === 'white' && { backgroundColor: colors.white },
        variant === 'outline' && { borderWidth: 1, borderColor: 'rgba(56,26,76,0.2)' },
        variant === 'whatsapp' && { backgroundColor: colors.whatsapp },
        variant === 'primary' && shadow.soft,
        { opacity: disabled ? 0.5 : 1, transform: [{ scale: pressed ? 0.97 : 1 }] },
        style,
      ]}
      {...rest}
    >
      {variant === 'primary' ? (
        <LinearGradient colors={gradients.aura.colors} start={gradients.aura.start} end={gradients.aura.end} style={styles.gradient}>
          {content}
        </LinearGradient>
      ) : (
        content
      )}
    </Pressable>
  )
}

const styles = StyleSheet.create({
  base: { borderRadius: radius.pill, overflow: 'hidden', alignSelf: 'flex-start' },
  gradient: { borderRadius: radius.pill },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
})
