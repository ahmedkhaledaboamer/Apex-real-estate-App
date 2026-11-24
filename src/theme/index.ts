/**
 * Apex Aora design tokens for the app — read from the website's tailwind.config.ts, so colours,
 * radii and shadows are literally the same values as the site. Change them there, both update.
 */
import { brand } from '../../../website/tailwind.config'

export const colors = {
  ...brand.colors,
  white: '#ffffff',
  whatsapp: '#1f9d55',
  danger: '#c0392b',
  overlay: 'rgba(30, 24, 40, 0.5)',
} as const

export type ColorName = keyof typeof colors

/** Each weight is its own family in React Native (fontWeight does not pick custom faces). */
export const fonts = {
  sans: {
    400: 'PlusJakartaSans_400Regular',
    500: 'PlusJakartaSans_500Medium',
    600: 'PlusJakartaSans_600SemiBold',
    700: 'PlusJakartaSans_700Bold',
  },
  display: {
    500: 'CormorantGaramond_500Medium',
    600: 'CormorantGaramond_600SemiBold',
    700: 'CormorantGaramond_700Bold',
    italic: 'CormorantGaramond_500Medium_Italic',
  },
  arabic: {
    400: 'IBMPlexSansArabic_400Regular',
    500: 'IBMPlexSansArabic_500Medium',
    600: 'IBMPlexSansArabic_600SemiBold',
  },
} as const

export const radius = {
  sm: 8,
  md: 12,
  card: parseInt(brand.borderRadius.card, 10), // 16
  panel: parseInt(brand.borderRadius.panel, 10), // 24
  pill: 999,
} as const

/** CSS box-shadow strings (supported by React Native's `boxShadow` style on the New Architecture). */
export const shadow = {
  soft: { boxShadow: brand.boxShadow.soft },
  lift: { boxShadow: brand.boxShadow.lift },
  glass: { boxShadow: brand.boxShadow.glass },
} as const

export const space = { xs: 4, sm: 8, md: 12, lg: 16, xl: 20, '2xl': 24, '3xl': 32, '4xl': 40 } as const

/** Horizontal page padding (matches the site's px-5 on mobile). */
export const GUTTER = 20

/** The brand gradients used on CTAs and bands. */
export const gradients = {
  aura: { colors: [colors.aura, colors.indigo, colors.royal] as const, start: { x: 0, y: 0.5 }, end: { x: 1, y: 0.5 } },
  band: { colors: [colors.plum, colors.indigo, colors.royal] as const, start: { x: 0, y: 0.3 }, end: { x: 1, y: 0.7 } },
} as const
