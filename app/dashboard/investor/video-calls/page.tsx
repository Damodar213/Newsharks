"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Bell, LogOut, Menu, MessageSquare, Settings, TrendingUp, User, Video, Wallet, Calendar, Filter, Clock } from "lucide-react"
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
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { toast } from "@/components/ui/use-toast"
import { VideoCallButton } from "@/components/VideoCallButton"

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
    with: "Emma Rodriguez",
    avatar: "ER",
    project: "EcoPackage - Sustainable Packaging Solution",
    date: "Tomorrow",
    time: "11:00 AM",
    status: "upcoming",
  },
  {
    id: "345678",
    with: "Michael Chen",
    avatar: "MC",
    project: "HealthTrack - Wellness Monitoring App",
    date: "Nov 20, 2023",
    time: "3:00 PM",
    status: "scheduled",
  },
  {
    id: "901234",
    with: "Sarah Johnson",
    avatar: "SJ",
    project: "EduTech - Online Learning Platform",
    date: "Nov 15, 2023",
    time: "3:00 PM",
    status: "completed",
  }
]

// Mock previous video calls
const mockPreviousCalls = [
  {
    id: "567890",
    with: "Michael Chen",
    avatar: "MC",
    project: "HealthTrack - Wellness Monitoring App", 
    date: "Nov 12, 2023",
    time: "2:00 PM",
    duration: "45 minutes",
    recording: true,
  },
  {
    id: "123789",
    with: "John Doe",
    avatar: "JD",
    project: "SmartGarden - IoT Plant Care System",
    date: "Nov 8, 2023",
    time: "10:30 AM",
    duration: "32 minutes",
    recording: true,
  },
]

export default function InvestorVideoCalls() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const router = useRouter()
  const [userData, setUserData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Load user data from localStorage
  useEffect(() => {
    const storedUserData = localStorage.getItem('userData');
    if (storedUserData) {
      try {
        const parsedUserData = JSON.parse(storedUserData);
        setUserData(parsedUserData);
        
        // Redirect if not an investor
        if (parsedUserData.role !== 'investor') {
          toast({
            title: "Access denied",
            description: "Only investors can access this page",
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
        description: "Please log in to view video calls",
        variant: "destructive",
      });
      router.push('/login');
    }
    
    setIsLoading(false);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('userData');
    router.push('/login');
  }

  if (isLoading || !userData) {
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
                    <AvatarFallback>{userData.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Investor Account</DropdownMenuLabel>
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
              <p className="text-sm text-gray-500">Investor</p>
            </div>
            <nav className="flex flex-col gap-1">
              <Link
                href="/dashboard/investor"
                className="flex items-center gap-2 rounded-lg px-3 py-2 hover:bg-muted"
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
              </Link>
              <Link
                href="/dashboard/investor/video-calls"
                className="flex items-center gap-2 rounded-lg bg-primary/10 px-3 py-2 text-primary"
              >
                <Video className="h-5 w-5" />
                <span>Video Calls</span>
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
              <h1 className="text-2xl font-bold">Video Calls</h1>
              <p className="text-gray-500">Connect with entrepreneurs via video calls</p>
            </div>

            <div className="mt-6">
              <Tabs defaultValue="upcoming">
                <div className="flex justify-between items-center">
                  <TabsList>
                    <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                    <TabsTrigger value="previous">Previous</TabsTrigger>
                  </TabsList>
                  <VideoCallButton 
                    variant="outline"
                    userRole="investor"
                    userName={userData.name} 
                  />
                </div>
                
                <TabsContent value="upcoming" className="mt-4 space-y-4">
                  <div className="grid gap-4">
                    {mockScheduledCalls.map((call) => (
                      <Card key={call.id}>
                        <CardHeader>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10">
                              <AvatarFallback>{call.avatar}</AvatarFallback>
                            </Avatar>
                            <div>
                              <CardTitle className="text-base">{call.project}</CardTitle>
                              <CardDescription>With {call.with}</CardDescription>
                            </div>
                            <Badge variant="outline" className="ml-auto">
                              {call.status === "upcoming" ? "Today" : call.status === "scheduled" ? "Scheduled" : "Completed"}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="flex items-center text-sm">
                            <Calendar className="mr-2 h-4 w-4 text-gray-500" />
                            <span>
                              {call.date} at {call.time}
                            </span>
                          </div>
                        </CardContent>
                        <CardFooter className="flex justify-end gap-2">
                          {call.status === "upcoming" || call.status === "scheduled" ? (
                            <>
                              <Button variant="outline" size="sm">
                                Reschedule
                              </Button>
                              <VideoCallButton 
                                callId={call.id} 
                                size="sm"
                                userRole="investor"
                                userName={userData.name}
                              />
                            </>
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
                
                <TabsContent value="previous" className="mt-4 space-y-4">
                  <div className="grid gap-4">
                    {mockPreviousCalls.map((call) => (
                      <Card key={call.id}>
                        <CardHeader>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10">
                              <AvatarFallback>{call.avatar}</AvatarFallback>
                            </Avatar>
                            <div>
                              <CardTitle className="text-base">{call.project}</CardTitle>
                              <CardDescription>With {call.with}</CardDescription>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2 text-sm">
                            <div className="flex items-center">
                              <Calendar className="mr-2 h-4 w-4 text-gray-500" />
                              <span>
                                {call.date} at {call.time}
                              </span>
                            </div>
                            <div className="flex items-center">
                              <Clock className="mr-2 h-4 w-4 text-gray-500" />
                              <span>Duration: {call.duration}</span>
                            </div>
                          </div>
                        </CardContent>
                        <CardFooter className="flex justify-end">
                          {call.recording ? (
                            <Button variant="outline" size="sm">
                              View Recording
                            </Button>
                          ) : (
                            <span className="text-sm text-gray-500">No recording available</span>
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