import { router } from 'expo-router'
import { BadgeCheck, Bath, BedDouble, Heart, Maximize2, Phone } from 'lucide-react-native'
import { memo, useState } from 'react'
import { Pressable, ScrollView, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native'

import { useCurrency, useFavorite } from '@/features/favorites/hooks'
import { formatNumber, formatPrice } from '@/lib/format'
import { agentProfileById } from '@/mocks/agents'
import { colors, radius, shadow } from '@/theme'
import type { Listing } from '@/types'
import { call, whatsapp } from './brand'
import { WhatsAppIcon } from './icons'
import { Img } from './Img'
import { Text } from './Text'

export const propertyHref = (l: Pick<Listing, 'id'>) => `/property/${l.id}` as const

/**
 * Listing card — same content and hierarchy as the website's PropertyCard: swipeable photos,
 * Verified badge, favourite, payment-plan badge for off-plan, price in the chosen currency,
 * key facts, permit, agent with call / WhatsApp.
 */
export const PropertyCard = memo(function PropertyCard({ listing, style, width }: { listing: Listing; style?: StyleProp<ViewStyle>; width?: number }) {
  const currency = useCurrency()
  const { favorite, toggle } = useFavorite(listing.id)
  const agent = agentProfileById(listing.agentId)
  const [w, setW] = useState(width ?? 0)
  const [index, setIndex] = useState(0)
  const open = () => router.push(propertyHref(listing))

  return (
    <View style={[styles.card, width ? { width } : null, style]} onLayout={(e) => !width && setW(e.nativeEvent.layout.width)}>
      <View style={styles.media}>
        {w > 0 ? (
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={(e) => setIndex(Math.round(e.nativeEvent.contentOffset.x / w))}
          >
            {listing.images.map((src, i) => (
              <Pressable key={i} onPress={open} accessibilityLabel={`${listing.title}, photo ${i + 1} of ${listing.images.length}`}>
                <Img src={src} style={{ width: w, height: w / 1.6 }} />
              </Pressable>
            ))}
          </ScrollView>
        ) : (
          <View style={{ aspectRatio: 1.6 }} />
        )}

        <View style={styles.topRow} pointerEvents="box-none">
          <View style={styles.verified}>
            <BadgeCheck size={14} color={colors.success} />
            <Text size={12} weight={600} color="success">
              Verified
            </Text>
          </View>
          <Pressable
            onPress={toggle}
            accessibilityRole="button"
            accessibilityState={{ selected: favorite }}
            accessibilityLabel={favorite ? 'Remove from favourites' : 'Save to favourites'}
            hitSlop={8}
            style={styles.heart}
          >
            <Heart size={18} color={favorite ? colors.aura : colors.ink} fill={favorite ? colors.aura : 'transparent'} />
          </Pressable>
        </View>

        {listing.kind === 'offplan' && listing.paymentPlan ? (
          <View style={styles.plan}>
            <Text size={12} weight={600} color="white">
              {listing.paymentPlan} plan · {listing.handover}
            </Text>
          </View>
        ) : null}

        {/* With the off-plan badge bottom-left, the dots move to the end so they never overlap. */}
        <View style={[styles.dots, listing.kind === 'offplan' && listing.paymentPlan ? styles.dotsEnd : null]} pointerEvents="none">
          {listing.images.map((_, i) => (
            <View key={i} style={[styles.dot, i === index ? { width: 16, backgroundColor: colors.white } : null]} />
          ))}
        </View>
      </View>

      <Pressable onPress={open} accessibilityRole="link" style={styles.body}>
        <Text size={22} weight={700} color="plum" tracking={-0.01}>
          {formatPrice(listing.priceAed, currency)}
          {listing.kind === 'rent' ? (
            <Text size={14} weight={500} color="muted">
              {' '}
              /year
            </Text>
          ) : null}
        </Text>
        <Text size={15} weight={600} numberOfLines={1} style={{ marginTop: 2 }}>
          {listing.title}
        </Text>
        <Text size={14} color="muted">
          {listing.community} · {listing.type}
        </Text>

        <View style={styles.facts}>
          <Fact icon={<BedDouble size={16} color={colors.muted} />} label={listing.beds === 0 ? 'Studio' : `${listing.beds} bed`} />
          <Fact icon={<Bath size={16} color={colors.muted} />} label={`${listing.baths} bath`} />
          <Fact icon={<Maximize2 size={16} color={colors.muted} />} label={`${formatNumber(listing.sqft)} sq ft`} />
        </View>
        <Text size={11.5} color="muted" style={{ marginTop: 10 }}>
          Permit # {listing.permit}
        </Text>
      </Pressable>

      <View style={styles.agent}>
        <Img src={agent.photo} style={styles.avatar} />
        <View style={{ flex: 1 }}>
          <Text size={13} weight={600} numberOfLines={1}>
            {agent.name}
          </Text>
          <Text size={11.5} color="muted">
            BRN {agent.brn}
          </Text>
        </View>
        <Pressable accessibilityRole="button" accessibilityLabel={`Call ${agent.name}`} onPress={() => call(agent.phone)} style={styles.callBtn} hitSlop={4}>
          <Phone size={16} color={colors.plum} />
        </Pressable>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`WhatsApp ${agent.name}`}
          onPress={() => whatsapp(agent.whatsapp, `Hi ${agent.name.split(' ')[0]}, I'm interested in ${listing.title} (permit ${listing.permit}).`)}
          style={styles.waBtn}
          hitSlop={4}
        >
          <WhatsAppIcon size={16} color={colors.white} />
        </Pressable>
      </View>
    </View>
  )
})

