import { useState, useEffect, useRef } from "react";
import { Search, Flame, MapPin } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { getIconComponent } from "@/lib/serviceIcons";

interface Service {
  id: string;
  name: string;
  name_en: string;
  slug: string;
  icon: string;
}

interface City {
  id: string;
  name: string;
}

export const SearchBar = () => {
  const { language, t } = useLanguage();
  const [query, setQuery] = useState("");
  const [services, setServices] = useState<Service[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [filteredServices, setFilteredServices] = useState<Service[]>([]);
  const [filteredCities, setFilteredCities] = useState<City[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Fetch services and cities on mount
  useEffect(() => {
    const fetchData = async () => {
      const [servicesRes, citiesRes] = await Promise.all([
        supabase.from("services").select("id, name, name_en, slug, icon").eq("is_active", true),
        supabase.from("cities").select("id, name").eq("is_active", true),
      ]);

      if (servicesRes.data) setServices(servicesRes.data);
      if (citiesRes.data) setCities(citiesRes.data);
    };

    fetchData();
  }, []);

  // Filter results based on query
  useEffect(() => {
    if (query.trim().length < 2) {
      setFilteredServices([]);
      setFilteredCities([]);
      setIsOpen(false);
      return;
    }

    const searchTerm = query.toLowerCase();

    const matchedServices = services.filter((service) => {
      const name = language === "de" ? service.name : service.name_en;
      return name.toLowerCase().includes(searchTerm);
    });

    const matchedCities = cities.filter((city) =>
      city.name.toLowerCase().includes(searchTerm)
    );

    setFilteredServices(matchedServices.slice(0, 5));
    setFilteredCities(matchedCities.slice(0, 5));
    setIsOpen(matchedServices.length > 0 || matchedCities.length > 0);
  }, [query, services, cities, language]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleServiceClick = (slug: string) => {
    window.location.href = `/services/${slug}`;
    setQuery("");
    setIsOpen(false);
  };

  const handleCityClick = (cityName: string) => {
    // For now, just navigate to home with city in URL
    // You can implement city-based filtering later
    window.location.href = `/?city=${encodeURIComponent(cityName)}`;
    setQuery("");
    setIsOpen(false);
  };

  return (
    <div ref={searchRef} className="relative w-full">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => {
          if (filteredServices.length > 0 || filteredCities.length > 0) {
            setIsOpen(true);
          }
        }}
        placeholder={t("Service oder Stadt suchen...", "Search service or city...")}
        className="bg-white/[0.03] border border-white/[0.06] rounded-lg px-4 py-2 pl-10 text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 w-full transition-all duration-300"
      />
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4 pointer-events-none" />

      {/* Results Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-background/95 backdrop-blur-md border border-border rounded-xl shadow-lg z-[100] max-h-96 overflow-y-auto">
          {/* Services Section */}
          {filteredServices.length > 0 && (
            <div className="p-2">
              <div className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                {t("Dienstleistungen", "Services")}
              </div>
              {filteredServices.map((service) => {
                const IconComponent = getIconComponent(service.icon);
                const serviceName = language === "de" ? service.name : service.name_en;
                
                return (
                  <button
                    key={service.id}
                    onClick={() => handleServiceClick(service.slug)}
                    className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-foreground hover:bg-accent hover:text-primary rounded-lg transition-colors duration-200"
                  >
                    <IconComponent className="w-4 h-4 flex-shrink-0" />
                    <span>{serviceName}</span>
                  </button>
                );
              })}
            </div>
          )}

          {/* Cities Section */}
          {filteredCities.length > 0 && (
            <div className="p-2 border-t border-border">
              <div className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                {t("Städte", "Cities")}
              </div>
              {filteredCities.map((city) => (
                <button
                  key={city.id}
                  onClick={() => handleCityClick(city.name)}
                  className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-foreground hover:bg-accent hover:text-primary rounded-lg transition-colors duration-200"
                >
                  <MapPin className="w-4 h-4 flex-shrink-0" />
                  <span>{city.name}</span>
                </button>
              ))}
            </div>
          )}

          {/* No Results */}
          {query.trim().length >= 2 && filteredServices.length === 0 && filteredCities.length === 0 && (
            <div className="p-6 text-center text-sm text-muted-foreground">
              {t("Keine Ergebnisse gefunden", "No results found")}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
