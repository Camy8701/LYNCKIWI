import { Link } from 'react-router-dom';
import { deleteCompany } from '@/lib/database';
import type { Company, Service, City } from '@/lib/database';
import { useLanguage } from '@/contexts/LanguageContext';

interface CompaniesTableProps {
  companies: Company[];
  services: Service[];
  cities: City[];
  onUpdate: () => void;
}

export default function CompaniesTable({ companies, services, cities, onUpdate }: CompaniesTableProps) {
  const { t } = useLanguage();
  const getServiceNames = (serviceIds: string[]) => {
    return services
      .filter(s => serviceIds.includes(s.id))
      .map(s => `${s.icon} ${s.name}`);
  };
  
  const handleDelete = async (id: string, name: string) => {
    if (!confirm(t(`Möchten Sie "${name}" wirklich löschen?`, `Do you really want to delete "${name}"?`))) return;
    
    try {
      await deleteCompany(id);
      alert(t('✅ Unternehmen gelöscht', '✅ Company deleted'));
      onUpdate();
    } catch (error) {
      console.error('Error deleting company:', error);
      alert(t('❌ Fehler beim Löschen', '❌ Error deleting'));
    }
  };
  
  if (companies.length === 0) {
    return (
      <div className="bg-card backdrop-blur-md border border-border rounded-2xl p-12 text-center">
        <div className="text-5xl mb-4">🏢</div>
        <h3 className="text-lg font-semibold text-foreground mb-2">
          {t('Noch keine Unternehmen', 'No Companies Yet')}
        </h3>
        <p className="text-muted-foreground mb-6">
          {t('Fügen Sie Ihr erstes Unternehmen hinzu, um Leads zuweisen zu können', 'Add your first company to assign leads')}
        </p>
        <Link
          to="/admin/companies/new"
          className="inline-flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-lg transition-all"
        >
          <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 5v14M5 12h14"/>
          </svg>
          {t('Erstes Unternehmen hinzufügen', 'Add First Company')}
        </Link>
      </div>
    );
  }
  
  return (
    <div className="bg-card backdrop-blur-md border border-border rounded-2xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/50 border-b border-border">
            <tr>
              <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase">{t('Name', 'Name')}</th>
              <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase">{t('Kontakt', 'Contact')}</th>
              <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase">{t('Services', 'Services')}</th>
              <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase">{t('Städte', 'Cities')}</th>
              <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase">{t('Status', 'Status')}</th>
              <th className="text-right py-3 px-4 text-xs font-medium text-muted-foreground uppercase">{t('Aktionen', 'Actions')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {companies.map((company) => {
              const serviceNames = getServiceNames(company.service_ids || []);
              
              return (
                <tr key={company.id} className="hover:bg-muted/50 transition-colors">
                  <td className="py-4 px-4">
                    <div>
                      <div className="text-sm font-medium text-foreground">{company.name}</div>
                      {company.contact_person && (
                        <div className="text-xs text-muted-foreground">{company.contact_person}</div>
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="space-y-1">
                      <a href={`tel:${company.phone}`} className="block text-sm text-primary hover:text-primary/80">
                        {company.phone}
                      </a>
                      <a href={`mailto:${company.email}`} className="block text-xs text-muted-foreground hover:text-foreground truncate max-w-[200px]">
                        {company.email}
                      </a>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex flex-wrap gap-1">
                      {serviceNames.slice(0, 2).map((name, i) => (
                        <span key={i} className="inline-flex items-center px-2 py-1 rounded-md text-xs bg-blue-500/10 text-blue-400 border border-blue-500/20">
                          {name}
                        </span>
                      ))}
                      {serviceNames.length > 2 && (
                        <span className="inline-flex items-center px-2 py-1 rounded-md text-xs bg-muted text-muted-foreground">
                          +{serviceNames.length - 2}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex flex-wrap gap-1">
                      {(company.cities || []).slice(0, 2).map((city, i) => (
                        <span key={i} className="inline-flex items-center px-2 py-1 rounded-md text-xs bg-purple-500/10 text-purple-400 border border-purple-500/20">
                          {city}
                        </span>
                      ))}
                      {(company.cities || []).length > 2 && (
                        <span className="inline-flex items-center px-2 py-1 rounded-md text-xs bg-muted text-muted-foreground">
                          +{company.cities.length - 2}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${
                      company.is_active
                        ? 'bg-primary/10 text-primary border border-primary/20'
                        : 'bg-muted text-muted-foreground border border-border'
                    }`}>
                      {company.is_active ? 'Aktiv' : 'Inaktiv'}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        to={`/admin/companies/${company.id}`}
                        className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-all"
                        title="Bearbeiten"
                      >
                        <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                        </svg>
                      </Link>
                      <button
                        onClick={() => handleDelete(company.id, company.name)}
                        className="p-2 text-muted-foreground hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                        title="Löschen"
                      >
                        <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="3 6 5 6 21 6"/>
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
