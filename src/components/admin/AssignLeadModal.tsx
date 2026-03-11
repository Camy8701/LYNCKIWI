import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMatchingCompanies, assignLeadToCompanies } from '@/lib/database';
import { getCurrentUser } from '@/lib/auth';
import type { Company } from '@/lib/database';

interface AssignLeadModalProps {
  leadId: string;
  onClose: () => void;
}

export default function AssignLeadModal({ leadId, onClose }: AssignLeadModalProps) {
  const navigate = useNavigate();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [selectedCompanies, setSelectedCompanies] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [assigning, setAssigning] = useState(false);
  
  useEffect(() => {
    async function loadCompanies() {
      try {
        const matching = await getMatchingCompanies(leadId);
        setCompanies(matching);
      } catch (error) {
        console.error('Error loading companies:', error);
      } finally {
        setLoading(false);
      }
    }
    
    loadCompanies();
  }, [leadId]);
  
  const handleAssign = async () => {
    if (selectedCompanies.length === 0) {
      alert('Bitte wählen Sie mindestens ein Unternehmen aus');
      return;
    }
    
    setAssigning(true);
    try {
      const user = await getCurrentUser();
      await assignLeadToCompanies(leadId, selectedCompanies, user?.email || 'admin');
      alert(`✅ Lead an ${selectedCompanies.length} Unternehmen zugewiesen`);
      onClose();
    } catch (error) {
      console.error('Error assigning lead:', error);
      alert('❌ Fehler beim Zuweisen');
    } finally {
      setAssigning(false);
    }
  };
  
  const toggleCompany = (companyId: string) => {
    setSelectedCompanies(prev =>
      prev.includes(companyId)
        ? prev.filter(id => id !== companyId)
        : [...prev, companyId]
    );
  };
  
  const totalCost = companies
    .filter(c => selectedCompanies.includes(c.id))
    .reduce((sum) => sum + 50, 0); // Assuming 50 EUR per lead
  
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50" onClick={onClose}>
      <div className="bg-card border border-border rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden flex flex-col" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="p-6 border-b border-border">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-2xl font-semibold text-foreground">
              Unternehmen zuweisen
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-muted rounded-lg transition-all"
            >
              <svg className="w-5 h-5 text-muted-foreground" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>
          <p className="text-sm text-muted-foreground">
            Wählen Sie Unternehmen aus, die diesen Lead erhalten sollen
          </p>
        </div>
        
        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="text-center py-12">
              <div className="text-muted-foreground">Lade passende Unternehmen...</div>
            </div>
          ) : companies.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-5xl mb-4">🔍</div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Keine passenden Unternehmen gefunden
              </h3>
              <p className="text-muted-foreground mb-6">
                Es gibt keine aktiven Unternehmen für diesen Service in dieser Stadt.
              </p>
              <button
                onClick={() => navigate('/admin/companies/new')}
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-lg transition-all"
              >
                Unternehmen hinzufügen
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {companies.map((company) => (
                <button
                  key={company.id}
                  type="button"
                  onClick={() => toggleCompany(company.id)}
                  className={`w-full flex items-center gap-4 p-4 rounded-lg border-2 transition-all text-left ${
                    selectedCompanies.includes(company.id)
                      ? 'border-primary bg-primary/10'
                      : 'border-border bg-background hover:border-primary/50'
                  }`}
                >
                  <div className="flex-shrink-0">
                    <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                      selectedCompanies.includes(company.id)
                        ? 'border-primary bg-primary'
                        : 'border-muted-foreground'
                    }`}>
                      {selectedCompanies.includes(company.id) && (
                        <svg className="w-3 h-3 text-primary-foreground" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                          <polyline points="20 6 9 17 4 12"/>
                        </svg>
                      )}
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-foreground mb-1">{company.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {company.phone} • {company.email}
                    </div>
                  </div>
                  <div className="text-primary font-semibold">
                    €50
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
        
        {/* Footer */}
        {companies.length > 0 && (
          <div className="p-6 border-t border-border">
            <div className="flex items-center justify-between mb-4">
              <div className="text-sm text-muted-foreground">
                Ausgewählt: {selectedCompanies.length} Unternehmen
              </div>
              <div className="text-xl font-bold text-foreground">
                Gesamt: €{totalCost}
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleAssign}
                disabled={assigning || selectedCompanies.length === 0}
                className="flex-1 px-6 py-3 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {assigning ? 'Wird zugewiesen...' : 'Zuweisen'}
              </button>
              <button
                onClick={onClose}
                className="px-6 py-3 bg-background border border-border text-muted-foreground hover:text-foreground rounded-lg transition-all"
              >
                Abbrechen
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
