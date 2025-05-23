"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Bell, LightbulbIcon, LogOut, Menu, MessageSquare, Plus, Settings, TrendingUp, User, Video } from "lucide-react"
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
import { VideoCallButton } from "@/components/VideoCallButton"

// Mock data for entrepreneur's projects
const mockProjects = [
  {
    id: 1,
    title: "EcoPackage - Sustainable Packaging Solution",
    description: "Biodegradable packaging materials made from agricultural waste",
    fundingGoal: 50000,
    currentFunding: 35000,
    investors: 12,
    status: "active",
    category: "Sustainability",
    createdAt: "2023-10-15",
  },
  {
    id: 2,
    title: "SmartGarden - IoT Plant Care System",
    description: "Automated plant care system using IoT sensors and AI",
    fundingGoal: 25000,
    currentFunding: 25000,
    investors: 8,
    status: "funded",
    category: "Technology",
    createdAt: "2023-09-01",
  },
  {
    id: 3,
    title: "HealthTrack - Wellness Monitoring App",
    description: "Mobile application for comprehensive health tracking and analysis",
    fundingGoal: 15000,
    currentFunding: 3000,
    investors: 2,
    status: "active",
    category: "Health",
    createdAt: "2023-11-05",
  },
]

// Mock messages
const mockMessages = [
  {
    id: 1,
    from: "Jane Smith",
    avatar: "JS",
    message: "I'm interested in your EcoPackage project. Can we schedule a call?",
    time: "2 hours ago",
    unread: true,
  },
  {
    id: 2,
    from: "Robert Johnson",
    avatar: "RJ",
    message: "Great presentation on SmartGarden. I have some questions about the technology.",
    time: "Yesterday",
    unread: false,
  },
  {
    id: 3,
    from: "Sarah Williams",
    avatar: "SW",
    message: "Congratulations on reaching your funding goal for SmartGarden!",
    time: "3 days ago",
    unread: false,
  },
]

// Mock scheduled video calls
const mockScheduledCalls = [
  {
    id: "123456",
    with: "Alex Smith",
    avatar: "AS",
    project: "SmartGarden - IoT Plant Care System",
    date: "Today",
    time: "2:30 PM",
    status: "upcoming",
  },
  {
    id: "789012",
    with: "Jane Smith",
    avatar: "JS",
    project: "EcoPackage - Sustainable Packaging Solution",
    date: "Tomorrow",
    time: "11:00 AM",
    status: "upcoming",
  },
  {
    id: "345678",
    with: "Robert Johnson",
    avatar: "RJ",
    project: "SmartGarden - IoT Plant Care System",
    date: "Nov 15, 2023",
    time: "3:00 PM",
    status: "completed",
  },
]

export default function EntrepreneurDashboard() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    if (typeof window !== "undefined") {
      const userData = localStorage.getItem("userData")
      if (userData) setUser(JSON.parse(userData))
    }
  }, [])

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
                    <AvatarFallback>JD</AvatarFallback>
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
              <h2 className="text-lg font-semibold">{user?.name || "Entrepreneur"}</h2>
              <p className="text-sm text-gray-500">{user?.role || "entrepreneur"}</p>
            </div>
            <nav className="flex flex-col gap-1">
              <Link
                href="/dashboard/entrepreneur"
                className="flex items-center gap-2 rounded-lg bg-primary/10 px-3 py-2 text-primary"
              >
                <TrendingUp className="h-5 w-5" />
                <span>Dashboard</span>
              </Link>
              <Link
                href="/dashboard/entrepreneur/projects"
                className="flex items-center gap-2 rounded-lg px-3 py-2 hover:bg-muted"
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
              <h1 className="text-2xl font-bold">Entrepreneur Dashboard</h1>
              <p className="text-gray-500">Manage your projects and connect with investors</p>
            </div>
            <div className="grid gap-6 md:grid-cols-3 mt-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Total Funding</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">₹63,000</div>
                  <p className="text-xs text-gray-500">Across all projects</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">2</div>
                  <p className="text-xs text-gray-500">Currently seeking funding</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Investor Connections</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">22</div>
                  <p className="text-xs text-gray-500">Interested in your ideas</p>
                </CardContent>
              </Card>
            </div>
            <div className="mt-6">
              <Tabs defaultValue="projects">
                <TabsList>
                  <TabsTrigger value="projects">My Projects</TabsTrigger>
                  <TabsTrigger value="messages">Recent Messages</TabsTrigger>
                  <TabsTrigger value="calls">Video Calls</TabsTrigger>
                </TabsList>
                <TabsContent value="projects" className="mt-4 space-y-4">
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold">My Projects</h2>
                    <Link href="/dashboard/entrepreneur/projects/new">
                      <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        New Project
                      </Button>
                    </Link>
                  </div>
                  <div className="grid gap-4">
                    {mockProjects.map((project) => (
                      <Card key={project.id}>
                        <CardHeader>
                          <div className="flex justify-between items-start">
                            <div>
                              <CardTitle>{project.title}</CardTitle>
                              <CardDescription>{project.description}</CardDescription>
                            </div>
                            <Badge variant={project.status === "funded" ? "default" : "outline"}>
                              {project.status === "funded" ? "Funded" : "Active"}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            <div>
                              <div className="flex justify-between text-sm mb-1">
                                <span>Funding Progress</span>
                                <span>
                                  ₹{project.currentFunding.toLocaleString()} of ₹{project.fundingGoal.toLocaleString()}
                                </span>
                              </div>
                              <Progress value={(project.currentFunding / project.fundingGoal) * 100} />
                            </div>
                            <div className="flex justify-between text-sm">
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
                            Edit
                          </Button>
                          <Button size="sm">View Details</Button>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                </TabsContent>
                <TabsContent value="messages" className="mt-4 space-y-4">
                  <h2 className="text-xl font-semibold">Recent Messages</h2>
                  <div className="grid gap-4">
                    {mockMessages.map((message) => (
                      <Card key={message.id} className={message.unread ? "border-primary/50" : ""}>
                        <CardHeader className="pb-2">
                          <div className="flex items-center gap-2">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback>{message.avatar}</AvatarFallback>
                            </Avatar>
                            <div>
                              <CardTitle className="text-base">{message.from}</CardTitle>
                              <CardDescription className="text-xs">{message.time}</CardDescription>
                            </div>
                            {message.unread && (
                              <Badge variant="secondary" className="ml-auto">
                                New
                              </Badge>
                            )}
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm">{message.message}</p>
                        </CardContent>
                        <CardFooter className="flex justify-end">
                          <Button size="sm">Reply</Button>
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
                            <VideoCallButton 
                              callId={call.id} 
                              size="sm" 
                            />
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
