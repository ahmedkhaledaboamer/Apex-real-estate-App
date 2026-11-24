import { LinearGradient } from 'expo-linear-gradient'
import { router } from 'expo-router'
import { ArrowLeft, ArrowRight, Check } from 'lucide-react-native'
import { useState } from 'react'
import { Pressable, StyleSheet, View } from 'react-native'

import { WHATSAPP_NUMBER } from '@/lib/constants'
import { COMMUNITY_DETAILS } from '@/mocks/communities'
import type { Lead } from '@/types'
import { colors, gradients, radius, shadow } from '@/theme'
import { whatsapp } from '@/ui/brand'
import { Button } from '@/ui/Button'
import { SelectField, TextField } from '@/ui/Field'
import { WhatsAppIcon } from '@/ui/icons'
import { Chip } from '@/ui/primitives'
import { Heading, Text } from '@/ui/Text'

/* ---------- Model (same fields, options and messages as the site's ValuationForm) ---------- */

export const OTHER_COMMUNITY = 'other'

export type ValuationValues = {
  community: string
  otherCommunity: string
  building: string
  propertyType: string
  beds: string
  size: string
  condition: string
  occupancy: string
  goal: string
  timeline: string
  name: string
  phone: string
  email: string
  message: string
}

export const EMPTY_VALUATION: ValuationValues = {
  community: '',
  otherCommunity: '',
  building: '',
  propertyType: 'Apartment',
  beds: '2',
  size: '',
  condition: 'Good / original',
  occupancy: 'Vacant',
  goal: '',
  timeline: '',
  name: '',
  phone: '',
  email: '',
  message: '',
}

const PROPERTY_TYPES = ['Apartment', 'Villa', 'Townhouse', 'Penthouse', 'Duplex', 'Hotel apartment']
const BEDS = [{ value: '0', label: 'Studio' }, ...['1', '2', '3', '4', '5', '6'].map((b) => ({ value: b, label: `${b} bed${b === '1' ? '' : 's'}` })), { value: '7+', label: '7+ beds' }]
const CONDITIONS = ['Needs work', 'Good / original', 'Upgraded', 'Fully renovated']
const OCCUPANCY = ['Vacant', 'Tenanted', 'Owner-occupied']
const GOALS = [
  { value: 'Sell', body: 'Achievable sale price and a marketing plan.' },
  { value: 'Rent it out', body: 'Expected annual rent and yield.' },
  { value: 'Just curious', body: 'A market check, no obligation.' },
]
const TIMELINES = ['As soon as possible', 'Within 3 months', '3–6 months', 'More than 6 months', 'No fixed plan']
const STEPS = ['Property', 'Your goals', 'Contact'] as const
const TITLES = ['Tell us about the property', 'What would you like to do?', 'Where should we send it?']

const PHONE = /^\+?[0-9 ()-]{7,20}$/
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function validate(step: number, v: ValuationValues): Record<string, string> {
  const e: Record<string, string> = {}
  if (step === 0) {
    if (!v.community) e.community = 'Choose a community'
    if (v.community === OTHER_COMMUNITY && v.otherCommunity.trim().length < 2) e.otherCommunity = 'Enter the community name'
    if (v.building.trim().length < 2) e.building = 'Enter the building, villa cluster or street'
    const size = v.size.trim()
    if (!/^\d{2,6}$/.test(size)) e.size = 'Enter the size in sq ft (numbers only)'
    else if (Number(size) < 150 || Number(size) > 100_000) e.size = 'Size should be between 150 and 100,000 sq ft'
  } else if (step === 1) {
    if (!v.goal) e.goal = 'Choose what you would like to do'
    if (!v.timeline) e.timeline = 'Choose a timeline'
  } else {
    if (v.name.trim().length < 2) e.name = 'Please enter your name'
    if (!PHONE.test(v.phone.trim())) e.phone = 'Please enter a valid phone number'
    if (!EMAIL.test(v.email.trim())) e.email = 'Please enter a valid email'
  }
  return e
}

export function communityLabel(v: Pick<ValuationValues, 'community' | 'otherCommunity'>) {
  if (v.community === OTHER_COMMUNITY) return v.otherCommunity.trim()
  return COMMUNITY_DETAILS.find((c) => c.slug === v.community)?.name ?? ''
}

