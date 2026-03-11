import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import AdminLayout from '@/components/AdminLayout';
import {
  Eye,
  MousePointer,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  Pause,
  Play,
  ExternalLink,
  AlertCircle,
  Users,
} from 'lucide-react';
import {
  getAllAds,
  getPendingAds,
  getWaitlist,
  type Ad,
  type WaitlistEntry,
  type AdStatus,
} from '@/lib/ads';

// Status badge component
function StatusBadge({ status }: { status: AdStatus }) {
  const config = {
    pending: { bg: 'bg-yellow-500/10', text: 'text-yellow-400', label: 'Ausstehend' },
    active: { bg: 'bg-green-500/10', text: 'text-green-400', label: 'Aktiv' },
    paused: { bg: 'bg-gray-500/10', text: 'text-gray-400', label: 'Pausiert' },
    rejected: { bg: 'bg-red-500/10', text: 'text-red-400', label: 'Abgelehnt' },
    expired: { bg: 'bg-orange-500/10', text: 'text-orange-400', label: 'Abgelaufen' },
  };

  const { bg, text, label } = config[status] || config.pending;

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${bg} ${text}`}>
      {label}
    </span>
  );
}

export default function AdminAds() {
  const { t } = useLanguage();
  const [ads, setAds] = useState<Ad[]>([]);
  const [pendingAds, setPendingAds] = useState<Ad[]>([]);
  const [waitlist, setWaitlist] = useState<WaitlistEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'waitlist'>('all');

  useEffect(() => {
    async function loadData() {
      try {
        const [allAds, pending, waitlistData] = await Promise.all([
          getAllAds(),
          getPendingAds(),
          getWaitlist(),
        ]);
        setAds(allAds);
        setPendingAds(pending);
        setWaitlist(waitlistData);
      } catch (error) {
        console.error('Error loading ads data:', error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  const activeAdsCount = ads.filter((a) => a.status === 'active').length;
  const totalRevenue = ads
    .filter((a) => a.status === 'active' || a.status === 'expired')
    .reduce((sum, a) => sum + (a.price_paid || 0), 0);

  if (loading) {
    return (
      <AdminLayout>
        <div className="p-6">
          <div className="text-center text-muted-foreground py-12">
            {t('Lade Anzeigen...', 'Loading ads...')}
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">
            {t('Werbeanzeigen verwalten', 'Manage Ads')}
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            {t('Alle Werbeanzeigen und Warteliste', 'All advertisements and waitlist')}
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <p className="text-2xl font-semibold text-white">{activeAdsCount}</p>
              <p className="text-gray-400 text-sm">{t('Aktive Anzeigen', 'Active Ads')}</p>
            </div>
          </div>
        </div>

        <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-yellow-500/10 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-yellow-400" />
            </div>
            <div>
              <p className="text-2xl font-semibold text-white">{pendingAds.length}</p>
              <p className="text-gray-400 text-sm">{t('Ausstehend', 'Pending')}</p>
            </div>
          </div>
        </div>

        <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <p className="text-2xl font-semibold text-white">{waitlist.length}</p>
              <p className="text-gray-400 text-sm">{t('Warteliste', 'Waitlist')}</p>
            </div>
          </div>
        </div>

        <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-semibold text-white">€{totalRevenue.toLocaleString()}</p>
              <p className="text-gray-400 text-sm">{t('Gesamtumsatz', 'Total Revenue')}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Pending Alert */}
      {pendingAds.length > 0 && (
        <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4 mb-6 flex items-center gap-4">
          <AlertCircle className="w-6 h-6 text-yellow-400 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-white font-medium">
              {pendingAds.length} {t('Anzeige(n) warten auf Genehmigung', 'ad(s) waiting for approval')}
            </p>
            <p className="text-gray-400 text-sm">
              {t('Klicken Sie auf eine Anzeige, um sie zu überprüfen.', 'Click on an ad to review it.')}
            </p>
          </div>
          <button
            onClick={() => setActiveTab('pending')}
            className="px-4 py-2 bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-400 rounded-lg transition-colors text-sm font-medium"
          >
            {t('Anzeigen', 'View')}
          </button>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-white/[0.06] pb-2">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeTab === 'all'
              ? 'bg-primary/10 text-primary'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          {t('Alle Anzeigen', 'All Ads')} ({ads.length})
        </button>
        <button
          onClick={() => setActiveTab('pending')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeTab === 'pending'
              ? 'bg-primary/10 text-primary'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          {t('Ausstehend', 'Pending')} ({pendingAds.length})
        </button>
        <button
          onClick={() => setActiveTab('waitlist')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeTab === 'waitlist'
              ? 'bg-primary/10 text-primary'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          {t('Warteliste', 'Waitlist')} ({waitlist.length})
        </button>
      </div>

      {/* Content */}
      {activeTab === 'waitlist' ? (
        <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl overflow-hidden">
          {waitlist.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              {t('Keine Einträge auf der Warteliste', 'No entries on the waitlist')}
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-white/[0.02] border-b border-white/[0.06]">
                <tr>
                  <th className="text-left text-gray-400 text-xs font-medium uppercase px-4 py-3">
                    {t('Firma', 'Company')}
                  </th>
                  <th className="text-left text-gray-400 text-xs font-medium uppercase px-4 py-3">
                    {t('Kontakt', 'Contact')}
                  </th>
                  <th className="text-left text-gray-400 text-xs font-medium uppercase px-4 py-3">
                    {t('Datum', 'Date')}
                  </th>
                  <th className="text-left text-gray-400 text-xs font-medium uppercase px-4 py-3">
                    {t('Präferenz', 'Preference')}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.06]">
                {waitlist.map((entry) => (
                  <tr key={entry.id} className="hover:bg-white/[0.02]">
                    <td className="px-4 py-4">
                      <p className="text-white font-medium">{entry.company_name}</p>
                      <p className="text-gray-400 text-sm">{entry.industry || '-'}</p>
                    </td>
                    <td className="px-4 py-4">
                      <p className="text-white">{entry.email}</p>
                      <p className="text-gray-400 text-sm">{entry.phone || '-'}</p>
                    </td>
                    <td className="px-4 py-4 text-gray-400 text-sm">
                      {new Date(entry.created_at).toLocaleDateString('de-DE')}
                    </td>
                    <td className="px-4 py-4 text-gray-400 text-sm">
                      {entry.preferred_duration
                        ? `${entry.preferred_duration} ${t('Monat(e)', 'month(s)')}`
                        : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      ) : (
        <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl overflow-hidden">
          {(activeTab === 'pending' ? pendingAds : ads).length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              {t('Keine Anzeigen gefunden', 'No ads found')}
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-white/[0.02] border-b border-white/[0.06]">
                <tr>
                  <th className="text-left text-gray-400 text-xs font-medium uppercase px-4 py-3">
                    {t('Anzeige', 'Ad')}
                  </th>
                  <th className="text-left text-gray-400 text-xs font-medium uppercase px-4 py-3">
                    {t('Status', 'Status')}
                  </th>
                  <th className="text-left text-gray-400 text-xs font-medium uppercase px-4 py-3">
                    {t('Laufzeit', 'Duration')}
                  </th>
                  <th className="text-left text-gray-400 text-xs font-medium uppercase px-4 py-3">
                    {t('Preis', 'Price')}
                  </th>
                  <th className="text-left text-gray-400 text-xs font-medium uppercase px-4 py-3">
                    {t('Erstellt', 'Created')}
                  </th>
                  <th className="text-left text-gray-400 text-xs font-medium uppercase px-4 py-3">
                    {t('Aktionen', 'Actions')}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.06]">
                {(activeTab === 'pending' ? pendingAds : ads).map((ad) => (
                  <tr key={ad.id} className="hover:bg-white/[0.02]">
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={ad.logo_url}
                          alt={ad.company_name}
                          className="w-10 h-10 rounded-full object-cover border border-white/10"
                        />
                        <div>
                          <p className="text-white font-medium">{ad.company_name}</p>
                          <p className="text-gray-400 text-sm truncate max-w-[200px]">
                            {ad.short_description || ad.industry}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <StatusBadge status={ad.status} />
                    </td>
                    <td className="px-4 py-4 text-gray-400 text-sm">
                      {ad.duration_months} {t('Monat(e)', 'month(s)')}
                    </td>
                    <td className="px-4 py-4 text-white font-medium">
                      €{ad.price_paid}
                    </td>
                    <td className="px-4 py-4 text-gray-400 text-sm">
                      {new Date(ad.created_at).toLocaleDateString('de-DE')}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <Link
                          to={`/admin/ads/${ad.id}`}
                          className="px-3 py-1.5 bg-primary/10 hover:bg-primary/20 text-primary rounded-lg text-sm font-medium transition-colors"
                        >
                          {t('Details', 'Details')}
                        </Link>
                        <a
                          href={ad.website_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 text-gray-400 hover:text-white transition-colors"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
    </AdminLayout>
  );
}
