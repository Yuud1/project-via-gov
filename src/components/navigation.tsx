import { useNavigate, useLocation } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { LogOut, Home, Users, Car, MapPin, BarChart3 } from "lucide-react"
import { useAuth } from "../context/AuthContext"

export function Navigation() {
  const navigate = useNavigate()
  const location = useLocation()
  const { userType, logout, user } = useAuth()

  const handleLogout = () => {
    logout()
    navigate("/")
  }

  const adminRoutes = [
    { path: "/admin", label: "Dashboard", icon: Home },
    { path: "/admin/drivers", label: "Motoristas", icon: Users },
    { path: "/admin/vehicles", label: "Veículos", icon: Car },
    { path: "/admin/trips", label: "Viagens", icon: MapPin },
    { path: "/admin/reports", label: "Relatórios", icon: BarChart3 },
  ]

  const driverRoutes = [
    { path: "/driver", label: "Meu Painel", icon: Home },
    { path: "/driver/trips", label: "Minhas Viagens", icon: MapPin },
  ]

  const routes = userType === "admin" ? adminRoutes : driverRoutes

  return (
    <nav className="bg-white shadow-sm border-b px-5 sm:p-10px">
      <div className="max-w-7xl mx-20 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-8">
            <div>
                <img src="/logo.png" className="w-[50px]" alt="" />
            </div>

            <div className="hidden md:flex space-x-4">
              {routes.map((route) => {
                const Icon = route.icon
                const isActive = location.pathname === route.path

                return (
                  <Button
                    key={route.path}
                    variant={isActive ? "default" : "ghost"}
                    onClick={() => navigate(route.path)}
                    className="flex items-center gap-2"
                  >
                    <Icon className="h-4 w-4" />
                    {route.label}
                  </Button>
                )
              })}
            </div>
          </div>
            <Button variant="outline" onClick={handleLogout} className="flex items-center gap-2">
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Sair</span>
            </Button>
        </div>
      </div>
    </nav>
  )
}
