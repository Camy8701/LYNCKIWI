import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '@/components/AdminLayout';
import { getDashboardStats, getRecentLeadsForDashboard, type LeadWithService } from '@/lib/database';
import { Skeleton } from '@/components/ui/skeleton';
import { useLanguage } from '@/contexts/LanguageContext';

// Helper function to calculate percentage change
function calculateChange(current: number, previous: number): string {
  if (previous === 0) return current > 0 ? '+100%' : '0%';
  const change = ((current - previous) / previous) * 100;
  return change >= 0 ? `+${change.toFixed(0)}%` : `${change.toFixed(0)}%`;
}

// Helper function to format currency
function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

// Helper function to format date/time
function formatDateTime(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('de-DE', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

type DashboardStats = {
  leadsToday: number;
  leadsYesterday: number;
  leadsThisWeek: number;
  leadsLastWeek: number;
  activeCompanies: number;
  revenueThisWeek: number;
  revenueLastWeek: number;
};

const AdminDashboard = () => {
  const { t } = useLanguage();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentLeads, setRecentLeads] = useState<LeadWithService[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        const [statsData, leadsData] = await Promise.all([
          getDashboardStats(),
          getRecentLeadsForDashboard(10)
        ]);
        setStats(statsData);
        setRecentLeads(leadsData);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setLoading(false);
      }
    }

    loadDashboardData();
  }, []);

  if (loading || !stats) {
    return (
      <AdminLayout>
        <div className="p-6 md:p-8">
          <Skeleton className="h-10 w-48 mb-2" />
          <Skeleton className="h-5 w-64 mb-8" />
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-32 rounded-2xl" />
            ))}
          </div>
          
          <div className="bg-white/[0.03] dark:bg-white/[0.03] rounded-2xl p-6">
            <Skeleton className="h-6 w-32 mb-6" />
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="h-16" />
              ))}
            </div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  const todayChange = calculateChange(stats.leadsToday, stats.leadsYesterday);
  const weekChange = calculateChange(stats.leadsThisWeek, stats.leadsLastWeek);
  const revenueChange = calculateChange(stats.revenueThisWeek, stats.revenueLastWeek);

  return (
    <AdminLayout>
      <div className="p-6 md:p-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-instrument-serif text-foreground mb-2">
            {t('Dashboard', 'Dashboard')}
          </h1>
          <p className="text-muted-foreground">
            {t('Übersicht über Ihre Leads und Aktivitäten', 'Overview of your leads and activities')}
          </p>
        </div>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Leads Today */}
          <div className="bg-white/[0.03] dark:bg-white/[0.03] backdrop-blur-md border border-white/[0.06] rounded-2xl p-6 hover:bg-white/[0.08] transition-all">
            <div className="flex items-center justify-between mb-2">
              <div className="text-muted-foreground text-sm font-medium">{t('Leads Heute', 'Leads Today')}</div>
              <span className="text-2xl">📋</span>
            </div>
            <div className="text-3xl font-bold text-foreground mb-2">
              {stats.leadsToday}
            </div>
            <div className={`text-xs font-medium ${
              stats.leadsToday >= stats.leadsYesterday ? 'text-primary' : 'text-destructive'
            }`}>
              {todayChange} {t('vs. gestern', 'vs. yesterday')}
            </div>
          </div>
          
          {/* Leads This Week */}
          <div className="bg-white/[0.03] dark:bg-white/[0.03] backdrop-blur-md border border-white/[0.06] rounded-2xl p-6 hover:bg-white/[0.08] transition-all">
            <div className="flex items-center justify-between mb-2">
              <div className="text-muted-foreground text-sm font-medium">{t('Leads diese Woche', 'Leads This Week')}</div>
              <span className="text-2xl">📊</span>
            </div>
            <div className="text-3xl font-bold text-foreground mb-2">
              {stats.leadsThisWeek}
            </div>
            <div className={`text-xs font-medium ${
              stats.leadsThisWeek >= stats.leadsLastWeek ? 'text-primary' : 'text-destructive'
            }`}>
              {weekChange} {t('vs. letzte Woche', 'vs. last week')}
            </div>
          </div>
          
          {/* Revenue This Week */}
          <div className="bg-white/[0.03] dark:bg-white/[0.03] backdrop-blur-md border border-white/[0.06] rounded-2xl p-6 hover:bg-white/[0.08] transition-all">
            <div className="flex items-center justify-between mb-2">
              <div className="text-muted-foreground text-sm font-medium">{t('Umsatz (Woche)', 'Revenue (Week)')}</div>
              <span className="text-2xl">💰</span>
            </div>
            <div className="text-3xl font-bold text-foreground mb-2">
              {formatCurrency(stats.revenueThisWeek)}
            </div>
            <div className={`text-xs font-medium ${
              stats.revenueThisWeek >= stats.revenueLastWeek ? 'text-primary' : 'text-destructive'
            }`}>
              {revenueChange} {t('vs. letzte Woche', 'vs. last week')}
            </div>
          </div>
          
          {/* Active Companies */}
          <div className="bg-white/[0.03] dark:bg-white/[0.03] backdrop-blur-md border border-white/[0.06] rounded-2xl p-6 hover:bg-white/[0.08] transition-all">
            <div className="flex items-center justify-between mb-2">
              <div className="text-muted-foreground text-sm font-medium">{t('Aktive Unternehmen', 'Active Companies')}</div>
              <span className="text-2xl">🏢</span>
            </div>
            <div className="text-3xl font-bold text-foreground mb-2">
              {stats.activeCompanies}
            </div>
            <Link 
              to="/admin/companies"
              className="text-xs font-medium text-primary hover:text-primary/80 transition-colors"
            >
              → {t('Unternehmen verwalten', 'Manage Companies')}
            </Link>
          </div>
        </div>
        
        {/* Recent Leads Table */}
        <div className="bg-white/[0.03] dark:bg-white/[0.03] backdrop-blur-md border border-white/[0.06] rounded-2xl overflow-hidden">
          <div className="p-6 border-b border-white/[0.06] flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-foreground mb-1">
                {t('Letzte Leads', 'Recent Leads')}
              </h2>
              <p className="text-sm text-muted-foreground">
                {t(`Die ${recentLeads.length} neuesten Anfragen`, `The ${recentLeads.length} most recent requests`)}
              </p>
            </div>
            <Link 
              to="/admin/leads"
              className="text-sm text-primary hover:text-primary/80 font-medium transition-colors flex items-center gap-2"
            >
              {t('Alle Leads anzeigen', 'View All Leads')}
              <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </Link>
          </div>
          
          {recentLeads.length === 0 ? (
            // Empty State
            <div className="p-12 text-center">
              <div className="text-5xl mb-4">📭</div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {t('Noch keine Leads', 'No Leads Yet')}
              </h3>
              <p className="text-muted-foreground mb-6">
                {t('Sobald Kunden Anfragen stellen, erscheinen sie hier', 'As soon as customers submit requests, they will appear here')}
              </p>
              <Link
                to="/"
                className="inline-flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground font-medium rounded-lg transition-all"
              >
                {t('Zur Website', 'To Website')}
                <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </Link>
            </div>
          ) : (
            // Leads Table
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-white/[0.02] border-b border-white/[0.06]">
                  <tr>
                    <th className="text-left py-3 px-6 text-xs font-medium text-muted-foreground uppercase">ID</th>
                    <th className="text-left py-3 px-6 text-xs font-medium text-muted-foreground uppercase">{t('Zeit', 'Time')}</th>
                    <th className="text-left py-3 px-6 text-xs font-medium text-muted-foreground uppercase">{t('Name', 'Name')}</th>
                    <th className="text-left py-3 px-6 text-xs font-medium text-muted-foreground uppercase">{t('Telefon', 'Phone')}</th>
                    <th className="text-left py-3 px-6 text-xs font-medium text-muted-foreground uppercase">{t('Service', 'Service')}</th>
                    <th className="text-left py-3 px-6 text-xs font-medium text-muted-foreground uppercase">{t('Stadt', 'City')}</th>
                    <th className="text-left py-3 px-6 text-xs font-medium text-muted-foreground uppercase">{t('Status', 'Status')}</th>
                    <th className="text-right py-3 px-6 text-xs font-medium text-muted-foreground uppercase">{t('Aktionen', 'Actions')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.06]">
                  {recentLeads.map((lead) => (
                    <tr 
                      key={lead.id}
                      className="hover:bg-white/[0.02] transition-colors"
                    >
                      {/* ID */}
                      <td className="py-4 px-6">
                        <span className="text-xs font-mono text-muted-foreground">
                          #{lead.id.slice(0, 8)}
                        </span>
                      </td>
                      
                      {/* Time */}
                      <td className="py-4 px-6">
                        <span className="text-sm text-muted-foreground">
                          {formatDateTime(lead.created_at)}
                        </span>
                      </td>
                      
                      {/* Name */}
                      <td className="py-4 px-6">
                        <span className="text-sm font-medium text-foreground">
                          {lead.name}
                        </span>
                      </td>
                      
                      {/* Phone */}
                      <td className="py-4 px-6">
                        <a 
                          href={`tel:${lead.phone}`}
                          className="text-sm text-primary hover:text-primary/80 transition-colors"
                        >
                          {lead.phone}
                        </a>
                      </td>
                      
                      {/* Service */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{lead.service?.icon}</span>
                          <span className="text-sm text-foreground/80">
                            {lead.service?.name}
                          </span>
                        </div>
                      </td>
                      
                      {/* City */}
                      <td className="py-4 px-6">
                        <span className="text-sm text-muted-foreground">
                          {lead.city}
                        </span>
                      </td>
                      
                      {/* Status */}
                      <td className="py-4 px-6">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                          lead.status === 'new' 
                            ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                            : lead.status === 'contacted'
                            ? 'bg-primary/10 text-primary border border-primary/20'
                            : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                        }`}>
                          {lead.status === 'new' 
                            ? t('Neu', 'New') 
                            : lead.status === 'contacted' 
                            ? t('Kontaktiert', 'Contacted') 
                            : t('Umgewandelt', 'Converted')}
                        </span>
                      </td>
                      
                      {/* Actions */}
                      <td className="py-4 px-6 text-right">
                        <Link
                          to={`/admin/leads/${lead.id}`}
                          className="inline-flex items-center gap-1 text-sm text-primary hover:text-primary/80 font-medium transition-colors"
                        >
                          {t('Details', 'Details')}
                          <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M5 12h14M12 5l7 7-7 7"/>
                          </svg>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        
        {/* Quick Actions Warning */}
        {stats.activeCompanies === 0 && (
          <div className="mt-8 bg-amber-500/10 border border-amber-500/20 rounded-2xl p-6">
            <div className="flex items-start gap-4">
              <div className="text-3xl">⚠️</div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-amber-400 mb-2">
                  {t('Keine aktiven Unternehmen', 'No Active Companies')}
                </h3>
                <p className="text-sm text-foreground/80 mb-4">
                  {t('Sie haben noch keine Unternehmen hinzugefügt. Fügen Sie Handwerker hinzu, um Leads zuweisen zu können.', 
                     'You have not added any companies yet. Add contractors to be able to assign leads.')}
                </p>
                <Link
                  to="/admin/companies"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-black font-medium rounded-lg transition-all text-sm"
                >
                  {t('Erstes Unternehmen hinzufügen', 'Add First Company')}
                  <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
