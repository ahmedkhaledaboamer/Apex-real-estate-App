import AsyncStorage from '@react-native-async-storage/async-storage'
import { Check, Lock } from 'lucide-react-native'
import { useEffect, useState } from 'react'
import { StyleSheet, Switch, View } from 'react-native'
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated'

import { Button } from '@/ui/Button'
import { Text } from '@/ui/Text'
import { colors, radius, shadow } from '@/theme'

export const COOKIE_PREFS_KEY = 'aa-cookie-preferences'

type Prefs = { analytics: boolean; marketing: boolean }
const DEFAULTS: Prefs = { analytics: false, marketing: false }

const CATEGORIES: { key: 'essential' | keyof Prefs; title: string; body: string }[] = [
  { key: 'essential', title: 'Essential', body: 'Needed for the app to work: security, your currency and language choice, saved properties and this preference itself. Always on.' },
  { key: 'analytics', title: 'Analytics', body: 'Helps us understand which screens are used so we can improve them. Data is aggregated and not used to identify you.' },
  { key: 'marketing', title: 'Marketing', body: 'Lets us measure our advertising and show relevant Apex Aura ads on other sites and social platforms.' },
]

export type CookieRow = { name: string; purpose: string; duration: string; type: 'Essential' | 'Analytics' | 'Marketing' }

export const COOKIES: CookieRow[] = [
  { name: 'aa-session', purpose: 'Keeps the site secure and your session stable while you browse.', duration: 'Session', type: 'Essential' },
  { name: 'aa-preferences', purpose: 'Remembers your currency and language choice.', duration: '12 months', type: 'Essential' },
  { name: 'aa-cookie-preferences', purpose: 'Stores the cookie choices you make on this page.', duration: '12 months', type: 'Essential' },
  { name: 'aa-favourites', purpose: 'Keeps your saved properties and comparison list in this browser.', duration: 'Session', type: 'Essential' },
  { name: '_ga, _ga_*', purpose: 'Google Analytics: counts visits and shows which pages are used.', duration: '13 months', type: 'Analytics' },
  { name: '_clck, _clsk', purpose: 'Microsoft Clarity: aggregated heatmaps of how pages are used.', duration: '1 day – 12 months', type: 'Analytics' },
  { name: '_fbp', purpose: 'Meta Pixel: measures our ads on Facebook and Instagram.', duration: '3 months', type: 'Marketing' },
  { name: '_gcl_au', purpose: 'Google Ads: measures conversions from our advertising.', duration: '3 months', type: 'Marketing' },
]

/** Cookie table as stacked cards (site: CookieTable). */
export function CookieCards() {
  return (
    <View style={{ gap: 10, marginTop: 16 }}>
      {COOKIES.map((c) => (
        <View key={c.name} style={styles.cookie}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
            <Text size={13.5} weight={600} color="plum" style={{ flex: 1 }}>
              {c.name}
            </Text>
            <View style={styles.type}>
              <Text size={12} weight={600} color="plum">
                {c.type}
              </Text>
            </View>
          </View>
          <Text size={14} lineHeight={21} style={{ marginTop: 6, opacity: 0.8 }}>
            {c.purpose}
          </Text>
          <Text size={12.5} color="muted" style={{ marginTop: 6 }}>
            Duration: {c.duration}
          </Text>
        </View>
      ))}
    </View>
  )
}

/** Preference centre — saved to AsyncStorage under the same key the website uses. */
export function CookiePreferences() {
  const [prefs, setPrefs] = useState<Prefs>(DEFAULTS)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    AsyncStorage.getItem(COOKIE_PREFS_KEY)
      .then((raw) => {
        if (!raw) return
        const p = JSON.parse(raw) as Partial<Prefs>
        setPrefs({ analytics: p.analytics === true, marketing: p.marketing === true })
      })
      .catch(() => undefined)
  }, [])

  useEffect(() => {
    if (!saved) return
    const t = setTimeout(() => setSaved(false), 3000)
    return () => clearTimeout(t)
  }, [saved])

  const save = (next: Prefs) => {
    setPrefs(next)
    AsyncStorage.setItem(COOKIE_PREFS_KEY, JSON.stringify({ ...next, essential: true, savedAt: new Date().toISOString() })).catch(() => undefined)
    setSaved(true)
  }

  return (
    <View style={styles.card}>
      {CATEGORIES.map((c, i) => {
        const locked = c.key === 'essential'
        const on = locked ? true : prefs[c.key as keyof Prefs]
        return (
          <View key={c.key} style={[styles.row, i > 0 && { borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: colors.line }]}>
            <View style={{ flex: 1 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                <Text size={15.5} weight={600} color="plum">
                  {c.title}
                </Text>
                {locked ? (
                  <View style={styles.locked}>
                    <Lock size={11} color={colors.muted} />
                    <Text size={11.5} weight={600} color="muted">
                      Always on
                    </Text>
                  </View>
                ) : null}
              </View>
              <Text size={14} color="muted" lineHeight={21} style={{ marginTop: 4 }}>
                {c.body}
              </Text>
            </View>
            <Switch
              value={on}
              disabled={locked}
              onValueChange={(v) => {
                if (!locked) setPrefs((p) => ({ ...p, [c.key]: v }))
              }}
              trackColor={{ false: colors.line, true: colors.aura }}
              thumbColor={colors.white}
              ios_backgroundColor={colors.line}
              accessibilityLabel={`${c.title} cookies`}
            />
          </View>
        )
      })}
      <View style={styles.actions}>
        <Button title="Save preferences" full onPress={() => save(prefs)} />
        <View style={{ flexDirection: 'row', gap: 10 }}>
          <Button title="Accept all" variant="outline" full style={{ flex: 1 }} onPress={() => save({ analytics: true, marketing: true })} />
          <Button title="Essential only" variant="ghost" full style={{ flex: 1 }} onPress={() => save(DEFAULTS)} />
        </View>
        {saved ? (
          <Animated.View entering={FadeIn.duration(180)} exiting={FadeOut.duration(150)} style={{ flexDirection: 'row', alignItems: 'center', gap: 6, alignSelf: 'center' }} accessibilityLiveRegion="polite">
            <Check size={16} color={colors.success} />
            <Text size={14} weight={600} color="success">
              Saved
            </Text>
          </Animated.View>
        ) : null}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  cookie: { backgroundColor: colors.white, borderRadius: radius.card, padding: 16, ...shadow.soft },
  type: { backgroundColor: colors.mist, borderRadius: radius.pill, paddingHorizontal: 10, paddingVertical: 3 },
  card: { marginTop: 16, backgroundColor: colors.white, borderRadius: radius.card, padding: 18, ...shadow.soft },
  row: { flexDirection: 'row', alignItems: 'flex-start', gap: 16, paddingVertical: 14 },
  locked: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: colors.mist, borderRadius: radius.pill, paddingHorizontal: 8, paddingVertical: 2 },
  actions: { gap: 10, marginTop: 6, paddingTop: 16, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: colors.line },
})
