// KYSS Vision — Guide Article (US-053)
import { Helmet } from "react-helmet-async"
import { useParams, Link } from "react-router-dom"
import Navigation from "@/components/Navigation"
import Footer from "@/components/Footer"
import { ArrowLeft, Clock, ArrowRight } from "lucide-react"

// Placeholder article content — in production this would come from the Admin CMS (US-060)
const articles: Record<string, { title: string; category: string; readTime: string; content: string }> = {
  "working-holiday-visa-nz": {
    title: "How to get a Working Holiday Visa for New Zealand",
    category: "Visas",
    readTime: "8 min read",
    content: `New Zealand's Working Holiday Visa allows young people from eligible countries to live and work in New Zealand for up to 12 months (or longer for some nationalities).

**Who is eligible?**

You must be aged 18–30 (or 18–35 for some countries), hold a valid passport from an eligible country, have sufficient funds (typically NZD $4,200), and have a return ticket or sufficient funds to purchase one.

**How to apply**

Applications are made online through Immigration New Zealand. Processing typically takes 20 working days. The visa fee is NZD $208.

**What work can you do?**

On a Working Holiday Visa, you can work for any employer in New Zealand. There are no restrictions on the type of work. Seasonal and agricultural work is particularly popular because it is widely available, pays well, and often includes accommodation.

**How KYSS can help**

KYSS connects working holiday visa holders with pre-qualified seasonal work pools across New Zealand. Once your visa is approved, create a KYSS account and start browsing open pools in your target region.`,
  },
}

export default function GuideArticle() {
  const { slug } = useParams<{ slug: string }>()
  const article = slug ? articles[slug] : null

  return (
    <>
      <Helmet>
        <title>{article ? `${article.title} — KYSS Guide` : "Guide — KYSS Vision"}</title>
        <meta name="description" content={article ? article.content.slice(0, 155) : "KYSS Vision backpacker guide."} />
      </Helmet>
      <Navigation />
      <main className="py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <Link to="/guide" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-8">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Guide
          </Link>
          {!article ? (
            <div className="text-center py-20">
              <p className="text-muted-foreground mb-4">This guide article is coming soon.</p>
              <Link to="/guide" className="text-primary hover:underline text-sm">Browse all guides</Link>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-3 mb-4">
                <span className="px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-full font-medium">{article.category}</span>
                <span className="flex items-center gap-1 text-xs text-muted-foreground"><Clock className="w-3 h-3" />{article.readTime}</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-8">{article.title}</h1>
              <div className="prose prose-invert max-w-none">
                {article.content.split("\n\n").map((para, i) => (
                  <p key={i} className="text-muted-foreground leading-relaxed mb-4 text-base"
                    dangerouslySetInnerHTML={{ __html: para.replace(/\*\*(.*?)\*\*/g, "<strong class='text-foreground'>$1</strong>") }}
                  />
                ))}
              </div>
              <div className="mt-12 bg-primary/5 border border-primary/20 rounded-xl p-6 text-center">
                <h3 className="text-base font-semibold text-foreground mb-2">Ready to find seasonal work?</h3>
                <p className="text-sm text-muted-foreground mb-4">Browse open work pools across New Zealand and Australia.</p>
                <Link to="/find-work" className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors">
                  Browse Work Pools <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
