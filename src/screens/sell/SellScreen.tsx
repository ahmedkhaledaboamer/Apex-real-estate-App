import { router } from 'expo-router'
import { ArrowRight, BadgeCheck, Camera, Globe2, Handshake, LineChart, ShieldCheck, Users } from 'lucide-react-native'
import { StyleSheet, View } from 'react-native'

import { IMG } from '@/assets/images'
import { useCurrency } from '@/features/favorites/hooks'
import { AGENCY_COMMISSION, VAT, WHATSAPP_NUMBER } from '@/lib/constants'
import { formatNumber, formatPrice } from '@/lib/format'
import { AGENT_PROFILES } from '@/mocks/agents'
import { Carousel, FactsGrid, FaqSection, GradientBand, IconCard, IconRows, PhotoHero, pageStyles, useCardWidth } from '@/screens/calculators/page'
import { colors, radius, shadow } from '@/theme'
import { whatsapp } from '@/ui/brand'
import { Button } from '@/ui/Button'
import { WhatsAppIcon } from '@/ui/icons'
import { Img } from '@/ui/Img'
import { LeadForm } from '@/ui/LeadForm'
import { Container, Section, SectionHead } from '@/ui/primitives'
import { Screen } from '@/ui/Screen'
import { Heading, Text } from '@/ui/Text'
import { ProcessTimeline, TestimonialCarousel, type ProcessStep } from './parts'

const DEALS = AGENT_PROFILES.reduce((n, a) => n + a.dealsClosed, 0)

const STATS = [
  { value: `${formatNumber(DEALS)}+`, label: 'homes sold and let by our current team' },
  { value: '4.9', label: 'average Google rating from 312 client reviews' },
  { value: '1 day', label: 'to receive your free, data-backed valuation' },
  { value: '30k+', label: 'registered buyers and investors in our database' },
]

const BENEFITS = [
  { icon: LineChart, title: 'Pricing from real data', body: 'We price from DLD transactions in your building, not wishful asking prices, so your home sells without long price cuts.' },
  { icon: Users, title: 'Buyers before we go live', body: 'Every new listing is matched against our database of qualified buyers and investors in the first 48 hours.' },
  { icon: ShieldCheck, title: 'Fully compliant', body: 'RERA-registered agents, a Trakheesi permit on every advert and every step documented on the official RERA forms.' },
  { icon: Handshake, title: 'One adviser to transfer', body: 'The same agent negotiates, handles the NOC and walks you through the trustee office on transfer day.' },
]

const PROCESS: ProcessStep[] = [
  { title: 'Valuation', meta: 'Day 1', body: 'A RERA-certified agent prepares a valuation from recent DLD transactions and active competition, and agrees a pricing strategy with you.' },
  { title: 'Form A listing agreement', meta: 'Day 1–2', body: 'We sign RERA Form A, the official seller–agent agreement. We check your title deed, passport and, if applicable, your mortgage details.' },
  { title: 'Trakheesi permit & marketing', meta: 'Day 2–5', body: 'We obtain the DLD advertising permit (Trakheesi), shoot professional photography and video, and launch across the portals and our buyer database.' },
  { title: 'Viewings & offers', meta: 'Weeks 1–6', body: 'We pre-qualify buyers, host viewings seven days a week and negotiate every offer in writing, with feedback after each viewing.' },
  { title: 'MOU (Form F) signed', meta: 'Offer accepted', body: 'Buyer and seller sign the Memorandum of Understanding (RERA Form F). The buyer typically pays a 10% security deposit, held by the agency.' },
  { title: 'NOC from the developer', meta: '3–10 days', body: 'We apply for the developer’s No Objection Certificate, confirming there are no outstanding service charges on the property.' },
  {
    title: 'Transfer at the trustee office',
    meta: 'Transfer day',
    body: 'Both parties (or their representatives) attend a Real Estate Registration Trustee office. Funds are exchanged by manager’s cheque and the new title deed is issued.',
  },
]

const MARKETING = [
  { icon: Camera, title: 'Professional photography & video', body: 'Twilight photos, floor plans and a short walkthrough video, included at no extra cost.' },
  { icon: Globe2, title: 'Every major portal', body: 'Premium placement on Property Finder, Bayut and Dubizzle, plus our own website and social channels.' },
  { icon: Users, title: 'Our buyer database', body: 'Direct introductions to pre-qualified buyers, investors and relocating families already on our books.' },
  { icon: BadgeCheck, title: 'Verified listing', body: 'A Trakheesi permit and verified badge, so buyers know your listing is genuine and current.' },
]

