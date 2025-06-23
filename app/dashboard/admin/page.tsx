"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
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
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { toast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"

// Define types for the project and user data
interface EntrepreneurInfo {
  name: string;
  email: string;
  _id?: string;
}

interface Project {
  _id: string;
  title: string;
  description: string;
  category: string;
  fundingGoal: number;
  currentFunding?: number;
  equityOffering: number;
  approved: boolean;
  rejected?: boolean;
  createdAt: string;
  updatedAt?: string;
  entrepreneur: EntrepreneurInfo;
}

interface UserData {
  _id?: string;
  id?: string;
  name: string;
  email: string;
  role?: string;
  userType?: string;
}

// Mock data for users
const mockUsers = [
  {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    role: "entrepreneur",
    projects: 3,
    joinDate: "2023-09-10",
    status: "active",
  },
  {
    id: 2,
    name: "Alex Smith",
    email: "alex@example.com",
    role: "investor",
    investments: 2,
    joinDate: "2023-09-15",
    status: "active",
  },
  {
    id: 3,
    name: "Sarah Johnson",
    email: "sarah@example.com",
    role: "entrepreneur",
    projects: 1,
    joinDate: "2023-10-05",
    status: "active",
  },
  {
    id: 4,
    name: "Michael Chen",
    email: "michael@example.com",
    role: "entrepreneur",
    projects: 1,
    joinDate: "2023-10-22",
    status: "pending",
  },
  {
    id: 5,
    name: "Emma Rodriguez",
    email: "emma@example.com",
    role: "entrepreneur",
    projects: 1,
    joinDate: "2023-09-28",
    status: "active",
  },
]

// Mock platform statistics
const mockStats = {
  totalUsers: 156,
  totalProjects: 48,
  totalInvestments: 87,
  totalFunding: 1250000,
  activeProjects: 32,
  completedProjects: 16,
  averageInvestment: 14367,
  successRate: 78,
  userGrowth: 15, // percentage growth this month
  fundingGrowth: 22, // percentage growth this month
  videoCalls: 34, // total video calls this month
  pendingApprovals: 3,
  monthlyRevenue: 12500,
  platformFee: 5, // percentage
}

// Mock data for recent transactions
const mockTransactions = [
  {
    id: 1,
    investor: "Alex Smith",
    entrepreneur: "John Doe",
    project: "SmartGarden - IoT Plant Care System",
    amount: 10000,
    date: "2023-11-15",
    status: "completed",
  },
  {
    id: 2,
    investor: "Robert Johnson",
    entrepreneur: "Sarah Johnson",
    project: "EcoPackage - Sustainable Packaging Solution",
    amount: 15000,
    date: "2023-11-14",
    status: "completed",
  },
  {
    id: 3,
    investor: "Lisa Wang",
    entrepreneur: "Michael Chen",
    project: "HealthTrack - Wellness Monitoring App",
    amount: 5000,
    date: "2023-11-12",
    status: "pending",
  },
  {
    id: 4,
    investor: "David Kim",
    entrepreneur: "Emma Rodriguez",
    project: "UrbanFarm - Vertical Farming Technology",
    amount: 20000,
    date: "2023-11-10",
    status: "completed",
  },
]

// Mock data for video calls
const mockVideoCalls = [
  {
    id: 1,
    investor: "Alex Smith",
    entrepreneur: "John Doe",
    project: "SmartGarden - IoT Plant Care System",
    date: "2023-11-18",
    time: "14:30",
    duration: "45 minutes",
    status: "scheduled",
  },
  {
    id: 2,
    investor: "Robert Johnson",
    entrepreneur: "Sarah Johnson",
    project: "EcoPackage - Sustainable Packaging Solution",
    date: "2023-11-17",
    time: "10:00",
    duration: "32 minutes",
    status: "completed",
  },
  {
    id: 3,
    investor: "Lisa Wang",
    entrepreneur: "Michael Chen",
    project: "HealthTrack - Wellness Monitoring App",
    date: "2023-11-16",
    time: "16:15",
    duration: "28 minutes",
    status: "completed",
  },
]

// Monthly funding data for chart
const monthlyFundingData = [
  { month: "Jan", amount: 120000 },
  { month: "Feb", amount: 95000 },
  { month: "Mar", amount: 135000 },
  { month: "Apr", amount: 105000 },
  { month: "May", amount: 80000 },
  { month: "Jun", amount: 95000 },
  { month: "Jul", amount: 150000 },
  { month: "Aug", amount: 170000 },
  { month: "Sep", amount: 190000 },
  { month: "Oct", amount: 215000 },
  { month: "Nov", amount: 230000 },
  { month: "Dec", amount: 150000 },
]

export default function AdminDashboard() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const router = useRouter()
  const [pendingProjects, setPendingProjects] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [userData, setUserData] = useState<UserData | null>(null)
  const [isClient, setIsClient] = useState(false)
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProjects: 0,
    totalInvestments: 0,
    totalFunding: 0,
    activeProjects: 0,
    completedProjects: 0,
    averageInvestment: 0,
    successRate: 0,
    userGrowth: 0,
    fundingGrowth: 0,
    videoCalls: 0,
    pendingApprovals: 0,
    monthlyRevenue: 0,
    platformFee: 5,
  })

  // Mock data for these sections until we implement them
  const [users] = useState(mockUsers)
  const [transactions] = useState(mockTransactions)
  const [videoCalls] = useState(mockVideoCalls)

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (!isClient) return;

    // Check for user authentication and admin role
    try {
      const storedUserData = localStorage.getItem('userData');
      console.log("Admin dashboard - Raw userData from localStorage:", storedUserData);
      
      if (storedUserData) {
        let parsedUserData;
        try {
          parsedUserData = JSON.parse(storedUserData);
          console.log("Admin dashboard - Parsed userData:", parsedUserData);
          setUserData(parsedUserData);
          
          // Fix: Check for both role and userType for compatibility
          const isAdmin = parsedUserData.role === 'admin' || parsedUserData.userType === 'admin';
          console.log("Is admin check result:", isAdmin, "Role:", parsedUserData.role, "UserType:", parsedUserData.userType);
          
          if (!isAdmin) {
            console.log("Access denied - User is not admin");
            toast({
              title: "Access denied",
              description: "Only administrators can access this page",
              variant: "destructive",
            });
            router.push('/dashboard');
          } else {
            console.log("Admin access granted, fetching projects");
            // Fetch pending projects and stats
            fetchPendingProjects();
          }
        } catch (parseError) {
          console.error("Error parsing userData JSON:", parseError);
          toast({
            title: "Session error",
            description: "Your session data is corrupted. Please log in again.",
            variant: "destructive",
          });
          router.push('/login');
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
      console.error("Error checking admin authentication:", error);
      router.push('/login');
    }
  }, [router, isClient]);

  const fetchPendingProjects = async () => {
    try {
      setIsLoading(true);
      // Fetch projects that are not approved
      const response = await fetch('/api/projects', {
        headers: {
          'pragma': 'no-cache',
          'cache-control': 'no-cache'
        }
      });
      
      if (!response.ok) {
        throw new Error(`API returned status ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        // Filter projects that are not approved
        const unapprovedProjects = data.projects.filter((project: Project) => project.approved === false);
        setPendingProjects(unapprovedProjects);
        
        // Update stats based on real data
        setStats(prevStats => ({
          ...prevStats,
          totalProjects: data.projects.length,
          activeProjects: data.projects.filter((p: Project) => p.approved === true).length,
          pendingApprovals: unapprovedProjects.length
        }));

        console.log("Pending projects loaded:", unapprovedProjects.length);
      } else {
        console.error("API returned failure:", data.error);
        toast({
          title: "Error",
          description: data.error || "Failed to fetch projects",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error fetching pending projects:', error);
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
      const response = await fetch(`/api/projects/${projectId}/approve`, {
        method: 'PUT',
      });
      
      if (!response.ok) {
        throw new Error(`API returned status ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        toast({
          title: "Project Approved",
          description: "The project has been approved and is now live.",
        });
        // Refresh the list of pending projects
        fetchPendingProjects();
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
  }

  const handleRejectProject = async (projectId: string) => {
    try {
      const response = await fetch(`/api/projects/${projectId}/reject`, {
        method: 'PUT',
      });
      
      if (!response.ok) {
        throw new Error(`API returned status ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        toast({
          title: "Project Rejected",
          description: "The project has been rejected.",
        });
        // Refresh the list of pending projects
        fetchPendingProjects();
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
  }

  const handleSuspendUser = (id: number) => {
    toast({
      title: "User Suspended",
      description: `User ID ${id} has been suspended.`,
    })
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
              <span className="text-xl font-bold hidden md:inline-block">NEW SHARKS</span>
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
                8
              </span>
              <span className="sr-only">Notifications</span>
            </Button>
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
                <DropdownMenuItem>
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
                className="flex items-center gap-2 rounded-lg bg-primary/10 px-3 py-2 text-primary"
              >
                <Shield className="h-5 w-5" />
                <span>Dashboard</span>
              </Link>
              <Link
                href="/dashboard/admin/projects"
                className="flex items-center gap-2 rounded-lg px-3 py-2 hover:bg-muted"
              >
                <TrendingUp className="h-5 w-5" />
                <span>Project Management</span>
                <Badge className="ml-auto">{stats.pendingApprovals}</Badge>
              </Link>
            </nav>
            <div className="mt-auto">
              <Button variant="outline" className="w-full justify-start gap-2">
                <LogOut className="h-5 w-5" />
                <span>Log out</span>
              </Button>
            </div>
          </div>
        </aside>
        <main className="flex-1 overflow-auto">
          <div className="container py-6 px-4 md:px-6">
            <div className="flex flex-col gap-1">
              <h1 className="text-2xl font-bold">Admin Dashboard</h1>
              <p className="text-gray-500">Monitor and manage platform activities</p>
            </div>

            {/* Key Metrics */}
            <div className="grid gap-6 md:grid-cols-4 mt-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{mockStats.totalUsers}</div>
                  <div className="flex items-center text-xs text-green-500">
                    <TrendingUp className="mr-1 h-3 w-3" />
                    <span>+{mockStats.userGrowth}% this month</span>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{mockStats.totalProjects}</div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-500">{mockStats.activeProjects} active</span>
                    <span className="text-gray-500">{mockStats.completedProjects} completed</span>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Total Investments</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{mockStats.totalInvestments}</div>
                  <div className="flex items-center text-xs text-green-500">
                    <TrendingUp className="mr-1 h-3 w-3" />
                    <span>+{mockStats.fundingGrowth}% this month</span>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Total Funding</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">₹{(mockStats.totalFunding / 1000000).toFixed(2)}M</div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-500">{mockStats.successRate}% success rate</span>
                    <span className="text-gray-500">Avg: ₹{mockStats.averageInvestment}</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Second row of metrics */}
            <div className="grid gap-6 md:grid-cols-3 mt-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Platform Revenue</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">₹{mockStats.monthlyRevenue.toLocaleString()}</div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-500">This month</span>
                    <span className="text-gray-500">{mockStats.platformFee}% platform fee</span>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Video Calls</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{mockStats.videoCalls}</div>
                  <div className="text-xs text-gray-500">Total calls this month</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Pending Approvals</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.pendingApprovals}</div>
                  <div className="text-xs text-gray-500">Projects awaiting review</div>
                </CardContent>
              </Card>
            </div>

            {/* Monthly Funding Chart */}
            <div className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Monthly Funding Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[200px] w-full">
                    <div className="flex h-full items-end gap-2">
                      {monthlyFundingData.map((month) => (
                        <div key={month.month} className="relative flex h-full w-full flex-col justify-end">
                          <div
                            className="bg-primary rounded-t w-full"
                            style={{ height: `${(month.amount / 230000) * 100}%` }}
                          ></div>
                          <span className="mt-2 text-xs text-center">{month.month}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="mt-6">
              <Tabs defaultValue="pending">
                <TabsList>
                  <TabsTrigger value="pending">Pending Approvals</TabsTrigger>
                  <TabsTrigger value="users">Recent Users</TabsTrigger>
                  <TabsTrigger value="transactions">Recent Transactions</TabsTrigger>
                  <TabsTrigger value="calls">Video Calls</TabsTrigger>
                </TabsList>

                {/* Pending Approvals Tab */}
                <TabsContent value="pending" className="mt-4 space-y-4">
                  <h2 className="text-xl font-semibold">Pending Project Approvals</h2>
                  <Card>
                    <CardContent className="p-0">
                      {isLoading ? (
                        <div className="flex justify-center items-center p-8">
                          <span>Loading pending projects...</span>
                        </div>
                      ) : pendingProjects.length === 0 ? (
                        <div className="flex justify-center items-center p-8">
                          <span>No pending project approvals at this time.</span>
                        </div>
                      ) : (
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Project</TableHead>
                              <TableHead>Entrepreneur</TableHead>
                              <TableHead>Category</TableHead>
                              <TableHead>Funding Goal</TableHead>
                              <TableHead>Submitted</TableHead>
                              <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {pendingProjects.map((project) => (
                              <TableRow key={project._id}>
                                <TableCell className="font-medium">{project.title}</TableCell>
                                <TableCell>{project.entrepreneur.name}</TableCell>
                                <TableCell>{project.category}</TableCell>
                                <TableCell>₹{project.fundingGoal.toLocaleString()}</TableCell>
                                <TableCell>{new Date(project.createdAt).toLocaleDateString()}</TableCell>
                                <TableCell className="text-right">
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
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Users Tab */}
                <TabsContent value="users" className="mt-4 space-y-4">
                  <h2 className="text-xl font-semibold">Recent Users</h2>
                  <Card>
                    <CardContent className="p-0">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead>Projects/Investments</TableHead>
                            <TableHead>Join Date</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {mockUsers.map((user) => (
                            <TableRow key={user.id}>
                              <TableCell className="font-medium">{user.name}</TableCell>
                              <TableCell>{user.email}</TableCell>
                              <TableCell className="capitalize">{user.role}</TableCell>
                              <TableCell>{user.role === "entrepreneur" ? user.projects : user.investments}</TableCell>
                              <TableCell>{user.joinDate}</TableCell>
                              <TableCell>
                                <Badge variant={user.status === "active" ? "outline" : "secondary"}>
                                  {user.status}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-right">
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                      <ChevronDown className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem>View Details</DropdownMenuItem>
                                    <DropdownMenuItem>Edit User</DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                      className="text-destructive"
                                      onClick={() => handleSuspendUser(user.id)}
                                    >
                                      Suspend User
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                    <CardFooter className="flex justify-center border-t p-2">
                      <Button variant="outline" size="sm">
                        View All Users
                      </Button>
                    </CardFooter>
                  </Card>
                </TabsContent>

                {/* Transactions Tab */}
                <TabsContent value="transactions" className="mt-4 space-y-4">
                  <h2 className="text-xl font-semibold">Recent Transactions</h2>
                  <Card>
                    <CardContent className="p-0">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Investor</TableHead>
                            <TableHead>Entrepreneur</TableHead>
                            <TableHead>Project</TableHead>
                            <TableHead>Amount</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Platform Fee</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {mockTransactions.map((transaction) => (
                            <TableRow key={transaction.id}>
                              <TableCell className="font-medium">{transaction.investor}</TableCell>
                              <TableCell>{transaction.entrepreneur}</TableCell>
                              <TableCell>{transaction.project}</TableCell>
                              <TableCell>₹{transaction.amount.toLocaleString()}</TableCell>
                              <TableCell>{transaction.date}</TableCell>
                              <TableCell>
                                <Badge variant={transaction.status === "completed" ? "outline" : "secondary"}>
                                  {transaction.status}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-right">
                                ₹{((transaction.amount * mockStats.platformFee) / 100).toLocaleString()}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                    <CardFooter className="flex justify-center border-t p-2">
                      <Button variant="outline" size="sm">
                        View All Transactions
                      </Button>
                    </CardFooter>
                  </Card>
                </TabsContent>

                {/* Video Calls Tab */}
                <TabsContent value="calls" className="mt-4 space-y-4">
                  <h2 className="text-xl font-semibold">Recent Video Calls</h2>
                  <Card>
                    <CardContent className="p-0">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Investor</TableHead>
                            <TableHead>Entrepreneur</TableHead>
                            <TableHead>Project</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Time</TableHead>
                            <TableHead>Duration</TableHead>
                            <TableHead>Status</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {mockVideoCalls.map((call) => (
                            <TableRow key={call.id}>
                              <TableCell className="font-medium">{call.investor}</TableCell>
                              <TableCell>{call.entrepreneur}</TableCell>
                              <TableCell>{call.project}</TableCell>
                              <TableCell>{call.date}</TableCell>
                              <TableCell>{call.time}</TableCell>
                              <TableCell>{call.duration}</TableCell>
                              <TableCell>
                                <Badge variant={call.status === "completed" ? "outline" : "secondary"}>
                                  {call.status}
                                </Badge>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                    <CardFooter className="flex justify-center border-t p-2">
                      <Button variant="outline" size="sm">
                        View All Video Calls
                      </Button>
                    </CardFooter>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
