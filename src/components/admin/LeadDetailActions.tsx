import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { updateLeadStatus, deleteLead } from '@/lib/database';
import type { Lead, LeadWithService } from '@/lib/database';
import AssignLeadModal from './AssignLeadModal';

interface LeadDetailActionsProps {
  lead: Lead | LeadWithService;
  onUpdate: () => void;
}

export default function LeadDetailActions({ lead, onUpdate }: LeadDetailActionsProps) {
  const navigate = useNavigate();
  const [status, setStatus] = useState(lead.status);
  const [updating, setUpdating] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);

  const handleCopyLead = async () => {
    const timelineText = 
      lead.timeline === 'sofort' ? 'Sofort / Notfall' :
      lead.timeline === 'diese_woche' ? 'Diese Woche' :
      lead.timeline === 'diesen_monat' ? 'Diesen Monat' : 'Flexibel';

    const service = 'service' in lead ? lead.service : null;
    const serviceName = service?.name || 'Unknown Service';

    const text = `🔥 NEUE ANFRAGE #${lead.id.slice(0, 8)}

👤 ${lead.name}
📞 ${lead.phone}
📧 ${lead.email || '—'}
📍 ${lead.city} ${lead.plz}

🔧 Service: ${serviceName}
⏰ ${timelineText}

📝 Beschreibung:
${lead.service_details}

⚡ JETZT ANRUFEN!`;

    try {
      await navigator.clipboard.writeText(text);
      alert('✅ Lead in Zwischenablage kopiert!');
    } catch (err) {
      alert('❌ Fehler beim Kopieren');
    }
  };

  const handleStatusChange = async (newStatus: 'new' | 'contacted' | 'converted') => {
    setUpdating(true);
    try {
      await updateLeadStatus(lead.id, newStatus);
      setStatus(newStatus);
      alert('✅ Status aktualisiert');
      onUpdate();
    } catch (error) {
      console.error('Error updating status:', error);
      alert('❌ Fehler beim Aktualisieren');
    } finally {
      setUpdating(false);
    }
  };

  const handleDeleteLead = async () => {
    if (!confirm('Sind Sie sicher, dass Sie diesen Lead löschen möchten? Diese Aktion kann nicht rückgängig gemacht werden.')) {
      return;
    }

    try {
      await deleteLead(lead.id);
      alert('✅ Lead gelöscht');
      navigate('/admin/leads');
    } catch (error) {
      console.error('Error deleting lead:', error);
      alert('❌ Fehler beim Löschen');
    }
  };

  return (
    <>
      <div className="space-y-3">
        {/* Assign Companies Button */}
        <button
          onClick={() => setShowAssignModal(true)}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-all"
        >
          <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
            <circle cx="9" cy="7" r="4"/>
            <line x1="19" y1="8" x2="19" y2="14"/>
            <line x1="22" y1="11" x2="16" y2="11"/>
          </svg>
          Unternehmen zuweisen
        </button>

        {/* Copy Button */}
        <button
        onClick={handleCopyLead}
        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-primary hover:bg-primary/90 text-primary-foreground font-medium rounded-lg transition-all"
      >
        <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
        </svg>
        Lead kopieren
      </button>

      {/* Status Change */}
      <div>
        <label className="block text-sm text-muted-foreground mb-2">
          Status ändern
        </label>
        <select
          value={status}
          onChange={(e) => handleStatusChange(e.target.value as any)}
          disabled={updating}
          className="w-full bg-background border border-border rounded-lg px-4 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
        >
          <option value="new">Neu</option>
          <option value="contacted">Kontaktiert</option>
          <option value="converted">Umgewandelt</option>
        </select>
      </div>

      {/* Delete Button */}
      <button
        onClick={handleDeleteLead}
        className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 rounded-lg transition-all text-sm"
      >
        <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="3 6 5 6 21 6"></polyline>
          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
        </svg>
        Lead löschen
      </button>
      </div>

      {/* Assign Modal */}
      {showAssignModal && (
        <AssignLeadModal 
          leadId={lead.id}
          onClose={() => {
            setShowAssignModal(false);
            onUpdate();
          }}
        />
      )}
    </>
  );
}
