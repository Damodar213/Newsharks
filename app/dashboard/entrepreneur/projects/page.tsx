"use client"

import Link from "next/link"
import { Bell, LightbulbIcon, LogOut, Menu, MessageSquare, Plus, Settings, TrendingUp, User, Video, Filter } from "lucide-react"
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
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { toast } from "@/hooks/use-toast"

// Define interface for project type
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

// Define interface for user data
interface UserData {
  id: string;
  _id?: string;
  name: string;
  email: string;
  role: string;
  isLoggedIn: boolean;
}

export default function EntrepreneurProjectsPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const router = useRouter()
  const [projects, setProjects] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [userData, setUserData] = useState<UserData | null>(null)
  const [showOnlyReal, setShowOnlyReal] = useState(false)

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
        description: "Please log in to view your projects",
        variant: "destructive",
      });
      router.push('/login');
    }
  }, [router]);

  // Fetch projects from the API when the component mounts
  useEffect(() => {
    if (userData) {
      fetchProjects();
    }
  }, [userData]);

  const fetchProjects = async () => {
    try {
      setIsLoading(true);
      // Fix the entrepreneur ID issue by using both possible ID fields
      const entrepreneurId = userData?.id || userData?._id;
      const response = await fetch(`/api/projects?entrepreneur=${entrepreneurId}`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch projects');
      }
      
      console.log('Fetched projects:', data);
      setProjects(data.projects || []);
    } catch (error) {
      console.error('Error fetching projects:', error);
      toast({
        title: "Error",
        description: "Failed to load your projects. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    // Clear user data from localStorage
    localStorage.removeItem('userData');
    router.push("/login");
  }

  // Filter projects based on the showOnlyReal state
  const filteredProjects = showOnlyReal 
    ? projects.filter(project => project.approved)
    : projects;

  // Show loading state
  if (isLoading || !userData) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Loading your projects...</h2>
          <p className="text-gray-500">Please wait while we fetch your data.</p>
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
                <Button className="size-icon">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent className="w-64 sm:max-w-sm">
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
            <Button className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
                3
              </span>
              <span className="sr-only">Notifications</span>
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="rounded-full">
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
      <div className="flex flex-1">
        <aside className="hidden w-64 border-r md:block">
          <div className="flex h-full flex-col gap-2 p-4">
            <div className="py-2">
              <h2 className="text-lg font-semibold">{userData.name}</h2>
              <p className="text-sm text-gray-500">{userData.role}</p>
            </div>
            <nav className="flex flex-col gap-1">
              <Link
                href="/dashboard/entrepreneur"
                className="flex items-center gap-2 rounded-lg px-3 py-2 hover:bg-muted"
              >
                <TrendingUp className="h-5 w-5" />
                <span>Dashboard</span>
              </Link>
              <Link
                href="/dashboard/entrepreneur/projects"
                className="flex items-center gap-2 rounded-lg bg-primary/10 px-3 py-2 text-primary"
              >
                <LightbulbIcon className="h-5 w-5" />
                <span>My Projects</span>
              </Link>
              <Link
                href="/dashboard/entrepreneur/messages"
                className="flex items-center gap-2 rounded-lg px-3 py-2 hover:bg-muted"
              >
                <MessageSquare className="h-5 w-5" />
                <span>Messages</span>
                <Badge className="ml-auto">3</Badge>
              </Link>
              <Link
                href="/dashboard/entrepreneur/video-calls"
                className="flex items-center gap-2 rounded-lg px-3 py-2 hover:bg-muted"
              >
                <Video className="h-5 w-5" />
                <span>Video Calls</span>
                <Badge className="ml-auto">2</Badge>
              </Link>
              <Link
                href="/dashboard/entrepreneur/settings"
                className="flex items-center gap-2 rounded-lg px-3 py-2 hover:bg-muted"
              >
                <Settings className="h-5 w-5" />
                <span>Settings</span>
              </Link>
            </nav>
            <div className="mt-auto">
              <Button className="w-full justify-start gap-2" onClick={handleLogout}>
                <LogOut className="h-5 w-5" />
                <span>Log out</span>
              </Button>
            </div>
          </div>
        </aside>
        <main className="flex-1 overflow-auto">
          <div className="container py-6 px-4 md:px-6">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h1 className="text-2xl font-bold">My Projects</h1>
                <p className="text-gray-500">Manage your business ideas and funding</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setShowOnlyReal(!showOnlyReal)}>
                  <Filter className="mr-2 h-4 w-4" />
                  {showOnlyReal ? "Show All" : "Show Only Approved"}
                </Button>
                <Link href="/dashboard/entrepreneur/projects/new">
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    New Project
                  </Button>
                </Link>
              </div>
            </div>

            {filteredProjects.length === 0 ? (
              <Card className="p-8 text-center">
                <h3 className="text-lg font-medium mb-2">
                  {showOnlyReal 
                    ? "No approved projects yet" 
                    : "No projects yet"}
                </h3>
                <p className="text-gray-500 mb-6">
                  {showOnlyReal 
                    ? "Your projects are still pending approval" 
                    : "Create your first project to start attracting investors"}
                </p>
                <Link href="/dashboard/entrepreneur/projects/new">
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Create New Project
                  </Button>
                </Link>
              </Card>
            ) : (
              <div className="grid gap-6">
                {filteredProjects.map((project) => (
                  <Card key={project._id}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle>{project.title}</CardTitle>
                          <CardDescription>{project.description}</CardDescription>
                        </div>
                        <Badge>{project.approved ? "Approved" : "Pending"}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex flex-wrap justify-between text-sm gap-y-2">
                          <div>
                            <span className="text-gray-500">Category:</span> {project.category}
                          </div>
                          <div>
                            <span className="text-gray-500">Funding Goal:</span> ${project.fundingGoal.toLocaleString()}
                          </div>
                          <div>
                            <span className="text-gray-500">Equity Offering:</span> {project.equityOffering}%
                          </div>
                          <div>
                            <span className="text-gray-500">Created:</span> {new Date(project.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-end gap-2">
                      <Button variant="outline" asChild>
                        <Link href={`/dashboard/entrepreneur/projects/${project._id}/edit`}>Edit</Link>
                      </Button>
                      <Button asChild>
                        <Link href={`/dashboard/entrepreneur/projects/${project._id}`}>View Details</Link>
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
