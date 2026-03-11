import { ReactNode } from "react";
import Sidebar from "@/components/Sidebar";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import Breadcrumb from "@/components/Breadcrumb";

interface BreadcrumbItem {
  label: string;
  href: string;
}

interface PageLayoutProps {
  children: ReactNode;
  breadcrumbItems?: BreadcrumbItem[];
}

const PageLayout = ({ children, breadcrumbItems }: PageLayoutProps) => {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <Navigation />
        <Breadcrumb customItems={breadcrumbItems} />
        {children}
        <Footer />
      </main>
    </div>
  );
};

export default PageLayout;
