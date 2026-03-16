// KYSS Vision — WorkerLayout (US-027)
import WorkerSidebar from './WorkerSidebar'

interface WorkerLayoutProps {
  children: React.ReactNode
}

export default function WorkerLayout({ children }: WorkerLayoutProps) {
  return (
    <div className="flex min-h-screen bg-background">
      <WorkerSidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-5xl mx-auto px-6 py-8">
          {children}
        </div>
      </main>
    </div>
  )
}
