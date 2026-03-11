import { useState } from 'react';
import { Link } from 'react-router-dom';
import { updateService } from '@/lib/database';
import type { Service } from '@/lib/database';
import { useLanguage } from '@/contexts/LanguageContext';

interface ServicesTableProps {
  services: Service[];
  onUpdate: () => void;
}

export default function ServicesTable({ services, onUpdate }: ServicesTableProps) {
  const { t } = useLanguage();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editPrice, setEditPrice] = useState<number>(0);
  
  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    try {
      await updateService(id, { is_active: !currentStatus });
      alert(t('✅ Status aktualisiert', '✅ Status updated'));
      onUpdate();
    } catch (error) {
      console.error('Error toggling service:', error);
      alert(t('❌ Fehler beim Aktualisieren', '❌ Error updating'));
    }
  };
  
  const handleSavePrice = async (id: string) => {
    try {
      await updateService(id, { lead_price_shared: editPrice });
      alert(t('✅ Preis aktualisiert', '✅ Price updated'));
      setEditingId(null);
      onUpdate();
    } catch (error) {
      console.error('Error updating price:', error);
      alert(t('❌ Fehler beim Aktualisieren', '❌ Error updating'));
    }
  };
  
  return (
    <div className="bg-card backdrop-blur-md border border-border rounded-2xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/50 border-b border-border">
            <tr>
              <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase">{t('Icon', 'Icon')}</th>
              <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase">{t('Name', 'Name')}</th>
              <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase">{t('Slug', 'Slug')}</th>
              <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase">{t('Preis pro Lead', 'Price per Lead')}</th>
              <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase">{t('Status', 'Status')}</th>
              <th className="text-right py-3 px-4 text-xs font-medium text-muted-foreground uppercase">{t('Aktionen', 'Actions')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {services.map((service) => (
              <tr key={service.id} className="hover:bg-muted/50 transition-colors">
                <td className="py-4 px-4">
                  <span className="text-3xl">{service.icon}</span>
                </td>
                <td className="py-4 px-4">
                  <div className="text-sm font-medium text-foreground">{service.name}</div>
                  <div className="text-xs text-muted-foreground">{service.name_en}</div>
                </td>
                <td className="py-4 px-4">
                  <span className="text-sm font-mono text-muted-foreground">{service.slug}</span>
                </td>
                <td className="py-4 px-4">
                  {editingId === service.id ? (
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        value={editPrice}
                        onChange={(e) => setEditPrice(Number(e.target.value))}
                        className="w-24 bg-background border border-border rounded px-2 py-1 text-foreground text-sm"
                      />
                      <button
                        onClick={() => handleSavePrice(service.id)}
                        className="p-1 text-primary hover:bg-primary/10 rounded"
                      >
                        ✓
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="p-1 text-red-400 hover:bg-red-500/10 rounded"
                      >
                        ✕
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        setEditingId(service.id);
                        setEditPrice(service.lead_price_shared);
                      }}
                      className="text-sm text-foreground hover:text-primary transition-colors"
                    >
                      €{service.lead_price_shared.toFixed(2)}
                    </button>
                  )}
                </td>
                <td className="py-4 px-4">
                  <button
                    onClick={() => handleToggleActive(service.id, service.is_active)}
                    className={`inline-flex px-3 py-1 rounded-full text-xs font-medium transition-all ${
                      service.is_active
                        ? 'bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20'
                        : 'bg-muted text-muted-foreground border border-border hover:bg-muted'
                    }`}
                  >
                    {service.is_active ? t('Aktiv', 'Active') : t('Inaktiv', 'Inactive')}
                  </button>
                </td>
                <td className="py-4 px-4 text-right">
                  <Link
                    to={`/${service.slug}`}
                    target="_blank"
                    className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {t('Vorschau', 'Preview')}
                    <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                      <polyline points="15 3 21 3 21 9"/>
                      <line x1="10" y1="14" x2="21" y2="3"/>
                    </svg>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
