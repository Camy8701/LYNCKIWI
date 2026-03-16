import PageLayout from "@/components/PageLayout";
import { SEO } from "@/lib/seo";

const Cookies = () => {

  return (
    <>
      <SEO
        title={"Cookie Policy - KYSS Vision"}
        description={"Learn how KYSS Vision uses cookies"}
        canonicalUrl="/cookies"
      />
      <PageLayout>
        <div className="max-w-4xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-serif font-normal text-foreground mb-8">
            {"Cookie Policy"}
          </h1>

          <div className="space-y-8 text-muted-foreground">
            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                {"What are Cookies?"}
              </h2>
              <p className="mb-4">
                {"Cookies are small text files that are stored on your device when you visit our website. They allow us to save your preferences and analyze the use of our website."}
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                {"What Cookies Do We Use?"}
              </h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    {"Necessary Cookies"}
                  </h3>
                  <p>
                    {"These cookies are essential for the operation of the website. They include, for example, cookies that allow you to log into secure areas of our website or save your cookie settings."}
                  </p>
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>{"Language settings"}</li>
                    <li>{"Theme preferences (Light/Dark)"}</li>
                    <li>{"Cookie consent"}</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    {"Analytics Cookies"}
                  </h3>
                  <p>
                    {"These cookies allow us to count the number of visitors and understand how visitors use our website. This helps us improve how our website works."}
                  </p>
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>
                      <strong>Google Analytics:</strong>{" "}
                      {"We use Google Analytics to collect anonymized statistics about the use of our website."}
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                {"Manage Your Cookie Settings"}
              </h2>
              <p className="mb-4">
                {"You can change your cookie settings at any time by adjusting the settings in your browser. Please note that blocking certain cookies may affect the functionality of our website."}
              </p>
              <p>
                {"To change your cookie settings on this website, you can also access the cookie settings via the banner at the bottom of the screen."}
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                {"More Information"}
              </h2>
              <p>
                {"For more information about our use of cookies and your privacy, please read our"}{" "}
                <a href="/datenschutz" className="text-primary hover:underline">
                  {"Privacy Policy"}
                </a>
                .
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                {"Contact"}
              </h2>
              <p>
                {"If you have any questions about our Cookie Policy, please contact us at:"}
              </p>
              <p className="mt-2">
                <a href="mailto:info@kyssvision.de" className="text-primary hover:underline">
                  info@kyssvision.de
                </a>
              </p>
            </section>

            <p className="text-sm mt-8">
              {"Last updated:"} {new Date().toLocaleDateString('de-DE')}
            </p>
          </div>
        </div>
      </PageLayout>
    </>
  );
};

export default Cookies;
