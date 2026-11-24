import { useState } from 'react'
import { router } from 'expo-router'
import { CalendarRange, Droplets, Receipt, UserCog, Wrench } from 'lucide-react-native'
import { StyleSheet, View } from 'react-native'

import { IMG } from '@/assets/images'
import { roi } from '@/features/calculators/lib'
import { useCurrency } from '@/features/favorites/hooks'
import { formatPrice } from '@/lib/format'
import { CommunityYieldTable } from '@/screens/calculators/CommunityYields'
import { AdviserBand, ArrowLink, IconRows, PhotoHero, pageStyles } from '@/screens/calculators/page'
import { RoiCalculator } from '@/screens/calculators/RoiCalculator'
import { Breakdown, pct } from '@/screens/calculators/ui'
import { colors, radius, shadow } from '@/theme'
import { Segmented } from '@/ui/Segmented'
import { Container, Section, SectionHead } from '@/ui/primitives'
import { Screen } from '@/ui/Screen'
import { Heading, Text } from '@/ui/Text'


const EXAMPLE = {
  price: 1_500_000,
  annualRent: 110_000,
  serviceCharge: 16 * 900,
  maintenancePct: 5,
  vacancyWeeks: 2,
  managementPct: 5,
  mortgage: false,
  downPct: 25,
  rate: 4.25,
  years: 25,
}

const COSTS = [
  {
    icon: Receipt,
    title: 'Service charges',
    body: 'Paid to the owners’ association per sq ft each year, typically around AED 12–25 / sq ft for apartments, more in branded or full-amenity towers. Check RERA’s service-charge index for the building.',
  },
  { icon: Wrench, title: 'Maintenance', body: 'AC servicing, repairs and refreshes between tenants. Budget a few percent of the rent each year; more for older or furnished units.' },
  { icon: CalendarRange, title: 'Vacancy', body: 'Weeks without a tenant between leases. Two to four weeks a year is a common planning assumption in established communities.' },
  { icon: UserCog, title: 'Management & leasing', body: 'Letting fees (often 5% of annual rent from the tenant or owner) and ongoing management, typically 5–8% of the rent.' },
  {
    icon: Droplets,
    title: 'DEWA & chiller',
    body: 'Usually paid by the tenant on long lets, but by the owner on short lets and during vacancy. Some buildings bill chiller (district cooling) separately.',
  },
]

const COMPARE: { label: string; long: string; short: string }[] = [
  { label: 'Income', long: 'Fixed annual rent, often in 1–4 cheques', short: 'Nightly rates; higher potential gross income, varies by season' },
  { label: 'Occupancy', long: 'Typically 11–12 months a year', short: 'Varies with tourism demand, events and season' },
  { label: 'Running costs', long: 'Tenant usually pays DEWA; few owner costs', short: 'Owner pays DEWA, internet, cleaning, linen and platform fees' },
  { label: 'Furnishing', long: 'Often unfurnished', short: 'Fully furnished to holiday-home standards' },
  { label: 'Licensing', long: 'Ejari registration of the lease', short: 'DTCM holiday-home permit (via an operator or as owner), plus Tourism Dirham per night' },
  { label: 'Management', long: 'Light: renewals, maintenance', short: 'Intensive: guests, turnovers, reviews; operators typically charge 15–25%' },
  { label: 'Best for', long: 'Steady, hands-off income', short: 'Prime tourist areas, owners wanting personal use' },
]

