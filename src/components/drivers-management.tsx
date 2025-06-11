import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Badge } from "./ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { Plus, Edit, Trash2, User, Phone, Mail } from "lucide-react"
import { useLocalStorage } from "../hooks/use-local-storage"
import type { Driver } from "../types"

export function DriversManagement() {
  const [drivers, setDrivers] = useLocalStorage<Driver[]>("drivers", [])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingDriver, setEditingDriver] = useState<Driver | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    cpf: "",
    cnh: "",
    phone: "",
    email: "",
    status: "available" as Driver["status"],
  })

  const resetForm = () => {
    setFormData({
      name: "",
      cpf: "",
      cnh: "",
      phone: "",
      email: "",
      status: "available",
    })
    setEditingDriver(null)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (editingDriver) {
      // Update existing driver
      setDrivers((prev) => prev.map((driver) => (driver.id === editingDriver.id ? { ...driver, ...formData } : driver)))
    } else {
      // Add new driver
      const newDriver: Driver = {
        id: `driver-${Date.now()}`,
        ...formData,
        totalTrips: 0,
        refusedTrips: 0,
        createdAt: new Date(),
      }
      setDrivers((prev) => [...prev, newDriver])
    }

    setIsDialogOpen(false)
    resetForm()
  }

  const handleEdit = (driver: Driver) => {
    setEditingDriver(driver)
    setFormData({
      name: driver.name,
      cpf: driver.cpf,
      cnh: driver.cnh,
      phone: driver.phone,
      email: driver.email,
      status: driver.status,
    })
    setIsDialogOpen(true)
  }

  const handleDelete = (driverId: string) => {
    if (confirm("Tem certeza que deseja excluir este motorista?")) {
      setDrivers((prev) => prev.filter((driver) => driver.id !== driverId))
    }
  }

  const getStatusBadge = (status: Driver["status"]) => {
    const statusConfig = {
      available: { label: "Disponível", variant: "default" as const },
      on_trip: { label: "Em Viagem", variant: "secondary" as const },
      unavailable: { label: "Indisponível", variant: "destructive" as const },
    }

    const config = statusConfig[status]
    return <Badge variant={config.variant}>{config.label}</Badge>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="flex flex-left text-2xl font-bold">Gestão de Motoristas</h2>
          <p className="text-gray-600">Cadastre e gerencie os motoristas da empresa</p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="h-4 w-4 mr-2" />
              Novo Motorista
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>{editingDriver ? "Editar Motorista" : "Novo Motorista"}</DialogTitle>
              <DialogDescription>
                {editingDriver ? "Atualize as informações do motorista" : "Preencha os dados do novo motorista"}
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome Completo</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cpf">CPF</Label>
                  <Input
                    id="cpf"
                    value={formData.cpf}
                    onChange={(e) => setFormData({ ...formData, cpf: e.target.value })}
                    placeholder="000.000.000-00"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cnh">CNH</Label>
                  <Input
                    id="cnh"
                    value={formData.cnh}
                    onChange={(e) => setFormData({ ...formData, cnh: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Telefone</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="(00) 00000-0000"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value: Driver["status"]) => setFormData({ ...formData, status: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="available">Disponível</SelectItem>
                    <SelectItem value="on_trip">Em Viagem</SelectItem>
                    <SelectItem value="unavailable">Indisponível</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit">{editingDriver ? "Atualizar" : "Cadastrar"}</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {drivers.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <User className="h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum motorista cadastrado</h3>
              <p className="text-gray-600 text-center mb-4">Comece cadastrando o primeiro motorista da sua empresa</p>
              <Button onClick={() => setIsDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Cadastrar Motorista
              </Button>
            </CardContent>
          </Card>
        ) : (
          drivers.map((driver) => (
            <Card key={driver.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <User className="h-5 w-5" />
                      {driver.name}
                    </CardTitle>
                    <CardDescription>
                      CNH: {driver.cnh} • CPF: {driver.cpf}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(driver.status)}
                    <Button variant="outline" size="sm" onClick={() => handleEdit(driver)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleDelete(driver.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">{driver.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">{driver.email}</span>
                  </div>
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">Viagens:</span> {driver.totalTrips} realizadas, {driver.refusedTrips}{" "}
                    recusadas
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
