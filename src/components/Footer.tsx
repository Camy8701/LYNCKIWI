
const Footer = () => {

  const serviceLinks = [
    { nameDe: "Heizung & HVAC", nameEn: "Heating & HVAC", slug: "/services/heizung" },
    { nameDe: "Solar & Photovoltaik", nameEn: "Solar & Photovoltaic", slug: "/services/solar" },
    { nameDe: "Dachdecker", nameEn: "Roofing", slug: "/services/dachdecker" },
    { nameDe: "Klempner", nameEn: "Plumbing", slug: "/services/klempner" },
    { nameDe: "Elektriker", nameEn: "Electrician", slug: "/services/elektriker" },
    { nameDe: "Wärmepumpe", nameEn: "Heat Pump Systems", slug: "/services/waermepumpe" },
    { nameDe: "Klimatechnik & Lüftung", nameEn: "Air Conditioning & Ventilation", slug: "/services/klimatechnik" },
    { nameDe: "Service & Beratung", nameEn: "Service & Consultation", slug: "/services/service-beratung" },
    { nameDe: "Sanitär", nameEn: "Sanitary", slug: "/services/sanitaer" }
  ];

  const companyLinks = [
    { nameDe: "Über uns", nameEn: "About Us", slug: "/about" },
    { nameDe: "Blog", nameEn: "Blog", slug: "/blog" },
    { nameDe: "Für Unternehmen", nameEn: "For Businesses", slug: "/for-businesses" },
    { nameDe: "Werbung", nameEn: "Advertise", slug: "/advertise" },
    { nameDe: "Kontakt", nameEn: "Contact", slug: "/contact" }
  ];

  const legalLinks = [
    { nameDe: "Datenschutz", nameEn: "Privacy Policy", slug: "/privacy" },
    { nameDe: "AGB", nameEn: "Terms & Conditions", slug: "/terms" },
    { nameDe: "Impressum", nameEn: "Legal Notice", slug: "/impressum" },
    { nameDe: "Cookie-Richtlinie", nameEn: "Cookie Policy", slug: "/cookies" }
  ];

  return (
    <footer className="mt-24 px-4 sm:px-6 lg:px-12 mb-8">
      <div className="glass-card rounded-3xl px-6 md:px-12 lg:px-16 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Column 1: About */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-lg"></div>
              <span className="text-lg font-semibold text-foreground tracking-tight">KYSS Vision</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {"We connect homeowners with verified contractors across Germany. Free, fast and uncomplicated."}
            </p>
          </div>

          {/* Column 2: Services */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-4">
              {"Services"}
            </h3>
            <ul className="space-y-2">
              {serviceLinks.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.slug}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors duration-300"
                  >
                    {link.nameEn}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Company */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-4">
              {"Company"}
            </h3>
            <ul className="space-y-2">
              {companyLinks.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.slug}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors duration-300"
                  >
                    {link.nameEn}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Legal */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-4">
              {"Legal"}
            </h3>
            <ul className="space-y-2">
              {legalLinks.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.slug}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors duration-300"
                  >
                    {link.nameEn}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="border-t border-white/[0.06] pt-8 text-center">
          <p className="text-sm text-muted-foreground">
            {"© 2025 KYSS Vision. All rights reserved."}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
