import { Navigation } from "../../components/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Clock, Car } from "lucide-react"
import { useLocalStorage } from "../../hooks/use-local-storage"
import type { Trip, Driver, Vehicle } from "../../types"

export default function DriverTrips() {
  const [trips] = useLocalStorage<Trip[]>("trips", [])
  const [drivers] = useLocalStorage<Driver[]>("drivers", [])
  const [vehicles] = useLocalStorage<Vehicle[]>("vehicles", [])

  const currentDriverId = "driver-1"
  const myTrips = trips.filter((trip) => trip.driverId === currentDriverId)

  const getStatusBadge = (status: Trip["status"]) => {
    const statusConfig = {
      pending: { label: "Pendente", variant: "secondary" as const },
      accepted: { label: "Aceita", variant: "default" as const },
      refused: { label: "Recusada", variant: "destructive" as const },
      in_progress: { label: "Em Andamento", variant: "default" as const },
      completed: { label: "Concluída", variant: "outline" as const },
    }

    const config = statusConfig[status]
    return <Badge variant={config.variant}>{config.label}</Badge>
  }

  const getVehicleInfo = (vehicleId?: string) => {
    if (!vehicleId) return "Não atribuído"
    const vehicle = vehicles.find((v) => v.id === vehicleId)
    return vehicle ? `${vehicle.model} (${vehicle.plate})` : "Veículo não encontrado"
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <main className="max-w-7xl mx-auto px-4 lg:px-8 py-8">
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold">Minhas Viagens</h2>
            <p className="text-gray-600">Histórico completo das suas viagens</p>
          </div>

          <div className="space-y-4">
            {myTrips.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <MapPin className="h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma viagem encontrada</h3>
                  <p className="text-gray-600 text-center">Você ainda não possui viagens atribuídas</p>
                </CardContent>
              </Card>
            ) : (
              myTrips.map((trip) => (
                <Card key={trip.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="space-y-2">
                        <CardTitle className="flex items-center gap-2">
                          <MapPin className="h-5 w-5" />
                          {trip.origin} → {trip.destination}
                        </CardTitle>
                        <CardDescription className="flex items-center gap-4">
                          <span className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {new Date(trip.date).toLocaleString("pt-BR")}
                          </span>
                          <span className="flex items-center gap-1">
                            <Car className="h-4 w-4" />
                            {getVehicleInfo(trip.vehicleId)}
                          </span>
                        </CardDescription>
                      </div>
                      {getStatusBadge(trip.status)}
                    </div>
                  </CardHeader>
                  {trip.refusalReason && (
                    <CardContent>
                      <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                        <p className="text-sm text-red-800">
                          <span className="font-medium">Motivo da recusa:</span> {trip.refusalReason}
                        </p>
                      </div>
                    </CardContent>
                  )}
                </Card>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
