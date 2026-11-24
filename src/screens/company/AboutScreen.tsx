import { router } from 'expo-router'
import { ArrowRight, BadgeCheck, Eye, HeartHandshake, Landmark, Scale, ShieldCheck, Sparkles } from 'lucide-react-native'
import { StyleSheet, View } from 'react-native'

import { IMG } from '@/assets/images'
import { formatNumber } from '@/lib/format'
import { AGENT_PROFILES } from '@/mocks/agents'
import { Button } from '@/ui/Button'
import { Img } from '@/ui/Img'
import { Container, SectionHead } from '@/ui/primitives'
import { Screen } from '@/ui/Screen'
import { Heading, Text } from '@/ui/Text'
import { colors, GUTTER, radius, shadow } from '@/theme'
import { AgentCard } from '../agents/AgentCard'
import { CtaBand, Eyebrow, IconCircle } from './Bands'
import { Carousel } from './Carousel'
import { OfficeCard } from './Office'
import { LinearGradient } from 'expo-linear-gradient'

const DEALS = AGENT_PROFILES.reduce((n, a) => n + a.dealsClosed, 0)
const YEARS = AGENT_PROFILES.reduce((n, a) => n + a.yearsExperience, 0)
const LANGUAGES = new Set(AGENT_PROFILES.flatMap((a) => a.languages)).size

const NUMBERS = [
  { value: `${formatNumber(DEALS)}+`, label: 'sales and lettings closed by our advisers' },
  { value: `${YEARS}`, label: 'combined years of Dubai market experience' },
  { value: `${LANGUAGES}`, label: 'languages spoken across the team' },
  { value: '4.9', label: 'average Google rating from 312 reviews' },
]

const VALUES = [
  { icon: Eye, title: 'Clarity', body: 'Every fee explained before you commit, every number sourced. We would rather lose a deal than surprise a client at transfer.' },
  { icon: Scale, title: 'Integrity', body: 'Verified listings with live Trakheesi permits, honest valuations and advice that puts your interests ahead of a quick commission.' },
  { icon: HeartHandshake, title: 'Care', body: 'One adviser who knows your brief, answers WhatsApp after hours and stays in touch long after the keys are handed over.' },
  { icon: Sparkles, title: 'Craft', body: 'Data-led pricing, considered marketing and paperwork done properly — the small details that make a big move feel easy.' },
]

const WHY = [
  { title: 'Data, not hype', body: 'Pricing and yield advice built on DLD transaction data and our own quarterly market research.' },
  { title: 'Specialists by community', body: 'Each adviser focuses on a handful of communities, so they know the buildings, the developers and the service charges.' },
  { title: 'End-to-end service', body: 'Search, negotiation, mortgage introductions, NOC, transfer and property management under one roof.' },
  { title: 'Built for international clients', body: 'Remote viewings, power-of-attorney sales and Golden Visa guidance for buyers who are not yet in Dubai.' },
]

const LICENCES = [
  { icon: Landmark, label: 'RERA Office Registration No. (ORN)', value: '[placeholder]' },
  { icon: BadgeCheck, label: 'Dubai trade licence', value: '[Trade Licence No.]' },
  { icon: ShieldCheck, label: 'Advertising', value: 'Trakheesi permit on every listing' },
  { icon: BadgeCheck, label: 'Agents', value: 'RERA BRN shown on every profile' },
]

