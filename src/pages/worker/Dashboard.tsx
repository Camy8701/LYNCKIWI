// KYSS Vision — Worker Dashboard (US-037)
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { Briefcase, Bell, MessageSquare, Search, ChevronRight, Loader2, UserCircle } from 'lucide-react'
import WorkerLayout from '@/components/WorkerLayout'
import { useAuth } from '@/contexts/AuthContext'
import { getWorkerPools, getNotifications } from '@/lib/kyss'
import StatusBadge from '@/components/pools/StatusBadge'
import type { WorkPool, Notification } from '@/integrations/supabase/types'

export default function WorkerDashboard() {
  const { user, userProfile } = useAuth()
  const [pools, setPools] = useState<WorkPool[]>([])
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    Promise.all([
      getWorkerPools(user.id),
      getNotifications(user.id, 5),
    ]).then(([p, n]) => {
      setPools(p)
      setNotifications(n)
      setLoading(false)
    })
  }, [user])

  const unread = notifications.filter((n) => !n.is_read).length

  return (
    <>
      <Helmet><title>Dashboard — KYSS Vision</title></Helmet>
      <WorkerLayout>
        <div className="space-y-8">
          {/* Welcome */}
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Welcome back{userProfile?.full_name ? `, ${userProfile.full_name.split(" ")[0]}` : ""}
            </h1>
            <p className="text-muted-foreground text-sm mt-1">Here is what is happening with your pools.</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-card border border-border rounded-xl p-5 flex items-center gap-4">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <Briefcase className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{pools.length}</p>
                <p className="text-xs text-muted-foreground">Active Pools</p>
              </div>
            </div>
            <div className="bg-card border border-border rounded-xl p-5 flex items-center gap-4">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <Bell className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{unread}</p>
                <p className="text-xs text-muted-foreground">Unread Notifications</p>
              </div>
            </div>
            <div className="bg-card border border-border rounded-xl p-5 flex items-center gap-4">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">—</p>
                <p className="text-xs text-muted-foreground">Messages</p>
              </div>
            </div>
          </div>

          {/* Profile completion prompt */}
          {!userProfile?.profile_complete && (
            <div className="bg-primary/10 border border-primary/30 rounded-xl p-5 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <UserCircle className="w-6 h-6 text-primary shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-foreground">Complete your profile</p>
                  <p className="text-xs text-muted-foreground">Employers can only see you once your profile is complete.</p>
                </div>
              </div>
              <Link to="/worker/profile-wizard" className="shrink-0 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-xs font-medium hover:bg-primary/90 transition-colors">
                Complete Now
              </Link>
            </div>
          )}

          {/* My Pools */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-foreground">My Pools</h2>
              <Link to="/worker/pools" className="text-sm text-primary hover:underline flex items-center gap-1">View all <ChevronRight className="w-3.5 h-3.5" /></Link>
            </div>
            {loading ? (
              <div className="flex justify-center py-8"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
            ) : pools.length === 0 ? (
              <div className="bg-card border border-border rounded-xl p-8 text-center">
                <p className="text-muted-foreground text-sm mb-4">You have not joined any pools yet.</p>
                <Link to="/find-work" className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">
                  <Search className="w-4 h-4" />
                  Find Work
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {pools.slice(0, 3).map((pool) => (
                  <Link key={pool.id} to={`/pools/${pool.id}`} className="bg-card border border-border rounded-xl p-4 flex items-center justify-between hover:border-primary/50 transition-colors group">
                    <div>
                      <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">{pool.title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{pool.region} · {pool.country}</p>
                    </div>
                    <StatusBadge status={pool.status} />
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Recent Notifications */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-foreground">Recent Notifications</h2>
              <Link to="/worker/notifications" className="text-sm text-primary hover:underline flex items-center gap-1">View all <ChevronRight className="w-3.5 h-3.5" /></Link>
            </div>
            {notifications.length === 0 ? (
              <div className="bg-card border border-border rounded-xl p-6 text-center">
                <p className="text-muted-foreground text-sm">No notifications yet.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {notifications.map((n) => (
                  <div key={n.id} className={`bg-card border rounded-xl p-4 ${!n.is_read ? "border-primary/30" : "border-border"}`}>
                    <p className="text-sm text-foreground">{n.message}</p>
                    <p className="text-xs text-muted-foreground mt-1">{new Date(n.created_at).toLocaleDateString("en-NZ", { day: "numeric", month: "short" })}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </WorkerLayout>
    </>
  )
}
