import { Navigation } from "../../components/navigation"
import { DriverDashboard as DriverDashboardComponent } from "../../components/driver-dashboard"

export default function DriverDashboard() {
  function handleLogout() {
    console.log("Usuário (motorista) deslogado")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <main className="max-w-7xl mx-auto px-4 lg:px-8 py-8">
        <DriverDashboardComponent onLogout={handleLogout} />
      </main>
    </div>
  )
}
