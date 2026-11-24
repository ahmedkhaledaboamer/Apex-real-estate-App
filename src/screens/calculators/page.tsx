/**
 * Page building blocks shared by the Tools, Invest and Sell screens (mobile versions of the site's
 * PageHero, SectionHead lists, AdviserBand, ToolCards…). Built on the UI kit, not restyling it.
 */
import { router, type Href } from 'expo-router'
import { LinearGradient } from 'expo-linear-gradient'
import { ArrowRight, Calculator, Landmark, Percent, Phone, Scale, type LucideIcon } from 'lucide-react-native'
import { FlatList, Pressable, StyleSheet, useWindowDimensions, View, type StyleProp, type ViewStyle } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { CONTACT_PHONE, WHATSAPP_NUMBER } from '@/lib/constants'
import { colors, gradients, GUTTER, radius, shadow } from '@/theme'
import { BackButton, call, whatsapp } from '@/ui/brand'
import { Button } from '@/ui/Button'
import { WhatsAppIcon, InfinityMark } from '@/ui/icons'
import { Img } from '@/ui/Img'
import { LeadForm } from '@/ui/LeadForm'
import { Accordion, type AccordionItem } from '@/ui/Accordion'
import { Container, Section, SectionHead } from '@/ui/primitives'
import { Heading, Text } from '@/ui/Text'

/* ---------- Heroes ---------- */

/** Plain page intro for pushed screens (site: PageHero without image). */
export function PageIntro({ eyebrow, title, sub, children }: { eyebrow?: string; title: string; sub: string; children?: React.ReactNode }) {
  return (
    <Container style={{ paddingTop: 8, paddingBottom: 24, gap: 10 }}>
      {eyebrow ? (
        <Text size={12} weight={600} color="aura" tracking={0.12} uppercase>
          {eyebrow}
        </Text>
      ) : null}
      <Heading size={38} accessibilityRole="header">
        {title}
      </Heading>
      <Text size={15.5} color="muted" lineHeight={24}>
        {sub}
      </Text>
      {children}
    </Container>
  )
}

/** Full-bleed photo hero with gradient and floating back button (site: PageHero with image). */
export function PhotoHero({ image, eyebrow, title, sub, children }: { image: string; eyebrow?: string; title: string; sub: string; children?: React.ReactNode }) {
  const insets = useSafeAreaInsets()
  return (
    <View style={{ minHeight: 460 + insets.top, justifyContent: 'flex-end' }}>
      <Img src={image} style={StyleSheet.absoluteFill} accessibilityIgnoresInvertColors />
      <LinearGradient colors={['rgba(30,24,40,0.25)', 'rgba(30,24,40,0.35)', 'rgba(56,26,76,0.92)']} locations={[0, 0.4, 1]} style={StyleSheet.absoluteFill} />
      <BackButton style={{ position: 'absolute', top: insets.top + 8, left: GUTTER }} />
      <View style={{ paddingHorizontal: GUTTER, paddingTop: insets.top + 72, paddingBottom: 32, gap: 12 }}>
        {eyebrow ? (
          <Text size={12} weight={600} color="white" tracking={0.14} uppercase style={{ opacity: 0.8 }}>
            {eyebrow}
          </Text>
        ) : null}
        <Heading size={42} color="white" accessibilityRole="header">
          {title}
        </Heading>
        <Text size={16} color="white" lineHeight={24} style={{ opacity: 0.88 }}>
          {sub}
        </Text>
        {children ? <View style={{ gap: 10, marginTop: 8 }}>{children}</View> : null}
      </View>
    </View>
  )
}

/* ---------- Cards & lists ---------- */

export function IconCircle({ icon: Icon, size = 48, active }: { icon: LucideIcon; size?: number; active?: boolean }) {
  return (
    <View style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: active ? colors.plum : colors.mist, alignItems: 'center', justifyContent: 'center' }}>
      <Icon size={size * 0.42} color={active ? colors.white : colors.indigo} strokeWidth={1.6} />
    </View>
  )
}