export function AboutScreen() {
  return (
    <Screen variant="pushed" title="About us">
      {/* Hero (photo + brand overlay) */}
      <View style={{ height: 300, justifyContent: 'flex-end' }}>
        <Img src={IMG.marina} style={StyleSheet.absoluteFill} />
        <LinearGradient
          colors={['rgba(56,26,76,0.88)', 'rgba(86,61,150,0.6)', 'rgba(39,91,168,0.3)']}
          start={{ x: 0, y: 0.6 }}
          end={{ x: 1, y: 0 }}
          style={StyleSheet.absoluteFill}
        />
        <View style={{ paddingHorizontal: GUTTER, paddingBottom: 30 }}>
          <Heading size={42} color="white" accessibilityRole="header">
            About Apex Aora
          </Heading>
          <Text size={15.5} color="white" lineHeight={24} style={{ marginTop: 10, opacity: 0.85 }}>
            A Dubai brokerage built on clear data, licensed advisers and no surprises at transfer.
          </Text>
        </View>
      </View>

      {/* Story */}
      <Container style={{ paddingTop: 40 }}>
        <Eyebrow>Our story</Eyebrow>
        <Heading size={34} style={{ marginTop: 6 }}>
          We started Apex Aora to make buying in Dubai feel straightforward.
        </Heading>
        <Text size={15.5} color="muted" lineHeight={25} style={{ marginTop: 16 }}>
          Our founders spent years watching clients arrive at the trustee office surprised by fees nobody had mentioned, or holding listings that had been sold weeks earlier.
          Apex Aora was set up in Dubai Marina to do the opposite: show the real numbers, verify every listing and keep one adviser with the client from first viewing to
          final transfer.
        </Text>
        <Text size={15.5} color="muted" lineHeight={25} style={{ marginTop: 14 }}>
          Today our team of RERA-certified advisers covers sales, leasing, off-plan and property management across Dubai’s leading freehold communities — from Marina
          apartments to Palm Jumeirah villas — for owner-occupiers, investors and families relocating from abroad.
        </Text>
        <Img src={IMG.living} style={styles.storyImg} accessibilityLabel="Apex Aora client lounge" />
      </Container>

      {/* Numbers */}
      <View style={styles.numbers} accessibilityLabel="Apex Aora in numbers">
        {NUMBERS.map((s) => (
          <View key={s.label} style={{ width: '50%', paddingRight: 12, paddingVertical: 14 }}>
            <Heading size={46} lineHeight={48}>
              {s.value}
            </Heading>
            <Text size={13.5} lineHeight={19} style={{ marginTop: 6, opacity: 0.8 }}>
              {s.label}
            </Text>
          </View>
        ))}
      </View>

      {/* Mission & values */}
      <View style={{ paddingTop: 44 }}>
        <Container>
          <SectionHead
            title="Our mission and values"
            sub="To give every client the clarity and confidence to make the right property decision in Dubai — whether it is their first home or their tenth investment."
          />
        </Container>
        <Carousel
          data={VALUES}
          keyOf={(v) => v.title}
          maxWidth={290}
          peek={80}
          render={(v) => (
            <View style={styles.valueCard}>
              <IconCircle>
                <v.icon size={20} color={colors.indigo} strokeWidth={1.6} />
              </IconCircle>
              <Heading size={26} style={{ marginTop: 16 }}>
                {v.title}
              </Heading>
              <Text size={14.5} color="muted" lineHeight={22} style={{ marginTop: 6 }}>
                {v.body}
              </Text>
            </View>
          )}
        />
      </View>

      {/* Why clients choose us */}
      <View style={styles.why}>
        <Container>
          <SectionHead title="Why clients choose us" sub="The things our clients mention most often in their reviews." />
          <Img src={IMG.couple} style={{ aspectRatio: 4 / 3, borderRadius: radius.card }} accessibilityLabel="Clients receiving keys to their new home" />
          <View style={{ marginTop: 18 }}>
            {WHY.map((w, i) => (
              <View key={w.title} style={[styles.whyRow, i > 0 && { borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: colors.line }]}>
                <View style={styles.num}>
                  <Text display weight={600} size={22} color="indigo">
                    {i + 1}
                  </Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Heading size={24}>{w.title}</Heading>
                  <Text size={14.5} color="muted" lineHeight={22} style={{ marginTop: 4 }}>
                    {w.body}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </Container>
      </View>

      {/* Team */}
      <View style={{ paddingTop: 44 }}>
        <Container>
          <SectionHead
            title="Meet the team"
            sub="RERA-certified advisers, each focused on the communities they know best."
          />
        </Container>
        <Carousel data={AGENT_PROFILES} keyOf={(a) => a.id} maxWidth={260} peek={90} render={(a) => <AgentCard agent={a} />} />
        <Container style={{ marginTop: 8 }}>
          <Button title="All agents" variant="outline" iconRight={<ArrowRight size={16} color={colors.plum} />} onPress={() => router.push('/agents')} />
        </Container>
      </View>

      {/* Licences */}
      <Container style={{ paddingTop: 44 }}>
        <View style={styles.licences}>
          <View style={styles.rera}>
            <Text size={12} weight={700} color="plum" tracking={0.04}>
              RERA
            </Text>
          </View>
          <Heading size={32} style={{ marginTop: 14 }}>
            Licences & compliance
          </Heading>
          <Text size={15} color="muted" lineHeight={23} style={{ marginTop: 8 }}>
            Apex Aora Real Estate LLC is licensed by the Dubai Land Department and regulated by the Real Estate Regulatory Agency (RERA).
          </Text>
          <View style={{ gap: 10, marginTop: 18 }}>
            {LICENCES.map((r) => (
              <View key={r.label} style={styles.licence}>
                <r.icon size={20} color={colors.aura} strokeWidth={1.8} style={{ marginTop: 2 }} />
                <View style={{ flex: 1 }}>
                  <Text size={12.5} color="muted">
                    {r.label}
                  </Text>
                  <Text size={15} weight={600} color="plum">
                    {r.value}
                  </Text>
                </View>
              </View>
            ))}
          </View>
          <Text size={13} color="muted" lineHeight={20} style={{ marginTop: 14 }}>
            Agent BRNs and listing permits can be verified on the Dubai Land Department website or the Dubai REST app. Client deposits are handled in line with RERA rules,
            and off-plan payments always go to the project’s DLD-registered escrow account.
          </Text>
        </View>
      </Container>

      {/* Office */}
      <Container style={{ paddingTop: 44 }}>
        <SectionHead title="Visit our office" sub="Drop in for a coffee and a market briefing — or book a time so your adviser is free." />
        <OfficeCard />
      </Container>

      <CtaBand
        style={{ marginTop: 44 }}
        title="Let’s talk about your next move"
        body="Buying, selling, renting or investing — tell us what you have in mind and the right adviser will be in touch."
      >
        <Button title="Contact us" variant="white" size="lg" full iconRight={<ArrowRight size={16} color={colors.plum} />} onPress={() => router.push('/contact')} />
        <Button variant="outline" size="lg" full onPress={() => router.push('/sell/valuation')} style={{ borderColor: 'rgba(255,255,255,0.35)' }} accessibilityLabel="Free valuation">
          <Text size={15.5} weight={600} color="white">
            Free valuation
          </Text>
        </Button>
      </CtaBand>
    </Screen>
  )
}

const styles = StyleSheet.create({
  storyImg: { aspectRatio: 4 / 3, borderRadius: radius.panel, marginTop: 24, backgroundColor: colors.mist },
  numbers: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 40,
    paddingHorizontal: GUTTER,
    paddingVertical: 20,
    backgroundColor: colors.white,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: colors.line,
  },
  valueCard: { backgroundColor: colors.white, borderRadius: radius.card, padding: 22, minHeight: 250, ...shadow.soft },
  why: { marginTop: 44, paddingVertical: 44, backgroundColor: colors.white, borderTopWidth: StyleSheet.hairlineWidth, borderBottomWidth: StyleSheet.hairlineWidth, borderColor: colors.line },
  whyRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 16, paddingVertical: 18 },
  num: { width: 46, height: 46, borderRadius: 23, backgroundColor: colors.mist, alignItems: 'center', justifyContent: 'center' },
  licences: { backgroundColor: colors.white, borderRadius: radius.panel, borderWidth: 1, borderColor: colors.line, padding: 22 },
  rera: { alignSelf: 'flex-start', backgroundColor: colors.mist, borderRadius: 6, paddingHorizontal: 10, paddingVertical: 4 },
  licence: { flexDirection: 'row', gap: 12, backgroundColor: colors.mist, borderRadius: radius.card, padding: 14 },
})
