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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ">
          <div className="flex justify-between items-center py-4 ">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Painel Administrativo</h1>
              <p className="text-sm text-gray-600">Gestão completa de motoristas e viagens</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Motoristas</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalDrivers}</div>
              <p className="text-xs text-muted-foreground">{stats.availableDrivers} disponíveis</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Veículos</CardTitle>
              <Car className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalVehicles}</div>
              <p className="text-xs text-muted-foreground">{stats.availableVehicles} disponíveis</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Viagens Ativas</CardTitle>
              <MapPin className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activeTrips}</div>
              <p className="text-xs text-muted-foreground">{stats.pendingTrips} pendentes</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Concluídas</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.completedTrips}</div>
              <p className="text-xs text-muted-foreground">{stats.refusedTrips} recusadas</p>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Status Atual do Sistema</CardTitle>
            <CardDescription>Visão geral das operações em tempo real</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-yellow-500" />
                <span className="text-sm">Pendentes</span>
                <Badge variant="secondary">{stats.pendingTrips}</Badge>
              </div>
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-blue-500" />
                <span className="text-sm">Em Andamento</span>
                <Badge variant="default">{stats.activeTrips}</Badge>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm">Concluídas</span>
                <Badge variant="outline">{stats.completedTrips}</Badge>
              </div>
              <div className="flex items-center gap-2">
                <XCircle className="h-4 w-4 text-red-500" />
                <span className="text-sm">Recusadas</span>
                <Badge variant="destructive">{stats.refusedTrips}</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content Tabs */}
        <Tabs defaultValue="trips" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="trips">Viagens</TabsTrigger>
            <TabsTrigger value="drivers">Motoristas</TabsTrigger>
            <TabsTrigger value="vehicles">Veículos</TabsTrigger>
            <TabsTrigger value="reports">Relatórios</TabsTrigger>
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
