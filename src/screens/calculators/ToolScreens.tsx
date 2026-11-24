import { router, useLocalSearchParams } from 'expo-router'
import { Building2, Home, KeyRound, Landmark, MessageCircle, Phone, User, UserCheck } from 'lucide-react-native'
import { StyleSheet, View } from 'react-native'

import { WHATSAPP_NUMBER } from '@/lib/constants'
import { colors, radius, shadow } from '@/theme'
import { call, whatsapp } from '@/ui/brand'
import { Button } from '@/ui/Button'
import { Container, Section, SectionHead } from '@/ui/primitives'
import { Screen } from '@/ui/Screen'
import { Heading, Text } from '@/ui/Text'
import { CommunityYieldTable } from './CommunityYields'
import { DldFeesCalculator } from './DldFeesCalculator'
import { MortgageCalculator } from './MortgageCalculator'
import { ArrowLink, DarkOutlineButton, FactsGrid, FaqSection, GradientBand, IconCard, MoreCalculators, NumberedRows, PageIntro, pageStyles, ToolCard, TOOLS } from './page'
import { RentVsBuyCalculator } from './RentVsBuyCalculator'
import { RoiCalculator } from './RoiCalculator'
import { numParam } from './ui'

/* ================================================================== */
/*  Tools tab                                                          */
/* ================================================================== */

const TIPS = [
  { title: 'Start with the total cost', body: 'In Dubai, buying fees typically add 7–8% on top of the price for a resale home. Budget for them before you make an offer.' },
  { title: 'Use realistic rents', body: 'Check recent leases in the same building, not the asking rents on portals. Our community guides list indicative averages.' },
  { title: 'Stress-test the rate', body: 'Most UAE mortgages are fixed for 1–5 years, then float. Try a rate 1–2 points higher to see how your payment changes.' },
  { title: 'Treat results as a guide', body: 'Every calculator is indicative. Fees, lending rules and visa criteria change, so confirm the final numbers before you commit.' },
]

export function ToolsScreen() {
  return (
    <Screen variant="tab">
      <View style={{ paddingTop: 24 }}>
        <PageIntro
          eyebrow="Tools"
          title="Property tools & calculators"
          sub="Work out repayments, buying fees, rental yield and whether to rent or buy, with figures based on current Dubai fee rules."
        />
      </View>

      <Section style={{ paddingTop: 8 }}>
        <Container>
          <SectionHead title="Choose a calculator" sub="Every tool recalculates as you type. Inputs are in AED; results follow the currency you pick in the header." />
          <View style={pageStyles.stack}>
            {TOOLS.map((t) => (
              <ToolCard key={t.to} tool={t} />
            ))}
          </View>
        </Container>
      </Section>

      <Section tone="white" style={pageStyles.bordered}>
        <Container>
          <SectionHead title="How to use these numbers" sub="Calculators are a starting point for a conversation, not a final answer. Here is how our advisers suggest reading them." />
          <NumberedRows items={TIPS} />
        </Container>
      </Section>

      <Container style={{ paddingTop: 40 }}>
        <GradientBand>
          <Heading size={34} color="white">
            Talk to an adviser
          </Heading>
          <Text size={15.5} color="white" lineHeight={24} style={{ marginTop: 10, opacity: 0.82 }}>
            Numbers look right? An adviser can confirm fees, lending terms and rents for the exact home you are considering.
          </Text>
          <View style={{ gap: 10, marginTop: 22 }}>
            <Button variant="white" size="lg" full title="Talk to an adviser" icon={<MessageCircle size={16} color={colors.plum} />} onPress={() => router.push('/contact')} />
            <View style={{ flexDirection: 'row', gap: 10 }}>
              <DarkOutlineButton title="Call us" icon={<Phone size={16} color={colors.white} />} onPress={() => call()} style={{ flex: 1 }} />
              <Button
                variant="whatsapp"
                size="lg"
                title="WhatsApp"
                style={{ flex: 1 }}
                onPress={() => whatsapp(WHATSAPP_NUMBER, 'Hello Apex Aora, I have a question about buying costs.')}
              />
            </View>
          </View>
        </GradientBand>
      </Container>

      <Section>
        <Container>
          <SectionHead title="Investing rather than buying to live?" sub="See which communities have the strongest gross yields and how to read them." />
          <View style={{ flexDirection: 'row', gap: 10, flexWrap: 'wrap' }}>
            <Button variant="outline" title="Rental yield guide" onPress={() => router.push('/invest/yield-guide')} />
            <Button variant="plum" title="Invest in Dubai" onPress={() => router.push('/invest')} />
          </View>
        </Container>
      </Section>
    </Screen>
  )
}

