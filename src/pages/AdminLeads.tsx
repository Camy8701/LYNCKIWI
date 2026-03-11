import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import AdminLayout from '@/components/AdminLayout';
import { getLeadsWithFilters, getServices, getCities } from '@/lib/database';
import { Skeleton } from '@/components/ui/skeleton';
import LeadsFilters from '@/components/admin/LeadsFilters';
import LeadsTable from '@/components/admin/LeadsTable';
import type { LeadWithService, Service, City } from '@/lib/database';
import { useLanguage } from '@/contexts/LanguageContext';

const AdminLeads = () => {
  const { t } = useLanguage();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [leads, setLeads] = useState<LeadWithService[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [services, setServices] = useState<Service[]>([]);
  const [cities, setCities] = useState<City[]>([]);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        // Fetch services and cities for filters
        const [servicesData, citiesData] = await Promise.all([
          getServices(),
          getCities()
        ]);
        
        setServices(servicesData);
        setCities(citiesData);

        // Get filter values from URL
        const filters = {
          search: searchParams.get('search') || undefined,
          service_id: searchParams.get('service') || undefined,
          city: searchParams.get('city') || undefined,
          status: searchParams.get('status') || undefined,
          page: searchParams.get('page') ? parseInt(searchParams.get('page')!) : 1,
          pageSize: 25,
        };

        // Fetch leads with filters
        const result = await getLeadsWithFilters(filters);
        setLeads(result.leads);
        setTotalCount(result.totalCount);
        setCurrentPage(result.page);
        setTotalPages(result.totalPages);
      } catch (error) {
        console.error('Error loading leads:', error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [searchParams]);

  const handleUpdate = async () => {
    setLoading(true);
    try {
      const filters = {
        search: searchParams.get('search') || undefined,
        service_id: searchParams.get('service') || undefined,
        city: searchParams.get('city') || undefined,
        status: searchParams.get('status') || undefined,
        page: searchParams.get('page') ? parseInt(searchParams.get('page')!) : 1,
        pageSize: 25,
      };

      const result = await getLeadsWithFilters(filters);
      setLeads(result.leads);
      setTotalCount(result.totalCount);
      setCurrentPage(result.page);
      setTotalPages(result.totalPages);
    } catch (error) {
      console.error('Error loading leads:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="p-8">
          <div className="mb-8">
            <Skeleton className="h-10 w-48 mb-2" />
            <Skeleton className="h-5 w-64" />
          </div>
          <Skeleton className="h-64 mb-6" />
          <Skeleton className="h-96" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-6 md:p-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-instrument-serif text-foreground mb-2">
            {t('Alle Leads', 'All Leads')}
          </h1>
          <p className="text-muted-foreground">
            {totalCount} {t('Lead', 'Lead')}{totalCount !== 1 ? 's' : ''} {t('insgesamt', 'total')}
          </p>
        </div>

        {/* Filters */}
        <LeadsFilters 
          services={services}
          cities={cities}
        />

        {/* Leads Table */}
        <LeadsTable 
          leads={leads}
          currentPage={currentPage}
          totalPages={totalPages}
          totalCount={totalCount}
          onUpdate={handleUpdate}
        />
      </div>
    </AdminLayout>
  );
};

export default AdminLeads;