/** Icon + serif title + body card (site: the rounded-[16px] feature cards). */
export function IconCard({
  icon,
  title,
  body,
  points,
  link,
  onPress,
  tone = 'white',
  serif = true,
  style,
}: {
  icon: LucideIcon
  title: string
  body: string
  points?: string[]
  link?: string
  onPress?: () => void
  tone?: 'white' | 'paper'
  serif?: boolean
  style?: StyleProp<ViewStyle>
}) {
  const content = (
    <>
      <IconCircle icon={icon} />
      {serif ? (
        <Heading size={26} style={{ marginTop: 18 }}>
          {title}
        </Heading>
      ) : (
        <Text size={17} weight={600} color="plum" style={{ marginTop: 18 }}>
          {title}
        </Text>
      )}
      {body ? (
        <Text size={14.5} color="muted" lineHeight={22} style={{ marginTop: 8 }}>
          {body}
        </Text>
      ) : null}
      {points ? <Bullets items={points} style={{ marginTop: 14 }} size={13.5} /> : null}
      {link ? (
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 'auto', paddingTop: 18 }}>
          <Text size={14} weight={600} color="aura">
            {link}
          </Text>
          <ArrowRight size={16} color={colors.aura} />
        </View>
      ) : null}
    </>
  )
  const base = [styles.card, tone === 'paper' ? styles.cardPaper : shadow.soft, style]
  if (!onPress) return <View style={base}>{content}</View>
  return (
    <Pressable accessibilityRole="link" accessibilityLabel={`${title}. ${link ?? ''}`} onPress={onPress} style={({ pressed }) => [...base, pressed && { opacity: 0.9, transform: [{ scale: 0.99 }] }]}>
      {content}
    </Pressable>
  )
}

export function Bullets({ items, style, size = 14.5 }: { items: string[]; style?: StyleProp<ViewStyle>; size?: number }) {
  return (
    <View style={[{ gap: 8 }, style]}>
      {items.map((it) => (
        <View key={it} style={{ flexDirection: 'row', gap: 10 }}>
          <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: colors.aura, marginTop: size * 0.6 }} />
          <Text size={size} color="ink" lineHeight={Math.round(size * 1.5)} style={{ flex: 1, opacity: 0.85 }}>
            {it}
          </Text>
        </View>
      ))}
    </View>
  )
}

/** Numbered rows with hairline dividers (site: the <ol> of tips / assumptions). */
export function NumberedRows({ items }: { items: { title?: string; body: string }[] }) {
  return (
    <View style={styles.rows}>
      {items.map((t, i) => (
        <View key={i} style={[styles.row, i > 0 && styles.rowDivider]}>
          <View style={styles.num}>
            <Text display weight={600} size={20} color="indigo">
              {i + 1}
            </Text>
          </View>
          <View style={{ flex: 1 }}>
            {t.title ? (
              <Text size={16.5} weight={600} color="plum">
                {t.title}
              </Text>
            ) : null}
            <Text size={15} color={t.title ? 'muted' : 'ink'} lineHeight={23} style={[t.title ? { marginTop: 4 } : { opacity: 0.85 }]}>
              {t.body}
            </Text>
          </View>
        </View>
      ))}
    </View>
  )
}

/** Icon rows with hairline dividers (site: costs / marketing lists). */
export function IconRows({ items, serif }: { items: { icon: LucideIcon; title: string; body: string }[]; serif?: boolean }) {
  return (
    <View style={styles.rows}>
      {items.map((t, i) => (
        <View key={t.title} style={[styles.row, i > 0 && styles.rowDivider]}>
          <IconCircle icon={t.icon} />
          <View style={{ flex: 1 }}>
            {serif ? (
              <Heading size={24}>{t.title}</Heading>
            ) : (
              <Text size={17} weight={600} color="plum">
                {t.title}
              </Text>
            )}
            <Text size={15} color="muted" lineHeight={23} style={{ marginTop: 4 }}>
              {t.body}
            </Text>
          </View>
        </View>
      ))}
    </View>
  )
}

/** Step cards with a big gradient-coloured number (site: "01" step cards). */
export function StepCard({ index, title, body, icon: Icon, tone = 'white', style }: { index: number; title: string; body: string; icon?: LucideIcon; tone?: 'white' | 'paper'; style?: StyleProp<ViewStyle> }) {
  return (
    <View style={[styles.card, tone === 'paper' ? styles.cardPaper : shadow.soft, style]}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <Text display weight={600} size={40} lineHeight={42} color="aura">
          {String(index + 1).padStart(2, '0')}
        </Text>
        {Icon ? <Icon size={20} color={colors.indigo} strokeWidth={1.6} /> : null}
      </View>
      <Text size={16.5} weight={600} color="plum" style={{ marginTop: 12 }}>
        {title}
      </Text>
      <Text size={14} color="muted" lineHeight={21} style={{ marginTop: 4 }}>
        {body}
      </Text>
    </View>
  )
}

