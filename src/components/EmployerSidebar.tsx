// KYSS Vision — EmployerSidebar (US-027)
import { Link, useLocation } from 'react-router-dom'
import { LayoutDashboard, Users, MessageSquare, BarChart2, Settings, LogOut } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { cn } from '@/lib/utils'

const navItems = [
  { label: 'Dashboard', icon: LayoutDashboard, path: '/employer/dashboard' },
  { label: 'My Pools', icon: Users, path: '/employer/pools' },
  { label: 'Messages', icon: MessageSquare, path: '/employer/messages' },
  { label: 'Analytics', icon: BarChart2, path: '/employer/analytics' },
]

export default function EmployerSidebar() {
  const location = useLocation()
  const { userProfile, signOut } = useAuth()

  return (
    <aside className="w-64 shrink-0 bg-card border-r border-border flex flex-col h-screen sticky top-0">
      <div className="px-6 py-5 border-b border-border">
        <Link to="/" className="text-lg font-bold text-primary">KYSS Vision</Link>
        <p className="text-xs text-muted-foreground mt-0.5">Employer Portal</p>
      </div>

      <div className="px-4 py-4 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center text-primary font-semibold text-sm">
            {userProfile?.name?.charAt(0)?.toUpperCase() ?? 'E'}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-foreground truncate">{userProfile?.name ?? 'Employer'}</p>
            <p className="text-xs text-muted-foreground">Employer</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-3 mb-2">Manage</p>
        {navItems.map((item) => {
          const active = location.pathname === item.path || location.pathname.startsWith(item.path + '/')
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
      </nav>

      <div className="px-3 py-4 border-t border-border space-y-1">
        <Link to="/employer/settings" className={cn('flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors', location.pathname === '/employer/settings' ? 'bg-primary text-primary-foreground font-medium' : 'text-muted-foreground hover:text-foreground hover:bg-accent')}>
          <Settings className="w-4 h-4 shrink-0" /> Settings
        </Link>
        <button onClick={() => signOut()} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors">
          <LogOut className="w-4 h-4 shrink-0" /> Sign Out
        </button>
      </div>
    </aside>
  )
}
