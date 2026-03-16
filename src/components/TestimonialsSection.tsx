import { Star } from "lucide-react";

const getColorClasses = (color: string) => {
  const colorMap: Record<string, { bg: string; text: string; metric: string }> = {
    emerald: { bg: 'bg-emerald-500/20', text: 'text-emerald-300', metric: 'text-emerald-400' },
    amber: { bg: 'bg-amber-500/20', text: 'text-amber-300', metric: 'text-amber-400' },
    sky: { bg: 'bg-sky-500/20', text: 'text-sky-300', metric: 'text-sky-400' },
    red: { bg: 'bg-red-500/20', text: 'text-red-300', metric: 'text-red-400' },
    violet: { bg: 'bg-violet-500/20', text: 'text-violet-300', metric: 'text-violet-400' },
    teal: { bg: 'bg-teal-500/20', text: 'text-teal-300', metric: 'text-teal-400' }
  };
  return colorMap[color] || colorMap.emerald;
};

const testimonials = [
  {
    name: "Thomas Müller",
    roleDe: "Hausbesitzer, Berlin",
    roleEn: "Homeowner, Berlin",
    initials: "TM",
    color: "emerald",
    rating: 5,
    textDe: "Innerhalb von 30 Minuten wurde ich von einem Spezialisten kontaktiert. Der Service war super schnell und völlig unkompliziert!",
    textEn: "Within 30 minutes I was contacted by a specialist. The service was super fast and completely uncomplicated!",
    metricDe: "Heizung repariert in 2 Tagen",
    metricEn: "Heating repaired in 2 days",
    metricColor: "emerald"
  },
  {
    name: "Anna Klein",
    roleDe: "Eigenheimbesitzerin, München",
    roleEn: "Homeowner, Munich",
    initials: "AK",
    color: "amber",
    rating: 5,
    textDe: "Die Solaranlage wurde professionell installiert. Dank KYSS Vision habe ich beim Vergleich 15% gespart!",
    textEn: "The solar system was professionally installed. Thanks to KYSS Vision I saved 15% by comparing!",
    metricDe: "15% Kostenersparnis",
    metricEn: "15% Cost Savings",
    metricColor: "amber"
  },
  {
    name: "Michael Richter",
    roleDe: "Vermieter, Hamburg",
    roleEn: "Landlord, Hamburg",
    initials: "MR",
    color: "sky",
    rating: 5,
    textDe: "Als Vermieter nutze ich KYSS für alle meine Immobilien. Zuverlässige Handwerker, faire Preise, schnelle Abwicklung.",
    textEn: "As a landlord I use KYSS for all my properties. Reliable contractors, fair prices, fast processing.",
    metricDe: "12 Projekte erfolgreich",
    metricEn: "12 Projects Successful",
    metricColor: "sky"
  },
  {
    name: "Sarah Wagner",
    roleDe: "Hausbesitzerin, Stuttgart",
    roleEn: "Homeowner, Stuttgart",
    initials: "SW",
    color: "red",
    rating: 5,
    textDe: "Dach musste dringend repariert werden nach dem Sturm. Innerhalb von 2 Stunden hatte ich Angebote und am nächsten Tag war der Dachdecker da!",
    textEn: "Roof urgently needed repair after the storm. Within 2 hours I had quotes and the next day the roofer was there!",
    metricDe: "Notfall-Service in 24h",
    metricEn: "Emergency Service in 24h",
    metricColor: "red"
  },
  {
    name: "Lisa Schmidt",
    roleDe: "Eigenheimbesitzerin, Köln",
    roleEn: "Homeowner, Cologne",
    initials: "LS",
    color: "violet",
    rating: 5,
    textDe: "Elektriker gesucht für Smart Home Installation. Die Vermittlung war fair und professionell. Bin sehr zufrieden!",
    textEn: "Looking for electrician for smart home installation. The referral was fair and professional. Very satisfied!",
    metricDe: "Smart Home Installation",
    metricEn: "Smart Home Installation",
    metricColor: "violet"
  },
  {
    name: "Daniel Hoffmann",
    roleDe: "Hausbesitzer, Düsseldorf",
    roleEn: "Homeowner, Düsseldorf",
    initials: "DH",
    color: "teal",
    rating: 5,
    textDe: "Badezimmer komplett renoviert. Der Vergleich hat sich gelohnt – gespart und top Qualität bekommen!",
    textEn: "Bathroom completely renovated. The comparison was worth it - saved money and got top quality!",
    metricDe: "€2.400 gespart",
    metricEn: "€2,400 Saved",
    metricColor: "teal"
  }
];

const TestimonialsSection = () => {
  
  return (
    <section className="overflow-hidden glass-card rounded-3xl mt-24 mb-20 mx-4 md:mx-6 lg:mx-8">
      <div className="md:px-10 lg:px-14 pt-20 pr-6 pb-16 pl-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl md:text-5xl lg:text-6xl tracking-tight text-foreground font-serif font-normal">
            {"Successful Projects,"}
          </h2>
          <h3 className="text-4xl md:text-5xl lg:text-6xl tracking-tight text-muted-foreground font-serif font-normal mb-6">
            {"Satisfied Customers"}
          </h3>
          <p className="text-lg text-muted-foreground">
            {"Real experiences from homeowners who successfully completed their projects."}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => {
            const colors = getColorClasses(testimonial.color);
            return (
            <div key={index} className="bg-white/[0.03] backdrop-blur-sm border border-white/[0.06] rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-12 h-12 ${colors.bg} rounded-full flex items-center justify-center`}>
                  <span className={`text-sm font-semibold ${colors.text}`}>{testimonial.initials}</span>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">{testimonial.name}</h4>
                  <p className="text-sm text-muted-foreground">
                    {language === 'de' ? testimonial.roleDe : testimonial.roleEn}
                  </p>
                </div>
              </div>
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-foreground/90 text-sm leading-relaxed mb-4">
                {language === 'de' ? testimonial.textDe : testimonial.textEn}
              </p>
              <div className={`text-sm font-medium ${colors.metric}`}>
                {language === 'de' ? testimonial.metricDe : testimonial.metricEn}
              </div>
            </div>
            );
          })}
        </div>

        <div className="mt-16 bg-white/[0.03] backdrop-blur-sm border border-white/[0.06] rounded-2xl p-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-2xl md:text-3xl font-bold text-foreground mb-2">
                {"Hand-picked"}
              </div>
              <div className="text-muted-foreground text-sm">
                {"Professionals Among the Best"}
              </div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-foreground mb-2">4.8</div>
              <div className="text-muted-foreground text-sm">
                {"Average Rating"}
              </div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-foreground mb-2">1.500+</div>
              <div className="text-muted-foreground text-sm">
                {"Successful Projects"}
              </div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-foreground mb-2">24h</div>
              <div className="text-muted-foreground text-sm">
                {"Average Response Time"}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
