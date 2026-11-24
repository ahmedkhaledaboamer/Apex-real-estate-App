import { View } from 'react-native'

import { Screen } from '@/ui/Screen'
import { Hero } from './Hero'
import {
  Agents,
  Communities,
  Developers,
  FeaturedProperties,
  FinalCta,
  Insights,
  OffPlanLaunches,
  PhotoBand,
  Services,
  StatsStrip,
  Testimonials,
  Valuation,
} from './sections'
import { StrategicLocation } from './StrategicLocation'

/** Home tab — same sections, in the same order, as the website's home page. */
export function HomeScreen() {
  return (
    <Screen variant="tab" contentContainerStyle={{ paddingBottom: 24 }}>
      <Hero />
      <StatsStrip />
      <FeaturedProperties />
      <Communities />
      <PhotoBand />
      <OffPlanLaunches />
      <Developers />
      <StrategicLocation />
      <Services />
      <Valuation />
      <Insights />
      <Agents />
      <Testimonials />
      <FinalCta />
      <View style={{ height: 8 }} />
    </Screen>
  )
}
