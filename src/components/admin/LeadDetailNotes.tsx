import { useState } from 'react';
import { updateLeadNotes } from '@/lib/database';
import { Textarea } from '@/components/ui/textarea';
import type { Lead, LeadWithService } from '@/lib/database';
import { useLanguage } from '@/contexts/LanguageContext';

interface LeadDetailNotesProps {
  lead: Lead | LeadWithService;
  onUpdate: () => void;
}

export default function LeadDetailNotes({ lead, onUpdate }: LeadDetailNotesProps) {
  const { t } = useLanguage();
  const [notes, setNotes] = useState(lead.admin_notes || '');
  const [saving, setSaving] = useState(false);

  const handleSaveNotes = async () => {
    setSaving(true);
    try {
      await updateLeadNotes(lead.id, notes);
      alert(t('✅ Notizen gespeichert', '✅ Notes saved'));
      onUpdate();
    } catch (error) {
      console.error('Error saving notes:', error);
      alert(t('❌ Fehler beim Speichern', '❌ Error saving'));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-card backdrop-blur-md border border-border rounded-2xl p-6">
      <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
        <span className="text-xl">📋</span>
        {t('Admin-Notizen', 'Admin Notes')}
      </h2>
      <Textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder={t('Interne Notizen zu diesem Lead...', 'Internal notes about this lead...')}
        rows={4}
        className="mb-3 resize-none"
      />
      <button
        onClick={handleSaveNotes}
        disabled={saving}
        className="w-full px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground font-medium rounded-lg transition-all disabled:opacity-50"
      >
        {saving ? t('Wird gespeichert...', 'Saving...') : t('Notizen speichern', 'Save Notes')}
      </button>
    </div>
  );
}
