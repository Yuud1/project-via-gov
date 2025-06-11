import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs"
import { Badge } from "./ui/badge"
import { Users, Car, MapPin, BarChart3, LogOut, Clock, CheckCircle, XCircle, AlertCircle } from "lucide-react"
import { DriversManagement } from "./drivers-management"
import { VehiclesManagement } from "./vehicles-management"
import { TripsManagement } from "./trips-management"
import { ReportsView } from "./reports-view"
import { useLocalStorage } from "../hooks/use-local-storage"
import type { Driver, Vehicle, Trip } from "../types"

interface AdminDashboardProps {
  onLogout: () => void
}

export function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const [drivers] = useLocalStorage<Driver[]>("drivers", [])
  const [vehicles] = useLocalStorage<Vehicle[]>("vehicles", [])
  const [trips] = useLocalStorage<Trip[]>("trips", [])

  const stats = {
    totalDrivers: drivers.length,
    availableDrivers: drivers.filter((d) => d.status === "available").length,
    totalVehicles: vehicles.length,
    availableVehicles: vehicles.filter((v) => v.status === "available").length,
    pendingTrips: trips.filter((t) => t.status === "pending").length,
    activeTrips: trips.filter((t) => t.status === "in_progress").length,
    completedTrips: trips.filter((t) => t.status === "completed").length,
    refusedTrips: trips.filter((t) => t.status === "refused").length,
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b rounded-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="w-full">
              <h1 className="text-xl md:text-2xl font-bold text-gray-900">Painel Administrativo</h1>
              <p className="text-xs md:text-sm text-gray-600 truncate">Gestão de motoristas e viagens</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        <div className="grid grid-cols-2 gap-4 sm:gap-6 mb-6 md:mb-8">
          <Card className="h-full">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Motoristas</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-xl md:text-2xl font-bold">{stats.totalDrivers}</div>
              <p className="text-xs text-muted-foreground">{stats.availableDrivers} disp.</p>
            </CardContent>
          </Card>

          <Card className="h-full">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Veículos</CardTitle>
              <Car className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-xl md:text-2xl font-bold">{stats.totalVehicles}</div>
              <p className="text-xs text-muted-foreground">{stats.availableVehicles} disp.</p>
            </CardContent>
          </Card>

          <Card className="h-full">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Viagens Ativas</CardTitle>
              <MapPin className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-xl md:text-2xl font-bold">{stats.activeTrips}</div>
              <p className="text-xs text-muted-foreground">{stats.pendingTrips} pend.</p>
            </CardContent>
          </Card>

          <Card className="h-full">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Concluídas</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-xl md:text-2xl font-bold">{stats.completedTrips}</div>
              <p className="text-xs text-muted-foreground">{stats.refusedTrips} rec.</p>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-6 md:mb-8">
          <CardHeader>
            <CardTitle className="text-lg md:text-xl">Status Atual</CardTitle>
            <CardDescription className="text-xs md:text-sm">Operações em tempo real</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-yellow-500" />
                <span className="text-xs sm:text-sm">Pendentes</span>
                <Badge variant="secondary" className="ml-auto">{stats.pendingTrips}</Badge>
              </div>
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-blue-500" />
                <span className="text-xs sm:text-sm">Em Andamento</span>
                <Badge variant="default" className="ml-auto">{stats.activeTrips}</Badge>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-xs sm:text-sm">Concluídas</span>
                <Badge variant="outline" className="ml-auto">{stats.completedTrips}</Badge>
              </div>
              <div className="flex items-center gap-2">
                <XCircle className="h-4 w-4 text-red-500" />
                <span className="text-xs sm:text-sm">Recusadas</span>
                <Badge variant="destructive" className="ml-auto">{stats.refusedTrips}</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content Tabs */}
        <Tabs defaultValue="trips" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="trips" className="text-xs sm:text-sm">Viagens</TabsTrigger>
            <TabsTrigger value="drivers" className="text-xs sm:text-sm">Motoristas</TabsTrigger>
            <TabsTrigger value="vehicles" className="text-xs sm:text-sm">Veículos</TabsTrigger>
            <TabsTrigger value="reports" className="text-xs sm:text-sm">Relatórios</TabsTrigger>
          </TabsList>

          <TabsContent value="trips">
            <TripsManagement />
          </TabsContent>

          <TabsContent value="drivers">
            <DriversManagement />
          </TabsContent>

          <TabsContent value="vehicles">
            <VehiclesManagement />
          </TabsContent>

          <TabsContent value="reports">
            <ReportsView />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}