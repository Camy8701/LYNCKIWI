// KYSS Vision — Employer Pool Management (US-042)
import { useEffect, useState } from "react"
import { useParams, Link } from "react-router-dom"
import { Helmet } from "react-helmet-async"
import { Users, MessageSquare, Settings, ArrowLeft, Loader2, Plus, Trash2 } from "lucide-react"
import EmployerLayout from "@/components/EmployerLayout"
import { useAuth } from "@/contexts/AuthContext"
import { getPoolById, getPoolMembers, getPoolPosts, createPoolPost } from "@/lib/kyss"
import StatusBadge from "@/components/pools/StatusBadge"
import type { WorkPool, PoolMembership, PoolPost } from "@/integrations/supabase/types"
import { supabase } from "@/integrations/supabase/client"

type Tab = "workers" | "feed" | "settings"

export default function EmployerPoolManagement() {
  const { id } = useParams<{ id: string }>()
  const { user } = useAuth()
  const [pool, setPool] = useState<WorkPool | null>(null)
  const [members, setMembers] = useState<PoolMembership[]>([])
  const [posts, setPosts] = useState<PoolPost[]>([])
  const [tab, setTab] = useState<Tab>("workers")
  const [loading, setLoading] = useState(true)
  const [newPost, setNewPost] = useState("")
  const [posting, setPosting] = useState(false)

  useEffect(() => {
    if (!id) return
    Promise.all([getPoolById(id), getPoolMembers(id), getPoolPosts(id)]).then(([p, m, f]) => {
      setPool(p)
      setMembers(m)
      setPosts(f)
      setLoading(false)
    })
  }, [id])

  const handlePost = async () => {
    if (!id || !user || !newPost.trim()) return
    setPosting(true)
    await createPoolPost(id, user.id, newPost.trim())
    const updated = await getPoolPosts(id)
    setPosts(updated)
    setNewPost("")
    setPosting(false)
  }

  const handleRemoveWorker = async (memberId: string) => {
    if (!window.confirm("Remove this worker from the pool?")) return
    await supabase.from("pool_memberships").update({ status: "removed" }).eq("id", memberId)
    setMembers((prev) => prev.filter((m) => m.id !== memberId))
  }

  if (loading) return (
    <EmployerLayout>
      <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
    </EmployerLayout>
  )

  if (!pool) return (
    <EmployerLayout>
      <div className="text-center py-20 text-muted-foreground">Pool not found.</div>
    </EmployerLayout>
  )

  const tabs: { key: Tab; label: string; icon: React.ReactNode }[] = [
    { key: "workers", label: `Workers (${members.length})`, icon: <Users className="w-4 h-4" /> },
    { key: "feed", label: "Feed", icon: <MessageSquare className="w-4 h-4" /> },
    { key: "settings", label: "Settings", icon: <Settings className="w-4 h-4" /> },
  ]

  return (
    <>
      <Helmet><title>{pool.title} — KYSS Vision</title></Helmet>
      <EmployerLayout>
        <div className="space-y-6">
          <div>
            <Link to="/employer/pools" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-4">
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Pools
            </Link>
            <div className="flex items-start justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-foreground">{pool.title}</h1>
                <p className="text-muted-foreground text-sm mt-1">{pool.region} · {pool.country} · {pool.current_count}/{pool.max_workers} workers</p>
              </div>
              <StatusBadge status={pool.status} />
            </div>
          </div>

          <div className="flex gap-1 bg-muted/50 rounded-xl p-1 w-fit">
            {tabs.map((t) => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${tab === t.key ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
              >
                {t.icon}{t.label}
              </button>
            ))}
          </div>

          {tab === "workers" && (
            <div className="space-y-3">
              {members.length === 0 ? (
                <div className="bg-card border border-border rounded-xl p-8 text-center text-muted-foreground text-sm">
                  No workers in this pool yet. Workers join through the KYSS platform after being pre-qualified by Manus AI.
                </div>
              ) : members.map((m) => (
                <div key={m.id} className="bg-card border border-border rounded-xl p-4 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-foreground">Worker ID: {m.worker_id.slice(0, 8)}...</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Joined {new Date(m.joined_at).toLocaleDateString("en-NZ", { day: "numeric", month: "short", year: "numeric" })}
                    </p>
                  </div>
                  <button onClick={() => handleRemoveWorker(m.id)} className="text-destructive hover:text-destructive/80 transition-colors p-1.5 rounded-lg hover:bg-destructive/10">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {tab === "feed" && (
            <div className="space-y-4">
              <div className="bg-card border border-border rounded-xl p-4">
                <textarea value={newPost} onChange={(e) => setNewPost(e.target.value)} placeholder="Post an update to your workers..." rows={3} className="w-full bg-background border border-border rounded-lg px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none" />
                <div className="flex justify-end mt-2">
                  <button onClick={handlePost} disabled={posting || !newPost.trim()} className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 disabled:opacity-60 transition-colors">
                    {posting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3.5 h-3.5" />}
                    Post Update
                  </button>
                </div>
              </div>
              {posts.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground text-sm">No posts yet.</div>
              ) : posts.map((post) => (
                <div key={post.id} className="bg-card border border-border rounded-xl p-4">
                  <p className="text-sm text-foreground">{post.content}</p>
                  <p className="text-xs text-muted-foreground mt-2">{new Date(post.created_at).toLocaleDateString("en-NZ", { day: "numeric", month: "short", year: "numeric" })}</p>
                </div>
              ))}
            </div>
          )}

          {tab === "settings" && (
            <div className="bg-card border border-border rounded-xl p-6 space-y-4">
              <h3 className="text-base font-semibold text-foreground">Pool Settings</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                {[
                  { label: "Title", value: pool.title },
                  { label: "Region", value: pool.region },
                  { label: "Country", value: pool.country },
                  { label: "Max Workers", value: String(pool.max_workers) },
                  { label: "Pay Rate", value: `${pool.currency} ${pool.pay_rate}/${pool.pay_type}` },
                ].map((item) => (
                  <div key={item.label}>
                    <p className="text-muted-foreground text-xs mb-1">{item.label}</p>
                    <p className="text-foreground font-medium">{item.value}</p>
                  </div>
                ))}
              </div>
              <p className="text-xs text-muted-foreground pt-2">To modify pool settings, contact KYSS admin at hello@kyssvision.com</p>
            </div>
          )}
        </div>
      </EmployerLayout>
    </>
  )
}
