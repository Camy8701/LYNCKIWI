// KYSS Vision — CategoryCard (US-022)
import { Link } from 'react-router-dom'
import { LucideIcon } from 'lucide-react'

interface CategoryCardProps {
  name: string
  slug: string
  description: string
  icon: LucideIcon
  poolCount?: number
}

export default function CategoryCard({ name, slug, description, icon: Icon, poolCount }: CategoryCardProps) {
  return (
    <Link
      to={`/find-work/${slug}`}
      className="group block bg-card border border-border rounded-2xl p-6 hover:border-primary/50 hover:bg-card/80 transition-all duration-200"
    >
      <div className="w-12 h-12 rounded-xl bg-primary/10 group-hover:bg-primary/20 flex items-center justify-center mb-4 transition-colors">
        <Icon className="w-6 h-6 text-primary" />
      </div>
      <h3 className="text-base font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">{name}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed mb-3">{description}</p>
      {poolCount !== undefined && (
        <span className="text-xs text-primary font-medium">{poolCount} open pool{poolCount !== 1 ? 's' : ''}</span>
      )}
    </Link>
  )
}
