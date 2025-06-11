import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Badge } from "./ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { Plus, MapPin, Clock, Car, User, AlertTriangle } from "lucide-react"
import { useLocalStorage } from "../hooks/use-local-storage"
import type { Trip, Driver, Vehicle } from "../types"

export function TripsManagement() {
  const [trips, setTrips] = useLocalStorage<Trip[]>("trips", [])
  const [drivers] = useLocalStorage<Driver[]>("drivers", [])
  const [vehicles] = useLocalStorage<Vehicle[]>("vehicles", [])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [formData, setFormData] = useState({
    origin: "",
    destination: "",
    date: "",
    vehicleId: "",
  })

  const resetForm = () => {
    setFormData({
      origin: "",
      destination: "",
      date: "",
      vehicleId: "",
    })
  }

  const getNextDriver = (): Driver | null => {
    const availableDrivers = drivers.filter((d) => d.status === "available")
    if (availableDrivers.length === 0) return null

    // Encontra o motorista com menor número de viagens
    return availableDrivers.reduce((prev, current) => (prev.totalTrips <= current.totalTrips ? prev : current))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const nextDriver = getNextDriver()
    if (!nextDriver) {
      alert("Não há motoristas disponíveis no momento.")
      return
    }

    const newTrip: Trip = {
      id: `trip-${Date.now()}`,
      origin: formData.origin,
      destination: formData.destination,
      date: new Date(formData.date),
      driverId: nextDriver.id,
      vehicleId: formData.vehicleId,
      status: "pending",
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    setTrips((prev) => [...prev, newTrip])
    setIsDialogOpen(false)
    resetForm()
  }

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

  const getDriverName = (driverId?: string) => {
    if (!driverId) return "Não atribuído"
    const driver = drivers.find((d) => d.id === driverId)
    return driver?.name || "Motorista não encontrado"
  }

  const getVehicleInfo = (vehicleId?: string) => {
    if (!vehicleId) return "Não atribuído"
    const vehicle = vehicles.find((v) => v.id === vehicleId)
    return vehicle ? `${vehicle.model} (${vehicle.plate})` : "Veículo não encontrado"
  }

  const availableVehicles = vehicles.filter((v) => v.status === "available")

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="flex flex-left text-2xl font-bold">Gestão de Viagens</h2>
          <p className="text-gray-600">Crie e acompanhe as viagens dos motoristas</p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="h-4 w-4 mr-2" />
              Nova Viagem
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Nova Viagem</DialogTitle>
              <DialogDescription>
                Crie uma nova viagem. O sistema atribuirá automaticamente ao próximo motorista da fila.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="origin">Local de Partida</Label>
                <Input
                  id="origin"
                  value={formData.origin}
                  onChange={(e) => setFormData({ ...formData, origin: e.target.value })}
                  placeholder="Ex: São Paulo - SP"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="destination">Destino</Label>
                <Input
                  id="destination"
                  value={formData.destination}
                  onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                  placeholder="Ex: Rio de Janeiro - RJ"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="date">Data da Viagem</Label>
                <Input
                  id="date"
                  type="datetime-local"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="vehicleId">Veículo</Label>
                <Select
                  value={formData.vehicleId}
                  onValueChange={(value) => setFormData({ ...formData, vehicleId: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um veículo" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableVehicles.map((vehicle) => (
                      <SelectItem key={vehicle.id} value={vehicle.id}>
                        {vehicle.model} - {vehicle.plate}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {availableVehicles.length === 0 && (
                <div className="flex items-center gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <AlertTriangle className="h-4 w-4 text-yellow-600" />
                  <span className="text-sm text-yellow-800">Nenhum veículo disponível no momento</span>
                </div>
              )}

              <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={availableVehicles.length === 0}>
                  Criar Viagem
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-yellow-500" />
              <div>
                <p className="text-sm font-medium">Pendentes</p>
                <p className="text-2xl font-bold">{trips.filter((t) => t.status === "pending").length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Car className="h-4 w-4 text-blue-500" />
              <div>
                <p className="text-sm font-medium">Em Andamento</p>
                <p className="text-2xl font-bold">{trips.filter((t) => t.status === "in_progress").length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-green-500" />
              <div>
                <p className="text-sm font-medium">Concluídas</p>
                <p className="text-2xl font-bold">{trips.filter((t) => t.status === "completed").length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-red-500" />
              <div>
                <p className="text-sm font-medium">Recusadas</p>
                <p className="text-2xl font-bold">{trips.filter((t) => t.status === "refused").length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        {trips.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <MapPin className="h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma viagem cadastrada</h3>
              <p className="text-gray-600 text-center mb-4">Comece criando a primeira viagem para seus motoristas</p>
              <Button onClick={() => setIsDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Criar Viagem
              </Button>
            </CardContent>
          </Card>
        ) : (
          trips.map((trip) => (
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
                        <User className="h-4 w-4" />
                        {getDriverName(trip.driverId)}
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
  )
}
