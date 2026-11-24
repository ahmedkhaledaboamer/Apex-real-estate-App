import { X } from 'lucide-react-native'
import { useState } from 'react'
import { Modal, Pressable, ScrollView, StyleSheet, useWindowDimensions, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { colors } from '@/theme'
import { Img } from './Img'
import { Text } from './Text'

/**
 * Full-bleed swipeable photo header with a counter; tapping opens the full-screen viewer
 * (site: Gallery + Lightbox). Put overlays (back button, badges) in `children`.
 */
export function Gallery({ images, height = 320, alt = 'Photo', children }: { images: string[]; height?: number; alt?: string; children?: React.ReactNode }) {
  const { width } = useWindowDimensions()
  const [index, setIndex] = useState(0)
  const [viewer, setViewer] = useState<number | null>(null)
  return (
    <View style={{ height, backgroundColor: colors.mist }}>
      <ScrollView horizontal pagingEnabled showsHorizontalScrollIndicator={false} onMomentumScrollEnd={(e) => setIndex(Math.round(e.nativeEvent.contentOffset.x / width))}>
        {images.map((src, i) => (
          <Pressable key={i} onPress={() => setViewer(i)} accessibilityLabel={`${alt} ${i + 1} of ${images.length}. Open full screen`}>
            <Img src={src} style={{ width, height }} />
          </Pressable>
        ))}
      </ScrollView>
      <View style={styles.counter} pointerEvents="none">
        <Text size={12} weight={600} color="white">
          {index + 1} / {images.length}
        </Text>
      </View>
      {children}
      <Lightbox images={images} index={viewer} onClose={() => setViewer(null)} alt={alt} />
    </View>
  )
}

/** Full-screen photo viewer. */
export function Lightbox({ images, index, onClose, alt = 'Photo' }: { images: string[]; index: number | null; onClose: () => void; alt?: string }) {
  const { width, height } = useWindowDimensions()
  const insets = useSafeAreaInsets()
  const [current, setCurrent] = useState(index ?? 0)
  return (
    <Modal visible={index !== null} animationType="fade" onRequestClose={onClose} statusBarTranslucent>
      <View style={styles.viewer}>
        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          contentOffset={{ x: (index ?? 0) * width, y: 0 }}
          onMomentumScrollEnd={(e) => setCurrent(Math.round(e.nativeEvent.contentOffset.x / width))}
        >
          {images.map((src, i) => (
            <Img key={i} src={src} contentFit="contain" style={{ width, height }} accessibilityLabel={`${alt} ${i + 1} of ${images.length}`} />
          ))}
        </ScrollView>
        <View style={[styles.viewerBar, { top: insets.top + 8 }]}>
          <Text size={14} color="white" style={{ opacity: 0.7 }}>
            {current + 1} / {images.length}
          </Text>
          <Pressable onPress={onClose} accessibilityRole="button" accessibilityLabel="Close" hitSlop={10} style={styles.close}>
            <X size={24} color={colors.white} />
          </Pressable>
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  counter: { position: 'absolute', bottom: 14, right: 14, backgroundColor: 'rgba(30,24,40,0.6)', borderRadius: 999, paddingHorizontal: 10, paddingVertical: 4 },
  viewer: { flex: 1, backgroundColor: 'rgba(30,24,40,0.97)' },
  viewerBar: { position: 'absolute', left: 16, right: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  close: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(255,255,255,0.1)' },
})
