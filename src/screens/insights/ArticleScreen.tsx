import { LinearGradient } from 'expo-linear-gradient'
import { router } from 'expo-router'
import { ArrowLeft, ArrowRight, ArrowUpRight, Share2 } from 'lucide-react-native'
import { useMemo } from 'react'
import { Pressable, Share, StyleSheet, useWindowDimensions, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { AGENT_PROFILES } from '@/mocks/agents'
import { articleBySlug } from '@/mocks/insights'
import type { ArticleBlock, ArticleDetail } from '@/types'
import { BackButton, whatsapp } from '@/ui/brand'
import { Button } from '@/ui/Button'
import { WhatsAppIcon } from '@/ui/icons'
import { Img } from '@/ui/Img'
import { Container, EmptyState, SectionHead } from '@/ui/primitives'
import { Screen } from '@/ui/Screen'
import { Heading, Text } from '@/ui/Text'
import { colors, GUTTER, gradients, radius, shadow } from '@/theme'
import { agentHref } from '../agents/AgentCard'
import { Carousel } from '../company/Carousel'
import { ArticleCard } from './ArticleCard'
import { adjacentArticles, articleHref, articleWebUrl, relatedArticles } from './helpers'

export function ArticleScreen({ slug }: { slug: string }) {
  const a = articleBySlug(slug)
  if (!a) {
    return (
      <Screen variant="pushed" title="Insights">
        <Container style={{ paddingTop: 24 }}>
          <EmptyState title="Article not found" body="This article may have moved or been retired." action={<Button title="All insights" onPress={() => router.replace('/insights')} />} />
        </Container>
      </Screen>
    )
  }
  return <Article a={a} />
}

async function shareArticle(a: ArticleDetail) {
  const url = articleWebUrl(a)
  try {
    await Share.share({ title: a.title, message: `${a.title} ${url}`, url })
  } catch {
    // Share sheet unavailable (e.g. some browsers) — fall back to WhatsApp.
    void whatsapp('', `${a.title} ${url}`)
  }
}

function Article({ a }: { a: ArticleDetail }) {
  const insets = useSafeAreaInsets()
  const { width } = useWindowDimensions()
  const author = useMemo(() => AGENT_PROFILES.find((p) => p.name === a.author), [a.author])
  const related = useMemo(() => relatedArticles(a), [a])
  const { older, newer } = useMemo(() => adjacentArticles(a), [a])

  return (
    <Screen variant="bare">
      <View style={{ height: Math.min(width * 0.78, 360), backgroundColor: colors.mist }}>
        <Img src={a.image} style={StyleSheet.absoluteFill} />
        <LinearGradient colors={['rgba(30,24,40,0.35)', 'rgba(30,24,40,0)']} style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 120 }} />
        <BackButton style={{ position: 'absolute', top: insets.top + 8, left: GUTTER }} />
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Share this article"
          onPress={() => shareArticle(a)}
          hitSlop={8}
          style={[styles.roundBtn, { top: insets.top + 8, right: GUTTER }]}
        >
          <Share2 size={19} color={colors.plum} />
        </Pressable>
      </View>

      <View style={styles.sheet}>
        <Text size={13} weight={600} color="aura">
          {a.category}
        </Text>
        <Heading size={36} style={{ marginTop: 6 }} accessibilityRole="header">
          {a.title}
        </Heading>
        <Text size={16.5} color="muted" lineHeight={26} style={{ marginTop: 12 }}>
          {a.excerpt}
        </Text>
        <Pressable
          disabled={!author}
          onPress={() => author && router.push(agentHref(author))}
          accessibilityRole={author ? 'link' : undefined}
          accessibilityLabel={author ? `By ${a.author}, view profile` : undefined}
          style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 18, minHeight: 44 }}
        >
          {author ? <Img src={author.photo} style={{ width: 44, height: 44, borderRadius: 22 }} /> : null}
          <View style={{ flex: 1 }}>
            <Text size={13.5} weight={600} color={author ? 'plum' : 'ink'}>
              {a.author}
              <Text size={13.5} color="muted">
                {' '}
                · {a.authorRole}
              </Text>
            </Text>
            <Text size={13.5} color="muted">
              {a.date} · {a.read} read
            </Text>
          </View>
        </Pressable>

        <View style={{ height: StyleSheet.hairlineWidth, backgroundColor: colors.line, marginVertical: 24 }} />
        <ArticleBody blocks={a.body} />

        {/* Share */}
        <View style={{ marginTop: 32 }}>
          <Text size={12.5} weight={600} color="muted" style={{ marginBottom: 10 }}>
            Share this article
          </Text>
          <View style={{ flexDirection: 'row', gap: 10 }}>
            <Button title="Share" variant="outline" icon={<Share2 size={16} color={colors.plum} />} onPress={() => shareArticle(a)} style={{ flex: 1 }} full />
            <Button
              title="WhatsApp"
              variant="whatsapp"
              icon={<WhatsAppIcon size={16} />}
              onPress={() => whatsapp('', `${a.title} ${articleWebUrl(a)}`)}
              style={{ flex: 1 }}
              full
            />
          </View>
        </View>

        {/* Adviser */}
        <View style={styles.adviser}>
          <Heading size={26} color="white">
            Talk to an adviser
          </Heading>
          <Text size={14.5} color="white" lineHeight={22} style={{ marginTop: 8, opacity: 0.8 }}>
            Questions about this article or your own move? Get straight answers from a RERA-licensed adviser.
          </Text>
          <Button title="Contact us" variant="white" full onPress={() => router.push('/contact')} style={{ marginTop: 18 }} />
        </View>

        {/* Author */}
        <View style={styles.authorBox}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
            {author ? <Img src={author.photo} style={{ width: 64, height: 64, borderRadius: 32 }} /> : null}
            <View style={{ flex: 1 }}>
              <Text size={12.5} weight={600} color="muted">
                Written by
              </Text>
              <Heading size={25}>{a.author}</Heading>
              <Text size={14} color="muted">
                {a.authorRole}
              </Text>
            </View>
          </View>
          {author ? (
            <Text size={14.5} lineHeight={22} style={{ marginTop: 12, opacity: 0.8 }}>
              {author.bio}
            </Text>
          ) : null}
          {author ? (
            <Button
              title="View profile"
              variant="outline"
              iconRight={<ArrowUpRight size={16} color={colors.plum} />}
              onPress={() => router.push(agentHref(author))}
              style={{ marginTop: 16 }}
            />
          ) : (
            <Button title="Meet our agents" variant="outline" onPress={() => router.push('/agents')} style={{ marginTop: 16 }} />
          )}
        </View>

        {/* Prev / next */}
        {older || newer ? (
          <View style={{ gap: 12, marginTop: 16 }} accessibilityLabel="More articles">
            {older ? <NavCard dir="prev" title={older.title} onPress={() => router.replace(articleHref(older))} /> : null}
            {newer ? <NavCard dir="next" title={newer.title} onPress={() => router.replace(articleHref(newer))} /> : null}
          </View>
        ) : null}
      </View>

      {related.length > 0 ? (
        <View style={{ paddingTop: 40, paddingBottom: 8, backgroundColor: colors.white }}>
          <Container>
            <SectionHead
              title="Related articles"
              action={
                <Pressable onPress={() => router.push('/insights')} accessibilityRole="link" hitSlop={10} style={{ flexDirection: 'row', alignItems: 'center', gap: 4, paddingBottom: 4 }}>
                  <Text size={14.5} weight={600} color="aura">
                    All insights
                  </Text>
                  <ArrowRight size={16} color={colors.aura} />
                </Pressable>
              }
            />
          </Container>
          <Carousel data={related} keyOf={(r) => r.slug} render={(r) => <ArticleCard article={r} />} />
          <View style={{ height: 24 }} />
        </View>
      ) : null}
    </Screen>
  )
}

