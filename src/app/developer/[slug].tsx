import { useLocalSearchParams } from 'expo-router'

import { DeveloperScreen } from '@/screens/developers/DeveloperScreen'

export default function Page() {
  const { slug } = useLocalSearchParams<{ slug: string }>()
  return <DeveloperScreen slug={String(slug)} />
}
