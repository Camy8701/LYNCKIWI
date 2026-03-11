import PageLayout from "@/components/PageLayout";
import { useLanguage } from "@/contexts/LanguageContext";
import { SEO } from "@/lib/seo";

const Cookies = () => {
  const { t } = useLanguage();

  return (
    <>
      <SEO
        title={t("Cookie-Richtlinie - Lynck Services", "Cookie Policy - Lynck Services")}
        description={t(
          "Erfahren Sie, wie Lynck Services Cookies verwendet",
          "Learn how Lynck Services uses cookies"
        )}
        canonicalUrl="/cookies"
      />
      <PageLayout>
        <div className="max-w-4xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-serif font-normal text-foreground mb-8">
            {t("Cookie-Richtlinie", "Cookie Policy")}
          </h1>

          <div className="space-y-8 text-muted-foreground">
            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                {t("Was sind Cookies?", "What are Cookies?")}
              </h2>
              <p className="mb-4">
                {t(
                  "Cookies sind kleine Textdateien, die auf Ihrem Gerät gespeichert werden, wenn Sie unsere Website besuchen. Sie ermöglichen es uns, Ihre Präferenzen zu speichern und die Nutzung unserer Website zu analysieren.",
                  "Cookies are small text files that are stored on your device when you visit our website. They allow us to save your preferences and analyze the use of our website."
                )}
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                {t("Welche Cookies verwenden wir?", "What Cookies Do We Use?")}
              </h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    {t("Notwendige Cookies", "Necessary Cookies")}
                  </h3>
                  <p>
                    {t(
                      "Diese Cookies sind für den Betrieb der Website unbedingt erforderlich. Sie umfassen zum Beispiel Cookies, die es Ihnen ermöglichen, sich in sichere Bereiche unserer Website einzuloggen oder Ihre Cookie-Einstellungen zu speichern.",
                      "These cookies are essential for the operation of the website. They include, for example, cookies that allow you to log into secure areas of our website or save your cookie settings."
                    )}
                  </p>
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>{t("Sprach-Einstellungen", "Language settings")}</li>
                    <li>{t("Theme-Präferenzen (Hell/Dunkel)", "Theme preferences (Light/Dark)")}</li>
                    <li>{t("Cookie-Zustimmung", "Cookie consent")}</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    {t("Analyse-Cookies", "Analytics Cookies")}
                  </h3>
                  <p>
                    {t(
                      "Diese Cookies ermöglichen es uns, die Anzahl der Besucher zu zählen und zu verstehen, wie Besucher unsere Website nutzen. Dies hilft uns, die Funktionsweise unserer Website zu verbessern.",
                      "These cookies allow us to count the number of visitors and understand how visitors use our website. This helps us improve how our website works."
                    )}
                  </p>
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>
                      <strong>Google Analytics:</strong>{" "}
                      {t(
                        "Wir verwenden Google Analytics, um anonymisierte Statistiken über die Nutzung unserer Website zu sammeln.",
                        "We use Google Analytics to collect anonymized statistics about the use of our website."
                      )}
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                {t("Ihre Cookie-Einstellungen verwalten", "Manage Your Cookie Settings")}
              </h2>
              <p className="mb-4">
                {t(
                  "Sie können Ihre Cookie-Einstellungen jederzeit ändern, indem Sie die Einstellungen in Ihrem Browser anpassen. Bitte beachten Sie, dass das Blockieren bestimmter Cookies die Funktionalität unserer Website beeinträchtigen kann.",
                  "You can change your cookie settings at any time by adjusting the settings in your browser. Please note that blocking certain cookies may affect the functionality of our website."
                )}
              </p>
              <p>
                {t(
                  "Um Ihre Cookie-Einstellungen auf dieser Website zu ändern, können Sie auch die Cookie-Einstellungen über das Banner am unteren Bildschirmrand aufrufen.",
                  "To change your cookie settings on this website, you can also access the cookie settings via the banner at the bottom of the screen."
                )}
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                {t("Weitere Informationen", "More Information")}
              </h2>
              <p>
                {t(
                  "Für weitere Informationen über unsere Verwendung von Cookies und Ihren Datenschutz, lesen Sie bitte unsere",
                  "For more information about our use of cookies and your privacy, please read our"
                )}{" "}
                <a href="/datenschutz" className="text-primary hover:underline">
                  {t("Datenschutzerklärung", "Privacy Policy")}
                </a>
                .
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                {t("Kontakt", "Contact")}
              </h2>
              <p>
                {t(
                  "Bei Fragen zu unserer Cookie-Richtlinie kontaktieren Sie uns bitte unter:",
                  "If you have any questions about our Cookie Policy, please contact us at:"
                )}
              </p>
              <p className="mt-2">
                <a href="mailto:info@lynckservices.de" className="text-primary hover:underline">
                  info@lynckservices.de
                </a>
              </p>
            </section>

            <p className="text-sm mt-8">
              {t("Letzte Aktualisierung:", "Last updated:")} {new Date().toLocaleDateString('de-DE')}
            </p>
          </div>
        </div>
      </PageLayout>
    </>
  );
};

export default Cookies;
