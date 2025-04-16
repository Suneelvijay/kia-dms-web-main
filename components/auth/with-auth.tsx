 "use client"

import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"

interface WithAuthProps {
  allowedRoles?: string[]
  children: React.ReactNode
}

export function WithAuth({ allowedRoles, children }: WithAuthProps) {
  const { isAuthenticated, user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push("/login")
      } else if (allowedRoles && !allowedRoles.includes(user?.role || "")) {
        router.push("/unauthorized")
      }
    }
  }, [isAuthenticated, user, allowedRoles, isLoading, router])

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (!isAuthenticated || (allowedRoles && !allowedRoles.includes(user?.role || ""))) {
    return null
  }

  return <>{children}</>
}