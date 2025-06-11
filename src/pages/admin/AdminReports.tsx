import { Navigation } from "../../components/navigation"
import { ReportsView } from "../../components/reports-view"

export default function AdminReports() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <main className="max-w-7xl mx-auto px-4 lg:px-8 py-8">
        <ReportsView />
      </main>
    </div>
  )
}
