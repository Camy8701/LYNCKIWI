import PageLayout from "@/components/PageLayout";
import { Calendar, ArrowRight } from "lucide-react";
import { blogPosts } from "@/data/blogData";

const Blog = () => {

  return (
    <PageLayout>
      <div className="px-4 sm:px-6 lg:px-12 py-12">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl md:text-5xl lg:text-6xl tracking-tight text-foreground font-serif font-normal mb-12 text-center">
            Blog
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map((post) => {
              // Format date
              const formattedDate = new Date(post.date).toLocaleDateString(
                language === 'de' ? 'de-DE' : 'en-US',
                { year: 'numeric', month: 'long', day: 'numeric' }
              );

              return (
                <article key={post.slug} className="glass-card rounded-xl overflow-hidden group hover:border-white/[0.12] transition-all duration-300">
                  <div className="aspect-video overflow-hidden relative">
                    <img
                      src={post.image}
                      alt={language === 'de' ? post.titleDe : post.titleEn}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {post.city && (
                      <div className="absolute top-3 right-3 bg-primary/90 text-primary-foreground px-3 py-1 rounded-full text-xs font-medium">
                        {post.city}
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {formattedDate}
                      </div>
                      <span>•</span>
                      <span>{post.readTime}</span>
                    </div>
                    <div className="mb-2">
                      <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded">
                        {language === 'de' ? post.categoryDe : post.categoryEn}
                      </span>
                    </div>
                    <h2 className="text-xl font-semibold text-foreground mb-3 group-hover:text-primary transition-colors line-clamp-2">
                      {language === 'de' ? post.titleDe : post.titleEn}
                    </h2>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                      {language === 'de' ? post.excerptDe : post.excerptEn}
                    </p>
                    <a
                      href={`/blog/${post.slug}`}
                      onClick={() => {
                        // GTM Event Tracking
                        if (typeof window !== 'undefined' && (window as any).dataLayer) {
                          (window as any).dataLayer.push({
                            event: 'blog_click',
                            blog_title: language === 'de' ? post.titleDe : post.titleEn,
                            blog_slug: post.slug,
                            blog_category: post.category,
                            click_location: 'blog_listing'
                          });
                        }
                      }}
                      className="inline-flex items-center gap-2 text-primary hover:gap-3 transition-all text-sm font-medium"
                    >
                      {"Read more"}
                      <ArrowRight className="w-4 h-4" />
                    </a>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default Blog;
