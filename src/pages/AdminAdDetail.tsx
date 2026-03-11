import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import AdminLayout from '@/components/AdminLayout';
import {
  ArrowLeft,
  CheckCircle,
  XCircle,
  Pause,
  Play,
  ExternalLink,
  Eye,
  MousePointer,
  TrendingUp,
  Calendar,
  Mail,
  Phone,
  Building2,
  Globe,
  Loader2,
} from 'lucide-react';
import {
  getAdById,
  approveAd,
  rejectAd,
  pauseAd,
  resumeAd,
  getAdAnalytics,
  type Ad,
} from '@/lib/ads';
import { supabase } from '@/integrations/supabase/client';

export default function AdminAdDetail() {
  const { t, language } = useLanguage();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [ad, setAd] = useState<Ad | null>(null);
  const [analytics, setAnalytics] = useState({
    total_impressions: 0,
    total_clicks: 0,
    ctr: 0,
  });
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  useEffect(() => {
    async function loadAd() {
      if (!id) return;

      try {
        const [adData, analyticsData] = await Promise.all([
          getAdById(id),
          getAdAnalytics(id),
        ]);
        setAd(adData);
        setAnalytics(analyticsData);
      } catch (error) {
        console.error('Error loading ad:', error);
      } finally {
        setLoading(false);
      }
    }

    loadAd();
  }, [id]);

  const handleApprove = async () => {
    if (!ad) return;

    setActionLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        alert(t('Nicht angemeldet', 'Not logged in'));
        return;
      }

      const updatedAd = await approveAd(ad.id, user.id);
      setAd(updatedAd);
    } catch (error: any) {
      console.error('Error approving ad:', error);
      alert(error.message || t('Fehler beim Genehmigen', 'Error approving'));
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async () => {
    if (!ad || !rejectReason.trim()) return;

    setActionLoading(true);
    try {
      const updatedAd = await rejectAd(ad.id, rejectReason);
      setAd(updatedAd);
      setShowRejectModal(false);
    } catch (error: any) {
      console.error('Error rejecting ad:', error);
      alert(error.message || t('Fehler beim Ablehnen', 'Error rejecting'));
    } finally {
      setActionLoading(false);
    }
  };

  const handlePause = async () => {
    if (!ad) return;

    setActionLoading(true);
    try {
      const updatedAd = await pauseAd(ad.id);
      setAd(updatedAd);
    } catch (error: any) {
      console.error('Error pausing ad:', error);
      alert(error.message || t('Fehler beim Pausieren', 'Error pausing'));
    } finally {
      setActionLoading(false);
    }
  };

  const handleResume = async () => {
    if (!ad) return;

    setActionLoading(true);
    try {
      const updatedAd = await resumeAd(ad.id);
      setAd(updatedAd);
    } catch (error: any) {
      console.error('Error resuming ad:', error);
      alert(error.message || t('Fehler beim Fortsetzen', 'Error resuming'));
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="p-6">
          <div className="text-center text-muted-foreground py-12">
            {t('Lade Anzeige...', 'Loading ad...')}
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (!ad) {
    return (
      <AdminLayout>
        <div className="p-6">
          <div className="text-center text-muted-foreground py-12">
            {t('Anzeige nicht gefunden', 'Ad not found')}
          </div>
        </div>
      </AdminLayout>
    );
  }

  const statusConfig = {
    pending: { bg: 'bg-yellow-500/10', text: 'text-yellow-400', label: t('Ausstehend', 'Pending') },
    active: { bg: 'bg-green-500/10', text: 'text-green-400', label: t('Aktiv', 'Active') },
    paused: { bg: 'bg-gray-500/10', text: 'text-gray-400', label: t('Pausiert', 'Paused') },
    rejected: { bg: 'bg-red-500/10', text: 'text-red-400', label: t('Abgelehnt', 'Rejected') },
    expired: { bg: 'bg-orange-500/10', text: 'text-orange-400', label: t('Abgelaufen', 'Expired') },
  };

  const status = statusConfig[ad.status] || statusConfig.pending;

  return (
    <AdminLayout>
    <div className="p-6 max-w-4xl mx-auto">
      {/* Back Button */}
      <button
        onClick={() => navigate('/admin/ads')}
        className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        {t('Zurück zur Übersicht', 'Back to Overview')}
      </button>

      {/* Header */}
      <div className="flex items-start gap-6 mb-8">
        <img
          src={ad.logo_url}
          alt={ad.company_name}
          className="w-24 h-24 rounded-full object-cover border-4 border-white/10"
        />
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-2xl font-semibold text-foreground">{ad.company_name}</h1>
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${status.bg} ${status.text}`}>
              {status.label}
            </span>
          </div>
          <p className="text-muted-foreground">{ad.short_description || ad.industry}</p>
          <a
            href={ad.website_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-primary hover:underline mt-2 text-sm"
          >
            {ad.website_url}
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>

      {/* Analytics (for active/expired ads) */}
      {(ad.status === 'active' || ad.status === 'expired') && (
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-4">
            <div className="flex items-center gap-3">
              <Eye className="w-5 h-5 text-blue-400" />
              <div>
                <p className="text-2xl font-semibold text-white">
                  {analytics.total_impressions.toLocaleString()}
                </p>
                <p className="text-gray-400 text-sm">{t('Impressionen', 'Impressions')}</p>
              </div>
            </div>
          </div>

          <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-4">
            <div className="flex items-center gap-3">
              <MousePointer className="w-5 h-5 text-green-400" />
              <div>
                <p className="text-2xl font-semibold text-white">
                  {analytics.total_clicks.toLocaleString()}
                </p>
                <p className="text-gray-400 text-sm">{t('Klicks', 'Clicks')}</p>
              </div>
            </div>
          </div>

          <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-4">
            <div className="flex items-center gap-3">
              <TrendingUp className="w-5 h-5 text-primary" />
              <div>
                <p className="text-2xl font-semibold text-white">
                  {analytics.ctr.toFixed(2)}%
                </p>
                <p className="text-gray-400 text-sm">{t('Click-Through-Rate', 'Click-Through Rate')}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Details Grid */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {/* Ad Details */}
        <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">
            {t('Anzeigendetails', 'Ad Details')}
          </h2>

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Building2 className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-gray-400 text-sm">{t('Branche', 'Industry')}</p>
                <p className="text-white">{ad.industry}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-gray-400 text-sm">{t('Laufzeit', 'Duration')}</p>
                <p className="text-white">
                  {ad.duration_months} {t('Monat(e)', 'month(s)')}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Globe className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-gray-400 text-sm">{t('Preis', 'Price')}</p>
                <p className="text-primary font-semibold">€{ad.price_paid}</p>
              </div>
            </div>

            {ad.starts_at && (
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-gray-400 text-sm">{t('Startdatum', 'Start Date')}</p>
                  <p className="text-white">
                    {new Date(ad.starts_at).toLocaleDateString('de-DE')}
                  </p>
                </div>
              </div>
            )}

            {ad.expires_at && (
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-gray-400 text-sm">{t('Enddatum', 'End Date')}</p>
                  <p className="text-white">
                    {new Date(ad.expires_at).toLocaleDateString('de-DE')}
                  </p>
                </div>
              </div>
            )}

            {ad.auto_renew && (
              <div className="flex items-center gap-2 text-green-400 text-sm">
                <CheckCircle className="w-4 h-4" />
                {t('Automatische Verlängerung aktiv', 'Auto-renewal active')}
              </div>
            )}
          </div>
        </div>

        {/* Contact Details */}
        <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">
            {t('Kontaktinformationen', 'Contact Information')}
          </h2>

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Building2 className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-gray-400 text-sm">{t('Ansprechpartner', 'Contact Person')}</p>
                <p className="text-white">{ad.advertiser_name}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-gray-400 text-sm">{t('E-Mail', 'Email')}</p>
                <a href={`mailto:${ad.advertiser_email}`} className="text-primary hover:underline">
                  {ad.advertiser_email}
                </a>
              </div>
            </div>

            {ad.advertiser_phone && (
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-gray-400 text-sm">{t('Telefon', 'Phone')}</p>
                  <a href={`tel:${ad.advertiser_phone}`} className="text-primary hover:underline">
                    {ad.advertiser_phone}
                  </a>
                </div>
              </div>
            )}

            <div className="border-t border-white/[0.06] pt-4 mt-4">
              <p className="text-gray-400 text-sm">{t('Erstellt am', 'Created at')}</p>
              <p className="text-white">
                {new Date(ad.created_at).toLocaleDateString('de-DE', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Rejection Reason (if rejected) */}
      {ad.status === 'rejected' && ad.rejection_reason && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-6 mb-8">
          <h3 className="text-red-400 font-medium mb-2">
            {t('Ablehnungsgrund', 'Rejection Reason')}
          </h3>
          <p className="text-white">{ad.rejection_reason}</p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-4">
        {ad.status === 'pending' && (
          <>
            <button
              onClick={handleApprove}
              disabled={actionLoading}
              className="inline-flex items-center gap-2 px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg transition-all disabled:opacity-50"
            >
              {actionLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <CheckCircle className="w-4 h-4" />
              )}
              {t('Genehmigen', 'Approve')}
            </button>
            <button
              onClick={() => setShowRejectModal(true)}
              disabled={actionLoading}
              className="inline-flex items-center gap-2 px-6 py-3 bg-red-500/20 hover:bg-red-500/30 text-red-400 font-semibold rounded-lg transition-all disabled:opacity-50"
            >
              <XCircle className="w-4 h-4" />
              {t('Ablehnen', 'Reject')}
            </button>
          </>
        )}

        {ad.status === 'active' && (
          <button
            onClick={handlePause}
            disabled={actionLoading}
            className="inline-flex items-center gap-2 px-6 py-3 bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-400 font-semibold rounded-lg transition-all disabled:opacity-50"
          >
            {actionLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Pause className="w-4 h-4" />
            )}
            {t('Pausieren', 'Pause')}
          </button>
        )}

        {ad.status === 'paused' && (
          <button
            onClick={handleResume}
            disabled={actionLoading}
            className="inline-flex items-center gap-2 px-6 py-3 bg-green-500/20 hover:bg-green-500/30 text-green-400 font-semibold rounded-lg transition-all disabled:opacity-50"
          >
            {actionLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Play className="w-4 h-4" />
            )}
            {t('Fortsetzen', 'Resume')}
          </button>
        )}
      </div>

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-card border border-border rounded-2xl p-8 max-w-md w-full">
            <h3 className="text-xl font-semibold text-foreground mb-4">
              {t('Anzeige ablehnen', 'Reject Ad')}
            </h3>
            <p className="text-muted-foreground text-sm mb-4">
              {t(
                'Bitte geben Sie einen Grund für die Ablehnung an. Der Werbetreibende wird per E-Mail benachrichtigt.',
                'Please provide a reason for rejection. The advertiser will be notified by email.'
              )}
            </p>

            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder={t('Grund für die Ablehnung...', 'Reason for rejection...')}
              rows={4}
              className="w-full bg-background border border-border rounded-lg px-4 py-3 text-foreground focus:ring-2 focus:ring-primary focus:border-transparent mb-4"
            />

            <div className="flex gap-3">
              <button
                onClick={() => setShowRejectModal(false)}
                className="flex-1 px-4 py-2 bg-background border border-border text-foreground rounded-lg hover:bg-muted transition-all"
              >
                {t('Abbrechen', 'Cancel')}
              </button>
              <button
                onClick={handleReject}
                disabled={!rejectReason.trim() || actionLoading}
                className="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg transition-all disabled:opacity-50"
              >
                {actionLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin mx-auto" />
                ) : (
                  t('Ablehnen', 'Reject')
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
    </AdminLayout>
  );
}
