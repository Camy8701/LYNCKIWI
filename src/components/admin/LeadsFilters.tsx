import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import type { Service, City } from '@/lib/database';
import { useLanguage } from '@/contexts/LanguageContext';

interface LeadsFiltersProps {
  services: Service[];
  cities: City[];
}

export default function LeadsFilters({ services, cities }: LeadsFiltersProps) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { t } = useLanguage();

  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [service, setService] = useState(searchParams.get('service') || '');
  const [city, setCity] = useState(searchParams.get('city') || '');
  const [status, setStatus] = useState(searchParams.get('status') || '');

  const handleFilter = () => {
    const params = new URLSearchParams();

    if (search) params.set('search', search);
    if (service) params.set('service', service);
    if (city) params.set('city', city);
    if (status) params.set('status', status);

    navigate(`/admin/leads?${params.toString()}`);
  };

  const handleReset = () => {
    setSearch('');
    setService('');
    setCity('');
    setStatus('');
    navigate('/admin/leads');
  };

  return (
    <div className="bg-card backdrop-blur-md border border-border rounded-2xl p-6 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
        {/* Search */}
        <div className="lg:col-span-2">
          <label className="block text-sm font-medium text-muted-foreground mb-2">
            {t('Suche', 'Search')}
          </label>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleFilter()}
            placeholder={t('Name, Telefon, E-Mail...', 'Name, Phone, Email...')}
            className="w-full bg-background border border-border rounded-lg px-4 py-2 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
          />
        </div>

        {/* Service Filter */}
        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-2">
            {t('Service', 'Service')}
          </label>
          <select
            value={service}
            onChange={(e) => setService(e.target.value)}
            className="w-full bg-background border border-border rounded-lg px-4 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
          >
            <option value="">{t('Alle Services', 'All Services')}</option>
            {services.map((s) => (
              <option key={s.id} value={s.id}>
                {s.icon} {s.name}
              </option>
            ))}
          </select>
        </div>

        {/* City Filter */}
        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-2">
            {t('Stadt', 'City')}
          </label>
          <select
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="w-full bg-background border border-border rounded-lg px-4 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
          >
            <option value="">{t('Alle Städte', 'All Cities')}</option>
            {cities.map((c) => (
              <option key={c.id} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* Status Filter */}
        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-2">
            {t('Status', 'Status')}
          </label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full bg-background border border-border rounded-lg px-4 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
          >
            <option value="">{t('Alle Status', 'All Statuses')}</option>
            <option value="new">{t('Neu', 'New')}</option>
            <option value="contacted">{t('Kontaktiert', 'Contacted')}</option>
            <option value="converted">{t('Umgewandelt', 'Converted')}</option>
          </select>
        </div>
      </div>

      {/* Filter Buttons */}
      <div className="flex gap-3">
        <button
          onClick={handleFilter}
          className="flex-1 md:flex-none px-6 py-2 bg-primary hover:bg-primary/90 text-primary-foreground font-medium rounded-lg transition-all"
        >
          {t('Filter anwenden', 'Apply Filter')}
        </button>
        <button
          onClick={handleReset}
          className="flex-1 md:flex-none px-6 py-2 bg-secondary hover:bg-secondary/80 text-secondary-foreground rounded-lg transition-all"
        >
          {t('Zurücksetzen', 'Reset')}
        </button>
      </div>
    </div>
  );
}