function NavCard({ dir, title, onPress }: { dir: 'prev' | 'next'; title: string; onPress: () => void }) {
  const next = dir === 'next'
  return (
    <Pressable
      accessibilityRole="link"
      accessibilityLabel={`${next ? 'Next' : 'Previous'} article: ${title}`}
      onPress={onPress}
      style={({ pressed }) => [styles.nav, next && { alignItems: 'flex-end' }, { opacity: pressed ? 0.8 : 1 }]}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
        {!next ? <ArrowLeft size={15} color={colors.muted} /> : null}
        <Text size={12.5} weight={600} color="muted">
          {next ? 'Next article' : 'Previous article'}
        </Text>
        {next ? <ArrowRight size={15} color={colors.muted} /> : null}
      </View>
      <Text size={15.5} weight={600} lineHeight={22} align={next ? 'right' : 'left'} style={{ marginTop: 4 }}>
        {title}
      </Text>
    </Pressable>
  )
}

/** Editorial blocks: paragraphs, serif h2, aura-bullet lists, plum-bordered quotes (site: ArticleBody). */
export function ArticleBody({ blocks }: { blocks: ArticleBlock[] }) {
  return (
    <View>
      {blocks.map((b, i) => {
        switch (b.type) {
          case 'h2':
            return (
              <Heading key={i} size={29} style={{ marginTop: i === 0 ? 0 : 32, marginBottom: 4 }} accessibilityRole="header">
                {b.text}
              </Heading>
            )
          case 'list':
            return (
              <View key={i} style={{ gap: 10, marginVertical: 18 }}>
                {b.items.map((item) => (
                  <View key={item} style={{ flexDirection: 'row', gap: 12 }}>
                    <LinearGradient colors={gradients.aura.colors} start={gradients.aura.start} end={gradients.aura.end} style={styles.bullet} />
                    <Text size={16.5} lineHeight={27} style={{ flex: 1, opacity: 0.85 }}>
                      {item}
                    </Text>
                  </View>
                ))}
              </View>
            )
          case 'quote':
            return (
              <View key={i} style={styles.quote}>
                <Text display weight={500} size={25} lineHeight={32} color="plum">
                  “{b.text}”
                </Text>
                {b.cite ? (
                  <Text size={14} weight={600} color="muted" style={{ marginTop: 10 }}>
                    — {b.cite}
                  </Text>
                ) : null}
              </View>
            )
          default:
            return (
              <Text key={i} size={16.5} lineHeight={28} style={{ marginTop: i === 0 ? 0 : 16, opacity: 0.85 }}>
                {b.text}
              </Text>
            )
        }
      })}
    </View>
  )
}

const styles = StyleSheet.create({
  roundBtn: { position: 'absolute', width: 42, height: 42, borderRadius: 21, backgroundColor: 'rgba(255,255,255,0.95)', alignItems: 'center', justifyContent: 'center', ...shadow.soft },
  sheet: { marginTop: -24, borderTopLeftRadius: radius.panel, borderTopRightRadius: radius.panel, backgroundColor: colors.paper, paddingHorizontal: GUTTER, paddingTop: 26, paddingBottom: 40 },
  bullet: { width: 8, height: 8, borderRadius: 4, marginTop: 10 },
  quote: { marginVertical: 24, borderLeftWidth: 4, borderLeftColor: colors.plum, paddingLeft: 18 },
  adviser: { marginTop: 32, borderRadius: radius.card, backgroundColor: colors.plum, padding: 22 },
  authorBox: { marginTop: 16, borderRadius: radius.card, backgroundColor: colors.white, padding: 20, ...shadow.soft },
  nav: { borderRadius: radius.card, borderWidth: 1, borderColor: colors.line, backgroundColor: colors.white, padding: 16 },
})
