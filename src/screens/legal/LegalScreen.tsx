import { router } from 'expo-router'
import { FileText, Mail } from 'lucide-react-native'
import { useRef, useState } from 'react'
import { ScrollView, StyleSheet, View, type NativeScrollEvent, type NativeSyntheticEvent } from 'react-native'

import { CONTACT_EMAIL } from '@/lib/constants'
import { email, ScreenHeader } from '@/ui/brand'
import { Button } from '@/ui/Button'
import { Chip, Container, EmptyState } from '@/ui/primitives'
import { Heading, Text } from '@/ui/Text'
import { colors, GUTTER, radius, shadow } from '@/theme'
import { PageHero } from '../company/Bands'
import { isDocKey, LEGAL_DOCS, LEGAL_LINKS, LEGAL_UPDATED, type DocKey } from './docs'

export function LegalScreen({ doc }: { doc: string | undefined }) {
  if (!isDocKey(doc)) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.paper }}>
        <ScreenHeader title="Legal" />
        <Container style={{ paddingTop: 24 }}>
          <EmptyState
            title="Page not found"
            body="We couldn’t find that legal page. Choose one of our policies below."
            action={
              <View style={{ gap: 10, alignItems: 'center' }}>
                {LEGAL_LINKS.map((l) => (
                  <Button key={l.key} title={l.label} variant="outline" onPress={() => router.replace(`/legal/${l.key}`)} />
                ))}
              </View>
            }
          />
        </Container>
      </View>
    )
  }
  return <LegalDocument docKey={doc} />
}

function LegalDocument({ docKey }: { docKey: DocKey }) {
  const { title, intro, sections } = LEGAL_DOCS[docKey]
  const scroll = useRef<React.ComponentRef<typeof ScrollView>>(null)
  const chipsRef = useRef<React.ComponentRef<typeof ScrollView>>(null)
  const offsets = useRef<Record<string, number>>({})
  const chipX = useRef<Record<string, number>>({})
  const [chipsH, setChipsH] = useState(56)
  const [active, setActive] = useState(sections[0]?.id)

  const jump = (id: string) => {
    const y = offsets.current[id]
    if (y === undefined) return
    setActive(id)
    scroll.current?.scrollTo({ y: Math.max(0, y - chipsH - 8), animated: true })
  }

  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const y = e.nativeEvent.contentOffset.y + chipsH + 40
    let current = sections[0]?.id
    for (const s of sections) if ((offsets.current[s.id] ?? Infinity) <= y) current = s.id
    if (current !== active) {
      setActive(current)
      const x = chipX.current[current ?? '']
      if (x !== undefined) chipsRef.current?.scrollTo({ x: Math.max(0, x - GUTTER), animated: true })
    }
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.paper }}>
      <ScreenHeader title={title} />
      <ScrollView ref={scroll} stickyHeaderIndices={[1]} onScroll={onScroll} scrollEventThrottle={64} contentContainerStyle={{ paddingBottom: 48 }}>
        <PageHero title={title} sub={`Last updated ${LEGAL_UPDATED}`} />

        {/* Section index (sticky) */}
        <View style={styles.chipsBar} onLayout={(e) => setChipsH(e.nativeEvent.layout.height)}>
          <ScrollView ref={chipsRef} horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: GUTTER, gap: 8 }} accessibilityLabel="On this page">
            {sections.map((s, i) => (
              <View key={s.id} onLayout={(e) => (chipX.current[s.id] = e.nativeEvent.layout.x)}>
                <Chip label={`${i + 1}. ${s.title}`} active={active === s.id} onPress={() => jump(s.id)} />
              </View>
            ))}
          </ScrollView>
        </View>

        <View style={[styles.note, { marginHorizontal: GUTTER, marginTop: 20 }]} accessibilityRole="summary">
          <FileText size={20} color={colors.aura} style={{ marginTop: 1 }} />
          <Text size={14} color="plum" lineHeight={21} style={{ flex: 1 }}>
            <Text size={14} weight={600} color="plum">
              Template — to be reviewed by legal counsel before launch.
            </Text>{' '}
            Bracketed items such as [Trade Licence No.] are placeholders.
          </Text>
        </View>

        <View style={{ paddingHorizontal: GUTTER, marginTop: 22 }}>{intro}</View>

        {sections.map((s, i) => (
          <View key={s.id} style={styles.section} onLayout={(e) => (offsets.current[s.id] = e.nativeEvent.layout.y)}>
            <Heading size={28} accessibilityRole="header">
              <Heading size={28} color="aura">
                {i + 1}.{' '}
              </Heading>
              {s.title}
            </Heading>
            <View style={{ marginTop: 12 }}>{s.content}</View>
          </View>
        ))}

        <View style={[styles.questions, { marginHorizontal: GUTTER }]}>
          <Text size={16} weight={600} color="plum">
            Questions about this policy?
          </Text>
          <Text size={14} color="muted" style={{ marginTop: 4 }}>
            Our data protection contact replies within five working days.
          </Text>
          <Button
            title={CONTACT_EMAIL}
            variant="outline"
            icon={<Mail size={16} color={colors.plum} />}
            onPress={() => email(CONTACT_EMAIL, `${title} enquiry`)}
            style={{ marginTop: 14 }}
            accessibilityLabel={`Email ${CONTACT_EMAIL}`}
          />
        </View>

        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, paddingHorizontal: GUTTER, marginTop: 24 }} accessibilityLabel="Other legal pages">
          {LEGAL_LINKS.filter((l) => l.key !== docKey).map((l) => (
            <Button key={l.key} title={l.label} variant="ghost" size="sm" onPress={() => router.replace(`/legal/${l.key}`)} />
          ))}
        </View>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  chipsBar: { backgroundColor: colors.paper, paddingVertical: 10, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.line },
  note: { flexDirection: 'row', gap: 12, borderRadius: radius.card, borderWidth: 1, borderColor: colors.line, backgroundColor: colors.mist, padding: 16 },
  section: { marginHorizontal: GUTTER, marginTop: 32, paddingTop: 28, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: colors.line },
  questions: { marginTop: 40, backgroundColor: colors.white, borderRadius: radius.card, padding: 20, ...shadow.soft },
})