async function submitLead(lead: Lead) {
  // Same contract as website/src/api/leads.ts — simulated until the API exists (like the shared LeadForm).
  await new Promise((r) => setTimeout(r, 600))
  return { ok: true as const, lead }
}

/* ---------- Component ---------- */

/** Three-step valuation request (property → goals → contact). Controlled so the estimate card can read it. */
export function ValuationForm({ values, onChange, onStepChange }: { values: ValuationValues; onChange: (v: ValuationValues) => void; onStepChange?: () => void }) {
  const [step, setStep] = useState(0)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [state, setState] = useState<'idle' | 'sending' | 'done'>('idle')

  const set = <K extends keyof ValuationValues>(key: K, value: ValuationValues[K]) => {
    onChange({ ...values, [key]: value })
    if (errors[key]) setErrors((e) => ({ ...e, [key]: '' }))
  }
  const go = (s: number) => {
    setStep(s)
    onStepChange?.()
  }
  const check = () => {
    const e = validate(step, values)
    setErrors(e)
    return Object.keys(e).length === 0
  }
  const next = () => check() && go(Math.min(step + 1, STEPS.length - 1))
  const back = () => {
    setErrors({})
    go(Math.max(step - 1, 0))
  }
  const submit = async () => {
    if (!check()) return
    setState('sending')
    const bedsLabel = BEDS.find((b) => b.value === values.beds)?.label ?? values.beds
    await submitLead({
      type: 'valuation',
      name: values.name.trim(),
      phone: values.phone.trim(),
      email: values.email.trim(),
      message: values.message.trim() || undefined,
      extra: {
        Community: communityLabel(values),
        Building: values.building.trim(),
        'Property type': values.propertyType,
        Bedrooms: bedsLabel,
        'Size (sq ft)': values.size.trim(),
        Condition: values.condition,
        Occupancy: values.occupancy,
        Goal: values.goal,
        Timeline: values.timeline,
      },
    })
    setState('done')
    onStepChange?.()
  }

  if (state === 'done') {
    const first = values.name.trim().split(' ')[0]
    return (
      <View style={styles.card} accessibilityLiveRegion="polite">
        <View style={styles.doneIcon}>
          <Check size={24} color={colors.white} />
        </View>
        <Heading size={36} style={{ marginTop: 20 }}>
          Thank you, {first}.
        </Heading>
        <Text size={15.5} color="muted" lineHeight={24} style={{ marginTop: 10 }}>
          Your valuation request for {values.building.trim()}, {communityLabel(values)} is with our team. A RERA-certified agent will review recent DLD transactions in your
          building and send your valuation within one working day.
        </Text>
        <View style={{ gap: 10, marginTop: 22 }}>
          {[
            ['Today', 'We pull comparable sales and rentals for your building.'],
            ['Within 1 working day', 'Your agent calls or WhatsApps you with the valuation.'],
            ['When you are ready', 'Optional visit to confirm condition and finalise the figure.'],
          ].map(([t, b], i) => (
            <View key={t} style={styles.nextStep}>
              <Text size={12} weight={600} color="aura">
                Step {i + 1}
              </Text>
              <Text size={14.5} weight={600} color="plum" style={{ marginTop: 2 }}>
                {t}
              </Text>
              <Text size={13.5} color="muted" style={{ marginTop: 2 }}>
                {b}
              </Text>
            </View>
          ))}
        </View>
        <View style={{ gap: 10, marginTop: 22 }}>
          <Button title="How selling works" full onPress={() => (router.canGoBack() ? router.back() : router.replace('/sell'))} />
          <Button
            variant="whatsapp"
            full
            title="WhatsApp us"
            icon={<WhatsAppIcon size={16} />}
            onPress={() => whatsapp(WHATSAPP_NUMBER, `Hi Apex Aora, I just requested a valuation for ${values.building.trim()}, ${communityLabel(values)}.`)}
          />
        </View>
      </View>
    )
  }

  const communityOptions = [...COMMUNITY_DETAILS.map((c) => ({ value: c.slug, label: c.name })), { value: OTHER_COMMUNITY, label: 'Other' }]

  return (
    <View style={styles.card}>
      {/* Step indicator */}
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }} accessibilityLabel={`Step ${step + 1} of ${STEPS.length}: ${STEPS[step]}`}>
        {STEPS.map((label, i) => {
          const done = i < step
          const current = i === step
          return (
            <View key={label} style={{ ...(i < STEPS.length - 1 ? { flex: 1 } : null), flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              {current ? (
                <LinearGradient colors={gradients.aura.colors} start={gradients.aura.start} end={gradients.aura.end} style={styles.stepDot}>
                  <Text size={13} weight={700} color="white">
                    {i + 1}
                  </Text>
                </LinearGradient>
              ) : (
                <View style={[styles.stepDot, { backgroundColor: done ? colors.plum : colors.mist }]}>
                  {done ? (
                    <Check size={15} color={colors.white} />
                  ) : (
                    <Text size={13} weight={700} color="muted">
                      {i + 1}
                    </Text>
                  )}
                </View>
              )}
              {current ? (
                <Text size={12.5} weight={600} color="plum" numberOfLines={1}>
                  {label}
                </Text>
              ) : null}
              {i < STEPS.length - 1 ? <View style={{ flex: 1, height: 1, backgroundColor: done ? colors.plum : colors.line }} /> : null}
            </View>
          )
        })}
      </View>

      <Text size={12.5} weight={600} color="aura" style={{ marginTop: 24 }}>
        Step {step + 1} of {STEPS.length}
      </Text>
      <Heading size={30} style={{ marginTop: 4 }} accessibilityRole="header">
        {TITLES[step]}
      </Heading>

      {step === 0 ? (
        <View style={styles.fields}>
          <SelectField label="Community" placeholder="Select a community" options={communityOptions} value={values.community || undefined} onChange={(v) => set('community', v)} error={errors.community} />
          {values.community === OTHER_COMMUNITY ? (
            <TextField label="Community name" placeholder="e.g. Arabian Ranches" value={values.otherCommunity} onChangeText={(t) => set('otherCommunity', t)} error={errors.otherCommunity} />
          ) : null}
          <TextField label="Building / cluster" placeholder="e.g. Marina Gate 2, unit 1804" value={values.building} onChangeText={(t) => set('building', t)} error={errors.building} />
          <View style={{ flexDirection: 'row', gap: 10 }}>
            <SelectField label="Property type" options={PROPERTY_TYPES} value={values.propertyType} onChange={(v) => set('propertyType', v)} containerStyle={{ flex: 1 }} />
            <SelectField label="Bedrooms" options={BEDS} value={values.beds} onChange={(v) => set('beds', v)} containerStyle={{ flex: 1 }} />
          </View>
          <TextField
            label="Size (sq ft)"
            placeholder="e.g. 1250"
            keyboardType="numeric"
            inputMode="numeric"
            value={values.size}
            onChangeText={(t) => set('size', t.replace(/[^\d]/g, ''))}
            error={errors.size}
            hint="As shown on your title deed or Oqood."
          />
          <SelectField label="Condition" options={CONDITIONS} value={values.condition} onChange={(v) => set('condition', v)} />
          <View>
            <Text size={12.5} weight={600} color="muted" style={{ marginBottom: 8, paddingStart: 4 }}>
              Occupancy
            </Text>
            <View style={styles.chips}>
              {OCCUPANCY.map((o) => (
                <Chip key={o} label={o} active={values.occupancy === o} onPress={() => set('occupancy', o)} style={styles.chip} />
              ))}
            </View>
          </View>
        </View>
      ) : null}

      {step === 1 ? (
        <View style={[styles.fields, { gap: 24 }]}>
          <View>
            <Text size={12.5} weight={600} color="muted" style={{ marginBottom: 10, paddingStart: 4 }}>
              I want to
            </Text>
            <View style={{ gap: 10 }}>
              {GOALS.map((g) => {
                const active = values.goal === g.value
                return (
                  <Pressable
                    key={g.value}
                    accessibilityRole="radio"
                    accessibilityState={{ checked: active }}
                    onPress={() => set('goal', g.value)}
                    style={[styles.goal, active ? { borderColor: colors.plum, backgroundColor: colors.mist, ...shadow.soft } : null]}
                  >
                    <View style={{ flex: 1 }}>
                      <Text size={15.5} weight={600} color="plum">
                        {g.value}
                      </Text>
                      <Text size={13} color="muted" style={{ marginTop: 2 }}>
                        {g.body}
                      </Text>
                    </View>
                    <View style={[styles.radio, active && { borderColor: colors.plum }]}>{active ? <View style={styles.radioDot} /> : null}</View>
                  </Pressable>
                )
              })}
            </View>
            {errors.goal ? (
              <Text size={12} weight={500} color="danger" style={{ marginTop: 6, paddingStart: 4 }}>
                {errors.goal}
              </Text>
            ) : null}
          </View>
          <View>
            <Text size={12.5} weight={600} color="muted" style={{ marginBottom: 10, paddingStart: 4 }}>
              Timeline
            </Text>
            <View style={styles.chips}>
              {TIMELINES.map((t) => (
                <Chip key={t} label={t} active={values.timeline === t} onPress={() => set('timeline', t)} style={styles.chip} />
              ))}
            </View>
            {errors.timeline ? (
              <Text size={12} weight={500} color="danger" style={{ marginTop: 6, paddingStart: 4 }}>
                {errors.timeline}
              </Text>
            ) : null}
          </View>
        </View>
      ) : null}

      {step === 2 ? (
        <View style={styles.fields}>
          <TextField label="Full name" placeholder="Your name" autoComplete="name" textContentType="name" value={values.name} onChangeText={(t) => set('name', t)} error={errors.name} />
          <TextField
            label="Phone / WhatsApp"
            placeholder="+971 50 000 0000"
            keyboardType="phone-pad"
            autoComplete="tel"
            textContentType="telephoneNumber"
            value={values.phone}
            onChangeText={(t) => set('phone', t)}
            error={errors.phone}
          />
          <TextField
            label="Email"
            placeholder="you@example.com"
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            textContentType="emailAddress"
            value={values.email}
            onChangeText={(t) => set('email', t)}
            error={errors.email}
          />
          <TextField
            label="Anything else? (optional)"
            placeholder="Upgrades, tenancy end date, service charge, best time to call…"
            multiline
            numberOfLines={3}
            value={values.message}
            onChangeText={(t) => set('message', t)}
            style={{ minHeight: 72, textAlignVertical: 'top' }}
          />
        </View>
      ) : null}

      <View style={styles.footer}>
        {step > 0 ? (
          <Button variant="ghost" title="Back" icon={<ArrowLeft size={16} color={colors.plum} />} onPress={back} />
        ) : (
          <Text size={12.5} color="muted" style={{ flex: 1 }}>
            Takes about 1 minute
          </Text>
        )}
        {step < STEPS.length - 1 ? (
          <Button size="lg" title="Next" iconRight={<ArrowRight size={16} color={colors.white} />} onPress={next} />
        ) : (
          <Button size="lg" title={state === 'sending' ? 'Sending…' : 'Get my valuation'} loading={state === 'sending'} onPress={submit} />
        )}
      </View>
      {step === STEPS.length - 1 ? (
        <Text size={11.5} color="muted" lineHeight={17} style={{ marginTop: 14 }}>
          By sending, you agree to be contacted about this valuation. See our{' '}
          <Text size={11.5} weight={600} color="aura" onPress={() => router.push('/legal/privacy')} accessibilityRole="link">
            privacy policy
          </Text>
          .
        </Text>
      ) : null}
    </View>
  )
}

const styles = StyleSheet.create({
  card: { backgroundColor: colors.white, borderRadius: radius.card, padding: 20, ...shadow.soft },
  stepDot: { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  fields: { gap: 12, marginTop: 20 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { minHeight: 40, justifyContent: 'center' },
  goal: { flexDirection: 'row', alignItems: 'center', gap: 12, borderWidth: 1, borderColor: colors.line, borderRadius: radius.card, padding: 16, backgroundColor: colors.white },
  radio: { width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: colors.line, alignItems: 'center', justifyContent: 'center' },
  radioDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: colors.plum },
  footer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginTop: 24, paddingTop: 20, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: colors.line },
  doneIcon: { width: 56, height: 56, borderRadius: 28, backgroundColor: colors.plum, alignItems: 'center', justifyContent: 'center' },
  nextStep: { backgroundColor: colors.mist, borderRadius: radius.card, padding: 16 },
})
