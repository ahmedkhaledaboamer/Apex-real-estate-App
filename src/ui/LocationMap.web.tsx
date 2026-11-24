import { MapPin } from 'lucide-react-native'
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native'

import { colors, radius } from '@/theme'
import type { LatLng } from '@/types'
import { Text } from './Text'

export type MapMarker = { id: string; position: LatLng; label?: string; active?: boolean }

/** Browser preview fallback: react-native-maps is native-only. Shows the pins as a list. */
export function LocationMap({ markers, style }: { markers: MapMarker[]; style?: StyleProp<ViewStyle>; onMarkerPress?: (id: string) => void; interactive?: boolean }) {
  return (
    <View style={[styles.wrap, style]}>
      <MapPin size={22} color={colors.aura} />
      <Text size={13} weight={600} color="plum">
        Map (opens on the phone app)
      </Text>
      <Text size={12} color="muted" numberOfLines={2} align="center">
        {markers.slice(0, 4).map((m) => m.label ?? `${m.position.lat.toFixed(3)}, ${m.position.lng.toFixed(3)}`).join(' · ')}
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  wrap: { borderRadius: radius.card, backgroundColor: colors.mist, alignItems: 'center', justifyContent: 'center', gap: 6, padding: 16 },
})
