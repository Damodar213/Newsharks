"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Bell, LightbulbIcon, LogOut, Menu, MessageSquare, Settings, TrendingUp, User, Video, ArrowLeft, Edit } from "lucide-react"
import { Button } from "@/components/ui/button"
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
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { toast } from "@/hooks/use-toast"

// Define interface for project type
interface Project {
  _id: string;
  title: string;
  description: string;
  category: string;
  fundingGoal: number;
  currentFunding?: number;
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

export default function ProjectDetailsPage({ params }: { params: { id: string } }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const router = useRouter()
  const projectId = params.id
  const [project, setProject] = useState<Project | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [userData, setUserData] = useState<UserData | null>(null)

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
          description: "Please log in to view project details",
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
          description: "You can only view your own projects",
          variant: "destructive",
        });
        router.push('/dashboard/entrepreneur/projects');
        return;
      }
      
      setProject(data.project);
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

  const handleLogout = () => {
    localStorage.removeItem('userData');
    router.push("/login");
  }

  // Show loading state
  if (isLoading || !project) {
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
              <Link href="/dashboard/entrepreneur/projects">
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>
            <h1 className="text-2xl font-bold">Project Details</h1>
          </div>

          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-2xl">{project.title}</CardTitle>
                    <CardDescription>Created on {new Date(project.createdAt).toLocaleDateString()}</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Badge variant={project.approved ? "default" : "secondary"}>
                      {project.approved ? "Approved" : "Pending Approval"}
                    </Badge>
                    <Button variant="outline" size="icon" asChild>
                      <Link href={`/dashboard/entrepreneur/projects/${project._id}/edit`}>
                        <Edit className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-2">Description</h3>
                  <p className="text-gray-600">{project.description}</p>
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-lg font-medium mb-2">Project Details</h3>
                    <ul className="space-y-2">
                      <li>
                        <span className="font-medium">Category:</span> {project.category}
                      </li>
                      <li>
                        <span className="font-medium">Funding Goal:</span> ₹{project.fundingGoal.toLocaleString()}
                      </li>
                      <li>
                        <span className="font-medium">Equity Offering:</span> {project.equityOffering}%
                      </li>
                      {project.timeline && (
                        <li>
                          <span className="font-medium">Timeline:</span> {project.timeline}
                        </li>
                      )}
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-2">Funding Progress</h3>
                    {typeof project.currentFunding === 'number' ? (
                      <div className="space-y-2">
                        <Progress value={(project.currentFunding / project.fundingGoal) * 100} />
                        <div className="flex justify-between text-sm">
                          <span>₹{project.currentFunding.toLocaleString()} raised</span>
                          <span>{Math.round((project.currentFunding / project.fundingGoal) * 100)}% of ₹{project.fundingGoal.toLocaleString()}</span>
                        </div>
                      </div>
                    ) : (
                      <div className="text-gray-500">No funding received yet</div>
                    )}
                  </div>
                </div>
                
                {project.businessPlan && (
                  <div>
                    <h3 className="text-lg font-medium mb-2">Business Plan</h3>
                    <div className="p-4 border rounded-lg">
                      <p className="whitespace-pre-wrap">{project.businessPlan}</p>
                    </div>
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" asChild>
                  <Link href="/dashboard/entrepreneur/projects">
                    Back to Projects
                  </Link>
                </Button>
                <Button asChild>
                  <Link href={`/dashboard/entrepreneur/projects/${project._id}/edit`}>
                    Edit Project
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
} 