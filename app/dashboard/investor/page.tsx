"use client"

import { useState } from "react"
import Link from "next/link"
import {
  Bell,
  Filter,
  LogOut,
  Menu,
  MessageSquare,
  Search,
  Settings,
  TrendingUp,
  User,
  Video,
  Wallet,
} from "lucide-react"
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Mock data for available projects
const mockProjects = [
  {
    id: 1,
    title: "EcoPackage - Sustainable Packaging Solution",
    description: "Biodegradable packaging materials made from agricultural waste",
    entrepreneur: "Sarah Johnson",
    fundingGoal: 50000,
    currentFunding: 35000,
    investors: 12,
    status: "active",
    category: "Sustainability",
    createdAt: "2023-10-15",
    matchScore: 95,
  },
  {
    id: 2,
    title: "HealthTrack - Wellness Monitoring App",
    description: "Mobile application for comprehensive health tracking and analysis",
    entrepreneur: "Michael Chen",
    fundingGoal: 15000,
    currentFunding: 3000,
    investors: 2,
    status: "active",
    category: "Health",
    createdAt: "2023-11-05",
    matchScore: 87,
  },
  {
    id: 3,
    title: "UrbanFarm - Vertical Farming Technology",
    description: "Innovative vertical farming solution for urban environments",
    entrepreneur: "Emma Rodriguez",
    fundingGoal: 75000,
    currentFunding: 42000,
    investors: 15,
    status: "active",
    category: "Agriculture",
    createdAt: "2023-09-22",
    matchScore: 82,
  },
  {
    id: 4,
    title: "EduTech - AI-Powered Learning Platform",
    description: "Personalized education platform using artificial intelligence",
    entrepreneur: "David Kim",
    fundingGoal: 30000,
    currentFunding: 18000,
    investors: 7,
    status: "active",
    category: "Education",
    createdAt: "2023-10-30",
    matchScore: 78,
  },
]

// Mock data for investor's investments
const mockInvestments = [
  {
    id: 1,
    title: "SmartGarden - IoT Plant Care System",
    entrepreneur: "John Doe",
    amountInvested: 10000,
    equityPercentage: 5,
    status: "active",
    returnToDate: 0,
    investedDate: "2023-09-15",
  },
  {
    id: 2,
    title: "DeliveryDrones - Last Mile Delivery Solution",
    entrepreneur: "Lisa Wang",
    amountInvested: 25000,
    equityPercentage: 8,
    status: "profitable",
    returnToDate: 3500,
    investedDate: "2023-06-22",
  },
]

// Mock scheduled video calls
const mockScheduledCalls = [
  {
    id: "123456",
    with: "John Doe",
    avatar: "JD",
    project: "SmartGarden - IoT Plant Care System",
    date: "Today",
    time: "2:30 PM",
    status: "upcoming",
  },
  {
    id: "789012",
    with: "Sarah Johnson",
    avatar: "SJ",
    project: "EcoPackage - Sustainable Packaging Solution",
    date: "Tomorrow",
    time: "11:00 AM",
    status: "upcoming",
  },
]

