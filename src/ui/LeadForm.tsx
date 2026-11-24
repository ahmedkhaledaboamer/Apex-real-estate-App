import { Check } from 'lucide-react-native'
import { useState } from 'react'
import { StyleSheet, View } from 'react-native'

import { colors, radius } from '@/theme'
import type { Lead, LeadType } from '@/types'
import { Button } from './Button'
import { SelectField, TextField } from './Field'
import { Text } from './Text'

/**
 * Enquiry / viewing / valuation / contact form (site: LeadForm) — same fields, validation and copy.
 * Submission is simulated until the API exists (same as the website's submitLead mock).
 */
export type ExtraField =
  | { name: string; label: string; kind: 'text'; placeholder?: string; required?: boolean }
  | { name: string; label: string; kind: 'select'; options: string[]; defaultValue?: string }

const PHONE = /^\+?[0-9 ()-]{7,20}$/
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

async function submitLead(lead: Lead) {
  // Same contract as website/src/api/leads.ts — replace with the real endpoint later.
  await new Promise((r) => setTimeout(r, 500))
  return { ok: true as const, lead }
}

export function LeadForm({
  type,
  context,
  withEmail = true,
  emailRequired = false,
  withMessage = false,
  withDate = false,
  defaultMessage = '',
  extraFields = [],
  submitLabel = 'Send enquiry',
  successText = 'Thanks — an adviser will contact you within one working day.',
  tone = 'outline',
}: {
  type: LeadType
  context?: Pick<Lead, 'propertyId' | 'projectSlug' | 'agentId'>
  withEmail?: boolean
  emailRequired?: boolean
  withMessage?: boolean
  withDate?: boolean
  defaultMessage?: string
  extraFields?: ExtraField[]
  submitLabel?: string
  successText?: string
  tone?: 'outline' | 'solid'
}) {
  const [values, setValues] = useState<Record<string, string>>(() => ({
    message: defaultMessage,
    ...Object.fromEntries(extraFields.filter((f) => f.kind === 'select').map((f) => [f.name, (f as { defaultValue?: string; options: string[] }).defaultValue ?? (f as { options: string[] }).options[0]])),
  }))
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [state, setState] = useState<'idle' | 'sending' | 'done'>('idle')
  const set = (k: string) => (v: string) => setValues((s) => ({ ...s, [k]: v }))

  const submit = async () => {
    const e: Record<string, string> = {}
    if ((values.name ?? '').trim().length < 2) e.name = 'Please enter your name'
    if (!PHONE.test((values.phone ?? '').trim())) e.phone = 'Please enter a valid phone number'
    const mail = (values.email ?? '').trim()
    if ((emailRequired || mail) && !EMAIL.test(mail)) e.email = 'Please enter a valid email'
    for (const f of extraFields) if (f.kind === 'text' && f.required && !(values[f.name] ?? '').trim()) e[f.name] = `Please enter ${f.label.toLowerCase()}`
    setErrors(e)
    if (Object.keys(e).length) return
    setState('sending')
    await submitLead({
      type,
      name: values.name.trim(),
      phone: values.phone.trim(),
      email: mail || undefined,
      message: values.message || undefined,
      preferredDate: values.preferredDate || undefined,
      extra: Object.fromEntries(extraFields.map((f) => [f.label, values[f.name] ?? ''])),
      ...context,
    })
    setState('done')
  }

  if (state === 'done') {
    return (
      <View style={[styles.done, tone === 'solid' ? { backgroundColor: 'rgba(255,255,255,0.12)' } : { backgroundColor: colors.mist }]} accessibilityLiveRegion="polite">
        <View style={[styles.check, { backgroundColor: tone === 'solid' ? colors.white : colors.plum }]}>
          <Check size={20} color={tone === 'solid' ? colors.plum : colors.white} />
        </View>
        <Text size={15.5} color={tone === 'solid' ? 'white' : 'ink'} style={{ flex: 1 }}>
          {successText}
        </Text>
      </View>
    )
  }

  return (
    <View style={{ gap: 12 }}>
      <TextField tone={tone} label="Full name" placeholder="Your name" autoComplete="name" textContentType="name" value={values.name} onChangeText={set('name')} error={errors.name} />
      <TextField tone={tone} label="Phone / WhatsApp" placeholder="+971 50 000 0000" keyboardType="phone-pad" autoComplete="tel" textContentType="telephoneNumber" value={values.phone} onChangeText={set('phone')} error={errors.phone} />
      {withEmail ? (
        <TextField
          tone={tone}
          label={emailRequired ? 'Email' : 'Email (optional)'}
          placeholder="you@example.com"
          keyboardType="email-address"
          autoCapitalize="none"
          autoComplete="email"
          textContentType="emailAddress"
          value={values.email}
          onChangeText={set('email')}
          error={errors.email}
        />
      ) : null}
      {withDate ? <TextField tone={tone} label="Preferred date" placeholder="e.g. Sat 28 Nov, afternoon" value={values.preferredDate} onChangeText={set('preferredDate')} /> : null}
      {extraFields.map((f) =>
        f.kind === 'select' ? (
          <SelectField key={f.name} tone={tone} label={f.label} options={f.options} value={values[f.name]} onChange={set(f.name)} />
        ) : (
          <TextField key={f.name} tone={tone} label={f.label} placeholder={f.placeholder} value={values[f.name]} onChangeText={set(f.name)} error={errors[f.name]} />
        ),
      )}
      {withMessage ? <TextField tone={tone} label="Message" multiline numberOfLines={4} value={values.message} onChangeText={set('message')} style={{ minHeight: 88, textAlignVertical: 'top' }} /> : null}
      <Button title={state === 'sending' ? 'Sending…' : submitLabel} variant={tone === 'solid' ? 'white' : 'primary'} size="lg" full loading={state === 'sending'} onPress={submit} />
      <Text size={11.5} color={tone === 'solid' ? 'white' : 'muted'} style={tone === 'solid' ? { opacity: 0.6 } : undefined}>
        By sending, you agree to be contacted about this enquiry. See our privacy policy.
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  done: { flexDirection: 'row', alignItems: 'center', gap: 14, borderRadius: radius.card, padding: 20 },
  check: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
})
