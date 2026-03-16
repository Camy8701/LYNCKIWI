// KYSS Vision — Guide Hub (US-053)
import { Helmet } from "react-helmet-async"
import { Link } from "react-router-dom"
import Navigation from "@/components/Navigation"
import Footer from "@/components/Footer"
import { BookOpen, ArrowRight } from "lucide-react"

const guides = [
  {
    slug: "working-holiday-visa-nz",
    category: "Visas",
    title: "How to get a Working Holiday Visa for New Zealand",
    excerpt: "A complete step-by-step guide to applying for the NZ Working Holiday Visa — eligibility, costs, processing times, and tips.",
    readTime: "8 min read",
  },
  {
    slug: "working-holiday-visa-au",
    category: "Visas",
    title: "How to get a Working Holiday Visa for Australia",
    excerpt: "Everything you need to know about the Australian Working Holiday Visa (subclass 417 and 462), including the 88-day regional work requirement.",
    readTime: "10 min read",
  },
  {
    slug: "fruit-picking-nz-guide",
    category: "Work Types",
    title: "Fruit picking in New Zealand: what to expect",
    excerpt: "Seasons, regions, pay rates, accommodation, and what a typical day looks like on a NZ orchard.",
    readTime: "7 min read",
  },
  {
    slug: "grape-harvest-marlborough",
    category: "Work Types",
    title: "Grape harvest in Marlborough: the complete guide",
    excerpt: "Marlborough is New Zealand's wine capital. Learn when harvest happens, how much you can earn, and how to find work.",
    readTime: "6 min read",
  },
  {
    slug: "backpacker-accommodation-nz",
    category: "Living",
    title: "Accommodation for backpackers in New Zealand",
    excerpt: "Hostels, farm stays, campervans, and house shares — your options for affordable accommodation while doing seasonal work in NZ.",
    readTime: "9 min read",
  },
  {
    slug: "tax-nz-working-holiday",
    category: "Finance",
    title: "Tax in New Zealand on a Working Holiday Visa",
    excerpt: "Do you need to pay tax? How to get an IRD number, what tax rate applies, and how to claim your tax refund when you leave.",
    readTime: "8 min read",
  },
  {
    slug: "best-regions-seasonal-work-au",
    category: "Australia",
    title: "Best regions for seasonal work in Australia",
    excerpt: "From Queensland to Victoria — where to find the most work, when seasons run, and which regions count for your second-year visa.",
    readTime: "11 min read",
  },
  {
    slug: "dairy-farming-nz",
    category: "Work Types",
    title: "Dairy farming in New Zealand: a beginner's guide",
    excerpt: "Dairy is one of the most in-demand seasonal roles in NZ. Learn what the work involves, what skills you need, and how much you can earn.",
    readTime: "7 min read",
  },
]

const categories = ["All", "Visas", "Work Types", "Living", "Finance", "Australia"]

export default function Guide() {
  return (
    <>
      <Helmet>
        <title>Backpacker Work Guide — NZ & AU | KYSS Vision</title>
        <meta name="description" content="The complete guide to seasonal and agricultural work in New Zealand and Australia. Visas, work types, regions, pay, accommodation, and tax." />
      </Helmet>
      <Navigation />
      <main>
        <section className="py-20 px-4 bg-gradient-to-b from-background to-muted/20 text-center">
          <div className="max-w-3xl mx-auto">
            <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-sm font-medium rounded-full mb-6">Backpacker Guide</span>
            <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-6">Everything you need to know</h1>
            <p className="text-xl text-muted-foreground">
              Visas, work types, regions, pay rates, accommodation, and tax — the complete resource hub for seasonal workers in NZ and AU.
            </p>
          </div>
        </section>

        <section className="py-16 px-4 bg-background">
          <div className="max-w-5xl mx-auto">
            <div className="flex flex-wrap gap-2 mb-10">
              {categories.map((cat) => (
                <span key={cat} className="px-4 py-1.5 bg-card border border-border rounded-full text-sm text-muted-foreground hover:text-foreground hover:border-primary/50 cursor-pointer transition-colors">
                  {cat}
                </span>
              ))}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {guides.map((guide) => (
                <Link key={guide.slug} to={`/guide/${guide.slug}`} className="bg-card border border-border rounded-xl p-6 hover:border-primary/50 transition-colors group">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-full font-medium">{guide.category}</span>
                    <span className="text-xs text-muted-foreground">{guide.readTime}</span>
                  </div>
                  <h3 className="text-base font-semibold text-foreground group-hover:text-primary transition-colors mb-2">{guide.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{guide.excerpt}</p>
                  <div className="flex items-center gap-1 mt-4 text-primary text-sm font-medium">
                    Read guide <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 px-4 bg-muted/20 text-center">
          <div className="max-w-2xl mx-auto">
            <BookOpen className="w-10 h-10 text-primary mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-foreground mb-3">Ready to find work?</h2>
            <p className="text-muted-foreground mb-6">Browse open work pools across New Zealand and Australia.</p>
            <Link to="/find-work" className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-xl font-semibold hover:bg-primary/90 transition-colors">
              Browse Work Pools <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
