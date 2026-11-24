import { FlatList, useWindowDimensions, View, type ListRenderItemInfo } from 'react-native'

import { GUTTER } from '@/theme'

const GAP = 14

/** Card width for a "one card + a peek of the next" carousel on the current screen. */
export function useCarouselWidth(peek = 44, max = 380) {
  const { width } = useWindowDimensions()
  return Math.min(max, width - GUTTER * 2 - peek)
}

/**
 * Horizontal, snapping card carousel with the page gutter on both ends
 * (mobile replacement for the website's card grids).
 */
export function Carousel<T>({
  data,
  itemWidth,
  keyExtractor,
  renderItem,
  label,
}: {
  data: readonly T[]
  itemWidth: number
  keyExtractor: (item: T, index: number) => string
  renderItem: (item: T, index: number) => React.ReactElement
  label?: string
}) {
  return (
    <FlatList
      horizontal
      data={data as T[]}
      accessibilityLabel={label}
      keyExtractor={keyExtractor}
      renderItem={({ item, index }: ListRenderItemInfo<T>) => <View style={{ width: itemWidth }}>{renderItem(item, index)}</View>}
      ItemSeparatorComponent={Separator}
      showsHorizontalScrollIndicator={false}
      snapToInterval={itemWidth + GAP}
      snapToAlignment="start"
      decelerationRate="fast"
      disableIntervalMomentum
      contentContainerStyle={{ paddingHorizontal: GUTTER, paddingVertical: 6 }}
      style={{ flexGrow: 0 }}
    />
  )
}

function Separator() {
  return <View style={{ width: GAP }} />
}
