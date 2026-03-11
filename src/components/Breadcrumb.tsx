import { ChevronRight, Home } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";

interface BreadcrumbItem {
  label: string;
  href: string;
}

interface BreadcrumbProps {
  customItems?: BreadcrumbItem[];
}

const Breadcrumb = ({ customItems }: BreadcrumbProps) => {
  const location = useLocation();
  const { t } = useLanguage();

  // If custom items are provided, use them
  if (customItems) {
    return (
      <nav aria-label="Breadcrumb" className="px-4 sm:px-6 lg:px-12 py-4">
        <ol className="flex items-center gap-2 text-sm">
          <li>
            <Link
              to="/"
              className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
            >
              <Home className="w-4 h-4" />
              <span>{t("Startseite", "Home")}</span>
            </Link>
          </li>
          {customItems.map((item, index) => (
            <li key={index} className="flex items-center gap-2">
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
              {index === customItems.length - 1 ? (
                <span className="text-foreground font-medium">{item.label}</span>
              ) : (
                <Link
                  to={item.href}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  {item.label}
                </Link>
              )}
            </li>
          ))}
        </ol>
      </nav>
    );
  }

  // Auto-generate breadcrumbs from the current path
  const pathnames = location.pathname.split("/").filter((x) => x);

  // Don't show breadcrumb on homepage or admin pages
  if (pathnames.length === 0 || pathnames[0] === "admin") {
    return null;
  }

  const breadcrumbMap: Record<string, { de: string; en: string }> = {
    about: { de: "Über uns", en: "About Us" },
    contact: { de: "Kontakt", en: "Contact" },
    blog: { de: "Blog", en: "Blog" },
    "for-businesses": { de: "Für Unternehmen", en: "For Businesses" },
    privacy: { de: "Datenschutz", en: "Privacy Policy" },
    terms: { de: "AGB", en: "Terms & Conditions" },
    impressum: { de: "Impressum", en: "Legal Notice" },
    service: { de: "Dienstleistungen", en: "Services" },
    services: { de: "Dienstleistungen", en: "Services" },
    danke: { de: "Danke", en: "Thank You" },
  };

  return (
    <nav aria-label="Breadcrumb" className="px-4 sm:px-6 lg:px-12 py-4">
      <ol className="flex items-center gap-2 text-sm">
        <li>
          <Link
            to="/"
            className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
          >
            <Home className="w-4 h-4" />
            <span>{t("Startseite", "Home")}</span>
          </Link>
        </li>
        {pathnames.map((name, index) => {
          const routeTo = `/${pathnames.slice(0, index + 1).join("/")}`;
          const isLast = index === pathnames.length - 1;

          // Get translated label
          const translationKey = breadcrumbMap[name];
          const label = translationKey
            ? t(translationKey.de, translationKey.en)
            : name.charAt(0).toUpperCase() + name.slice(1);

          // Special case: "services" should link to homepage services section
          const linkTo = name === "services" ? "/#services" : routeTo;

          return (
            <li key={name} className="flex items-center gap-2">
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
              {isLast ? (
                <span className="text-foreground font-medium">{label}</span>
              ) : (
                <Link
                  to={linkTo}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  {label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumb;
