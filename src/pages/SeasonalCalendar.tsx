// KYSS Vision — Seasonal Work Calendar (US-059)
import { Helmet } from "react-helmet-async"
import { Link } from "react-router-dom"
import Navigation from "@/components/Navigation"
import Footer from "@/components/Footer"
import { ArrowRight } from "lucide-react"

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

type SeasonEntry = {
  workType: string
  emoji: string
  country: "NZ" | "AU" | "Both"
  region: string
  months: number[] // 0-indexed
  color: string
}

const seasons: SeasonEntry[] = [
  { workType: "Apple & Pear Picking", emoji: "🍎", country: "NZ", region: "Hawke's Bay, Nelson", months: [1, 2, 3, 4], color: "bg-red-400/20 text-red-400 border-red-400/30" },
  { workType: "Grape Harvest", emoji: "🍇", country: "NZ", region: "Marlborough, Hawke's Bay", months: [1, 2, 3], color: "bg-purple-400/20 text-purple-400 border-purple-400/30" },
  { workType: "Kiwifruit Picking", emoji: "🥝", country: "NZ", region: "Bay of Plenty", months: [3, 4, 5], color: "bg-green-400/20 text-green-400 border-green-400/30" },
  { workType: "Cherry Picking", emoji: "🍒", country: "NZ", region: "Central Otago", months: [11, 0, 1], color: "bg-pink-400/20 text-pink-400 border-pink-400/30" },
  { workType: "Dairy Farming", emoji: "🐄", country: "NZ", region: "Waikato, Canterbury", months: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], color: "bg-yellow-400/20 text-yellow-400 border-yellow-400/30" },
  { workType: "Sheep Shearing", emoji: "🐑", country: "NZ", region: "Canterbury, Otago", months: [9, 10, 11, 0, 1], color: "bg-gray-400/20 text-gray-400 border-gray-400/30" },
  { workType: "Mango Picking", emoji: "🥭", country: "AU", region: "Darwin, Kununurra", months: [9, 10, 11], color: "bg-orange-400/20 text-orange-400 border-orange-400/30" },
  { workType: "Strawberry Picking", emoji: "🍓", country: "AU", region: "Queensland", months: [5, 6, 7, 8], color: "bg-rose-400/20 text-rose-400 border-rose-400/30" },
  { workType: "Blueberry Picking", emoji: "🫐", country: "AU", region: "Victoria, NSW", months: [10, 11, 0, 1], color: "bg-indigo-400/20 text-indigo-400 border-indigo-400/30" },
  { workType: "Tomato Picking", emoji: "🍅", country: "AU", region: "Bundaberg, Bowen", months: [5, 6, 7, 8, 9], color: "bg-red-500/20 text-red-500 border-red-500/30" },
  { workType: "Sugar Cane Harvest", emoji: "🌾", country: "AU", region: "Queensland", months: [6, 7, 8, 9, 10], color: "bg-amber-400/20 text-amber-400 border-amber-400/30" },
  { workType: "Horticulture (General)", emoji: "🌿", country: "Both", region: "NZ & AU", months: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], color: "bg-emerald-400/20 text-emerald-400 border-emerald-400/30" },
]

export default function SeasonalCalendar() {
  return (
    <>
      <Helmet>
        <title>Seasonal Work Calendar — NZ & AU | KYSS Vision</title>
        <meta name="description" content="When is the best time to work in New Zealand and Australia? Browse the KYSS seasonal work calendar to plan your working holiday." />
      </Helmet>
      <Navigation />
      <main>
        <section className="py-20 px-4 bg-gradient-to-b from-background to-muted/20 text-center">
          <div className="max-w-3xl mx-auto">
            <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-sm font-medium rounded-full mb-6">Seasonal Calendar</span>
            <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-6">When to work in NZ & AU</h1>
            <p className="text-xl text-muted-foreground">Plan your working holiday around the crop seasons. Every work type, every region, every month.</p>
          </div>
        </section>

        <section className="py-12 px-4 bg-background overflow-x-auto">
          <div className="max-w-6xl mx-auto">
            <div className="min-w-[800px]">
              {/* Month headers */}
              <div className="grid grid-cols-[200px_repeat(12,1fr)] gap-1 mb-3">
                <div />
                {months.map((m) => (
                  <div key={m} className="text-center text-xs font-medium text-muted-foreground">{m}</div>
                ))}
              </div>

              {/* NZ section */}
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-lg">🇳🇿</span>
                  <h2 className="text-sm font-semibold text-foreground">New Zealand</h2>
                </div>
                {seasons.filter((s) => s.country === "NZ" || s.country === "Both").map((season) => (
                  <div key={season.workType} className="grid grid-cols-[200px_repeat(12,1fr)] gap-1 mb-1.5 items-center">
                    <div className="flex items-center gap-2 pr-3">
                      <span className="text-base">{season.emoji}</span>
                      <div>
                        <p className="text-xs font-medium text-foreground leading-tight">{season.workType}</p>
                        <p className="text-[10px] text-muted-foreground">{season.region}</p>
                      </div>
                    </div>
                    {months.map((_, i) => (
                      <div key={i} className={`h-7 rounded-sm border ${season.months.includes(i) ? season.color : "bg-muted/20 border-transparent"}`} />
                    ))}
                  </div>
                ))}
              </div>

              {/* AU section */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-lg">🇦🇺</span>
                  <h2 className="text-sm font-semibold text-foreground">Australia</h2>
                </div>
                {seasons.filter((s) => s.country === "AU").map((season) => (
                  <div key={season.workType} className="grid grid-cols-[200px_repeat(12,1fr)] gap-1 mb-1.5 items-center">
                    <div className="flex items-center gap-2 pr-3">
                      <span className="text-base">{season.emoji}</span>
                      <div>
                        <p className="text-xs font-medium text-foreground leading-tight">{season.workType}</p>
                        <p className="text-[10px] text-muted-foreground">{season.region}</p>
                      </div>
                    </div>
                    {months.map((_, i) => (
                      <div key={i} className={`h-7 rounded-sm border ${season.months.includes(i) ? season.color : "bg-muted/20 border-transparent"}`} />
                    ))}
                  </div>
                ))}
              </div>
            </div>

            {/* Legend */}
            <div className="mt-8 flex items-center gap-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-1.5"><div className="w-6 h-4 rounded-sm bg-primary/20 border border-primary/30" /> Active season</div>
              <div className="flex items-center gap-1.5"><div className="w-6 h-4 rounded-sm bg-muted/20 border border-transparent" /> Off season</div>
            </div>
          </div>
        </section>

        <section className="py-16 px-4 bg-muted/20 text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-foreground mb-3">Ready to find seasonal work?</h2>
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
