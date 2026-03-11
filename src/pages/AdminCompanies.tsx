import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '@/components/AdminLayout';
import CompaniesTable from '@/components/admin/CompaniesTable';
import { getAllCompanies, getServices, getCities } from '@/lib/database';
import type { Company, Service, City } from '@/lib/database';
import { Skeleton } from '@/components/ui/skeleton';
import { useLanguage } from '@/contexts/LanguageContext';

const AdminCompanies = () => {
  const { t } = useLanguage();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [companiesData, servicesData, citiesData] = await Promise.all([
          getAllCompanies(),
          getServices(),
          getCities(),
        ]);
        setCompanies(companiesData);
        setServices(servicesData);
        setCities(citiesData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const refreshData = async () => {
    const companiesData = await getAllCompanies();
    setCompanies(companiesData);
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="p-6 md:p-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <Skeleton className="h-10 w-64 mb-2" />
              <Skeleton className="h-4 w-48" />
            </div>
            <Skeleton className="h-12 w-48" />
          </div>
          <Skeleton className="h-96 w-full" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-6 md:p-8">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-instrument-serif text-foreground mb-2">
              {t('Unternehmen', 'Companies')}
            </h1>
            <p className="text-muted-foreground">
              {companies.length} {t('Unternehmen insgesamt', 'Companies total')}
            </p>
          </div>
          <Link
            to="/admin/companies/new"
            className="flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-lg transition-all"
          >
            <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 5v14M5 12h14"/>
            </svg>
            {t('Neues Unternehmen', 'New Company')}
          </Link>
        </div>
        
        <CompaniesTable 
          companies={companies} 
          services={services}
          cities={cities}
          onUpdate={refreshData}
        />
      </div>
    </AdminLayout>
  );
};

export default AdminCompanies;
