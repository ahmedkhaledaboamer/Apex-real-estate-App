import { X } from 'lucide-react-native'
import { KeyboardAvoidingView, Modal, Platform, Pressable, ScrollView, StyleSheet, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { colors, radius } from '@/theme'
import { Heading } from './Text'

/** Bottom sheet (site: Modal / mobile drawer). Slides up, closes on backdrop tap or the X. */
export function Sheet({
  open,
  onClose,
  title,
  children,
  scroll = true,
}: {
  open: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
  scroll?: boolean
}) {
  const insets = useSafeAreaInsets()
  return (
    <Modal visible={open} transparent animationType="slide" onRequestClose={onClose} statusBarTranslucent>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.fill}>
        <Pressable style={styles.backdrop} onPress={onClose} accessibilityLabel="Close" />
        <View style={[styles.panel, { paddingBottom: insets.bottom + 16 }]}>
          <View style={styles.grabber} />
          <View style={styles.head}>
            {title ? <Heading size={26} style={{ flex: 1 }}>{title}</Heading> : <View style={{ flex: 1 }} />}
            <Pressable onPress={onClose} accessibilityRole="button" accessibilityLabel="Close" hitSlop={10} style={styles.close}>
              <X size={20} color={colors.ink} />
            </Pressable>
          </View>
          {scroll ? (
            <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 8 }}>
              {children}
            </ScrollView>
          ) : (
            <View style={{ paddingHorizontal: 20 }}>{children}</View>
          )}
        </View>
      </KeyboardAvoidingView>
    </Modal>
  )
}

const styles = StyleSheet.create({
  fill: { flex: 1, justifyContent: 'flex-end' },
  backdrop: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: colors.overlay },
  panel: { backgroundColor: colors.paper, borderTopLeftRadius: radius.panel, borderTopRightRadius: radius.panel, maxHeight: '90%' },
  grabber: { alignSelf: 'center', width: 40, height: 4, borderRadius: 2, backgroundColor: colors.line, marginTop: 10 },
  head: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingTop: 12, paddingBottom: 12, gap: 12 },
  close: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.mist },
})
