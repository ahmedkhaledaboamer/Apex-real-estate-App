import { router } from 'expo-router'
import { FileDown, Phone } from 'lucide-react-native'
import { useState } from 'react'
import { Pressable, StyleSheet, View } from 'react-native'

import { colors } from '@/theme'
import type { AgentProfile, OffPlanProjectDetail } from '@/types'
import { call, whatsapp } from '@/ui/brand'
import { Button } from '@/ui/Button'
import { WhatsAppIcon } from '@/ui/icons'
import { Img } from '@/ui/Img'
import { LeadForm } from '@/ui/LeadForm'
import { Card } from '@/ui/primitives'
import { Sheet } from '@/ui/Sheet'
import { Text } from '@/ui/Text'

const ANY_UNIT = 'Not sure yet'

/**
 * Advisor + register-interest form (with a unit-type select) + brochure sheet (site: ProjectEnquiry).
 * `selectedUnit` comes from a unit card's "Enquire": it becomes the default unit and pre-fills the message.
 */
export function ProjectEnquiry({ project, agent, selectedUnit }: { project: OffPlanProjectDetail; agent: AgentProfile; selectedUnit: string | null }) {
  const [brochure, setBrochure] = useState(false)
  const first = agent.name.split(' ')[0]
  const unitNames = project.unitTypes.map((u) => u.type)
  const unitOptions = selectedUnit ? [selectedUnit, ...unitNames.filter((u) => u !== selectedUnit), ANY_UNIT] : [ANY_UNIT, ...unitNames]
  const message = selectedUnit
    ? `Hi ${first}, I'm interested in a ${selectedUnit} at ${project.name}. Please send me availability, floor plans and the payment plan.`
    : `Hi ${first}, I'd like more details on ${project.name}.`
  const context = { projectSlug: project.slug, agentId: agent.id }

  return (
    <Card style={{ padding: 22 }}>
      <Pressable accessibilityRole="link" accessibilityLabel={`${agent.name}, ${agent.role}. View profile`} onPress={() => router.push(`/agent/${agent.slug}`)} style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
        <Img src={agent.photo} style={styles.avatar} />
        <View style={{ flex: 1 }}>
          <Text size={15.5} weight={600} numberOfLines={1}>
            {agent.name}
          </Text>
          <Text size={13} color="muted">
            {agent.role}
          </Text>
          <Text size={12} color="muted">
            BRN {agent.brn}
          </Text>
        </View>
      </Pressable>
      <View style={{ flexDirection: 'row', gap: 8, marginTop: 16 }}>
        <Button title="Call" variant="outline" icon={<Phone size={16} color={colors.plum} />} onPress={() => call(agent.phone)} style={{ flex: 1 }} accessibilityLabel={`Call ${agent.name}`} />
        <Button title="WhatsApp" variant="whatsapp" icon={<WhatsAppIcon size={16} />} onPress={() => whatsapp(agent.whatsapp, message)} style={{ flex: 1 }} accessibilityLabel={`WhatsApp ${agent.name}`} />
      </View>

      <View style={styles.formHead}>
        <Text size={18} weight={600} color="plum">
          Register your interest
        </Text>
        <Text size={13.5} color="muted" style={{ marginTop: 4, marginBottom: 16 }}>
          Floor plans, availability and the full payment plan, usually within the hour.
        </Text>
        <LeadForm
          key={selectedUnit ?? 'none'}
          type="register-interest"
          context={context}
          withMessage
          defaultMessage={message}
          extraFields={[{ name: 'unitType', label: 'Unit type', kind: 'select', options: unitOptions }]}
          submitLabel="Register interest"
        />
      </View>

      <Button title="Download brochure" variant="ghost" full icon={<FileDown size={16} color={colors.plum} />} onPress={() => setBrochure(true)} style={{ marginTop: 8 }} />

      <Sheet open={brochure} onClose={() => setBrochure(false)} title={`${project.name} brochure`}>
        <Text size={14.5} color="muted" style={{ marginBottom: 16 }}>
          We’ll email you the developer’s brochure with floor plans, specifications and the {project.plan} payment plan.
        </Text>
        <LeadForm
          type="register-interest"
          context={context}
          emailRequired
          submitLabel="Email me the brochure"
          successText={`Thanks — the brochure is on its way to your inbox. ${first} will follow up if you have questions.`}
          extraFields={[{ name: 'request', label: 'Request', kind: 'select', options: ['Brochure + floor plans', 'Brochure only'] }]}
        />
      </Sheet>
    </Card>
  )
}

const styles = StyleSheet.create({
  avatar: { width: 56, height: 56, borderRadius: 28 },
  formHead: { marginTop: 20, paddingTop: 20, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: colors.line },
})
