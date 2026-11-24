import { useLocalSearchParams } from 'expo-router'

import { ArticleScreen } from '@/screens/insights/ArticleScreen'

export default function Page() {
  const { slug } = useLocalSearchParams<{ slug: string }>()
  return <ArticleScreen key={slug} slug={String(slug ?? '')} />
}
