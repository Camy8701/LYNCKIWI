// KYSS Vision — PoolDetail Page (US-032, US-034, US-035)
import { useParams, Link, useSearchParams, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { ArrowLeft, MapPin, Calendar, DollarSign, Users, Loader2, Star, Send, Briefcase } from 'lucide-react'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import StatusBadge from '@/components/pools/StatusBadge'
import { useAuth } from '@/contexts/AuthContext'
import { getPoolById, joinPool, leavePool, getPoolPosts, createPoolPost, getPoolReviews, isWorkerProfileComplete } from '@/lib/kyss'
import type { WorkPool, PoolPost, Review } from '@/integrations/supabase/types'
import { supabase } from '@/integrations/supabase/client'

type Tab = 'about' | 'feed' | 'reviews'

export default function PoolDetail() {
  const { id } = useParams<{ id: string }>()
  const [searchParams, setSearchParams] = useSearchParams()
  const activeTab = (searchParams.get('tab') as Tab) || 'about'
  const navigate = useNavigate()
  const { user, userProfile, role } = useAuth()

  const [pool, setPool] = useState<WorkPool | null>(null)
  const [loading, setLoading] = useState(true)
  const [joining, setJoining] = useState(false)
  const [isMember, setIsMember] = useState(false)
  const [posts, setPosts] = useState<PoolPost[]>([])
  const [reviews, setReviews] = useState<Review[]>([])
  const [newPost, setNewPost] = useState('')
  const [postingFeed, setPostingFeed] = useState(false)
  const [actionMsg, setActionMsg] = useState('')

  useEffect(() => {
    if (!id) return
    setLoading(true)
    getPoolById(id).then((p) => {
      setPool(p)
      setLoading(false)
    })
    // Check membership
    if (user) {
      supabase
        .from('pool_memberships')
        .select('id')
        .eq('pool_id', id)
        .eq('worker_id', user.id)
        .eq('status', 'active')
        .maybeSingle()
        .then(({ data }) => setIsMember(!!data))
    }
  }, [id, user])

  useEffect(() => {
    if (!id) return
    if (activeTab === 'feed') getPoolPosts(id).then(setPosts)
    if (activeTab === 'reviews') getPoolReviews(id).then(setReviews)
  }, [id, activeTab])

  const handleJoin = async () => {
    if (!id || !user) return
    // Check profile completion before joining
    const complete = await isWorkerProfileComplete(user.id)
    if (!complete) {
      navigate('/worker/profile-wizard')
      return
    }
    setJoining(true)
    setActionMsg('')
    const { error } = await joinPool(user.id, id)
    if (error) {
      setActionMsg(error)
    } else {
      setIsMember(true)
      setPool((p) => p ? { ...p, current_count: (p.current_count || 0) + 1 } : p)
      setActionMsg('You have joined this pool. Welcome!')
    }
    setJoining(false)
  }

  const handleLeave = async () => {
    if (!id || !user) return
    setJoining(true)
    setActionMsg('')
    const { error } = await leavePool(user.id, id)
    if (error) {
      setActionMsg(error)
    } else {
      setIsMember(false)
      setPool((p) => p ? { ...p, current_count: Math.max(0, (p.current_count || 1) - 1) } : p)
      setActionMsg('You have left this pool.')
    }
    setJoining(false)
  }

  const handlePostFeed = async () => {
    if (!id || !user || !newPost.trim()) return
    const complete = await isWorkerProfileComplete(user.id)
    if (!complete) {
      navigate('/worker/profile-wizard')
      return
    }
    setPostingFeed(true)
    await createPoolPost(id, user.id, newPost.trim())
    setNewPost('')
    const updated = await getPoolPosts(id)
    setPosts(updated)
    setPostingFeed(false)
  }

  const setTab = (tab: Tab) => setSearchParams({ tab })

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navigation />
        <main className="flex-1 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </main>
        <Footer />
      </div>
    )
  }

  if (!pool) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navigation />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-2">Pool not found</h1>
            <Link to="/find-work" className="text-primary hover:underline">Back to Find Work</Link>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  const capacityPct = pool.capacity ? Math.round(((pool.current_count || 0) / pool.capacity) * 100) : 0
  const isFull = pool.status === 'full'
  const canJoin = role === 'worker' && !isMember && !isFull && pool.status === 'open'
  const canLeave = role === 'worker' && isMember

  return (
    <>
      <Helmet>
        <title>{pool.title} — KYSS Vision</title>
      </Helmet>
      <div className="min-h-screen bg-background flex flex-col">
        <Navigation />
        <main className="flex-1">
          {/* Hero */}
          <section className="bg-card border-b border-border py-10">
            <div className="max-w-4xl mx-auto px-4 sm:px-6">
              <Link to={`/find-work/${pool.work_type_category_id}`} className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
                <ArrowLeft className="w-4 h-4" />
                Back to pools
              </Link>
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-2xl sm:text-3xl font-bold text-foreground">{pool.title}</h1>
                    <StatusBadge status={pool.status} />
                  </div>
                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mt-3">
                    {pool.region && <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" />{pool.region}</span>}
                    {pool.start_date && <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" />Starts {new Date(pool.start_date).toLocaleDateString('en-NZ', { day: 'numeric', month: 'short', year: 'numeric' })}</span>}
                    {pool.pay_rate && <span className="flex items-center gap-1.5"><DollarSign className="w-3.5 h-3.5" />{pool.pay_rate}</span>}
                    {pool.capacity && <span className="flex items-center gap-1.5"><Users className="w-3.5 h-3.5" />{pool.current_count || 0}/{pool.capacity} workers</span>}
                  </div>
                  {/* Capacity bar */}
                  {pool.capacity && (
                    <div className="mt-4 max-w-xs">
                      <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${capacityPct >= 90 ? 'bg-destructive' : capacityPct >= 60 ? 'bg-amber-500' : 'bg-primary'}`}
                          style={{ width: `${Math.min(capacityPct, 100)}%` }}
                        />
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">{capacityPct}% full</p>
                    </div>
                  )}
                </div>

                {/* Join / Leave CTA */}
                <div className="shrink-0">
                  {!user ? (
                    <Link to="/auth/sign-up" className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-xl font-semibold text-sm hover:bg-primary/90 transition-colors">
                      Sign Up to Join
                    </Link>
                  ) : canJoin ? (
                    <button onClick={handleJoin} disabled={joining} className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-xl font-semibold text-sm hover:bg-primary/90 transition-colors disabled:opacity-60">
                      {joining ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                      Join Pool
                    </button>
                  ) : canLeave ? (
                    <button onClick={handleLeave} disabled={joining} className="inline-flex items-center gap-2 bg-muted text-foreground px-6 py-3 rounded-xl font-semibold text-sm hover:bg-muted/80 transition-colors disabled:opacity-60">
                      {joining ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                      Leave Pool
                    </button>
                  ) : isFull ? (
                    <span className="inline-flex items-center gap-2 bg-muted text-muted-foreground px-6 py-3 rounded-xl font-semibold text-sm cursor-not-allowed">
                      Pool Full
                    </span>
                  ) : null}
                  {actionMsg && <p className="text-xs text-muted-foreground mt-2 max-w-[200px] text-center">{actionMsg}</p>}
                </div>
              </div>
            </div>
          </section>

          {/* Tabs */}
          <div className="border-b border-border bg-card">
            <div className="max-w-4xl mx-auto px-4 sm:px-6">
              <nav className="flex gap-6">
                {(['about', 'feed', 'reviews'] as Tab[]).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setTab(tab)}
                    className={`py-4 text-sm font-medium border-b-2 transition-colors capitalize ${activeTab === tab ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
                  >
                    {tab}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Tab Content */}
          <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
            {/* About Tab */}
            {activeTab === 'about' && (
              <div className="space-y-6">
                {pool.description && (
                  <div>
                    <h2 className="text-lg font-semibold text-foreground mb-3">About This Pool</h2>
                    <p className="text-muted-foreground leading-relaxed">{pool.description}</p>
                  </div>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {pool.accommodation_provided !== undefined && (
                    <div className="bg-card border border-border rounded-xl p-4">
                      <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Accommodation</p>
                      <p className="text-sm font-medium text-foreground">{pool.accommodation_provided ? 'Provided' : 'Not provided'}</p>
                    </div>
                  )}
                  {pool.transport_provided !== undefined && (
                    <div className="bg-card border border-border rounded-xl p-4">
                      <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Transport</p>
                      <p className="text-sm font-medium text-foreground">{pool.transport_provided ? 'Provided' : 'Not provided'}</p>
                    </div>
                  )}
                  {pool.country && (
                    <div className="bg-card border border-border rounded-xl p-4">
                      <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Country</p>
                      <p className="text-sm font-medium text-foreground">{pool.country === 'NZ' ? '🇳🇿 New Zealand' : '🇦🇺 Australia'}</p>
                    </div>
                  )}
                  {pool.end_date && (
                    <div className="bg-card border border-border rounded-xl p-4">
                      <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">End Date</p>
                      <p className="text-sm font-medium text-foreground">{new Date(pool.end_date).toLocaleDateString('en-NZ', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                    </div>
                  )}
                </div>
                {isMember && (
                  <div className="bg-primary/10 border border-primary/30 rounded-xl p-4 flex items-center gap-3">
                    <Briefcase className="w-5 h-5 text-primary shrink-0" />
                    <p className="text-sm text-foreground">You are a member of this pool. Check the <button onClick={() => setTab('feed')} className="text-primary underline">Feed</button> for updates from the employer.</p>
                  </div>
                )}
              </div>
            )}

            {/* Feed Tab */}
            {activeTab === 'feed' && (
              <div className="space-y-6">
                {/* Post input — employer or admin only */}
                {(role === 'employer' || role === 'admin') && (
                  <div className="bg-card border border-border rounded-xl p-4">
                    <textarea
                      value={newPost}
                      onChange={(e) => setNewPost(e.target.value)}
                      placeholder="Post an update to pool members..."
                      rows={3}
                      className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <div className="flex justify-end mt-2">
                      <button onClick={handlePostFeed} disabled={postingFeed || !newPost.trim()} className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 disabled:opacity-60 transition-colors">
                        {postingFeed ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                        Post
                      </button>
                    </div>
                  </div>
                )}

                {posts.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <p>No updates yet. Check back soon.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {posts.map((post) => (
                      <div key={post.id} className="bg-card border border-border rounded-xl p-5">
                        <p className="text-sm text-foreground leading-relaxed">{post.content}</p>
                        <p className="text-xs text-muted-foreground mt-3">{new Date(post.created_at).toLocaleDateString('en-NZ', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Reviews Tab */}
            {activeTab === 'reviews' && (
              <div className="space-y-4">
                {reviews.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <p>No reviews yet for this pool.</p>
                  </div>
                ) : (
                  reviews.map((review) => (
                    <div key={review.id} className="bg-card border border-border rounded-xl p-5">
                      <div className="flex items-center gap-1 mb-2">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`w-4 h-4 ${i < (review.rating || 0) ? 'text-primary fill-primary' : 'text-muted-foreground'}`} />
                        ))}
                        <span className="text-xs text-muted-foreground ml-2">{review.rating}/5</span>
                      </div>
                      {review.comment && <p className="text-sm text-muted-foreground leading-relaxed">{review.comment}</p>}
                      <p className="text-xs text-muted-foreground mt-3">{new Date(review.created_at).toLocaleDateString('en-NZ', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </main>
        <Footer />
      </div>
    </>
  )
}
