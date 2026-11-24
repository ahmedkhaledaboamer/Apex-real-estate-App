import { FlatList, useWindowDimensions, View } from 'react-native'

import { GUTTER } from '@/theme'

/** Horizontal snapping carousel with the page gutter (site: card grids). `peek` = visible width of the next card. */
export function Carousel<T>({
  data,
  keyOf,
  render,
  peek = 56,
  maxWidth = 340,
  gap = 14,
}: {
  data: T[]
  keyOf: (item: T) => string
  render: (item: T, width: number) => React.ReactElement
  peek?: number
  maxWidth?: number
  gap?: number
}) {
  const { width: screen } = useWindowDimensions()
  const w = Math.min(maxWidth, screen - GUTTER * 2 - (data.length > 1 ? peek : 0))
  return (
    <FlatList
      horizontal
      data={data}
      keyExtractor={keyOf}
      showsHorizontalScrollIndicator={false}
      snapToInterval={w + gap}
      decelerationRate="fast"
      snapToAlignment="start"
      contentContainerStyle={{ paddingHorizontal: GUTTER, paddingVertical: 6 }}
      ItemSeparatorComponent={() => <View style={{ width: gap }} />}
      renderItem={({ item }) => <View style={{ width: w }}>{render(item, w)}</View>}
    />
  )
}
