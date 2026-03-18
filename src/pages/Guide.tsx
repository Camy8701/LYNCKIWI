// KYSS Vision — Guide Hub (Punta-style destination guide)
import { Helmet } from "react-helmet-async"
import { Link } from "react-router-dom"
import { useState } from "react"
import Navigation from "@/components/Navigation"
import Footer from "@/components/Footer"
import { ArrowRight, MapPin, Clock, Star, Shield, Compass } from "lucide-react"

// ── Guide Data ──────────────────────────────────────────────
const guides = [
  // New Zealand
  {
    slug: "bay-of-plenty-kiwifruit",
    title: "Bay of Plenty",
    subtitle: "Kiwifruit Capital of NZ",
    country: "New Zealand",
    region: "nz",
    category: "Fruit Picking",
    image: "https://images.unsplash.com/photo-1507699622108-4be3abd695ad?w=800&q=80",
    excerpt: "The heart of New Zealand's kiwifruit industry. Thousands of backpackers flock here every season for picking and packing work.",
    season: "Mar – Jun",
    avgPay: "$25–30/hr",
    readTime: "8 min",
    trending: true,
  },
  {
    slug: "marlborough-wine-harvest",
    title: "Marlborough",
    subtitle: "World-Class Wine Region",
    country: "New Zealand",
    region: "nz",
    category: "Vineyard",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80",
    excerpt: "New Zealand's largest wine region. Grape harvest runs February to April with high demand for vineyard workers.",
    season: "Feb – Apr",
    avgPay: "$24–28/hr",
    readTime: "7 min",
    trending: true,
  },
  {
    slug: "hawkes-bay-orchards",
    title: "Hawke's Bay",
    subtitle: "Apple & Stone Fruit Hub",
    country: "New Zealand",
    region: "nz",
    category: "Fruit Picking",
    image: "https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=800&q=80",
    excerpt: "One of NZ's sunniest regions with massive apple, pear, and stonefruit orchards. Steady work from January through April.",
    season: "Jan – Apr",
    avgPay: "$23–27/hr",
    readTime: "6 min",
    emerging: true,
  },
  {
    slug: "central-otago-cherries",
    title: "Central Otago",
    subtitle: "Cherry & Stonefruit Paradise",
    country: "New Zealand",
    region: "nz",
    category: "Fruit Picking",
    image: "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800&q=80",
    excerpt: "Famous for premium cherries. Short but intense season with some of the highest daily earnings in NZ fruit picking.",
    season: "Dec – Feb",
    avgPay: "$26–35/hr",
    readTime: "5 min",
    topPick: true,
  },
  {
    slug: "nelson-hops-orchards",
    title: "Nelson & Tasman",
    subtitle: "Hops, Apples & Sunshine",
    country: "New Zealand",
    region: "nz",
    category: "Horticulture",
    image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=80",
    excerpt: "NZ's sunniest region with diverse work — hops, apples, berries, and thriving craft beer culture for downtime.",
    season: "Nov – May",
    avgPay: "$24–28/hr",
    readTime: "7 min",
  },
  {
    slug: "waikato-dairy-farming",
    title: "Waikato",
    subtitle: "Dairy Farming Heartland",
    country: "New Zealand",
    region: "nz",
    category: "Dairy & Farming",
    image: "https://images.unsplash.com/photo-1500595046743-cd271d694d30?w=800&q=80",
    excerpt: "New Zealand's largest dairy region. Year-round work available on farms — milking, fencing, and herd management.",
    season: "Year-round",
    avgPay: "$25–30/hr",
    readTime: "8 min",
    topPick: true,
  },
  {
    slug: "queenstown-hospitality",
    title: "Queenstown",
    subtitle: "Adventure & Hospitality Capital",
    country: "New Zealand",
    region: "nz",
    category: "Hospitality",
    image: "https://images.unsplash.com/photo-1589871973318-9ca1258faa5d?w=800&q=80",
    excerpt: "The adventure capital of the world. Massive demand for hospitality workers in hotels, restaurants, and tourism operators.",
    season: "Oct – Apr",
    avgPay: "$24–30/hr",
    readTime: "6 min",
    trending: true,
  },
  // Australia
  {
    slug: "queensland-fruit-trail",
    title: "Queensland",
    subtitle: "Australia's Fruit Bowl",
    country: "Australia",
    region: "au",
    category: "Fruit Picking",
    image: "https://images.unsplash.com/photo-1523712999610-f77fbcfc3843?w=800&q=80",
    excerpt: "From Bundaberg to Bowen — Queensland's fruit trail offers year-round work and counts toward your second-year visa.",
    season: "Year-round",
    avgPay: "A$26–32/hr",
    readTime: "10 min",
    trending: true,
  },
  {
    slug: "margaret-river-vineyards",
    title: "Margaret River",
    subtitle: "Premium Wine & Surf",
    country: "Australia",
    region: "au",
    category: "Vineyard",
    image: "https://images.unsplash.com/photo-1504279577054-acfeccf8fc52?w=800&q=80",
    excerpt: "Western Australia's premier wine region. Combine vineyard work with world-class surfing and stunning coastline.",
    season: "Feb – Apr",
    avgPay: "A$28–34/hr",
    readTime: "7 min",
    emerging: true,
  },
  {
    slug: "victoria-yarra-valley",
    title: "Yarra Valley",
    subtitle: "Wine, Berries & Rolling Hills",
    country: "Australia",
    region: "au",
    category: "Vineyard",
    image: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800&q=80",
    excerpt: "Just an hour from Melbourne. Premium wineries and berry farms with excellent pay and stunning scenery.",
    season: "Nov – May",
    avgPay: "A$27–33/hr",
    readTime: "6 min",
    topPick: true,
  },
  {
    slug: "tasmania-cherry-season",
    title: "Tasmania",
    subtitle: "Cherries, Apples & Wild Beauty",
    country: "Australia",
    region: "au",
    category: "Fruit Picking",
    image: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&q=80",
    excerpt: "Australia's island state offers premium cherry and apple picking with breathtaking wilderness. Less crowded than the mainland.",
    season: "Dec – Apr",
    avgPay: "A$26–35/hr",
    readTime: "8 min",
    emerging: true,
  },
  {
    slug: "mildura-citrus-grapes",
    title: "Mildura",
    subtitle: "Citrus & Table Grape Capital",
    country: "Australia",
    region: "au",
    category: "Fruit Picking",
    image: "https://images.unsplash.com/photo-1416339306562-f3d12fefd36f?w=800&q=80",
    excerpt: "On the Murray River between Victoria and NSW. Huge citrus and table grape industry with long seasons and steady work.",
    season: "Jan – Nov",
    avgPay: "A$25–30/hr",
    readTime: "7 min",
  },
  {
    slug: "whitsundays-tourism",
    title: "Whitsundays",
    subtitle: "Tropical Paradise Work",
    country: "Australia",
    region: "au",
    category: "Hospitality",
    image: "https://images.unsplash.com/photo-1559128010-7c1ad6e1b6a5?w=800&q=80",
    excerpt: "Work in one of Australia's most beautiful destinations. Resort, tourism, and marine operator jobs with island vibes.",
    season: "Apr – Nov",
    avgPay: "A$26–32/hr",
    readTime: "6 min",
    topPick: true,
  },
  {
    slug: "south-australia-barossa",
    title: "Barossa Valley",
    subtitle: "Iconic Wine Country",
    country: "Australia",
    region: "au",
    category: "Vineyard",
    image: "https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=800&q=80",
    excerpt: "One of the world's great wine regions. Vintage season brings high demand for vineyard and cellar door workers.",
    season: "Feb – Apr",
    avgPay: "A$28–34/hr",
    readTime: "5 min",
  },
  // Essential Guides
  {
    slug: "working-holiday-visa-nz",
    title: "Working Holiday Visa — NZ",
    subtitle: "Complete Application Guide",
    country: "New Zealand",
    region: "nz",
    category: "Visas & Essentials",
    image: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&q=80",
    excerpt: "Step-by-step guide to the NZ Working Holiday Visa — eligibility, costs, processing times, and insider tips.",
    season: "Anytime",
    avgPay: "",
    readTime: "8 min",
    topPick: true,
  },
  {
    slug: "working-holiday-visa-au",
    title: "Working Holiday Visa — AU",
    subtitle: "Subclass 417 & 462 Guide",
    country: "Australia",
    region: "au",
    category: "Visas & Essentials",
    image: "https://images.unsplash.com/photo-1523482580672-f109ba8cb9be?w=800&q=80",
    excerpt: "Everything about Australia's WHV including the 88-day regional work requirement for your second-year extension.",
    season: "Anytime",
    avgPay: "",
    readTime: "10 min",
    trending: true,
  },
  {
    slug: "backpacker-accommodation-nz",
    title: "Accommodation Guide",
    subtitle: "Where to Stay on a Budget",
    country: "NZ & Australia",
    region: "both",
    category: "Visas & Essentials",
    image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&q=80",
    excerpt: "Hostels, farm stays, campervans, and house shares — affordable accommodation options for seasonal workers.",
    season: "Anytime",
    avgPay: "",
    readTime: "9 min",
  },
  {
    slug: "tax-guide-nz-au",
    title: "Tax & Finance Guide",
    subtitle: "IRD, TFN & Tax Refunds",
    country: "NZ & Australia",
    region: "both",
    category: "Visas & Essentials",
    image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&q=80",
    excerpt: "How to get your IRD or TFN, what tax rates apply, and how to claim your refund when you leave.",
    season: "Anytime",
    avgPay: "",
    readTime: "8 min",
  },
]

