// KYSS Vision — SecurityBadges (trust bar below hero)
import { Shield, Lock, Star, Users } from 'lucide-react'

const badges = [
  { icon: Lock, label: 'SSL Encrypted' },
  { icon: Shield, label: 'Verified Employers' },
  { icon: Star, label: '4.9 Avg Rating' },
  { icon: Users, label: 'Free for Workers' },
]

export default function SecurityBadges() {
  return (
    <div className="px-4 md:px-6 lg:px-8 mb-4">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-center gap-6 md:gap-8 py-4">
        {badges.map((b) => (
          <div key={b.label} className="flex items-center gap-2 text-muted-foreground">
            <b.icon className="w-4 h-4 text-primary/60" />
            <span className="text-xs font-medium">{b.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
