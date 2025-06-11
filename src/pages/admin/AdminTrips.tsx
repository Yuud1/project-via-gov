import { Navigation } from "../../components/navigation"
import { TripsManagement } from "../../components/trips-management"

export default function AdminTrips() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <main className="max-w-7xl mx-auto px-4 lg:px-8 py-8">
        <TripsManagement />
      </main>
    </div>
  )
}
