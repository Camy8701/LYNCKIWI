// KYSS Vision — CategoryGrid (Redesigned — large glass cards)
import { Apple, Grape, Scissors, Package, Milk, Sprout, Flower2, Tractor, TreePine } from 'lucide-react'
import CategoryCard from './CategoryCard'

const categories = [
  { name: 'Fruit Picking', slug: 'fruit-picking', description: 'Kiwifruit, apples, berries, stonefruit, citrus picking across NZ and AU orchards.', icon: Apple, poolCount: 12 },
  { name: 'Packing & Processing', slug: 'packing', description: 'Packhouse work — sorting, grading, boxing produce for export.', icon: Package, poolCount: 10 },
  { name: 'Pruning', slug: 'pruning', description: 'Vine and tree pruning, seasonal maintenance across vineyards and orchards.', icon: Scissors, poolCount: 6 },
  { name: 'Thinning', slug: 'thinning', description: 'Fruit thinning, canopy management, and crop preparation.', icon: Sprout, poolCount: 7 },
  { name: 'Vineyard', slug: 'vineyard', description: 'Harvest, cellar door, and wine production in top regions.', icon: Grape, poolCount: 8 },
  { name: 'Dairy & Farming', slug: 'dairy-farming', description: 'Milking, fencing, herd management, and general farm operations.', icon: Milk, poolCount: 5 },
  { name: 'Hospitality', slug: 'hospitality', description: 'Hotels, restaurants, tourism seasonal roles in resort areas.', icon: Flower2, poolCount: 4 },
  { name: 'Construction', slug: 'construction', description: 'Seasonal building, renovation, and construction projects.', icon: Tractor, poolCount: 9 },
  { name: 'Horticulture', slug: 'horticulture', description: 'Nurseries, landscaping, garden centers, and plant care.', icon: TreePine, poolCount: 6 },
]

export default function CategoryGrid() {
  return (
    <section className="py-20 px-4 md:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-medium mb-5">
            9 work categories
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-5">Browse Work Types</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
            Find seasonal work across New Zealand and Australia. Each category has verified employer pools ready for you to join.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {categories.map((cat) => (
            <CategoryCard key={cat.slug} {...cat} />
          ))}
        </div>
      </div>
    </section>
  )
}
