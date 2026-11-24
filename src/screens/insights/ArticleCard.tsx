import { router } from 'expo-router'
import { Pressable, StyleSheet, View } from 'react-native'

import type { ArticleDetail } from '@/types'
import { Img } from '@/ui/Img'
import { Heading, Text } from '@/ui/Text'
import { colors, radius, shadow } from '@/theme'
import { articleHref } from './helpers'

/** Card: image, category, title, excerpt, author + date · read (site: ArticleCard). */
export function ArticleCard({ article: a }: { article: ArticleDetail }) {
  return (
    <Pressable
      accessibilityRole="link"
      accessibilityLabel={`${a.category}: ${a.title}`}
      onPress={() => router.push(articleHref(a))}
      style={({ pressed }) => [styles.card, { transform: [{ scale: pressed ? 0.985 : 1 }] }]}
    >
      <Img src={a.image} style={{ aspectRatio: 1.6, backgroundColor: colors.mist }} />
      <View style={{ padding: 18 }}>
        <Text size={12} weight={600} color="aura">
          {a.category}
        </Text>
        <Text size={17.5} weight={600} lineHeight={24} style={{ marginTop: 4 }}>
          {a.title}
        </Text>
        <Text size={14} color="muted" lineHeight={21} numberOfLines={3} style={{ marginTop: 6 }}>
          {a.excerpt}
        </Text>
        <View style={styles.meta}>
          <Text size={12.5} weight={500} style={{ opacity: 0.8 }}>
            {a.author}
          </Text>
          <Text size={12.5} color="muted">
            {a.date} · {a.read} read
          </Text>
        </View>
      </View>
    </Pressable>
  )
}

/** Large card for the latest article (site: FeaturedArticleCard). */
export function FeaturedArticleCard({ article: a }: { article: ArticleDetail }) {
  return (
    <Pressable
      accessibilityRole="link"
      accessibilityLabel={`Latest: ${a.title}`}
      onPress={() => router.push(articleHref(a))}
      style={({ pressed }) => [styles.card, { transform: [{ scale: pressed ? 0.985 : 1 }] }]}
    >
      <View>
        <Img src={a.image} style={{ aspectRatio: 1.45, backgroundColor: colors.mist }} />
        <View style={styles.latest}>
          <Text size={12} weight={600} color="plum">
            Latest
          </Text>
        </View>
      </View>
      <View style={{ padding: 20 }}>
        <Text size={13} weight={600} color="aura">
          {a.category}
        </Text>
        <Heading size={30} style={{ marginTop: 6 }}>
          {a.title}
        </Heading>
        <Text size={15} color="muted" lineHeight={23} style={{ marginTop: 10 }}>
          {a.excerpt}
        </Text>
        <View style={{ marginTop: 16 }}>
          <Text size={13} weight={600}>
            {a.author}
          </Text>
          <Text size={13} color="muted">
            {a.authorRole} · {a.date} · {a.read} read
          </Text>
        </View>
      </View>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  card: { backgroundColor: colors.white, borderRadius: radius.card, overflow: 'hidden', ...shadow.soft },
  meta: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', columnGap: 12, rowGap: 2, marginTop: 14 },
  latest: { position: 'absolute', top: 12, left: 12, backgroundColor: 'rgba(255,255,255,0.95)', borderRadius: radius.pill, paddingHorizontal: 10, paddingVertical: 4 },
})
