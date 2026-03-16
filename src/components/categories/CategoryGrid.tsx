// KYSS Vision — CategoryGrid (US-022)
import { Apple, Grape, Scissors, Package, Milk, Sprout, Flower2, Tractor, TreePine } from 'lucide-react'
import CategoryCard from './CategoryCard'

const categories = [
  { name: 'Fruit Picking', slug: 'fruit-picking', description: 'Seasonal apple, kiwifruit, and berry picking across NZ and AU orchards.', icon: Apple },
  { name: 'Grape Harvesting', slug: 'grape-harvesting', description: 'Marlborough, Hawke’s Bay, and Barossa Valley vintage work.', icon: Grape },
  { name: 'Pruning', slug: 'pruning', description: 'Winter and summer pruning for vineyards and orchards.', icon: Scissors },
  { name: 'Packing & Sorting', slug: 'packing-sorting', description: 'Packhouse roles sorting, grading, and packing produce.', icon: Package },
  { name: 'Dairy Farming', slug: 'dairy-farming', description: 'Milking, herd management, and farm maintenance on dairy farms.', icon: Milk },
  { name: 'Vegetable Farming', slug: 'vegetable-farming', description: 'Planting, tending, and harvesting vegetables year-round.', icon: Sprout },
  { name: 'Greenhouse Work', slug: 'greenhouse-work', description: 'Tomato, capsicum, and cucumber growing in controlled environments.', icon: Flower2 },
  { name: 'General Farm Labour', slug: 'general-farm-labour', description: 'Fencing, irrigation, and general property maintenance.', icon: Tractor },
  { name: 'Orchard Work', slug: 'orchard-work', description: 'Thinning, training, and general orchard maintenance.', icon: TreePine },
]

export default function CategoryGrid() {
  return (
    <section className="py-20 bg-card/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">Browse Work Types</h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Find seasonal work across 9 categories in New Zealand and Australia.
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
