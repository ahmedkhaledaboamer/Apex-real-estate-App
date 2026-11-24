import { useLocalSearchParams } from 'expo-router'

import { AgentProfileScreen } from '@/screens/agents/AgentProfileScreen'

export default function Page() {
  const { slug } = useLocalSearchParams<{ slug: string }>()
  return <AgentProfileScreen key={slug} slug={String(slug ?? '')} />
}
