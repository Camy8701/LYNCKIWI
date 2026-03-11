import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { getServiceBySlug, getCities, type City } from '@/lib/database';
import { getIconComponent } from '@/lib/serviceIcons';
import PageLayout from '@/components/PageLayout';
import ServiceRequestForm from '@/components/ServiceRequestForm';
import { Check, ArrowRight, Clock, Shield, Users, Award, Phone, Mail } from 'lucide-react';
import type { Service } from '@/lib/database';
import { SEO, ServiceSchema, BreadcrumbSchema } from '@/lib/seo';

// Service images mapping - relevant, high-quality images for each service
const serviceImages: Record<string, string> = {
  heizung: "/heating-hvac.jpg",
  solar: "/solar-panel.jpg",
  dachdecker: "/roofing.jpg",
  klempner: "/plumbing-sanitary.png",
  elektriker: "/electrician.jpg",
  renovierung: "/general-renovation.jpg",
};

// Comprehensive service details data
const serviceDetailsData: Record<string, {
  benefits: { de: string[]; en: string[] };
  coverage: { de: string[]; en: string[] };
  process: { de: Array<{ title: string; desc: string }>; en: Array<{ title: string; desc: string }> };
  whyUs: { de: string[]; en: string[] };
}> = {
  heizung: {
    benefits: {
      de: [
        "Energieeffiziente Heizsysteme für niedrigere Betriebskosten",
        "Moderne Heizungstechnologie für optimalen Komfort",
        "Reduzierung des CO2-Fußabdrucks",
        "Längere Lebensdauer durch professionelle Installation",
        "Wartungsarme Systeme"
      ],
      en: [
        "Energy-efficient heating systems for lower operating costs",
        "Modern heating technology for optimal comfort",
        "Reduced carbon footprint",
        "Longer lifespan through professional installation",
        "Low-maintenance systems"
      ]
    },
    coverage: {
      de: [
        "Heizungsinstallation und -austausch",
        "Wartung und Reparatur bestehender Systeme",
        "Gas-, Öl- und Pelletheizungen",
        "Wärmepumpen und Solarheizungen",
        "Fußbodenheizung und Heizkörper",
        "Notfallreparaturen rund um die Uhr"
      ],
      en: [
        "Heating installation and replacement",
        "Maintenance and repair of existing systems",
        "Gas, oil, and pellet heating",
        "Heat pumps and solar heating",
        "Underfloor heating and radiators",
        "24/7 emergency repairs"
      ]
    },
    process: {
      de: [
        { title: "Kostenlose Beratung", desc: "Unsere Experten beraten Sie zu den besten Heizsystemen für Ihr Zuhause" },
        { title: "Vor-Ort-Besichtigung", desc: "Wir analysieren Ihre Räumlichkeiten und erstellen ein maßgeschneidertes Angebot" },
        { title: "Professionelle Installation", desc: "Zertifizierte Fachkräfte installieren Ihr neues Heizsystem" },
        { title: "Inbetriebnahme & Schulung", desc: "Wir stellen das System optimal ein und zeigen Ihnen die Bedienung" }
      ],
      en: [
        { title: "Free Consultation", desc: "Our experts advise you on the best heating systems for your home" },
        { title: "On-site Inspection", desc: "We analyze your premises and create a customized quote" },
        { title: "Professional Installation", desc: "Certified professionals install your new heating system" },
        { title: "Commissioning & Training", desc: "We optimize the system and show you how to operate it" }
      ]
    },
    whyUs: {
      de: [
        "Über 15 Jahre Erfahrung in der Heizungsbranche",
        "Zertifizierte und versicherte Fachleute",
        "Transparente Preisgestaltung ohne versteckte Kosten",
        "Garantie auf alle Installationen",
        "Schneller Service und Notfallbereitschaft"
      ],
      en: [
        "Over 15 years of experience in heating industry",
        "Certified and insured professionals",
        "Transparent pricing with no hidden costs",
        "Warranty on all installations",
        "Fast service and emergency availability"
      ]
    }
  },
  solar: {
    benefits: {
      de: [
        "Reduzierung der Stromkosten um bis zu 70%",
        "Unabhängigkeit von steigenden Energiepreisen",
        "Umweltfreundliche erneuerbare Energie",
        "Wertsteigerung Ihrer Immobilie",
        "Staatliche Förderungen und Steuervorteile"
      ],
      en: [
        "Reduce electricity costs by up to 70%",
        "Independence from rising energy prices",
        "Environmentally friendly renewable energy",
        "Increase in property value",
        "Government subsidies and tax benefits"
      ]
    },
    coverage: {
      de: [
        "Photovoltaikanlagen für Privathaushalte",
        "Solarthermie für Warmwasser und Heizung",
        "Batteriespeicher und Energiemanagement",
        "Wartung und Reinigung von Solaranlagen",
        "Ertragsoptimierung bestehender Anlagen",
        "Komplettlösungen mit Montage und Inbetriebnahme"
      ],
      en: [
        "Photovoltaic systems for private households",
        "Solar thermal for hot water and heating",
        "Battery storage and energy management",
        "Maintenance and cleaning of solar systems",
        "Yield optimization of existing systems",
        "Complete solutions with assembly and commissioning"
      ]
    },
    process: {
      de: [
        { title: "Potenzialanalyse", desc: "Wir prüfen Ihr Dach und berechnen die mögliche Energieausbeute" },
        { title: "Individuelle Planung", desc: "Erstellung eines maßgeschneiderten Solarkonzepts" },
        { title: "Installation", desc: "Professionelle Montage durch erfahrene Solartechniker" },
        { title: "Netzanschluss", desc: "Wir kümmern uns um alle Formalitäten und Anmeldungen" }
      ],
      en: [
        { title: "Potential Analysis", desc: "We examine your roof and calculate the possible energy yield" },
        { title: "Individual Planning", desc: "Creation of a customized solar concept" },
        { title: "Installation", desc: "Professional assembly by experienced solar technicians" },
        { title: "Grid Connection", desc: "We take care of all formalities and registrations" }
      ]
    },
    whyUs: {
      de: [
        "Langjährige Expertise in Solartechnik",
        "Verwendung hochwertiger Komponenten",
        "Umfassende Garantie auf Module und Wechselrichter",
        "Unterstützung bei Fördermittelanträgen",
        "Monitoring und Wartungsservice"
      ],
      en: [
        "Long-standing expertise in solar technology",
        "Use of high-quality components",
        "Comprehensive warranty on modules and inverters",
        "Support with funding applications",
        "Monitoring and maintenance service"
      ]
    }
  },
  dachdecker: {
    benefits: {
      de: [
        "Schutz Ihres Hauses vor Witterungseinflüssen",
        "Energieeffiziente Dachdämmung",
        "Wertsteigerung Ihrer Immobilie",
        "Lange Lebensdauer durch Qualitätsmaterialien",
        "Vermeidung von Folgeschäden"
      ],
      en: [
        "Protection of your house from weather influences",
        "Energy-efficient roof insulation",
        "Increase in property value",
        "Long lifespan through quality materials",
        "Prevention of consequential damage"
      ]
    },
    coverage: {
      de: [
        "Neueindeckung und Dachsanierung",
        "Dachdämmung und Energieberatung",
        "Flachdachabdichtung",
        "Dachfenster und Gauben",
        "Reparatur von Sturmschäden",
        "Dachrinnen und Entwässerung"
      ],
      en: [
        "New roofing and roof renovation",
        "Roof insulation and energy consulting",
        "Flat roof sealing",
        "Skylights and dormers",
        "Storm damage repair",
        "Gutters and drainage"
      ]
    },
    process: {
      de: [
        { title: "Dachinspektion", desc: "Gründliche Begutachtung des Dachzustands" },
        { title: "Kostenvoranschlag", desc: "Detailliertes Angebot mit Materialliste" },
        { title: "Ausführung", desc: "Professionelle Durchführung der Dacharbeiten" },
        { title: "Abnahme", desc: "Gemeinsame Kontrolle und Übergabe" }
      ],
      en: [
        { title: "Roof Inspection", desc: "Thorough assessment of roof condition" },
        { title: "Cost Estimate", desc: "Detailed quote with materials list" },
        { title: "Execution", desc: "Professional execution of roofing work" },
        { title: "Acceptance", desc: "Joint inspection and handover" }
      ]
    },
    whyUs: {
      de: [
        "Meisterbetrieb mit langjähriger Tradition",
        "Sichere Arbeitsweise nach Sicherheitsstandards",
        "Hochwertige Materialien von Markenherstellern",
        "Garantie und Gewährleistung",
        "Notdienst bei Sturmschäden"
      ],
      en: [
        "Master craftsman business with long tradition",
        "Safe working according to safety standards",
        "High-quality materials from brand manufacturers",
        "Guarantee and warranty",
        "Emergency service for storm damage"
      ]
    }
  },
  klempner: {
    benefits: {
      de: [
        "Schnelle Behebung von Wasserschäden",
        "Moderne sanitäre Anlagen",
        "Wassersparende Technologien",
        "Langlebige Installationen",
        "24/7 Notdienst verfügbar"
      ],
      en: [
        "Fast resolution of water damage",
        "Modern sanitary facilities",
        "Water-saving technologies",
        "Durable installations",
        "24/7 emergency service available"
      ]
    },
    coverage: {
      de: [
        "Sanitärinstallationen und -reparaturen",
        "Rohrverstopfungen und Leckagen",
        "Bad- und Küchenrenovierungen",
        "Warmwasserbereiter und Boiler",
        "Abfluss- und Kanalsanierung",
        "Notfallreparaturen"
      ],
      en: [
        "Plumbing installations and repairs",
        "Pipe blockages and leaks",
        "Bathroom and kitchen renovations",
        "Water heaters and boilers",
        "Drain and sewer rehabilitation",
        "Emergency repairs"
      ]
    },
    process: {
      de: [
        { title: "Problemanalyse", desc: "Schnelle Diagnose des Problems vor Ort" },
        { title: "Lösungsvorschlag", desc: "Transparente Erklärung der Reparaturoptionen" },
        { title: "Reparatur", desc: "Fachgerechte Ausführung mit Qualitätsmaterialien" },
        { title: "Funktionstest", desc: "Prüfung der Anlage und Dokumentation" }
      ],
      en: [
        { title: "Problem Analysis", desc: "Quick on-site diagnosis of the problem" },
        { title: "Solution Proposal", desc: "Transparent explanation of repair options" },
        { title: "Repair", desc: "Professional execution with quality materials" },
        { title: "Function Test", desc: "System check and documentation" }
      ]
    },
    whyUs: {
      de: [
        "Zertifizierte Sanitärfachkräfte",
        "Schnelle Reaktionszeit bei Notfällen",
        "Faire und transparente Preise",
        "Modernste Werkzeuge und Techniken",
        "Saubere Arbeitsweise"
      ],
      en: [
        "Certified plumbing professionals",
        "Fast response time in emergencies",
        "Fair and transparent prices",
        "State-of-the-art tools and techniques",
        "Clean working method"
      ]
    }
  },
  elektriker: {
    benefits: {
      de: [
        "Sicherheit durch normgerechte Elektroinstallationen",
        "Energieeffiziente Beleuchtungskonzepte",
        "Smart-Home-Integration",
        "Schutz vor Überspannung",
        "Zukunftssichere Verkabelung"
      ],
      en: [
        "Safety through standard-compliant electrical installations",
        "Energy-efficient lighting concepts",
        "Smart home integration",
        "Overvoltage protection",
        "Future-proof wiring"
      ]
    },
    coverage: {
      de: [
        "Elektrinstallationen für Neubauten und Renovierungen",
        "Smart-Home-Systeme und Automation",
        "Beleuchtungsplanung und -installation",
        "E-Mobility und Wallbox-Installation",
        "Sicherungskästen und FI-Schutzschalter",
        "Elektroprüfung und Wartung"
      ],
      en: [
        "Electrical installations for new buildings and renovations",
        "Smart home systems and automation",
        "Lighting planning and installation",
        "E-mobility and wallbox installation",
        "Fuse boxes and RCD circuit breakers",
        "Electrical testing and maintenance"
      ]
    },
    process: {
      de: [
        { title: "Bedarfsanalyse", desc: "Ermittlung Ihrer elektrischen Anforderungen" },
        { title: "Planung", desc: "Erstellung eines Elektrokonzepts" },
        { title: "Installation", desc: "Fachgerechte Verlegung und Montage" },
        { title: "Abnahme", desc: "Prüfung und Zertifizierung der Anlage" }
      ],
      en: [
        { title: "Needs Analysis", desc: "Determination of your electrical requirements" },
        { title: "Planning", desc: "Creation of an electrical concept" },
        { title: "Installation", desc: "Professional laying and assembly" },
        { title: "Acceptance", desc: "Testing and certification of the system" }
      ]
    },
    whyUs: {
      de: [
        "Qualifizierte Elektromeister",
        "Einhaltung aller Sicherheitsvorschriften",
        "Zertifizierte Fachbetrieb",
        "Garantie auf alle Arbeiten",
        "Kundendienst und Support"
      ],
      en: [
        "Qualified electrical masters",
        "Compliance with all safety regulations",
        "Certified specialist company",
        "Warranty on all work",
        "Customer service and support"
      ]
    }
  },
  renovierung: {
    benefits: {
      de: [
        "Wertsteigerung Ihrer Immobilie",
        "Verbesserung der Wohnqualität",
        "Energetische Sanierung",
        "Modernisierung veralteter Technik",
        "Alles aus einer Hand"
      ],
      en: [
        "Increase in property value",
        "Improvement of living quality",
        "Energy renovation",
        "Modernization of outdated technology",
        "Everything from one source"
      ]
    },
    coverage: {
      de: [
        "Komplette Wohnungsrenovierungen",
        "Bad- und Küchenmodernisierung",
        "Malerarbeiten und Tapezieren",
        "Bodenverlegung (Parkett, Fliesen, Laminat)",
        "Trockenbau und Raumaufteilung",
        "Fenster- und Türenaustausch"
      ],
      en: [
        "Complete apartment renovations",
        "Bathroom and kitchen modernization",
        "Painting and wallpapering",
        "Floor laying (parquet, tiles, laminate)",
        "Drywall and room division",
        "Window and door replacement"
      ]
    },
    process: {
      de: [
        { title: "Erstberatung", desc: "Besprechung Ihrer Wünsche und Vorstellungen" },
        { title: "Konzepterstellung", desc: "Detaillierte Planung und Visualisierung" },
        { title: "Koordination", desc: "Organisation aller Gewerke" },
        { title: "Übergabe", desc: "Abnahme und Einweisung in Ihr neues Zuhause" }
      ],
      en: [
        { title: "Initial Consultation", desc: "Discussion of your wishes and ideas" },
        { title: "Concept Creation", desc: "Detailed planning and visualization" },
        { title: "Coordination", desc: "Organization of all trades" },
        { title: "Handover", desc: "Acceptance and introduction to your new home" }
      ]
    },
    whyUs: {
      de: [
        "Erfahrene Projektleitung",
        "Netzwerk geprüfter Handwerker",
        "Termintreue und Zuverlässigkeit",
        "Festpreisgarantie",
        "Persönlicher Ansprechpartner"
      ],
      en: [
        "Experienced project management",
        "Network of verified craftsmen",
        "Punctuality and reliability",
        "Fixed price guarantee",
        "Personal contact person"
      ]
    }
  }
};

