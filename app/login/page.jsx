"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { PasswordInput } from "@/components/ui/password-input"
import { OTPDialog } from "@/components/ui/otp-dialog"
import { useAuth } from "@/contexts/auth-context"

export default function LoginPage() {
  const { login, verifyLoginOTP, error: authError } = useAuth()
  const [formData, setFormData] = useState({
    username: "",
    password: ""
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [showOTPDialog, setShowOTPDialog] = useState(false)
  const [email, setEmail] = useState("")

  const handleInputChange = (e) => {
    const { id, value } = e.target
    setFormData(prev => ({ ...prev, [id]: value }))
  }

  const handleSubmit = async (e) => {
  e.preventDefault()
  setIsLoading(true)

  try {
    const response = await login(formData.username, formData.password)
    // If login is successful, show OTP dialog
    setEmail(response.email) // Use the email from the login response
    setShowOTPDialog(true)
  } catch (err) {
    // Error is handled by the auth context
  } finally {
    setIsLoading(false)
  }
}

  const handleVerifyOTP = async (otp) => {
    try {
      await verifyLoginOTP(email, otp)
      setShowOTPDialog(false)
    } catch (err) {
      // Error is handled by the auth context
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex justify-center">
            <img src="/placeholder.svg?height=60&width=120" alt="Kia Logo" className="h-15 w-auto" />
          </div>
          <CardTitle className="text-2xl font-bold text-center">Sign in to your account</CardTitle>
          <CardDescription className="text-center">
            Enter your email and password to access the dealer management system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {authError && (
              <div className="text-sm text-destructive text-center">
                {authError}
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input 
                id="username" 
                type="text" 
                value={formData.username}
                onChange={handleInputChange}
                required 
              />
            </div>
            <PasswordInput
              id="password"
              label="Password"
              value={formData.password}
              onChange={handleInputChange}
              showPassword={showPassword}
              onTogglePassword={() => setShowPassword(!showPassword)}
              required
            />
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Signing in..." : "Sign in"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <div className="text-center text-sm">
            Don't have an account?{" "}
            <Link href="/register" className="text-primary hover:underline">
              Register
            </Link>
          </div>
        </CardFooter>
      </Card>

      <OTPDialog
        isOpen={showOTPDialog}
        email={email}
        onClose={() => setShowOTPDialog(false)}
        onVerify={handleVerifyOTP}
        isLogin={true}
      />
    </div>
  )
}