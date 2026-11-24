import { LinearGradient } from 'expo-linear-gradient'
import { router } from 'expo-router'
import { ArrowRight, Check, FileText } from 'lucide-react-native'
import { useMemo, useState } from 'react'
import { StyleSheet, View } from 'react-native'

import { ARTICLE_CATEGORIES } from '@/mocks/insights'
import { Button } from '@/ui/Button'
import { TextField } from '@/ui/Field'
import { InfinityMark } from '@/ui/icons'
import { Card, Container, EmptyState, SectionHead } from '@/ui/primitives'
import { Screen } from '@/ui/Screen'
import { Segmented } from '@/ui/Segmented'
import { Heading, Text } from '@/ui/Text'
import { colors, GUTTER, gradients, radius } from '@/theme'
import { IconCircle, PageHero } from '../company/Bands'
import { ArticleCard, FeaturedArticleCard } from './ArticleCard'
import { ARTICLES_BY_DATE, articleHref } from './helpers'

const ALL = 'All'
const CATEGORIES = [ALL, ...ARTICLE_CATEGORIES.filter((c) => ARTICLES_BY_DATE.some((a) => a.category === c))]
const FEATURED = ARTICLES_BY_DATE[0]
const LATEST_MARKET = ARTICLES_BY_DATE.find((a) => a.category === 'Market') ?? FEATURED

export function InsightsScreen() {
  const [category, setCategory] = useState<string>(ALL)
  // "All" skips the featured article (already shown above); a category shows everything in it.
  const list = useMemo(
    () => (category === ALL ? ARTICLES_BY_DATE.filter((a) => a.slug !== FEATURED.slug) : ARTICLES_BY_DATE.filter((a) => a.category === category)),
    [category],
  )

  return (
    <Screen variant="pushed" title="Insights">
      <PageHero
        title="Market insights"
        sub="Prices, rents, rules and practical guides for buying, renting and investing in Dubai, written by the advisers who work the market every day."
      />

      <Container style={{ paddingTop: 28, gap: 16 }}>
        <FeaturedArticleCard article={FEATURED} />

        <Card style={{ padding: 22 }}>
          <IconCircle>
            <FileText size={24} color={colors.aura} />
          </IconCircle>
          <Text size={13} weight={600} color="aura" style={{ marginTop: 16 }}>
            Quarterly market report · Q3 2026
          </Text>
          <Heading size={27} style={{ marginTop: 6 }}>
            Apartment prices ease 4.8% as ready homes reach 29% of sales
          </Heading>
          <View style={{ flexDirection: 'row', gap: 16, marginTop: 16 }}>
            <View style={{ flex: 1 }}>
              <Text size={12} color="muted">
                Avg apartment price
              </Text>
              <Text size={20} weight={700} color="plum">
                AED 1,817
                <Text size={12.5} weight={500} color="muted">
                  {' '}
                  /sq ft
                </Text>
              </Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text size={12} color="muted">
                Residential deals
              </Text>
              <Text size={20} weight={700} color="plum">
                ~34,500
              </Text>
            </View>
          </View>
          <Text size={11.5} color="muted" style={{ marginTop: 10 }}>
            Source: Savills Dubai Residential Market Report Q3 2026.
          </Text>
          <Button
            title="Read the market report"
            full
            iconRight={<ArrowRight size={16} color={colors.white} />}
            onPress={() => router.push(articleHref(LATEST_MARKET))}
            style={{ marginTop: 20 }}
          />
        </Card>
      </Container>

      <View style={{ paddingTop: 44 }}>
        <Container>
          <SectionHead title="All articles" sub="Filter by topic to find what matters to you." />
        </Container>
        <Segmented style={{ marginHorizontal: GUTTER, alignSelf: 'flex-start' }} value={category} onChange={setCategory} tabs={CATEGORIES.map((c) => ({ key: c, label: c }))} />
        <Container style={{ marginTop: 20, gap: 16 }}>
          {list.length === 0 ? (
            <EmptyState title="Nothing here yet" body="We have not published in this category recently. Try another topic." />
          ) : (
            list.map((a) => <ArticleCard key={a.slug} article={a} />)
          )}
        </Container>
      </View>

      <NewsletterBand />
    </Screen>
  )
}

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/** Newsletter signup with inline validation and a success state (local only until the API exists). */
export function NewsletterBand() {
  const [value, setValue] = useState('')
  const [error, setError] = useState<string>()
  const [done, setDone] = useState(false)
  const submit = () => {
    if (!EMAIL.test(value.trim())) return setError('Please enter a valid email')
    setError(undefined)
    setDone(true)
  }
  return (
    <View style={{ paddingHorizontal: GUTTER, marginTop: 48 }}>
      <LinearGradient colors={gradients.band.colors} start={gradients.band.start} end={gradients.band.end} style={styles.band}>
        <View style={styles.mark} pointerEvents="none">
          <InfinityMark width={380} strokeWidth={14} opacity={0.22} />
        </View>
        <Heading size={34} color="white">
          The Dubai market, monthly
        </Heading>
        <Text size={15} color="white" lineHeight={23} style={{ marginTop: 10, opacity: 0.82 }}>
          Prices, rents, new launches and rule changes in one short email. No spam; unsubscribe any time.
        </Text>
        {done ? (
          <View style={styles.done} accessibilityLiveRegion="polite">
            <View style={styles.check}>
              <Check size={20} color={colors.plum} />
            </View>
            <Text size={15} color="white" style={{ flex: 1 }}>
              You’re subscribed. The next market update lands in your inbox at the start of the month.
            </Text>
          </View>
        ) : (
          <View style={{ gap: 12, marginTop: 22 }}>
            <TextField
              tone="solid"
              label="Email"
              placeholder="you@example.com"
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              value={value}
              onChangeText={setValue}
              onSubmitEditing={submit}
              error={error}
            />
            <Button title="Subscribe" variant="white" size="lg" full onPress={submit} />
          </View>
        )}
      </LinearGradient>
    </View>
  )
}

const styles = StyleSheet.create({
  band: { borderRadius: radius.panel, paddingHorizontal: 24, paddingVertical: 36, overflow: 'hidden' },
  mark: { position: 'absolute', right: -120, bottom: -60 },
  done: { flexDirection: 'row', alignItems: 'center', gap: 14, marginTop: 22, borderRadius: radius.card, padding: 18, backgroundColor: 'rgba(255,255,255,0.12)' },
  check: { width: 44, height: 44, borderRadius: 22, backgroundColor: colors.white, alignItems: 'center', justifyContent: 'center' },
})
