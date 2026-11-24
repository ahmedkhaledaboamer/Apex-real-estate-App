import { useLocalSearchParams } from 'expo-router'

import { ProjectScreen } from '@/screens/offplan/ProjectScreen'

export default function Page() {
  const { slug } = useLocalSearchParams<{ slug: string }>()
  return <ProjectScreen slug={String(slug)} />
}
