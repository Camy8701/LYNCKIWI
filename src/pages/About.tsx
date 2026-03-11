import PageLayout from "@/components/PageLayout";
import { useLanguage } from "@/contexts/LanguageContext";

const About = () => {
  const { t, language } = useLanguage();

  const values = [
    { de: "Transparenz", en: "Transparency" },
    { de: "Qualität", en: "Quality" },
    { de: "Kundenzufriedenheit", en: "Customer Satisfaction" }
  ];

  return (
    <PageLayout>
      <div className="px-4 sm:px-6 lg:px-12 py-12">
        <div className="glass-card rounded-3xl p-8 lg:p-12 max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl lg:text-6xl tracking-tight text-foreground font-serif font-normal mb-6">
            {t("Über uns", "About Us")}
          </h1>
          
          <div className="prose prose-invert max-w-none">
            <h2 className="text-3xl text-foreground font-serif font-normal mt-8 mb-4">
              {t("Über Lynck Services", "About Lynck Services")}
            </h2>
            
            <p className="text-lg text-muted-foreground leading-relaxed mb-6">
              {t(
                "Wir sind Ihre digitale Brücke zwischen Hausbesitzern und qualifizierten Handwerkern in Hessen, Nordrhein-Westfalen und Rheinland-Pfalz. Lynck Services wurde gegründet, um die Suche nach zuverlässigen Fachleuten zu vereinfachen und transparenter zu machen.",
                "We are your digital bridge between homeowners and qualified contractors in Hesse, North Rhine-Westphalia and Rhineland-Palatinate. Lynck Services was founded to simplify the search for reliable professionals and make it more transparent."
              )}
            </p>

            <p className="text-lg text-muted-foreground leading-relaxed mb-8">
              {t(
                "Unser kostenloser Service verbindet Sie mit handverlesenen Fachleuten unter den Besten in Ihrer Region. Von Heizung und Solar bis zu Dachdecker und Elektriker - wir helfen Ihnen, den richtigen Partner für Ihr Projekt zu finden.",
                "Our free service connects you with hand-picked professionals among the best in your region. From heating and solar to roofing and electricians - we help you find the right partner for your project."
              )}
            </p>

            <h3 className="text-2xl text-foreground font-serif font-normal mt-8 mb-6">
              {t("Unsere Dienstleistungen", "Our Services")}
            </h3>

            <p className="text-muted-foreground leading-relaxed mb-6">
              {t(
                "Wir vermitteln qualifizierte Fachleute für eine Vielzahl von Dienstleistungen:",
                "We connect you with qualified professionals for a variety of services:"
              )}
            </p>

            <ul className="space-y-2 mb-8 list-disc list-inside text-muted-foreground">
              <li>{t("Heizung & HVAC", "Heating & HVAC")}</li>
              <li>{t("Solar & Photovoltaik", "Solar & Photovoltaic")}</li>
              <li>{t("Dachdecker", "Roofing")}</li>
              <li>{t("Klempner & Sanitär", "Plumbing & Sanitary")}</li>
              <li>{t("Elektriker", "Electrician")}</li>
              <li>{t("Wärmepumpe", "Heat Pump Systems")}</li>
              <li>{t("Klimatechnik", "Air Conditioning")}</li>
              <li>{t("Service & Beratung", "Service & Consultation")}</li>
              <li>{t("Allgemeine Renovierung", "General Renovation")}</li>
            </ul>

            <h3 className="text-2xl text-foreground font-serif font-normal mt-8 mb-6">
              {t("Unsere Abdeckung", "Our Coverage")}
            </h3>

            <p className="text-muted-foreground leading-relaxed mb-6">
              {t(
                "Wir sind stolz darauf, Hausbesitzer in drei der größten Bundesländer Deutschlands zu bedienen:",
                "We are proud to serve homeowners in three of Germany's largest states:"
              )}
            </p>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              <div className="p-6 bg-white/[0.03] backdrop-blur-sm border border-white/[0.06] rounded-xl">
                <h4 className="text-lg font-semibold text-foreground mb-3">
                  {t("Hessen", "Hesse")}
                </h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {t(
                    "Frankfurt am Main, Wiesbaden, Kassel, Darmstadt, Offenbach am Main, Hanau, Gießen, Marburg, Fulda, Rüsselsheim am Main",
                    "Frankfurt am Main, Wiesbaden, Kassel, Darmstadt, Offenbach am Main, Hanau, Gießen, Marburg, Fulda, Rüsselsheim am Main"
                  )}
                </p>
              </div>

              <div className="p-6 bg-white/[0.03] backdrop-blur-sm border border-white/[0.06] rounded-xl">
                <h4 className="text-lg font-semibold text-foreground mb-3">
                  {t("Nordrhein-Westfalen (NRW)", "North Rhine-Westphalia (NRW)")}
                </h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {t(
                    "Köln, Düsseldorf, Dortmund, Essen, Duisburg, Bochum, Wuppertal, Bonn, Münster, Aachen",
                    "Cologne, Düsseldorf, Dortmund, Essen, Duisburg, Bochum, Wuppertal, Bonn, Münster, Aachen"
                  )}
                </p>
              </div>

              <div className="p-6 bg-white/[0.03] backdrop-blur-sm border border-white/[0.06] rounded-xl">
                <h4 className="text-lg font-semibold text-foreground mb-3">
                  {t("Rheinland-Pfalz", "Rhineland-Palatinate")}
                </h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {t(
                    "Mainz, Ludwigshafen am Rhein, Koblenz, Trier, Kaiserslautern, Worms, Neuwied, Neustadt an der Weinstraße, Speyer, Frankenthal, Landau, Pirmasens, Bad Kreuznach, Idar-Oberstein, Zweibrücken",
                    "Mainz, Ludwigshafen am Rhein, Koblenz, Trier, Kaiserslautern, Worms, Neuwied, Neustadt an der Weinstraße, Speyer, Frankenthal, Landau, Pirmasens, Bad Kreuznach, Idar-Oberstein, Zweibrücken"
                  )}
                </p>
              </div>
            </div>

            <h3 className="text-2xl text-foreground font-serif font-normal mt-8 mb-6">
              {t("Warum Lynck Services?", "Why Lynck Services?")}
            </h3>

            <ul className="space-y-4 mb-8">
              {[
                {
                  de: "100% Kostenlos - Keine versteckten Kosten oder Verpflichtungen",
                  en: "100% Free - No hidden costs or obligations"
                },
                {
                  de: "Handverlesene Fachleute - Alle Handwerker werden von uns geprüft",
                  en: "Hand-picked professionals - All contractors are verified by us"
                },
                {
                  de: "Schnelle Antworten - Erhalten Sie Angebote innerhalb weniger Stunden",
                  en: "Fast responses - Receive quotes within hours"
                },
                {
                  de: "Transparenter Prozess - Vergleichen Sie Angebote und wählen Sie den besten aus",
                  en: "Transparent process - Compare quotes and choose the best one"
                }
              ].map((item, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="text-primary mt-1">✓</span>
                  <span className="text-foreground/90 text-lg">
                    {language === 'de' ? item.de : item.en}
                  </span>
                </li>
              ))}
            </ul>

            <h3 className="text-2xl text-foreground font-serif font-normal mt-8 mb-6">
              {t("Unsere Werte", "Our Values")}
            </h3>

            <div className="grid md:grid-cols-3 gap-6 mb-8">
              {values.map((value, index) => (
                <div key={index} className="p-6 bg-white/[0.03] backdrop-blur-sm border border-white/[0.06] rounded-xl text-center">
                  <h4 className="text-foreground font-semibold text-lg">
                    {language === 'de' ? value.de : value.en}
                  </h4>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default About;
