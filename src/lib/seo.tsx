import { Helmet } from 'react-helmet-async';

export interface SEOProps {
  title: string;
  description: string;
  canonicalUrl: string;
  ogImage?: string;
  ogType?: 'website' | 'article';
  articlePublishedTime?: string;
  articleModifiedTime?: string;
  noindex?: boolean;
}

export function SEO({
  title,
  description,
  canonicalUrl,
  ogImage = 'https://kyssvision.com/og-image.png',
  ogType = 'website',
  articlePublishedTime,
  articleModifiedTime,
  noindex = false,
}: SEOProps) {
  const siteUrl = 'https://kyssvision.com';
  const fullUrl = `${siteUrl}${canonicalUrl}`;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={fullUrl} />
      
      {/* Robots Meta Tag */}
      {noindex && <meta name="robots" content="noindex,nofollow" />}
      
      {/* Language Alternates */}
      <link rel="alternate" hrefLang="de" href={fullUrl} />
      <link rel="alternate" hrefLang="en" href={fullUrl} />
      <link rel="alternate" hrefLang="x-default" href={fullUrl} />
      
      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:site_name" content="KYSS Vision" />
      
      {/* Article Specific Meta Tags */}
      {ogType === 'article' && articlePublishedTime && (
        <meta property="article:published_time" content={articlePublishedTime} />
      )}
      {ogType === 'article' && articleModifiedTime && (
        <meta property="article:modified_time" content={articleModifiedTime} />
      )}
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@KYSSVision" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
    </Helmet>
  );
}

// Structured Data Helpers
export function OrganizationSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "KYSS Vision",
    "image": "https://kyssvision.com/favicon.png",
    "url": "https://kyssvision.com",
    "logo": "https://kyssvision.com/favicon.png",
    "description": "Vergleichen Sie kostenlos Angebote von geprüften Handwerkern in Hessen und Nordrhein-Westfalen. Heizung, Solar, Dach, Klempner, Elektriker und mehr.",
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "DE",
      "addressRegion": "Hessen"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 50.1109,
      "longitude": 8.6821
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+49-69-123456",
      "contactType": "Customer Service",
      "areaServed": ["DE-HE", "DE-NW"],
      "availableLanguage": ["de", "en"],
      "contactOption": "TollFree"
    },
    "areaServed": [
      {
        "@type": "State",
        "name": "Hessen",
        "containedInPlace": { "@type": "Country", "name": "Deutschland" }
      },
      {
        "@type": "State",
        "name": "Nordrhein-Westfalen",
        "containedInPlace": { "@type": "Country", "name": "Deutschland" }
      }
    ],
    "serviceArea": [
      { "@type": "City", "name": "Frankfurt am Main" },
      { "@type": "City", "name": "Wiesbaden" },
      { "@type": "City", "name": "Kassel" },
      { "@type": "City", "name": "Darmstadt" },
      { "@type": "City", "name": "Offenbach am Main" },
      { "@type": "City", "name": "Hanau" },
      { "@type": "City", "name": "Gießen" },
      { "@type": "City", "name": "Marburg" },
      { "@type": "City", "name": "Fulda" },
      { "@type": "City", "name": "Rüsselsheim am Main" },
      { "@type": "City", "name": "Köln" },
      { "@type": "City", "name": "Düsseldorf" },
      { "@type": "City", "name": "Dortmund" },
      { "@type": "City", "name": "Essen" },
      { "@type": "City", "name": "Duisburg" },
      { "@type": "City", "name": "Bochum" },
      { "@type": "City", "name": "Wuppertal" },
      { "@type": "City", "name": "Bonn" },
      { "@type": "City", "name": "Münster" },
      { "@type": "City", "name": "Aachen" }
    ],
    "priceRange": "€€",
    "openingHours": "Mo-Fr 08:00-18:00",
    "sameAs": []
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(schema)}
      </script>
    </Helmet>
  );
}

export function ServiceSchema({ service }: {
  service: {
    name: string;
    description: string;
    slug: string;
  }
}) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "serviceType": service.name,
    "name": service.name,
    "description": service.description,
    "provider": {
      "@type": "Organization",
      "name": "KYSS Vision",
      "url": "https://kyssvision.com"
    },
    "areaServed": [
      {
        "@type": "State",
        "name": "Hessen",
        "containedInPlace": {
          "@type": "Country",
          "name": "Germany"
        }
      },
      {
        "@type": "State",
        "name": "North Rhine-Westphalia",
        "containedInPlace": {
          "@type": "Country",
          "name": "Germany"
        }
      }
    ],
    "availableChannel": {
      "@type": "ServiceChannel",
      "availableLanguage": ["de", "en"]
    },
    "url": `https://kyssvision.com/services/${service.slug}`,
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "EUR",
      "description": "Kostenlose Angebotsvergleiche von geprüften Fachleuten in Hessen und Nordrhein-Westfalen"
    }
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(schema)}
      </script>
    </Helmet>
  );
}

export function ArticleSchema({ article }: {
  article: {
    title: string;
    description: string;
    author: string;
    datePublished: string;
    image: string;
    slug: string;
  }
}) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": article.title,
    "description": article.description,
    "image": article.image,
    "author": {
      "@type": "Person",
      "name": article.author
    },
    "publisher": {
      "@type": "Organization",
      "name": "KYSS Vision",
      "logo": {
        "@type": "ImageObject",
        "url": "https://kyssvision.com/favicon.png"
      }
    },
    "datePublished": article.datePublished,
    "dateModified": article.datePublished,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://kyssvision.com/blog/${article.slug}`
    }
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(schema)}
      </script>
    </Helmet>
  );
}

export function BreadcrumbSchema({ items }: { items: { name: string; url: string }[] }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": `https://kyssvision.com${item.url}`
    }))
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(schema)}
      </script>
    </Helmet>
  );
}

export function FAQSchema({ faqs }: {
  faqs: Array<{ question: string; answer: string }>
}) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(schema)}
      </script>
    </Helmet>
  );
}
