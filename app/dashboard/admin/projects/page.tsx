"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  Activity,
  Bell,
  CheckCircle,
  ChevronDown,
  LogOut,
  Menu,
  Settings,
  Shield,
  TrendingUp,
  User,
  Users,
  XCircle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { toast } from "@/components/ui/use-toast"

interface Project {
  _id: string;
  title: string;
  description: string;
  category: string;
  fundingGoal: number;
  equityOffering: number;
  entrepreneur: {
    name: string;
    email: string;
  };
  approved: boolean;
  createdAt: string;
}

export default function AdminProjectsPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const router = useRouter()
  const [projects, setProjects] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [userData, setUserData] = useState<any>(null)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (!isClient) return;
    
    let parsedUserData;
    try {
      const storedUserData = localStorage.getItem('userData');
      console.log("Admin Projects Page - Raw userData:", storedUserData);
      
      if (storedUserData) {
        parsedUserData = JSON.parse(storedUserData);
        console.log("Admin Projects Page - Parsed userData:", parsedUserData);
        setUserData(parsedUserData);
        
        if (parsedUserData.role !== 'admin') {
          console.log("Access denied - User role is not admin:", parsedUserData.role);
          toast({
            title: "Access denied",
            description: "Only administrators can access this page",
            variant: "destructive",
          });
          router.push('/dashboard');
        }
      } else {
        console.log("No userData found in localStorage");
        toast({
          title: "Login required",
          description: "Please log in to access the admin panel",
          variant: "destructive",
        });
        router.push('/login');
      }
    } catch (error) {
      console.error("Error parsing user data:", error);
      router.push('/login');
    }
  }, [router, isClient]);

  useEffect(() => {
    if (userData) {
      try {
        console.log("Fetching projects with userData:", userData);
        fetchProjects();
      } catch (error) {
        console.error("Error in project fetch useEffect:", error);
      }
    }
  }, [userData]);

  const fetchProjects = async () => {
    try {
      console.log("Making API request to /api/projects");
      const response = await fetch('/api/projects', {
        headers: {
          'pragma': 'no-cache',
          'cache-control': 'no-cache'
        }
      });
      console.log("API response status:", response.status);
      
      if (!response.ok) {
        throw new Error(`API returned status ${response.status}`);
      }
      
      const data = await response.json();
      console.log("Projects data:", data);
      
      if (data.success) {
        setProjects(data.projects || []);
        console.log("Projects loaded:", data.projects?.length || 0);
      } else {
        console.error("API returned failure:", data.error);
        toast({
          title: "Error",
          description: data.error || "Failed to fetch projects",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to fetch projects",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleApproveProject = async (projectId: string) => {
    try {
      console.log("Approving project with ID:", projectId);
      const response = await fetch(`/api/projects/${projectId}/approve`, {
        method: 'PUT',
      });
      
      if (!response.ok) {
        console.error('Approval API error status:', response.status);
        throw new Error(`API returned ${response.status}`);
      }
      
      const data = await response.json();
      console.log("Approval response:", data);
      
      if (data.success) {
        toast({
          title: "Success",
          description: "Project approved successfully",
        });
        fetchProjects();
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to approve project",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error approving project:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to approve project",
        variant: "destructive",
      });
    }
  };

  const handleRejectProject = async (projectId: string) => {
    try {
      console.log("Rejecting project with ID:", projectId);
      const response = await fetch(`/api/projects/${projectId}/reject`, {
        method: 'PUT',
      });
      
      if (!response.ok) {
        console.error('Rejection API error status:', response.status);
        throw new Error(`API returned ${response.status}`);
      }
      
      const data = await response.json();
      console.log("Rejection response:", data);
      
      if (data.success) {
        toast({
          title: "Success",
          description: "Project rejected successfully",
        });
        fetchProjects();
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to reject project",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error rejecting project:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to reject project",
        variant: "destructive",
      });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('userData');
    router.push('/login');
  };

  if (!userData) {
    return <div className="flex min-h-screen items-center justify-center">Loading...</div>
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
                    href="/dashboard/admin"
                    className="flex items-center gap-2 text-lg font-semibold"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Shield className="h-5 w-5" />
                    <span>Admin Dashboard</span>
                  </Link>
                  <Link
                    href="/dashboard/admin/users"
                    className="flex items-center gap-2 text-lg font-semibold"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Users className="h-5 w-5" />
                    <span>User Management</span>
                  </Link>
                  <Link
                    href="/dashboard/admin/projects"
                    className="flex items-center gap-2 text-lg font-semibold"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <TrendingUp className="h-5 w-5" />
                    <span>Project Management</span>
                  </Link>
                </nav>
              </SheetContent>
            </Sheet>
            <Link href="/" className="flex items-center gap-2">
              <TrendingUp className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold">NEW SHARKS</span>
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Avatar>
                    <AvatarFallback>AD</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Admin Account</DropdownMenuLabel>
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
              <h2 className="text-lg font-semibold">Admin Panel</h2>
              <p className="text-sm text-gray-500">Platform Management</p>
            </div>
            <nav className="flex flex-col gap-1">
              <Link
                href="/dashboard/admin"
                className="flex items-center gap-2 rounded-lg px-3 py-2 hover:bg-muted"
              >
                <Shield className="h-5 w-5" />
                <span>Dashboard</span>
              </Link>
              <Link
                href="/dashboard/admin/users"
                className="flex items-center gap-2 rounded-lg px-3 py-2 hover:bg-muted"
              >
                <Users className="h-5 w-5" />
                <span>User Management</span>
              </Link>
              <Link
                href="/dashboard/admin/projects"
                className="flex items-center gap-2 rounded-lg bg-primary/10 px-3 py-2 text-primary"
              >
                <TrendingUp className="h-5 w-5" />
                <span>Project Management</span>
              </Link>
            </nav>
            <div className="mt-auto">
              <Button variant="outline" className="w-full justify-start gap-2" onClick={handleLogout}>
                <LogOut className="h-5 w-5" />
                <span>Log out</span>
              </Button>
            </div>
          </div>
        </aside>
        <main className="flex-1 overflow-auto">
          <div className="container py-6 px-4 md:px-6">
            <div className="flex flex-col gap-1">
              <h1 className="text-2xl font-bold">Project Management</h1>
              <p className="text-gray-500">Review and manage project submissions</p>
            </div>

            {isLoading ? (
              <div className="mt-6">Loading projects...</div>
            ) : (
              <div className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>All Projects</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Project</TableHead>
                          <TableHead>Entrepreneur</TableHead>
                          <TableHead>Category</TableHead>
                          <TableHead>Funding Goal</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Submitted</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {projects.map((project) => (
                          <TableRow key={project._id}>
                            <TableCell className="font-medium">{project.title}</TableCell>
                            <TableCell>{project.entrepreneur.name}</TableCell>
                            <TableCell>{project.category}</TableCell>
                            <TableCell>₹{project.fundingGoal.toLocaleString()}</TableCell>
                            <TableCell>
                              <Badge variant={project.approved ? "outline" : "secondary"}>
                                {project.approved ? "Approved" : "Pending"}
                              </Badge>
                            </TableCell>
                            <TableCell>{new Date(project.createdAt).toLocaleDateString()}</TableCell>
                            <TableCell className="text-right">
                              {!project.approved && (
                                <div className="flex justify-end gap-2">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="h-8 gap-1"
                                    onClick={() => handleApproveProject(project._id)}
                                  >
                                    <CheckCircle className="h-4 w-4" />
                                    <span>Approve</span>
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="h-8 gap-1 text-destructive"
                                    onClick={() => handleRejectProject(project._id)}
                                  >
                                    <XCircle className="h-4 w-4" />
                                    <span>Reject</span>
                                  </Button>
                                </div>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
} 