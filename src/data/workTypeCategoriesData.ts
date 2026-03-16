// ============================================================
// KYSS Vision — Work Type Categories Static Data
// US-014
// ============================================================

export interface WorkTypeCategoryData {
  id: string
  slug: string
  name: string
  icon: string
  description: string
  imagePath: string
}

export const workTypeCategories: WorkTypeCategoryData[] = [
  {
    id: 'fruit-picking',
    slug: 'fruit-picking',
    name: 'Fruit Picking',
    icon: 'apple',
    description: 'Kiwifruit, apples, berries, stonefruit, citrus',
    imagePath: '/images/categories/fruit-picking.jpg',
  },
  {
    id: 'packing',
    slug: 'packing',
    name: 'Packing & Processing',
    icon: 'package',
    description: 'Packhouse work — sorting, grading, boxing produce',
    imagePath: '/images/categories/packing.jpg',
  },
  {
    id: 'pruning',
    slug: 'pruning',
    name: 'Pruning',
    icon: 'scissors',
    description: 'Vine and tree pruning, seasonal maintenance',
    imagePath: '/images/categories/pruning.jpg',
  },
  {
    id: 'thinning',
    slug: 'thinning',
    name: 'Thinning',
    icon: 'leaf',
    description: 'Fruit thinning, canopy management',
    imagePath: '/images/categories/thinning.jpg',
  },
  {
    id: 'vineyard',
    slug: 'vineyard',
    name: 'Vineyard',
    icon: 'grape',
    description: 'Harvest, cellar door, wine production',
    imagePath: '/images/categories/vineyard.jpg',
  },
  {
    id: 'dairy-farming',
    slug: 'dairy-farming',
    name: 'Dairy & Farming',
    icon: 'milk',
    description: 'Milking, fencing, general farm operations',
    imagePath: '/images/categories/dairy-farming.jpg',
  },
  {
    id: 'hospitality',
    slug: 'hospitality',
    name: 'Hospitality',
    icon: 'hotel',
    description: 'Hotels, restaurants, tourism seasonal roles',
    imagePath: '/images/categories/hospitality.jpg',
  },
  {
    id: 'construction',
    slug: 'construction',
    name: 'Construction',
    icon: 'hard-hat',
    description: 'Seasonal building and renovation projects',
    imagePath: '/images/categories/construction.jpg',
  },
  {
    id: 'horticulture',
    slug: 'horticulture',
    name: 'Horticulture',
    icon: 'sprout',
    description: 'Nurseries, landscaping, garden centers',
    imagePath: '/images/categories/horticulture.jpg',
  },
]

export const getCategory = (slug: string): WorkTypeCategoryData | undefined =>
  workTypeCategories.find((c) => c.slug === slug)
