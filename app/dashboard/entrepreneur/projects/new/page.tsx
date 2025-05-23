"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { toast } from "@/hooks/use-toast"

export default function NewProjectPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [userData, setUserData] = useState<any>(null)
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    fundingGoal: 10000,
    equityOffering: 10,
    timeline: "",
    businessPlan: "",
  })

  // Load user data from localStorage
  useEffect(() => {
    const storedUserData = localStorage.getItem('userData');
    if (storedUserData) {
      try {
        const parsedUserData = JSON.parse(storedUserData);
        setUserData(parsedUserData);
        
        // Redirect if not an entrepreneur
        if (parsedUserData.role !== 'entrepreneur') {
          toast({
            title: "Access denied",
            description: "Only entrepreneurs can create projects",
            variant: "destructive",
          });
          router.push('/dashboard');
        }
      } catch (error) {
        console.error("Error parsing user data:", error);
        router.push('/login');
      }
    } else {
      // Redirect to login if not logged in
      toast({
        title: "Login required",
        description: "Please log in to create a project",
        variant: "destructive",
      });
      router.push('/login');
    }
  }, [router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSliderChange = (name: string, value: number[]) => {
    setFormData((prev) => ({ ...prev, [name]: value[0] }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Basic validation
    if (!formData.title || !formData.description || !formData.category) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      setIsLoading(false)
      return
    }

    try {
      // Send project data to API
      const response = await fetch("/api/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          userId: userData?.id, // Add user ID from localStorage
        }),
      })

      const data = await response.json()
      console.log("Project creation response:", data)

      if (!response.ok) {
        throw new Error(data.error || data.details || "Failed to create project")
      }

      toast({
        title: "Project created",
        description: "Your project has been submitted successfully",
      })

      // Redirect to the projects list
      router.push("/dashboard/entrepreneur/projects")
    } catch (error) {
      console.error("Project creation error:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "An error occurred while creating the project",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (!userData) {
    return <div className="flex min-h-screen items-center justify-center">Loading...</div>
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
      <main className="flex-1 py-6 px-4 md:px-6">
        <div className="mx-auto max-w-3xl">
          <div className="flex items-center mb-6">
            <Link href="/dashboard/entrepreneur" className="inline-flex items-center text-sm font-medium mr-2">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Link>
          </div>
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Create New Project</CardTitle>
              <CardDescription>Share your business idea with potential investors</CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Project Title</Label>
                  <Input
                    id="title"
                    name="title"
                    placeholder="e.g., EcoPackage - Sustainable Packaging Solution"
                    value={formData.title}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Project Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    placeholder="Describe your business idea in detail"
                    value={formData.description}
                    onChange={handleChange}
                    required
                    className="min-h-[100px]"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select value={formData.category} onValueChange={(value: string) => handleSelectChange("category", value)}>
                    <SelectTrigger id="category">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="technology">Technology</SelectItem>
                      <SelectItem value="health">Health & Wellness</SelectItem>
                      <SelectItem value="sustainability">Sustainability</SelectItem>
                      <SelectItem value="education">Education</SelectItem>
                      <SelectItem value="finance">Finance</SelectItem>
                      <SelectItem value="food">Food & Beverage</SelectItem>
                      <SelectItem value="retail">Retail</SelectItem>
                      <SelectItem value="agriculture">Agriculture</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fundingGoal">Funding Goal (INR)</Label>
                  <Input
                    id="fundingGoal"
                    name="fundingGoal"
                    type="number"
                    value={formData.fundingGoal}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="equityOffering">Equity Offering (%)</Label>
                    <span>{formData.equityOffering}%</span>
                  </div>
                  <Slider
                    id="equityOffering"
                    min={1}
                    max={49}
                    step={1}
                    defaultValue={[10]}
                    onValueChange={(value: number[]) => handleSliderChange("equityOffering", value)}
                  />
                  <p className="text-xs text-gray-500">
                    The percentage of your company you are willing to offer in exchange for funding
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timeline">Project Timeline</Label>
                  <Input
                    id="timeline"
                    name="timeline"
                    placeholder="e.g., 6 months to market, 1 year to profitability"
                    value={formData.timeline}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="businessPlan">Business Plan</Label>
                  <Textarea
                    id="businessPlan"
                    name="businessPlan"
                    placeholder="Outline your business model, market analysis, and growth strategy"
                    value={formData.businessPlan}
                    onChange={handleChange}
                    className="min-h-[150px]"
                  />
                </div>
              </CardContent>
              <CardFooter className="flex flex-col space-y-4">
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Creating Project..." : "Submit Project"}
                </Button>
                <p className="text-xs text-center text-gray-500">
                  By submitting this project, you agree to our{" "}
                  <Link href="/terms" className="text-primary hover:underline">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link href="/privacy" className="text-primary hover:underline">
                    Privacy Policy
                  </Link>
                </p>
              </CardFooter>
            </form>
          </Card>
        </div>
      </main>
    </div>
  )
}
