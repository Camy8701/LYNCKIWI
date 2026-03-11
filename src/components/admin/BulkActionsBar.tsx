import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { bulkUpdateLeadStatus, getMatchingCompaniesForLead, assignLeadToCompanies } from '@/lib/database';
import { getCurrentUser } from '@/lib/auth';
import { exportLeadsToCSV, generateExportFilename } from '@/lib/exportUtils';
import type { LeadWithService, Company } from '@/lib/database';
import { useLanguage } from '@/contexts/LanguageContext';

interface BulkActionsBarProps {
  selectedLeads: LeadWithService[];
  onClearSelection: () => void;
  onUpdate: () => void;
}

export default function BulkActionsBar({ selectedLeads, onClearSelection, onUpdate }: BulkActionsBarProps) {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [showStatusMenu, setShowStatusMenu] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [matchingCompanies, setMatchingCompanies] = useState<Company[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<string>('');

  const handleBulkStatusUpdate = async (newStatus: 'new' | 'contacted' | 'converted') => {
    setLoading(true);
    try {
      const leadIds = selectedLeads.map(lead => lead.id);
      await bulkUpdateLeadStatus(leadIds, newStatus);
      alert(t(`✅ ${selectedLeads.length} Leads aktualisiert`, `✅ ${selectedLeads.length} leads updated`));
      setShowStatusMenu(false);
      onClearSelection();
      onUpdate();
    } catch (error) {
      console.error('Error updating leads:', error);
      alert(t('❌ Fehler beim Aktualisieren', '❌ Error updating'));
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAssignModal = async () => {
    setLoading(true);
    setShowAssignModal(true);
    
    // Get matching companies for the first lead (as a reference)
    // In a real scenario, you might want to find companies that match ALL selected leads
    try {
      const firstLead = selectedLeads[0];
      const companies = await getMatchingCompaniesForLead(firstLead.id);
      setMatchingCompanies(companies);
    } catch (error) {
      console.error('Error loading companies:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBulkAssign = async () => {
    if (!selectedCompany) {
      alert(t('Bitte wählen Sie ein Unternehmen aus', 'Please select a company'));
      return;
    }

    setLoading(true);
    try {
      const user = await getCurrentUser();
      const leadIds = selectedLeads.map(lead => lead.id);
      
      // Assign each lead to the selected company
      for (const leadId of leadIds) {
        await assignLeadToCompanies(leadId, [selectedCompany], user?.email || 'admin');
      }
      
      alert(t(`✅ ${selectedLeads.length} Leads zugewiesen`, `✅ ${selectedLeads.length} leads assigned`));
      setShowAssignModal(false);
      setSelectedCompany('');
      onClearSelection();
      onUpdate();
    } catch (error) {
      console.error('Error assigning leads:', error);
      alert(t('❌ Fehler beim Zuweisen', '❌ Error assigning'));
    } finally {
      setLoading(false);
    }
  };

  const handleExport = () => {
    const filename = generateExportFilename('leads-bulk-export');
    exportLeadsToCSV(selectedLeads, filename);
    alert(t(`✅ ${selectedLeads.length} Leads exportiert`, `✅ ${selectedLeads.length} leads exported`));
  };

  return (
    <>
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
        <div className="bg-card border-2 border-primary shadow-2xl rounded-2xl p-4 flex items-center gap-4 min-w-[500px]">
          <div className="flex items-center gap-2 text-sm">
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
              <span className="text-primary font-semibold">{selectedLeads.length}</span>
            </div>
            <span className="text-foreground font-medium">
              {t('Lead(s) ausgewählt', 'Lead(s) selected')}
            </span>
          </div>

          <div className="flex-1 flex items-center gap-2">
            {/* Status Update */}
            <div className="relative">
              <button
                onClick={() => setShowStatusMenu(!showStatusMenu)}
                disabled={loading}
                className="px-4 py-2 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 text-sm font-medium rounded-lg transition-all disabled:opacity-50 flex items-center gap-2"
              >
                <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="3"/>
                  <path d="M12 1v6m0 6v6m-8-7h6m6 0h6"/>
                </svg>
                {t('Status ändern', 'Change Status')}
              </button>

              {showStatusMenu && (
                <div className="absolute bottom-full mb-2 left-0 bg-card border border-border rounded-lg shadow-lg overflow-hidden min-w-[180px]">
                  <button
                    onClick={() => handleBulkStatusUpdate('new')}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-muted transition-colors"
                  >
                    🟡 {t('Neu', 'New')}
                  </button>
                  <button
                    onClick={() => handleBulkStatusUpdate('contacted')}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-muted transition-colors"
                  >
                    🔵 {t('Kontaktiert', 'Contacted')}
                  </button>
                  <button
                    onClick={() => handleBulkStatusUpdate('converted')}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-muted transition-colors"
                  >
                    🟢 {t('Umgewandelt', 'Converted')}
                  </button>
                </div>
              )}
            </div>

            {/* Assign */}
            <button
              onClick={handleOpenAssignModal}
              disabled={loading}
              className="px-4 py-2 bg-primary/10 hover:bg-primary/20 text-primary text-sm font-medium rounded-lg transition-all disabled:opacity-50 flex items-center gap-2"
            >
              <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <line x1="19" y1="8" x2="19" y2="14"/>
                <line x1="22" y1="11" x2="16" y2="11"/>
              </svg>
              {t('Zuweisen', 'Assign')}
            </button>

            {/* Export */}
            <button
              onClick={handleExport}
              className="px-4 py-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 text-sm font-medium rounded-lg transition-all flex items-center gap-2"
            >
              <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="7 10 12 15 17 10"/>
                <line x1="12" y1="15" x2="12" y2="3"/>
              </svg>
              {t('Exportieren', 'Export')}
            </button>
          </div>

          {/* Clear Selection */}
          <button
            onClick={onClearSelection}
            className="p-2 hover:bg-muted rounded-lg transition-all"
            title={t('Auswahl aufheben', 'Clear selection')}
          >
            <svg className="w-5 h-5 text-muted-foreground" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Bulk Assign Modal */}
      {showAssignModal && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50" 
          onClick={() => setShowAssignModal(false)}
        >
          <div 
            className="bg-card border border-border rounded-2xl max-w-md w-full p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-foreground">
                {t('Leads zuweisen', 'Assign Leads')}
              </h3>
              <button
                onClick={() => setShowAssignModal(false)}
                className="p-2 hover:bg-muted rounded-lg transition-all"
              >
                <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"/>
                  <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>

            <p className="text-sm text-muted-foreground mb-4">
              {t(`${selectedLeads.length} Leads einem Unternehmen zuweisen`, `Assign ${selectedLeads.length} leads to a company`)}
            </p>

            {loading ? (
              <div className="text-center py-8 text-muted-foreground">
                {t('Lade Unternehmen...', 'Loading companies...')}
              </div>
            ) : matchingCompanies.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-5xl mb-4">🔍</div>
                <p className="text-sm text-muted-foreground">
                  {t('Keine passenden Unternehmen gefunden', 'No matching companies found')}
                </p>
              </div>
            ) : (
              <>
                <select
                  value={selectedCompany}
                  onChange={(e) => setSelectedCompany(e.target.value)}
                  className="w-full bg-background border border-border rounded-lg px-4 py-3 text-foreground mb-4 focus:outline-none focus:ring-2 focus:ring-primary/50"
                >
                  <option value="">{t('Unternehmen auswählen...', 'Select company...')}</option>
                  {matchingCompanies.map(company => (
                    <option key={company.id} value={company.id}>
                      {company.name}
                    </option>
                  ))}
                </select>

                <div className="flex gap-3">
                  <button
                    onClick={handleBulkAssign}
                    disabled={!selectedCompany || loading}
                    className="flex-1 px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground font-medium rounded-lg transition-all disabled:opacity-50"
                  >
                    {loading ? t('Wird zugewiesen...', 'Assigning...') : t('Zuweisen', 'Assign')}
                  </button>
                  <button
                    onClick={() => setShowAssignModal(false)}
                    className="px-4 py-2 bg-muted hover:bg-muted/80 text-foreground rounded-lg transition-all"
                  >
                    {t('Abbrechen', 'Cancel')}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
