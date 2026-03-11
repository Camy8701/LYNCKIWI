import PageLayout from "@/components/PageLayout";
import { useLanguage } from "@/contexts/LanguageContext";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { servicesData } from "@/data/servicesData";

const QuoteRequest = () => {
  const { t, language } = useLanguage();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPropertyOwner, setIsPropertyOwner] = useState<string>("");
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    propertyType: "",
    service: "",
    specificServices: [] as string[],
    state: "",
    description: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Save quote request to Supabase database
      const { data, error } = await supabase
        .from('quote_requests')
        .insert([
          {
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            property_type: formData.propertyType,
            is_property_owner: isPropertyOwner,
            service: formData.service,
            specific_services: formData.specificServices.join(', '),
            state: formData.state,
            description: formData.description,
            status: 'pending'
          }
        ])
        .select();

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      console.log('Quote request saved successfully:', data);

      // Show success message
      toast({
        title: t("Anfrage gesendet", "Quote Request Sent"),
        description: t(
          "Vielen Dank für Ihre Anfrage. Wir werden uns innerhalb von 24 Stunden mit passenden Angeboten bei Ihnen melden.",
          "Thank you for your request. We will get back to you within 24 hours with matching quotes."
        )
      });

      // GTM Event Tracking
      if (typeof window !== 'undefined' && (window as any).dataLayer) {
        (window as any).dataLayer.push({
          event: 'quote_request_submit',
          form_type: 'quote_request',
          service: formData.service,
          property_type: formData.propertyType
        });
      }

      // Reset form
      setFormData({
        name: "",
        phone: "",
        email: "",
        propertyType: "",
        service: "",
        specificServices: [],
        state: "",
        description: ""
      });
      setIsPropertyOwner("");
    } catch (error) {
      console.error('Error submitting quote request:', error);

      // Show error with fallback option
      toast({
        title: t("Fehler", "Error"),
        description: t(
          "Ihre Anfrage konnte nicht gesendet werden. Bitte kontaktieren Sie uns direkt per E-Mail:",
          "Your request could not be sent. Please contact us directly via email:"
        ) + " info@lynckservices.de",
        variant: "destructive",
        duration: 10000
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSpecificServiceToggle = (serviceId: string) => {
    if (formData.specificServices.includes(serviceId)) {
      setFormData({
        ...formData,
        specificServices: formData.specificServices.filter(s => s !== serviceId)
      });
    } else {
      setFormData({
        ...formData,
        specificServices: [...formData.specificServices, serviceId]
      });
    }
  };

  // Get subcategories for selected service
  const selectedService = servicesData.find(s => s.slug === formData.service);
  const subcategories = selectedService?.subcategories || [];

  return (
    <PageLayout>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
              {t("Jetzt kostenlos Angebot anfordern", "Request Free Quote Now")}
            </h1>
            <p className="text-gray-300 text-lg">
              {t(
                "Füllen Sie das Formular aus und einer unserer Spezialisten wird Sie so schnell wie möglich kontaktieren.",
                "Fill out the form and one of our specialists will contact you as soon as possible."
              )}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="bg-black/60 backdrop-blur-sm rounded-2xl p-6 md:p-8 space-y-6">
            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-white text-sm font-medium mb-2">
                {t("Ihr vollständiger Name", "Your Full Name")} *
              </label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                placeholder={t("Max Mustermann", "John Doe")}
              />
            </div>

            {/* Phone */}
            <div>
              <label htmlFor="phone" className="block text-white text-sm font-medium mb-2">
                {t("Telefonnummer", "Phone Number")} *
              </label>
              <input
                type="tel"
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                required
                className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                placeholder={t("+49 151 12345678", "+49 151 12345678")}
              />
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-white text-sm font-medium mb-2">
                {t("E-Mail", "Email")} *
              </label>
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                placeholder={t("ihre.email@beispiel.de", "your.email@example.com")}
              />
            </div>

            {/* Property Owner */}
            <div>
              <label className="block text-white text-sm font-medium mb-3">
                {t("Sind Sie Eigentümer der Immobilie?", "Are you the property owner?")}
              </label>
              <div className="space-y-3">
                <label className="flex items-start gap-3 cursor-pointer group">
                  <input
                    type="radio"
                    name="propertyOwner"
                    value="owner"
                    checked={isPropertyOwner === "owner"}
                    onChange={(e) => setIsPropertyOwner(e.target.value)}
                    className="mt-1 w-5 h-5 text-primary bg-gray-800 border-gray-700 focus:ring-primary focus:ring-2"
                  />
                  <div>
                    <div className="text-white font-medium">
                      {t("Ja, ich bin Eigentümer", "Yes, I am the owner")}
                    </div>
                    <div className="text-gray-400 text-sm">
                      {t("Ich besitze die Immobilie", "I own the property")}
                    </div>
                  </div>
                </label>
                <label className="flex items-start gap-3 cursor-pointer group">
                  <input
                    type="radio"
                    name="propertyOwner"
                    value="renter"
                    checked={isPropertyOwner === "renter"}
                    onChange={(e) => setIsPropertyOwner(e.target.value)}
                    className="mt-1 w-5 h-5 text-primary bg-gray-800 border-gray-700 focus:ring-primary focus:ring-2"
                  />
                  <div>
                    <div className="text-white font-medium">
                      {t("Nein, ich bin Mieter", "No, I am a renter")}
                    </div>
                    <div className="text-gray-400 text-sm">
                      {t("Ich miete die Immobilie", "I rent the property")}
                    </div>
                  </div>
                </label>
              </div>
            </div>

            {/* Property Type */}
            <div>
              <label htmlFor="propertyType" className="block text-white text-sm font-medium mb-2">
                {t("Art der Immobilie", "Property Type")} *
              </label>
              <select
                id="propertyType"
                value={formData.propertyType}
                onChange={(e) => setFormData({ ...formData, propertyType: e.target.value })}
                required
                className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              >
                <option value="">{t("Immobilientyp auswählen...", "Select property type...")}</option>
                <option value="house">{t("Einfamilienhaus", "Single Family Home")}</option>
                <option value="apartment">{t("Wohnung", "Apartment")}</option>
                <option value="multi-family">{t("Mehrfamilienhaus", "Multi-Family Home")}</option>
                <option value="commercial">{t("Gewerbeimmobilie", "Commercial Property")}</option>
                <option value="other">{t("Sonstiges", "Other")}</option>
              </select>
            </div>

            {/* Service Selection */}
            <div>
              <label htmlFor="service" className="block text-white text-sm font-medium mb-2">
                {t("Service benötigt", "Service Needed")} *
              </label>
              <select
                id="service"
                value={formData.service}
                onChange={(e) => setFormData({ ...formData, service: e.target.value, specificServices: [] })}
                required
                className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              >
                <option value="">{t("Bitte wählen", "Please select")}</option>
                {servicesData.map((service) => (
                  <option key={service.id} value={service.slug}>
                    {language === 'de' ? service.nameDe : service.nameEn}
                  </option>
                ))}
              </select>
            </div>

            {/* Specific Services (Subcategories) */}
            {subcategories.length > 0 && (
              <div>
                <label className="block text-white text-sm font-medium mb-3">
                  {t("Spezifischer Service (Optional - mehrere wählbar)", "Specific Service (Optional - multiple choices)")}
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {subcategories.map((sub) => (
                    <label key={sub.id} className="flex items-center gap-3 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={formData.specificServices.includes(sub.id)}
                        onChange={() => handleSpecificServiceToggle(sub.id)}
                        className="w-5 h-5 text-primary bg-gray-800 border-gray-700 rounded focus:ring-primary focus:ring-2"
                      />
                      <span className="text-white text-sm">
                        {language === 'de' ? sub.nameDe : sub.nameEn}
                      </span>
                    </label>
                  ))}
                </div>
                <p className="text-gray-400 text-xs mt-2">
                  {t("Sie können mehrere Optionen auswählen", "You can select multiple options")}
                </p>
              </div>
            )}

            {/* State/Region */}
            <div>
              <label htmlFor="state" className="block text-white text-sm font-medium mb-2">
                {t("Bundesland", "State")} *
              </label>
              <select
                id="state"
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                required
                className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              >
                <option value="">{t("Bitte wählen", "Please select")}</option>
                <option value="baden-württemberg">Baden-Württemberg</option>
                <option value="bayern">Bayern</option>
                <option value="berlin">Berlin</option>
                <option value="brandenburg">Brandenburg</option>
                <option value="bremen">Bremen</option>
                <option value="hamburg">Hamburg</option>
                <option value="hessen">Hessen</option>
                <option value="mecklenburg-vorpommern">Mecklenburg-Vorpommern</option>
                <option value="niedersachsen">Niedersachsen</option>
                <option value="nordrhein-westfalen">Nordrhein-Westfalen</option>
                <option value="rheinland-pfalz">Rheinland-Pfalz</option>
                <option value="saarland">Saarland</option>
                <option value="sachsen">Sachsen</option>
                <option value="sachsen-anhalt">Sachsen-Anhalt</option>
                <option value="schleswig-holstein">Schleswig-Holstein</option>
                <option value="thüringen">Thüringen</option>
              </select>
            </div>

            {/* Additional Details */}
            <div>
              <label htmlFor="description" className="block text-white text-sm font-medium mb-2">
                {t("Zusätzliche Details (Optional)", "Additional Details (Optional)")}
              </label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
                className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all resize-none"
                placeholder={t(
                  "Bitte beschreiben Sie Ihr Projekt oder Ihre Anforderungen...",
                  "Please describe your project or requirements..."
                )}
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-4 px-6 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
              {isSubmitting
                ? t("Wird gesendet...", "Sending...")
                : t("Kostenlose Angebote erhalten", "Get Free Quotes")}
            </button>

            {/* Privacy Notice */}
            <p className="text-center text-gray-400 text-xs">
              {t(
                "100% kostenlos und unverbindlich. Wir geben Ihre Daten niemals weiter.",
                "100% free and non-binding. We never share your data."
              )}
            </p>
          </form>
        </div>
      </div>
    </PageLayout>
  );
};

export default QuoteRequest;