/* ================================================================== */
/*  Mortgage                                                           */
/* ================================================================== */

const MORTGAGE_FACTS = [
  { value: '20%', label: 'Typical minimum down payment for expats on a first home under AED 5M' },
  { value: '15%', label: 'Typical minimum for UAE nationals on a first home under AED 5M' },
  { value: '25 yrs', label: 'Usual maximum mortgage term, often capped by age at the end of the loan' },
  { value: '0.25%', label: 'DLD mortgage registration fee on the loan amount, plus AED 290' },
]

const MORTGAGE_FAQ = [
  {
    q: 'Can non-residents get a mortgage in Dubai?',
    a: 'Yes, several UAE banks lend to non-residents, typically with a larger down payment (often 25–40%), stricter income checks and a shorter list of eligible properties. Terms vary widely between banks.',
  },
  {
    q: 'Fixed or variable rate?',
    a: 'Most UAE mortgages start with a fixed rate for 1–5 years, then move to a variable rate linked to EIBOR plus a margin. Check the follow-on rate and early-settlement fees, not just the introductory rate.',
  },
  {
    q: 'What does pre-approval give me?',
    a: 'A pre-approval (in-principle approval) confirms how much a bank is willing to lend based on your income and liabilities. It is usually valid for 60–90 days and makes your offer stronger with sellers.',
  },
  {
    q: 'Can I get a mortgage on an off-plan property?',
    a: 'Some banks finance off-plan purchases from approved developers, usually only once construction reaches a certain stage, and with a higher down payment. Many buyers use the developer payment plan instead.',
  },
  {
    q: 'How much can I borrow?',
    a: 'UAE Central Bank rules typically cap total monthly debt repayments at 50% of your monthly income, and banks apply their own affordability checks on top.',
  },
]

export function MortgageScreen() {
  const price = numParam(useLocalSearchParams<{ price?: string }>().price)
  return (
    <Screen title="Mortgage calculator">
      <PageIntro title="Mortgage calculator" sub="See your monthly repayment, the total cost of the loan and the cash you need on day one, including DLD and bank fees." />
      <Container style={{ paddingBottom: 40 }}>
        <MortgageCalculator key={price ?? 'default'} initialPrice={price} />
      </Container>
      <Section tone="white" style={pageStyles.bordered}>
        <Container>
          <SectionHead title="UAE mortgages at a glance" sub="Typical lending rules at the time of writing. Each bank applies its own criteria on top." />
          <FactsGrid items={MORTGAGE_FACTS} />
        </Container>
      </Section>
      <FaqSection title="Mortgage questions" sub="Short answers to what buyers ask us most. Your adviser will confirm the details for your situation." items={MORTGAGE_FAQ} />
      <MoreCalculators exclude="/tools/mortgage" />
    </Screen>
  )
}

/* ================================================================== */
/*  ROI                                                                */
/* ================================================================== */

const TERMS = [
  { term: 'Gross yield', body: 'Annual rent divided by the purchase price. Quick to compare, but ignores costs.' },
  { term: 'Net yield', body: 'Rent after vacancy, service charge, maintenance and management, divided by price plus buying fees.' },
  { term: 'Cash-on-cash', body: 'With a mortgage: yearly cash flow after loan payments, divided by the cash you actually put in.' },
]

