import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { getCities, type City } from '@/lib/database';
import PageLayout from '@/components/PageLayout';
import ServiceRequestForm from '@/components/ServiceRequestForm';
import { Check, ArrowRight, Clock, Shield, Users, Award } from 'lucide-react';
import { SEO, BreadcrumbSchema } from '@/lib/seo';
import { servicesData, getServiceBySlug } from '@/data/servicesData';
import { getIconComponent } from '@/lib/serviceIcons';

// Comprehensive service details data for all 9 services
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
  waermepumpe: {
    benefits: {
      de: [
        "Bis zu 70% Förderung durch BEG-Programm",
        "Deutliche Reduzierung der Heizkosten",
        "Umweltfreundlich und klimaneutral",
        "Unabhängigkeit von fossilen Brennstoffen",
        "Niedrige Betriebskosten"
      ],
      en: [
        "Up to 70% subsidy through BEG program",
        "Significant reduction in heating costs",
        "Environmentally friendly and climate neutral",
        "Independence from fossil fuels",
        "Low operating costs"
      ]
    },
    coverage: {
      de: [
        "Luft-Wasser-Wärmepumpen",
        "Sole-Wasser-Wärmepumpen (Erdwärme)",
        "Wasser-Wasser-Wärmepumpen",
        "Brennstoffzellen und BHKW",
        "Holzpellet-Heizungen",
        "Hybridlösungen"
      ],
      en: [
        "Air-water heat pumps",
        "Ground-water heat pumps (geothermal)",
        "Water-water heat pumps",
        "Fuel cells and CHP units",
        "Wood pellet heating",
        "Hybrid solutions"
      ]
    },
    process: {
      de: [
        { title: "Energieberatung", desc: "Analyse Ihres Gebäudes und Ermittlung der optimalen Lösung" },
        { title: "Fördermittelberatung", desc: "Unterstützung bei der Beantragung staatlicher Zuschüsse" },
        { title: "Installation", desc: "Fachgerechte Montage durch zertifizierte Wärmepumpen-Installateure" },
        { title: "Optimierung", desc: "Hydraulischer Abgleich und Einstellung für maximale Effizienz" }
      ],
      en: [
        { title: "Energy Consultation", desc: "Analysis of your building and determination of optimal solution" },
        { title: "Funding Advice", desc: "Support in applying for government subsidies" },
        { title: "Installation", desc: "Professional installation by certified heat pump installers" },
        { title: "Optimization", desc: "Hydraulic balancing and adjustment for maximum efficiency" }
      ]
    },
    whyUs: {
      de: [
        "Spezialisiert auf Wärmepumpentechnik",
        "Erfahrung mit allen Förderprogrammen",
        "Ganzheitliche Energiekonzepte",
        "Langfristige Wartungsverträge",
        "Monitoring und Fernwartung"
      ],
      en: [
        "Specialized in heat pump technology",
        "Experience with all funding programs",
        "Holistic energy concepts",
        "Long-term maintenance contracts",
        "Monitoring and remote maintenance"
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
  sanitaer: {
    benefits: {
      de: [
        "Wertsteigerung Ihrer Immobilie durch modernes Bad",
        "Verbesserung der Wohnqualität und des Komforts",
        "Barrierefreie Badlösungen für alle Altersgruppen",
        "Wassersparende und energieeffiziente Sanitärtechnik",
        "Komplettservice von der Planung bis zur Ausführung"
      ],
      en: [
        "Increase in property value through modern bathroom",
        "Improvement of living quality and comfort",
        "Accessible bathroom solutions for all age groups",
        "Water-saving and energy-efficient sanitary technology",
        "Complete service from planning to execution"
      ]
    },
    coverage: {
      de: [
        "Komplette Badsanierung und Badbau",
        "Barrierefreie Badgestaltung",
        "Moderne Sanitärinstallationen",
        "Trinkwasserhygiene und Regenwassernutzung",
        "Badezimmerrenovierung mit hochwertigen Materialien",
        "Planung und Beratung für Ihr Traumbad"
      ],
      en: [
        "Complete bathroom renovation and construction",
        "Accessible bathroom design",
        "Modern sanitary installations",
        "Drinking water hygiene and rainwater harvesting",
        "Bathroom renovation with high-quality materials",
        "Planning and consultation for your dream bathroom"
      ]
    },
    process: {
      de: [
        { title: "Bedarfsanalyse", desc: "Erfassung Ihrer Wünsche und räumlichen Gegebenheiten" },
        { title: "Badplanung", desc: "3D-Visualisierung und Materialauswahl" },
        { title: "Fachgerechte Ausführung", desc: "Installation durch zertifizierte Sanitärfachbetriebe" },
        { title: "Abnahme", desc: "Qualitätskontrolle und Übergabe Ihres neuen Bades" }
      ],
      en: [
        { title: "Needs Analysis", desc: "Recording your wishes and spatial conditions" },
        { title: "Bathroom Planning", desc: "3D visualization and material selection" },
        { title: "Professional Execution", desc: "Installation by certified sanitary specialists" },
        { title: "Acceptance", desc: "Quality control and handover of your new bathroom" }
      ]
    },
    whyUs: {
      de: [
        "Spezialisierte Sanitärfachbetriebe",
        "Moderne Badtechnik und Design",
        "Barrierefreiheit nach DIN-Norm",
        "Kurze Bauzeiten durch gute Planung",
        "Garantie auf Material und Ausführung"
      ],
      en: [
        "Specialized sanitary companies",
        "Modern bathroom technology and design",
        "Accessibility according to DIN standards",
        "Short construction times through good planning",
        "Warranty on materials and workmanship"
      ]
    }
  },
  klimatechnik: {
    benefits: {
      de: [
        "Angenehmes Raumklima das ganze Jahr über",
        "Energieeffiziente Kühlung und Klimatisierung",
        "Verbesserung der Luftqualität",
        "Steigerung der Produktivität in Büros",
        "Schutz temperaturempfindlicher Geräte"
      ],
      en: [
        "Pleasant room climate all year round",
        "Energy-efficient cooling and air conditioning",
        "Improvement of air quality",
        "Increased productivity in offices",
        "Protection of temperature-sensitive equipment"
      ]
    },
    coverage: {
      de: [
        "Klimaanlagen für Wohnräume",
        "Büroklimatisierung",
        "Industrielle Klimatechnik",
        "Kühlzellen und Kühllager",
        "Serverraumkühlung",
        "Wartung und Service"
      ],
      en: [
        "Air conditioning for residential areas",
        "Office air conditioning",
        "Industrial air conditioning",
        "Cold storage rooms and warehouses",
        "Server room cooling",
        "Maintenance and service"
      ]
    },
    process: {
      de: [
        { title: "Bedarfsermittlung", desc: "Analyse der Räumlichkeiten und Kühlbedarf" },
        { title: "Systemauswahl", desc: "Empfehlung der optimalen Klimatechnik" },
        { title: "Installation", desc: "Fachgerechte Montage und Inbetriebnahme" },
        { title: "Wartung", desc: "Regelmäßige Inspektion und Wartungsservice" }
      ],
      en: [
        { title: "Needs Assessment", desc: "Analysis of premises and cooling requirements" },
        { title: "System Selection", desc: "Recommendation of optimal air conditioning" },
        { title: "Installation", desc: "Professional installation and commissioning" },
        { title: "Maintenance", desc: "Regular inspection and maintenance service" }
      ]
    },
    whyUs: {
      de: [
        "Spezialisiert auf Klima- und Kältetechnik",
        "Kälte-Klima-Fachbetrieb nach F-Gase-Verordnung",
        "Energieeffiziente Lösungen",
        "24/7 Notdienst für Geschäftskunden",
        "Wartungsverträge mit Festpreisen"
      ],
      en: [
        "Specialized in air conditioning and refrigeration",
        "Certified AC specialist per F-Gas regulation",
        "Energy-efficient solutions",
        "24/7 emergency service for business customers",
        "Maintenance contracts with fixed prices"
      ]
    }
  },
  'service-beratung': {
    benefits: {
      de: [
        "Professionelle Energieberatung",
        "Optimierung bestehender Anlagen",
        "Schnelle Notdienste verfügbar",
        "Präventive Wartung spart Kosten",
        "Fachkundige Unterstützung bei Fördermitteln"
      ],
      en: [
        "Professional energy consulting",
        "Optimization of existing systems",
        "Fast emergency services available",
        "Preventive maintenance saves costs",
        "Expert support for subsidies"
      ]
    },
    coverage: {
      de: [
        "Energieberatung und -optimierung",
        "Heizungs- und Gebäudechecks",
        "Thermografie und Leckortung",
        "Kanal-Kamerainspektionen",
        "Fördermittelberatung",
        "Notdienste aller Art"
      ],
      en: [
        "Energy consulting and optimization",
        "Heating and building inspections",
        "Thermography and leak detection",
        "Sewer camera inspections",
        "Funding consultation",
        "Emergency services of all kinds"
      ]
    },
    process: {
      de: [
        { title: "Erstberatung", desc: "Kostenlose Beratung zu Ihrem Anliegen" },
        { title: "Analyse", desc: "Detaillierte Untersuchung vor Ort" },
        { title: "Lösungskonzept", desc: "Erstellung eines maßgeschneiderten Plans" },
        { title: "Umsetzung", desc: "Koordinierte Durchführung aller Maßnahmen" }
      ],
      en: [
        { title: "Initial Consultation", desc: "Free consultation on your concern" },
        { title: "Analysis", desc: "Detailed on-site examination" },
        { title: "Solution Concept", desc: "Creation of a customized plan" },
        { title: "Implementation", desc: "Coordinated execution of all measures" }
      ]
    },
    whyUs: {
      de: [
        "Zertifizierte Energieberater",
        "Langjährige Branchenerfahrung",
        "Neutrale und unabhängige Beratung",
        "Netzwerk an Fachpartnern",
        "Rundum-Service von der Planung bis zur Umsetzung"
      ],
      en: [
        "Certified energy consultants",
        "Many years of industry experience",
        "Neutral and independent consulting",
        "Network of specialist partners",
        "All-round service from planning to implementation"
      ]
    }
  }
};

export default function ServiceDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { language, t } = useLanguage();
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(true);

  const service = slug ? getServiceBySlug(slug) : null;

  useEffect(() => {
    async function loadCities() {
      setLoading(true);
      try {
        const citiesData = await getCities();
        setCities(citiesData);
      } catch (error) {
        console.error('Error loading cities:', error);
      } finally {
        setLoading(false);
      }
    }

    loadCities();
  }, []);

  const scrollToForm = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();

    // GTM Event Tracking for CTA click
    if (typeof window !== 'undefined' && (window as any).dataLayer && service) {
      (window as any).dataLayer.push({
        event: 'cta_click',
        cta_type: 'request_quote',
        service_name: serviceName,
        service_slug: service.slug
      });
    }

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

  if (!service) {
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

  const serviceName = language === 'de' ? service.nameDe : service.nameEn;
  const serviceDescription = language === 'de' ? service.descriptionDe : service.descriptionEn;
  const image = service.imagePath;
  const details = serviceDetailsData[service.slug] || serviceDetailsData.sanitaer;
  const IconComponent = getIconComponent(service.icon);

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
                <IconComponent className="w-16 h-16 md:w-20 md:h-20 text-primary" />
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

            {/* Subcategories Section - NEW */}
            {service.subcategories && service.subcategories.length > 0 && (
              <section className="mb-20">
                <div className="text-center mb-12">
                  <h2 className="text-3xl md:text-4xl font-serif text-foreground mb-4">
                    {t('Unsere Leistungen', 'Our Services')}
                  </h2>
                  <p className="text-muted-foreground text-lg">
                    {t('Spezialisierte Dienstleistungen für Ihre Anforderungen', 'Specialized services for your requirements')}
                  </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {service.subcategories.map((subcategory) => (
                    <div
                      key={subcategory.id}
                      className="bg-card border border-border rounded-xl p-6 hover:border-primary/50 transition-all duration-300"
                    >
                      <div className="flex items-center gap-3">
                        <Check className="w-5 h-5 text-primary flex-shrink-0" />
                        <span className="text-foreground font-medium">
                          {language === 'de' ? subcategory.nameDe : subcategory.nameEn}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

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
                  <ServiceRequestForm
                    service={{
                      id: service.id,
                      name: service.nameDe,
                      name_en: service.nameEn,
                      slug: service.slug,
                      subcategories: service.subcategories
                    } as any}
                    cities={cities}
                  />
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
                      <Users className="w-8 h-8 text-primary mx-auto mb-3" />
                      <div className="text-3xl font-bold text-foreground mb-2">500+</div>
                      <div className="text-sm text-muted-foreground">{t('Fachleute', 'Professionals')}</div>
                    </div>
                    <div className="bg-primary/10 border border-primary/20 rounded-2xl p-6 text-center">
                      <Shield className="w-8 h-8 text-primary mx-auto mb-3" />
                      <div className="text-3xl font-bold text-foreground mb-2">100%</div>
                      <div className="text-sm text-muted-foreground">{t('Geprüft', 'Verified')}</div>
                    </div>
                    <div className="bg-primary/10 border border-primary/20 rounded-2xl p-6 text-center">
                      <Check className="w-8 h-8 text-primary mx-auto mb-3" />
                      <div className="text-3xl font-bold text-foreground mb-2">20</div>
                      <div className="text-sm text-muted-foreground">{t('Städte', 'Cities')}</div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

          </div>
        </div>
      </main>
    </PageLayout>
  );
}
