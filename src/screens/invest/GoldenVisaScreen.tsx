import { router } from 'expo-router'
import { ArrowRight, Check, ClipboardList, FileText, HeartPulse, House, IdCard, Landmark, RefreshCw, Users } from 'lucide-react-native'
import { StyleSheet, View } from 'react-native'

import { IMG } from '@/assets/images'
import { GOLDEN_VISA_THRESHOLD } from '@/lib/constants'
import { LISTINGS } from '@/mocks/properties'
import { GoldenVisaChecker } from '@/screens/calculators/GoldenVisaChecker'
import { AdviserBand, Carousel, FaqSection, IconCard, IconCircle, PhotoHero, pageStyles, StepCard, useCardWidth } from '@/screens/calculators/page'
import { colors, radius, shadow } from '@/theme'
import { Button } from '@/ui/Button'
import { Container, Section, SectionHead } from '@/ui/primitives'
import { PropertyCard } from '@/ui/PropertyCard'
import { Screen } from '@/ui/Screen'
import { Heading, Text } from '@/ui/Text'

const ELIGIBLE = LISTINGS.filter((l) => l.kind === 'sale' && l.priceAed >= GOLDEN_VISA_THRESHOLD)
  .sort((a, b) => a.priceAed - b.priceAed)
  .slice(0, 3)

const ELIGIBILITY = [
  { title: 'AED 2M+ in property', body: 'The total purchase value of your Dubai property must typically be AED 2 million or more.' },
  { title: 'Units can be combined', body: 'You can usually reach the threshold with more than one property, as long as each is in your name (or jointly owned within the rules).' },
  { title: 'Mortgaged property', body: 'Mortgaged homes can qualify, typically with a bank NOC; in some cases the amount you have paid is what counts.' },
  { title: 'Off-plan property', body: 'Off-plan units can qualify when bought from approved developers and projects, subject to current rules on the amount paid.' },
]

const BENEFITS = [
  { icon: RefreshCw, title: '10-year renewable residence', body: 'Renewable for as long as you keep the qualifying property.' },
  { icon: Users, title: 'Family sponsorship', body: 'Sponsor your spouse and children; parents may be included under current rules.' },
  { icon: House, title: 'No minimum stay', body: 'The visa typically stays valid even if you spend long periods outside the UAE.' },
  { icon: IdCard, title: 'No employer needed', body: 'Live in the UAE independently, without a local sponsor or job.' },
]

const STEPS = [
  { title: 'Confirm the value', body: 'Check that your title deed(s) or Oqood certificates add up to AED 2M or more, and get a bank NOC if mortgaged.' },
  { title: 'Apply through DLD', body: 'Apply for the property-investor Golden Visa through the DLD service (online or at a customer centre), which issues the eligibility nomination.' },
  { title: 'Entry permit & medical', body: 'Once nominated, you receive an entry permit if outside the UAE, then complete the medical fitness test.' },
  { title: 'Emirates ID & visa', body: 'Give biometrics for your Emirates ID; the 10-year residence visa is issued by ICP/GDRFA.' },
]

const DOCS = [
  'Passport copy (valid for at least 6 months)',
  'Recent passport-size photo with a white background',
  'Title deed(s) or Oqood certificate(s) for each property',
  'Bank NOC and statement of amount paid, if mortgaged',
  'Developer statement of payments, if off-plan',
  'Current UAE visa or entry stamp, if inside the UAE',
  'Health insurance valid in the UAE',
  'Marriage / birth certificates (attested) for family members',
]

const FAQ = [
  {
    q: 'How long does the process take?',
    a: 'Many applicants receive their visa within a few weeks, depending on how quickly documents, medical and biometrics are completed. Timelines are set by the authorities and can change.',
  },
  {
    q: 'What does it cost?',
    a: 'Expect government and service fees for the DLD application, entry permit, medical test, Emirates ID and visa issue, plus health insurance. Totals change from time to time; we will give you a current breakdown.',
  },
  {
    q: 'What happens if I sell the property?',
    a: 'The visa is linked to the qualifying investment. If you sell and your remaining holdings fall below the threshold, the visa may be cancelled or not renewed. Check the current rules before selling.',
  },
  {
    q: 'Can I buy jointly with my spouse?',
    a: 'Joint ownership is generally possible, but how the value is attributed between owners depends on the rules at the time. Ask us before you register the purchase so the title is structured correctly.',
  },
  {
    q: 'Is this legal advice?',
    a: 'No. This page is a general guide based on rules at the time of writing. For a definitive answer, check with ICP/GDRFA and DLD, or a licensed immigration adviser.',
  },
]

const seeEligible = () => router.push({ pathname: '/search', params: { kind: 'sale', minPrice: String(GOLDEN_VISA_THRESHOLD) } })

