// ============================================================
// KYSS Vision — Navigation
// US-017: Role-aware navigation (public / worker / employer / admin)
// ============================================================

import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Bell, Menu, X, Search, LogOut, LayoutDashboard, Briefcase } from 'lucide-react'

export default function Navigation() {
  const { isAuthenticated, role, userProfile, signOut } = useAuth()
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
  }

  return (
    <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <span className="text-xl font-bold text-primary tracking-tight">KYSS Vision</span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-6">
            {!isAuthenticated && (
              <>
                <Link to="/how-it-works" className="text-sm text-muted-foreground hover:text-foreground transition-colors">How It Works</Link>
                <Link to="/guide" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Guide</Link>
                <Link to="/blog" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Blog</Link>
                <Link to="/for-employers" className="text-sm text-muted-foreground hover:text-foreground transition-colors">For Employers</Link>
              </>
            )}
            {role === 'worker' && (
              <>
                <Link to="/find-work" className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
                  <Search className="w-3.5 h-3.5" /> Find Work
                </Link>
                <Link to="/guide" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Guide</Link>
                <Link to="/blog" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Blog</Link>
              </>
            )}
            {role === 'employer' && (
              <>
                <Link to="/employer/pools" className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
                  <Briefcase className="w-3.5 h-3.5" /> My Pools
                </Link>
                <Link to="/blog" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Blog</Link>
              </>
            )}
            {role === 'admin' && (
              <Link to="/admin" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Admin Panel</Link>
            )}
          </div>

          {/* Desktop Right Actions */}
          <div className="hidden md:flex items-center gap-3">
            {!isAuthenticated ? (
              <>
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/auth/sign-in">Sign In</Link>
                </Button>
                <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold" asChild>
                  <Link to="/auth/sign-up">Get Started →</Link>
                </Button>
              </>
            ) : (
              <div className="flex items-center gap-3">
                {role === 'worker' && (
                  <Link to="/notifications" className="relative p-2 text-muted-foreground hover:text-foreground transition-colors">
                    <Bell className="w-5 h-5" />
                  </Link>
                )}
                <Link
                  to={role === 'admin' ? '/admin' : role === 'employer' ? '/employer/dashboard' : '/dashboard'}
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span className="hidden lg:inline">{userProfile?.name?.split(' ')[0] ?? 'Dashboard'}</span>
                </Link>
                <Button variant="ghost" size="sm" onClick={handleSignOut} className="text-muted-foreground hover:text-foreground">
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
        <div className="md:hidden border-t border-border bg-background px-4 py-4 space-y-3">
          {!isAuthenticated && (
            <>
              <Link to="/how-it-works" className="block text-sm text-muted-foreground hover:text-foreground py-1" onClick={() => setMobileOpen(false)}>How It Works</Link>
              <Link to="/guide" className="block text-sm text-muted-foreground hover:text-foreground py-1" onClick={() => setMobileOpen(false)}>Guide</Link>
              <Link to="/blog" className="block text-sm text-muted-foreground hover:text-foreground py-1" onClick={() => setMobileOpen(false)}>Blog</Link>
              <Link to="/for-employers" className="block text-sm text-muted-foreground hover:text-foreground py-1" onClick={() => setMobileOpen(false)}>For Employers</Link>
              <div className="flex gap-2 pt-2">
                <Button variant="outline" size="sm" className="flex-1" asChild>
                  <Link to="/auth/sign-in" onClick={() => setMobileOpen(false)}>Sign In</Link>
                </Button>
                <Button size="sm" className="flex-1 bg-primary text-primary-foreground" asChild>
                  <Link to="/auth/sign-up" onClick={() => setMobileOpen(false)}>Get Started</Link>
                </Button>
              </div>
            </>
          )}
          {isAuthenticated && (
            <>
              {role === 'worker' && (
                <>
                  <Link to="/dashboard" className="block text-sm text-muted-foreground hover:text-foreground py-1" onClick={() => setMobileOpen(false)}>Dashboard</Link>
                  <Link to="/find-work" className="block text-sm text-muted-foreground hover:text-foreground py-1" onClick={() => setMobileOpen(false)}>Find Work</Link>
                  <Link to="/notifications" className="block text-sm text-muted-foreground hover:text-foreground py-1" onClick={() => setMobileOpen(false)}>Notifications</Link>
                </>
              )}
              {role === 'employer' && (
                <>
                  <Link to="/employer/dashboard" className="block text-sm text-muted-foreground hover:text-foreground py-1" onClick={() => setMobileOpen(false)}>Dashboard</Link>
                  <Link to="/employer/pools" className="block text-sm text-muted-foreground hover:text-foreground py-1" onClick={() => setMobileOpen(false)}>My Pools</Link>
                </>
              )}
              {role === 'admin' && (
                <Link to="/admin" className="block text-sm text-muted-foreground hover:text-foreground py-1" onClick={() => setMobileOpen(false)}>Admin Panel</Link>
              )}
              <button onClick={() => { handleSignOut(); setMobileOpen(false) }} className="block text-sm text-destructive py-1">Sign Out</button>
            </>
          )}
        </div>
      )}
    </nav>
  )
}
