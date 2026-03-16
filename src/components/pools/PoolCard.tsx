// KYSS Vision — PoolCard (US-029)
import { Link } from 'react-router-dom'
import { MapPin, Users, DollarSign, Calendar } from 'lucide-react'
import StatusBadge from './StatusBadge'
import { WorkPool } from '@/integrations/supabase/types'
import { formatPayRate, getCapacityPercent } from '@/lib/kyss'

interface PoolCardProps {
  pool: WorkPool & {
    employer?: { company_name?: string; verified?: boolean }
    work_type_category?: { name?: string }
  }
  onJoin?: (poolId: string) => void
  isMember?: boolean
}

export default function PoolCard({ pool, onJoin, isMember }: PoolCardProps) {
  const capacityPct = getCapacityPercent(pool.current_count ?? 0, pool.max_capacity)

  return (
    <div className="bg-card border border-border rounded-2xl p-6 hover:border-primary/30 transition-colors flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-semibold text-foreground truncate">{pool.title}</h3>
          <p className="text-sm text-muted-foreground mt-0.5">
            {pool.employer?.company_name ?? 'Employer'}
            {pool.employer?.verified && <span className="ml-1.5 text-xs text-emerald-500">✓ Verified</span>}
          </p>
        </div>
        <StatusBadge status={pool.status} />
      </div>

      {/* Details */}
      <div className="grid grid-cols-2 gap-3 text-sm">
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <MapPin className="w-3.5 h-3.5 shrink-0" />
          <span className="truncate">{pool.region}</span>
        </div>
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <DollarSign className="w-3.5 h-3.5 shrink-0" />
          <span>{formatPayRate(pool.pay_rate, pool.pay_type, pool.currency)}</span>
        </div>
        {pool.start_date && (
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Calendar className="w-3.5 h-3.5 shrink-0" />
            <span>{new Date(pool.start_date).toLocaleDateString('en', { month: 'short', day: 'numeric' })}</span>
          </div>
        )}
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <Users className="w-3.5 h-3.5 shrink-0" />
          <span>{pool.current_count ?? 0}/{pool.max_capacity}</span>
        </div>
      </div>

      {/* Capacity bar */}
      <div className="space-y-1">
        <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all ${capacityPct >= 90 ? 'bg-red-500' : capacityPct >= 70 ? 'bg-amber-500' : 'bg-emerald-500'}`}
            style={{ width: `${capacityPct}%` }}
          />
        </div>
        <p className="text-xs text-muted-foreground">{capacityPct}% full</p>
      </div>

      {/* Actions */}
      <div className="flex gap-2 mt-auto pt-2">
        <Link
          to={`/pools/${pool.id}`}
          className="flex-1 text-center text-sm py-2 px-4 rounded-lg border border-border text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors"
        >
          View Details
        </Link>
        {!isMember && pool.status !== 'closed' && pool.status !== 'archived' && onJoin && (
          <button
            onClick={() => onJoin(pool.id)}
            className="flex-1 text-sm py-2 px-4 rounded-lg bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors"
          >
            Join Pool
          </button>
        )}
        {isMember && (
          <span className="flex-1 text-center text-sm py-2 px-4 rounded-lg bg-emerald-500/10 text-emerald-500 font-medium">
            ✓ Joined
          </span>
        )}
      </div>
    </div>
  )
}
