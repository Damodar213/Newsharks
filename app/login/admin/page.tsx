"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Shield, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"

export default function AdminLoginPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    securityCode: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Basic validation
    if (!formData.email || !formData.password || !formData.securityCode) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    // Mock admin login logic - in a real app, you would authenticate with your backend
    console.log("Admin login attempted with:", formData)

    toast({
      title: "Admin Login successful",
      description: "Welcome to the NEW SHARKS admin panel",
    })

    // Redirect to admin dashboard
    router.push("/dashboard/admin")
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b">
        <div className="container flex h-16 items-center px-4 md:px-6">
          <Link href="/" className="flex items-center gap-2">
            <TrendingUp className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">NEW SHARKS</span>
          </Link>
        </div>
      </header>
      <main className="flex-1 flex items-center justify-center p-4 md:p-8 bg-gray-50 dark:bg-gray-900">
        <Card className="w-full max-w-md">
          <CardHeader>
            <div className="flex items-center justify-center mb-4">
              <Shield className="h-12 w-12 text-primary" />
            </div>
            <CardTitle className="text-2xl text-center">Admin Login</CardTitle>
            <CardDescription className="text-center">
              Secure access to the NEW SHARKS administration panel
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Admin Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="admin@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="securityCode">Security Code</Label>
                <Input
                  id="securityCode"
                  name="securityCode"
                  type="password"
                  placeholder="Enter your admin security code"
                  value={formData.securityCode}
                  onChange={handleChange}
                  required
                />
                <p className="text-xs text-gray-500">
                  The security code is required for admin access and provides an additional layer of security.
                </p>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button type="submit" className="w-full">
                Log in to Admin Panel
              </Button>
              <div className="text-center text-sm">
                <Link href="/login" className="text-primary hover:underline">
                  Return to regular login
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>
      </main>
      <footer className="border-t py-4 text-center text-sm text-gray-500">
        <p>© 2023 NEW SHARKS. All rights reserved.</p>
      </footer>
    </div>
  )
}
