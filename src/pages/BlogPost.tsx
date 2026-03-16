import PageLayout from "@/components/PageLayout";
import { useParams } from "react-router-dom";
import { Calendar, Clock, User, Share2, Facebook, Twitter, Linkedin } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { SEO, ArticleSchema, BreadcrumbSchema } from "@/lib/seo";
import { getBlogPostBySlug, getRelatedPosts } from "@/data/blogData";

const oldBlogPosts: Record<string, any> = {
  "heizung-kosten-2025": {
    slug: "heizung-kosten-2025",
    titleDe: "Was kostet eine neue Heizung 2025?",
    titleEn: "What Does a New Heating System Cost in 2025?",
    author: "Thomas Weber",
    date: "15. November 2025",
    readTime: "5 min",
    image: "https://images.unsplash.com/photo-1607400201889-565b1ee75f8e?auto=format&fit=crop&w=1200&q=80",
    category: "Heizung",
    contentDe: `Eine neue Heizungsanlage ist eine wichtige Investition für Ihr Zuhause. In diesem Artikel erfahren Sie alles über die Kosten, Fördermöglichkeiten und verschiedene Heizsysteme.

## Durchschnittliche Kosten nach Heizsystem

Die Kosten für eine neue Heizung variieren je nach gewähltem System erheblich:

- **Gas-Brennwertheizung**: 8.000 - 12.000 €
- **Öl-Brennwertheizung**: 9.000 - 13.000 €
- **Wärmepumpe**: 15.000 - 25.000 €
- **Pelletheizung**: 17.000 - 25.000 €
- **Solarthermie**: 8.000 - 12.000 €

## Fördermöglichkeiten 2025

Der Staat unterstützt den Umstieg auf umweltfreundliche Heizsysteme mit attraktiven Förderungen:

### BAFA Förderung
- Bis zu 40% Zuschuss für Wärmepumpen
- 30% für Solarthermie-Anlagen
- 20% für Biomasse-Heizungen

### KfW Förderung
- Zinsgünstige Kredite bis 150.000 €
- Tilgungszuschuss bis 45%

## Was beeinflusst die Kosten?

Mehrere Faktoren beeinflussen den Endpreis:

1. **Gebäudegröße**: Je größer das Haus, desto leistungsstärker muss die Heizung sein
2. **Dämmung**: Gut gedämmte Häuser benötigen weniger Heizleistung
3. **Installationsaufwand**: Komplexe Installationen kosten mehr
4. **Zusatzkomponenten**: Warmwasserspeicher, Pufferspeicher etc.

## Laufende Kosten beachten

Neben den Anschaffungskosten sollten Sie auch die laufenden Kosten berücksichtigen:

- Energiekosten (Strom, Gas, Öl, Pellets)
- Wartungskosten (jährlich 100-300 €)
- Schornsteinfegerkosten
- Versicherungen

## Fazit

Eine neue Heizung ist eine langfristige Investition. Mit den aktuellen Förderungen lohnt sich besonders der Umstieg auf erneuerbare Energien. Lassen Sie sich von mehreren Fachbetrieben beraten und vergleichen Sie Angebote.`,
    contentEn: `A new heating system is an important investment for your home. In this article, you'll learn everything about costs, funding opportunities, and different heating systems.

## Average Costs by Heating System

The costs for a new heating system vary significantly depending on the chosen system:

- **Gas condensing boiler**: €8,000 - €12,000
- **Oil condensing boiler**: €9,000 - €13,000
- **Heat pump**: €15,000 - €25,000
- **Pellet heating**: €17,000 - €25,000
- **Solar thermal**: €8,000 - €12,000

## Funding Opportunities 2025

The government supports the switch to environmentally friendly heating systems with attractive subsidies:

### BAFA Funding
- Up to 40% subsidy for heat pumps
- 30% for solar thermal systems
- 20% for biomass heating

### KfW Funding
- Low-interest loans up to €150,000
- Repayment subsidy up to 45%

## What Influences the Costs?

Several factors influence the final price:

1. **Building size**: The larger the house, the more powerful the heating must be
2. **Insulation**: Well-insulated houses require less heating power
3. **Installation effort**: Complex installations cost more
4. **Additional components**: Hot water tanks, buffer tanks, etc.

## Consider Running Costs

In addition to acquisition costs, you should also consider running costs:

- Energy costs (electricity, gas, oil, pellets)
- Maintenance costs (annually €100-300)
- Chimney sweep costs
- Insurance

## Conclusion

A new heating system is a long-term investment. With current subsidies, switching to renewable energy is particularly worthwhile. Get advice from several specialist companies and compare offers.`
  },
  "solar-foerderung-2025": {
    slug: "solar-foerderung-2025",
    titleDe: "Solar Förderung 2025: Alle Programme im Überblick",
    titleEn: "Solar Funding 2025: All Programs at a Glance",
    author: "Anna Schmidt",
    date: "10. November 2025",
    readTime: "6 min",
    image: "https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=1200&q=80",
    category: "Solar",
    contentDe: `Die Installation einer Solaranlage wird 2025 vom Staat großzügig gefördert. Hier finden Sie alle wichtigen Programme und Zuschüsse im Überblick.

## KfW Förderung für Photovoltaik

Das KfW-Programm 270 bietet zinsgünstige Kredite für Photovoltaikanlagen:

- Kreditsumme bis 150.000 € pro Vorhaben
- Effektiver Jahreszins ab 2,05%
- Laufzeit bis zu 20 Jahre
- Tilgungsfreie Anlaufjahre möglich

## BAFA Zuschüsse

Die BAFA fördert verschiedene Solaranwendungen:

### Solarthermie
- Basis-Förderung: 30% der förderfähigen Kosten
- Mit Heizungsoptimierung: +5%
- Sanierungsfahrplan-Bonus: +5%

### Kombianlagen
- Photovoltaik + Solarthermie: Bis zu 40% Förderung
- Mit Wärmepumpe: Bis zu 45%

## Regionale Förderprogramme

Viele Bundesländer und Kommunen bieten zusätzliche Förderungen:

- **Bayern**: Bis zu 3.000 € Zusatzförderung
- **Baden-Württemberg**: Bis zu 4.000 €
- **NRW**: Bis zu 2.500 €

Informieren Sie sich bei Ihrer Gemeinde über lokale Programme.

## Steuerliche Vorteile

Neben direkten Zuschüssen können Sie auch steuerlich profitieren:

- Umsatzsteuerbefreiung für PV-Anlagen bis 30 kWp
- Keine Einkommensteuer auf Einspeisevergütung
- Sonderabschreibung möglich

## Eigenverbrauch optimieren

Um die Rentabilität zu maximieren:

- Batteriespeicher nutzen (wird gefördert!)
- Verbrauch in Sonnenstunden verlagern
- Wallbox für E-Auto installieren

## Fazit

Mit den aktuellen Förderungen kann sich eine Solaranlage bereits nach 8-12 Jahren amortisieren. Wichtig ist die richtige Kombination verschiedener Förderprogramme.`,
    contentEn: `The installation of a solar system is generously subsidized by the government in 2025. Here you will find an overview of all important programs and subsidies.

## KfW Funding for Photovoltaics

The KfW program 270 offers low-interest loans for photovoltaic systems:

- Loan amount up to €150,000 per project
- Effective annual interest rate from 2.05%
- Term up to 20 years
- Grace periods possible

## BAFA Subsidies

BAFA promotes various solar applications:

### Solar Thermal
- Basic funding: 30% of eligible costs
- With heating optimization: +5%
- Renovation roadmap bonus: +5%

### Combined Systems
- Photovoltaic + solar thermal: Up to 40% funding
- With heat pump: Up to 45%

## Regional Funding Programs

Many federal states and municipalities offer additional funding:

- **Bavaria**: Up to €3,000 additional funding
- **Baden-Württemberg**: Up to €4,000
- **NRW**: Up to €2,500

Check with your municipality for local programs.

## Tax Benefits

In addition to direct subsidies, you can also benefit from taxes:

- VAT exemption for PV systems up to 30 kWp
- No income tax on feed-in tariff
- Special depreciation possible

## Optimize Self-Consumption

To maximize profitability:

- Use battery storage (subsidized!)
- Shift consumption to sunny hours
- Install wallbox for e-car

## Conclusion

With current subsidies, a solar system can pay for itself after 8-12 years. The right combination of different funding programs is important.`
  },
  "dach-sanierung-wann": {
    slug: "dach-sanierung-wann",
    titleDe: "Dach sanieren: Wann lohnt sich eine Sanierung?",
    titleEn: "Roof Renovation: When Is It Worth It?",
    author: "Michael Bauer",
    date: "5. November 2025",
    readTime: "4 min",
    image: "https://images.unsplash.com/photo-1632778149955-e80f8ceca2e8?auto=format&fit=crop&w=1200&q=80",
    category: "Dachdecker",
    contentDe: `Ein intaktes Dach ist essentiell für den Werterhalt Ihrer Immobilie. Wir zeigen Ihnen, wann eine Dachsanierung notwendig ist.

## 7 Anzeichen für eine notwendige Sanierung

### 1. Feuchtigkeitsschäden
Wasserflecken an der Decke sind ein deutliches Warnsignal. Handeln Sie schnell, um größere Schäden zu vermeiden.

### 2. Beschädigte Dachziegel
Fehlende, gebrochene oder verrutschte Ziegel müssen ersetzt werden.

### 3. Alter des Dachs
- Tonziegel: 50-80 Jahre
- Betondachsteine: 40-60 Jahre
- Schiefer: 80-100 Jahre

### 4. Verschlissene Dämmung
Eine veraltete Dämmung erhöht Ihre Heizkosten erheblich.

### 5. Moosbewuchs
Starker Bewuchs kann die Dachziegel beschädigen.

### 6. Beschädigte Regenrinnen
Defekte Rinnen führen zu Feuchtigkeitsschäden.

### 7. Dachstuhl-Probleme
Risse oder Schädlingsbefall im Dachstuhl erfordern sofortiges Handeln.

## Kosten einer Dachsanierung

Die Kosten variieren je nach Umfang:

- Teilerneuerung: 50-100 € pro m²
- Komplettsanierung: 150-300 € pro m²
- Mit Dämmung: +50-100 € pro m²

## Förderungen nutzen

KfW bietet attraktive Förderungen für Dachsanierungen:
- Bis zu 20% der Kosten als Zuschuss
- Zinsgünstige Kredite
- Bei energetischer Sanierung bis zu 40%

## Fazit

Eine rechtzeitige Dachsanierung verhindert teure Folgeschäden. Lassen Sie Ihr Dach alle 3-5 Jahre von einem Fachmann überprüfen.`,
    contentEn: `An intact roof is essential for maintaining the value of your property. We show you when a roof renovation is necessary.

## 7 Signs of Necessary Renovation

### 1. Moisture Damage
Water stains on the ceiling are a clear warning sign. Act quickly to avoid major damage.

### 2. Damaged Roof Tiles
Missing, broken or slipped tiles must be replaced.

### 3. Age of the Roof
- Clay tiles: 50-80 years
- Concrete roof tiles: 40-60 years
- Slate: 80-100 years

### 4. Worn Insulation
Outdated insulation significantly increases your heating costs.

### 5. Moss Growth
Heavy growth can damage roof tiles.

### 6. Damaged Gutters
Defective gutters lead to moisture damage.

### 7. Roof Truss Problems
Cracks or pest infestation in the roof truss require immediate action.

## Costs of Roof Renovation

Costs vary depending on scope:

- Partial renewal: €50-100 per m²
- Complete renovation: €150-300 per m²
- With insulation: +€50-100 per m²

## Use Funding

KfW offers attractive funding for roof renovations:
- Up to 20% of costs as subsidy
- Low-interest loans
- Up to 40% for energy-efficient renovation

## Conclusion

Timely roof renovation prevents expensive consequential damage. Have your roof checked by a specialist every 3-5 years.`
  }
};

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const { toast } = useToast();
  const [shareOpen, setShareOpen] = useState(false);

  const post = slug ? getBlogPostBySlug(slug) : null;

  if (!post) {
    return (
      <PageLayout>
        <div className="px-4 sm:px-6 lg:px-12 py-12">
          <div className="glass-card rounded-3xl p-8 lg:p-12 max-w-4xl mx-auto text-center">
            <h1 className="text-3xl font-bold text-foreground mb-4">
              {"Article not found"}
            </h1>
            <a href="/blog" className="text-primary hover:text-primary/80">
              {"Back to Blog"}
            </a>
          </div>
        </div>
      </PageLayout>
    );
  }

  const relatedPosts = slug ? getRelatedPosts(slug, 3) : [];

  const handleShare = (platform: string) => {
    const url = window.location.href;
    const title = language === 'de' ? post.titleDe : post.titleEn;
    
    let shareUrl = '';
    switch(platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
        break;
      case 'copy':
        navigator.clipboard.writeText(url);
        toast({
          title: "Link copied",
          description: "The link has been copied to clipboard"
        });
        return;
    }
    
    if (shareUrl) {
      window.open(shareUrl, '_blank', 'width=600,height=400');
    }
  };

  const title = language === 'de' ? post.titleDe : post.titleEn;
  const content = language === 'de' ? post.contentDe : post.contentEn;
  const excerpt = language === 'de' ? post.excerptDe : post.excerptEn;

  // Convert ISO date to formatted date
  const formattedDate = new Date(post.date).toLocaleDateString(
    language === 'de' ? 'de-DE' : 'en-US',
    { year: 'numeric', month: 'long', day: 'numeric' }
  );
  const isoDate = new Date(post.date).toISOString();

  const breadcrumbItems = [
    { label: "Blog", href: "/blog" },
    { label: title, href: `/blog/${post.slug}` }
  ];

  return (
    <PageLayout breadcrumbItems={breadcrumbItems}>
      <>
        <SEO
          title={`${title} | KYSS Vision Blog`}
          description={excerpt}
          canonicalUrl={`/blog/${post.slug}`}
          ogImage={post.image}
          ogType="article"
          articlePublishedTime={isoDate}
          articleModifiedTime={isoDate}
        />
        <ArticleSchema
          article={{
            title,
            description: excerpt,
            author: post.author,
            datePublished: isoDate,
            image: post.image,
            slug: post.slug
          }}
        />
        <BreadcrumbSchema
          items={[
            { name: 'Home', url: '/' },
            { name: 'Blog', url: '/blog' },
            { name: title, url: `/blog/${post.slug}` }
          ]}
        />
      </>
      <article className="px-4 sm:px-6 lg:px-12 py-12">
        {/* Hero Image */}
        <div className="max-w-5xl mx-auto mb-8">
          <img 
            src={post.image} 
            alt={language === 'de' ? post.titleDe : post.titleEn}
            className="w-full h-[400px] object-cover rounded-2xl"
          />
        </div>

        {/* Article Content */}
        <div className="max-w-4xl mx-auto">
          <div className="glass-card rounded-3xl p-8 lg:p-12 mb-8">
            {/* Meta Information */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-6">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                {post.author}
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                {formattedDate}
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                {post.readTime} {"read time"}
              </div>
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl tracking-tight text-foreground font-serif font-normal mb-8">
              {language === 'de' ? post.titleDe : post.titleEn}
            </h1>

            {/* Share Buttons */}
            <div className="flex items-center gap-3 mb-8 pb-8 border-b border-border">
              <span className="text-sm text-muted-foreground">
                {"Share:"}
              </span>
              <button
                onClick={() => handleShare('facebook')}
                className="p-2 rounded-lg hover:bg-accent transition-colors"
                aria-label="Share on Facebook"
              >
                <Facebook className="w-5 h-5 text-foreground" />
              </button>
              <button
                onClick={() => handleShare('twitter')}
                className="p-2 rounded-lg hover:bg-accent transition-colors"
                aria-label="Share on Twitter"
              >
                <Twitter className="w-5 h-5 text-foreground" />
              </button>
              <button
                onClick={() => handleShare('linkedin')}
                className="p-2 rounded-lg hover:bg-accent transition-colors"
                aria-label="Share on LinkedIn"
              >
                <Linkedin className="w-5 h-5 text-foreground" />
              </button>
              <button
                onClick={() => handleShare('copy')}
                className="p-2 rounded-lg hover:bg-accent transition-colors"
                aria-label="Copy link"
              >
                <Share2 className="w-5 h-5 text-foreground" />
              </button>
            </div>

            {/* Content */}
            <div className="prose prose-invert max-w-none">
              {content.split('\n\n').map((paragraph, index) => {
                // Handle headings
                if (paragraph.startsWith('## ')) {
                  return (
                    <h2 key={index} className="text-2xl md:text-3xl text-foreground font-serif font-normal mt-12 mb-4">
                      {paragraph.replace('## ', '')}
                    </h2>
                  );
                }
                if (paragraph.startsWith('### ')) {
                  return (
                    <h3 key={index} className="text-xl md:text-2xl text-foreground font-serif font-normal mt-8 mb-3">
                      {paragraph.replace('### ', '')}
                    </h3>
                  );
                }
                // Handle tables
                if (paragraph.includes('|') && paragraph.includes('---')) {
                  const rows = paragraph.split('\n');
                  const headers = rows[0].split('|').filter(h => h.trim());
                  const dataRows = rows.slice(2);

                  return (
                    <div key={index} className="overflow-x-auto mb-6">
                      <table className="min-w-full border border-border rounded-lg">
                        <thead className="bg-white/[0.03]">
                          <tr>
                            {headers.map((header, i) => (
                              <th key={i} className="px-4 py-2 text-left text-foreground font-semibold border-b border-border">
                                {header.trim()}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {dataRows.map((row, i) => {
                            const cells = row.split('|').filter(c => c.trim());
                            return (
                              <tr key={i} className="border-b border-border/50">
                                {cells.map((cell, j) => (
                                  <td key={j} className="px-4 py-2 text-foreground/90">
                                    {cell.trim()}
                                  </td>
                                ))}
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  );
                }
                // Handle lists
                if (paragraph.startsWith('- ') || paragraph.startsWith('✅ ') || paragraph.startsWith('❌ ') || paragraph.startsWith('⃞ ')) {
                  const items = paragraph.split('\n');
                  return (
                    <ul key={index} className="list-none space-y-2 mb-6">
                      {items.map((item, i) => (
                        <li key={i} className="text-foreground/90 flex items-start gap-2">
                          <span className="mt-1">{item.startsWith('-') ? '•' : item[0]}</span>
                          <span>{item.replace(/^[-✅❌⃞]\s*/, '')}</span>
                        </li>
                      ))}
                    </ul>
                  );
                }
                // Handle horizontal rules
                if (paragraph === '---') {
                  return <hr key={index} className="my-8 border-border" />;
                }
                // Handle bold text
                const formattedParagraph = paragraph
                  .replace(/\*\*([^*]+)\*\*/g, '<strong class="font-semibold">$1</strong>')
                  .replace(/\*([^*]+)\*/g, '<em class="italic">$1</em>');

                return (
                  <p key={index} className="text-foreground/90 leading-relaxed mb-6" dangerouslySetInnerHTML={{ __html: formattedParagraph }} />
                );
              })}
            </div>
          </div>

          {/* Related Posts */}
          {relatedPosts.length > 0 && (
            <div className="mt-16">
              <h2 className="text-3xl md:text-4xl tracking-tight text-foreground font-serif font-normal mb-8">
                {"Related Articles"}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedPosts.map((related) => (
                  <a
                    key={related.slug}
                    href={`/blog/${related.slug}`}
                    className="glass-card rounded-xl overflow-hidden group hover:border-white/[0.12] transition-all duration-300"
                  >
                    <div className="aspect-video overflow-hidden">
                      <img 
                        src={related.image} 
                        alt={language === 'de' ? related.titleDe : related.titleEn}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-2">
                        {language === 'de' ? related.titleDe : related.titleEn}
                      </h3>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Clock className="w-3 h-3" />
                        {related.readTime}
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </article>
    </PageLayout>
  );
};

export default BlogPost;
