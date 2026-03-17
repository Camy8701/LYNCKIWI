// KYSS Vision — HeroSection (Facebook-style: Hero left, Sign-in right)
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowRight, Shield, Check, Zap, Loader2, Eye, EyeOff } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

export default function HeroSection() {
  const navigate = useNavigate()
  const { signIn, signInWithGoogle } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim() || !password) {
      setError('Please enter your email and password.')
      return
    }
    setError(null)
    setLoading(true)
    const { error: err } = await signIn(email, password)
    setLoading(false)
    if (err) {
      setError('Invalid email or password.')
      return
    }
    navigate('/auth/callback')
  }

  const handleGoogle = async () => {
    setGoogleLoading(true)
    setError(null)
    const { error: err } = await signInWithGoogle()
    setGoogleLoading(false)
    if (err) setError(err)
  }

  return (
    <section
      className="overflow-hidden glass-card rounded-3xl mb-12 mx-4 md:mx-6 lg:mx-8 relative"
      style={{
        backgroundImage: `linear-gradient(135deg, rgba(10,10,10,0.7) 0%, rgba(10,10,10,0.4) 50%, rgba(10,10,10,0.6) 100%), url("https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=1600&q=80")`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        minHeight: '620px',
      }}
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[620px]">
        {/* Left Panel — Headline + Value Props */}
        <div className="relative p-6 md:p-10 lg:p-14 flex flex-col justify-center">
          <div className="relative z-10 max-w-xl">
            <div className="bg-white/[0.08] backdrop-blur-xl border border-white/[0.15] rounded-3xl p-6 md:p-8 mb-6">
              {/* Trust Badge */}
              <div className="inline-flex items-center gap-2 bg-primary/20 border border-primary/40 rounded-full px-4 py-1.5 mb-5">
                <Check className="w-4 h-4 text-primary" />
                <span className="text-xs font-semibold text-primary">KYSS-Verified: Only vetted employers</span>
              </div>

              {/* Headline */}
              <h1 className="text-4xl md:text-5xl lg:text-[3.5rem] tracking-tight text-white font-bold leading-[1.1] mb-5">
                Find Farm Work Across{' '}
                <span className="text-primary">New Zealand & Australia</span>
              </h1>

              {/* Subheadline */}
              <p className="text-base md:text-lg text-white/80 leading-relaxed mb-6">
                Join verified backpackers already matched with seasonal employers. Safe, fast, and built for working holiday visa holders.
              </p>

              {/* Live Availability */}
              <div className="flex items-center gap-2">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500" />
                </span>
                <span className="text-sm text-white font-medium">Available professionals in your region</span>
              </div>
            </div>

            {/* Stat cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="bg-white/[0.12] backdrop-blur-md border border-white/[0.15] rounded-2xl p-4 flex items-start gap-3">
                <div className="text-primary mt-0.5">
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">Instant Match</p>
                  <p className="text-xs text-white/60 mt-0.5">Join a pool = confirmed hire. No waiting.</p>
                </div>
              </div>
              <div className="bg-white/[0.12] backdrop-blur-md border border-white/[0.15] rounded-2xl p-4 flex items-start gap-3">
                <div className="text-primary mt-0.5">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">100% Verified</p>
                  <p className="text-xs text-white/60 mt-0.5">Every employer is vetted. No scams.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel — Inline Sign-In Card */}
        <div className="relative p-6 md:p-10 lg:p-14 flex items-center justify-center">
          <div className="w-full max-w-sm">
            <div className="bg-white/[0.1] backdrop-blur-2xl border border-white/[0.2] rounded-3xl p-7 shadow-2xl">
              <h2 className="text-xl font-bold text-white mb-1">Welcome Back</h2>
              <p className="text-sm text-white/60 mb-6">Sign in to access your dashboard</p>

              {error && (
                <div className="bg-red-500/20 border border-red-500/40 rounded-xl px-4 py-2.5 mb-4">
                  <p className="text-xs text-red-300">{error}</p>
                </div>
              )}

              <form onSubmit={handleSignIn} className="space-y-4">
                <div>
                  <input
                    type="email"
                    placeholder="Email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-white/[0.08] border border-white/[0.15] rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/30 transition-all"
                  />
                </div>
                <div className="relative">
                  <input
                    type={showPw ? 'text' : 'password'}
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-white/[0.08] border border-white/[0.15] rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/30 transition-all pr-11"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw(!showPw)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors"
                  >
                    {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-primary text-primary-foreground font-semibold rounded-xl py-3 text-sm hover:bg-primary/90 transition-all disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> Signing in...</>
                  ) : (
                    'Sign In'
                  )}
                </button>
              </form>

              <div className="flex items-center gap-3 my-5">
                <div className="flex-1 h-px bg-white/[0.15]" />
                <span className="text-xs text-white/40">or</span>
                <div className="flex-1 h-px bg-white/[0.15]" />
              </div>

              <button
                type="button"
                onClick={handleGoogle}
                disabled={googleLoading || loading}
                className="w-full flex items-center justify-center gap-2 bg-white text-gray-800 font-semibold rounded-xl py-3 text-sm hover:bg-white/90 transition-all disabled:opacity-60 mb-3"
              >
                {googleLoading ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Connecting...</>
                ) : (
                  <>
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    Continue with Google
                  </>
                )}
              </button>

              <Link
                to="/auth/sign-up"
                className="w-full flex items-center justify-center gap-2 bg-white/[0.08] border border-white/[0.2] text-white font-semibold rounded-xl py-3 text-sm hover:bg-white/[0.15] transition-all"
              >
                Create New Account <ArrowRight className="w-4 h-4" />
              </Link>

              <p className="text-center text-[11px] text-white/30 mt-5">
                By signing in you agree to our{' '}
                <Link to="/terms" className="text-primary/70 hover:text-primary">Terms</Link> &{' '}
                <Link to="/privacy" className="text-primary/70 hover:text-primary">Privacy Policy</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
