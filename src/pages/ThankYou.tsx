import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { getLeadById } from '@/lib/database';
import PageLayout from '@/components/PageLayout';
import { CheckCircle2, Home, ArrowRight, Phone } from 'lucide-react';
import type { LeadWithService } from '@/lib/database';
import { SEO } from '@/lib/seo';

export default function ThankYou() {
  const [searchParams] = useSearchParams();
  const { language, t } = useLanguage();
  const [lead, setLead] = useState<LeadWithService | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadLead() {
      const leadId = searchParams.get('lead_id');
      
      if (leadId) {
        try {
          const leadData = await getLeadById(leadId);
          setLead(leadData);
        } catch (error) {
          console.error('Lead not found:', error);
        }
      }
      setLoading(false);
    }

    loadLead();
  }, [searchParams]);

  return (
    <PageLayout>
      <SEO
        title={t('Vielen Dank für Ihre Anfrage!', 'Thank you for your request!')}
        description={t('Ihre Anfrage wurde erfolgreich übermittelt', 'Your request has been successfully submitted')}
        canonicalUrl="/danke"
        noindex={true}
      />
      <main className="flex-1 overflow-y-auto">
        <div className="min-h-screen flex items-center justify-center px-4 py-16">
          <div className="max-w-2xl w-full">
            {/* Success Card */}
            <div className="bg-card backdrop-blur-md border border-border rounded-3xl p-8 md:p-12 text-center">
              {/* Success Icon */}
              <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-10 h-10 text-primary" />
              </div>
              
              {/* Headline */}
              <h1 className="text-3xl md:text-4xl font-instrument-serif text-foreground mb-4">
                {t('Vielen Dank für Ihre Anfrage!', 'Thank you for your request!')}
              </h1>
              
              <p className="text-lg text-muted-foreground mb-8">
                {t('Ihre Anfrage wurde erfolgreich übermittelt', 'Your request has been successfully submitted')}
              </p>
              
              {/* Reference Number */}
              {!loading && lead && (
                <p className="text-sm text-muted-foreground mb-8">
                  {t('Ihre Referenznummer:', 'Your reference number:')}{' '}
                  <span className="font-mono text-primary">#{lead.id.slice(0, 8)}</span>
                </p>
              )}
              
              {/* Timeline Box */}
              <div className="bg-background/50 border border-border rounded-2xl p-6 mb-8 text-left">
                <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-primary" />
                  {t('Was passiert jetzt?', 'What happens now?')}
                </h2>
                
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <span className="flex-shrink-0 text-2xl">1️⃣</span>
                    <div>
                      <p className="text-foreground font-medium">
                        {t('Ihre Anfrage wurde an geprüfte Fachleute gesendet', 'Your request has been sent to verified professionals')}
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        {t('Handwerker in Ihrer Region erhalten Ihre Projektdetails', 'Contractors in your region receive your project details')}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex gap-3">
                    <span className="flex-shrink-0 text-2xl">2️⃣</span>
                    <div>
                      <p className="text-foreground font-medium">
                        {t('Sie werden in Kürze kontaktiert', 'You will be contacted shortly')}
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        {t('Erwarten Sie Anrufe oder SMS innerhalb von 24 Stunden', 'Expect calls or SMS within 24 hours')}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex gap-3">
                    <span className="flex-shrink-0 text-2xl">3️⃣</span>
                    <div>
                      <p className="text-foreground font-medium">
                        {t('Vergleichen Sie Angebote und wählen Sie das beste', 'Compare quotes and choose the best')}
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        {t('Keine Verpflichtung - Sie entscheiden frei', 'No obligation - you decide freely')}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 pt-6 border-t border-border bg-amber-500/10 -mx-6 -mb-6 px-6 py-4 rounded-b-2xl">
                  <p className="text-sm text-amber-300 flex items-center gap-2">
                    <Phone className="w-5 h-5" />
                    <span className="font-semibold">{t('Tipp:', 'Tip:')}</span>
                    {t('Bitte halten Sie Ihr Telefon bereit! Die ersten Fachleute melden sich sehr schnell.', 'Please keep your phone ready! The first professionals will contact you very quickly.')}
                  </p>
                </div>
              </div>
              
              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link 
                  to="/"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-all"
                >
                  <Home className="w-5 h-5" />
                  {t('Zurück zur Startseite', 'Back to homepage')}
                </Link>
                
                <Link 
                  to="/#services"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition-all"
                >
                  {t('Weitere Dienstleistungen', 'More services')}
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </PageLayout>
  );
}
