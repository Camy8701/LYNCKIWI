// KYSS Vision — Notifications Page (US-040)
import { useEffect, useState } from "react"
import { Helmet } from "react-helmet-async"
import { Bell, Check, Loader2 } from "lucide-react"
import WorkerLayout from "@/components/WorkerLayout"
import { useAuth } from "@/contexts/AuthContext"
import { getNotifications, markNotificationRead } from "@/lib/kyss"
import type { Notification } from "@/integrations/supabase/types"

export default function Notifications() {
  const { user } = useAuth()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    getNotifications(user.id).then((n) => {
      setNotifications(n)
      setLoading(false)
    })
  }, [user])

  const markRead = async (id: string) => {
    await markNotificationRead(id)
    setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, is_read: true } : n))
  }

  const markAllRead = async () => {
    const unread = notifications.filter((n) => !n.is_read)
    await Promise.all(unread.map((n) => markNotificationRead(n.id)))
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })))
  }

  const unreadCount = notifications.filter((n) => !n.is_read).length

  return (
    <>
      <Helmet><title>Notifications — KYSS Vision</title></Helmet>
      <WorkerLayout>
        <div className="space-y-6 max-w-2xl">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Notifications</h1>
              {unreadCount > 0 && <p className="text-sm text-muted-foreground mt-1">{unreadCount} unread</p>}
            </div>
            {unreadCount > 0 && (
              <button onClick={markAllRead} className="text-sm text-primary hover:underline flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5" />
                Mark all read
              </button>
            )}
          </div>

          {loading ? (
            <div className="flex justify-center py-16"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
          ) : notifications.length === 0 ? (
            <div className="bg-card border border-border rounded-2xl p-12 text-center">
              <Bell className="w-10 h-10 mx-auto mb-3 text-muted-foreground opacity-40" />
              <p className="text-muted-foreground">No notifications yet.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {notifications.map((n) => (
                <div key={n.id} className={`bg-card border rounded-xl p-4 flex items-start justify-between gap-4 ${!n.is_read ? "border-primary/40 bg-primary/5" : "border-border"}`}>
                  <div className="flex-1">
                    <p className="text-sm text-foreground">{n.message}</p>
                    <p className="text-xs text-muted-foreground mt-1">{new Date(n.created_at).toLocaleDateString("en-NZ", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}</p>
                  </div>
                  {!n.is_read && (
                    <button onClick={() => markRead(n.id)} className="shrink-0 text-xs text-primary hover:underline">Mark read</button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </WorkerLayout>
    </>
  )
}
