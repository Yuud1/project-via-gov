import { Navigation } from "../../components/navigation"
import { VehiclesManagement } from "../../components/vehicles-management"

export default function AdminVehicles() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <main className="max-w-7xl mx-auto px-4 lg:px-8 py-8">
        <VehiclesManagement />
      </main>
    </div>
  )
}
