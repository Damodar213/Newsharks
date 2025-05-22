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

  // Load user data from localStorage
  useEffect(() => {
    const storedUserData = localStorage.getItem('userData');
    if (storedUserData) {
      try {
        const parsedUserData = JSON.parse(storedUserData);
        setUserData(parsedUserData);
        
        // Redirect if not an admin
        if (parsedUserData.role !== 'admin') {
          toast({
            title: "Access denied",
            description: "Only administrators can access this page",
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
        description: "Please log in to access the admin panel",
        variant: "destructive",
      });
      router.push('/login');
    }
  }, [router]);

  // Fetch projects when component mounts
  useEffect(() => {
    if (userData) {
      fetchProjects();
    }
  }, [userData]);

  const fetchProjects = async () => {
    try {
      const response = await fetch('/api/projects');
      const data = await response.json();
      
      if (data.success) {
        setProjects(data.projects);
      } else {
        toast({
          title: "Error",
          description: "Failed to fetch projects",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
      toast({
        title: "Error",
        description: "Failed to fetch projects",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleApproveProject = async (projectId: string) => {
    try {
      const response = await fetch(`/api/projects/${projectId}/approve`, {
        method: 'PUT',
      });
      const data = await response.json();
      
      if (data.success) {
        toast({
          title: "Success",
          description: "Project approved successfully",
        });
        fetchProjects(); // Refresh the projects list
      } else {
        toast({
          title: "Error",
          description: "Failed to approve project",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error approving project:', error);
      toast({
        title: "Error",
        description: "Failed to approve project",
        variant: "destructive",
      });
    }
  };

  const handleRejectProject = async (projectId: string) => {
    try {
      const response = await fetch(`/api/projects/${projectId}/reject`, {
        method: 'PUT',
      });
      const data = await response.json();
      
      if (data.success) {
        toast({
          title: "Success",
          description: "Project rejected successfully",
        });
        fetchProjects(); // Refresh the projects list
      } else {
        toast({
          title: "Error",
          description: "Failed to reject project",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error rejecting project:', error);
      toast({
        title: "Error",
        description: "Failed to reject project",
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
                            <TableCell>${project.fundingGoal.toLocaleString()}</TableCell>
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