export function RoiScreen() {
  const params = useLocalSearchParams<{ price?: string; rent?: string }>()
  const price = numParam(params.price)
  const rent = numParam(params.rent)
  return (
    <Screen title="Rental ROI calculator">
      <PageIntro title="Rental ROI calculator" sub="Gross and net yield, monthly cash flow and cash-on-cash return for a Dubai rental, with or without a mortgage." />
      <Container style={{ paddingBottom: 40, gap: 14 }}>
        <RoiCalculator key={`${price}-${rent}`} initial={{ price, rent }} />
        <View style={{ gap: 12, marginTop: 10 }}>
          {TERMS.map((t) => (
            <View key={t.term} style={styles.term}>
              <Heading size={24}>{t.term}</Heading>
              <Text size={14.5} color="muted" lineHeight={22} style={{ marginTop: 4 }}>
                {t.body}
              </Text>
            </View>
          ))}
        </View>
      </Container>
      <Section tone="white" style={pageStyles.bordered}>
        <Container>
          <SectionHead
            title="Benchmark: gross yields by community"
            sub="Compare your result with typical gross yields across Dubai. Open a community guide for rents, schools and commute times."
            style={{ marginBottom: 4 }}
          />
          <ArrowLink label="Rental yield guide" href="/invest/yield-guide" />
          <View style={{ marginTop: 12 }}>
            <CommunityYieldTable />
          </View>
        </Container>
      </Section>
      <MoreCalculators exclude="/tools/roi" />
    </Screen>
  )
}

/* ================================================================== */
/*  DLD fees                                                           */
/* ================================================================== */

const PAYERS = [
  {
    icon: User,
    who: 'Buyer',
    items: [
      'DLD transfer fee of 4% (by market practice; the contract can say otherwise)',
      'Title deed issuance and small DLD admin fees',
      'Trustee office fee + VAT on a ready transfer',
      'Buyer agency commission, typically 2% + VAT',
      'Mortgage registration, bank valuation and arrangement fees if financing',
    ],
  },
  {
    icon: UserCheck,
    who: 'Seller',
    items: [
      'Seller agency commission, typically 2% + VAT',
      'Developer NOC fee (usually AED 500–5,000 + VAT)',
      'Clearing any outstanding service charges before transfer',
      'Settling their own mortgage, if the property is financed',
    ],
  },
  {
    icon: Building2,
    who: 'Developer (off-plan)',
    items: ['Collects the 4% Oqood registration and passes it to DLD', 'Sometimes waives all or part of the DLD fee as a launch offer', 'Issues the title deed through DLD at handover'],
  },
  {
    icon: Landmark,
    who: 'Dubai Land Department',
    items: ['Receives the transfer / Oqood and mortgage registration fees', 'Registers the sale through an approved trustee office', 'Issues the electronic title deed in the buyer’s name'],
  },
]

const DLD_FAQ = [
  {
    q: 'Is the 4% DLD fee split between buyer and seller?',
    a: 'Legally it can be agreed either way, but in the Dubai market the buyer typically pays the full 4%. Make sure it is stated clearly in the Form F (MOU).',
  },
  {
    q: 'Why is the trustee fee different for cheaper homes?',
    a: 'Trustee offices typically charge AED 2,000 + VAT for properties under AED 500,000 and AED 4,000 + VAT for properties at or above that price.',
  },
  {
    q: 'Do I pay agency commission on off-plan?',
    a: 'Usually not. When you buy off-plan directly from a developer, the developer typically pays the agency. On a resale of an off-plan unit (assignment), buyer commission normally applies.',
  },
  {
    q: 'Can buying fees be financed by the mortgage?',
    a: 'Generally no. Banks lend against the property value, so DLD, trustee and agency fees are usually paid in cash on top of your down payment.',
  },
]

