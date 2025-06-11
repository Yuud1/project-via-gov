import { Navigation } from "../../components/navigation"
import { DriversManagement } from "../../components/drivers-management"

export default function AdminDrivers() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <main className="max-w-7xl mx-auto px-4 lg:px-8 py-8">
        <DriversManagement />
      </main>
    </div>
  )
}
