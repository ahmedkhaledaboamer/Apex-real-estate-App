import { forwardRef } from 'react'
import { ScrollView, View, type ScrollViewProps } from 'react-native'

import { colors } from '@/theme'
import { AppBar, ScreenHeader } from './brand'
import { Heading, Text } from './Text'

type Props = ScrollViewProps & { variant?: 'tab' | 'pushed' | 'bare'; title?: string; headerRight?: React.ReactNode }

/**
 * Scrollable page. `variant="tab"` shows the app bar (tab screens); `variant="pushed"` shows a back header
 * (with an optional title); `variant="bare"` shows nothing (full-bleed heroes manage their own header).
 * The ref is the inner ScrollView (e.g. `ref.current?.scrollTo({ y })` to jump to a form).
 */
export const Screen = forwardRef<React.ComponentRef<typeof ScrollView>, Props>(function Screen(
  { children, variant = 'pushed', title, headerRight, contentContainerStyle, ...rest },
  ref,
) {
  return (
    <View style={{ flex: 1, backgroundColor: colors.paper }}>
      {variant === 'tab' ? <AppBar /> : variant === 'pushed' ? <ScreenHeader title={title} right={headerRight} /> : null}
      <ScrollView ref={ref} keyboardShouldPersistTaps="handled" contentContainerStyle={[{ paddingBottom: 48 }, contentContainerStyle]} {...rest}>
        {children}
      </ScrollView>
    </View>
  )
})

/** Temporary body for screens not built yet. */
export function Placeholder({ title }: { title: string }) {
  return (
    <View style={{ padding: 20, gap: 8 }}>
      <Heading size={34}>{title}</Heading>
      <Text color="muted">This screen is being built.</Text>
    </View>
  )
}
