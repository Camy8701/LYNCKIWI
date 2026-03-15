import { useEffect, useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { getCurrentUser, signOut } from '@/lib/auth';
import { useLanguage } from '@/contexts/LanguageContext';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { language, setLanguage, t } = useLanguage();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUser() {
      try {
        const currentUser = await getCurrentUser();
        setUser(currentUser);
      } catch (error) {
        console.error('Error loading user:', error);
        navigate('/admin/login');
      } finally {
        setLoading(false);
      }
    }

    loadUser();
  }, [navigate]);

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/admin/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-foreground">Laden...</div>
      </div>
    );
  }

  const navigation = [
    { name: t('Dashboard', 'Dashboard'), href: '/admin', icon: '📊' },
    { name: t('Leads', 'Leads'), href: '/admin/leads', icon: '📋' },
    { name: t('Nachrichten', 'Messages'), href: '/admin/messages', icon: '✉️' },
    { name: t('Analytics', 'Analytics'), href: '/admin/analytics', icon: '📈' },
    { name: t('Unternehmen', 'Companies'), href: '/admin/companies', icon: '🏢' },
    { name: t('Services', 'Services'), href: '/admin/services', icon: '🔧' },
    { name: t('Werbeanzeigen', 'Ads'), href: '/admin/ads', icon: '📣' },
  ];

    return (
      <div className="min-h-screen bg-background flex">
        {/* Sidebar */}
        <aside className="hidden lg:flex flex-col w-64 bg-sidebar border-r border-sidebar-border">
          {/* Logo */}
          <div className="p-6 border-b border-sidebar-border">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-lg"></div>
              <div>
                <div className="text-sidebar-foreground font-semibold">KYSS Vision</div>
                <div className="text-xs text-muted-foreground">{t('Admin Dashboard', 'Admin Dashboard')}</div>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href || 
                             (item.href !== '/admin' && location.pathname.startsWith(item.href));

              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    isActive
                      ? 'bg-sidebar-primary text-sidebar-primary-foreground font-medium'
                      : 'text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground'
                  }`}
                >
                  <span className="text-xl">{item.icon}</span>
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* User Info + Logout */}
          <div className="p-4 border-t border-sidebar-border space-y-3">
            {/* Language Toggle */}
            <button
              onClick={() => setLanguage(language === 'de' ? 'en' : 'de')}
              className="w-full px-3 py-2 text-xs font-medium text-muted-foreground hover:text-foreground bg-white/[0.03] border border-white/[0.06] rounded-lg transition-colors"
            >
              {language === 'de' ? '🇬🇧 English' : '🇩🇪 Deutsch'}
            </button>
            
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                <span className="text-sm font-semibold text-primary">
                  {user?.email?.[0].toUpperCase() || 'A'}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm text-sidebar-foreground truncate">{user?.email || t('Admin', 'Admin')}</div>
                <div className="text-xs text-muted-foreground">{t('Administrator', 'Administrator')}</div>
              </div>
            </div>
            <button
              onClick={handleSignOut}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-white/[0.03] dark:bg-white/[0.03] border border-sidebar-border rounded-lg text-sm text-muted-foreground hover:text-sidebar-foreground hover:bg-sidebar-accent transition-all"
            >
            <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
              <polyline points="16 17 21 12 16 7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
            {t('Abmelden', 'Sign Out')}
          </button>
        </div>
      </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          {/* Top Bar (Mobile) */}
          <div className="lg:hidden bg-sidebar border-b border-sidebar-border p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-lg"></div>
                <span className="text-sidebar-foreground font-semibold">KYSS Admin</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setLanguage(language === 'de' ? 'en' : 'de')}
                  className="px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground bg-white/[0.03] border border-white/[0.06] rounded-lg transition-colors"
                >
                  {language === 'de' ? 'EN' : 'DE'}
                </button>
                <button
                  onClick={handleSignOut}
                  className="text-muted-foreground hover:text-sidebar-foreground text-sm"
                >
                  {t('Abmelden', 'Sign Out')}
                </button>
              </div>
            </div>
          </div>

        {children}
      </main>
    </div>
  );
};

export default AdminLayout;
