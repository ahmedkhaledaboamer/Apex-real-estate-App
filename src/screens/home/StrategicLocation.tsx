import { ArrowRight } from 'lucide-react-native'
import { memo } from 'react'
import { Pressable, StyleSheet, useWindowDimensions, View } from 'react-native'
import Svg, { Circle, Defs, G, LinearGradient, Mask, Path, RadialGradient, Rect, Stop, Text as SvgText } from 'react-native-svg'

import { MAP_CITIES, MAP_HEIGHT, MAP_WIDTH, type MapCityKey } from '@/features/location/mapData'
import { LAND_DOTS_PATH } from '@/features/location/mapDots'
import { OFFICE_MAP_URL } from '@/lib/constants'
import { colors, fonts, GUTTER, radius } from '@/theme'
import { openUrl } from '@/ui/brand'
import { Text } from '@/ui/Text'

type LabelPos = 'above' | 'below' | 'start' | 'end'
const ORIGINS: { key: Exclude<MapCityKey, 'dubai'>; labelPos: LabelPos }[] = [
  { key: 'london', labelPos: 'below' },
  { key: 'berlin', labelPos: 'above' },
  { key: 'moscow', labelPos: 'above' },
  { key: 'istanbul', labelPos: 'start' },
  { key: 'cairo', labelPos: 'below' },
  { key: 'riyadh', labelPos: 'start' },
  { key: 'karachi', labelPos: 'end' },
  { key: 'delhi', labelPos: 'above' },
  { key: 'mumbai', labelPos: 'below' },
]
const HUB = MAP_CITIES.dubai
const LABEL_SIZE = 25

/** Same arc as the website's ConnectionsMap: quadratic, bowed upwards, more for longer routes. */
function arcPath(x1: number, y1: number, x2: number, y2: number) {
  const mx = (x1 + x2) / 2
  const my = (y1 + y2) / 2
  const dx = x2 - x1
  const dy = y2 - y1
  const len = Math.hypot(dx, dy)
  let nx = dy / len
  let ny = -dx / len
  if (ny > 0) {
    nx = -nx
    ny = -ny
  }
  const bow = Math.min(len * 0.32, 150)
  return `M${x1} ${y1} Q${mx + nx * bow} ${my + ny * bow} ${x2} ${y2}`
}

/** Label offset; SVG baselines are unreliable on native, so vertical centering is done by hand. */
function labelProps(pos: LabelPos, x: number, y: number) {
  switch (pos) {
    case 'above':
      return { x, y: y - 12, textAnchor: 'middle' as const }
    case 'below':
      return { x, y: y + 12 + LABEL_SIZE * 0.8, textAnchor: 'middle' as const }
    case 'start':
      return { x: x - 12, y: y + LABEL_SIZE * 0.35, textAnchor: 'end' as const }
    case 'end':
      return { x: x + 12, y: y + LABEL_SIZE * 0.35, textAnchor: 'start' as const }
  }
}

