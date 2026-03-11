import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import PageLayout from '@/components/PageLayout';
import { SEO } from '@/lib/seo';
import {
  Building2,
  Globe,
  Upload,
  CreditCard,
  CheckCircle,
  ArrowLeft,
  ArrowRight,
  Check,
  Loader2,
  Image as ImageIcon,
  X,
} from 'lucide-react';
import { AD_PRICING, createAd, uploadAdLogo, type CreateAdInput } from '@/lib/ads';
import { supabase } from '@/integrations/supabase/client';

type Step = 1 | 2 | 3 | 4 | 5;

const INDUSTRIES = [
  { de: 'Heizung & Sanitär', en: 'Heating & Plumbing' },
  { de: 'Solar & Energie', en: 'Solar & Energy' },
  { de: 'Dachdecker', en: 'Roofing' },
  { de: 'Elektrik', en: 'Electrical' },
  { de: 'Renovierung & Umbau', en: 'Renovation & Remodeling' },
  { de: 'Garten & Landschaft', en: 'Garden & Landscaping' },
  { de: 'Reinigung', en: 'Cleaning' },
  { de: 'Sicherheit', en: 'Security' },
  { de: 'Sonstiges', en: 'Other' },
];

export default function AdvertiseCreate() {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    company_name: '',
    website_url: '',
    industry: '',
    short_description: '',
    advertiser_name: '',
    advertiser_email: '',
    advertiser_phone: '',
    duration_months: 6,
    auto_renew: false,
  });

  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  // Step validation
  const isStep1Valid = () => {
    return (
      formData.company_name.length >= 2 &&
      formData.website_url.length >= 5 &&
      formData.industry.length > 0
    );
  };

  const isStep2Valid = () => {
    return logoFile !== null;
  };

  const isStep3Valid = () => {
    return (
      formData.advertiser_name.length >= 2 &&
      formData.advertiser_email.includes('@') &&
      formData.advertiser_email.includes('.')
    );
  };

  const isStep4Valid = () => {
    return formData.duration_months >= 1;
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return isStep1Valid();
      case 2:
        return isStep2Valid();
      case 3:
        return isStep3Valid();
      case 4:
        return isStep4Valid();
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (currentStep < 5 && canProceed()) {
      setCurrentStep((prev) => (prev + 1) as Step);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => (prev - 1) as Step);
    }
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError(t('Bitte wählen Sie eine Bilddatei', 'Please select an image file'));
        return;
      }

      // Validate file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        setError(t('Die Datei darf maximal 2MB groß sein', 'File must be less than 2MB'));
        return;
      }

      setLogoFile(file);
      setError(null);

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setLogoPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeLogo = () => {
    setLogoFile(null);
    setLogoPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async () => {
    if (!logoFile) {
      setError(t('Bitte laden Sie ein Logo hoch', 'Please upload a logo'));
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // Generate a temporary ID for the logo
      const tempId = crypto.randomUUID();

      // Upload logo first
      const logoUrl = await uploadAdLogo(logoFile, tempId);

      // Create ad
      const adInput: CreateAdInput = {
        company_name: formData.company_name,
        website_url: formData.website_url.startsWith('http')
          ? formData.website_url
          : `https://${formData.website_url}`,
        industry: formData.industry,
        short_description: formData.short_description || undefined,
        logo_url: logoUrl,
        duration_months: formData.duration_months,
        auto_renew: formData.auto_renew,
        advertiser_name: formData.advertiser_name,
        advertiser_email: formData.advertiser_email,
        advertiser_phone: formData.advertiser_phone || undefined,
      };

      const ad = await createAd(adInput);

      if (ad) {
        // Move to confirmation step
        setCurrentStep(5);
      }
    } catch (err: any) {
      console.error('Error creating ad:', err);
      setError(
        err.message ||
          t('Fehler beim Erstellen der Anzeige', 'Error creating ad')
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const pricing = AD_PRICING[formData.duration_months as keyof typeof AD_PRICING];

  const steps = [
    { num: 1, icon: Building2, label: t('Unternehmen', 'Company') },
    { num: 2, icon: Upload, label: t('Logo', 'Logo') },
    { num: 3, icon: Globe, label: t('Kontakt', 'Contact') },
    { num: 4, icon: CreditCard, label: t('Plan', 'Plan') },
    { num: 5, icon: CheckCircle, label: t('Fertig', 'Done') },
  ];

  return (
    <PageLayout>
      <SEO
        title={t('Anzeige erstellen | Lynck Services', 'Create Ad | Lynck Services')}
        description={t(
          'Erstellen Sie Ihre Werbeanzeige in wenigen Minuten.',
          'Create your advertisement in just a few minutes.'
        )}
        canonicalUrl="/advertise/create"
      />

      <main className="flex-1 overflow-y-auto">
        <div className="min-h-screen p-6 md:p-12">
          <div className="max-w-2xl mx-auto">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-3xl md:text-4xl font-serif text-foreground mb-2">
                {t('Anzeige erstellen', 'Create Ad')}
              </h1>
              <p className="text-muted-foreground">
                {t(
                  'In nur 4 Schritten zu Ihrer Werbeanzeige',
                  'Create your ad in just 4 steps'
                )}
              </p>
            </div>

            {/* Progress Steps */}
            <div className="flex items-center justify-between mb-10 relative">
              {/* Progress Line */}
              <div className="absolute top-5 left-0 right-0 h-0.5 bg-white/10" />
              <div
                className="absolute top-5 left-0 h-0.5 bg-primary transition-all duration-300"
                style={{ width: `${((currentStep - 1) / 4) * 100}%` }}
              />

              {steps.map((step) => {
                const isActive = currentStep === step.num;
                const isCompleted = currentStep > step.num;
                const Icon = step.icon;

                return (
                  <div
                    key={step.num}
                    className="relative z-10 flex flex-col items-center"
                  >
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                        isActive
                          ? 'bg-primary text-black'
                          : isCompleted
                          ? 'bg-primary/80 text-black'
                          : 'bg-white/10 text-white/40'
                      }`}
                    >
                      {isCompleted ? (
                        <Check className="w-5 h-5" />
                      ) : (
                        <Icon className="w-5 h-5" />
                      )}
                    </div>
                    <span
                      className={`text-xs mt-2 ${
                        isActive
                          ? 'text-primary font-medium'
                          : isCompleted
                          ? 'text-primary/80'
                          : 'text-white/40'
                      }`}
                    >
                      {step.label}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Form Content */}
            <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-6 md:p-8">
              {error && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-6">
                  <p className="text-red-400 text-sm">{error}</p>
                </div>
              )}

              {/* Step 1: Company Info */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-foreground mb-6">
                    {t('Unternehmensinformationen', 'Company Information')}
                  </h2>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      {t('Firmenname', 'Company Name')} *
                    </label>
                    <input
                      type="text"
                      value={formData.company_name}
                      onChange={(e) =>
                        setFormData({ ...formData, company_name: e.target.value })
                      }
                      placeholder={t('z.B. Müller Heizungsbau', 'e.g. Smith Heating')}
                      maxLength={50}
                      className="w-full bg-background border border-border rounded-lg px-4 py-3 text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                    <p className="text-gray-500 text-xs mt-1">
                      {formData.company_name.length}/50 {t('Zeichen', 'characters')}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      {t('Website', 'Website')} *
                    </label>
                    <input
                      type="url"
                      value={formData.website_url}
                      onChange={(e) =>
                        setFormData({ ...formData, website_url: e.target.value })
                      }
                      placeholder="https://www.example.com"
                      className="w-full bg-background border border-border rounded-lg px-4 py-3 text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      {t('Branche', 'Industry')} *
                    </label>
                    <select
                      value={formData.industry}
                      onChange={(e) =>
                        setFormData({ ...formData, industry: e.target.value })
                      }
                      className="w-full bg-background border border-border rounded-lg px-4 py-3 text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
                    >
                      <option value="">
                        {t('Branche auswählen...', 'Select industry...')}
                      </option>
                      {INDUSTRIES.map((ind) => (
                        <option
                          key={ind.en}
                          value={language === 'de' ? ind.de : ind.en}
                        >
                          {language === 'de' ? ind.de : ind.en}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      {t('Kurzbeschreibung', 'Short Description')}{' '}
                      <span className="text-gray-500">
                        ({t('optional', 'optional')})
                      </span>
                    </label>
                    <input
                      type="text"
                      value={formData.short_description}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          short_description: e.target.value,
                        })
                      }
                      placeholder={t(
                        'z.B. 24h Notdienst verfügbar',
                        'e.g. 24h emergency service available'
                      )}
                      maxLength={80}
                      className="w-full bg-background border border-border rounded-lg px-4 py-3 text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                    <p className="text-gray-500 text-xs mt-1">
                      {formData.short_description.length}/80{' '}
                      {t('Zeichen', 'characters')}
                    </p>
                  </div>
                </div>
              )}

              {/* Step 2: Logo Upload */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-foreground mb-6">
                    {t('Logo hochladen', 'Upload Logo')}
                  </h2>

                  <div className="text-center">
                    {logoPreview ? (
                      <div className="relative inline-block">
                        <img
                          src={logoPreview}
                          alt="Logo preview"
                          className="w-32 h-32 rounded-full object-cover border-4 border-primary/30"
                        />
                        <button
                          type="button"
                          onClick={removeLogo}
                          className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center text-white transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="w-32 h-32 mx-auto rounded-full border-2 border-dashed border-white/20 hover:border-primary/50 flex flex-col items-center justify-center transition-colors cursor-pointer"
                      >
                        <ImageIcon className="w-8 h-8 text-gray-500 mb-2" />
                        <span className="text-sm text-gray-500">
                          {t('Klicken', 'Click')}
                        </span>
                      </button>
                    )}

                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleLogoChange}
                      className="hidden"
                    />

                    {!logoPreview && (
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-primary/10 hover:bg-primary/20 text-primary font-medium rounded-lg transition-colors"
                      >
                        <Upload className="w-4 h-4" />
                        {t('Datei auswählen', 'Choose File')}
                      </button>
                    )}
                  </div>

                  <div className="bg-white/[0.02] rounded-lg p-4 text-center">
                    <p className="text-gray-400 text-sm">
                      {t(
                        'Empfohlene Größe: 200x200 Pixel',
                        'Recommended size: 200x200 pixels'
                      )}
                    </p>
                    <p className="text-gray-500 text-xs mt-1">
                      {t(
                        'PNG, JPG oder SVG • Max 2MB • Wird kreisförmig angezeigt',
                        'PNG, JPG or SVG • Max 2MB • Will be displayed as circle'
                      )}
                    </p>
                  </div>

                  {logoPreview && (
                    <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                      <h3 className="text-sm font-medium text-foreground mb-2">
                        {t('Vorschau', 'Preview')}
                      </h3>
                      <div className="flex items-center gap-3">
                        <img
                          src={logoPreview}
                          alt="Preview"
                          className="w-12 h-12 rounded-full object-cover border-2 border-white/10"
                        />
                        <div>
                          <p className="text-white font-medium">
                            {formData.company_name || t('Ihr Firmenname', 'Your company name')}
                          </p>
                          <p className="text-gray-400 text-sm">
                            {formData.short_description ||
                              t('Ihre Kurzbeschreibung', 'Your short description')}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Step 3: Contact Info */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-foreground mb-6">
                    {t('Kontaktinformationen', 'Contact Information')}
                  </h2>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      {t('Ihr Name', 'Your Name')} *
                    </label>
                    <input
                      type="text"
                      value={formData.advertiser_name}
                      onChange={(e) =>
                        setFormData({ ...formData, advertiser_name: e.target.value })
                      }
                      placeholder={t('Vor- und Nachname', 'First and last name')}
                      className="w-full bg-background border border-border rounded-lg px-4 py-3 text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      {t('E-Mail-Adresse', 'Email Address')} *
                    </label>
                    <input
                      type="email"
                      value={formData.advertiser_email}
                      onChange={(e) =>
                        setFormData({ ...formData, advertiser_email: e.target.value })
                      }
                      placeholder="email@example.com"
                      className="w-full bg-background border border-border rounded-lg px-4 py-3 text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                    <p className="text-gray-500 text-xs mt-1">
                      {t(
                        'Hier erhalten Sie Ihre Rechnung und Performance-Reports',
                        "You'll receive your invoice and performance reports here"
                      )}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      {t('Telefon', 'Phone')}{' '}
                      <span className="text-gray-500">
                        ({t('optional', 'optional')})
                      </span>
                    </label>
                    <input
                      type="tel"
                      value={formData.advertiser_phone}
                      onChange={(e) =>
                        setFormData({ ...formData, advertiser_phone: e.target.value })
                      }
                      placeholder="+49 123 456789"
                      className="w-full bg-background border border-border rounded-lg px-4 py-3 text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                </div>
              )}

              {/* Step 4: Plan Selection */}
              {currentStep === 4 && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-foreground mb-6">
                    {t('Laufzeit wählen', 'Choose Duration')}
                  </h2>

                  <div className="grid grid-cols-2 gap-4">
                    {Object.entries(AD_PRICING).map(([months, price]) => (
                      <button
                        key={months}
                        type="button"
                        onClick={() =>
                          setFormData({
                            ...formData,
                            duration_months: parseInt(months),
                          })
                        }
                        className={`relative p-4 rounded-xl border-2 transition-all text-left ${
                          formData.duration_months === parseInt(months)
                            ? 'border-primary bg-primary/5'
                            : 'border-white/10 hover:border-white/20'
                        }`}
                      >
                        {parseInt(months) === 6 && (
                          <div className="absolute -top-2 right-2 bg-primary text-black text-[10px] font-bold px-2 py-0.5 rounded-full">
                            {t('Beliebt', 'Popular')}
                          </div>
                        )}
                        <div className="text-lg font-semibold text-white">
                          {months} {t('Monat(e)', 'Month(s)')}
                        </div>
                        <div className="text-2xl font-bold text-primary mt-1">
                          €{price.total}
                        </div>
                        <div className="text-gray-400 text-sm">
                          €{price.perMonth}/{t('Monat', 'month')}
                        </div>
                        {price.savings > 0 && (
                          <div className="text-green-400 text-xs mt-1">
                            {t('Sparen Sie', 'Save')} {price.savings}%
                          </div>
                        )}
                      </button>
                    ))}
                  </div>

                  <div className="flex items-center gap-3 mt-6 p-4 bg-white/[0.02] rounded-lg">
                    <input
                      type="checkbox"
                      id="auto_renew"
                      checked={formData.auto_renew}
                      onChange={(e) =>
                        setFormData({ ...formData, auto_renew: e.target.checked })
                      }
                      className="w-5 h-5 rounded border-white/20 bg-background text-primary focus:ring-primary"
                    />
                    <label
                      htmlFor="auto_renew"
                      className="text-sm text-gray-300 cursor-pointer"
                    >
                      {t(
                        'Automatische Verlängerung aktivieren',
                        'Enable automatic renewal'
                      )}
                    </label>
                  </div>

                  {/* Summary */}
                  <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 mt-6">
                    <h3 className="text-sm font-medium text-foreground mb-3">
                      {t('Zusammenfassung', 'Summary')}
                    </h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">
                          {t('Unternehmen', 'Company')}
                        </span>
                        <span className="text-white">{formData.company_name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">
                          {t('Laufzeit', 'Duration')}
                        </span>
                        <span className="text-white">
                          {formData.duration_months} {t('Monat(e)', 'Month(s)')}
                        </span>
                      </div>
                      <div className="flex justify-between border-t border-white/10 pt-2 mt-2">
                        <span className="text-white font-medium">
                          {t('Gesamtpreis', 'Total Price')}
                        </span>
                        <span className="text-primary font-bold text-lg">
                          €{pricing?.total || 0}
                        </span>
                      </div>
                    </div>
                  </div>

                  <p className="text-gray-500 text-xs text-center">
                    {t(
                      'Nach dem Absenden wird Ihre Anzeige geprüft. Die Zahlung erfolgt nach Freigabe per Rechnung.',
                      'After submission, your ad will be reviewed. Payment is made by invoice after approval.'
                    )}
                  </p>
                </div>
              )}

              {/* Step 5: Confirmation */}
              {currentStep === 5 && (
                <div className="text-center py-8">
                  <div className="w-20 h-20 mx-auto bg-primary/20 rounded-full flex items-center justify-center mb-6">
                    <CheckCircle className="w-10 h-10 text-primary" />
                  </div>

                  <h2 className="text-2xl font-semibold text-foreground mb-3">
                    {t('Anzeige eingereicht!', 'Ad Submitted!')}
                  </h2>

                  <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                    {t(
                      'Vielen Dank! Ihre Anzeige wird innerhalb von 24 Stunden geprüft. Sie erhalten eine E-Mail mit weiteren Informationen.',
                      'Thank you! Your ad will be reviewed within 24 hours. You will receive an email with further information.'
                    )}
                  </p>

                  <div className="bg-white/[0.02] rounded-lg p-4 mb-6 max-w-sm mx-auto">
                    <div className="flex items-center gap-3">
                      {logoPreview && (
                        <img
                          src={logoPreview}
                          alt={formData.company_name}
                          className="w-12 h-12 rounded-full object-cover border-2 border-primary/30"
                        />
                      )}
                      <div className="text-left">
                        <p className="text-white font-medium">
                          {formData.company_name}
                        </p>
                        <p className="text-gray-400 text-sm">
                          {formData.duration_months}{' '}
                          {t('Monat(e) Werbung', 'month(s) advertising')}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <button
                      onClick={() => navigate('/')}
                      className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-medium rounded-lg transition-all"
                    >
                      {t('Zur Startseite', 'Go to Homepage')}
                    </button>
                    <button
                      onClick={() => navigate('/advertise')}
                      className="px-6 py-3 bg-primary hover:bg-primary/90 text-black font-semibold rounded-lg transition-all"
                    >
                      {t('Zurück zur Werbung', 'Back to Advertising')}
                    </button>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              {currentStep < 5 && (
                <div className="flex justify-between mt-8 pt-6 border-t border-white/[0.06]">
                  <button
                    type="button"
                    onClick={currentStep === 1 ? () => navigate('/advertise') : handleBack}
                    className="inline-flex items-center gap-2 px-4 py-2 text-gray-400 hover:text-white transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    {t('Zurück', 'Back')}
                  </button>

                  {currentStep < 4 ? (
                    <button
                      type="button"
                      onClick={handleNext}
                      disabled={!canProceed()}
                      className="inline-flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary/90 text-black font-semibold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {t('Weiter', 'Next')}
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleSubmit}
                      disabled={isSubmitting || !canProceed()}
                      className="inline-flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary/90 text-black font-semibold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          {t('Wird gesendet...', 'Submitting...')}
                        </>
                      ) : (
                        <>
                          {t('Anzeige absenden', 'Submit Ad')}
                          <Check className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </PageLayout>
  );
}
