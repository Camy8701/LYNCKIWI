// KYSS Vision — CategoryPools Page (US-031)
import { useParams, Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { ArrowLeft, Loader2 } from 'lucide-react'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import PoolCard from '@/components/pools/PoolCard'
import { workTypeCategories as workTypeCategoriesData } from '@/data/workTypeCategoriesData'
import { getPools } from '@/lib/kyss'
import type { WorkPool } from '@/integrations/supabase/types'

export default function CategoryPools() {
  const { slug } = useParams<{ slug: string }>()
  const [pools, setPools] = useState<WorkPool[]>([])
  const [loading, setLoading] = useState(true)

  const category = workTypeCategoriesData.find((c) => c.slug === slug)

  useEffect(() => {
    if (!slug) return
    setLoading(true)
    getPools({ categorySlug: slug, status: 'open' })
      .then(setPools)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [slug])

  if (!category) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navigation />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-2">Category not found</h1>
            <Link to="/find-work" className="text-primary hover:underline">Back to Find Work</Link>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <>
      <Helmet>
        <title>{category.name} Pools — KYSS Vision</title>
        <meta name="description" content={`Browse ${category.name} work pools across NZ and AU. Join a pool and start working.`} />
      </Helmet>
      <div className="min-h-screen bg-background flex flex-col">
        <Navigation />
        <main className="flex-1">
          {/* Header */}
          <section className="bg-card border-b border-border py-10">
            <div className="max-w-6xl mx-auto px-4 sm:px-6">
              <Link to="/find-work" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
                <ArrowLeft className="w-4 h-4" />
                All Work Types
              </Link>
              <h1 className="text-3xl font-bold text-foreground mb-2">{category.name}</h1>
              <p className="text-muted-foreground">{category.description}</p>
            </div>
          </section>

          {/* Pool List */}
          <section className="py-10">
            <div className="max-w-6xl mx-auto px-4 sm:px-6">
              {loading ? (
                <div className="flex items-center justify-center py-20">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
              ) : pools.length === 0 ? (
                <div className="text-center py-20">
                  <p className="text-muted-foreground text-lg mb-2">No open pools in this category right now.</p>
                  <p className="text-sm text-muted-foreground">Check back soon — new pools are added regularly.</p>
                  <Link to="/find-work" className="mt-6 inline-block text-primary hover:underline text-sm">Browse other categories</Link>
                </div>
              ) : (
                <>
                  <p className="text-sm text-muted-foreground mb-6">{pools.length} pool{pools.length !== 1 ? 's' : ''} available</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {pools.map((pool) => (
                      <PoolCard key={pool.id} pool={pool} />
                    ))}
                  </div>
                </>
              )}
            </div>
          </section>
        </main>
        <Footer />
      </div>
    </>
  )
}
