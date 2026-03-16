// KYSS Vision — FindWork Page (US-030)
import { Helmet } from 'react-helmet-async'
import { Search } from 'lucide-react'
import { useState } from 'react'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import CategoryCard from '@/components/categories/CategoryCard'
import { workTypeCategories as workTypeCategoriesData } from '@/data/workTypeCategoriesData'

export default function FindWork() {
  const [search, setSearch] = useState('')

  const filtered = workTypeCategoriesData.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.description.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <>
      <Helmet>
        <title>Find Work — KYSS Vision</title>
        <meta name="description" content="Browse seasonal farm work categories across New Zealand and Australia. Join a pool and start working." />
      </Helmet>
      <div className="min-h-screen bg-background flex flex-col">
        <Navigation />
        <main className="flex-1">
          {/* Header */}
          <section className="bg-card border-b border-border py-12">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
              <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-3">Find Work in NZ & AU</h1>
              <p className="text-muted-foreground text-lg mb-8">
                Choose a work category to see available pools. Joining a pool means you are hired.
              </p>
              {/* Search */}
              <div className="relative max-w-md mx-auto">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search work types..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-background border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
          </section>

          {/* Category Grid */}
          <section className="py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              {filtered.length === 0 ? (
                <div className="text-center py-20 text-muted-foreground">
                  <p className="text-lg">No work types match &ldquo;{search}&rdquo;</p>
                  <button onClick={() => setSearch('')} className="mt-4 text-primary hover:underline text-sm">Clear search</button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filtered.map((category) => (
                    <CategoryCard key={category.slug} category={category} />
                  ))}
                </div>
              )}
            </div>
          </section>
        </main>
        <Footer />
      </div>
    </>
  )
}
