// KYSS Vision — MyPools Page (US-038)
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { Helmet } from "react-helmet-async"
import { Search, Loader2 } from "lucide-react"
import WorkerLayout from "@/components/WorkerLayout"
import { useAuth } from "@/contexts/AuthContext"
import { getWorkerPools } from "@/lib/kyss"
import PoolCard from "@/components/pools/PoolCard"
import type { WorkPool } from "@/integrations/supabase/types"

export default function MyPools() {
  const { user } = useAuth()
  const [pools, setPools] = useState<WorkPool[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    getWorkerPools(user.id).then((p) => {
      setPools(p)
      setLoading(false)
    })
  }, [user])

  return (
    <>
      <Helmet><title>My Pools — KYSS Vision</title></Helmet>
      <WorkerLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground">My Pools</h1>
            <p className="text-muted-foreground text-sm mt-1">All the pools you have joined.</p>
          </div>

          {loading ? (
            <div className="flex justify-center py-16"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
          ) : pools.length === 0 ? (
            <div className="bg-card border border-border rounded-2xl p-12 text-center">
              <p className="text-muted-foreground mb-4">You have not joined any pools yet.</p>
              <Link to="/find-work" className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-primary/90 transition-colors">
                <Search className="w-4 h-4" />
                Find Work
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {pools.map((pool) => (
                <PoolCard key={pool.id} pool={pool} />
              ))}
            </div>
          )}
        </div>
      </WorkerLayout>
    </>
  )
}
