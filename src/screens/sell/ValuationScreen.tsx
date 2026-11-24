import { BadgeCheck, Clock, Database, Phone, Sparkles } from 'lucide-react-native'
import { useRef, useState } from 'react'
import { ScrollView, StyleSheet, View } from 'react-native'

import { useCurrency } from '@/features/favorites/hooks'
import { CONTACT_PHONE, WHATSAPP_NUMBER } from '@/lib/constants'
import { formatNumber, formatPrice } from '@/lib/format'
import { COMMUNITY_DETAILS } from '@/mocks/communities'
import { PageIntro } from '@/screens/calculators/page'
import { colors, radius, shadow } from '@/theme'
import { call, ScreenHeader, whatsapp } from '@/ui/brand'
import { Button } from '@/ui/Button'
import { WhatsAppIcon } from '@/ui/icons'
import { Container } from '@/ui/primitives'
import { Heading, Text } from '@/ui/Text'
import { EMPTY_VALUATION, OTHER_COMMUNITY, ValuationForm, type ValuationValues } from './ValuationForm'

const SPREAD = 0.08

/** Indicative range from the community's average price per sq ft, ±8% (site: InstantEstimate). */
function InstantEstimate({ community, size }: { community: string; size: string }) {
  const currency = useCurrency()
  const c = COMMUNITY_DETAILS.find((x) => x.slug === community)
  const sqft = Number(size)
  const validSize = /^\d+$/.test(size) && sqft >= 150 && sqft <= 100_000
  const mid = c?.ppsf && validSize ? c.ppsf * sqft : null

  let prompt: string | null = null
  if (!community) prompt = 'Choose a community and enter the size to see an indicative range.'
  else if (community === OTHER_COMMUNITY) prompt = 'We don’t publish an average for this community yet — your agent will price it from recent DLD transactions.'
  else if (!c?.ppsf) prompt = `We don’t publish an average price per sq ft for ${c?.name ?? 'this community'} — villas and prime homes vary too much. Your agent will price it from comparable DLD sales.`
  else if (!validSize) prompt = `Enter the size in sq ft to estimate a range for ${c.name}.`

  return (
    <View style={styles.card}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
        <View style={styles.spark}>
          <Sparkles size={16} color={colors.aura} />
        </View>
        <Text size={16} weight={600} color="plum" accessibilityRole="header">
          Instant estimate
        </Text>
      </View>
      <View accessibilityLiveRegion="polite" style={{ marginTop: 18 }}>
        {mid && c?.ppsf ? (
          <>
            <Text size={12.5} color="muted">
              Indicative value
            </Text>
            <Heading size={34} style={{ marginTop: 4 }}>
              {formatPrice(mid * (1 - SPREAD), currency, { compact: true })} – {formatPrice(mid * (1 + SPREAD), currency, { compact: true })}
            </Heading>
            <View style={styles.facts}>
              <View style={{ flex: 1 }}>
                <Text size={12} color="muted">
                  Avg. price / sq ft
                </Text>
                <Text size={15} weight={700} color="plum">
                  {formatPrice(c.ppsf, currency)}
                </Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text size={12} color="muted">
                  Your size
                </Text>
                <Text size={15} weight={700} color="plum">
                  {formatNumber(sqft)} sq ft
                </Text>
              </View>
            </View>
            <Text size={12} color="muted" lineHeight={18} style={{ marginTop: 14 }}>
              Based on the {c.approx ? 'approximate ' : ''}community average for {c.name}, ±8%. Floor, view, layout and condition can move the real figure well outside this range. Not
              a formal valuation.
            </Text>
          </>
        ) : (
          <View style={styles.prompt}>
            <Text size={14} color="plum" lineHeight={21}>
              {prompt}
            </Text>
          </View>
        )}
      </View>
    </View>
  )
}

const TRUST = [
  { icon: BadgeCheck, title: 'RERA-certified agent', body: 'Your valuation is prepared by a licensed adviser, not an algorithm.' },
  { icon: Database, title: 'DLD transaction data', body: 'Comparable sales and rents in your building over the last 12 months.' },
  { icon: Clock, title: 'Reply within one working day', body: 'By phone, WhatsApp or email — whichever you prefer.' },
]

export function ValuationScreen() {
  const [values, setValues] = useState<ValuationValues>(EMPTY_VALUATION)
  const scroll = useRef<React.ComponentRef<typeof ScrollView>>(null)

  return (
    <View style={{ flex: 1, backgroundColor: colors.paper }}>
      <ScreenHeader title="Free valuation" />
      <ScrollView ref={scroll} keyboardShouldPersistTaps="handled" contentContainerStyle={{ paddingBottom: 48 }}>
        <PageIntro
          title="Free property valuation"
          sub="Tell us about your home and a RERA-certified agent will send a valuation backed by recent DLD transactions — within one working day, with no obligation."
        />
        <Container style={{ gap: 18 }}>
          <ValuationForm values={values} onChange={setValues} onStepChange={() => scroll.current?.scrollTo({ y: 0, animated: true })} />
          <InstantEstimate community={values.community} size={values.size} />
          <View style={styles.trust}>
            {TRUST.map((t) => (
              <View key={t.title} style={{ flexDirection: 'row', gap: 12 }}>
                <t.icon size={20} color={colors.aura} strokeWidth={1.8} style={{ marginTop: 2 }} />
                <View style={{ flex: 1 }}>
                  <Text size={14.5} weight={600} color="plum">
                    {t.title}
                  </Text>
                  <Text size={13.5} color="muted" lineHeight={20}>
                    {t.body}
                  </Text>
                </View>
              </View>
            ))}
          </View>
          <View style={styles.help}>
            <Text size={15} weight={600} color="plum">
              Prefer to talk it through?
            </Text>
            <Text size={13.5} color="muted" style={{ marginTop: 2 }}>
              Our sales desk is open 7 days a week.
            </Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 14 }}>
              <Button variant="outline" title={CONTACT_PHONE} icon={<Phone size={16} color={colors.plum} />} onPress={() => call()} accessibilityLabel={`Call ${CONTACT_PHONE}`} />
              <Button variant="whatsapp" title="WhatsApp" icon={<WhatsAppIcon size={16} />} onPress={() => whatsapp(WHATSAPP_NUMBER, 'Hi Apex Aora, I would like a valuation for my property.')} />
            </View>
          </View>
        </Container>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  card: { backgroundColor: colors.white, borderRadius: radius.card, padding: 20, ...shadow.soft },
  spark: { width: 36, height: 36, borderRadius: 18, backgroundColor: colors.mist, alignItems: 'center', justifyContent: 'center' },
  facts: { flexDirection: 'row', gap: 12, marginTop: 14, backgroundColor: colors.mist, borderRadius: radius.md, padding: 14 },
  prompt: { backgroundColor: colors.mist, borderRadius: radius.md, padding: 16 },
  trust: { gap: 16, borderRadius: radius.card, borderWidth: StyleSheet.hairlineWidth, borderColor: colors.line, padding: 20 },
  help: { backgroundColor: colors.mist, borderRadius: radius.card, padding: 20 },
})
