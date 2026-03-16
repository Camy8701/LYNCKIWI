// KYSS Vision — Work Type Detail (US-055)
import { Helmet } from "react-helmet-async"
import { useParams, Link } from "react-router-dom"
import { useEffect, useState } from "react"
import Navigation from "@/components/Navigation"
import Footer from "@/components/Footer"
import { ArrowLeft, ArrowRight, Loader2, MapPin, DollarSign, Calendar } from "lucide-react"
import { getWorkTypeCategoryBySlug, getPools } from "@/lib/kyss"
import PoolCard from "@/components/pools/PoolCard"
import type { WorkTypeCategory, WorkPool } from "@/integrations/supabase/types"

export default function WorkTypeDetail() {
  const { slug } = useParams<{ slug: string }>()
  const [category, setCategory] = useState<WorkTypeCategory | null>(null)
  const [pools, setPools] = useState<WorkPool[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!slug) return
    Promise.all([
      getWorkTypeCategoryBySlug(slug),
    ]).then(([cat]) => {
      setCategory(cat)
      if (cat) {
        getPools({ categoryId: cat.id, status: "open" }).then((p) => setPools(p))
      }
      setLoading(false)
    })
  }, [slug])

  return (
    <>
      <Helmet>
        <title>{category ? `${category.name} Jobs in NZ & AU — KYSS Vision` : "Work Type — KYSS Vision"}</title>
        <meta name="description" content={category?.description || "Browse seasonal work pools in New Zealand and Australia on KYSS Vision."} />
      </Helmet>
      <Navigation />
      <main className="py-12 px-4">
        <div className="max-w-5xl mx-auto">
          <Link to="/find-work" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-8">
            <ArrowLeft className="w-3.5 h-3.5" /> All Work Types
          </Link>
          {loading ? (
            <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
          ) : !category ? (
            <div className="text-center py-20">
              <p className="text-muted-foreground mb-4">Work type not found.</p>
              <Link to="/find-work" className="text-primary hover:underline text-sm">Browse all work types</Link>
            </div>
          ) : (
            <>
              <div className="mb-10">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-3xl">{category.icon_emoji || "🌿"}</div>
                  <div>
                    <h1 className="text-3xl font-bold text-foreground">{category.name}</h1>
                    <p className="text-muted-foreground text-sm mt-1">{pools.length} open pools available</p>
                  </div>
                </div>
                {category.description && (
                  <p className="text-muted-foreground leading-relaxed max-w-2xl">{category.description}</p>
                )}
              </div>

              {/* Quick info */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
                {[
                  { icon: <MapPin className="w-4 h-4 text-primary" />, label: "Available in", value: "New Zealand & Australia" },
                  { icon: <DollarSign className="w-4 h-4 text-primary" />, label: "Typical pay", value: "NZD $18–$28/hr" },
                  { icon: <Calendar className="w-4 h-4 text-primary" />, label: "Peak season", value: "Nov – Apr (NZ)" },
                ].map((item) => (
                  <div key={item.label} className="bg-card border border-border rounded-xl p-4 flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">{item.icon}</div>
                    <div>
                      <p className="text-xs text-muted-foreground">{item.label}</p>
                      <p className="text-sm font-medium text-foreground">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Open pools */}
              <div>
                <h2 className="text-xl font-bold text-foreground mb-6">Open Pools</h2>
                {pools.length === 0 ? (
                  <div className="bg-card border border-border rounded-xl p-10 text-center">
                    <p className="text-muted-foreground mb-4">No open pools right now. Check back soon or browse other work types.</p>
                    <Link to="/find-work" className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors">
                      Browse All Work Types <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {pools.map((pool) => (
                      <PoolCard key={pool.id} pool={pool} />
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
