import type React from "react"

import { Navigate } from "react-router-dom"
import { useAuth, type UserType } from "../context/AuthContext"
import { LoadingSpinner } from "./loading-spinner"

interface ProtectedRouteProps {
  children: React.ReactNode
  allowedRoles: UserType[]
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { isAuthenticated, userType, isLoading } = useAuth()

  if (isLoading) {
    return <LoadingSpinner />
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace />
  }

  if (userType && !allowedRoles.includes(userType)) {
    return <Navigate to="/" replace />
  }

  return <>{children}</>
}