const FAQ = [
  {
    q: 'How long does it take to sell a property in Dubai?',
    a: 'Well-priced homes in popular communities typically agree a sale within four to eight weeks. From signed MOU to transfer usually takes two to four weeks for cash buyers, and four to eight weeks where the buyer has a mortgage.',
  },
  {
    q: 'Can I sell a property that is still mortgaged?',
    a: 'Yes. We request a liability letter from your bank and arrange for the buyer’s funds to clear the outstanding mortgage on or before transfer day. The bank then releases the mortgage and the title is transferred.',
  },
  {
    q: 'Can I sell while a tenant is living in the property?',
    a: 'Yes — the tenancy transfers to the new owner and stays valid until it expires. Tenanted homes often appeal to investors. If the buyer wants vacant possession, Dubai law requires 12 months’ notice by notary or registered mail.',
  },
  {
    q: 'Do I need to be in Dubai to sell?',
    a: 'No. You can appoint a representative under a power of attorney (notarised and, if signed abroad, legalised and attested in the UAE). Many of our overseas sellers never need to fly in.',
  },
  {
    q: 'Do I have to sign an exclusive agreement?',
    a: 'Form A can be exclusive or non-exclusive. We recommend a short exclusive period because it lets us invest properly in marketing and keeps one consistent price across the portals.',
  },
  {
    q: 'Who pays the 4% DLD transfer fee?',
    a: 'By market practice the buyer pays the 4% Dubai Land Department transfer fee and the trustee office fee. The seller typically pays the agency fee, the developer NOC fee and any mortgage early-settlement costs.',
  },
]

