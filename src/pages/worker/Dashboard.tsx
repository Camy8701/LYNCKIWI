// KYSS Vision — Worker Dashboard (Social feed style)
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { Briefcase, Bell, MessageSquare, Search, ChevronRight, Loader2, UserCircle, MapPin, Star, Users, Calendar, ArrowRight } from 'lucide-react'
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
    }).catch(() => setLoading(false))
  }, [user])

  const unread = notifications.filter((n) => !n.is_read).length
  const firstName = userProfile?.name?.split(' ')[0] ?? 'there'

  return (
    <>
      <Helmet><title>Dashboard — KYSS Vision</title></Helmet>
      <WorkerLayout>
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Welcome Header */}
          <div className="glass-card rounded-2xl p-6">
            <h1 className="text-xl font-bold text-foreground mb-1">
              Welcome back, {firstName}
            </h1>
            <p className="text-sm text-muted-foreground">Here's what's happening with your work pools.</p>
          </div>

          {/* Profile completion prompt */}
          {!userProfile?.profile_complete && (
            <div className="glass-card rounded-2xl p-5 border-primary/30 bg-primary/5">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center shrink-0">
                    <UserCircle className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">Complete your profile</p>
                    <p className="text-xs text-muted-foreground">Employers can only see you once your profile is 100% complete.</p>
                  </div>
                </div>
                <Link to="/worker/profile-wizard" className="shrink-0 bg-primary text-primary-foreground px-4 py-2.5 rounded-xl text-xs font-semibold hover:bg-primary/90 transition-colors">
                  Complete Now
                </Link>
              </div>
            </div>
          )}

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-3">
            <div className="glass-card rounded-xl p-4 text-center">
              <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-2">
                <Briefcase className="w-4 h-4 text-primary" />
              </div>
              <p className="text-xl font-bold text-foreground">{pools.length}</p>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider mt-0.5">Pools</p>
            </div>
            <div className="glass-card rounded-xl p-4 text-center">
              <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-2">
                <Bell className="w-4 h-4 text-primary" />
              </div>
              <p className="text-xl font-bold text-foreground">{unread}</p>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider mt-0.5">Unread</p>
            </div>
            <div className="glass-card rounded-xl p-4 text-center">
              <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-2">
                <MessageSquare className="w-4 h-4 text-primary" />
              </div>
              <p className="text-xl font-bold text-foreground">—</p>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider mt-0.5">Messages</p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="glass-card rounded-2xl p-5">
            <h2 className="text-sm font-bold text-foreground mb-4 uppercase tracking-wider">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-3">
              <Link to="/find-work" className="flex items-center gap-3 p-3 rounded-xl bg-primary/5 hover:bg-primary/10 border border-primary/10 transition-all group">
                <Search className="w-5 h-5 text-primary" />
                <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">Find Work</span>
              </Link>
              <Link to="/worker/pools" className="flex items-center gap-3 p-3 rounded-xl bg-primary/5 hover:bg-primary/10 border border-primary/10 transition-all group">
                <Users className="w-5 h-5 text-primary" />
                <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">My Pools</span>
              </Link>
              <Link to="/guide" className="flex items-center gap-3 p-3 rounded-xl bg-primary/5 hover:bg-primary/10 border border-primary/10 transition-all group">
                <Star className="w-5 h-5 text-primary" />
                <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">Worker Guide</span>
              </Link>
              <Link to="/seasonal-calendar" className="flex items-center gap-3 p-3 rounded-xl bg-primary/5 hover:bg-primary/10 border border-primary/10 transition-all group">
                <Calendar className="w-5 h-5 text-primary" />
                <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">Calendar</span>
              </Link>
            </div>
          </div>

          {/* My Pools Feed */}
          <div className="glass-card rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold text-foreground uppercase tracking-wider">My Pools</h2>
              <Link to="/worker/pools" className="text-xs text-primary hover:underline flex items-center gap-1">
                View all <ChevronRight className="w-3 h-3" />
              </Link>
            </div>
            {loading ? (
              <div className="flex justify-center py-8"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
            ) : pools.length === 0 ? (
              <div className="text-center py-8">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Search className="w-7 h-7 text-primary" />
                </div>
                <p className="text-sm text-muted-foreground mb-4">You haven't joined any pools yet.</p>
                <Link to="/find-work" className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-primary/90 transition-colors">
                  Find Work <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            ) : (
              <div className="space-y-2">
                {pools.slice(0, 5).map((pool) => (
                  <Link key={pool.id} to={`/pools/${pool.id}`} className="flex items-center gap-3 p-3 rounded-xl hover:bg-sidebar-accent/30 transition-all group">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                      <MapPin className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors truncate">{pool.title}</p>
                      <p className="text-xs text-muted-foreground">{pool.region} · {pool.country}</p>
                    </div>
                    <StatusBadge status={pool.status} />
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Notifications Feed */}
          <div className="glass-card rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold text-foreground uppercase tracking-wider">Recent Activity</h2>
              <Link to="/worker/notifications" className="text-xs text-primary hover:underline flex items-center gap-1">
                View all <ChevronRight className="w-3 h-3" />
              </Link>
            </div>
            {notifications.length === 0 ? (
              <div className="text-center py-6">
                <p className="text-sm text-muted-foreground">No activity yet. Join a pool to get started!</p>
              </div>
            ) : (
              <div className="space-y-2">
                {notifications.map((n) => (
                  <div key={n.id} className={`p-3 rounded-xl transition-all ${!n.is_read ? 'bg-primary/5 border border-primary/20' : 'hover:bg-sidebar-accent/30'}`}>
                    <p className="text-sm text-foreground">{n.message}</p>
                    <p className="text-[10px] text-muted-foreground mt-1">
                      {new Date(n.created_at).toLocaleDateString('en-NZ', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                    </p>
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
