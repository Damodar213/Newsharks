"use client"

import Link from "next/link"
import {
  Bell,
  Calendar,
  LightbulbIcon,
  LogOut,
  Menu,
  MessageSquare,
  Settings,
  TrendingUp,
  User,
  Video,
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
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useState } from "react"
import { useRouter } from "next/navigation"

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
]

// Mock past video calls
const mockPastCalls = [
  {
    id: "345678",
    with: "Robert Johnson",
    avatar: "RJ",
    project: "SmartGarden - IoT Plant Care System",
    date: "Nov 15, 2023",
    time: "3:00 PM",
    duration: "45 minutes",
    status: "completed",
  },
  {
    id: "901234",
    with: "Sarah Williams",
    avatar: "SW",
    project: "EcoPackage - Sustainable Packaging Solution",
    date: "Nov 10, 2023",
    time: "10:30 AM",
    duration: "32 minutes",
    status: "completed",
  },
  {
    id: "567890",
    with: "Michael Chen",
    avatar: "MC",
    project: "HealthTrack - Wellness Monitoring App",
    date: "Nov 5, 2023",
    time: "1:15 PM",
    duration: "28 minutes",
    status: "completed",
  },
]

export default function EntrepreneurVideoCallsPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const router = useRouter()

  const handleLogout = () => {
    // In a real app, you would clear authentication state here
    console.log("Logging out...")
    router.push("/login")
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
              <h2 className="text-lg font-semibold">John Doe</h2>
              <p className="text-sm text-gray-500">Entrepreneur</p>
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
                className="flex items-center gap-2 rounded-lg bg-primary/10 px-3 py-2 text-primary"
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
              <Button variant="outline" className="w-full justify-start gap-2" onClick={handleLogout}>
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
                <h1 className="text-2xl font-bold">Video Calls</h1>
                <p className="text-gray-500">Connect face-to-face with potential investors</p>
              </div>
              <Button>
                <Calendar className="mr-2 h-4 w-4" />
                Schedule Call
              </Button>
            </div>

            <Tabs defaultValue="upcoming">
              <TabsList>
                <TabsTrigger value="upcoming">Upcoming Calls</TabsTrigger>
                <TabsTrigger value="past">Past Calls</TabsTrigger>
              </TabsList>
              <TabsContent value="upcoming" className="mt-4 space-y-4">
                <div className="grid gap-4">
                  {mockScheduledCalls.map((call) => (
                    <Card key={call.id} className="border-primary/50">
                      <CardHeader className="pb-2">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-10 w-10">
                            <AvatarFallback>{call.avatar}</AvatarFallback>
                          </Avatar>
                          <div>
                            <CardTitle className="text-base">Call with {call.with}</CardTitle>
                            <CardDescription className="text-xs">
                              {call.date} at {call.time}
                            </CardDescription>
                          </div>
                          <Badge variant="secondary" className="ml-auto">
                            Upcoming
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm">Project: {call.project}</p>
                      </CardContent>
                      <CardFooter className="flex justify-end gap-2">
                        <Button variant="outline" size="sm">
                          Reschedule
                        </Button>
                        <Link href={`/video-call/${call.id}`}>
                          <Button size="sm" className="gap-2">
                            <Video className="h-4 w-4" />
                            Join Call
                          </Button>
                        </Link>
                      </CardFooter>
                    </Card>
                  ))}

                  {mockScheduledCalls.length === 0 && (
                    <div className="text-center py-12">
                      <Video className="mx-auto h-12 w-12 text-gray-300" />
                      <h3 className="mt-4 text-lg font-medium">No upcoming calls</h3>
                      <p className="mt-1 text-gray-500">Schedule a call with an investor to discuss your projects</p>
                    </div>
                  )}
                </div>
              </TabsContent>
              <TabsContent value="past" className="mt-4 space-y-4">
                <div className="grid gap-4">
                  {mockPastCalls.map((call) => (
                    <Card key={call.id}>
                      <CardHeader className="pb-2">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-10 w-10">
                            <AvatarFallback>{call.avatar}</AvatarFallback>
                          </Avatar>
                          <div>
                            <CardTitle className="text-base">Call with {call.with}</CardTitle>
                            <CardDescription className="text-xs">
                              {call.date} at {call.time} • {call.duration}
                            </CardDescription>
                          </div>
                          <Badge variant="outline" className="ml-auto">
                            Completed
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm">Project: {call.project}</p>
                      </CardContent>
                      <CardFooter className="flex justify-end gap-2">
                        <Button variant="outline" size="sm">
                          View Notes
                        </Button>
                        <Button size="sm">View Recording</Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  )
}
