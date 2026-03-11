/**
 * Landing Page Content - Phase 1 Planning
 *
 * All copy variations for the redesigned landing page
 * Organized by section for easy implementation
 */

// ============================================
// HERO SECTION CONTENT
// ============================================

export const heroContent = {
  // Main Headlines (A/B Test Variations)
  headlines: {
    version1: {
      de: 'Der richtige Handwerker für Ihr Projekt – Geprüft, Lokal, Verfügbar',
      en: 'The Right Contractor for Your Project – Vetted, Local, Available',
    },
    version2: {
      de: 'Finden Sie den perfekten Handwerker in Ihrer Region – In Minuten, nicht Tagen',
      en: 'Find the Perfect Contractor in Your Area – In Minutes, Not Days',
    },
    version3: {
      de: 'Qualifizierte Handwerker aus Ihrer Region – Schnell gefunden, sicher ausgewählt',
      en: 'Qualified Contractors from Your Region – Found Fast, Chosen Safely',
    },
  },

  // Subheadlines
  subheadlines: {
    version1: {
      de: 'Rufen Sie nicht 10 Handwerker an, um zu sehen, wer Zeit hat. Sagen Sie uns Ihr Problem, und wir finden den passenden Experten aus unserem Netzwerk in Minuten.',
      en: "Don't call 10 contractors to see who's available. Tell us your problem, and we'll find the right expert from our network in minutes.",
    },
    version2: {
      de: 'Wir verbinden Sie mit geprüften Fachbetrieben in Hessen, NRW und Rheinland-Pfalz. Schnell, transparent und kostenlos für Sie.',
      en: 'We connect you with vetted professionals in Hesse, NRW, and Rhineland-Palatinate. Fast, transparent, and free for you.',
    },
  },

  // Trust Badges
  trustBadges: {
    lynckTested: {
      de: 'LYNCK-Geprüft: Nur zertifizierte regionale Fachbetriebe',
      en: 'LYNCK-Tested: Only certified regional specialists',
    },
    freeService: {
      de: '100% Kostenlos für Hausbesitzer',
      en: '100% Free for Homeowners',
    },
    fastResponse: {
      de: '⚡ Antwort innerhalb von 30 Minuten',
      en: '⚡ Response within 30 minutes',
    },
  },

  // Live Availability Indicator
  availabilityIndicator: {
    de: 'Verfügbare Fachbetriebe in Ihrer Region',
    en: 'Available professionals in your region',
  },

  // Call-to-Action Buttons
  cta: {
    primary: {
      de: 'Jetzt Handwerker finden',
      en: 'Find Contractor Now',
    },
    secondary: {
      de: 'So funktioniert\'s',
      en: 'How It Works',
    },
  },
};

// ============================================
// 3-STEP MATCHING PROCESS
// ============================================

export const matchingProcessContent = {
  sectionTitle: {
    de: 'So einfach finden Sie den richtigen Handwerker',
    en: 'Finding the Right Contractor Is This Simple',
  },
  sectionSubtitle: {
    de: 'In nur 3 Schritten zum passenden Fachbetrieb',
    en: 'Just 3 steps to the right professional',
  },

  steps: [
    {
      number: 1,
      icon: '📝',
      title: {
        de: 'Anfrage senden',
        en: 'Submit Request',
      },
      description: {
        de: 'Beschreiben Sie Ihr Problem – egal ob Heizungsausfall, undichte Leitung, oder Dachschaden. Je genauer, desto besser.',
        en: 'Describe your problem – whether it\'s a heating failure, leaky pipe, or roof damage. The more specific, the better.',
      },
      details: {
        de: 'Keine Anmeldung erforderlich • Dauert nur 2 Minuten',
        en: 'No registration required • Takes only 2 minutes',
      },
    },
    {
      number: 2,
      icon: '🔍',
      title: {
        de: 'Wir finden den Experten',
        en: 'We Find the Expert',
      },
      description: {
        de: 'Unser System durchsucht das LYNCK-Netzwerk nach dem am besten geeigneten Fachbetrieb für Ihre Region und Ihr spezifisches Anliegen.',
        en: 'Our system searches the LYNCK network for the most suitable professional for your region and specific needs.',
      },
      details: {
        de: 'Nur zertifizierte Partner • Spezialisiert auf Ihr Problem',
        en: 'Only certified partners • Specialized in your problem',
      },
    },
    {
      number: 3,
      icon: '✅',
      title: {
        de: 'Sie erhalten ein Angebot',
        en: 'You Receive a Quote',
      },
      description: {
        de: 'Der passende Fachbetrieb kontaktiert Sie direkt mit einem transparenten Kostenvoranschlag. Keine versteckten Kosten, keine Überraschungen.',
        en: 'The right professional contacts you directly with a transparent quote. No hidden costs, no surprises.',
      },
      details: {
        de: 'Durchschnittlich 30 Min. Reaktionszeit',
        en: 'Average 30 min. response time',
      },
    },
  ],

  guaranteeBadge: {
    de: '⏱️ Durchschnittliche Reaktionszeit: 30 Minuten',
    en: '⏱️ Average Response Time: 30 Minutes',
  },
};