export default function InvestorDashboard() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

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
                    href="/dashboard/investor"
                    className="flex items-center gap-2 text-lg font-semibold"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <TrendingUp className="h-5 w-5" />
                    <span>Dashboard</span>
                  </Link>
                  <Link
                    href="/dashboard/investor/investments"
                    className="flex items-center gap-2 text-lg font-semibold"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Wallet className="h-5 w-5" />
                    <span>My Investments</span>
                  </Link>
                  <Link
                    href="/dashboard/investor/messages"
                    className="flex items-center gap-2 text-lg font-semibold"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <MessageSquare className="h-5 w-5" />
                    <span>Messages</span>
                  </Link>
                  <Link
                    href="/dashboard/investor/video-calls"
                    className="flex items-center gap-2 text-lg font-semibold"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Video className="h-5 w-5" />
                    <span>Video Calls</span>
                  </Link>
                  <Link
                    href="/dashboard/investor/settings"
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
                5
              </span>
              <span className="sr-only">Notifications</span>
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Avatar>
                    <AvatarFallback>AS</AvatarFallback>
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
              <h2 className="text-lg font-semibold">Alex Smith</h2>
              <p className="text-sm text-gray-500">Investor</p>
            </div>
            <nav className="flex flex-col gap-1">
              <Link
                href="/dashboard/investor"
                className="flex items-center gap-2 rounded-lg bg-primary/10 px-3 py-2 text-primary"
              >
                <TrendingUp className="h-5 w-5" />
                <span>Dashboard</span>
              </Link>
              <Link
                href="/dashboard/investor/investments"
                className="flex items-center gap-2 rounded-lg px-3 py-2 hover:bg-muted"
              >
                <Wallet className="h-5 w-5" />
                <span>My Investments</span>
              </Link>
              <Link
                href="/dashboard/investor/messages"
                className="flex items-center gap-2 rounded-lg px-3 py-2 hover:bg-muted"
              >
                <MessageSquare className="h-5 w-5" />
                <span>Messages</span>
                <Badge className="ml-auto">2</Badge>
              </Link>
              <Link
                href="/dashboard/investor/video-calls"
                className="flex items-center gap-2 rounded-lg px-3 py-2 hover:bg-muted"
              >
                <Video className="h-5 w-5" />
                <span>Video Calls</span>
                <Badge className="ml-auto">2</Badge>
              </Link>
              <Link
                href="/dashboard/investor/settings"
                className="flex items-center gap-2 rounded-lg px-3 py-2 hover:bg-muted"
              >
                <Settings className="h-5 w-5" />
                <span>Settings</span>
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
              <h1 className="text-2xl font-bold">Investor Dashboard</h1>
              <p className="text-gray-500">Discover promising ideas and manage your investments</p>
            </div>
            <div className="grid gap-6 md:grid-cols-3 mt-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Total Invested</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">$35,000</div>
                  <p className="text-xs text-gray-500">Across 2 projects</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Current Returns</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">$3,500</div>
                  <p className="text-xs text-gray-500">10% average ROI</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Available Balance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">$65,000</div>
                  <p className="text-xs text-gray-500">Ready to invest</p>
                </CardContent>
              </Card>
            </div>
            <div className="mt-6">
              <Tabs defaultValue="discover">
                <TabsList>
                  <TabsTrigger value="discover">Discover Projects</TabsTrigger>
                  <TabsTrigger value="investments">My Investments</TabsTrigger>
                  <TabsTrigger value="calls">Video Calls</TabsTrigger>
                </TabsList>
                <TabsContent value="discover" className="mt-4 space-y-4">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <h2 className="text-xl font-semibold">Recommended Projects</h2>
                    <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
                      <div className="relative w-full md:w-64">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                        <Input
                          type="search"
                          placeholder="Search projects..."
                          className="pl-8 w-full"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                        />
                      </div>
                      <div className="flex gap-2">
                        <Select defaultValue="all">
                          <SelectTrigger className="w-full md:w-40">
                            <SelectValue placeholder="Category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Categories</SelectItem>
                            <SelectItem value="tech">Technology</SelectItem>
                            <SelectItem value="health">Health</SelectItem>
                            <SelectItem value="sustainability">Sustainability</SelectItem>
                            <SelectItem value="education">Education</SelectItem>
                            <SelectItem value="agriculture">Agriculture</SelectItem>
                          </SelectContent>
                        </Select>
                        <Button variant="outline" size="icon">
                          <Filter className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                  <div className="grid gap-4">
                    {mockProjects.map((project) => (
                      <Card key={project.id}>
                        <CardHeader>
                          <div className="flex flex-col md:flex-row justify-between md:items-start gap-2">
                            <div>
                              <div className="flex items-center gap-2">
                                <CardTitle>{project.title}</CardTitle>
                                <Badge variant="secondary" className="ml-2">
                                  {project.matchScore}% Match
                                </Badge>
                              </div>
                              <CardDescription>{project.description}</CardDescription>
                            </div>
                            <div className="flex items-center gap-1 text-sm">
                              <Avatar className="h-6 w-6">
                                <AvatarFallback>{project.entrepreneur.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <span>{project.entrepreneur}</span>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            <div>
                              <div className="flex justify-between text-sm mb-1">
                                <span>Funding Progress</span>
                                <span>
                                  ${project.currentFunding.toLocaleString()} of ${project.fundingGoal.toLocaleString()}
                                </span>
                              </div>
                              <Progress value={(project.currentFunding / project.fundingGoal) * 100} />
                            </div>
                            <div className="flex flex-wrap justify-between text-sm gap-y-2">
                              <div>
                                <span className="text-gray-500">Category:</span> {project.category}
                              </div>
                              <div>
                                <span className="text-gray-500">Investors:</span> {project.investors}
                              </div>
                              <div>
                                <span className="text-gray-500">Created:</span> {project.createdAt}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                        <CardFooter className="flex justify-end gap-2">
                          <Button variant="outline" size="sm">
                            Contact
                          </Button>
                          <Button size="sm">View Details</Button>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                </TabsContent>
                <TabsContent value="investments" className="mt-4 space-y-4">
                  <h2 className="text-xl font-semibold">My Investments</h2>
                  <div className="grid gap-4">
                    {mockInvestments.map((investment) => (
                      <Card key={investment.id}>
                        <CardHeader>
                          <div className="flex flex-col md:flex-row justify-between md:items-start gap-2">
                            <div>
                              <CardTitle>{investment.title}</CardTitle>
                              <CardDescription>Invested on {investment.investedDate}</CardDescription>
                            </div>
                            <Badge variant={investment.status === "profitable" ? "default" : "outline"}>
                              {investment.status === "profitable" ? "Profitable" : "Active"}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="space-y-1">
                              <p className="text-sm text-gray-500">Amount Invested</p>
                              <p className="text-lg font-semibold">${investment.amountInvested.toLocaleString()}</p>
                            </div>
                            <div className="space-y-1">
                              <p className="text-sm text-gray-500">Equity Percentage</p>
                              <p className="text-lg font-semibold">{investment.equityPercentage}%</p>
                            </div>
                            <div className="space-y-1">
                              <p className="text-sm text-gray-500">Return to Date</p>
                              <p className="text-lg font-semibold">${investment.returnToDate.toLocaleString()}</p>
                            </div>
                          </div>
                          <div className="mt-4 flex items-center text-sm">
                            <Avatar className="h-6 w-6 mr-2">
                              <AvatarFallback>{investment.entrepreneur.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <span>Entrepreneur: {investment.entrepreneur}</span>
                          </div>
                        </CardContent>
                        <CardFooter className="flex justify-end gap-2">
                          <Button variant="outline" size="sm">
                            Contact Entrepreneur
                          </Button>
                          <Button size="sm">View Details</Button>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                </TabsContent>
                <TabsContent value="calls" className="mt-4 space-y-4">
                  <h2 className="text-xl font-semibold">Video Calls</h2>
                  <div className="grid gap-4">
                    {mockScheduledCalls.map((call) => (
                      <Card key={call.id} className={call.status === "upcoming" ? "border-primary/50" : ""}>
                        <CardHeader className="pb-2">
                          <div className="flex items-center gap-2">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback>{call.avatar}</AvatarFallback>
                            </Avatar>
                            <div>
                              <CardTitle className="text-base">Call with {call.with}</CardTitle>
                              <CardDescription className="text-xs">
                                {call.date} at {call.time}
                              </CardDescription>
                            </div>
                            <Badge variant={call.status === "upcoming" ? "secondary" : "outline"} className="ml-auto">
                              {call.status === "upcoming" ? "Upcoming" : "Completed"}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm">Project: {call.project}</p>
                        </CardContent>
                        <CardFooter className="flex justify-end">
                          {call.status === "upcoming" ? (
                            <Link href={`/video-call/${call.id}`}>
                              <Button size="sm" className="gap-2">
                                <Video className="h-4 w-4" />
                                Join Call
                              </Button>
                            </Link>
                          ) : (
                            <Button variant="outline" size="sm">
                              View Recording
                            </Button>
                          )}
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
