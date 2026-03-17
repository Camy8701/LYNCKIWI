// KYSS Vision — CategoryCard (Redesigned — large glass cards with glow hover)
import { Link } from 'react-router-dom'
import { ArrowRight, LucideIcon, Apple, Grape, Scissors, Package, Milk, Sprout, Flower2, Tractor, TreePine, Hotel, HardHat, Leaf } from 'lucide-react'
import type { WorkTypeCategoryData } from '@/data/workTypeCategoriesData'

const iconMap: Record<string, LucideIcon> = {
  apple: Apple,
  grape: Grape,
  scissors: Scissors,
  package: Package,
  milk: Milk,
  sprout: Sprout,
  flower2: Flower2,
  tractor: Tractor,
  'tree-pine': TreePine,
  hotel: Hotel,
  'hard-hat': HardHat,
  leaf: Leaf,
}

interface CategoryCardPropsExpanded {
  name: string
  slug: string
  description: string
  icon: LucideIcon | string
  poolCount?: number
  category?: never
}

interface CategoryCardPropsObject {
  category: WorkTypeCategoryData
  name?: never
  slug?: never
  description?: never
  icon?: never
  poolCount?: number
}

type CategoryCardProps = CategoryCardPropsExpanded | CategoryCardPropsObject

export default function CategoryCard(props: CategoryCardProps) {
  const name = props.category?.name ?? props.name!
  const slug = props.category?.slug ?? props.slug!
  const description = props.category?.description ?? props.description!
  const poolCount = props.poolCount

  // Resolve icon
  let Icon: LucideIcon
  if (props.category) {
    Icon = iconMap[props.category.icon] ?? Apple
  } else if (typeof props.icon === 'string') {
    Icon = iconMap[props.icon] ?? Apple
  } else {
    Icon = props.icon!
  }

  return (
    <Link
      to={`/find-work/${slug}`}
      className="group glass-card block rounded-2xl p-7 hover:border-primary/50 transition-all duration-300"
    >
      <div className="flex items-start justify-between mb-5">
        <div className="w-14 h-14 rounded-2xl bg-primary/10 group-hover:bg-primary/20 flex items-center justify-center transition-all duration-300 group-hover:scale-110">
          <Icon className="w-7 h-7 text-primary" />
        </div>
        {poolCount !== undefined && poolCount > 0 && (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
            {poolCount} pool{poolCount !== 1 ? 's' : ''}
          </span>
        )}
      </div>
      <h3 className="text-lg font-bold text-foreground mb-2.5 group-hover:text-primary transition-colors">{name}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed mb-5">{description}</p>
      <div className="flex items-center gap-2 text-sm font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        Explore pools <ArrowRight className="w-4 h-4" />
      </div>
    </Link>
  )
}