// ============================================
// QUALITY SEAL & VETTING CHECKLIST
// ============================================

export const qualitySealContent = {
  sectionTitle: {
    de: 'LYNCK Qualitäts-Garantie',
    en: 'LYNCK Quality Guarantee',
  },
  sectionSubtitle: {
    de: 'Jeder Partner in unserem Netzwerk wird sorgfältig geprüft',
    en: 'Every partner in our network is carefully vetted',
  },

  vettingCriteria: [
    {
      icon: '✓',
      title: {
        de: 'Geprüfte Gewerbeanmeldung',
        en: 'Verified Business Registration',
      },
      description: {
        de: 'Alle Partner sind offiziell registrierte Gewerbebetriebe mit gültiger Lizenz.',
        en: 'All partners are officially registered businesses with valid licenses.',
      },
    },
    {
      icon: '✓',
      title: {
        de: 'Zertifizierte Meisterbetriebe',
        en: 'Certified Master Craftsmen',
      },
      description: {
        de: 'Meisterbrief oder vergleichbare Qualifikationen werden geprüft und verifiziert.',
        en: 'Master craftsman certificates or comparable qualifications are checked and verified.',
      },
    },
    {
      icon: '✓',
      title: {
        de: 'Versicherungsnachweis',
        en: 'Insurance Verification',
      },
      description: {
        de: 'Haftpflichtversicherung und Betriebshaftpflicht müssen nachgewiesen werden.',
        en: 'Liability insurance and business liability must be proven.',
      },
    },
    {
      icon: '✓',
      title: {
        de: 'Transparente Preisgestaltung',
        en: 'Transparent Pricing',
      },
      description: {
        de: 'Klare Kostenvoranschläge ohne versteckte Gebühren – das verpflichten wir unsere Partner.',
        en: 'Clear cost estimates without hidden fees – we require this from our partners.',
      },
    },
    {
      icon: '✓',
      title: {
        de: 'Kundenbewertungen',
        en: 'Customer Reviews',
      },
      description: {
        de: 'Regelmäßige Überprüfung der Kundenzufriedenheit und Servicequalität.',
        en: 'Regular review of customer satisfaction and service quality.',
      },
    },
  ],

  mediationService: {
    title: {
      de: 'Nicht zufrieden? Wir helfen.',
      en: 'Not satisfied? We help.',
    },
    description: {
      de: 'Bei Problemen vermitteln wir zwischen Ihnen und dem Dienstleister. Ihre Zufriedenheit ist unsere Priorität.',
      en: 'In case of problems, we mediate between you and the service provider. Your satisfaction is our priority.',
    },
  },
};

// ============================================
// SERVICE-SPECIFIC PRE-QUALIFICATION
// ============================================

export const servicePreQualificationContent = {
  sectionTitle: {
    de: 'Was benötigen Sie?',
    en: 'What Do You Need?',
  },
  sectionSubtitle: {
    de: 'Wählen Sie die passende Kategorie für schnellere Vermittlung',
    en: 'Choose the right category for faster matching',
  },

  categories: [
    {
      id: 'emergency',
      icon: '🚨',
      label: {
        de: 'Notfall / Rohrbruch',
        en: 'Emergency / Burst Pipe',
      },
      urgency: 'high',
      serviceTypes: ['klempner', 'heizung'],
    },
    {
      id: 'installation',
      icon: '🔧',
      label: {
        de: 'Installation / Sanierung',
        en: 'Installation / Renovation',
      },
      urgency: 'medium',
      serviceTypes: ['klempner', 'elektriker', 'heizung'],
    },
    {
      id: 'cleaning',
      icon: '🧹',
      label: {
        de: 'Reinigung / Wartung',
        en: 'Cleaning / Maintenance',
      },
      urgency: 'low',
      serviceTypes: ['klempner', 'heizung', 'klimatechnik'],
    },
    {
      id: 'solar',
      icon: '☀️',
      label: {
        de: 'Solar / Photovoltaik',
        en: 'Solar / Photovoltaic',
      },
      urgency: 'low',
      serviceTypes: ['solar'],
    },
    {
      id: 'heating',
      icon: '🔥',
      label: {
        de: 'Heizung / Wärmepumpe',
        en: 'Heating / Heat Pump',
      },
      urgency: 'medium',
      serviceTypes: ['heizung', 'waermepumpe'],
    },
    {
      id: 'roof',
      icon: '🏠',
      label: {
        de: 'Dach / Abdichtung',
        en: 'Roof / Waterproofing',
      },
      urgency: 'medium',
      serviceTypes: ['dachdecker'],
    },
  ],

  urgencyLevels: {
    emergency: {
      de: 'Notfall (innerhalb 2 Stunden)',
      en: 'Emergency (within 2 hours)',
    },
    today: {
      de: 'Heute',
      en: 'Today',
    },
    thisWeek: {
      de: 'Diese Woche',
      en: 'This Week',
    },
    flexible: {
      de: 'Flexibel',
      en: 'Flexible',
    },
  },
};

