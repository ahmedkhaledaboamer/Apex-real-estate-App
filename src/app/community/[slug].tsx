import { useLocalSearchParams } from 'expo-router'

import { CommunityScreen } from '@/screens/communities/CommunityScreen'

export default function Page() {
  const { slug } = useLocalSearchParams<{ slug: string }>()
  return <CommunityScreen slug={String(slug)} />
}