const categories = [
  "All",
  "Fruit Picking",
  "Vineyard",
  "Horticulture",
  "Dairy & Farming",
  "Hospitality",
  "Visas & Essentials",
]

const regionFilters = ["All Regions", "New Zealand", "Australia"]

// ── Component ───────────────────────────────────────────────
export default function Guide() {
  const [activeCategory, setActiveCategory] = useState("All")
  const [activeRegion, setActiveRegion] = useState("All Regions")

  const filtered = guides.filter((g) => {
    const catMatch = activeCategory === "All" || g.category === activeCategory
    const regMatch =
      activeRegion === "All Regions" ||
      (activeRegion === "New Zealand" && (g.region === "nz" || g.region === "both")) ||
      (activeRegion === "Australia" && (g.region === "au" || g.region === "both"))
    return catMatch && regMatch
  })

  const trending = filtered.filter((g) => g.trending)
  const emerging = filtered.filter((g) => g.emerging)
  const topPicks = filtered.filter((g) => g.topPick)
  const rest = filtered.filter((g) => !g.trending && !g.emerging && !g.topPick)

  return (
    <>
      <Helmet>
        <title>Backpacker Work Guide — NZ & AU | KYSS Vision</title>
        <meta
          name="description"
          content="The complete guide to seasonal and agricultural work in New Zealand and Australia. Destinations, visas, work types, regions, pay, and accommodation."
        />
      </Helmet>
      <Navigation />
      <main className="min-h-screen bg-background">
        {/* ── Hero ──────────────────────────────────────── */}
        <section className="relative overflow-hidden pt-20 pb-16 px-4">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-primary/8 rounded-full blur-3xl" />
          </div>
          <div className="relative max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold mb-6">
              <Compass className="w-3.5 h-3.5" />
              {guides.length} destination guides
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-6">
              Ready for your next<br />
              <span className="text-primary">adventure?</span>
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Explore our guides to find the best seasonal work destinations across New Zealand and Australia.
            </p>
          </div>
        </section>

        {/* ── Filters ──────────────────────────────────── */}
        <section className="px-4 pb-4">
          <div className="max-w-6xl mx-auto">
            {/* Region pills */}
            <div className="flex flex-wrap gap-2 mb-4">
              {regionFilters.map((r) => (
                <button
                  key={r}
                  onClick={() => setActiveRegion(r)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                    activeRegion === r
                      ? "bg-primary text-primary-foreground shadow-[0_0_12px_rgba(212,160,23,0.3)]"
                      : "bg-card border border-border text-muted-foreground hover:text-foreground hover:border-primary/40"
                  }`}
                >
                  {r === "New Zealand" && "🇳🇿 "}{r === "Australia" && "🇦🇺 "}{r}
                </button>
              ))}
            </div>
            {/* Category pills */}
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                    activeCategory === cat
                      ? "bg-primary/15 text-primary border border-primary/40"
                      : "bg-card border border-border text-muted-foreground hover:text-foreground hover:border-primary/30"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* ── Trending ─────────────────────────────────── */}
        {trending.length > 0 && (
          <GuideSection title="Trending Destinations" icon={<Star className="w-5 h-5 text-primary" />} guides={trending} />
        )}

        {/* ── Emerging ─────────────────────────────────── */}
        {emerging.length > 0 && (
          <GuideSection title="Emerging Destinations" icon={<Compass className="w-5 h-5 text-primary" />} guides={emerging} />
        )}

        {/* ── Top Picks ────────────────────────────────── */}
        {topPicks.length > 0 && (
          <GuideSection title="Top Picks for Backpackers" icon={<Shield className="w-5 h-5 text-primary" />} guides={topPicks} />
        )}

        {/* ── All Others ───────────────────────────────── */}
        {rest.length > 0 && (
          <GuideSection title="More Destinations" icon={<MapPin className="w-5 h-5 text-primary" />} guides={rest} />
        )}

        {/* ── Empty state ──────────────────────────────── */}
        {filtered.length === 0 && (
          <section className="py-20 px-4 text-center">
            <div className="max-w-md mx-auto">
              <Compass className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No guides found</h3>
              <p className="text-muted-foreground text-sm mb-6">Try changing your filters to discover more destinations.</p>
              <button onClick={() => { setActiveCategory("All"); setActiveRegion("All Regions") }} className="text-primary text-sm font-medium hover:underline">
                Clear all filters
              </button>
            </div>
          </section>
        )}

        {/* ── CTA ──────────────────────────────────────── */}
        <section className="py-20 px-4">
          <div className="max-w-4xl mx-auto">
            <div
              className="relative overflow-hidden rounded-3xl p-10 sm:p-14 text-center"
              style={{
                backgroundImage: `linear-gradient(135deg, rgba(10,10,10,0.8) 0%, rgba(10,10,10,0.5) 100%), url("https://images.unsplash.com/photo-1500259571355-332da5cb07aa?w=1200&q=80")`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Ready to find work?</h2>
              <p className="text-white/70 text-lg max-w-xl mx-auto mb-8">
                Browse verified employer pools across New Zealand and Australia. Join a pool and start earning.
              </p>
              <Link
                to="/find-work"
                className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-4 rounded-2xl font-semibold text-base hover:bg-primary/90 transition-all hover:scale-105 duration-300"
              >
                Browse Work Pools <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}

// ── Section Component ───────────────────────────────────────
type GuideItem = (typeof guides)[number]

function GuideSection({
  title,
  icon,
  guides: sectionGuides,
}: {
  title: string
  icon: React.ReactNode
  guides: GuideItem[]
}) {
  return (
    <section className="py-10 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          {icon}
          <h2 className="text-2xl font-bold text-foreground">{title}</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {sectionGuides.map((guide) => (
            <GuideCard key={guide.slug} guide={guide} />
          ))}
        </div>
      </div>
    </section>
  )
}

// ── Card Component ──────────────────────────────────────────
function GuideCard({ guide }: { guide: GuideItem }) {
  return (
    <Link
      to={`/guide/${guide.slug}`}
      className="group bg-card border border-border rounded-2xl overflow-hidden hover:border-primary/40 transition-all duration-300 hover:shadow-[0_0_20px_rgba(212,160,23,0.15)] hover:-translate-y-1"
    >
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={guide.image}
          alt={guide.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        {/* Country badge */}
        <div className="absolute top-3 left-3">
          <span className="px-2.5 py-1 rounded-full bg-black/50 backdrop-blur-sm text-white text-[10px] font-semibold uppercase tracking-wider">
            {guide.country}
          </span>
        </div>
        {/* Season badge */}
        {guide.season && guide.season !== "Anytime" && (
          <div className="absolute top-3 right-3">
            <span className="px-2.5 py-1 rounded-full bg-primary/90 text-primary-foreground text-[10px] font-semibold">
              {guide.season}
            </span>
          </div>
        )}
        {/* Title overlay */}
        <div className="absolute bottom-3 left-3 right-3">
          <h3 className="text-lg font-bold text-white leading-tight">{guide.title}</h3>
          <p className="text-xs text-white/70 mt-0.5">{guide.subtitle}</p>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          <span className="px-2 py-0.5 bg-primary/10 text-primary text-[10px] rounded-full font-semibold uppercase tracking-wide">
            {guide.category}
          </span>
          <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
            <Clock className="w-3 h-3" /> {guide.readTime}
          </span>
          {guide.avgPay && (
            <span className="text-[10px] text-green-400 font-semibold">{guide.avgPay}</span>
          )}
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
          {guide.excerpt}
        </p>
        <div className="flex items-center gap-1.5 mt-4 text-primary text-xs font-semibold group-hover:gap-2.5 transition-all">
          Read guide <ArrowRight className="w-3.5 h-3.5" />
        </div>
      </div>
    </Link>
  )
}
