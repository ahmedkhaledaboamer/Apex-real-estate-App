import { useLocalSearchParams } from 'expo-router'

import { LegalScreen } from '@/screens/legal/LegalScreen'

export default function Page() {
  const { doc } = useLocalSearchParams<{ doc: string }>()
  return <LegalScreen key={doc} doc={doc} />
}
