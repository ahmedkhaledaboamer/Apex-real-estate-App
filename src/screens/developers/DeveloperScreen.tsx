import { LinearGradient } from 'expo-linear-gradient'
import { router } from 'expo-router'
import { Star } from 'lucide-react-native'
import { Pressable, StyleSheet, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { agentProfileById } from '@/mocks/agents'
import { DEVELOPER_PROFILES, developerBySlug } from '@/mocks/developers'
import { PROJECT_DETAILS } from '@/mocks/projects'
import { PROPERTIES } from '@/mocks/properties'
import { colors, gradients, radius, shadow } from '@/theme'
import { BackButton } from '@/ui/brand'
import { Button } from '@/ui/Button'
import { InfinityMark } from '@/ui/icons'
import { Img } from '@/ui/Img'
import { LeadForm } from '@/ui/LeadForm'
import { Card, Container, EmptyState, SectionHead, Stat } from '@/ui/primitives'
import { PropertyCard } from '@/ui/PropertyCard'
import { Screen } from '@/ui/Screen'
import { Heading, Text } from '@/ui/Text'
import { ArrowLink, goOffplanSearch, HERO_OVERLAY, NotFound } from '../offplan/Bits'
import { Carousel, useCarouselWidth } from '../offplan/Carousel'
import { ProjectCard } from '../offplan/ProjectCard'

export function DeveloperScreen({ slug }: { slug: string }) {
  const developer = developerBySlug(slug)
  const insets = useSafeAreaInsets()
  const cardWidth = useCarouselWidth()

  if (!developer)
    return <NotFound title="Developer not found" body="We don’t have a profile for this developer yet. Browse the developers we sell for." cta="All developers" href="/developers" />

  const advisor = agentProfileById('daniel')
  const projects = PROJECT_DETAILS.filter((p) => p.developerSlug === developer.slug)
  const projectSlugs = new Set(projects.map((p) => p.slug))
  const units = PROPERTIES.filter((p) => p.kind === 'offplan' && p.projectSlug && projectSlugs.has(p.projectSlug))
  const others = DEVELOPER_PROFILES.filter((d) => d.slug !== developer.slug)

  return (
    <Screen variant="bare">
      {/* Hero */}
      <View style={[styles.hero, { paddingTop: insets.top + 72 }]}>
        <Img src={developer.image} style={StyleSheet.absoluteFill} />
        <LinearGradient {...HERO_OVERLAY} style={StyleSheet.absoluteFill} />
        <BackButton style={{ position: 'absolute', top: insets.top + 8, left: 16 }} />
        <Text size={12.5} weight={600} color="white" tracking={0.14} style={{ opacity: 0.75 }}>
          DEVELOPER PROFILE
        </Text>
        <Heading size={48} color="white" style={{ marginTop: 8 }}>
          {developer.name}
        </Heading>
        <Text size={16} color="white" style={{ marginTop: 10, opacity: 0.85 }}>
          {developer.summary}
        </Text>
      </View>

      {/* Facts */}
      <Container style={{ marginTop: -32 }}>
        <Card style={[{ flexDirection: 'row', flexWrap: 'wrap', rowGap: 18, padding: 22 }, shadow.lift]}>
          <View style={styles.cell}>
            <Stat label="Founded" value={String(developer.founded)} />
          </View>
          <View style={styles.cell}>
            <Stat label="Headquarters" value={developer.hq} />
          </View>
          <View style={styles.cell}>
            <Stat label="Units delivered" value={developer.deliveredUnits} />
          </View>
          <View style={styles.cell}>
            <Stat label="Projects we list" value={String(projects.length)} />
          </View>
        </Card>
      </Container>

      {/* About + signature projects */}
      <Container style={{ marginTop: 36 }}>
        <Heading size={34}>About {developer.name}</Heading>
        <Text size={16} lineHeight={25} style={{ marginTop: 12, opacity: 0.85 }}>
          {developer.description}
        </Text>
        <Card style={{ marginTop: 24, padding: 22 }}>
          <Text size={17} weight={600} color="plum">
            Signature projects
          </Text>
          <View style={{ marginTop: 8 }}>
            {developer.signatureProjects.map((s, i) => (
              <View key={s} style={[styles.sig, i > 0 && { borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: colors.line }]}>
                <View style={styles.star}>
                  <Star size={16} color={colors.indigo} />
                </View>
                <Text size={15} weight={500} style={{ flex: 1 }}>
                  {s}
                </Text>
              </View>
            ))}
          </View>
          <Text size={12} color="muted" style={{ marginTop: 10 }}>
            Profile figures are indicative; confirm details with the developer before purchase.
          </Text>
        </Card>
      </Container>

      {/* Projects we're selling */}
      <View style={{ marginTop: 40, paddingVertical: 40, backgroundColor: colors.white }}>
        <Container>
          <SectionHead
            title="Projects we’re selling"
            sub={`Current ${developer.name} launches, each checked for DLD registration and an escrow account.`}
            action={projects.length > 0 ? <ArrowLink label="All" onPress={() => goOffplanSearch()} /> : undefined}
          />
        </Container>
        {projects.length ? (
          projects.length === 1 ? (
            <Container>
              <ProjectCard project={projects[0]} />
            </Container>
          ) : (
            <Carousel data={projects} itemWidth={cardWidth} keyExtractor={(p) => p.slug} renderItem={(p) => <ProjectCard project={p} width={cardWidth} />} label={`${developer.name} projects`} />
          )
        ) : (
          <Container>
            <EmptyState
              title={`No ${developer.name} launches listed right now`}
              body={`We don’t have an active ${developer.name} project on the site today. Register below and we’ll send the next launch, or browse other developers’ projects.`}
              action={<Button title="Browse off-plan projects" onPress={() => goOffplanSearch()} />}
            />
          </Container>
        )}
      </View>

      {units.length > 0 ? (
        <View style={{ paddingTop: 40 }}>
          <Container>
            <SectionHead title={`${developer.name} off-plan units`} sub="Individual units available in the projects above, each with a DLD advertising permit." />
          </Container>
          <Carousel data={units} itemWidth={cardWidth} keyExtractor={(u) => u.id} renderItem={(u) => <PropertyCard listing={u} width={cardWidth} />} label={`${developer.name} off-plan units`} />
        </View>
      ) : null}

      {/* Enquiry band */}
      <Container style={{ marginTop: 40 }}>
        <LinearGradient colors={gradients.band.colors} start={gradients.band.start} end={gradients.band.end} style={styles.band}>
          <View style={styles.mark} pointerEvents="none">
            <InfinityMark width={460} strokeWidth={14} opacity={0.25} />
          </View>
          <Heading size={38} color="white">
            Ask about {developer.name}
          </Heading>
          <Text size={15.5} color="white" style={{ marginTop: 10, opacity: 0.8 }}>
            Upcoming launches, resale units, payment plans or the developer’s delivery record — {advisor.name.split(' ')[0]} and the team will come back to you within one working day.
          </Text>
          <View style={styles.glass}>
            <LeadForm
              type="enquiry"
              tone="solid"
              context={{ agentId: advisor.id }}
              withMessage
              defaultMessage={`I'd like to know more about ${developer.name} projects.`}
              extraFields={[
                {
                  name: 'interest',
                  label: 'Interested in',
                  kind: 'select',
                  options: [...projects.map((p) => p.name), `Upcoming ${developer.name} launches`, `${developer.name} resale homes`],
                },
              ]}
              submitLabel="Send enquiry"
            />
          </View>
        </LinearGradient>
      </Container>

      {/* Other developers */}
      <View style={{ marginTop: 40, paddingVertical: 32, backgroundColor: colors.white, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: colors.line }}>
        <Container>
          <Text size={14} weight={600} color="muted">
            Other developers
          </Text>
          <View style={styles.others}>
            {others.map((d) => (
              <Pressable
                key={d.slug}
                accessibilityRole="link"
                accessibilityLabel={`${d.name} developer profile`}
                onPress={() => router.push(`/developer/${d.slug}`)}
                style={({ pressed }) => [styles.otherChip, pressed && { backgroundColor: colors.mist }]}
              >
                <Text size={14} weight={700} color="ink" tracking={0.08} style={{ opacity: 0.55 }}>
                  {d.name.toUpperCase()}
                </Text>
              </Pressable>
            ))}
          </View>
        </Container>
      </View>
    </Screen>
  )
}

const styles = StyleSheet.create({
  hero: { paddingHorizontal: 20, paddingBottom: 64, overflow: 'hidden', backgroundColor: colors.plum },
  cell: { width: '50%', paddingRight: 10 },
  sig: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12 },
  star: { width: 32, height: 32, borderRadius: 16, backgroundColor: colors.mist, alignItems: 'center', justifyContent: 'center' },
  band: { borderRadius: radius.panel, overflow: 'hidden', paddingHorizontal: 20, paddingVertical: 32 },
  mark: { position: 'absolute', right: -120, bottom: -60 },
  glass: { marginTop: 24, borderRadius: radius.card, borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)', backgroundColor: 'rgba(255,255,255,0.1)', padding: 12 },
  others: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 14 },
  otherChip: { minHeight: 44, justifyContent: 'center', paddingHorizontal: 14, borderRadius: radius.pill, borderWidth: 1, borderColor: colors.line },
})
