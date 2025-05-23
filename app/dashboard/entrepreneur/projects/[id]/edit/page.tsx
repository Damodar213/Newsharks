"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Bell, LightbulbIcon, LogOut, Menu, MessageSquare, Settings, TrendingUp, User, Video, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from "@/hooks/use-toast"

// Define interface for project type
interface ProjectFormData {
  title: string;
  description: string;
  category: string;
  fundingGoal: number | string;
  equityOffering: number | string;
  timeline?: string;
  businessPlan?: string;
}

interface Project {
  _id: string;
  title: string;
  description: string;
  category: string;
  fundingGoal: number;
  equityOffering: number;
  timeline?: string;
  businessPlan?: string;
  entrepreneur: string;
  approved: boolean;
  createdAt: string;
  updatedAt: string;
}

interface UserData {
  id: string;
  _id?: string;
  name: string;
  email: string;
  role: string;
  isLoggedIn: boolean;
}

export default function EditProjectPage({ params }: { params: { id: string } }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const router = useRouter()
  const projectId = params.id
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [userData, setUserData] = useState<UserData | null>(null)
  const [formData, setFormData] = useState<ProjectFormData>({
    title: "",
    description: "",
    category: "",
    fundingGoal: "",
    equityOffering: "",
    timeline: "",
    businessPlan: "",
  })

  // Load user data from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUserData = localStorage.getItem('userData');
      if (storedUserData) {
        try {
          const parsedUserData = JSON.parse(storedUserData);
          setUserData(parsedUserData);
          
          // Redirect if not an entrepreneur
          if (parsedUserData.role !== 'entrepreneur') {
            toast({
              title: "Access denied",
              description: "Only entrepreneurs can access this page",
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
          description: "Please log in to edit projects",
          variant: "destructive",
        });
        router.push('/login');
      }
    }
  }, [router]);

  // Fetch project details
  useEffect(() => {
    if (userData && projectId) {
      fetchProject();
    }
  }, [userData, projectId]);

  const fetchProject = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/projects/${projectId}`);
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to fetch project details');
      }
      
      // Verify project belongs to current user
      const entId = userData?.id || userData?._id;
      
      // Handle entrepreneur field that could be a string ID or an object with _id
      const projectEntrepreneurId = 
        typeof data.project.entrepreneur === 'string' 
          ? data.project.entrepreneur 
          : data.project.entrepreneur?._id;
          
      if (projectEntrepreneurId !== entId) {
        toast({
          title: "Access denied",
          description: "You can only edit your own projects",
          variant: "destructive",
        });
        router.push('/dashboard/entrepreneur/projects');
        return;
      }
      
      // Set form data from project
      const project = data.project;
      setFormData({
        title: project.title,
        description: project.description,
        category: project.category,
        fundingGoal: project.fundingGoal,
        equityOffering: project.equityOffering,
        timeline: project.timeline || "",
        businessPlan: project.businessPlan || "",
      });
    } catch (error) {
      console.error('Error fetching project:', error);
      toast({
        title: "Error",
        description: "Failed to load project details. Please try again.",
        variant: "destructive",
      });
      router.push('/dashboard/entrepreneur/projects');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsSaving(true);
      
      // Validate form data
      if (!formData.title || !formData.description || !formData.category || !formData.fundingGoal || !formData.equityOffering) {
        toast({
          title: "Error",
          description: "Please fill out all required fields",
          variant: "destructive",
        });
        setIsSaving(false);
        return;
      }

      // Convert to appropriate types
      const projectData = {
        ...formData,
        fundingGoal: Number(formData.fundingGoal),
        equityOffering: Number(formData.equityOffering),
      };

      // Send update request to API
      const response = await fetch(`/api/projects/${projectId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(projectData),
      });
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to update project');
      }
      
      toast({
        title: "Success",
        description: "Project updated successfully",
      });
      
      // Redirect to project details page
      router.push(`/dashboard/entrepreneur/projects/${projectId}`);
    } catch (error) {
      console.error('Error updating project:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update project. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('userData');
    router.push("/login");
  }

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Loading project details...</h2>
          <p className="text-gray-500">Please wait</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b">
        <div className="container flex h-16 items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-2">
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="outline" size="icon">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64 sm:max-w-sm">
                <nav className="flex flex-col gap-4 mt-8">
                  <Link
                    href="/dashboard/entrepreneur"
                    className="flex items-center gap-2 text-lg font-semibold"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <TrendingUp className="h-5 w-5" />
                    <span>Dashboard</span>
                  </Link>
                  <Link
                    href="/dashboard/entrepreneur/projects"
                    className="flex items-center gap-2 text-lg font-semibold"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <LightbulbIcon className="h-5 w-5" />
                    <span>My Projects</span>
                  </Link>
                  <Link
                    href="/dashboard/entrepreneur/messages"
                    className="flex items-center gap-2 text-lg font-semibold"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <MessageSquare className="h-5 w-5" />
                    <span>Messages</span>
                  </Link>
                  <Link
                    href="/dashboard/entrepreneur/video-calls"
                    className="flex items-center gap-2 text-lg font-semibold"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Video className="h-5 w-5" />
                    <span>Video Calls</span>
                  </Link>
                  <Link
                    href="/dashboard/entrepreneur/settings"
                    className="flex items-center gap-2 text-lg font-semibold"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Settings className="h-5 w-5" />
                    <span>Settings</span>
                  </Link>
                </nav>
              </SheetContent>
            </Sheet>
            <Link href="/" className="flex items-center gap-2">
              <TrendingUp className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold hidden md:inline-block">NEW SHARKS</span>
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
                3
              </span>
              <span className="sr-only">Notifications</span>
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Avatar>
                    <AvatarFallback>{userData?.name?.charAt(0) || 'U'}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>
      
      <main className="flex-1 overflow-auto">
        <div className="container py-6 px-4 md:px-6">
          <div className="flex items-center gap-2 mb-6">
            <Button variant="ghost" size="icon" asChild>
              <Link href={`/dashboard/entrepreneur/projects/${projectId}`}>
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>
            <h1 className="text-2xl font-bold">Edit Project</h1>
          </div>

          <Card>
            <form onSubmit={handleSubmit}>
              <CardHeader>
                <CardTitle>Project Information</CardTitle>
                <CardDescription>Update the details of your project</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="title" className="text-sm font-medium">
                    Project Title *
                  </label>
                  <Input
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="description" className="text-sm font-medium">
                    Description *
                  </label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={4}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="category" className="text-sm font-medium">
                    Category *
                  </label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => handleSelectChange("category", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Technology">Technology</SelectItem>
                      <SelectItem value="Food">Food & Beverage</SelectItem>
                      <SelectItem value="Healthcare">Healthcare</SelectItem>
                      <SelectItem value="Education">Education</SelectItem>
                      <SelectItem value="Finance">Finance</SelectItem>
                      <SelectItem value="Real Estate">Real Estate</SelectItem>
                      <SelectItem value="Entertainment">Entertainment</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="fundingGoal" className="text-sm font-medium">
                      Funding Goal ($) *
                    </label>
                    <Input
                      id="fundingGoal"
                      name="fundingGoal"
                      type="number"
                      value={formData.fundingGoal}
                      onChange={handleChange}
                      min="1000"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="equityOffering" className="text-sm font-medium">
                      Equity Offering (%) *
                    </label>
                    <Input
                      id="equityOffering"
                      name="equityOffering"
                      type="number"
                      value={formData.equityOffering}
                      onChange={handleChange}
                      min="1"
                      max="100"
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="timeline" className="text-sm font-medium">
                    Timeline (optional)
                  </label>
                  <Input
                    id="timeline"
                    name="timeline"
                    value={formData.timeline || ""}
                    onChange={handleChange}
                    placeholder="e.g., 6 months to market launch"
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="businessPlan" className="text-sm font-medium">
                    Business Plan (optional)
                  </label>
                  <Textarea
                    id="businessPlan"
                    name="businessPlan"
                    value={formData.businessPlan || ""}
                    onChange={handleChange}
                    rows={6}
                    placeholder="Enter your business plan details"
                  />
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" type="button" asChild>
                  <Link href={`/dashboard/entrepreneur/projects/${projectId}`}>
                    Cancel
                  </Link>
                </Button>
                <Button type="submit" disabled={isSaving}>
                  {isSaving ? "Saving..." : "Save Changes"}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </div>
      </main>
    </div>
  )
} 