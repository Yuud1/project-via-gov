import { Navigation } from "../../components/navigation"
import { AdminDashboard as AdminDashboardComponent } from "../../components/admin-dashboard"

export default function AdminDashboard() {
  function handleLogout() {
    console.log("Usuário deslogado")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AdminDashboardComponent onLogout={handleLogout} />
      </main>
    </div>
  )
}
