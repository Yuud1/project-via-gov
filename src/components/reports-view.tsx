import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Badge } from "./ui/badge"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import { Users, Car, TrendingUp, TrendingDown } from "lucide-react"
import { useLocalStorage } from "../hooks/use-local-storage"
import type { Driver, Vehicle, Trip } from "../types"

export function ReportsView() {
  const [drivers] = useLocalStorage<Driver[]>("drivers", [])
  const [vehicles] = useLocalStorage<Vehicle[]>("vehicles", [])
  const [trips] = useLocalStorage<Trip[]>("trips", [])

  // Dados para gráficos
  const driverTripsData = drivers.map((driver) => ({
    name: driver.name.split(" ")[0], // Primeiro nome
    viagens: trips.filter((t) => t.driverId === driver.id && t.status === "completed").length,
    recusas: trips.filter((t) => t.driverId === driver.id && t.status === "refused").length,
  }))

  const tripStatusData = [
    { name: "Concluídas", value: trips.filter((t) => t.status === "completed").length, color: "#10b981" },
    { name: "Em Andamento", value: trips.filter((t) => t.status === "in_progress").length, color: "#3b82f6" },
    { name: "Pendentes", value: trips.filter((t) => t.status === "pending").length, color: "#f59e0b" },
    { name: "Recusadas", value: trips.filter((t) => t.status === "refused").length, color: "#ef4444" },
  ]

  const vehicleUsageData = vehicles.map((vehicle) => ({
    name: vehicle.plate,
    viagens: trips.filter((t) => t.vehicleId === vehicle.id && t.status === "completed").length,
    km: vehicle.currentKm,
  }))

  // Estatísticas gerais
  const totalTrips = trips.length
  const completedTrips = trips.filter((t) => t.status === "completed").length
  const refusedTrips = trips.filter((t) => t.status === "refused").length
  const completionRate = totalTrips > 0 ? ((completedTrips / totalTrips) * 100).toFixed(1) : "0"
  const refusalRate = totalTrips > 0 ? ((refusedTrips / totalTrips) * 100).toFixed(1) : "0"

  // Top motoristas
  const topDrivers = [...drivers]
    .sort((a, b) => {
      const aTrips = trips.filter((t) => t.driverId === a.id && t.status === "completed").length
      const bTrips = trips.filter((t) => t.driverId === b.id && t.status === "completed").length
      return bTrips - aTrips
    })
    .slice(0, 5)

  return (
    <div className="space-y-6">
      <div>
        <h2 className="flex flex-left text-2xl font-bold">Relatórios e Análises</h2>
        <p className="flex flex- left text-gray-600">Acompanhe o desempenho e estatísticas do sistema</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Conclusão</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{completionRate}%</div>
            <p className="text-xs text-muted-foreground">
              {completedTrips} de {totalTrips} viagens
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Recusa</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{refusalRate}%</div>
            <p className="text-xs text-muted-foreground">{refusedTrips} viagens recusadas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Motoristas Ativos</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{drivers.filter((d) => d.status !== "unavailable").length}</div>
            <p className="text-xs text-muted-foreground">de {drivers.length} cadastrados</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Veículos Disponíveis</CardTitle>
            <Car className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{vehicles.filter((v) => v.status === "available").length}</div>
            <p className="text-xs text-muted-foreground">de {vehicles.length} cadastrados</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Viagens por Motorista</CardTitle>
            <CardDescription>Distribuição de viagens realizadas e recusadas</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={driverTripsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="viagens" fill="#3b82f6" name="Viagens" />
                <Bar dataKey="recusas" fill="#ef4444" name="Recusas" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Status das Viagens</CardTitle>
            <CardDescription>Distribuição geral do status das viagens</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={tripStatusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {tripStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Top Motoristas</CardTitle>
            <CardDescription>Motoristas com mais viagens concluídas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topDrivers.map((driver, index) => {
                const completedTrips = trips.filter((t) => t.driverId === driver.id && t.status === "completed").length
                const refusedTrips = trips.filter((t) => t.driverId === driver.id && t.status === "refused").length

                return (
                  <div key={driver.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-bold text-blue-600">#{index + 1}</span>
                      </div>
                      <div>
                        <p className="font-medium">{driver.name}</p>
                        <p className="text-sm text-gray-600">
                          {completedTrips} viagens • {refusedTrips} recusas
                        </p>
                      </div>
                    </div>
                    <Badge variant={driver.status === "available" ? "default" : "secondary"}>
                      {driver.status === "available"
                        ? "Disponível"
                        : driver.status === "on_trip"
                          ? "Em Viagem"
                          : "Indisponível"}
                    </Badge>
                  </div>
                )
              })}
              {topDrivers.length === 0 && <p className="text-center text-gray-500 py-4">Nenhum motorista encontrado</p>}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Uso de Veículos</CardTitle>
            <CardDescription>Estatísticas de utilização da frota</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {vehicleUsageData.slice(0, 5).map((vehicle) => (
                <div key={vehicle.name} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Car className="h-5 w-5 text-gray-500" />
                    <div>
                      <p className="font-medium">{vehicle.name}</p>
                      <p className="text-sm text-gray-600">{vehicle.viagens} viagens realizadas</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{vehicle.km.toLocaleString("pt-BR")} km</p>
                    <p className="text-xs text-gray-600">Quilometragem</p>
                  </div>
                </div>
              ))}
              {vehicleUsageData.length === 0 && (
                <p className="text-center text-gray-500 py-4">Nenhum veículo encontrado</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {refusedTrips > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Motivos de Recusa</CardTitle>
            <CardDescription>Últimas viagens recusadas e seus motivos</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {trips
                .filter((t) => t.status === "refused" && t.refusalReason)
                .slice(0, 5)
                .map((trip) => {
                  const driver = drivers.find((d) => d.id === trip.driverId)
                  return (
                    <div key={trip.id} className="p-3 border rounded-lg bg-red-50">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-medium">
                            {trip.origin} → {trip.destination}
                          </p>
                          <p className="text-sm text-gray-600">
                            {driver?.name} • {new Date(trip.date).toLocaleDateString("pt-BR")}
                          </p>
                        </div>
                        <Badge variant="destructive">Recusada</Badge>
                      </div>
                      <p className="text-sm text-red-800">
                        <span className="font-medium">Motivo:</span> {trip.refusalReason}
                      </p>
                    </div>
                  )
                })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
