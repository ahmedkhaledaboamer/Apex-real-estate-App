import { CormorantGaramond_500Medium, CormorantGaramond_500Medium_Italic, CormorantGaramond_600SemiBold, CormorantGaramond_700Bold } from '@expo-google-fonts/cormorant-garamond'
import { IBMPlexSansArabic_400Regular, IBMPlexSansArabic_500Medium, IBMPlexSansArabic_600SemiBold } from '@expo-google-fonts/ibm-plex-sans-arabic'
import { PlusJakartaSans_400Regular, PlusJakartaSans_500Medium, PlusJakartaSans_600SemiBold, PlusJakartaSans_700Bold, useFonts } from '@expo-google-fonts/plus-jakarta-sans'
import { DefaultTheme, Stack, ThemeProvider } from 'expo-router'
import * as SplashScreen from 'expo-splash-screen'
import { StatusBar } from 'expo-status-bar'
import { useCallback, useState } from 'react'
import { SafeAreaProvider } from 'react-native-safe-area-context'

import { StoreProvider } from '@/state/store'
import { colors } from '@/theme'

SplashScreen.preventAutoHideAsync()

const theme = {
  ...DefaultTheme,
  colors: { ...DefaultTheme.colors, background: colors.paper, card: colors.paper, primary: colors.aura, text: colors.ink, border: colors.line },
}

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    PlusJakartaSans_400Regular,
    PlusJakartaSans_500Medium,
    PlusJakartaSans_600SemiBold,
    PlusJakartaSans_700Bold,
    CormorantGaramond_500Medium,
    CormorantGaramond_600SemiBold,
    CormorantGaramond_700Bold,
    CormorantGaramond_500Medium_Italic,
    IBMPlexSansArabic_400Regular,
    IBMPlexSansArabic_500Medium,
    IBMPlexSansArabic_600SemiBold,
  })
  const [storeReady, setStoreReady] = useState(false)
  const onStoreReady = useCallback(() => setStoreReady(true), [])

  const ready = (fontsLoaded || !!fontError) && storeReady
  if (ready) void SplashScreen.hideAsync()

  return (
    <SafeAreaProvider>
      <ThemeProvider value={theme}>
        <StoreProvider onReady={onStoreReady}>
          {fontsLoaded || fontError ? (
            <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.paper }, animation: 'slide_from_right' }}>
              <Stack.Screen name="(tabs)" />
            </Stack>
          ) : null}
        </StoreProvider>
        <StatusBar style="dark" />
      </ThemeProvider>
    </SafeAreaProvider>
  )
}