// ============================================
// NETWORK STATISTICS DISPLAY
// ============================================

export const networkStatsContent = {
  sectionTitle: {
    de: 'Vertrauen durch Transparenz',
    en: 'Trust Through Transparency',
  },

  stats: [
    {
      id: 'leads-matched',
      icon: '🤝',
      label: {
        de: 'Vermittelte Projekte 2024',
        en: 'Projects Matched 2024',
      },
      sublabel: {
        de: 'Zufriedene Kunden in 3 Bundesländern',
        en: 'Satisfied customers in 3 states',
      },
    },
    {
      id: 'active-partners',
      icon: '🏢',
      label: {
        de: 'Geprüfte Partner-Betriebe',
        en: 'Vetted Partner Companies',
      },
      sublabel: {
        de: 'In 35 Städten verfügbar',
        en: 'Available in 35 cities',
      },
    },
    {
      id: 'average-rating',
      icon: '⭐',
      label: {
        de: 'Durchschnittliche Bewertung',
        en: 'Average Rating',
      },
      sublabel: {
        de: 'Basierend auf echten Kundenbewertungen',
        en: 'Based on real customer reviews',
      },
    },
    {
      id: 'response-time',
      icon: '⏱️',
      label: {
        de: 'Durchschnittliche Reaktionszeit',
        en: 'Average Response Time',
      },
      sublabel: {
        de: 'Schneller Service, wenn Sie ihn brauchen',
        en: 'Fast service when you need it',
      },
    },
  ],
};

// ============================================
// LIVE ACTIVITY FEED
// ============================================

export const activityFeedContent = {
  sectionTitle: {
    de: 'Live: Aktuelle Vermittlungen',
    en: 'Live: Recent Matches',
  },
  emptyState: {
    de: 'Lädt aktuelle Aktivitäten...',
    en: 'Loading recent activity...',
  },
  template: {
    de: 'Vor {timeAgo}: {service} in {city} vermittelt',
    en: '{timeAgo} ago: Matched {service} in {city}',
  },
};

// ============================================
// GEO-PERSONALIZATION
// ============================================

export const geoPersonalizationContent = {
  fallbackCity: {
    de: 'Ihrer Region',
    en: 'Your Area',
  },
  headlines: {
    withCity: {
      de: 'Top-bewertete Handwerker in {city}',
      en: 'Top-Rated Contractors in {city}',
    },
    withoutCity: {
      de: 'Top-bewertete Handwerker in Ihrer Region',
      en: 'Top-Rated Contractors in Your Area',
    },
  },
  availability: {
    withCity: {
      de: '{count} Fachbetriebe verfügbar in {city}',
      en: '{count} professionals available in {city}',
    },
    withoutCity: {
      de: 'Fachbetriebe in Ihrer Nähe verfügbar',
      en: 'Professionals available near you',
    },
  },
};

// ============================================
// SOCIAL PROOF / TESTIMONIALS (Network-Level)
// ============================================

export const socialProofContent = {
  sectionTitle: {
    de: 'Was unsere Nutzer sagen',
    en: 'What Our Users Say',
  },

  // Network-level testimonials (about the platform, not individual contractors)
  testimonials: [
    {
      id: '1',
      quote: {
        de: 'Innerhalb von 20 Minuten hatte ich drei Angebote für meine Heizungsreparatur. Schneller und unkomplizierter geht es nicht!',
        en: 'Within 20 minutes I had three quotes for my heating repair. It doesn\'t get faster or easier!',
      },
      author: 'Michael S.',
      location: 'Frankfurt am Main',
      project: 'Heizungsreparatur',
      rating: 5,
    },
    {
      id: '2',
      quote: {
        de: 'Ich war skeptisch gegenüber Vermittlungsplattformen, aber LYNCK hat mich überzeugt. Seriöse Partner, faire Preise, schnelle Reaktion.',
        en: 'I was skeptical about referral platforms, but LYNCK convinced me. Serious partners, fair prices, fast response.',
      },
      author: 'Sandra M.',
      location: 'Köln',
      project: 'Badsanierung',
      rating: 5,
    },
    {
      id: '3',
      quote: {
        de: 'Die Solar-Installation hat dank LYNCK perfekt geklappt. Der vermittelte Betrieb war kompetent und zuverlässig.',
        en: 'The solar installation went perfectly thanks to LYNCK. The referred company was competent and reliable.',
      },
      author: 'Thomas K.',
      location: 'Mainz',
      project: 'Photovoltaik-Anlage',
      rating: 5,
    },
  ],

  // Counter-based social proof
  counterProof: {
    de: 'Über {count} Hausbesitzer haben bereits ihren Handwerker über LYNCK gefunden',
    en: 'Over {count} homeowners have already found their contractor through LYNCK',
  },
};