export function SellScreen() {
  const currency = useCurrency()
  const cardW = useCardWidth()
  const example = 2_000_000
  const fee = example * AGENCY_COMMISSION

  const COSTS = [
    {
      title: 'Agency fee',
      value: `${AGENCY_COMMISSION * 100}% + VAT`,
      body: `Typically 2% of the sale price plus ${VAT * 100}% VAT, paid on transfer. On a ${formatPrice(example, currency)} sale that is ${formatPrice(fee, currency)} + ${formatPrice(fee * VAT, currency)} VAT.`,
    },
    { title: 'Developer NOC fee', value: 'AED 500 – 5,000', body: 'Typically charged by the master developer to issue the No Objection Certificate. Service charges must be paid up to date first.' },
    {
      title: 'Mortgage clearance',
      value: 'If applicable',
      body: 'Your bank may charge an early-settlement fee, typically up to 1% of the outstanding balance (capped at AED 10,000), plus a liability-letter fee.',
    },
    { title: 'What the buyer pays', value: '4% DLD', body: 'The 4% DLD transfer fee, title deed and trustee office fees are typically paid by the buyer, by market practice.' },
  ]

  return (
    <Screen variant="bare">
      <PhotoHero image={IMG.balcony} eyebrow="Sell" title="Sell your Dubai property" sub="Data-backed pricing, professional marketing and one licensed adviser from valuation to transfer day.">
        <Button variant="white" size="lg" full title="Get a free valuation" iconRight={<ArrowRight size={16} color={colors.plum} />} onPress={() => router.push('/sell/valuation')} />
        <Button
          variant="whatsapp"
          size="lg"
          full
          title="Talk to a sales adviser"
          icon={<WhatsAppIcon size={16} />}
          onPress={() => whatsapp(WHATSAPP_NUMBER, 'Hi Apex Aura, I am thinking of selling my property.')}
        />
      </PhotoHero>

      {/* Numbers */}
      <View style={[styles.numbers, pageStyles.bordered]} accessibilityLabel="Apex Aura in numbers">
        <Container>
          <FactsGrid items={STATS} />
        </Container>
      </View>

      {/* Why sell with us */}
      <Section>
        <Container>
          <SectionHead title="Why sell with Apex Aura" sub="You get an honest price, serious buyers and a team that handles the paperwork so you don’t have to." />
        </Container>
        <Carousel data={BENEFITS} keyOf={(b) => b.title} itemWidth={cardW} render={(b) => <IconCard icon={b.icon} title={b.title} body={b.body} serif={false} style={{ flex: 1 }} />} />
      </Section>

      {/* Process */}
      <Section tone="white" style={pageStyles.bordered}>
        <Container>
          <SectionHead title="How selling works" sub="Seven clear steps from first valuation to the new title deed. Most sales complete within two to three months of listing." />
          <Img src={IMG.living} style={styles.photo} accessibilityLabel="Bright living room staged for sale" />
          <View style={{ marginTop: 28 }}>
            <ProcessTimeline steps={PROCESS} />
          </View>
          <Button title="Start with a free valuation" size="lg" full style={{ marginTop: 28 }} onPress={() => router.push('/sell/valuation')} />
        </Container>
      </Section>

      {/* Costs */}
      <Section>
        <Container>
          <SectionHead title="What sellers pay" sub="No hidden extras. These are the typical costs on a Dubai resale — we confirm exact figures for your property up front." />
        </Container>
        <Carousel
          data={COSTS}
          keyOf={(c) => c.title}
          itemWidth={cardW}
          render={(c) => (
            <View style={styles.cost}>
              <Text size={13} weight={600} color="muted">
                {c.title}
              </Text>
              <Text size={24} weight={700} color="plum" style={{ marginTop: 4 }}>
                {c.value}
              </Text>
              <Text size={14} color="muted" lineHeight={21} style={{ marginTop: 10 }}>
                {c.body}
              </Text>
            </View>
          )}
        />
        <Container>
          <Text size={12} color="muted" lineHeight={18} style={{ marginTop: 16 }}>
            Indicative only. Fees vary by developer, bank and agreement; your Form A sets out the agreed agency fee. Not tax or legal advice.
          </Text>
        </Container>
      </Section>

      {/* Marketing */}
      <Section tone="white" style={pageStyles.bordered}>
        <Container>
          <Img src={IMG.pool} style={[styles.photo, { borderRadius: radius.panel, marginBottom: 28 }]} accessibilityLabel="Pool deck photographed for a listing" />
          <SectionHead title="Marketing that reaches real buyers" />
          <IconRows items={MARKETING} />
        </Container>
      </Section>

      {/* Testimonials */}
      <Section>
        <Container>
          <SectionHead title="What our clients say" sub="4.9 out of 5 from 312 Google reviews." />
        </Container>
        <TestimonialCarousel />
      </Section>

      <FaqSection title="Seller questions" sub="Still unsure about something? Ask your adviser — there is no obligation." items={FAQ} />

      {/* CTA + quick form */}
      <Container style={{ paddingBottom: 24 }}>
        <GradientBand>
          <Heading size={36} color="white">
            Find out what your home is worth
          </Heading>
          <Text size={15.5} color="white" lineHeight={24} style={{ marginTop: 12, opacity: 0.82 }}>
            Leave your details for a quick call back, or use the full valuation form for an instant indicative range.
          </Text>
          <Button variant="white" size="lg" title="Full valuation form" iconRight={<ArrowRight size={16} color={colors.plum} />} style={{ marginTop: 20 }} onPress={() => router.push('/sell/valuation')} />
          <View style={styles.glass}>
            <LeadForm
              type="valuation"
              tone="solid"
              withEmail={false}
              extraFields={[
                { name: 'address', label: 'Property address', kind: 'text', placeholder: 'Building, community', required: true },
                { name: 'propertyType', label: 'Property type', kind: 'select', options: ['Apartment', 'Villa', 'Townhouse', 'Penthouse'] },
              ]}
              submitLabel="Request a call back"
              successText="Thanks — a sales adviser will call or WhatsApp you within one working day."
            />
          </View>
        </GradientBand>
      </Container>
    </Screen>
  )
}

const styles = StyleSheet.create({
  numbers: { backgroundColor: colors.white, paddingVertical: 32 },
  photo: { width: '100%', aspectRatio: 4 / 3, borderRadius: radius.card },
  cost: { flex: 1, backgroundColor: colors.white, borderRadius: radius.card, padding: 22, ...shadow.soft },
  glass: { marginTop: 26, borderRadius: radius.card, borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)', backgroundColor: 'rgba(255,255,255,0.1)', padding: 14 },
})
