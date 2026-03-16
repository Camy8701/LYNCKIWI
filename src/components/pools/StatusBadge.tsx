// KYSS Vision — StatusBadge (US-029)
import { cn } from '@/lib/utils'

interface StatusBadgeProps {
  status: 'open' | 'almost_full' | 'closed' | 'archived' | string
  className?: string
}

const config: Record<string, { label: string; className: string }> = {
  open: { label: 'Open', className: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' },
  almost_full: { label: 'Almost Full', className: 'bg-amber-500/10 text-amber-500 border-amber-500/20' },
  closed: { label: 'Full', className: 'bg-red-500/10 text-red-500 border-red-500/20' },
  archived: { label: 'Archived', className: 'bg-muted text-muted-foreground border-border' },
}

export default function StatusBadge({ status, className }: StatusBadgeProps) {
  const cfg = config[status] ?? { label: status, className: 'bg-muted text-muted-foreground border-border' }
  return (
    <span className={cn('inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border', cfg.className, className)}>
      {cfg.label}
    </span>
  )
}