const ConnectionsMap = memo(function ConnectionsMap({ width }: { width: number }) {
  return (
    <Svg width={width} height={(width * MAP_HEIGHT) / MAP_WIDTH} viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`} accessibilityLabel="Map showing routes from London, Berlin, Moscow, Istanbul, Cairo, Riyadh, Karachi, New Delhi and Mumbai to Dubai">
      <Defs>
        <LinearGradient id="arc" x1="0" y1="0" x2="1" y2="0">
          <Stop offset="0" stopColor="#843F96" />
          <Stop offset="1" stopColor="#3CB4E8" />
        </LinearGradient>
        <RadialGradient id="fade" cx="0.62" cy="0.62" r="0.7">
          <Stop offset="0" stopColor="#fff" stopOpacity="1" />
          <Stop offset="1" stopColor="#fff" stopOpacity="0.45" />
        </RadialGradient>
        <Mask id="landMask" x="0" y="0" width={MAP_WIDTH} height={MAP_HEIGHT} maskUnits="userSpaceOnUse">
          <Rect x="0" y="0" width={MAP_WIDTH} height={MAP_HEIGHT} fill="url(#fade)" />
        </Mask>
      </Defs>

      <Path d={LAND_DOTS_PATH} stroke="#fff" strokeOpacity={0.34} strokeWidth={3} strokeLinecap="round" mask="url(#landMask)" />

      {ORIGINS.map((o) => {
        const c = MAP_CITIES[o.key]
        const l = labelProps(o.labelPos, c.x, c.y)
        return (
          <G key={o.key}>
            <Path d={arcPath(c.x, c.y, HUB.x, HUB.y)} fill="none" stroke="url(#arc)" strokeWidth={2} strokeLinecap="round" />
            <Circle cx={c.x} cy={c.y} r={5} fill={colors.ink} stroke="#fff" strokeOpacity={0.75} strokeWidth={1.6} />
            <SvgText {...l} fill="#fff" fillOpacity={0.72} fontSize={LABEL_SIZE} fontFamily={fonts.sans[500]}>
              {c.label}
            </SvgText>
          </G>
        )
      })}

      <G>
        <Circle cx={HUB.x} cy={HUB.y} r={22} fill="#3CB4E8" opacity={0.18} />
        <Circle cx={HUB.x} cy={HUB.y} r={14} fill="#3CB4E8" opacity={0.3} />
        <Circle cx={HUB.x} cy={HUB.y} r={8} fill={colors.ink} stroke="#3CB4E8" strokeWidth={3} />
        <Circle cx={HUB.x} cy={HUB.y} r={3} fill="#fff" />
        <SvgText x={HUB.x} y={HUB.y + 22 + 30 * 0.8} textAnchor="middle" fill="#fff" fontSize={30} fontFamily={fonts.sans[600]}>
          Dubai
        </SvgText>
      </G>
    </Svg>
  )
})

/** Soft radial brand glow (site: radial-gradient blobs). */
function Glow({ id, size, color, opacity, style }: { id: string; size: number; color: string; opacity: number; style: object }) {
  return (
    <View pointerEvents="none" style={[{ position: 'absolute', width: size, height: size }, style]}>
      <Svg width={size} height={size}>
        <Defs>
          <RadialGradient id={id} cx="0.5" cy="0.5" r="0.5">
            <Stop offset="0" stopColor={color} stopOpacity={opacity} />
            <Stop offset="1" stopColor={color} stopOpacity={0} />
          </RadialGradient>
        </Defs>
        <Rect width={size} height={size} fill={`url(#${id})`} />
      </Svg>
    </View>
  )
}

/** Dark band: our Dubai Marina office and the routes into Dubai (site: StrategicLocation). */
export function StrategicLocation() {
  const { width } = useWindowDimensions()
  return (
    <View style={styles.band}>
      <Glow id="glowA" size={640} color="#3CB4E8" opacity={0.22} style={{ right: -260, bottom: -260 }} />
      <Glow id="glowB" size={520} color="#843F96" opacity={0.18} style={{ left: -240, top: -240 }} />
      <View style={{ paddingHorizontal: GUTTER }}>
        <Text size={12.5} weight={600} color="cyan" tracking={0.32}>
          STRATEGIC LOCATION
        </Text>
        <Text display weight={600} size={36} lineHeight={38} color="white" style={{ marginTop: 14 }} accessibilityRole="header">
          From Dubai Marina, at the heart of the world
        </Text>
        <Text size={15.5} lineHeight={25} color="white" style={{ marginTop: 16, opacity: 0.7 }}>
          Our office sits in Dubai Marina, within a few hours’ flight of London, Moscow, Karachi, New Delhi, Mumbai and the Gulf — so you can view, sign and collect your keys without the guesswork.
        </Text>
      </View>

      <Pressable accessibilityRole="link" accessibilityLabel="Open our office in Google Maps" onPress={() => openUrl(OFFICE_MAP_URL)} style={{ marginTop: 24 }}>
        <ConnectionsMap width={width} />
      </Pressable>

      <View style={{ paddingHorizontal: GUTTER, marginTop: 8 }}>
        <Pressable accessibilityRole="link" onPress={() => openUrl(OFFICE_MAP_URL)} style={({ pressed }) => [styles.cta, pressed && { backgroundColor: colors.white }]}>
          {({ pressed }) => (
            <>
              <Text size={15} weight={600} color={pressed ? 'plum' : 'white'}>
                Explore our location
              </Text>
              <ArrowRight size={16} color={pressed ? colors.plum : colors.white} />
            </>
          )}
        </Pressable>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  band: { backgroundColor: colors.ink, paddingVertical: 56, overflow: 'hidden' },
  cta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    alignSelf: 'flex-start',
    height: 48,
    paddingHorizontal: 24,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.25)',
  },
})
