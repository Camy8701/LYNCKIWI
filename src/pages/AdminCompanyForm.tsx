import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import AdminLayout from '@/components/AdminLayout';
import CompanyForm from '@/components/admin/CompanyForm';
import { getCompanyById, getServices, getCities } from '@/lib/database';
import type { Company, Service, City } from '@/lib/database';
import { Skeleton } from '@/components/ui/skeleton';
import { useLanguage } from '@/contexts/LanguageContext';

const AdminCompanyForm = () => {
  const { t } = useLanguage();
  const { id } = useParams<{ id: string }>();
  const [company, setCompany] = useState<Company | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(true);

  const isNew = id === 'new';

  useEffect(() => {
    async function fetchData() {
      try {
        const [servicesData, citiesData] = await Promise.all([
          getServices(),
          getCities(),
        ]);
        setServices(servicesData);
        setCities(citiesData);

        if (!isNew && id) {
          const companyData = await getCompanyById(id);
          setCompany(companyData);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [id, isNew]);

  if (loading) {
    return (
      <AdminLayout>
        <div className="p-6 md:p-8">
          <div className="mb-6">
            <Skeleton className="h-4 w-48" />
          </div>
          <div className="max-w-4xl mx-auto">
            <Skeleton className="h-10 w-64 mb-8" />
            <Skeleton className="h-96 w-full" />
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-6 md:p-8">
        <div className="mb-6">
          <Link to="/admin/companies" className="text-sm text-muted-foreground hover:text-foreground">
            ← {t('Zurück zu Unternehmen', 'Back to Companies')}
          </Link>
        </div>
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-instrument-serif text-foreground mb-8">
            {isNew ? t('Neues Unternehmen hinzufügen', 'Add New Company') : t('Unternehmen bearbeiten', 'Edit Company')}
          </h1>
          <CompanyForm company={company || undefined} services={services} cities={cities} />
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminCompanyForm;
