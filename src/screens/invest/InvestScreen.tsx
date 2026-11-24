import { router } from 'expo-router'
import { BadgePercent, Building, CalendarClock, Hammer, IdCard, KeyRound, Landmark, Plane, ShieldCheck, Users } from 'lucide-react-native'
import { View } from 'react-native'

import { IMG } from '@/assets/images'
import { YieldBarChart } from '@/screens/calculators/CommunityYields'
import {
  AdviserBand,
  Carousel,
  DarkOutlineButton,
  FaqSection,
  IconCard,
  PhotoHero,
  pageStyles,
  StepCard,
  useCardWidth,
} from '@/screens/calculators/page'
import { RoiCalculator } from '@/screens/calculators/RoiCalculator'
import { Button } from '@/ui/Button'
import { Container, Section, SectionHead } from '@/ui/primitives'
import { Screen } from '@/ui/Screen'
import { Text } from '@/ui/Text'

const WHY = [
  { icon: BadgePercent, title: 'No annual property tax', body: 'Dubai does not levy an annual property tax on residential owners. Owners pay service charges and a housing fee through DEWA instead.' },
  { icon: Landmark, title: 'No capital gains tax for individuals', body: 'At the time of writing, individuals pay no personal income or capital gains tax on property. Corporate structures follow UAE corporate tax rules.' },
  { icon: ShieldCheck, title: 'Freehold for foreign buyers', body: 'Foreign nationals can own freehold property outright in designated areas such as Dubai Marina, Downtown, Business Bay and JVC.' },
  { icon: Users, title: 'Deep rental demand', body: 'A growing population and record leasing activity have kept occupancy high in established communities, according to recent market reports.' },
]

const STRATEGIES = [
  {
    icon: KeyRound,
    title: 'Ready rental',
    body: 'Buy a completed home and let it on an annual lease from day one.',
    points: ['Income starts immediately', 'You can inspect what you buy', 'Mortgage-friendly'],
    label: 'Ready homes for sale',
    go: () => router.push({ pathname: '/search', params: { kind: 'sale', completion: 'ready' } }),
  },
  {
    icon: Hammer,
    title: 'Off-plan',
    body: 'Buy from the developer during construction, paying in instalments.',
    points: ['Staged payment plans', 'Lower entry price at launch', 'No rent until handover; delivery risk'],
    label: 'Off-plan projects',
    go: () => router.push({ pathname: '/search', params: { kind: 'offplan' } }),
  },
  {
    icon: Plane,
    title: 'Short-let / holiday homes',
    body: 'Let furnished by the night in high-demand tourist areas.',
    points: ['Higher potential gross income', 'Needs a DTCM holiday-home permit', 'More running costs and seasonality'],
    label: 'Compare short vs long let',
    go: () => router.push('/invest/yield-guide'),
  },
  {
    icon: IdCard,
    title: 'Golden Visa',
    body: 'Property worth AED 2M or more can support a 10-year residence visa.',
    points: ['Units can typically be combined', 'Family sponsorship', 'Subject to current ICP/GDRFA rules'],
    label: 'Golden Visa guide',
    go: () => router.push('/invest/golden-visa'),
  },
]

const STEPS = [
  { icon: CalendarClock, title: 'Portfolio review', body: 'We agree your budget, target yield, timeline and whether you will use finance.' },
  { icon: Building, title: 'Shortlist', body: 'You receive a data-backed shortlist with rents, service charges and recent DLD transactions.' },
  { icon: ShieldCheck, title: 'Offer & due diligence', body: 'We negotiate, check the title, developer NOC and service-charge history, and sign Form F.' },
  { icon: Landmark, title: 'Transfer at DLD', body: 'Payment and transfer through a trustee office; the title deed is issued in your name.' },
  { icon: KeyRound, title: 'Let & manage', body: 'Tenant search, Ejari registration, maintenance and reporting, if you want us to handle it.' },
]

