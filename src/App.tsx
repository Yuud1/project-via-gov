import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { AuthProvider } from "./context/AuthContext"
import { ProtectedRoute } from "./components/protected-route"
import LoginPage from "./pages/LoginPage"
import AdminDashboard from "./pages/admin/AdminDashboard"
import AdminDrivers from "./pages/admin/AdminDrivers"
import AdminVehicles from "./pages/admin/AdminVehicles"
import AdminTrips from "./pages/admin/AdminTrips"
import AdminReports from "./pages/admin/AdminReports"
import DriverDashboard from "./pages/driver/DriverDashboard"
import DriverTrips from "./pages/driver/DriverTrips"
import "./App.css"

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<LoginPage />} />

            <Route
              path="/admin"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/drivers"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <AdminDrivers />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/vehicles"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <AdminVehicles />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/trips"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <AdminTrips />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/reports"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <AdminReports />
                </ProtectedRoute>
              }
            />

            <Route
              path="/driver"
              element={
                <ProtectedRoute allowedRoles={["driver"]}>
                  <DriverDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/driver/trips"
              element={
                <ProtectedRoute allowedRoles={["driver"]}>
                  <DriverTrips />
                </ProtectedRoute>
              }
            />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App
