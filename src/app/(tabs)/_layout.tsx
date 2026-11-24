import { Tabs } from 'expo-router'
import { Calculator, Heart, Home, Menu, Search } from 'lucide-react-native'

import { useAppSelector } from '@/store/hooks'
import { colors, fonts } from '@/theme'

/** Bottom tabs: Home · Search · Saved · Tools · More. */
export default function TabsLayout() {
  const saved = useAppSelector((s) => s.favorites.ids.length)
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.aura,
        tabBarInactiveTintColor: colors.muted,
        tabBarStyle: { backgroundColor: colors.white, borderTopColor: colors.line },
        tabBarLabelStyle: { fontFamily: fonts.sans[600], fontSize: 11 },
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Home', tabBarIcon: ({ color, size }) => <Home color={color} size={size} /> }} />
      <Tabs.Screen name="search" options={{ title: 'Search', tabBarIcon: ({ color, size }) => <Search color={color} size={size} /> }} />
      <Tabs.Screen
        name="saved"
        options={{
          title: 'Saved',
          tabBarIcon: ({ color, size }) => <Heart color={color} size={size} />,
          tabBarBadge: saved > 0 ? saved : undefined,
          tabBarBadgeStyle: { backgroundColor: colors.aura, fontFamily: fonts.sans[700], fontSize: 10 },
        }}
      />
      <Tabs.Screen name="tools" options={{ title: 'Tools', tabBarIcon: ({ color, size }) => <Calculator color={color} size={size} /> }} />
      <Tabs.Screen name="more" options={{ title: 'More', tabBarIcon: ({ color, size }) => <Menu color={color} size={size} /> }} />
    </Tabs>
  )
}