/** Big serif figures in a 2-column grid (site: the <dl> stat rows). */
export function FactsGrid({ items }: { items: { value: string; label: string }[] }) {
  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', rowGap: 26 }}>
      {items.map((f) => (
        <View key={f.label} style={{ width: '50%', paddingEnd: 14 }} accessible accessibilityLabel={`${f.value}: ${f.label}`}>
          <Text display weight={600} size={42} lineHeight={44} color="plum">
            {f.value}
          </Text>
          <Text size={13.5} color="ink" lineHeight={19} style={{ marginTop: 6, opacity: 0.8 }}>
            {f.label}
          </Text>
        </View>
      ))}
    </View>
  )
}

/* ---------- Horizontal carousel ---------- */

export function useCardWidth(peek = 44) {
  const { width } = useWindowDimensions()
  return Math.min(360, width - GUTTER * 2 - peek)
}

/** Snapping horizontal list (site: grids of many cards). */
export function Carousel<T>({ data, keyOf, render, itemWidth, gap = 14 }: { data: T[]; keyOf: (t: T) => string; render: (t: T, i: number) => React.ReactElement; itemWidth: number; gap?: number }) {
  return (
    <FlatList
      horizontal
      data={data}
      keyExtractor={keyOf}
      renderItem={({ item, index }) => <View style={{ width: itemWidth }}>{render(item, index)}</View>}
      ItemSeparatorComponent={() => <View style={{ width: gap }} />}
      showsHorizontalScrollIndicator={false}
      snapToInterval={itemWidth + gap}
      decelerationRate="fast"
      contentContainerStyle={{ paddingHorizontal: GUTTER, paddingVertical: 6 }}
    />
  )
}

/* ---------- Tool cards ---------- */

export type ToolPath = '/tools/mortgage' | '/tools/roi' | '/tools/dld-fees' | '/tools/rent-vs-buy'

export const TOOLS: { to: ToolPath; icon: LucideIcon; title: string; body: string }[] = [
  { to: '/tools/mortgage', icon: Calculator, title: 'Mortgage calculator', body: 'Monthly repayment, total interest and the cash you need upfront.' },
  { to: '/tools/roi', icon: Percent, title: 'Rental ROI calculator', body: 'Gross and net yield, cash flow and cash-on-cash return.' },
  { to: '/tools/dld-fees', icon: Landmark, title: 'DLD & buying fees', body: 'Every one-off cost on a ready or off-plan purchase, itemised.' },
  { to: '/tools/rent-vs-buy', icon: Scale, title: 'Rent vs buy', body: 'When owning beats renting, year by year, on your assumptions.' },
]

export function ToolCard({ tool, style }: { tool: (typeof TOOLS)[number]; style?: StyleProp<ViewStyle> }) {
  return <IconCard icon={tool.icon} title={tool.title} body={tool.body} link="Open calculator" onPress={() => router.push(tool.to)} style={style} />
}

/** "More calculators" section with the other three tools in a carousel. */
export function MoreCalculators({ exclude }: { exclude: ToolPath }) {
  const w = useCardWidth(70)
  return (
    <Section tone="white" style={styles.bordered}>
      <Container>
        <SectionHead title="More calculators" />
      </Container>
      <Carousel data={TOOLS.filter((t) => t.to !== exclude)} keyOf={(t) => t.to} itemWidth={w} render={(t) => <ToolCard tool={t} style={{ flex: 1 }} />} />
    </Section>
  )
}

/* ---------- FAQ ---------- */

export function FaqSection({ title, sub, items, tone = 'paper', note }: { title: string; sub?: string; items: AccordionItem[]; tone?: 'paper' | 'white'; note?: React.ReactNode }) {
  return (
    <Section tone={tone} style={tone === 'white' ? styles.bordered : undefined}>
      <Container>
        <SectionHead title={title} sub={sub} />
        {note}
        <Accordion items={items} defaultOpen={0} />
      </Container>
    </Section>
  )
}

/* ---------- Dark CTA band with callback form (site: AdviserBand) ---------- */

