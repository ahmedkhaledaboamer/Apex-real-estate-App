import { LinearGradient } from 'expo-linear-gradient'
import { router } from 'expo-router'
import { BadgeCheck, ClipboardCheck, Landmark, Search, ShieldCheck, X } from 'lucide-react-native'
import { useState } from 'react'
import { Pressable, StyleSheet, TextInput, View } from 'react-native'

import { DEVELOPER_PROFILES } from '@/mocks/developers'
import { PROJECT_DETAILS } from '@/mocks/projects'
import { colors, fonts, gradients, radius } from '@/theme'
import { Button } from '@/ui/Button'
import { InfinityMark } from '@/ui/icons'
import { Container, EmptyState, SectionHead } from '@/ui/primitives'
import { Screen } from '@/ui/Screen'
import { Heading, Text } from '@/ui/Text'
import { goOffplanSearch } from '../offplan/Bits'
import { DeveloperCard } from './DeveloperCard'

const CHECKS = [
  { icon: Landmark, title: 'DLD & RERA registration', body: 'The developer and each project must be registered with the Dubai Land Department, with a valid project number before we advertise a single unit.' },
  { icon: ShieldCheck, title: 'Escrow account', body: 'We confirm the project escrow account and bank, so buyer payments are held and released against construction progress.' },
  { icon: ClipboardCheck, title: 'Delivery track record', body: 'We look at completed projects, how close handovers came to the original dates and how snagging was handled.' },
  { icon: BadgeCheck, title: 'Clear, honest marketing', body: 'We don’t list projects sold on guaranteed-return promises, and we show the full payment plan and fees up front.' },
]

export function DevelopersScreen() {
  const [query, setQuery] = useState('')
  const q = query.trim().toLowerCase()
  const shown = DEVELOPER_PROFILES.filter((d) => !q || d.name.toLowerCase().includes(q))

  return (
    <Screen variant="pushed" title="Developers">
      {/* Intro (site: PageHero) */}
      <Container style={{ paddingTop: 8 }}>
        <LinearGradient colors={gradients.band.colors} start={gradients.band.start} end={gradients.band.end} style={styles.hero}>
          <View style={styles.mark} pointerEvents="none">
            <InfinityMark width={360} strokeWidth={14} opacity={0.22} />
          </View>
          <Heading size={38} color="white">
            Dubai's leading developers
          </Heading>
          <Text size={15} color="white" style={{ marginTop: 10, opacity: 0.8 }}>
            Profiles of the master developers and boutique builders we sell for: when they were founded, what they’ve delivered, and the projects we have available today.
          </Text>
          <View style={{ flexDirection: 'row', gap: 32, marginTop: 20 }}>
            <View>
              <Text size={12} color="white" style={{ opacity: 0.7 }}>
                Developers profiled
              </Text>
              <Text size={26} weight={700} color="white">
                {DEVELOPER_PROFILES.length}
              </Text>
            </View>
            <View>
              <Text size={12} color="white" style={{ opacity: 0.7 }}>
                Off-plan projects listed
              </Text>
              <Text size={26} weight={700} color="white">
                {PROJECT_DETAILS.length}
              </Text>
            </View>
          </View>
        </LinearGradient>

        <View style={styles.search}>
          <Search size={20} color={colors.muted} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search developers, e.g. Emaar"
            placeholderTextColor="rgba(107,97,120,0.7)"
            accessibilityLabel="Search developers by name"
            autoCorrect={false}
            returnKeyType="search"
            style={styles.input}
          />
          {query ? (
            <Pressable accessibilityRole="button" accessibilityLabel="Clear search" onPress={() => setQuery('')} hitSlop={10} style={styles.clear}>
              <X size={16} color={colors.ink} />
            </Pressable>
          ) : null}
        </View>
        <Text size={14} color="muted" style={{ marginTop: 12, marginBottom: 16 }} accessibilityLiveRegion="polite">
          {shown.length} {shown.length === 1 ? 'developer' : 'developers'}
        </Text>

        {shown.length ? (
          <View style={{ gap: 16 }}>
            {shown.map((d) => (
              <DeveloperCard key={d.slug} developer={d} />
            ))}
          </View>
        ) : (
          <EmptyState
            title="No developers found"
            body={`We don’t have a profile for “${query.trim()}” yet. Ask an adviser — we can still help with their projects.`}
            action={
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 10 }}>
                <Button title="Clear search" variant="outline" onPress={() => setQuery('')} />
                <Button title="Ask an adviser" onPress={() => router.push('/contact')} />
              </View>
            }
          />
        )}
      </Container>

      {/* How we vet developers */}
      <View style={{ backgroundColor: colors.white, paddingVertical: 40, marginTop: 40 }}>
        <Container>
          <SectionHead title="How we vet developers" sub="Before we sell a project, it passes the same four checks. If it doesn’t, we don’t list it." />
          <View style={{ gap: 12 }}>
            {CHECKS.map(({ icon: Icon, title, body }) => (
              <View key={title} style={styles.check}>
                <View style={styles.checkIcon}>
                  <Icon size={20} color={colors.indigo} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text size={17} weight={600} color="plum">
                    {title}
                  </Text>
                  <Text size={14} color="muted" style={{ marginTop: 4 }}>
                    {body}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </Container>
      </View>

      {/* Band → off-plan search */}
      <Container style={{ marginTop: 40 }}>
        <View style={styles.band}>
          <Heading size={34}>Looking at a new launch?</Heading>
          <Text size={15} color="muted" style={{ marginTop: 10 }}>
            Browse current off-plan projects with payment plans, handover dates and DLD details on every listing.
          </Text>
          <Button title="Explore off-plan projects" size="lg" onPress={() => goOffplanSearch()} style={{ marginTop: 20 }} />
        </View>
      </Container>
    </Screen>
  )
}

const styles = StyleSheet.create({
  hero: { borderRadius: radius.panel, overflow: 'hidden', padding: 24 },
  mark: { position: 'absolute', right: -90, bottom: -50 },
  search: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 24, minHeight: 52, borderRadius: radius.pill, borderWidth: 1, borderColor: colors.line, backgroundColor: colors.white, paddingLeft: 18, paddingRight: 8 },
  input: { flex: 1, fontFamily: fonts.sans[500], fontSize: 15, color: colors.ink, paddingVertical: 12 },
  clear: { width: 36, height: 36, borderRadius: 18, backgroundColor: colors.mist, alignItems: 'center', justifyContent: 'center' },
  check: { flexDirection: 'row', gap: 14, borderRadius: radius.card, borderWidth: 1, borderColor: colors.line, backgroundColor: colors.paper, padding: 18 },
  checkIcon: { width: 44, height: 44, borderRadius: 22, backgroundColor: colors.mist, alignItems: 'center', justifyContent: 'center' },
  band: { borderRadius: radius.panel, backgroundColor: colors.mist, paddingHorizontal: 24, paddingVertical: 36 },
})
