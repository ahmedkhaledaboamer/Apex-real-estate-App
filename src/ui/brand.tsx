import { router } from 'expo-router'
import { Check, ChevronDown, ChevronLeft, Heart } from 'lucide-react-native'
import { useState } from 'react'
import { Linking, Pressable, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { LOGO_URL } from '@/assets/images'
import { CONTACT_PHONE_HREF, WHATSAPP_NUMBER, whatsappLink } from '@/lib/constants'
import { CURRENCIES } from '@/lib/currency'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { setCurrency } from '@/store/slices/preferencesSlice'
import { colors, GUTTER, radius, shadow } from '@/theme'
import type { Currency } from '@/types'
import { Img } from './Img'
import { Sheet } from './Sheet'
import { Text } from './Text'

/** Infinity mark + wordmark (site: Logo). */
export function Logo({ light = false, compact = false }: { light?: boolean; compact?: boolean }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }} accessibilityLabel="Apex Aura">
      <View style={light ? styles.logoChip : undefined}>
        <Img src={LOGO_URL} style={{ width: 44, height: 18 }} contentFit="contain" transition={0} />
      </View>
      <View>
        <Text display weight={600} size={22} lineHeight={22} color={light ? 'white' : 'plum'} tracking={0.02}>
          Apex Aura
        </Text>
        {!compact ? (
          <Text size={9.5} weight={500} tracking={0.22} color={light ? 'white' : 'muted'} style={light ? { opacity: 0.6 } : undefined}>
            REAL ESTATE · DUBAI
          </Text>
        ) : null}
      </View>
    </View>
  )
}

/** Top app bar for tab screens: logo, currency picker, saved count. */
export function AppBar() {
  const insets = useSafeAreaInsets()
  const dispatch = useAppDispatch()
  const currency = useAppSelector((s) => s.preferences.currency)
  const saved = useAppSelector((s) => s.favorites.ids.length)
  return (
    <View style={[styles.appbar, { paddingTop: insets.top + 8 }]}>
      <Logo />
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        <CurrencyPill value={currency} onChange={(c) => dispatch(setCurrency(c))} />
        <Pressable accessibilityRole="button" accessibilityLabel={`Saved properties (${saved})`} onPress={() => router.push('/saved')} style={styles.iconBtn} hitSlop={6}>
          <Heart size={20} color={colors.plum} />
          {saved > 0 ? (
            <View style={styles.count}>
              <Text size={10} weight={700} color="white">
                {saved}
              </Text>
            </View>
          ) : null}
        </Pressable>
      </View>
    </View>
  )
}

/** Compact currency switcher (site: the utility-bar currency select). */
export function CurrencyPill({ value, onChange }: { value: Currency; onChange: (c: Currency) => void }) {
  const [open, setOpen] = useState(false)
  return (
    <>
      <Pressable accessibilityRole="button" accessibilityLabel={`Currency: ${value}`} onPress={() => setOpen(true)} style={styles.pill} hitSlop={6}>
        <Text size={13} weight={600} color="plum">
          {value}
        </Text>
        <ChevronDown size={14} color={colors.plum} />
      </Pressable>
      <Sheet open={open} onClose={() => setOpen(false)} title="Currency">
        {CURRENCIES.map((c) => (
          <Pressable
            key={c}
            accessibilityRole="button"
            accessibilityState={{ selected: c === value }}
            onPress={() => {
              onChange(c)
              setOpen(false)
            }}
            style={({ pressed }) => [styles.option, (pressed || c === value) && { backgroundColor: colors.mist }]}
          >
            <Text size={15.5} weight={c === value ? 600 : 400} color={c === value ? 'plum' : 'ink'} style={{ flex: 1 }}>
              {c}
            </Text>
            {c === value ? <Check size={18} color={colors.aura} /> : null}
          </Pressable>
        ))}
      </Sheet>
    </>
  )
}

/** Round floating back button for full-bleed detail screens. */
export function BackButton({ style, light = true }: { style?: StyleProp<ViewStyle>; light?: boolean }) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Back"
      hitSlop={8}
      onPress={() => (router.canGoBack() ? router.back() : router.replace('/'))}
      style={[styles.back, light ? { backgroundColor: 'rgba(255,255,255,0.95)' } : { backgroundColor: colors.mist }, shadow.soft, style]}
    >
      <ChevronLeft size={22} color={colors.plum} />
    </Pressable>
  )
}

/** Header row for pushed (non-tab) screens without a hero image. */
export function ScreenHeader({ title, right }: { title?: string; right?: React.ReactNode }) {
  const insets = useSafeAreaInsets()
  return (
    <View style={[styles.screenHeader, { paddingTop: insets.top + 6 }]}>
      <BackButton light={false} style={{ boxShadow: 'none' }} />
      {title ? (
        <Text size={16} weight={600} color="plum" numberOfLines={1} style={{ flex: 1 }}>
          {title}
        </Text>
      ) : (
        <View style={{ flex: 1 }} />
      )}
      {right}
    </View>
  )
}

/* ---------- contact actions (same numbers/links as the website) ---------- */

export const call = (tel: string = CONTACT_PHONE_HREF) => Linking.openURL(tel.startsWith('tel:') ? tel : `tel:${tel.replace(/\s/g, '')}`)
export const whatsapp = (number: string = WHATSAPP_NUMBER, text?: string) => Linking.openURL(whatsappLink(number, text))
export const email = (address: string, subject?: string) => Linking.openURL(`mailto:${address}${subject ? `?subject=${encodeURIComponent(subject)}` : ''}`)
export const openUrl = (url: string) => Linking.openURL(url)

const styles = StyleSheet.create({
  appbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: GUTTER,
    paddingBottom: 10,
    backgroundColor: colors.paper,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.line,
  },
  pill: { flexDirection: 'row', alignItems: 'center', gap: 4, height: 36, paddingHorizontal: 12, borderRadius: radius.pill, borderWidth: 1, borderColor: colors.line, backgroundColor: colors.white },
  option: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 14, borderRadius: radius.md },
  logoChip: { backgroundColor: colors.white, borderRadius: radius.sm, paddingHorizontal: 6, paddingVertical: 4 },
  iconBtn: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  count: { position: 'absolute', top: 4, right: 4, minWidth: 18, height: 18, borderRadius: 9, backgroundColor: colors.aura, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 4 },
  back: { width: 42, height: 42, borderRadius: 21, alignItems: 'center', justifyContent: 'center' },
  screenHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: GUTTER, paddingBottom: 10, backgroundColor: colors.paper },
})
