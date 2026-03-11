import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, ArrowRight, Check } from 'lucide-react';
import type { Service, City } from '@/lib/database';
import { servicesData } from '@/data/servicesData';

interface ServiceRequestFormProps {
  service: Service;
  cities: City[];
}

export default function ServiceRequestForm({ service, cities }: ServiceRequestFormProps) {
  const navigate = useNavigate();
  const { language, t } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isMountedRef = useRef(true);
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    state: '',
    city: '',
    service_details: '',
    timeline: 'diese_woche' as const,
    property_ownership: '',
    property_type: '',
    selected_service: service?.slug || '',
    selected_subcategories: [] as string[]
  });

  // Cities by state
  const citiesByState: Record<string, string[]> = {
    hesse: [
      'Frankfurt am Main',
      'Wiesbaden',
      'Kassel',
      'Darmstadt',
      'Offenbach am Main',
      'Hanau',
      'Gießen',
      'Marburg',
      'Fulda',
      'Rüsselsheim am Main'
    ],
    nrw: [
      'Köln',
      'Aachen',
      'Düsseldorf',
      'Dortmund',
      'Essen',
      'Duisburg',
      'Bochum',
      'Wuppertal',
      'Bonn',
      'Münster'
    ],
    'rhineland-palatinate': [
      'Mainz',
      'Ludwigshafen am Rhein',
      'Koblenz',
      'Trier',
      'Kaiserslautern',
      'Worms',
      'Neuwied',
      'Neustadt an der Weinstraße',
      'Speyer',
      'Frankenthal (Pfalz)',
      'Landau in der Pfalz',
      'Pirmasens',
      'Bad Kreuznach',
      'Idar-Oberstein',
      'Zweibrücken'
    ]
  };

  const availableCities = formData.state ? citiesByState[formData.state] || [] : [];

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [gdprConsent, setGdprConsent] = useState(false);

  // Cleanup on unmount to prevent state updates after navigation
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);
  
  // Validation function
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (formData.name.trim().length < 2) {
      newErrors.name = t(
        'Name muss mindestens 2 Zeichen lang sein',
        'Name must be at least 2 characters long'
      );
    }
    
    if (!/^(\+49|0)[0-9]{9,14}$/.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = t(
        'Bitte geben Sie eine gültige deutsche Telefonnummer ein',
        'Please enter a valid German phone number'
      );
    }
    
    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = t(
        'Bitte geben Sie eine gültige E-Mail-Adresse ein',
        'Please enter a valid email address'
      );
    }

    if (!formData.property_ownership) {
      newErrors.property_ownership = t(
        'Bitte wählen Sie Ihren Eigentumsstatus aus',
        'Please select your ownership status'
      );
    }

    // Removed blocking validation for renters - now accepts all submissions
    // Lead quality scoring happens on backend instead

    if (!formData.property_type) {
      newErrors.property_type = t(
        'Bitte wählen Sie Ihren Immobilientyp aus',
        'Please select your property type'
      );
    }

    if (!formData.selected_service) {
      newErrors.selected_service = t(
        'Bitte wählen Sie einen Service aus',
        'Please select a service'
      );
    }

    // Decision maker question removed - property ownership is sufficient for qualification
    // PLZ removed - city selection is sufficient for location

    if (!formData.state) {
      newErrors.state = t(
        'Bitte wählen Sie ein Bundesland aus',
        'Please select a state'
      );
    }

    if (!formData.city) {
      newErrors.city = t(
        'Bitte wählen Sie eine Stadt aus',
        'Please select a city'
      );
    }
    
    if (formData.service_details.trim().length < 20) {
      newErrors.service_details = t(
        'Bitte beschreiben Sie Ihr Projekt (mindestens 20 Zeichen)',
        'Please describe your project (at least 20 characters)'
      );
    }
    
    if (!gdprConsent) {
      newErrors.gdpr = t(
        'Bitte stimmen Sie der Datenschutzerklärung zu',
        'Please accept the privacy policy'
      );
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      // Build enriched service details with subcategories
      const subcategoryNames = formData.selected_subcategories.length > 0
        ? (() => {
            const selectedServiceData = servicesData.find(s => s.slug === formData.selected_service);
            if (selectedServiceData) {
              return formData.selected_subcategories
                .map(id => {
                  const sub = selectedServiceData.subcategories.find(s => s.id === id);
                  return sub ? (language === 'de' ? sub.nameDe : sub.nameEn) : null;
                })
                .filter(Boolean)
                .join(', ');
            }
            return '';
          })()
        : '';

      const enrichedDetails = subcategoryNames
        ? `${formData.service_details.trim()}\n\nGewählte Dienste: ${subcategoryNames}`
        : formData.service_details.trim();

      // Call edge function for server-side validation and secure lead creation
      const { data, error: functionError } = await supabase.functions.invoke('create-lead', {
        body: {
          name: formData.name.trim(),
          phone: formData.phone.replace(/\s/g, ''),
          email: formData.email.trim(),
          state: formData.state,
          city: formData.city,
          service_id: service.slug, // Send slug instead of UUID
          service_details: enrichedDetails,
          timeline: formData.timeline,
          property_ownership: formData.property_ownership,
          property_type: formData.property_type
        }
      });

      if (functionError) {
        console.error('Edge function error:', functionError);
        throw new Error(functionError.message || 'Failed to submit form');
      }

      console.log('Lead created successfully:', data.lead_id);

      // Redirect to thank you page
      navigate(`/danke?lead_id=${data.lead_id}`, { replace: true });

    } catch (err) {
      console.error('Error creating lead:', err);
      // Only update state if component is still mounted
      if (isMountedRef.current) {
        setError(t(
          'Es gab einen Fehler. Bitte versuchen Sie es erneut.',
          'There was an error. Please try again.'
        ));
        setLoading(false);
      }
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Error Message */}
      {error && (
        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 text-destructive text-sm">
          {error}
        </div>
      )}
      
      {/* Name Field */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          {t('Ihr vollständiger Name', 'Your full name')} <span className="text-destructive">*</span>
        </label>
        <Input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder={t('Max Mustermann', 'John Doe')}
          className={errors.name ? 'border-destructive' : ''}
        />
        {errors.name && <p className="mt-1 text-sm text-destructive">{errors.name}</p>}
      </div>
      
      {/* Phone Field */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          {t('Telefonnummer', 'Phone number')} <span className="text-destructive">*</span>
        </label>
        <Input
          type="tel"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          placeholder="+49 151 12345678"
          className={errors.phone ? 'border-destructive' : ''}
        />
        {errors.phone && <p className="mt-1 text-sm text-destructive">{errors.phone}</p>}
      </div>
      
      {/* Email Field (Mandatory) */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          {t('E-Mail', 'Email')} <span className="text-destructive">*</span>
        </label>
        <Input
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          placeholder="ihre.email@beispiel.de"
          className={errors.email ? 'border-destructive' : ''}
        />
        {errors.email && <p className="mt-1 text-sm text-destructive">{errors.email}</p>}
      </div>
      
      {/* Property Ownership - QUALIFYING QUESTION */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-3">
          {t('Sind Sie Eigentümer der Immobilie?', 'Are you the property owner?')} <span className="text-destructive">*</span>
        </label>
        <div className="space-y-3">
          <label className={`flex items-center gap-3 p-4 border rounded-lg cursor-pointer transition-all ${
            formData.property_ownership === 'owner'
              ? 'border-primary bg-primary/5'
              : 'border-input hover:border-primary/50'
          }`}>
            <input
              type="radio"
              name="property_ownership"
              value="owner"
              checked={formData.property_ownership === 'owner'}
              onChange={(e) => setFormData({ ...formData, property_ownership: e.target.value })}
              className="w-4 h-4 text-primary focus:ring-2 focus:ring-ring"
            />
            <div className="flex-1">
              <span className="text-sm font-medium text-foreground">
                {t('Ja, ich bin Eigentümer', 'Yes, I am the owner')}
              </span>
              <p className="text-xs text-muted-foreground mt-0.5">
                {t('Ich besitze die Immobilie', 'I own the property')}
              </p>
            </div>
          </label>

          <label className={`flex items-center gap-3 p-4 border rounded-lg cursor-pointer transition-all ${
            formData.property_ownership === 'renter'
              ? 'border-primary/50 bg-primary/5'
              : 'border-input hover:border-primary/50'
          }`}>
            <input
              type="radio"
              name="property_ownership"
              value="renter"
              checked={formData.property_ownership === 'renter'}
              onChange={(e) => setFormData({ ...formData, property_ownership: e.target.value })}
              className="w-4 h-4 text-primary focus:ring-2 focus:ring-ring"
            />
            <div className="flex-1">
              <span className="text-sm font-medium text-foreground">
                {t('Nein, ich bin Mieter', 'No, I am a renter/tenant')}
              </span>
              <p className="text-xs text-muted-foreground mt-0.5">
                {t('Ich miete die Immobilie', 'I rent the property')}
              </p>
            </div>
          </label>
        </div>
        {errors.property_ownership && (
          <div className="mt-2 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
            <p className="text-sm text-destructive">{errors.property_ownership}</p>
          </div>
        )}
        {/* Soft warning for renters - informational only, doesn't block submission */}
        {formData.property_ownership === 'renter' && (
          <div className="mt-2 p-3 bg-primary/10 border border-primary/20 rounded-lg">
            <p className="text-sm text-foreground font-medium">
              💡 {t('Hinweis für Mieter', 'Note for renters')}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {t(
                'Bitte stellen Sie sicher, dass Sie die Genehmigung Ihres Vermieters für die gewünschten Arbeiten haben.',
                'Please ensure you have your landlord\'s permission for the desired work.'
              )}
            </p>
          </div>
        )}
      </div>

      {/* Property Type - QUALIFYING QUESTION */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          {t('Art der Immobilie', 'Property type')} <span className="text-destructive">*</span>
        </label>
        <select
          value={formData.property_type}
          onChange={(e) => setFormData({ ...formData, property_type: e.target.value })}
          className={`w-full h-10 rounded-md border ${errors.property_type ? 'border-destructive' : 'border-input'} bg-background px-3 py-2 text-sm text-foreground ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2`}
        >
          <option value="">{t('Immobilientyp auswählen...', 'Select property type...')}</option>
          <option value="single_family">{t('Einfamilienhaus', 'Single-family house')}</option>
          <option value="apartment">{t('Eigentumswohnung', 'Apartment/Condo')}</option>
          <option value="multi_family">{t('Mehrfamilienhaus', 'Multi-family house')}</option>
          <option value="commercial">{t('Gewerbeimmobilie', 'Commercial property')}</option>
        </select>
        {errors.property_type && <p className="mt-1 text-sm text-destructive">{errors.property_type}</p>}
      </div>

      {/* Service Selection - NEW */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          {t('Service benötigt', 'Service Required')} <span className="text-destructive">*</span>
        </label>
        <select
          value={formData.selected_service}
          onChange={(e) => setFormData({ ...formData, selected_service: e.target.value, selected_subcategories: [] })}
          className={`w-full h-10 rounded-md border ${errors.selected_service ? 'border-destructive' : 'border-input'} bg-background px-3 py-2 text-sm text-foreground ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2`}
        >
          <option value="">{t('Service auswählen...', 'Select service...')}</option>
          {servicesData.map((svc) => (
            <option key={svc.slug} value={svc.slug}>
              {language === 'de' ? svc.nameDe : svc.nameEn}
            </option>
          ))}
        </select>
        {errors.selected_service && <p className="mt-1 text-sm text-destructive">{errors.selected_service}</p>}
      </div>

      {/* Conditional Subcategories - Multi-select - NEW */}
      {formData.selected_service && (() => {
        const selectedServiceData = servicesData.find(s => s.slug === formData.selected_service);
        if (selectedServiceData && selectedServiceData.subcategories.length > 0) {
          return (
            <div>
              <label className="block text-sm font-medium text-foreground mb-3">
                {t('Spezifischer Service', 'Specific Service')} {t('(Optional - mehrere wählbar)', '(Optional - multiple selections)')}
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {selectedServiceData.subcategories.map((subcategory) => {
                  const isSelected = formData.selected_subcategories.includes(subcategory.id);
                  return (
                    <label
                      key={subcategory.id}
                      className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-all ${
                        isSelected
                          ? 'border-primary bg-primary/5'
                          : 'border-input hover:border-primary/50'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFormData({
                              ...formData,
                              selected_subcategories: [...formData.selected_subcategories, subcategory.id]
                            });
                          } else {
                            setFormData({
                              ...formData,
                              selected_subcategories: formData.selected_subcategories.filter(id => id !== subcategory.id)
                            });
                          }
                        }}
                        className="w-4 h-4 rounded text-primary focus:ring-2 focus:ring-ring"
                      />
                      <div className="flex-1">
                        <span className="text-sm text-foreground">
                          {language === 'de' ? subcategory.nameDe : subcategory.nameEn}
                        </span>
                      </div>
                      {isSelected && <Check className="w-4 h-4 text-primary" />}
                    </label>
                  );
                })}
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                {t('Sie können mehrere Optionen auswählen', 'You can select multiple options')}
              </p>
            </div>
          );
        }
        return null;
      })()}

      {/* State Selection */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          {t('Bundesland', 'State')} <span className="text-destructive">*</span>
        </label>
        <select
          value={formData.state}
          onChange={(e) => setFormData({ ...formData, state: e.target.value, city: '' })}
          className={`w-full h-10 rounded-md border ${errors.state ? 'border-destructive' : 'border-input'} bg-background px-3 py-2 text-sm text-foreground ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2`}
        >
          <option value="">{t('Bundesland auswählen...', 'Select state...')}</option>
          <option value="hesse">{t('Hessen', 'Hesse')}</option>
          <option value="nrw">{t('Nordrhein-Westfalen', 'North Rhine-Westphalia')}</option>
          <option value="rhineland-palatinate">{t('Rheinland-Pfalz', 'Rhineland-Palatinate')}</option>
        </select>
        {errors.state && <p className="mt-1 text-sm text-destructive">{errors.state}</p>}
      </div>

      {/* City Selection */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          {t('Stadt', 'City')} <span className="text-destructive">*</span>
        </label>
        <select
          value={formData.city}
          onChange={(e) => setFormData({ ...formData, city: e.target.value })}
          disabled={!formData.state}
          className={`w-full h-10 rounded-md border ${errors.city ? 'border-destructive' : 'border-input'} bg-background px-3 py-2 text-sm text-foreground ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          <option value="">{t('Stadt auswählen...', 'Select city...')}</option>
          {availableCities.map((city) => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
        </select>
        {errors.city && <p className="mt-1 text-sm text-destructive">{errors.city}</p>}
        {!formData.state && (
          <p className="mt-1 text-xs text-muted-foreground">
            {t('Bitte wählen Sie zuerst ein Bundesland', 'Please select a state first')}
          </p>
        )}
      </div>

      {/* Service Details Textarea */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          {t('Beschreiben Sie Ihr Projekt', 'Describe your project')} <span className="text-destructive">*</span>
        </label>
        <Textarea
          rows={4}
          value={formData.service_details}
          onChange={(e) => setFormData({ ...formData, service_details: e.target.value })}
          placeholder={t(
            'Z.B. Heizung ausgefallen, Notfall, 3-Zimmer Wohnung, Baujahr 2010...',
            'E.g. Heating system broken, emergency, 3-room apartment, built in 2010...'
          )}
          className={errors.service_details ? 'border-destructive' : ''}
        />
        <div className="flex justify-between items-center mt-1">
          {errors.service_details ? (
            <p className="text-sm text-destructive">{errors.service_details}</p>
          ) : (
            <p className="text-sm text-muted-foreground">
              {formData.service_details.length} / 20 {t('Zeichen (Minimum)', 'characters (minimum)')}
            </p>
          )}
        </div>
      </div>
      
      {/* Timeline Dropdown */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          {t('Wann benötigen Sie die Dienstleistung?', 'When do you need the service?')} <span className="text-destructive">*</span>
        </label>
        <select
          value={formData.timeline}
          onChange={(e) => setFormData({ ...formData, timeline: e.target.value as any })}
          className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          <option value="sofort">{t('Sofort / Notfall', 'Immediately / Emergency')}</option>
          <option value="diese_woche">{t('Diese Woche', 'This week')}</option>
          <option value="diesen_monat">{t('Diesen Monat', 'This month')}</option>
          <option value="flexibel">{t('Flexibel / Ich plane nur', 'Flexible / Just planning')}</option>
        </select>
      </div>
      
      {/* GDPR Consent Checkbox */}
      <div>
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={gdprConsent}
            onChange={(e) => setGdprConsent(e.target.checked)}
            className="mt-1 w-4 h-4 rounded border-input text-primary focus:ring-2 focus:ring-ring focus:ring-offset-2"
          />
          <span className="text-sm text-muted-foreground">
            {t(
              'Ich stimme zu, dass meine Daten an Fachleute weitergeleitet werden.',
              'I agree that my data will be forwarded to professionals.'
            )}{' '}
            <a href="/privacy" target="_blank" className="text-primary hover:underline">
              {t('Datenschutz', 'Privacy Policy')}
            </a>
            <span className="text-destructive"> *</span>
          </span>
        </label>
        {errors.gdpr && <p className="mt-1 text-sm text-destructive ml-7">{errors.gdpr}</p>}
      </div>
      
      {/* Submit Button */}
      <Button
        type="submit"
        disabled={loading}
        className="w-full"
        size="lg"
      >
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            {t('Wird gesendet...', 'Sending...')}
          </>
        ) : (
          <>
            {t('Kostenlose Angebote erhalten', 'Get Free Quotes')}
            <ArrowRight className="w-5 h-5" />
          </>
        )}
      </Button>
      
      <p className="text-center text-xs text-muted-foreground">
        {t('Kostenlos & unverbindlich • Keine versteckten Kosten', 'Free & non-binding • No hidden costs')}
      </p>
    </form>
  );
}
