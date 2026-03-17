// KYSS Vision — Navigation (Redesigned — premium dark nav)
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Bell, Menu, X, Search, LogOut, LayoutDashboard, Briefcase, ArrowRight } from 'lucide-react'

export default function Navigation() {
  const { isAuthenticated, role, userProfile, signOut } = useAuth()
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
  }

  return (
    <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 shrink-0">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-sm font-black text-primary-foreground">K</span>
            </div>
            <span className="text-lg font-bold text-foreground tracking-tight">KYSS <span className="text-primary">Vision</span></span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-1">
            {!isAuthenticated && (
              <>
                <Link to="/how-it-works" className="px-3.5 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-white/5 transition-all">How It Works</Link>
                <Link to="/guide" className="px-3.5 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-white/5 transition-all">Guide</Link>
                <Link to="/blog" className="px-3.5 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-white/5 transition-all">Blog</Link>
                <Link to="/for-employers" className="px-3.5 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-white/5 transition-all">For Employers</Link>
              </>
            )}
            {role === 'worker' && (
              <>
                <Link to="/find-work" className="px-3.5 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-white/5 transition-all flex items-center gap-1.5">
                  <Search className="w-3.5 h-3.5" /> Find Work
                </Link>
                <Link to="/guide" className="px-3.5 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-white/5 transition-all">Guide</Link>
                <Link to="/blog" className="px-3.5 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-white/5 transition-all">Blog</Link>
              </>
            )}
            {role === 'employer' && (
              <>
                <Link to="/employer/pools" className="px-3.5 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-white/5 transition-all flex items-center gap-1.5">
                  <Briefcase className="w-3.5 h-3.5" /> My Pools
                </Link>
                <Link to="/blog" className="px-3.5 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-white/5 transition-all">Blog</Link>
              </>
            )}
            {role === 'admin' && (
              <Link to="/admin" className="px-3.5 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-white/5 transition-all">Admin Panel</Link>
            )}
          </div>

          {/* Desktop Right Actions */}
          <div className="hidden md:flex items-center gap-2">
            {!isAuthenticated ? (
              <>
                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground" asChild>
                  <Link to="/auth/sign-in">Sign In</Link>
                </Button>
                <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold rounded-xl" asChild>
                  <Link to="/auth/sign-up">Get Started <ArrowRight className="ml-1.5 w-3.5 h-3.5" /></Link>
                </Button>
              </>
            ) : (
              <div className="flex items-center gap-2">
                {role === 'worker' && (
                  <Link to="/notifications" className="relative p-2.5 text-muted-foreground hover:text-foreground hover:bg-white/5 rounded-lg transition-all">
                    <Bell className="w-5 h-5" />
                  </Link>
                )}
                <Link
                  to={role === 'admin' ? '/admin' : role === 'employer' ? '/employer/dashboard' : '/worker/dashboard'}
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground px-3 py-2 rounded-lg hover:bg-white/5 transition-all"
                >
                  <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center">
                    <span className="text-xs font-bold text-primary">{userProfile?.name?.charAt(0)?.toUpperCase() ?? 'U'}</span>
                  </div>
                  <span className="hidden lg:inline font-medium">{userProfile?.name?.split(' ')[0] ?? 'Dashboard'}</span>
                </Link>
                <Button variant="ghost" size="sm" onClick={handleSignOut} className="text-muted-foreground hover:text-foreground p-2">
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>

          {/* Mobile Hamburger */}
          <button className="md:hidden p-2 text-muted-foreground hover:text-foreground" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-border/50 bg-background/95 backdrop-blur-xl px-4 py-5 space-y-1">
          {!isAuthenticated && (
            <>
              <Link to="/how-it-works" className="block text-sm text-muted-foreground hover:text-foreground py-2.5 px-3 rounded-lg hover:bg-white/5" onClick={() => setMobileOpen(false)}>How It Works</Link>
              <Link to="/guide" className="block text-sm text-muted-foreground hover:text-foreground py-2.5 px-3 rounded-lg hover:bg-white/5" onClick={() => setMobileOpen(false)}>Guide</Link>
              <Link to="/blog" className="block text-sm text-muted-foreground hover:text-foreground py-2.5 px-3 rounded-lg hover:bg-white/5" onClick={() => setMobileOpen(false)}>Blog</Link>
              <Link to="/for-employers" className="block text-sm text-muted-foreground hover:text-foreground py-2.5 px-3 rounded-lg hover:bg-white/5" onClick={() => setMobileOpen(false)}>For Employers</Link>
              <div className="flex gap-2 pt-4">
                <Button variant="outline" size="sm" className="flex-1 rounded-xl" asChild>
                  <Link to="/auth/sign-in" onClick={() => setMobileOpen(false)}>Sign In</Link>
                </Button>
                <Button size="sm" className="flex-1 bg-primary text-primary-foreground rounded-xl" asChild>
                  <Link to="/auth/sign-up" onClick={() => setMobileOpen(false)}>Get Started</Link>
                </Button>
              </div>
            </>
          )}
          {isAuthenticated && (
            <>
              {role === 'worker' && (
                <>
                  <Link to="/worker/dashboard" className="block text-sm text-muted-foreground hover:text-foreground py-2.5 px-3 rounded-lg hover:bg-white/5" onClick={() => setMobileOpen(false)}>Dashboard</Link>
                  <Link to="/find-work" className="block text-sm text-muted-foreground hover:text-foreground py-2.5 px-3 rounded-lg hover:bg-white/5" onClick={() => setMobileOpen(false)}>Find Work</Link>
                  <Link to="/notifications" className="block text-sm text-muted-foreground hover:text-foreground py-2.5 px-3 rounded-lg hover:bg-white/5" onClick={() => setMobileOpen(false)}>Notifications</Link>
                </>
              )}
              {role === 'employer' && (
                <>
                  <Link to="/employer/dashboard" className="block text-sm text-muted-foreground hover:text-foreground py-2.5 px-3 rounded-lg hover:bg-white/5" onClick={() => setMobileOpen(false)}>Dashboard</Link>
                  <Link to="/employer/pools" className="block text-sm text-muted-foreground hover:text-foreground py-2.5 px-3 rounded-lg hover:bg-white/5" onClick={() => setMobileOpen(false)}>My Pools</Link>
                </>
              )}
              {role === 'admin' && (
                <Link to="/admin" className="block text-sm text-muted-foreground hover:text-foreground py-2.5 px-3 rounded-lg hover:bg-white/5" onClick={() => setMobileOpen(false)}>Admin Panel</Link>
              )}
              <button onClick={() => { handleSignOut(); setMobileOpen(false) }} className="block text-sm text-destructive py-2.5 px-3 rounded-lg hover:bg-destructive/10 w-full text-left mt-2">Sign Out</button>
            </>
          )}
        </div>
      )}
    </nav>
  )
}
