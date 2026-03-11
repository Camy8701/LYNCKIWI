import { Moon, Sun, ChevronDown, Menu } from "lucide-react";
import { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { SearchBar } from "./SearchBar";
import { servicesData } from "@/data/servicesData";
import { getIconComponent } from "@/lib/serviceIcons";

const Navigation = () => {
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [servicesOpen, setServicesOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { language, setLanguage, t } = useLanguage();

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as "dark" | "light" || "dark";
    setTheme(savedTheme);
    document.documentElement.classList.toggle("dark", savedTheme === "dark");
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
  };

  return (
    <nav className="flex items-center justify-between px-6 md:px-12 lg:px-16 py-4 mt-8 mb-4 mx-4 md:mx-6 lg:mx-8 glass-card rounded-2xl relative z-50">
      <div className="flex items-center gap-12">
        <a href="/" className="flex items-center">
          <img src="/logo.png" alt="Lynck Services" className="w-12 h-12 rounded-full object-cover hover:scale-110 transition-transform duration-300" />
        </a>

        <div className="hidden md:flex items-center gap-8">
          <div
            className="relative"
            onMouseEnter={() => setServicesOpen(true)}
            onMouseLeave={() => setServicesOpen(false)}
          >
            <button
              className="text-sm text-foreground font-medium hover:text-primary transition-colors duration-300 flex items-center gap-1 py-2"
            >
              {t("Dienstleistungen", "Services")}
              <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${servicesOpen ? 'rotate-180' : ''}`} />
            </button>
            {servicesOpen && (
              <div className="absolute top-full left-0 pt-1 w-64 z-[100]">
                <div className="bg-background border border-border rounded-xl shadow-xl py-2">
                  {servicesData.map((service) => {
                    const IconComponent = getIconComponent(service.icon);
                    return (
                      <a
                        key={service.slug}
                        href={`/services/${service.slug}`}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-primary/10 hover:text-foreground transition-colors duration-200"
                      >
                        <IconComponent className="w-5 h-5" />
                        <span>{language === 'de' ? service.nameDe : service.nameEn}</span>
                      </a>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
          <a href="/#how-it-works" className="text-sm text-muted-foreground font-medium hover:text-foreground transition-colors duration-300">
            {t("So funktioniert's", "How It Works")}
          </a>
          <a href="/blog" className="text-sm text-muted-foreground font-medium hover:text-foreground transition-colors duration-300">
            Blog
          </a>
          <a href="/for-businesses" className="text-sm text-muted-foreground font-medium hover:text-foreground transition-colors duration-300">
            {t("Für Unternehmen", "For Businesses")}
          </a>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden xl:block w-96">
          <SearchBar />
        </div>

        {/* Contact Us Button - Desktop */}
        <a
          href="/contact"
          className="hidden md:flex items-center gap-2 px-4 py-2 text-sm font-medium text-primary-foreground bg-primary hover:bg-primary/90 rounded-lg transition-colors duration-300"
        >
          {t("Kontakt", "Contact Us")}
        </a>

        {/* Desktop Language & Theme */}
        <button
          onClick={() => setLanguage(language === 'de' ? 'en' : 'de')}
          className="hidden lg:flex px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground bg-white/[0.03] border border-white/[0.06] rounded-lg transition-colors duration-300"
        >
          {language === 'de' ? 'EN' : 'DE'}
        </button>

        <button
          onClick={toggleTheme}
          className="hidden lg:flex p-2 hover:bg-white/10 rounded-lg transition-colors duration-300 group"
        >
          {theme === "dark" ? (
            <Moon className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors duration-300" />
          ) : (
            <Sun className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors duration-300" />
          )}
        </button>

        {/* Mobile Language & Theme & Menu */}
        <div className="flex lg:hidden items-center gap-2">
          <button
            onClick={() => setLanguage(language === 'de' ? 'en' : 'de')}
            className="px-2.5 py-1.5 text-xs font-medium text-foreground hover:text-primary bg-white/[0.03] border border-white/[0.06] rounded-lg transition-colors duration-300"
          >
            {language === 'de' ? 'EN' : 'DE'}
          </button>

          <button
            onClick={toggleTheme}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors duration-300"
          >
            {theme === "dark" ? (
              <Moon className="w-5 h-5 text-foreground" />
            ) : (
              <Sun className="w-5 h-5 text-foreground" />
            )}
          </button>

          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <button className="p-2 hover:bg-white/10 rounded-lg transition-colors duration-300">
                <Menu className="w-6 h-6 text-foreground" />
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px] bg-background/95 backdrop-blur-md border-border overflow-y-auto">
            <div className="flex flex-col gap-6 mt-8 pb-8">
              {/* Mobile Search */}
              <div className="px-2">
                <SearchBar />
              </div>

              {/* Services Section */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-foreground px-2">
                  {t("Dienstleistungen", "Services")}
                </h3>
                <div className="space-y-1">
                  {servicesData.map((service) => {
                    const IconComponent = getIconComponent(service.icon);
                    return (
                      <a
                        key={service.slug}
                        href={`/services/${service.slug}`}
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center gap-3 px-2 py-2.5 text-sm text-foreground hover:bg-accent hover:text-primary rounded-lg transition-colors duration-300"
                      >
                        <IconComponent className="w-5 h-5" />
                        <span>{language === 'de' ? service.nameDe : service.nameEn}</span>
                      </a>
                    );
                  })}
                </div>
              </div>

              {/* Other Navigation Items */}
              <div className="space-y-1 border-t border-border pt-4">
                <a
                  href="/#how-it-works"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-2 py-2.5 text-sm text-foreground hover:bg-accent hover:text-primary rounded-lg transition-colors duration-300"
                >
                  {t("So funktioniert's", "How It Works")}
                </a>
                <a
                  href="/blog"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-2 py-2.5 text-sm text-foreground hover:bg-accent hover:text-primary rounded-lg transition-colors duration-300"
                >
                  Blog
                </a>
                <a
                  href="/for-businesses"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-2 py-2.5 text-sm text-foreground hover:bg-accent hover:text-primary rounded-lg transition-colors duration-300"
                >
                  {t("Für Unternehmen", "For Businesses")}
                </a>
                <a
                  href="/contact"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-2 py-2.5 text-sm text-primary-foreground bg-primary hover:bg-primary/90 rounded-lg transition-colors duration-300 font-medium mt-4"
                >
                  {t("Kontakt", "Contact Us")}
                </a>
              </div>

            </div>
          </SheetContent>
        </Sheet>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