const FAQ = [
  {
    q: 'Can foreigners buy property in Dubai?',
    a: 'Yes. Foreign nationals can buy freehold property in designated areas, which cover most of the communities popular with investors. You do not need UAE residency to buy.',
  },
  {
    q: 'What yields can I expect?',
    a: 'Gross yields in the communities we track range from roughly 5% to 7%, according to our data pack. Net yields are lower after service charges, vacancy and management. Returns are not guaranteed and vary by building and unit.',
  },
  {
    q: 'What are the costs of buying?',
    a: 'Budget around 7–8% on top of the price for a resale home: the 4% DLD transfer fee, trustee and title deed fees, and typically 2% + VAT agency commission. Use our DLD fees calculator for an itemised figure.',
  },
  {
    q: 'Do I pay tax on rental income?',
    a: 'At the time of writing, individuals in the UAE do not pay personal income tax on rental income. You may still owe tax in your home country; take advice from a tax professional.',
  },
  {
    q: 'Can I manage a rental from abroad?',
    a: 'Yes. Many of our investors live overseas. A property manager can handle tenant search, Ejari, rent collection and maintenance, typically for a percentage of the annual rent.',
  },
]

export function InvestScreen() {
  const cardW = useCardWidth()
  return (
    <Screen variant="bare">
      <PhotoHero
        image={IMG.businessBay}
        eyebrow="Invest"
        title="Invest in Dubai property"
        sub="Yield-led advice on ready, off-plan and holiday-home investments, with clear numbers on costs, returns and residency."
      >
        <Button variant="white" size="lg" full title="Calculate your yield" onPress={() => router.push('/tools/roi')} />
        <DarkOutlineButton title="Golden Visa guide" onPress={() => router.push('/invest/golden-visa')} style={{ alignSelf: 'stretch' }} />
      </PhotoHero>

      {/* Why Dubai */}
      <Section>
        <Container>
          <SectionHead title="Why investors choose Dubai" sub="A tax-light, freehold market with strong tenant demand. Here is what that means in practice, at the time of writing." />
        </Container>
        <Carousel data={WHY} keyOf={(w) => w.title} itemWidth={cardW} render={(w) => <IconCard icon={w.icon} title={w.title} body={w.body} style={{ flex: 1 }} />} />
        <Container>
          <Text size={12} color="muted" style={{ marginTop: 16 }}>
            General information, not tax advice. Rules can change; check your own position with a qualified adviser.
          </Text>
        </Container>
      </Section>

      {/* Yield snapshot */}
      <Section tone="white" style={pageStyles.bordered}>
        <Container>
          <SectionHead
            title="Yield snapshot"
            sub="Gross rental yields in the communities we cover. Mid-market areas such as JVC tend to yield more; prime waterfront areas trade yield for capital value and demand."
          />
          <YieldBarChart tone="paper" />
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 20 }}>
            <Button title="Read the yield guide" onPress={() => router.push('/invest/yield-guide')} />
            <Button title="All community guides" variant="outline" onPress={() => router.push('/communities')} />
          </View>
        </Container>
      </Section>

      {/* Strategies */}
      <Section>
        <Container>
          <SectionHead title="Investment strategies" sub="Four common routes into the market. Most portfolios end up mixing two or more." />
        </Container>
        <Carousel
          data={STRATEGIES}
          keyOf={(s) => s.title}
          itemWidth={cardW}
          render={(s) => <IconCard icon={s.icon} title={s.title} body={s.body} points={s.points} link={s.label} onPress={s.go} style={{ flex: 1 }} />}
        />
        <Container>
          <Text size={12} color="muted" style={{ marginTop: 16 }}>
            Short-let / holiday homes need a DTCM holiday-home permit; rules change from time to time.
          </Text>
        </Container>
      </Section>

      {/* ROI */}
      <Section tone="white" style={pageStyles.bordered}>
        <Container>
          <SectionHead
            title="Check a deal in seconds"
            sub="Enter a price and expected rent for a quick gross and net yield. The full calculator adds mortgage, vacancy and management costs."
          />
          <RoiCalculator compact />
        </Container>
      </Section>

      {/* Process */}
      <Section>
        <Container>
          <SectionHead title="How we work with investors" sub="One licensed adviser from the first call to the first rent cheque." />
        </Container>
        <Carousel data={STEPS} keyOf={(s) => s.title} itemWidth={Math.round(cardW * 0.82)} render={(s, i) => <StepCard index={i} icon={s.icon} title={s.title} body={s.body} style={{ flex: 1 }} />} />
      </Section>

      <FaqSection tone="white" title="Investor questions" sub="General guidance only. Your adviser will walk you through the details for your situation." items={FAQ} />

      <AdviserBand
        title="Book a portfolio review"
        sub="A 30-minute call with an investment adviser: your budget, target yield and the communities that fit, with no obligation."
        submitLabel="Book my review"
        topic={['Ready rental', 'Off-plan', 'Holiday home', 'Golden Visa', 'Not sure yet']}
      />
    </Screen>
  )
}
