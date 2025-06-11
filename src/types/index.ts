export interface Driver {
  id: string
  name: string
  cpf: string
  cnh: string
  phone: string
  email: string
  status: "available" | "on_trip" | "unavailable"
  totalTrips: number
  refusedTrips: number
  createdAt: Date
}

export interface Vehicle {
  id: string
  model: string
  plate: string
  currentKm: number
  status: "available" | "on_trip" | "maintenance"
  driverId?: string
  createdAt: Date
}

export interface Trip {
  id: string
  origin: string
  destination: string
  date: Date
  driverId?: string
  vehicleId?: string
  status: "pending" | "accepted" | "refused" | "in_progress" | "completed"
  refusalReason?: string
  initialKm?: number
  finalKm?: number
  createdAt: Date
  updatedAt: Date
}

export interface User {
  id: string
  name: string
  email: string
  role: "admin" | "driver"
  driverId?: string
}

export interface TripAssignment {
  tripId: string
  driverId: string
  assignedAt: Date
  status: "pending" | "accepted" | "refused"
}