function Fact({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
      {icon}
      <Text size={13.5} color="ink" style={{ opacity: 0.8 }}>
        {label}
      </Text>
    </View>
  )
}

/** Loading placeholder with the card's proportions. */
export function PropertyCardSkeleton() {
  return (
    <View style={[styles.card, { overflow: 'hidden' }]}>
      <View style={{ aspectRatio: 1.6, backgroundColor: colors.mist }} />
      <View style={{ padding: 20, gap: 10 }}>
        <View style={{ height: 22, width: '40%', borderRadius: 6, backgroundColor: colors.mist }} />
        <View style={{ height: 14, width: '75%', borderRadius: 6, backgroundColor: colors.mist }} />
        <View style={{ height: 14, width: '50%', borderRadius: 6, backgroundColor: colors.mist }} />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  card: { backgroundColor: colors.white, borderRadius: radius.card, overflow: 'hidden', ...shadow.soft },
  media: { backgroundColor: colors.mist },
  topRow: { position: 'absolute', top: 12, left: 12, right: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  verified: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: 'rgba(255,255,255,0.95)', borderRadius: radius.pill, paddingHorizontal: 10, paddingVertical: 4 },
  heart: { width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(255,255,255,0.95)', alignItems: 'center', justifyContent: 'center' },
  plan: { position: 'absolute', bottom: 12, left: 12, backgroundColor: 'rgba(56,26,76,0.85)', borderRadius: radius.pill, paddingHorizontal: 10, paddingVertical: 4 },
  dots: { position: 'absolute', bottom: 12, left: 0, right: 0, flexDirection: 'row', justifyContent: 'center', gap: 6 },
  dotsEnd: { left: undefined, right: 14, bottom: 19, justifyContent: 'flex-end' },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.6)' },
  body: { paddingHorizontal: 20, paddingTop: 18 },
  facts: { flexDirection: 'row', flexWrap: 'wrap', columnGap: 16, rowGap: 4, marginTop: 14 },
  agent: { flexDirection: 'row', alignItems: 'center', gap: 12, marginHorizontal: 20, marginTop: 14, paddingVertical: 14, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: colors.line },
  avatar: { width: 36, height: 36, borderRadius: 18 },
  callBtn: { width: 36, height: 36, borderRadius: 18, borderWidth: 1, borderColor: colors.line, alignItems: 'center', justifyContent: 'center' },
  waBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: colors.whatsapp, alignItems: 'center', justifyContent: 'center' },
})
