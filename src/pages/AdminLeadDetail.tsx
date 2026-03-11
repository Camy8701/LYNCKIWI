import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import AdminLayout from '@/components/AdminLayout';
import { getLeadById, getLeadAssignments } from '@/lib/database';
import { Skeleton } from '@/components/ui/skeleton';
import LeadDetailActions from '@/components/admin/LeadDetailActions';
import LeadDetailNotes from '@/components/admin/LeadDetailNotes';
import type { LeadWithService } from '@/lib/database';

function formatDateTime(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('de-DE', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

const AdminLeadDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [lead, setLead] = useState<LeadWithService | null>(null);
  const [assignments, setAssignments] = useState<any[]>([]);

  useEffect(() => {
    async function loadLead() {
      if (!id) return;
      
      setLoading(true);
      try {
        const [leadData, assignmentsData] = await Promise.all([
          getLeadById(id),
          getLeadAssignments(id)
        ]);
        
        setLead(leadData);
        setAssignments(assignmentsData);
      } catch (error) {
        console.error('Error loading lead:', error);
        navigate('/admin/leads');
      } finally {
        setLoading(false);
      }
    }

    loadLead();
  }, [id, navigate]);

  const handleRefresh = async () => {
    if (!id) return;
    const [leadData, assignmentsData] = await Promise.all([
      getLeadById(id),
      getLeadAssignments(id)
    ]);
    setLead(leadData);
    setAssignments(assignmentsData);
  };

  if (loading || !lead) {
    return (
      <AdminLayout>
        <div className="p-8">
          <Skeleton className="h-10 w-64 mb-8" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Skeleton className="h-64" />
              <Skeleton className="h-96" />
            </div>
            <div className="space-y-6">
              <Skeleton className="h-64" />
              <Skeleton className="h-96" />
            </div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  const timelineText = 
    lead.timeline === 'sofort' ? 'Sofort / Notfall' :
    lead.timeline === 'diese_woche' ? 'Diese Woche' :
    lead.timeline === 'diesen_monat' ? 'Diesen Monat' : 'Flexibel';

  return (
    <AdminLayout>
      <div className="p-6 md:p-8">
        {/* Breadcrumb */}
        <div className="mb-6">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link to="/admin" className="hover:text-foreground transition-colors">
              Dashboard
            </Link>
            <span>/</span>
            <Link to="/admin/leads" className="hover:text-foreground transition-colors">
              Leads
            </Link>
            <span>/</span>
            <span className="text-foreground">#{lead.id.slice(0, 8)}</span>
          </div>
        </div>

        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-instrument-serif text-foreground mb-2">
            Lead #{lead.id.slice(0, 8)}
          </h1>
          <p className="text-muted-foreground">
            Erstellt am {formatDateTime(lead.created_at)}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* LEFT COLUMN (2/3 width) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Customer Information */}
            <div className="bg-card backdrop-blur-md border border-border rounded-2xl p-6">
              <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <span className="text-xl">👤</span>
                Kundeninformationen
              </h2>
              <div className="space-y-3">
                <div className="flex justify-between py-2 border-b border-border">
                  <span className="text-muted-foreground">Name</span>
                  <span className="text-foreground font-medium">{lead.name}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-border">
                  <span className="text-muted-foreground">Telefon</span>
                  <a href={`tel:${lead.phone}`} className="text-primary hover:text-primary/80 font-medium">
                    {lead.phone}
                  </a>
                </div>
                <div className="flex justify-between py-2 border-b border-border">
                  <span className="text-muted-foreground">E-Mail</span>
                  {lead.email ? (
                    <a href={`mailto:${lead.email}`} className="text-primary hover:text-primary/80">
                      {lead.email}
                    </a>
                  ) : (
                    <span className="text-muted-foreground">—</span>
                  )}
                </div>
                <div className="flex justify-between py-2 border-b border-border">
                  <span className="text-muted-foreground">PLZ / Stadt</span>
                  <span className="text-foreground">{lead.plz} {lead.city}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-muted-foreground">Erstellt</span>
                  <span className="text-foreground">{formatDateTime(lead.created_at)}</span>
                </div>
              </div>
            </div>

            {/* Project Details */}
            <div className="bg-card backdrop-blur-md border border-border rounded-2xl p-6">
              <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <span className="text-xl">📝</span>
                Projektdetails
              </h2>
              <div className="space-y-4">
                <div>
                  <div className="text-sm text-muted-foreground mb-2">Service</div>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{lead.service.icon}</span>
                    <span className="text-lg text-foreground font-medium">{lead.service.name}</span>
                  </div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-2">Zeitrahmen</div>
                  <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
                    lead.timeline === 'sofort' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                    lead.timeline === 'diese_woche' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                    lead.timeline === 'diesen_monat' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                    'bg-gray-500/10 text-gray-400 border border-gray-500/20'
                  }`}>
                    {timelineText}
                  </span>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-2">Beschreibung</div>
                  <div className="bg-muted/20 border border-border rounded-lg p-4">
                    <p className="text-foreground whitespace-pre-wrap">{lead.service_details}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Admin Notes */}
            <LeadDetailNotes lead={lead} onUpdate={handleRefresh} />
          </div>

          {/* RIGHT COLUMN (1/3 width) */}
          <div className="space-y-6">
            {/* Assigned Companies */}
            <div className="bg-card backdrop-blur-md border border-border rounded-2xl p-6">
              <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <span className="text-xl">🏢</span>
                Zugewiesene Unternehmen
              </h2>

              {assignments.length === 0 ? (
                <div className="text-center py-6">
                  <p className="text-muted-foreground mb-4">
                    Noch keinem Unternehmen zugewiesen
                  </p>
                  <Link
                    to="/admin/companies"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground font-medium rounded-lg transition-all text-sm"
                  >
                    Unternehmen zuweisen
                    <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {assignments.map((assignment: any) => (
                    <div key={assignment.id} className="bg-muted/20 border border-border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div className="font-medium text-foreground">{assignment.company.name}</div>
                        <div className="text-primary font-semibold">
                          €{assignment.amount_charged}
                        </div>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {formatDateTime(assignment.assigned_at)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="bg-card backdrop-blur-md border border-border rounded-2xl p-6">
              <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <span className="text-xl">⚡</span>
                Aktionen
              </h2>

              <LeadDetailActions lead={lead} onUpdate={handleRefresh} />
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminLeadDetail;
