import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { Badge } from "./ui/badge"
import { Textarea } from "./ui/textarea"
import { Label } from "./ui/label"
import { LogOut, MapPin, Clock, Car, CheckCircle, XCircle, AlertTriangle } from "lucide-react"
import { useLocalStorage } from "../hooks/use-local-storage"
import type { Trip, Driver } from "../types"

interface DriverDashboardProps {
  onLogout: () => void
}

export function DriverDashboard({ onLogout }: DriverDashboardProps) {
  const [trips, setTrips] = useLocalStorage<Trip[]>("trips", [])
  const [drivers] = useLocalStorage<Driver[]>("drivers", [])
  const [refusalReason, setRefusalReason] = useState("")
  const [selectedTripId, setSelectedTripId] = useState<string | null>(null)

  // Simulando motorista logado (em produção, viria do contexto de autenticação)
  const currentDriverId = "driver-1"
  const currentDriver = drivers.find((d) => d.id === currentDriverId)

  const myTrips = trips.filter((trip) => trip.driverId === currentDriverId)
  const pendingTrips = myTrips.filter((trip) => trip.status === "pending")
  const activeTrips = myTrips.filter((trip) => trip.status === "in_progress")
  const completedTrips = myTrips.filter((trip) => trip.status === "completed")

  const handleAcceptTrip = (tripId: string) => {
    setTrips((prevTrips) =>
      prevTrips.map((trip) =>
        trip.id === tripId ? { ...trip, status: "accepted" as const, updatedAt: new Date() } : trip,
      ),
    )
  }

  const handleRefuseTrip = (tripId: string) => {
    if (!refusalReason.trim()) {
      alert("Por favor, informe o motivo da recusa.")
      return
    }

    setTrips((prevTrips) =>
      prevTrips.map((trip) =>
        trip.id === tripId
          ? {
              ...trip,
              status: "refused" as const,
              refusalReason,
              updatedAt: new Date(),
            }
          : trip,
      ),
    )

    setRefusalReason("")
    setSelectedTripId(null)
  }

  const handleStartTrip = (tripId: string) => {
    setTrips((prevTrips) =>
      prevTrips.map((trip) =>
        trip.id === tripId ? { ...trip, status: "in_progress" as const, updatedAt: new Date() } : trip,
      ),
    )
  }

  const handleCompleteTrip = (tripId: string) => {
    setTrips((prevTrips) =>
      prevTrips.map((trip) =>
        trip.id === tripId ? { ...trip, status: "completed" as const, updatedAt: new Date() } : trip,
      ),
    )
  }

  const getStatusBadge = (status: Trip["status"]) => {
    const statusConfig = {
      pending: { label: "Pendente", variant: "secondary" as const, icon: Clock },
      accepted: { label: "Aceita", variant: "default" as const, icon: CheckCircle },
      refused: { label: "Recusada", variant: "destructive" as const, icon: XCircle },
      in_progress: { label: "Em Andamento", variant: "default" as const, icon: AlertTriangle },
      completed: { label: "Concluída", variant: "outline" as const, icon: CheckCircle },
    }

    const config = statusConfig[status]
    const Icon = config.icon

    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className="h-3 w-3" />
        {config.label}
      </Badge>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b rounded-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex flex-col">
              <h1 className="text-2xl font-bold text-gray-900">Painel do Motorista</h1>
              <p className="text-sm text-gray-600">Bem-vindo, {currentDriver?.name || "Motorista"}</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-8">
        {/* Status Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Viagens Pendentes</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingTrips.length}</div>
              <p className="text-xs text-muted-foreground">Aguardando sua resposta</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Em Andamento</CardTitle>
              <Car className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeTrips.length}</div>
              <p className="text-xs text-muted-foreground">Viagens ativas</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Concluídas</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{completedTrips.length}</div>
              <p className="text-xs text-muted-foreground">Total de viagens</p>
            </CardContent>
          </Card>
        </div>

        {pendingTrips.length > 0 && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-yellow-500" />
                Viagens Pendentes
              </CardTitle>
              <CardDescription>Você tem {pendingTrips.length} viagem(ns) aguardando sua resposta</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {pendingTrips.map((trip) => (
                <div key={trip.id} className="border rounded-lg p-4 bg-yellow-50">
                  <div className="flex justify-between items-start mb-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-gray-500" />
                        <span className="font-medium">
                          {trip.origin} → {trip.destination}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Clock className="h-4 w-4" />
                        <span>{new Date(trip.date).toLocaleDateString("pt-BR")}</span>
                      </div>
                    </div>
                    {getStatusBadge(trip.status)}
                  </div>

                  <div className="flex gap-2">
                    <Button onClick={() => handleAcceptTrip(trip.id)} className="flex-1">
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Aceitar
                    </Button>
                    <Button variant="destructive" onClick={() => setSelectedTripId(trip.id)} className="flex-1">
                      <XCircle className="h-4 w-4 mr-2" />
                      Recusar
                    </Button>
                  </div>

                  {selectedTripId === trip.id && (
                    <div className="mt-4 space-y-3 border-t pt-4">
                      <Label htmlFor="refusal-reason">Motivo da recusa *</Label>
                      <Textarea
                        id="refusal-reason"
                        placeholder="Informe o motivo da recusa..."
                        value={refusalReason}
                        onChange={(e) => setRefusalReason(e.target.value)}
                      />
                      <div className="flex gap-2">
                        <Button
                          variant="destructive"
                          onClick={() => handleRefuseTrip(trip.id)}
                          disabled={!refusalReason.trim()}
                        >
                          Confirmar Recusa
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => {
                            setSelectedTripId(null)
                            setRefusalReason("")
                          }}
                        >
                          Cancelar
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {activeTrips.length > 0 && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Car className="h-5 w-5 text-blue-500" />
                Viagens em Andamento
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {activeTrips.map((trip) => (
                <div key={trip.id} className="border rounded-lg p-4 bg-blue-50">
                  <div className="flex justify-between items-start mb-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-gray-500" />
                        <span className="font-medium">
                          {trip.origin} → {trip.destination}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Clock className="h-4 w-4" />
                        <span>{new Date(trip.date).toLocaleDateString("pt-BR")}</span>
                      </div>
                    </div>
                    {getStatusBadge(trip.status)}
                  </div>

                  <Button onClick={() => handleCompleteTrip(trip.id)} className="w-full">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Finalizar Viagem
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Histórico de Viagens</CardTitle>
            <CardDescription>Suas últimas viagens realizadas</CardDescription>
          </CardHeader>
          <CardContent>
            {myTrips.length === 0 ? (
              <p className="text-center text-gray-500 py-8">Nenhuma viagem encontrada</p>
            ) : (
              <div className="space-y-4">
                {myTrips.slice(0, 10).map((trip) => (
                  <div key={trip.id} className="flex justify-between items-center p-3 border rounded-lg">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-gray-500" />
                        <span className="font-medium">
                          {trip.origin} → {trip.destination}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Clock className="h-4 w-4" />
                        <span>{new Date(trip.date).toLocaleDateString("pt-BR")}</span>
                      </div>
                      {trip.refusalReason && (
                        <p className="text-sm text-red-600">Motivo da recusa: {trip.refusalReason}</p>
                      )}
                    </div>
                    {getStatusBadge(trip.status)}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
