// KYSS Vision — AdminLayout (US-028)
import { Link, useLocation } from 'react-router-dom'
import { LayoutDashboard, Users, Briefcase, MessageSquare, BarChart2, Settings, LogOut, UserCheck, AlertTriangle, FileText, Zap } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { cn } from '@/lib/utils'

const navSections = [
  {
    label: 'Overview',
    items: [{ label: 'Dashboard', icon: LayoutDashboard, path: '/admin' }],
  },
  {
    label: 'Management',
    items: [
      { label: 'Workers', icon: Users, path: '/admin/workers' },
      { label: 'Employers', icon: Briefcase, path: '/admin/employers' },
      { label: 'Pools', icon: UserCheck, path: '/admin/pools' },
      { label: 'Prospects', icon: Zap, path: '/admin/prospects' },
    ],
  },
  {
    label: 'Communication',
    items: [
      { label: 'Messages', icon: MessageSquare, path: '/admin/messages' },
      { label: 'Reports', icon: AlertTriangle, path: '/admin/reports' },
    ],
  },
  {
    label: 'System',
    items: [
      { label: 'Analytics', icon: BarChart2, path: '/admin/analytics' },
      { label: 'Activity Log', icon: FileText, path: '/admin/activity' },
      { label: 'Settings', icon: Settings, path: '/admin/settings' },
    ],
  },
]

interface AdminLayoutProps {
  children: React.ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const location = useLocation()
  const { signOut } = useAuth()

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="w-64 shrink-0 bg-card border-r border-border flex flex-col h-screen sticky top-0">
        <div className="px-6 py-5 border-b border-border">
          <Link to="/" className="text-lg font-bold text-primary">KYSS Vision</Link>
          <p className="text-xs text-muted-foreground mt-0.5">Admin Panel</p>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-4 overflow-y-auto">
          {navSections.map((section) => (
            <div key={section.label}>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-3 mb-1">{section.label}</p>
              <div className="space-y-0.5">
                {section.items.map((item) => {
                  const active = location.pathname === item.path || (item.path !== '/admin' && location.pathname.startsWith(item.path))
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={cn(
                        'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors',
                        active ? 'bg-primary text-primary-foreground font-medium' : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                      )}
                    >
                      <item.icon className="w-4 h-4 shrink-0" />
                      {item.label}
                    </Link>
                  )
                })}
              </div>
            </div>
          ))}
        </nav>

        <div className="px-3 py-4 border-t border-border">
          <button
            onClick={() => signOut()}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-6xl mx-auto px-6 py-8">
          {children}
        </div>
      </main>
    </div>
  )
}
