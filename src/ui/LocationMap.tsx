import { useEffect, useRef } from 'react'
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native'
import MapView, { Marker } from 'react-native-maps'

import { colors, radius } from '@/theme'
import type { LatLng } from '@/types'
import { Text } from './Text'

export type MapMarker = { id: string; position: LatLng; label?: string; active?: boolean }

/**
 * Map with branded pins (site: LocationMap). react-native-maps — included in Expo Go, no API key
 * needed for development. Auto-fits to the markers. (`LocationMap.web.tsx` is the browser fallback.)
 */
export function LocationMap({
  markers,
  style,
  onMarkerPress,
  interactive = true,
}: {
  markers: MapMarker[]
  style?: StyleProp<ViewStyle>
  onMarkerPress?: (id: string) => void
  interactive?: boolean
}) {
  const ref = useRef<MapView>(null)
  const key = markers.map((m) => `${m.position.lat},${m.position.lng}`).join('|')
  const first = markers[0]?.position ?? { lat: 25.15, lng: 55.25 }

  useEffect(() => {
    if (markers.length < 2) return
    const t = setTimeout(
      () =>
        ref.current?.fitToCoordinates(
          markers.map((m) => ({ latitude: m.position.lat, longitude: m.position.lng })),
          { edgePadding: { top: 60, right: 60, bottom: 60, left: 60 }, animated: false },
        ),
      300,
    )
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key])

  return (
    <View style={[styles.wrap, style]}>
      <MapView
        ref={ref}
        style={StyleSheet.absoluteFill}
        initialRegion={{ latitude: first.lat, longitude: first.lng, latitudeDelta: markers.length > 1 ? 0.2 : 0.03, longitudeDelta: markers.length > 1 ? 0.2 : 0.03 }}
        scrollEnabled={interactive}
        zoomEnabled={interactive}
        rotateEnabled={false}
        pitchEnabled={false}
        toolbarEnabled={false}
      >
        {markers.map((m) => (
          <Marker
            key={m.id}
            coordinate={{ latitude: m.position.lat, longitude: m.position.lng }}
            onPress={() => onMarkerPress?.(m.id)}
            tracksViewChanges={false}
            zIndex={m.active ? 10 : 1}
          >
            {m.label ? (
              <View style={[styles.pill, { backgroundColor: m.active ? colors.aura : colors.plum }]}>
                <Text size={12} weight={600} color="white">
                  {m.label}
                </Text>
              </View>
            ) : (
              <View style={styles.dot} />
            )}
          </Marker>
        ))}
      </MapView>
    </View>
  )
}

const styles = StyleSheet.create({
  wrap: { overflow: 'hidden', borderRadius: radius.card, backgroundColor: colors.mist },
  pill: { paddingHorizontal: 9, paddingVertical: 5, borderRadius: radius.pill, borderWidth: 2, borderColor: colors.white },
  dot: { width: 18, height: 18, borderRadius: 9, backgroundColor: colors.aura, borderWidth: 3, borderColor: colors.white },
})
