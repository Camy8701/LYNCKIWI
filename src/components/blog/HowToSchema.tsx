import { Helmet } from "react-helmet";
import { CheckCircle } from "lucide-react";

export interface HowToStep {
  name: string;
  text: string;
  image?: string;
  url?: string;
}

interface HowToSchemaProps {
  name: string;
  description: string;
  totalTime?: string; // ISO 8601 duration format (e.g., "PT20M" for 20 minutes)
  estimatedCost?: {
    currency: string;
    value: string;
  };
  steps: HowToStep[];
  image?: string;
}

export const HowToSchema = ({ name, description, totalTime, estimatedCost, steps, image }: HowToSchemaProps) => {
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": name,
    "description": description,
    ...(image && { "image": image }),
    ...(totalTime && { "totalTime": totalTime }),
    ...(estimatedCost && { "estimatedCost": {
      "@type": "MonetaryAmount",
      "currency": estimatedCost.currency,
      "value": estimatedCost.value
    }}),
    "step": steps.map((step, index) => ({
      "@type": "HowToStep",
      "name": step.name,
      "text": step.text,
      "position": index + 1,
      ...(step.image && { "image": step.image }),
      ...(step.url && { "url": step.url })
    }))
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(schemaData)}
      </script>
    </Helmet>
  );
};

// Component to display How-To steps with schema
interface HowToSectionProps {
  name: string;
  description?: string;
  steps: HowToStep[];
  totalTime?: string;
  estimatedCost?: {
    currency: string;
    value: string;
  };
  image?: string;
}

export const HowToSection = ({ name, description, steps, totalTime, estimatedCost, image }: HowToSectionProps) => {
  return (
    <>
      <HowToSchema
        name={name}
        description={description || name}
        totalTime={totalTime}
        estimatedCost={estimatedCost}
        steps={steps}
        image={image}
      />
      <div className="my-12">
        <h2 className="text-3xl font-bold text-foreground mb-4">{name}</h2>
        {description && (
          <p className="text-muted-foreground mb-8 text-lg">{description}</p>
        )}

        {(totalTime || estimatedCost) && (
          <div className="flex gap-6 mb-8 text-sm">
            {totalTime && (
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">⏱️ Zeit:</span>
                <span className="font-medium text-foreground">{totalTime}</span>
              </div>
            )}
            {estimatedCost && (
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">💰 Kosten:</span>
                <span className="font-medium text-foreground">
                  {estimatedCost.value} {estimatedCost.currency}
                </span>
              </div>
            )}
          </div>
        )}

        <div className="space-y-6">
          {steps.map((step, index) => (
            <div
              key={index}
              className="flex gap-4 bg-card border border-border rounded-xl p-6 hover:border-primary/50 transition-colors"
            >
              <div className="flex-shrink-0">
                <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg">
                  {index + 1}
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-foreground mb-2">{step.name}</h3>
                <p className="text-muted-foreground leading-relaxed">{step.text}</p>
                {step.image && (
                  <img
                    src={step.image}
                    alt={step.name}
                    className="mt-4 rounded-lg w-full max-w-md"
                  />
                )}
              </div>
              <div className="flex-shrink-0">
                <CheckCircle className="w-6 h-6 text-primary/30" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};