export function DldFeesScreen() {
  const price = numParam(useLocalSearchParams<{ price?: string }>().price)
  return (
    <Screen title="DLD fees">
      <PageIntro title="DLD & buying fees calculator" sub="An itemised view of the one-off costs on a Dubai purchase: DLD transfer, trustee, title deed, agency and mortgage fees." />
      <Container style={{ paddingBottom: 40 }}>
        <DldFeesCalculator key={price ?? 'default'} initialPrice={price} />
      </Container>
      <Section tone="white" style={pageStyles.bordered}>
        <Container>
          <SectionHead title="Who pays what" sub="Typical split on a Dubai sale at the time of writing. The sale agreement (Form F) sets the final terms." />
          <View style={pageStyles.stack}>
            {PAYERS.map((p) => (
              <IconCard key={p.who} icon={p.icon} title={p.who} body="" points={p.items} tone="paper" />
            ))}
          </View>
        </Container>
      </Section>
      <FaqSection title="Fee questions" sub="Ask your adviser to confirm the exact amounts for your transaction." items={DLD_FAQ} />
      <MoreCalculators exclude="/tools/dld-fees" />
    </Screen>
  )
}

/* ================================================================== */
/*  Rent vs buy                                                        */
/* ================================================================== */

const ASSUMPTIONS = [
  'Buying fees (DLD 4%, trustee, title deed, agency 2% + VAT, mortgage registration, valuation and arrangement fees) are paid upfront in cash.',
  'The mortgage is a 25-year capital-and-interest loan at a constant rate. In practice, rates are usually fixed for a few years, then variable.',
  'Your upfront cash would otherwise earn the "return on cash" rate, compounded yearly. That lost return counts as a cost of buying.',
  'On sale, you pay a 2% + VAT agency fee and repay the remaining loan; the rest is your equity.',
  'Service charges and upkeep rise with the price growth rate. Rent rises by the rent increase rate (Dubai increases follow the RERA rental index).',
  'Tax, moving costs, furnishing, rental deposits and agency fees on renewing a lease are not included.',
]

export function RentVsBuyScreen() {
  const params = useLocalSearchParams<{ price?: string; rent?: string }>()
  const price = numParam(params.price)
  const rent = numParam(params.rent)
  return (
    <Screen title="Rent vs buy">
      <PageIntro title="Rent vs buy calculator" sub="Compare what you would spend renting with the net cost of owning, after the equity you build and what you get back on sale." />
      <Container style={{ paddingBottom: 40 }}>
        <RentVsBuyCalculator key={`${price}-${rent}`} initial={{ price, rent }} />
      </Container>
      <Section tone="white" style={pageStyles.bordered}>
        <Container>
          <SectionHead title="The assumptions behind it" sub="A simple model, so you can see what drives the answer. Change any input and the verdict updates." />
          <NumberedRows items={ASSUMPTIONS.map((body) => ({ body }))} />
          <View style={{ gap: 12, marginTop: 24 }}>
            <View style={styles.choice}>
              <Home size={20} color={colors.indigo} strokeWidth={1.6} />
              <Text size={16} weight={600} color="plum" style={{ marginTop: 10 }}>
                Ready to buy?
              </Text>
              <Text size={14} color="muted" style={{ marginTop: 2 }}>
                Browse homes for sale across Dubai.
              </Text>
              <Button title="Homes for sale" size="sm" style={{ marginTop: 14, minHeight: 44 }} onPress={() => router.push({ pathname: '/search', params: { kind: 'sale' } })} />
            </View>
            <View style={styles.choice}>
              <KeyRound size={20} color={colors.indigo} strokeWidth={1.6} />
              <Text size={16} weight={600} color="plum" style={{ marginTop: 10 }}>
                Staying flexible?
              </Text>
              <Text size={14} color="muted" style={{ marginTop: 2 }}>
                See verified rentals with clear fees.
              </Text>
              <Button title="Homes for rent" size="sm" variant="outline" style={{ marginTop: 14, minHeight: 44 }} onPress={() => router.push({ pathname: '/search', params: { kind: 'rent' } })} />
            </View>
          </View>
        </Container>
      </Section>
      <MoreCalculators exclude="/tools/rent-vs-buy" />
    </Screen>
  )
}

const styles = StyleSheet.create({
  term: { backgroundColor: colors.white, borderRadius: radius.card, padding: 20, ...shadow.soft },
  choice: { backgroundColor: colors.paper, borderRadius: radius.card, padding: 20, borderWidth: StyleSheet.hairlineWidth, borderColor: colors.line },
})
