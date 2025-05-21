"use client"

import { useState } from "react"
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

// Mock data for pending projects
const mockPendingProjects = [
  {
    id: 1,
    title: "FoodShare - Restaurant Surplus Distribution",
    entrepreneur: "Maria Garcia",
    category: "Food & Sustainability",
    fundingGoal: 35000,
    submittedDate: "2023-11-18",
  },
  {
    id: 2,
    title: "RenewEnergy - Portable Solar Chargers",
    entrepreneur: "James Wilson",
    category: "Clean Energy",
    fundingGoal: 45000,
    submittedDate: "2023-11-17",
  },
  {
    id: 3,
    title: "KidCode - Programming for Children",
    entrepreneur: "Priya Patel",
    category: "Education",
    fundingGoal: 20000,
    submittedDate: "2023-11-15",
  },
]

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
  { month: "Jan", amount: 45000 },
  { month: "Feb", amount: 62000 },
  { month: "Mar", amount: 78000 },
  { month: "Apr", amount: 95000 },
  { month: "May", amount: 110000 },
  { month: "Jun", amount: 135000 },
  { month: "Jul", amount: 162000 },
  { month: "Aug", amount: 178000 },
  { month: "Sep", amount: 195000 },
  { month: "Oct", amount: 210000 },
  { month: "Nov", amount: 230000 },
]

export default function AdminDashboard() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleApproveProject = (id: number) => {
    toast({
      title: "Project Approved",
      description: `Project ID ${id} has been approved and is now live.`,
    })
  }

  const handleRejectProject = (id: number) => {
    toast({
      title: "Project Rejected",
      description: `Project ID ${id} has been rejected.`,
    })
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
                  <Link
                    href="/dashboard/admin/settings"
                    className="flex items-center gap-2 text-lg font-semibold"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Settings className="h-5 w-5" />
                    <span>Platform Settings</span>
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
                href="/dashboard/admin/users"
                className="flex items-center gap-2 rounded-lg px-3 py-2 hover:bg-muted"
              >
                <Users className="h-5 w-5" />
                <span>User Management</span>
              </Link>
              <Link
                href="/dashboard/admin/projects"
                className="flex items-center gap-2 rounded-lg px-3 py-2 hover:bg-muted"
              >
                <TrendingUp className="h-5 w-5" />
                <span>Project Management</span>
                <Badge className="ml-auto">{mockPendingProjects.length}</Badge>
              </Link>
              <Link
                href="/dashboard/admin/video-calls"
                className="flex items-center gap-2 rounded-lg px-3 py-2 hover:bg-muted"
              >
                <Activity className="h-5 w-5" />
                <span>Video Calls</span>
              </Link>
              <Link
                href="/dashboard/admin/settings"
                className="flex items-center gap-2 rounded-lg px-3 py-2 hover:bg-muted"
              >
                <Settings className="h-5 w-5" />
                <span>Platform Settings</span>
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
                  <div className="text-2xl font-bold">${(mockStats.totalFunding / 1000000).toFixed(2)}M</div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-500">{mockStats.successRate}% success rate</span>
                    <span className="text-gray-500">Avg: ${mockStats.averageInvestment}</span>
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
                  <div className="text-2xl font-bold">${mockStats.monthlyRevenue.toLocaleString()}</div>
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
                  <div className="text-2xl font-bold">{mockStats.pendingApprovals}</div>
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
                          {mockPendingProjects.map((project) => (
                            <TableRow key={project.id}>
                              <TableCell className="font-medium">{project.title}</TableCell>
                              <TableCell>{project.entrepreneur}</TableCell>
                              <TableCell>{project.category}</TableCell>
                              <TableCell>${project.fundingGoal.toLocaleString()}</TableCell>
                              <TableCell>{project.submittedDate}</TableCell>
                              <TableCell className="text-right">
                                <div className="flex justify-end gap-2">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="h-8 gap-1"
                                    onClick={() => handleApproveProject(project.id)}
                                  >
                                    <CheckCircle className="h-4 w-4" />
                                    <span>Approve</span>
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="h-8 gap-1 text-destructive"
                                    onClick={() => handleRejectProject(project.id)}
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
                              <TableCell>${transaction.amount.toLocaleString()}</TableCell>
                              <TableCell>{transaction.date}</TableCell>
                              <TableCell>
                                <Badge variant={transaction.status === "completed" ? "outline" : "secondary"}>
                                  {transaction.status}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-right">
                                ${((transaction.amount * mockStats.platformFee) / 100).toLocaleString()}
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
