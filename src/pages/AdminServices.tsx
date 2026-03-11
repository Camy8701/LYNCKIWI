import { useState, useEffect } from 'react';
import AdminLayout from '@/components/AdminLayout';
import ServicesTable from '@/components/admin/ServicesTable';
import { getAllServices } from '@/lib/database';
import type { Service } from '@/lib/database';
import { Skeleton } from '@/components/ui/skeleton';
import { useLanguage } from '@/contexts/LanguageContext';

const AdminServices = () => {
  const { t } = useLanguage();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const servicesData = await getAllServices();
        setServices(servicesData);
      } catch (error) {
        console.error('Error fetching services:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const refreshData = async () => {
    const servicesData = await getAllServices();
    setServices(servicesData);
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="p-6 md:p-8">
          <div className="mb-8">
            <Skeleton className="h-10 w-64 mb-2" />
            <Skeleton className="h-4 w-48" />
          </div>
          <Skeleton className="h-96 w-full" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-6 md:p-8">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-instrument-serif text-foreground mb-2">
            {t('Services verwalten', 'Manage Services')}
          </h1>
          <p className="text-muted-foreground">
            {services.length} {t('Services insgesamt', 'Services total')}
          </p>
        </div>
        
        <ServicesTable services={services} onUpdate={refreshData} />
      </div>
    </AdminLayout>
  );
};

export default AdminServices;
