import { router } from 'expo-router'
import { BadgeCheck, ExternalLink } from 'lucide-react-native'
import { useMemo, useState } from 'react'
import { Pressable, ScrollView, View } from 'react-native'

import { AGENT_PROFILES } from '@/mocks/agents'
import { openUrl } from '@/ui/brand'
import { Button } from '@/ui/Button'
import { SelectField, TextField } from '@/ui/Field'
import { Chip, Container, EmptyState } from '@/ui/primitives'
import { Screen } from '@/ui/Screen'
import { Text } from '@/ui/Text'
import { colors, GUTTER } from '@/theme'
import { CtaBand, PageHero } from '../company/Bands'
import { AgentCard } from './AgentCard'

export const DLD_URL = 'https://dubailand.gov.ae'

const ALL = 'all'
const uniq = (xs: string[]) => Array.from(new Set(xs)).sort((a, b) => a.localeCompare(b))
const LANGUAGES = uniq(AGENT_PROFILES.flatMap((a) => a.languages))
const AREAS = uniq(AGENT_PROFILES.flatMap((a) => a.communities))
const SPECIALITIES = uniq(AGENT_PROFILES.flatMap((a) => a.specialities))

export function AgentsScreen() {
  const [query, setQuery] = useState('')
  const [language, setLanguage] = useState(ALL)
  const [area, setArea] = useState(ALL)
  const [speciality, setSpeciality] = useState<string | null>(null)

  const list = useMemo(() => {
    const q = query.trim().toLowerCase()
    return AGENT_PROFILES.filter(
      (a) =>
        (!q || a.name.toLowerCase().includes(q)) &&
        (language === ALL || a.languages.includes(language)) &&
        (area === ALL || a.communities.includes(area)) &&
        (!speciality || a.specialities.includes(speciality)),
    )
  }, [query, language, area, speciality])

  const filtered = query !== '' || language !== ALL || area !== ALL || speciality !== null
  const reset = () => {
    setQuery('')
    setLanguage(ALL)
    setArea(ALL)
    setSpeciality(null)
  }

  return (
    <Screen variant="pushed" title="Agents">
      <PageHero title="Meet our agents" sub="Every Apex Aura adviser is RERA-licensed. Find a specialist by area, language or what you need help with.">
        <Pressable
          accessibilityRole="link"
          accessibilityLabel="Check any BRN on the Dubai Land Department site"
          onPress={() => openUrl(DLD_URL)}
          style={{ flexDirection: 'row', alignItems: 'center', gap: 8, alignSelf: 'flex-start', backgroundColor: 'rgba(255,255,255,0.14)', borderRadius: 999, paddingHorizontal: 14, paddingVertical: 10 }}
        >
          <BadgeCheck size={16} color={colors.white} />
          <Text size={13} weight={600} color="white" style={{ flexShrink: 1 }}>
            Check any BRN on the DLD site
          </Text>
          <ExternalLink size={13} color="rgba(255,255,255,0.7)" />
        </Pressable>
      </PageHero>

      <Container style={{ paddingTop: 24, gap: 12 }}>
        <TextField label="Search by name" placeholder="e.g. Layla" value={query} onChangeText={setQuery} returnKeyType="search" autoCorrect={false} accessibilityLabel="Search agents by name" />
        <View style={{ flexDirection: 'row', gap: 12 }}>
          <SelectField containerStyle={{ flex: 1 }} label="Language" value={language} onChange={setLanguage} options={[{ value: ALL, label: 'Any language' }, ...LANGUAGES]} />
          <SelectField containerStyle={{ flex: 1 }} label="Area" value={area} onChange={setArea} options={[{ value: ALL, label: 'Any area' }, ...AREAS]} />
        </View>
      </Container>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: GUTTER, gap: 8, paddingVertical: 14 }} accessibilityLabel="Filter by speciality">
        <Chip label="All specialities" active={speciality === null} onPress={() => setSpeciality(null)} />
        {SPECIALITIES.map((s) => (
          <Chip key={s} label={s} active={speciality === s} onPress={() => setSpeciality(speciality === s ? null : s)} />
        ))}
      </ScrollView>

      <Container>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', minHeight: 36 }}>
          <Text size={13.5} color="muted" accessibilityLiveRegion="polite">
            {list.length} {list.length === 1 ? 'adviser' : 'advisers'}
          </Text>
          {filtered ? (
            <Pressable onPress={reset} accessibilityRole="button" hitSlop={10} style={{ paddingVertical: 8 }}>
              <Text size={13.5} weight={600} color="aura">
                Clear filters
              </Text>
            </Pressable>
          ) : null}
        </View>

        {list.length === 0 ? (
          <View style={{ marginTop: 12 }}>
            <EmptyState title="No advisers match" body="Try a different language or area, or clear the filters to see the whole team." action={<Button title="Show all advisers" onPress={reset} />} />
          </View>
        ) : (
          <View style={{ gap: 36, marginTop: 12 }}>
            {list.map((a) => (
              <AgentCard key={a.id} agent={a} ratio={1} />
            ))}
          </View>
        )}
      </Container>

      <CtaBand
        style={{ marginTop: 48 }}
        title="Join our team"
        body="We are growing our sales, leasing and off-plan desks. If you hold (or are working towards) a RERA licence and put clients first, we would like to hear from you."
      >
        <Button title="Get in touch" variant="white" size="lg" onPress={() => router.push('/contact')} />
      </CtaBand>
      <View style={{ height: 8 }} />
    </Screen>
  )
}
