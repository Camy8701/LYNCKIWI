import PageLayout from "@/components/PageLayout";
import { AlertCircle } from "lucide-react";

const Terms = () => {

  return (
    <PageLayout>
      <div className="px-4 sm:px-6 lg:px-12 py-12">
        <div className="glass-card rounded-3xl p-8 lg:p-12 max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl lg:text-6xl tracking-tight text-foreground font-serif font-normal mb-6">
            {"Terms & Conditions"}
          </h1>

          <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-6 mb-8">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-6 h-6 text-amber-400 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-lg font-semibold text-amber-300 mb-2">
                  {"Legal Notice"}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {"This page requires real legal content. Please consult a lawyer for legally compliant terms and conditions."}
                </p>
              </div>
            </div>
          </div>

          <div className="prose prose-invert max-w-none">
            <p className="text-muted-foreground leading-relaxed">
              {"[Placeholder: Your complete terms and conditions covering all relevant aspects of the business relationship would be here.]"}
            </p>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default Terms;