export function GradientBand({ children, style }: { children: React.ReactNode; style?: StyleProp<ViewStyle> }) {
  return (
    <View style={[styles.band, style]}>
      <LinearGradient colors={gradients.band.colors} start={gradients.band.start} end={gradients.band.end} style={StyleSheet.absoluteFill} />
      <View style={styles.bandMark} pointerEvents="none">
        <InfinityMark width={460} strokeWidth={14} opacity={0.25} />
      </View>
      {children}
    </View>
  )
}

export function AdviserBand({
  title,
  sub,
  submitLabel = 'Request a callback',
  whatsappText = 'Hello Apex Aura, I would like investment advice.',
  topic,
}: {
  title: string
  sub: string
  submitLabel?: string
  whatsappText?: string
  topic?: string[]
}) {
  return (
    <Container style={{ paddingVertical: 40 }}>
      <GradientBand>
        <Heading size={36} color="white">
          {title}
        </Heading>
        <Text size={15.5} color="white" lineHeight={24} style={{ marginTop: 12, opacity: 0.82 }}>
          {sub}
        </Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 20 }}>
          <Button variant="white" title={CONTACT_PHONE} icon={<Phone size={16} color={colors.plum} />} onPress={() => call()} accessibilityLabel={`Call ${CONTACT_PHONE}`} />
          <Button variant="whatsapp" title="WhatsApp us" icon={<WhatsAppIcon size={16} />} onPress={() => whatsapp(WHATSAPP_NUMBER, whatsappText)} />
        </View>
        <View style={styles.glass}>
          <LeadForm
            type="callback"
            tone="solid"
            submitLabel={submitLabel}
            extraFields={topic ? [{ name: 'topic', label: 'Interested in', kind: 'select', options: topic }] : []}
          />
        </View>
      </GradientBand>
    </Container>
  )
}

/** Outlined button for dark/photo backgrounds (site: variant="outline" + border-white/40 text-white). */
export function DarkOutlineButton({ title, onPress, icon, size = 'lg', style }: { title: string; onPress: () => void; icon?: React.ReactNode; size?: 'md' | 'lg'; style?: StyleProp<ViewStyle> }) {
  return (
    <Button variant="outline" size={size} icon={icon} onPress={onPress} accessibilityLabel={title} style={[{ borderColor: 'rgba(255,255,255,0.45)' }, style]}>
      <Text weight={600} size={size === 'lg' ? 15.5 : 14.5} color="white">
        {title}
      </Text>
    </Button>
  )
}

/** Text link with an arrow (site: "… →" links). */
export function ArrowLink({ label, href, onPress }: { label: string; href?: Href; onPress?: () => void }) {
  return (
    <Pressable accessibilityRole="link" onPress={onPress ?? (() => href && router.push(href))} hitSlop={8} style={{ flexDirection: 'row', alignItems: 'center', gap: 6, minHeight: 44 }}>
      <Text size={14.5} weight={600} color="aura">
        {label}
      </Text>
      <ArrowRight size={16} color={colors.aura} />
    </Pressable>
  )
}

export const pageStyles = StyleSheet.create({
  bordered: { borderTopWidth: StyleSheet.hairlineWidth, borderBottomWidth: StyleSheet.hairlineWidth, borderColor: colors.line },
  stack: { gap: 14 },
})

const styles = StyleSheet.create({
  card: { backgroundColor: colors.white, borderRadius: radius.card, padding: 22 },
  cardPaper: { backgroundColor: colors.paper, borderWidth: StyleSheet.hairlineWidth, borderColor: colors.line },
  rows: { borderTopWidth: StyleSheet.hairlineWidth, borderBottomWidth: StyleSheet.hairlineWidth, borderColor: colors.line },
  row: { flexDirection: 'row', alignItems: 'flex-start', gap: 16, paddingVertical: 20 },
  rowDivider: { borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: colors.line },
  num: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.mist, alignItems: 'center', justifyContent: 'center' },
  bordered: { borderTopWidth: StyleSheet.hairlineWidth, borderBottomWidth: StyleSheet.hairlineWidth, borderColor: colors.line },
  band: { borderRadius: radius.panel, overflow: 'hidden', paddingHorizontal: 22, paddingVertical: 36 },
  bandMark: { position: 'absolute', right: -120, bottom: -60 },
  glass: { marginTop: 26, borderRadius: radius.card, borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)', backgroundColor: 'rgba(255,255,255,0.1)', padding: 14 },
})
