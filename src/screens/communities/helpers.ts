import { formatNumber, formatPrice } from '@/lib/format'
import { AGENT_PROFILES } from '@/mocks/agents'
import type { AgentProfile, CommunityDetail, Currency } from '@/types'

/* Same formatting rules as website/src/features/communities/components/helpers.ts (pure, re-implemented here). */

/** "~AED 1,757 / sq ft" or "Prime market" when the data pack has no figure. */
export function ppsfLabel(c: Pick<CommunityDetail, 'ppsf' | 'approx'>) {
  return c.ppsf ? `${c.approx ? '~' : ''}AED ${formatNumber(c.ppsf)} / sq ft` : 'Prime market'
}

/** Bare figure: "~1,757" or "Prime market". */
export function ppsfValue(c: Pick<CommunityDetail, 'ppsf' | 'approx'>) {
  return c.ppsf ? `${c.approx ? '~' : ''}${formatNumber(c.ppsf)}` : 'Prime market'
}

export function yieldLabel(c: Pick<CommunityDetail, 'yieldPct'>) {
  return c.yieldPct ? `${c.yieldPct.toFixed(2)}%` : 'On request'
}

/** Indicative annual rent in the chosen currency. */
export function rentLabel(aed: number | null, currency: Currency) {
  return aed ? `${formatPrice(aed, currency)} / yr` : 'On request'
}

const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, '')

/** Agents use short names ("Dubai Hills", "Creek Harbour"); match them loosely to the community name. */
export function agentCoversCommunity(agent: AgentProfile, communityName: string) {
  const target = norm(communityName)
  return agent.communities.some((c) => {
    const n = norm(c)
    return n.length > 2 && (target.includes(n) || n.includes(target))
  })
}

/** Specialists for a community, falling back to one agent when no one lists it. */
export function specialistsFor(communityName: string) {
  const matched = AGENT_PROFILES.filter((a) => agentCoversCommunity(a, communityName))
  return matched.length ? matched : AGENT_PROFILES.slice(0, 1)
}
