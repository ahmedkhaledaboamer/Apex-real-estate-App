import { ExternalLink, Landmark, ShieldCheck } from 'lucide-react-native'
import { StyleSheet, View } from 'react-native'

import { colors, radius } from '@/theme'
import type { OffPlanProjectDetail } from '@/types'
import { openUrl } from '@/ui/brand'
import { Button } from '@/ui/Button'
import { Heading, Text } from '@/ui/Text'

const POINTS = [
  'Pay instalments only into the escrow account named in your Sales & Purchase Agreement, never to an individual.',
  'Your purchase is registered on the DLD’s Oqood system, and you receive a certificate in your name.',
  'Handover dates are the developer’s estimate and can change; the SPA sets out what happens if they do.',
]

/** DLD registration + escrow details with a link to verify on the DLD website (site: RegulatoryBox). */
export function RegulatoryBox({ project }: { project: OffPlanProjectDetail }) {
  return (
    <View style={styles.box}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
        <View style={styles.icon}>
          <ShieldCheck size={24} color={colors.white} />
        </View>
        <Heading size={30} style={{ flex: 1 }}>
          Regulatory details
        </Heading>
      </View>
      <Text size={14.5} color="muted" style={{ marginTop: 10 }}>
        Off-plan projects in Dubai must be registered with the Dubai Land Department, and buyer payments must go into a project escrow account held by an approved bank.
      </Text>

      <View style={{ gap: 10, marginTop: 18 }}>
        <Fact icon={<Landmark size={16} color={colors.muted} />} label="DLD project number" value={project.dldProjectNumber} />
        <Fact icon={<ShieldCheck size={16} color={colors.muted} />} label="Escrow account bank" value={project.escrowBank} />
      </View>

      <View style={{ gap: 8, marginTop: 16 }}>
        {POINTS.map((p) => (
          <View key={p} style={{ flexDirection: 'row', gap: 8 }}>
            <Text size={14} color="ink">
              •
            </Text>
            <Text size={14} color="ink" style={{ flex: 1, opacity: 0.8 }}>
              {p}
            </Text>
          </View>
        ))}
      </View>

      <Button
        title="Verify on DLD"
        variant="plum"
        iconRight={<ExternalLink size={16} color={colors.white} />}
        onPress={() => openUrl('https://dubailand.gov.ae')}
        accessibilityLabel="Verify on DLD. Opens the Dubai Land Department website"
        style={{ marginTop: 20 }}
      />
      <Text size={12} color="muted" style={{ marginTop: 8 }}>
        Opens the Dubai Land Department website.
      </Text>
    </View>
  )
}

function Fact({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <View style={styles.fact}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        {icon}
        <Text size={12} color="muted">
          {label}
        </Text>
      </View>
      <Text size={20} weight={700} color="plum" style={{ marginTop: 4 }}>
        {value}
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  box: { borderRadius: radius.panel, borderWidth: 1, borderColor: colors.line, backgroundColor: colors.mist, padding: 22 },
  icon: { width: 48, height: 48, borderRadius: 24, backgroundColor: colors.plum, alignItems: 'center', justifyContent: 'center' },
  fact: { borderRadius: radius.card, backgroundColor: colors.white, padding: 16 },
})
