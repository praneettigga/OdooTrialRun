import type { ReactNode } from 'react'
import type { Condition, ListingStatus } from '../../services/products'

// Tones come from tokens already documented in docs/DESIGN.md. Brand lime is
// never a status colour — that is what `positive` is for.
type Tone = 'strong' | 'neutral' | 'muted' | 'positive' | 'warning'

const TONES: Record<Tone, string> = {
  strong: 'bg-ink text-primary',
  neutral: 'bg-canvas text-ink ring-1 ring-ink/15',
  muted: 'bg-canvas-soft text-body',
  positive: 'bg-primary-pale text-positive-deep',
  warning: 'bg-warning/25 text-warning-deep',
}

export function Badge({ tone = 'neutral', children }: { tone?: Tone; children: ReactNode }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${TONES[tone]}`}
    >
      {children}
    </span>
  )
}

const CONDITION_TONE: Record<Condition, Tone> = {
  'Like new': 'strong',
  Good: 'neutral',
  'Well used': 'muted',
}

export function ConditionBadge({ condition }: { condition: Condition }) {
  return <Badge tone={CONDITION_TONE[condition]}>{condition}</Badge>
}

const STATUS_TONE: Record<ListingStatus, Tone> = {
  available: 'positive',
  sold: 'muted',
  draft: 'warning',
}

const STATUS_LABEL: Record<ListingStatus, string> = {
  available: 'Live',
  sold: 'Sold',
  draft: 'Draft',
}

export function StatusBadge({ status }: { status: ListingStatus }) {
  return <Badge tone={STATUS_TONE[status]}>{STATUS_LABEL[status]}</Badge>
}
