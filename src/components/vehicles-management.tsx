import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Badge } from "./ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { Plus, Edit, Trash2, Car, Gauge } from "lucide-react"
import { useLocalStorage } from "../hooks/use-local-storage"
import type { Vehicle } from "../types"

export function VehiclesManagement() {
  const [vehicles, setVehicles] = useLocalStorage<Vehicle[]>("vehicles", [])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null)
  const [formData, setFormData] = useState({
    model: "",
    plate: "",
    currentKm: 0,
    status: "available" as Vehicle["status"],
  })

  const resetForm = () => {
    setFormData({
      model: "",
      plate: "",
      currentKm: 0,
      status: "available",
    })
    setEditingVehicle(null)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (editingVehicle) {
      // Update existing vehicle
      setVehicles((prev) =>
        prev.map((vehicle) => (vehicle.id === editingVehicle.id ? { ...vehicle, ...formData } : vehicle)),
      )
    } else {
      // Add new vehicle
      const newVehicle: Vehicle = {
        id: `vehicle-${Date.now()}`,
        ...formData,
        createdAt: new Date(),
      }
      setVehicles((prev) => [...prev, newVehicle])
    }

    setIsDialogOpen(false)
    resetForm()
  }

  const handleEdit = (vehicle: Vehicle) => {
    setEditingVehicle(vehicle)
    setFormData({
      model: vehicle.model,
      plate: vehicle.plate,
      currentKm: vehicle.currentKm,
      status: vehicle.status,
    })
    setIsDialogOpen(true)
  }

  const handleDelete = (vehicleId: string) => {
    if (confirm("Tem certeza que deseja excluir este veículo?")) {
      setVehicles((prev) => prev.filter((vehicle) => vehicle.id !== vehicleId))
    }
  }

  const getStatusBadge = (status: Vehicle["status"]) => {
    const statusConfig = {
      available: { label: "Disponível", variant: "default" as const },
      on_trip: { label: "Em Viagem", variant: "secondary" as const },
      maintenance: { label: "Manutenção", variant: "destructive" as const },
    }

    const config = statusConfig[status]
    return <Badge variant={config.variant}>{config.label}</Badge>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="flex flex-left text-2xl font-bold">Gestão de Veículos</h2>
          <p className="text-gray-600">Cadastre e gerencie a frota de veículos</p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="h-4 w-4 mr-2" />
              Novo Veículo
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>{editingVehicle ? "Editar Veículo" : "Novo Veículo"}</DialogTitle>
              <DialogDescription>
                {editingVehicle ? "Atualize as informações do veículo" : "Preencha os dados do novo veículo"}
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="model">Modelo</Label>
                <Input
                  id="model"
                  value={formData.model}
                  onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                  placeholder="Ex: Honda Civic 2020"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="plate">Placa</Label>
                <Input
                  id="plate"
                  value={formData.plate}
                  onChange={(e) => setFormData({ ...formData, plate: e.target.value.toUpperCase() })}
                  placeholder="ABC-1234"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="currentKm">Quilometragem Atual</Label>
                <Input
                  id="currentKm"
                  type="number"
                  value={formData.currentKm}
                  onChange={(e) => setFormData({ ...formData, currentKm: Number.parseInt(e.target.value) || 0 })}
                  min="0"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value: Vehicle["status"]) => setFormData({ ...formData, status: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="available">Disponível</SelectItem>
                    <SelectItem value="on_trip">Em Viagem</SelectItem>
                    <SelectItem value="maintenance">Manutenção</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit">{editingVehicle ? "Atualizar" : "Cadastrar"}</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {vehicles.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Car className="h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum veículo cadastrado</h3>
              <p className="text-gray-600 text-center mb-4">Comece cadastrando o primeiro veículo da sua frota</p>
              <Button onClick={() => setIsDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Cadastrar Veículo
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {vehicles.map((vehicle) => (
              <Card key={vehicle.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Car className="h-5 w-5" />
                        {vehicle.model}
                      </CardTitle>
                      <CardDescription>Placa: {vehicle.plate}</CardDescription>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      {getStatusBadge(vehicle.status)}
                      <div className="flex gap-1">
                        <Button variant="outline" size="sm" onClick={() => handleEdit(vehicle)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleDelete(vehicle.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    <Gauge className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">{vehicle.currentKm.toLocaleString("pt-BR")} km</span>
                  </div>
                  {vehicle.driverId && (
                    <div className="mt-2 text-sm text-gray-600">
                      <span className="font-medium">Em uso por:</span> Motorista {vehicle.driverId}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
