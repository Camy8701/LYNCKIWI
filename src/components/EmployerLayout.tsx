// KYSS Vision — EmployerLayout (US-027)
import EmployerSidebar from './EmployerSidebar'

interface EmployerLayoutProps {
  children: React.ReactNode
}

export default function EmployerLayout({ children }: EmployerLayoutProps) {
  return (
    <div className="flex min-h-screen bg-background">
      <EmployerSidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-5xl mx-auto px-6 py-8">
          {children}
        </div>
      </main>
    </div>
  )
}
