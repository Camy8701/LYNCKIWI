import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createCompany, updateCompany } from '@/lib/database';
import type { Company, Service, City } from '@/lib/database';
import { useLanguage } from '@/contexts/LanguageContext';

interface CompanyFormProps {
  company?: Company;
  services: Service[];
  cities: City[];
}

export default function CompanyForm({ company, services, cities }: CompanyFormProps) {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    name: company?.name || '',
    contact_person: company?.contact_person || '',
    phone: company?.phone || '',
    email: company?.email || '',
    whatsapp: company?.whatsapp || '',
    service_ids: company?.service_ids || [],
    cities: company?.cities || [],
    is_active: company?.is_active ?? true,
  });
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    
    // Validation
    if (!formData.name.trim()) {
      setError(t('Firmenname ist erforderlich', 'Company name is required'));
      setLoading(false);
      return;
    }
    
    if (!formData.phone.trim()) {
      setError(t('Telefonnummer ist erforderlich', 'Phone number is required'));
      setLoading(false);
      return;
    }
    
    if (!formData.email.trim()) {
      setError(t('E-Mail ist erforderlich', 'Email is required'));
      setLoading(false);
      return;
    }
    
    if (formData.service_ids.length === 0) {
      setError(t('Mindestens ein Service muss ausgewählt werden', 'At least one service must be selected'));
      setLoading(false);
      return;
    }
    
    if (formData.cities.length === 0) {
      setError(t('Mindestens eine Stadt muss ausgewählt werden', 'At least one city must be selected'));
      setLoading(false);
      return;
    }
    
    try {
      if (company) {
        await updateCompany(company.id, formData);
        alert(t('✅ Unternehmen aktualisiert', '✅ Company updated'));
      } else {
        await createCompany(formData as any);
        alert(t('✅ Unternehmen erstellt', '✅ Company created'));
      }
      navigate('/admin/companies');
    } catch (err) {
      console.error('Error saving company:', err);
      setError(t('Fehler beim Speichern. Bitte versuchen Sie es erneut.', 'Error saving. Please try again.'));
    } finally {
      setLoading(false);
    }
  };
  
  const toggleService = (serviceId: string) => {
    setFormData(prev => ({
      ...prev,
      service_ids: prev.service_ids.includes(serviceId)
        ? prev.service_ids.filter(id => id !== serviceId)
        : [...prev.service_ids, serviceId]
    }));
  };
  
  const toggleCity = (cityName: string) => {
    setFormData(prev => ({
      ...prev,
      cities: prev.cities.includes(cityName)
        ? prev.cities.filter(c => c !== cityName)
        : [...prev.cities, cityName]
    }));
  };
  
  return (
    <form onSubmit={handleSubmit} className="bg-card backdrop-blur-md border border-border rounded-2xl p-8">
      {error && (
        <div className="mb-6 bg-red-500/10 border border-red-500/20 rounded-lg p-4 text-red-400 text-sm">
          {error}
        </div>
      )}
      
      <div className="space-y-6">
        {/* Basic Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              {t('Firmenname', 'Company Name')} <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="ABC Heizung GmbH"
              className="w-full bg-background border border-border rounded-lg px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              {t('Kontaktperson', 'Contact Person')}
            </label>
            <input
              type="text"
              value={formData.contact_person}
              onChange={(e) => setFormData({ ...formData, contact_person: e.target.value })}
              placeholder={t('Max Mustermann', 'Max Mustermann')}
              className="w-full bg-background border border-border rounded-lg px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
        </div>
        
        {/* Contact Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              {t('Telefon', 'Phone')} <span className="text-red-400">*</span>
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="+49 30 12345678"
              className="w-full bg-background border border-border rounded-lg px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              {t('E-Mail', 'Email')} <span className="text-red-400">*</span>
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="kontakt@abc-heizung.de"
              className="w-full bg-background border border-border rounded-lg px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              {t('WhatsApp', 'WhatsApp')}
            </label>
            <input
              type="tel"
              value={formData.whatsapp}
              onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
              placeholder="+49 151 12345678"
              className="w-full bg-background border border-border rounded-lg px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
        </div>
        
        {/* Services Multi-Select */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-3">
            {t('Services', 'Services')} <span className="text-red-400">*</span>
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {services.map((service) => (
              <button
                key={service.id}
                type="button"
                onClick={() => toggleService(service.id)}
                className={`flex items-center gap-3 p-4 rounded-lg border-2 transition-all ${
                  formData.service_ids.includes(service.id)
                    ? 'border-primary bg-primary/10'
                    : 'border-border bg-background hover:border-primary/50'
                }`}
              >
                <span className="text-2xl">{service.icon}</span>
                <span className="text-sm text-foreground font-medium">{service.name}</span>
                {formData.service_ids.includes(service.id) && (
                  <svg className="w-5 h-5 ml-auto text-primary" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                )}
              </button>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Ausgewählt: {formData.service_ids.length} Service{formData.service_ids.length !== 1 ? 's' : ''}
          </p>
        </div>
        
        {/* Cities Multi-Select */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-3">
            Städte <span className="text-red-400">*</span>
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            {cities.map((city) => (
              <button
                key={city.id}
                type="button"
                onClick={() => toggleCity(city.name)}
                className={`p-3 rounded-lg border-2 text-sm font-medium transition-all ${
                  formData.cities.includes(city.name)
                    ? 'border-primary bg-primary/10 text-foreground'
                    : 'border-border bg-background text-muted-foreground hover:border-primary/50 hover:text-foreground'
                }`}
              >
                {city.name}
                {formData.cities.includes(city.name) && ' ✓'}
              </button>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Ausgewählt: {formData.cities.length} Stadt/Städte
          </p>
        </div>
        
        {/* Info Box */}
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
          <p className="text-sm text-blue-300">
            ℹ️ Das Unternehmen erhält Leads für <strong>alle gewählten Services</strong> in <strong>allen gewählten Städten</strong>.
            {formData.service_ids.length > 0 && formData.cities.length > 0 && (
              <span className="block mt-2 font-medium">
                Mögliche Kombinationen: {formData.service_ids.length} × {formData.cities.length} = {formData.service_ids.length * formData.cities.length}
              </span>
            )}
          </p>
        </div>
        
        {/* Status Toggle */}
        <div>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.is_active}
              onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
              className="w-5 h-5 bg-background border border-border rounded text-primary focus:ring-2 focus:ring-primary/50"
            />
            <div>
              <div className="text-sm font-medium text-foreground">Aktiv</div>
              <div className="text-xs text-muted-foreground">Inaktive Unternehmen erhalten keine neuen Leads</div>
            </div>
          </label>
        </div>
        
        {/* Submit Buttons */}
        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 px-6 py-3 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-lg transition-all disabled:opacity-50"
          >
            {loading ? 'Wird gespeichert...' : company ? 'Änderungen speichern' : 'Unternehmen erstellen'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/admin/companies')}
            className="px-6 py-3 bg-background border border-border text-muted-foreground hover:text-foreground rounded-lg transition-all"
          >
            Abbrechen
          </button>
        </div>
      </div>
    </form>
  );
}
