// KYSS Vision — Footer (US-018)
import { Link } from 'react-router-dom'

const workTypes = [
  { label: 'Fruit Picking', slug: 'fruit-picking' },
  { label: 'Grape Harvesting', slug: 'grape-harvesting' },
  { label: 'Pruning', slug: 'pruning' },
  { label: 'Packing & Sorting', slug: 'packing-sorting' },
  { label: 'Dairy Farming', slug: 'dairy-farming' },
  { label: 'Vegetable Farming', slug: 'vegetable-farming' },
  { label: 'Greenhouse Work', slug: 'greenhouse-work' },
  { label: 'General Farm Labour', slug: 'general-farm-labour' },
  { label: 'Orchard Work', slug: 'orchard-work' },
]

export default function Footer() {
  return (
    <footer className="bg-background border-t border-border mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-3">
            <Link to="/" className="text-lg font-bold text-primary">KYSS Vision</Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Connecting backpackers with verified seasonal employers across New Zealand and Australia.
            </p>
            <div className="flex gap-3 pt-2">
              <span className="text-xs text-muted-foreground">🇳🇿 New Zealand</span>
              <span className="text-xs text-muted-foreground">🇦🇺 Australia</span>
            </div>
          </div>
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-foreground">Work Types</h4>
            <ul className="space-y-2">
              {workTypes.map((w) => (
                <li key={w.slug}>
                  <Link to={`/work/${w.slug}`} className="text-sm text-muted-foreground hover:text-foreground transition-colors">{w.label}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-foreground">Company</h4>
            <ul className="space-y-2">
              {[['About', '/about'], ['Blog', '/blog'], ['Backpacker Guide', '/guide'], ['For Employers', '/for-employers'], ['How It Works', '/how-it-works'], ['Contact', '/contact']].map(([label, path]) => (
                <li key={path}><Link to={path} className="text-sm text-muted-foreground hover:text-foreground transition-colors">{label}</Link></li>
              ))}
            </ul>
          </div>
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-foreground">Legal</h4>
            <ul className="space-y-2">
              {[['Privacy Policy', '/privacy'], ['Terms of Service', '/terms'], ['Cookie Policy', '/cookies']].map(([label, path]) => (
                <li key={path}><Link to={path} className="text-sm text-muted-foreground hover:text-foreground transition-colors">{label}</Link></li>
              ))}
            </ul>
            <div className="pt-4">
              <p className="text-xs text-muted-foreground">Questions? <a href="mailto:hello@kyssvision.com" className="text-primary hover:underline">hello@kyssvision.com</a></p>
            </div>
          </div>
        </div>
        <div className="mt-10 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} KYSS Vision. All rights reserved.</p>
          <p className="text-xs text-muted-foreground">Built for backpackers working in 🇳🇿 New Zealand & 🇦🇺 Australia</p>
        </div>
      </div>
    </footer>
  )
}