export default function ServiceDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { language, t } = useLanguage();
  const [service, setService] = useState<Service | null>(null);
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    async function loadData() {
      if (!slug) return;

      setLoading(true);
      try {
        const [serviceData, citiesData] = await Promise.all([
          getServiceBySlug(slug),
          getCities()
        ]);

        if (!serviceData) {
          setNotFound(true);
        } else {
          setService(serviceData);
          setCities(citiesData);
        }
      } catch (error) {
        console.error('Error loading service:', error);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [slug]);

  const scrollToForm = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const formElement = document.getElementById('quote-form');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  if (loading) {
    return (
      <PageLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-pulse text-muted-foreground">
            {t('Laden...', 'Loading...')}
          </div>
        </div>
      </PageLayout>
    );
  }

  if (notFound || !service) {
    return (
      <PageLayout>
        <div className="flex items-center justify-center min-h-screen px-4">
          <div className="text-center">
            <h1 className="text-4xl font-serif text-foreground mb-4">
              {t('Service nicht gefunden', 'Service not found')}
            </h1>
            <Link to="/" className="text-primary hover:underline">
              {t('Zurück zur Startseite', 'Back to homepage')}
            </Link>
          </div>
        </div>
      </PageLayout>
    );
  }

  const Icon = getIconComponent(service.icon);
  const serviceName = language === 'de' ? service.name : service.name_en;
  const serviceDescription = language === 'de' ? service.description : service.description_en;
  const image = serviceImages[service.slug] || serviceImages.renovierung;
  const details = serviceDetailsData[service.slug] || serviceDetailsData.renovierung;

  const seoTitle = language === 'de'
    ? `${serviceName} in Hessen & NRW | Frankfurt • Köln • Düsseldorf | Lynck Services`
    : `${serviceName} in Hesse & NRW | Frankfurt • Cologne • Düsseldorf | Lynck Services`;

  const seoDescription = serviceDescription || (language === 'de'
    ? `${serviceName} in 20 Städten: Frankfurt, Köln, Düsseldorf & mehr. Kostenloser Angebotsvergleich von geprüften Fachleuten in Hessen und Nordrhein-Westfalen. Jetzt Angebot anfordern!`
    : `${serviceName} in 20 cities: Frankfurt, Cologne, Düsseldorf & more. Free quote comparison from verified professionals in Hesse and North Rhine-Westphalia. Request now!`);

  return (
    <PageLayout>
      <>
        <SEO
          title={seoTitle}
          description={seoDescription}
          canonicalUrl={`/services/${service.slug}`}
          ogType="website"
        />
        <ServiceSchema
          service={{
            name: serviceName,
            description: seoDescription,
            slug: service.slug
          }}
        />
        <BreadcrumbSchema
          items={[
            { name: 'Home', url: '/' },
            { name: t('Dienstleistungen', 'Services'), url: '/#services' },
            { name: serviceName, url: `/services/${service.slug}` }
          ]}
        />
      </>
      <main className="flex-1 overflow-y-auto">
        {/* Breadcrumb */}
        <nav className="px-4 md:px-8 py-4">
          <div className="text-sm text-muted-foreground">
            <Link to="/" className="hover:text-primary transition-colors">
              {t('Home', 'Home')}
            </Link>
            <span className="mx-2">/</span>
            <Link to="/#services" className="hover:text-primary transition-colors">
              {t('Dienstleistungen', 'Services')}
            </Link>
            <span className="mx-2">/</span>
            <span className="text-foreground">{serviceName}</span>
          </div>
        </nav>

        {/* Hero Section with Image */}
        <div className="relative h-[400px] overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${image})` }}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-background" />
          </div>
          <div className="relative h-full flex items-center justify-center px-4">
            <div className="text-center max-w-4xl">
              <div className="flex items-center justify-center gap-4 mb-6">
                <Icon className="w-16 h-16 text-primary" />
              </div>
              <h1 className="text-4xl md:text-6xl font-serif text-white mb-4">
                {serviceName}
              </h1>
              <p className="text-xl text-gray-200 mb-8">
                {serviceDescription}
              </p>
              <a
                href="#quote-form"
                onClick={scrollToForm}
                className="inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-black font-semibold px-8 py-4 rounded-full transition-all duration-300 hover:scale-105"
              >
                {t('Jetzt Angebot anfordern', 'Request Quote Now')}
                <ArrowRight className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="px-4 md:px-8 py-16">
          <div className="max-w-7xl mx-auto">

            {/* Process Section - How It Works */}
            <section className="mb-20">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-serif text-foreground mb-4">
                  {t('So läuft es ab', 'How It Works')}
                </h2>
                <p className="text-muted-foreground text-lg">
                  {t('Unser bewährter Prozess für Ihr Projekt', 'Our proven process for your project')}
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {(language === 'de' ? details.process.de : details.process.en).map((step, index) => (
                  <div key={index} className="relative">
                    <div className="bg-card border border-border rounded-2xl p-6 h-full">
                      <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mb-4">
                        <span className="text-primary text-xl font-bold">{index + 1}</span>
                      </div>
                      <h3 className="text-lg font-semibold text-foreground mb-2">{step.title}</h3>
                      <p className="text-muted-foreground text-sm">{step.desc}</p>
                    </div>
                    {index < 3 && (
                      <div className="hidden lg:block absolute top-1/2 -right-3 w-6 h-0.5 bg-primary/30" />
                    )}
                  </div>
                ))}
              </div>
            </section>

            {/* Quote Form Section */}
            <section id="quote-form" className="scroll-mt-8 mb-20">
              <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-3xl p-8 md:p-12">
                <div className="text-center mb-8">
                  <h2 className="text-3xl md:text-4xl font-serif text-foreground mb-4">
                    {t('Jetzt kostenlos Angebot anfordern', 'Request Your Free Quote Now')}
                  </h2>
                  <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                    {t('Füllen Sie das Formular aus und einer unserer Spezialisten wird Sie so schnell wie möglich kontaktieren.', 'Fill out the form and one of our specialists will contact you as soon as possible.')}
                  </p>
                </div>

                <div className="max-w-4xl mx-auto bg-card border border-border rounded-2xl p-6 md:p-10 shadow-xl">
                  <ServiceRequestForm service={service} cities={cities} />
                </div>

                {/* Trust Indicators */}
                <div className="flex flex-wrap justify-center items-center gap-6 mt-8 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-primary" />
                    <span>{t('100% kostenlos', '100% free')}</span>
                  </div>
                  <span className="hidden sm:inline">•</span>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-primary" />
                    <span>{t('Unverbindlich', 'No obligation')}</span>
                  </div>
                  <span className="hidden sm:inline">•</span>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-primary" />
                    <span>{t('Schnelle Antwort', 'Fast response')}</span>
                  </div>
                </div>
              </div>
            </section>

            {/* Benefits Section */}
            <section className="mb-20">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-serif text-foreground mb-4">
                  {t('Ihre Vorteile', 'Your Benefits')}
                </h2>
                <p className="text-muted-foreground text-lg">
                  {t('Warum Sie sich für unsere professionellen Dienstleistungen entscheiden sollten', 'Why you should choose our professional services')}
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {(language === 'de' ? details.benefits.de : details.benefits.en).map((benefit, index) => (
                  <div key={index} className="bg-card border border-border rounded-2xl p-6 hover:border-primary/50 transition-all duration-300">
                    <Check className="w-8 h-8 text-primary mb-4" />
                    <p className="text-foreground">{benefit}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Why Choose Us */}
            <section className="mb-20">
              <div className="glass-card rounded-3xl p-8 md:p-12">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                  <div>
                    <h2 className="text-3xl md:text-4xl font-serif text-foreground mb-6">
                      {t('Warum wir?', 'Why Us?')}
                    </h2>
                    <p className="text-muted-foreground mb-8">
                      {t('Wir verbinden Sie mit den besten Fachleuten in Ihrer Region', 'We connect you with the best professionals in your region')}
                    </p>
                    <div className="space-y-4">
                      {(language === 'de' ? details.whyUs.de : details.whyUs.en).map((reason, index) => (
                        <div key={index} className="flex items-start gap-3">
                          <Award className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                          <span className="text-foreground">{reason}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="bg-primary/10 border border-primary/20 rounded-2xl p-6 text-center">
                      <Clock className="w-8 h-8 text-primary mx-auto mb-3" />
                      <div className="text-3xl font-bold text-foreground mb-2">24h</div>
                      <div className="text-sm text-muted-foreground">{t('Reaktionszeit', 'Response Time')}</div>
                    </div>
                    <div className="bg-primary/10 border border-primary/20 rounded-2xl p-6 text-center">
                      <Shield className="w-8 h-8 text-primary mx-auto mb-3" />
                      <div className="text-3xl font-bold text-foreground mb-2">100%</div>
                      <div className="text-sm text-muted-foreground">{t('Geprüft', 'Verified')}</div>
                    </div>
                    <div className="bg-primary/10 border border-primary/20 rounded-2xl p-6 text-center">
                      <Users className="w-8 h-8 text-primary mx-auto mb-3" />
                      <div className="text-lg font-bold text-foreground mb-2">{t('Geprüfte', 'Verified')}</div>
                      <div className="text-sm text-muted-foreground">{t('Fachleute vor Ort', 'Professionals In Your Area')}</div>
                    </div>
                    <div className="bg-primary/10 border border-primary/20 rounded-2xl p-6 text-center">
                      <Award className="w-8 h-8 text-primary mx-auto mb-3" />
                      <div className="text-3xl font-bold text-foreground mb-2">15+</div>
                      <div className="text-sm text-muted-foreground">{t('Jahre', 'Years')}</div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Service Coverage */}
            <section className="mb-20">
              <div className="glass-card rounded-3xl p-8 md:p-12">
                <h2 className="text-3xl md:text-4xl font-serif text-foreground mb-8">
                  {t('Unsere Leistungen', 'Our Services')}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {(language === 'de' ? details.coverage.de : details.coverage.en).map((item, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                      <span className="text-foreground">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </section>

          </div>
        </div>
      </main>
    </PageLayout>
  );
}
