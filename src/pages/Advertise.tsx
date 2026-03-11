import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import PageLayout from '@/components/PageLayout';
import { Eye, Target, Wallet, Check, ArrowRight, Clock, AlertCircle } from 'lucide-react';
import { AD_PRICING, MAX_SLOTS, getAvailableSlotsCount, getNextAvailableSlotDate, joinWaitlist } from '@/lib/ads';
import { SEO } from '@/lib/seo';

// FAQ Component
function FAQ({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-white/[0.06] py-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between text-left"
      >
        <span className="text-foreground font-medium">{question}</span>
        <span className={`text-primary transition-transform ${isOpen ? 'rotate-45' : ''}`}>+</span>
      </button>
      {isOpen && (
        <p className="mt-3 text-muted-foreground text-sm pr-8">{answer}</p>
      )}
    </div>
  );
}

// Pricing Card Component
function PricingCard({
  duration,
  price,
  pricePerMonth,
  savings,
  features,
  popular,
}: {
  duration: string;
  price: string;
  pricePerMonth: string;
  savings?: string;
  features: string[];
  popular?: boolean;
}) {
  return (
    <div className={`relative bg-white/[0.03] border rounded-xl p-6 text-center ${popular ? 'border-primary ring-2 ring-primary/20' : 'border-white/[0.06]'}`}>
      {popular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-black text-[10px] font-bold px-3 py-1 rounded-full uppercase">
          Beliebt
        </div>
      )}
      <div className="text-foreground font-semibold mb-2">{duration}</div>
      <div className="text-3xl font-bold text-foreground mb-1">{price}</div>
      <div className="text-muted-foreground text-sm mb-3">{pricePerMonth}</div>
      {savings && (
        <div className="text-primary text-sm font-medium mb-4">{savings}</div>
      )}
      <ul className="text-left text-sm text-muted-foreground space-y-2">
        {features.map((feature, i) => (
          <li key={i} className="flex items-center gap-2">
            <Check className="w-4 h-4 text-primary flex-shrink-0" />
            {feature}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Advertise() {
  const { t, language } = useLanguage();
  const [availableSlots, setAvailableSlots] = useState<number>(7);
  const [nextAvailableDate, setNextAvailableDate] = useState<Date | null>(null);
  const [loading, setLoading] = useState(true);
  const [showWaitlistForm, setShowWaitlistForm] = useState(false);
  const [waitlistForm, setWaitlistForm] = useState({
    company_name: '',
    email: '',
    phone: '',
    industry: '',
  });
  const [submittingWaitlist, setSubmittingWaitlist] = useState(false);
  const [waitlistSuccess, setWaitlistSuccess] = useState(false);

  useEffect(() => {
    async function loadSlotData() {
      try {
        const [slots, nextDate] = await Promise.all([
          getAvailableSlotsCount(),
          getNextAvailableSlotDate(),
        ]);
        setAvailableSlots(slots);
        setNextAvailableDate(nextDate);
      } catch (error) {
        console.error('Error loading slot data:', error);
      } finally {
        setLoading(false);
      }
    }

    loadSlotData();
  }, []);

  const handleWaitlistSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingWaitlist(true);

    try {
      await joinWaitlist(waitlistForm);
      setWaitlistSuccess(true);
    } catch (error) {
      console.error('Error joining waitlist:', error);
      alert(t('Fehler beim Beitreten zur Warteliste', 'Error joining waitlist'));
    } finally {
      setSubmittingWaitlist(false);
    }
  };

  const slotsAreFull = availableSlots === 0;

  return (
    <PageLayout>
      <SEO
        title={t('Werben bei Lynck Services', 'Advertise with Lynck Services')}
        description={t(
          'Erreichen Sie tausende Hausbesitzer auf der Suche nach Home Services. Ab 225€/Monat.',
          'Reach thousands of homeowners looking for home services. From €225/month.'
        )}
        canonicalUrl="/advertise"
      />

      <main className="flex-1 overflow-y-auto">
        <div className="min-h-screen p-6 md:p-12">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-serif text-foreground mb-4">
                {t('Werben Sie bei Lynck Services', 'Advertise with Lynck Services')}
              </h1>
              <p className="text-muted-foreground text-lg">
                {t(
                  'Erreichen Sie tausende Hausbesitzer auf der Suche nach Home Services',
                  'Reach thousands of homeowners looking for home services'
                )}
              </p>
            </div>

            {/* Slots Full Warning */}
            {slotsAreFull && (
              <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-2xl p-6 mb-12 text-center">
                <AlertCircle className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-foreground mb-2">
                  {t('Alle Werbeplätze sind belegt', 'All advertising slots are full')}
                </h2>
                <p className="text-muted-foreground mb-4">
                  {nextAvailableDate && (
                    <>
                      {t('Der nächste Platz wird voraussichtlich am', 'The next slot will be available on')}{' '}
                      <span className="text-primary font-semibold">
                        {nextAvailableDate.toLocaleDateString(language === 'de' ? 'de-DE' : 'en-US', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                        })}
                      </span>{' '}
                      {t('frei.', 'available.')}
                    </>
                  )}
                </p>
                <button
                  onClick={() => setShowWaitlistForm(true)}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary/90 text-black font-semibold rounded-lg transition-all"
                >
                  {t('Auf Warteliste setzen', 'Join Waitlist')}
                </button>
              </div>
            )}

            {/* Benefits */}
            <div className="grid md:grid-cols-3 gap-6 mb-12">
              <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-6">
                <Eye className="w-10 h-10 text-primary mb-4" />
                <h3 className="text-foreground font-semibold mb-2">
                  {t('Hohe Sichtbarkeit', 'High Visibility')}
                </h3>
                <p className="text-muted-foreground text-sm">
                  {t(
                    'Über 10.000 monatliche Besucher sehen Ihre Anzeige',
                    'Over 10,000 monthly visitors will see your ad'
                  )}
                </p>
              </div>

              <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-6">
                <Target className="w-10 h-10 text-primary mb-4" />
                <h3 className="text-foreground font-semibold mb-2">
                  {t('Zielgruppe', 'Target Audience')}
                </h3>
                <p className="text-muted-foreground text-sm">
                  {t(
                    'Erreichen Sie Kunden, die aktiv nach Services suchen',
                    'Reach customers actively looking for services'
                  )}
                </p>
              </div>

              <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-6">
                <Wallet className="w-10 h-10 text-primary mb-4" />
                <h3 className="text-foreground font-semibold mb-2">
                  {t('Faire Preise', 'Fair Prices')}
                </h3>
                <p className="text-muted-foreground text-sm">
                  {t(
                    'Ab €225/Monat bei Jahresbuchung, keine versteckten Kosten',
                    'From €225/month with annual booking, no hidden costs'
                  )}
                </p>
              </div>
            </div>

            {/* Pricing */}
            <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-8 mb-12">
              <h2 className="text-2xl font-semibold text-foreground mb-6 text-center">
                {t('Preise & Pakete', 'Pricing & Packages')}
              </h2>

              <div className="grid md:grid-cols-4 gap-4 mb-6">
                <PricingCard
                  duration={t('1 Monat', '1 Month')}
                  price="€300"
                  pricePerMonth={t('€300/Monat', '€300/month')}
                  features={[t('Monatlich kündbar', 'Cancel monthly'), t('Keine Mindestlaufzeit', 'No minimum term')]}
                />

                <PricingCard
                  duration={t('3 Monate', '3 Months')}
                  price="€810"
                  pricePerMonth={t('€270/Monat', '€270/month')}
                  savings={t('Sparen Sie 10%', 'Save 10%')}
                  features={[t('3 Monate Laufzeit', '3 months term'), t('€90 gespart', '€90 saved')]}
                />

                <PricingCard
                  duration={t('6 Monate', '6 Months')}
                  price="€1.500"
                  pricePerMonth={t('€250/Monat', '€250/month')}
                  savings={t('Sparen Sie 17%', 'Save 17%')}
                  popular={true}
                  features={[t('6 Monate Laufzeit', '6 months term'), t('€300 gespart', '€300 saved')]}
                />

                <PricingCard
                  duration={t('12 Monate', '12 Months')}
                  price="€2.700"
                  pricePerMonth={t('€225/Monat', '€225/month')}
                  savings={t('Sparen Sie 25%', 'Save 25%')}
                  features={[t('12 Monate Laufzeit', '12 months term'), t('€900 gespart', '€900 saved')]}
                />
              </div>

              {!slotsAreFull && (
                <p className="text-center text-muted-foreground text-sm">
                  <Clock className="w-4 h-4 inline mr-1" />
                  {t('Nur noch', 'Only')}{' '}
                  <strong className="text-primary">{availableSlots} {t('von', 'of')} {MAX_SLOTS}</strong>{' '}
                  {t('Werbeplätze verfügbar', 'advertising slots available')}
                </p>
              )}
            </div>

            {/* CTA */}
            {!slotsAreFull && (
              <div className="text-center mb-16">
                <Link
                  to="/advertise/create"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-primary hover:bg-primary/90 text-black font-semibold rounded-lg transition-all text-lg hover:scale-105"
                >
                  {t('Jetzt Anzeige erstellen', 'Create Ad Now')}
                  <ArrowRight className="w-5 h-5" />
                </Link>

                <p className="text-muted-foreground text-sm mt-4">
                  {t('Erstellen Sie Ihre Anzeige in unter 5 Minuten', 'Create your ad in under 5 minutes')}
                </p>
              </div>
            )}

            {/* FAQ */}
            <div className="mt-16">
              <h2 className="text-2xl font-semibold text-foreground mb-6">
                {t('Häufig gestellte Fragen', 'Frequently Asked Questions')}
              </h2>

              <FAQ
                question={t('Wie schnell geht meine Anzeige live?', 'How fast will my ad go live?')}
                answer={t(
                  'Nach Zahlungseingang prüfen wir Ihre Anzeige innerhalb von 24 Stunden. Nach Freigabe ist sie sofort sichtbar.',
                  'After payment, we review your ad within 24 hours. Once approved, it will be visible immediately.'
                )}
              />

              <FAQ
                question={t('Kann ich meine Anzeige jederzeit ändern?', 'Can I change my ad anytime?')}
                answer={t(
                  'Ja, Sie können Logo, Text und Link jederzeit aktualisieren. Änderungen werden nach erneuter Prüfung übernommen.',
                  'Yes, you can update logo, text, and link at any time. Changes will be applied after re-review.'
                )}
              />

              <FAQ
                question={t('Wie kann ich kündigen?', 'How can I cancel?')}
                answer={t(
                  'Bei monatlicher Buchung können Sie jederzeit zum Monatsende kündigen. Bei längeren Laufzeiten endet die Anzeige automatisch.',
                  'With monthly booking, you can cancel at any time at the end of the month. For longer terms, the ad ends automatically.'
                )}
              />

              <FAQ
                question={t('Erhalte ich einen Performance-Report?', 'Do I receive a performance report?')}
                answer={t(
                  'Ja, Sie erhalten monatlich einen detaillierten Report mit Impressions, Klicks und Click-Through-Rate.',
                  'Yes, you receive a monthly detailed report with impressions, clicks, and click-through rate.'
                )}
              />

              <FAQ
                question={t('Wo erscheint meine Anzeige?', 'Where will my ad appear?')}
                answer={t(
                  'Auf mobilen Geräten erscheint Ihre Anzeige in einem Karussell oben auf der Seite. Auf Desktop-Geräten in einer Sidebar links.',
                  'On mobile devices, your ad appears in a carousel at the top of the page. On desktop devices, in a sidebar on the left.'
                )}
              />
            </div>
          </div>
        </div>

        {/* Waitlist Modal */}
        {showWaitlistForm && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-card border border-border rounded-2xl p-8 max-w-md w-full">
              {waitlistSuccess ? (
                <div className="text-center">
                  <div className="text-5xl mb-4">✓</div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    {t('Sie sind auf der Warteliste!', "You're on the waitlist!")}
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    {t(
                      'Wir benachrichtigen Sie, sobald ein Platz frei wird.',
                      'We will notify you as soon as a slot becomes available.'
                    )}
                  </p>
                  <button
                    onClick={() => {
                      setShowWaitlistForm(false);
                      setWaitlistSuccess(false);
                    }}
                    className="px-6 py-3 bg-primary hover:bg-primary/90 text-black font-semibold rounded-lg transition-all"
                  >
                    {t('Schließen', 'Close')}
                  </button>
                </div>
              ) : (
                <>
                  <h3 className="text-xl font-semibold text-foreground mb-4">
                    {t('Auf Warteliste setzen', 'Join the Waitlist')}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-6">
                    {t(
                      'Wir benachrichtigen Sie per E-Mail, sobald ein Werbeplatz frei wird.',
                      'We will notify you by email as soon as an advertising slot becomes available.'
                    )}
                  </p>

                  <form onSubmit={handleWaitlistSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1">
                        {t('Firmenname', 'Company Name')} *
                      </label>
                      <input
                        type="text"
                        required
                        value={waitlistForm.company_name}
                        onChange={(e) => setWaitlistForm({ ...waitlistForm, company_name: e.target.value })}
                        className="w-full bg-background border border-border rounded-lg px-4 py-2 text-foreground"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1">
                        {t('E-Mail', 'Email')} *
                      </label>
                      <input
                        type="email"
                        required
                        value={waitlistForm.email}
                        onChange={(e) => setWaitlistForm({ ...waitlistForm, email: e.target.value })}
                        className="w-full bg-background border border-border rounded-lg px-4 py-2 text-foreground"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1">
                        {t('Telefon', 'Phone')}
                      </label>
                      <input
                        type="tel"
                        value={waitlistForm.phone}
                        onChange={(e) => setWaitlistForm({ ...waitlistForm, phone: e.target.value })}
                        className="w-full bg-background border border-border rounded-lg px-4 py-2 text-foreground"
                      />
                    </div>

                    <div className="flex gap-3 mt-6">
                      <button
                        type="button"
                        onClick={() => setShowWaitlistForm(false)}
                        className="flex-1 px-4 py-2 bg-background border border-border text-foreground rounded-lg hover:bg-muted transition-all"
                      >
                        {t('Abbrechen', 'Cancel')}
                      </button>
                      <button
                        type="submit"
                        disabled={submittingWaitlist}
                        className="flex-1 px-4 py-2 bg-primary hover:bg-primary/90 text-black font-semibold rounded-lg transition-all disabled:opacity-50"
                      >
                        {submittingWaitlist ? t('Senden...', 'Submitting...') : t('Eintragen', 'Join')}
                      </button>
                    </div>
                  </form>
                </>
              )}
            </div>
          </div>
        )}
      </main>
    </PageLayout>
  );
}