export function GoldenVisaScreen() {
  const cardW = useCardWidth()
  return (
    <Screen variant="bare">
      <PhotoHero
        image={IMG.palm}
        eyebrow="Invest · Golden Visa"
        title="Golden Visa through property"
        sub="Invest AED 2M or more in Dubai property and you may qualify for a renewable 10-year UAE residence visa for you and your family."
      >
        <Button variant="white" size="lg" full title="Homes from AED 2M" onPress={seeEligible} />
      </PhotoHero>

      {/* Eligibility */}
      <Section>
        <Container>
          <SectionHead title="Who is eligible" sub="A summary of the property route at the time of writing. All criteria are subject to current rules set by DLD and ICP/GDRFA." />
          <View style={styles.threshold}>
            <Text size={13} weight={600} color="aura">
              Threshold
            </Text>
            <Heading size={48} style={{ marginTop: 4 }}>
              AED 2M
            </Heading>
            <Text size={14} color="ink" style={{ marginTop: 6, opacity: 0.8 }}>
              Total property value, one or several units.
            </Text>
          </View>
          <View style={[styles.rows, { marginTop: 20 }]}>
            {ELIGIBILITY.map((e, i) => (
              <View key={e.title} style={[styles.row, i > 0 && styles.divider]}>
                <View style={styles.check}>
                  <Check size={16} color={colors.indigo} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text size={16.5} weight={600} color="plum">
                    {e.title}
                  </Text>
                  <Text size={15} color="muted" lineHeight={23} style={{ marginTop: 4 }}>
                    {e.body}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </Container>
      </Section>

      {/* Benefits */}
      <Section tone="white" style={pageStyles.bordered}>
        <Container>
          <SectionHead title="What you get" />
        </Container>
        <Carousel data={BENEFITS} keyOf={(b) => b.title} itemWidth={cardW} render={(b) => <IconCard icon={b.icon} title={b.title} body={b.body} tone="paper" style={{ flex: 1 }} />} />
      </Section>

      {/* Checker */}
      <Section>
        <Container>
          <SectionHead title="Check your eligibility" sub="Answer three questions for an indicative result. It takes less than a minute." />
          <GoldenVisaChecker />
        </Container>
      </Section>

      {/* Steps + documents */}
      <Section tone="white" style={pageStyles.bordered}>
        <Container>
          <SectionHead title="Step by step" sub="The usual sequence for property investors. Our team can coordinate each step for you." />
        </Container>
        <Carousel data={STEPS} keyOf={(s) => s.title} itemWidth={Math.round(cardW * 0.85)} render={(s, i) => <StepCard index={i} title={s.title} body={s.body} tone="paper" style={{ flex: 1 }} />} />
        <Container style={{ marginTop: 24 }}>
          <View style={styles.docs}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              <View style={[styles.docIcon, shadow.soft]}>
                <ClipboardList size={20} color={colors.indigo} strokeWidth={1.6} />
              </View>
              <Heading size={28} style={{ flex: 1 }}>
                Documents checklist
              </Heading>
            </View>
            <View style={{ gap: 12, marginTop: 20 }}>
              {DOCS.map((d) => (
                <View key={d} style={{ flexDirection: 'row', gap: 12 }}>
                  <FileText size={16} color={colors.aura} style={{ marginTop: 3 }} />
                  <Text size={14.5} color="ink" lineHeight={22} style={{ flex: 1, opacity: 0.85 }}>
                    {d}
                  </Text>
                </View>
              ))}
            </View>
            <View style={{ flexDirection: 'row', gap: 8, marginTop: 20 }}>
              <HeartPulse size={14} color={colors.muted} style={{ marginTop: 2 }} />
              <Text size={12} color="muted" lineHeight={18} style={{ flex: 1 }}>
                Requirements vary by nationality and case; the authorities may ask for more.
              </Text>
            </View>
          </View>
        </Container>
      </Section>

      {/* Eligible homes */}
      <Section>
        <Container>
          <SectionHead title="Homes that meet the threshold" sub="A few ready homes priced at AED 2M or more." />
        </Container>
        <Carousel data={ELIGIBLE} keyOf={(l) => l.id} itemWidth={cardW} render={(l) => <PropertyCard listing={l} width={cardW} />} />
        <Container style={{ marginTop: 18 }}>
          <Button variant="outline" title="See eligible homes" iconRight={<ArrowRight size={16} color={colors.plum} />} onPress={seeEligible} />
        </Container>
      </Section>

      <FaqSection
        tone="white"
        title="Golden Visa questions"
        sub="General guidance at the time of writing."
        items={FAQ}
        note={
          <View style={{ flexDirection: 'row', gap: 8, marginBottom: 16 }}>
            <IconCircle icon={Landmark} size={28} />
            <Text size={13} color="muted" style={{ flex: 1, alignSelf: 'center' }}>
              Always confirm current rules with ICP/GDRFA and DLD.
            </Text>
          </View>
        }
      />

      <AdviserBand
        title="Plan your Golden Visa purchase"
        sub="Tell us your budget and timeline. An adviser will shortlist qualifying homes and walk you through the application."
        submitLabel="Request a callback"
        whatsappText="Hello Apex Aura, I would like advice on the Golden Visa through property."
        topic={['Buying to qualify', 'I already own property', 'Combining several units', 'Off-plan purchase']}
      />
    </Screen>
  )
}

const styles = StyleSheet.create({
  threshold: { backgroundColor: colors.mist, borderRadius: radius.card, padding: 22 },
  rows: { borderTopWidth: StyleSheet.hairlineWidth, borderBottomWidth: StyleSheet.hairlineWidth, borderColor: colors.line },
  row: { flexDirection: 'row', gap: 16, paddingVertical: 20 },
  divider: { borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: colors.line },
  check: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.mist, alignItems: 'center', justifyContent: 'center' },
  docs: { backgroundColor: colors.mist, borderRadius: radius.panel, padding: 22 },
  docIcon: { width: 44, height: 44, borderRadius: 22, backgroundColor: colors.white, alignItems: 'center', justifyContent: 'center' },
})
