// KYSS Vision — Footer (Redesigned — premium dark footer)
import { Link } from 'react-router-dom'

const workTypes = [
  { label: 'Fruit Picking', slug: 'fruit-picking' },
  { label: 'Packing & Processing', slug: 'packing' },
  { label: 'Pruning', slug: 'pruning' },
  { label: 'Thinning', slug: 'thinning' },
  { label: 'Vineyard', slug: 'vineyard' },
  { label: 'Dairy & Farming', slug: 'dairy-farming' },
  { label: 'Hospitality', slug: 'hospitality' },
  { label: 'Construction', slug: 'construction' },
  { label: 'Horticulture', slug: 'horticulture' },
]

export default function Footer() {
  return (
    <footer className="bg-background border-t border-border/50 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-sm font-black text-primary-foreground">K</span>
              </div>
              <span className="text-lg font-bold text-foreground">KYSS <span className="text-primary">Vision</span></span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Connecting backpackers with verified seasonal employers across New Zealand and Australia.
            </p>
            <div className="flex gap-4 pt-1">
              <span className="text-sm text-muted-foreground">🇳🇿 New Zealand</span>
              <span className="text-sm text-muted-foreground">🇦🇺 Australia</span>
            </div>
          </div>

          {/* Work Types */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-foreground uppercase tracking-wider">Work Types</h4>
            <ul className="space-y-2.5">
              {workTypes.map((w) => (
                <li key={w.slug}>
                  <Link to={`/work/${w.slug}`} className="text-sm text-muted-foreground hover:text-primary transition-colors">{w.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-foreground uppercase tracking-wider">Company</h4>
            <ul className="space-y-2.5">
              {[
                ['How It Works', '/how-it-works'],
                ['Blog', '/blog'],
                ['Backpacker Guide', '/guide'],
                ['For Employers', '/for-employers'],
                ['Seasonal Calendar', '/seasonal-calendar'],
                ['Contact', '/contact'],
              ].map(([label, path]) => (
                <li key={path}><Link to={path} className="text-sm text-muted-foreground hover:text-primary transition-colors">{label}</Link></li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-foreground uppercase tracking-wider">Legal</h4>
            <ul className="space-y-2.5">
              {[
                ['Privacy Policy', '/privacy'],
                ['Terms of Service', '/terms'],
                ['Cookie Policy', '/cookies'],
              ].map(([label, path]) => (
                <li key={path}><Link to={path} className="text-sm text-muted-foreground hover:text-primary transition-colors">{label}</Link></li>
              ))}
            </ul>
            <div className="pt-4">
              <p className="text-xs text-muted-foreground">
                Questions?{' '}
                <a href="mailto:hello@kyssvision.com" className="text-primary hover:underline">hello@kyssvision.com</a>
              </p>
            </div>
          </div>
        </div>

        <div className="mt-14 pt-8 border-t border-border/50 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">&copy; {new Date().getFullYear()} KYSS Vision. All rights reserved.</p>
          <p className="text-xs text-muted-foreground">Built for backpackers working in 🇳🇿 New Zealand & 🇦🇺 Australia</p>
        </div>
      </div>
    </footer>
  )
}
