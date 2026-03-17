// KYSS Vision — WorkerSidebar (NovaCast-style with gold active pill)
import { Link, useLocation } from 'react-router-dom'
import {
  LayoutDashboard, Search, Users, MessageSquare, Bell, User, Settings,
  LogOut, BookOpen, Newspaper, Calendar, Briefcase, ChevronDown, ChevronUp,
  MapPin
} from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { cn } from '@/lib/utils'
import { useState } from 'react'

const browseItems = [
  { label: 'Home Feed', icon: LayoutDashboard, path: '/worker/dashboard' },
  { label: 'Find Work', icon: Search, path: '/find-work' },
  { label: 'My Pools', icon: Briefcase, path: '/worker/pools', badge: 3 },
  { label: 'Messages', icon: MessageSquare, path: '/worker/messages' },
  { label: 'Notifications', icon: Bell, path: '/worker/notifications', badge: 5 },
]

const resourceItems = [
  { label: 'Guide', icon: BookOpen, path: '/guide' },
  { label: 'Blog', icon: Newspaper, path: '/blog' },
  { label: 'Seasonal Calendar', icon: Calendar, path: '/seasonal-calendar' },
]

// Simulated joined pools (will be dynamic from Supabase later)
const myPools = [
  { name: 'Bay Gold Orchards', region: 'Bay of Plenty', id: 'pool-1' },
  { name: 'Te Puke Packhouse', region: 'Waikato', id: 'pool-2' },
  { name: 'Marlborough Vines', region: 'Marlborough', id: 'pool-3' },
]

export default function WorkerSidebar() {
  const location = useLocation()
  const { userProfile, signOut } = useAuth()
  const [showAllPools, setShowAllPools] = useState(false)

  const isActive = (path: string) =>
    location.pathname === path || location.pathname.startsWith(path + '/')

  return (
    <aside className="w-[260px] shrink-0 bg-sidebar border-r border-sidebar-border flex flex-col h-screen sticky top-0">
      {/* Logo + Hamburger */}
      <div className="px-5 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-sm font-black text-primary-foreground">K</span>
          </div>
          <span className="text-base font-bold text-sidebar-foreground">KYSS <span className="text-primary">Vision</span></span>
        </Link>
      </div>

      {/* User Profile Card */}
      <Link to="/worker/profile" className="mx-4 mb-3 flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-sidebar-accent/50 transition-colors group">
        <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm shrink-0 ring-2 ring-primary/30">
          {userProfile?.name?.charAt(0)?.toUpperCase() ?? 'W'}
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-sidebar-foreground truncate group-hover:text-primary transition-colors">
            {userProfile?.name ?? 'Worker'}
          </p>
          <p className="text-xs text-muted-foreground">{userProfile?.country === 'AU' ? 'Australia' : 'New Zealand'}</p>
        </div>
      </Link>

      {/* Scrollable nav */}
      <nav className="flex-1 overflow-y-auto px-3 space-y-5 pb-4">
        {/* Browse */}
        <div>
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-3 mb-2">Browse</p>
          <div className="space-y-0.5">
            {browseItems.map((item) => {
              const active = isActive(item.path)
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-200',
                    active
                      ? 'bg-primary text-primary-foreground font-semibold shadow-[0_0_12px_rgba(212,160,23,0.3)]'
                      : 'text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50'
                  )}
                >
                  <item.icon className="w-[18px] h-[18px] shrink-0" />
                  <span className="flex-1">{item.label}</span>
                  {item.badge && !active && (
                    <span className="min-w-[20px] h-5 px-1.5 rounded-full bg-primary/20 text-primary text-[10px] font-bold flex items-center justify-center">
                      {item.badge}
                    </span>
                  )}
                </Link>
              )
            })}
          </div>
        </div>

        {/* Resources */}
        <div>
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-3 mb-2">Resources</p>
          <div className="space-y-0.5">
            {resourceItems.map((item) => {
              const active = isActive(item.path)
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-200',
                    active
                      ? 'bg-primary text-primary-foreground font-semibold shadow-[0_0_12px_rgba(212,160,23,0.3)]'
                      : 'text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50'
                  )}
                >
                  <item.icon className="w-[18px] h-[18px] shrink-0" />
                  {item.label}
                </Link>
              )
            })}
          </div>
        </div>

        {/* My Pools (shortcuts) */}
        <div>
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-3 mb-2">My Pools</p>
          <div className="space-y-0.5">
            {(showAllPools ? myPools : myPools.slice(0, 2)).map((pool) => (
              <Link
                key={pool.id}
                to={`/pools/${pool.id}`}
                className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50 transition-all"
              >
                <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <MapPin className="w-3.5 h-3.5 text-primary" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm truncate">{pool.name}</p>
                  <p className="text-[10px] text-muted-foreground">{pool.region}</p>
                </div>
              </Link>
            ))}
            {myPools.length > 2 && (
              <button
                onClick={() => setShowAllPools(!showAllPools)}
                className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs text-muted-foreground hover:text-sidebar-foreground transition-colors w-full"
              >
                {showAllPools ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                {showAllPools ? 'Show Less' : `Show ${myPools.length - 2} More`}
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Bottom */}
      <div className="px-3 py-3 border-t border-sidebar-border space-y-0.5">
        <Link
          to="/worker/profile"
          className={cn(
            'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all',
            isActive('/worker/profile')
              ? 'bg-primary text-primary-foreground font-semibold'
              : 'text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50'
          )}
        >
          <User className="w-[18px] h-[18px] shrink-0" />
          My Profile
        </Link>
        <Link
          to="/worker/settings"
          className={cn(
            'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all',
            isActive('/worker/settings')
              ? 'bg-primary text-primary-foreground font-semibold'
              : 'text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50'
          )}
        >
          <Settings className="w-[18px] h-[18px] shrink-0" />
          Settings
        </Link>
        <button
          onClick={() => signOut()}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-sidebar-foreground/70 hover:text-red-400 hover:bg-red-500/10 transition-all"
        >
          <LogOut className="w-[18px] h-[18px] shrink-0" />
          Sign Out
        </button>
      </div>
    </aside>
  )
}
