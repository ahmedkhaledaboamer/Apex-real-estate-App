import { router } from 'expo-router'
import { ArrowRight } from 'lucide-react-native'
import { Pressable, StyleSheet, View } from 'react-native'

import { AGENT_PROFILES } from '@/mocks/agents'
import { Accordion } from '@/ui/Accordion'
import { Button } from '@/ui/Button'
import { Img } from '@/ui/Img'
import { LeadForm } from '@/ui/LeadForm'
import { Card, Container, SectionHead } from '@/ui/primitives'
import { Screen } from '@/ui/Screen'
import { Heading, Text } from '@/ui/Text'
import { colors, radius } from '@/theme'
import { agentHref } from '../agents/AgentCard'
import { PageHero } from './Bands'
import { ContactOptions, OfficeCard, OfficeHours } from './Office'

const INTERESTS = ['Buying', 'Renting', 'Selling', 'Investing', 'Property management', 'Careers', 'Complaint', 'Other']

const FAQ = [
  {
    q: 'How quickly will someone get back to me?',
    a: 'Within one working day for forms and email — usually much sooner. WhatsApp messages during office hours are typically answered within 15 minutes.',
  },
  {
    q: 'Can I book a viewing outside office hours?',
    a: 'Yes. Our advisers run viewings seven days a week until 21:00 by appointment, and can arrange live video viewings if you are overseas.',
  },
  {
    q: 'How do I make a complaint?',
    a: 'Choose “Complaint” in the form above and tell us what happened. A manager will acknowledge it within two working days. See our terms of use (More → Terms of use) for the full process.',
  },
  {
    q: 'Are you hiring?',
    a: 'We are always glad to hear from RERA-certified agents and experienced leasing and property-management staff. Choose “Careers” in the form and include a short note about your experience.',
  },
]

export function ContactScreen() {
  return (
    <Screen variant="pushed" title="Contact">
      <PageHero title="Contact us" sub="Call, WhatsApp, email or visit us in Dubai Marina. A licensed adviser will reply within one working day." />

      <Container style={{ paddingTop: 28 }}>
        <ContactOptions />
      </Container>

      {/* Form */}
      <Container style={{ paddingTop: 36 }}>
        <Card style={{ padding: 22 }}>
          <Heading size={34}>Send us a message</Heading>
          <Text size={15} color="muted" lineHeight={23} style={{ marginTop: 8, marginBottom: 20 }}>
            Tell us a little about what you need and we will connect you with the right adviser.
          </Text>
          <LeadForm type="contact" withMessage extraFields={[{ name: 'interest', label: 'I’m interested in', kind: 'select', options: INTERESTS }]} submitLabel="Send message" />
        </Card>
      </Container>

      {/* Hours */}
      <Container style={{ paddingTop: 20 }}>
        <Card style={{ padding: 22 }}>
          <Text size={17} weight={600} color="plum" style={{ marginBottom: 12 }}>
            Office hours
          </Text>
          <OfficeHours />
        </Card>
      </Container>

      {/* Advisers */}
      <Container style={{ paddingTop: 20 }}>
        <View style={styles.advisers}>
          <Text size={17} weight={600} color="plum">
            Prefer a specific adviser?
          </Text>
          <Text size={14} color="muted" style={{ marginTop: 2 }}>
            Contact them directly from their profile.
          </Text>
          <View style={{ gap: 8, marginTop: 16 }}>
            {AGENT_PROFILES.map((a) => (
              <Pressable
                key={a.id}
                accessibilityRole="link"
                accessibilityLabel={`${a.name}, ${a.role}`}
                onPress={() => router.push(agentHref(a))}
                style={({ pressed }) => [styles.agent, pressed && { opacity: 0.85 }]}
              >
                <Img src={a.photo} style={{ width: 44, height: 44, borderRadius: 22 }} />
                <View style={{ flex: 1 }}>
                  <Text size={14} weight={600} numberOfLines={1}>
                    {a.name}
                  </Text>
                  <Text size={12.5} color="muted" numberOfLines={1}>
                    {a.role} · {a.languages.join(', ')}
                  </Text>
                </View>
                <ArrowRight size={16} color={colors.muted} />
              </Pressable>
            ))}
          </View>
          <Button title="View all agents" variant="outline" size="sm" onPress={() => router.push('/agents')} style={{ marginTop: 16 }} />
        </View>
      </Container>

      {/* Map */}
      <Container style={{ paddingTop: 44 }}>
        <SectionHead title="Find our office" sub="Office 1204, Marina Plaza — overlooking the marina, two minutes from the tram." />
        <OfficeCard />
      </Container>

      {/* FAQ */}
      <Container style={{ paddingTop: 44 }}>
        <SectionHead title="Good to know" />
        <Accordion items={FAQ} />
        <Button title="Read our terms of use" variant="ghost" size="sm" onPress={() => router.push('/legal/terms')} style={{ marginTop: 12 }} />
      </Container>
    </Screen>
  )
}

const styles = StyleSheet.create({
  advisers: { backgroundColor: colors.mist, borderRadius: radius.card, padding: 20 },
  agent: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: colors.white, borderRadius: radius.md, padding: 10, paddingRight: 14, minHeight: 64 },
})
