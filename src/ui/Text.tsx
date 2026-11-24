import { Text as RNText, type TextProps, type TextStyle } from 'react-native'

import { colors, fonts, type ColorName } from '@/theme'

type Weight = 400 | 500 | 600 | 700

type Props = TextProps & {
  /** Font size in px. */
  size?: number
  weight?: Weight
  color?: ColorName
  /** Cormorant Garamond (headings), like the site's `font-display`. */
  display?: boolean
  italic?: boolean
  align?: TextStyle['textAlign']
  lineHeight?: number
  /** Letter spacing in em (e.g. 0.12 → tracking-[0.12em]). */
  tracking?: number
  uppercase?: boolean
}

/** The one text component: picks the right font family per weight, brand colours, sensible line height. */
export function Text({ size = 15, weight = 400, color = 'ink', display, italic, align, lineHeight, tracking, uppercase, style, ...rest }: Props) {
  const family = display
    ? italic
      ? fonts.display.italic
      : fonts.display[weight === 400 ? 500 : (weight as 500 | 600 | 700)]
    : fonts.sans[weight]
  return (
    <RNText
      {...rest}
      style={[
        {
          fontFamily: family,
          fontSize: size,
          color: colors[color],
          lineHeight: lineHeight ?? Math.round(size * (display ? 1.08 : 1.45)),
          textAlign: align,
          letterSpacing: tracking ? tracking * size : undefined,
          textTransform: uppercase ? 'uppercase' : undefined,
        },
        style,
      ]}
    />
  )
}

/** Serif heading in the site's style (font-display, plum). */
export function Heading({ size = 30, color = 'plum', ...rest }: Omit<Props, 'display'>) {
  return <Text display weight={600} size={size} color={color} {...rest} />
}