export function YieldGuideScreen() {
  const currency = useCurrency()
  const fmt = (n: number) => formatPrice(Math.round(n), currency)
  const ex = roi(EXAMPLE)
  const [letting, setLetting] = useState<'both' | 'long' | 'short'>('both')

  return (
    <Screen variant="bare">
      <PhotoHero
        image={IMG.jvc}
        eyebrow="Invest · Yield guide"
        title="Rental yield guide"
        sub="How to read gross and net yield in Dubai, which costs eat into returns, and how the main communities compare."
      />

      {/* Gross vs net */}
      <Section>
        <Container style={{ gap: 14 }}>
          <SectionHead title="Gross vs net yield" sub="Gross yield is the headline number on listings. Net yield is what you actually keep." />
          <View style={styles.card}>
            <Text size={13} weight={600} color="aura">
              Gross yield
            </Text>
            <View style={styles.formula}>
              <Text size={16} weight={600} color="plum">
                Annual rent ÷ purchase price × 100
              </Text>
            </View>
            <Text size={15} color="muted" lineHeight={23} style={{ marginTop: 14 }}>
              Fast for comparing areas and listings, but it ignores every cost of owning and letting.
            </Text>
          </View>
          <View style={styles.card}>
            <Text size={13} weight={600} color="aura">
              Net yield
            </Text>
            <View style={styles.formula}>
              <Text size={16} weight={600} color="plum">
                (Rent − vacancy − service charge − maintenance − management) ÷ (price + buying fees) × 100
              </Text>
            </View>
            <Text size={15} color="muted" lineHeight={23} style={{ marginTop: 14 }}>
              The better measure of return. In Dubai it is commonly 1.5–2.5 points below the gross figure.
            </Text>
          </View>

          {/* Worked example */}
          <View style={[styles.panel, { marginTop: 10 }]}>
            <View style={{ padding: 20 }}>
              <Text size={13} weight={600} color="aura">
                Worked example
              </Text>
              <Heading size={28} style={{ marginTop: 4 }}>
                A 900 sq ft apartment in a mid-market community
              </Heading>
              <Breakdown
                style={{ marginTop: 18 }}
                rows={[
                  { label: 'Purchase price', value: fmt(EXAMPLE.price) },
                  { label: 'Annual rent', value: fmt(EXAMPLE.annualRent) },
                  { label: 'Vacancy (2 weeks)', value: `−${fmt(ex.vacancyLoss)}` },
                  { label: 'Service charge (AED 16 / sq ft)', value: `−${fmt(ex.serviceCharge)}` },
                  { label: 'Maintenance (5% of rent)', value: `−${fmt(ex.maintenance)}` },
                  { label: 'Management (5% of rent collected)', value: `−${fmt(ex.management)}` },
                  { label: 'Net income', value: fmt(ex.netIncome), strong: true },
                  { label: 'Buying fees (DLD, trustee, agency…)', value: fmt(ex.purchaseCosts) },
                ]}
              />
            </View>
            <View style={styles.panelResults}>
              <View style={{ flexDirection: 'row', gap: 16 }}>
                <View style={{ flex: 1 }}>
                  <Text size={13} weight={600} color="aura">
                    Gross yield
                  </Text>
                  <Text size={32} weight={700} color="plum" lineHeight={40}>
                    {pct(ex.grossYield)}
                  </Text>
                  <Text size={12.5} color="muted">
                    {fmt(EXAMPLE.annualRent)} ÷ {fmt(EXAMPLE.price)}
                  </Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text size={13} weight={600} color="aura">
                    Net yield
                  </Text>
                  <Text size={32} weight={700} color="plum" lineHeight={40}>
                    {pct(ex.netYield)}
                  </Text>
                  <Text size={12.5} color="muted">
                    {fmt(ex.netIncome)} ÷ {fmt(EXAMPLE.price + ex.purchaseCosts)}
                  </Text>
                </View>
              </View>
              <ArrowLink
                label="Try it with your own numbers"
                onPress={() => router.push({ pathname: '/tools/roi', params: { price: String(EXAMPLE.price), rent: String(EXAMPLE.annualRent) } })}
              />
            </View>
          </View>
        </Container>
      </Section>

      {/* Community table */}
      <Section tone="white" style={pageStyles.bordered}>
        <Container>
          <SectionHead
            title="Gross yields by community"
            sub="Sort by yield or price per sq ft. Higher yields usually come with lower entry prices; prime areas trade yield for demand and liquidity."
          />
          <CommunityYieldTable sortable />
        </Container>
      </Section>

      {/* Costs */}
      <Section>
        <Container>
          <SectionHead title="Costs that reduce your yield" sub="The gap between gross and net comes from five main items. Ask for the building’s service-charge history before you buy." />
          <IconRows items={COSTS} serif />
        </Container>
      </Section>

      {/* Long vs short */}
      <Section tone="white" style={pageStyles.bordered}>
        <Container>
          <SectionHead title="Long-term vs short-term letting" sub="Short lets can earn more gross income in the right location, but costs, effort and regulation are higher." />
          <Segmented
            tabs={[
              { key: 'both', label: 'Compare' },
              { key: 'long', label: 'Long-term' },
              { key: 'short', label: 'Short-term' },
            ]}
            value={letting}
            onChange={setLetting}
            style={{ marginBottom: 16 }}
          />
          <View style={styles.compare}>
            {COMPARE.map((r, i) => (
              <View key={r.label} style={[{ padding: 16, gap: 8 }, i > 0 && styles.divider]}>
                <Text size={14.5} weight={600} color="plum">
                  {r.label}
                </Text>
                {letting !== 'short' ? <CompareLine tag="Long-term (annual lease)" text={r.long} showTag={letting === 'both'} /> : null}
                {letting !== 'long' ? <CompareLine tag="Short-term (holiday home)" text={r.short} showTag={letting === 'both'} /> : null}
              </View>
            ))}
          </View>
          <Text size={12} color="muted" lineHeight={18} style={{ marginTop: 14 }}>
            Holiday-home rules (DTCM permits, building approvals, Tourism Dirham) change from time to time; check current requirements with DET/DTCM and your building.
          </Text>
        </Container>
      </Section>

      {/* Calculator */}
      <Section>
        <Container>
          <SectionHead title="Run your own numbers" sub="A quick gross and net yield for any property. Open the full calculator to add a mortgage, vacancy and management." style={{ marginBottom: 4 }} />
          <ArrowLink label="Full ROI calculator" href="/tools/roi" />
          <RoiCalculator compact style={{ marginTop: 12 }} />
        </Container>
      </Section>

      <AdviserBand
        title="Find a higher-yield home"
        sub="Tell us your budget and we will shortlist units with verified rents and service-charge histories, so the net yield holds up."
        submitLabel="Get my shortlist"
        whatsappText="Hello Apex Aora, I am looking for a rental investment."
        topic={['Long-term rental', 'Short-term / holiday home', 'Not sure yet']}
      />
    </Screen>
  )
}

function CompareLine({ tag, text, showTag }: { tag: string; text: string; showTag: boolean }) {
  return (
    <View>
      {showTag ? (
        <Text size={11.5} weight={600} color="aura">
          {tag}
        </Text>
      ) : null}
      <Text size={14.5} color="ink" lineHeight={22} style={{ opacity: 0.85 }}>
        {text}
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  card: { backgroundColor: colors.white, borderRadius: radius.card, padding: 20, ...shadow.soft },
  formula: { marginTop: 12, backgroundColor: colors.mist, borderRadius: radius.md, paddingHorizontal: 16, paddingVertical: 12 },
  panel: { backgroundColor: colors.white, borderRadius: radius.panel, overflow: 'hidden', ...shadow.soft },
  panelResults: { backgroundColor: 'rgba(242,237,247,0.6)', borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: colors.line, padding: 20, gap: 12 },
  compare: { backgroundColor: colors.paper, borderRadius: radius.card, borderWidth: StyleSheet.hairlineWidth, borderColor: colors.line },
  divider: { borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: colors.line },
})
