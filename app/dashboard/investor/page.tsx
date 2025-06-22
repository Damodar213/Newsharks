"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
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
import { toast } from "@/components/ui/use-toast"
import { ContactDialog } from "@/components/ContactDialog"
import { ProjectDetailsDialog } from "@/components/ProjectDetailsDialog"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"

interface Project {
  _id: string;
  title: string;
  description: string;
  category: string;
  fundingGoal: number;
  currentFunding: number;
  investors: number;
  entrepreneur: {
    name: string;
    email: string;
  };
  approved: boolean;
  createdAt: string;
  matchScore?: number;
}

interface Investment {
  _id: string;
  project: {
    _id: string;
    title: string;
    entrepreneur: {
      name: string;
      email: string;
    };
  };
  amountInvested: number;
  equityPercentage: number;
  status: string;
  returnToDate: number;
  investedDate: string;
}

export default function InvestorDashboard() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [projects, setProjects] = useState<Project[]>([])
  const [investments, setInvestments] = useState<Investment[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [userData, setUserData] = useState<any>(null)
  const [contactDialogOpen, setContactDialogOpen] = useState(false)
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false)
  const [detailsProject, setDetailsProject] = useState<Project | null>(null)
  const [investDialogOpen, setInvestDialogOpen] = useState(false)
  const [investmentAmount, setInvestmentAmount] = useState<number>(0)
  const [equityPercentage, setEquityPercentage] = useState<number>(5)
  const [isInvesting, setIsInvesting] = useState(false)
  const router = useRouter()

  // Load user data from localStorage
  useEffect(() => {
    const storedUserData = localStorage.getItem('userData');
    if (storedUserData) {
      try {
        const parsedUserData = JSON.parse(storedUserData);
        
        // Add default balance of 10000 if not set
        if (parsedUserData.balance === undefined) {
          parsedUserData.balance = 10000;
          localStorage.setItem('userData', JSON.stringify(parsedUserData));
        }
        
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
        description: "Please log in to access the investor dashboard",
        variant: "destructive",
      });
      router.push('/login');
    }
  }, [router]);

  // Fetch projects and investments when component mounts
  useEffect(() => {
    if (userData) {
      fetchProjects();
      fetchInvestments();
    }
  }, [userData]);

  const fetchProjects = async () => {
    try {
      const response = await fetch('/api/projects?approved=true');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new TypeError("Received non-JSON response from server");
      }
      
      const data = await response.json();
      
      if (data.success) {
        // Calculate match scores based on investor preferences
        const projectsWithScores = data.projects.map((project: Project) => ({
          ...project,
          matchScore: calculateMatchScore(project)
        }));
        
        // Sort projects by match score
        const sortedProjects = projectsWithScores.sort((a: Project, b: Project) => 
          (b.matchScore || 0) - (a.matchScore || 0)
        );
        
        setProjects(sortedProjects);
      } else {
        throw new Error(data.error || 'Failed to fetch projects');
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

  const fetchInvestments = async () => {
    try {
      // Make sure we're using the correct _id field from userData
      const userId = userData?._id;
      console.log("Fetching investments for user ID:", userId);
      
      const response = await fetch(`/api/investments?investor=${userId}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new TypeError("Received non-JSON response from server");
      }
      
      const data = await response.json();
      
      if (data.success) {
        setInvestments(data.investments);
      } else {
        throw new Error(data.error || 'Failed to fetch investments');
      }
    } catch (error) {
      console.error('Error fetching investments:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to fetch investments",
        variant: "destructive",
      });
    }
  };

  const calculateMatchScore = (project: Project): number => {
    // This is a simple matching algorithm. You can make it more sophisticated
    // by considering investor preferences, past investments, etc.
    let score = 0;
    
    // Base score for approved projects
    if (project.approved) {
      score += 50;
    }
    
    // Category matching (if investor has preferences)
    if (userData?.preferences?.categories?.includes(project.category)) {
      score += 20;
    }
    
    // Funding goal matching (if investor has preferred investment range)
    if (userData?.preferences?.investmentRange) {
      const [min, max] = userData.preferences.investmentRange;
      if (project.fundingGoal >= min && project.fundingGoal <= max) {
        score += 15;
      }
    }
    
    // Recent projects get a small boost
    const projectAge = new Date().getTime() - new Date(project.createdAt).getTime();
    const daysOld = projectAge / (1000 * 60 * 60 * 24);
    if (daysOld < 7) {
      score += 10;
    }
    
    // Normalize score to 0-100
    return Math.min(100, score);
  };

  const handleLogout = () => {
    localStorage.removeItem('userData');
    router.push('/login');
  };

  const handleContactClick = (project: Project) => {
    setSelectedProject(project)
    setContactDialogOpen(true)
  }

  const handleViewDetailsClick = (project: Project) => {
    setDetailsProject(project)
    setDetailsDialogOpen(true)
  }

  const handleInvestClick = (project: Project) => {
    setSelectedProject(project)
    setEquityPercentage(5) // Default equity percentage
    setInvestDialogOpen(true)
  }

  const handleInvestmentSubmit = async () => {
    if (!selectedProject) return;
    
    try {
      setIsInvesting(true);
      
      // Validation
      if (investmentAmount <= 0) {
        toast({
          title: "Invalid amount",
          description: "Please enter a valid investment amount",
          variant: "destructive"
        });
        return;
      }
      
      // Create a new investment object
      const newInvestment = {
        project: selectedProject._id,
        investor: userData._id,
        amountInvested: investmentAmount,
        equityPercentage: equityPercentage,
        status: "active",
        returnToDate: 0,
        investedDate: new Date().toISOString()
      };
      
      // Save the investment to the database
      console.log("Sending investment data to API:", newInvestment);
      const response = await fetch('/api/investments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newInvestment),
      });
      
      if (!response.ok) {
        throw new Error(`API returned status ${response.status}`);
      }
      
      const data = await response.json();
      console.log("Investment API response:", data);
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to save investment');
      }
      
      // Update project funding in the database
      const updateProjectResponse = await fetch(`/api/projects/${selectedProject._id}/fund`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: investmentAmount,
          investorId: userData._id,
        }),
      });
      
      if (!updateProjectResponse.ok) {
        throw new Error(`Project update API returned status ${updateProjectResponse.status}`);
      }
      
      const updateProjectData = await updateProjectResponse.json();
      console.log("Project funding update response:", updateProjectData);
      
      if (!updateProjectData.success) {
        throw new Error(updateProjectData.error || 'Failed to update project funding');
      }
      
      // Add the new investment to the local state
      setInvestments(prev => [...prev, {
        _id: data.investment._id || `inv${Date.now()}`,
        project: {
          _id: selectedProject._id,
          title: selectedProject.title,
          entrepreneur: selectedProject.entrepreneur
        },
        amountInvested: investmentAmount,
        equityPercentage: equityPercentage,
        status: "active",
        returnToDate: 0,
        investedDate: new Date().toISOString()
      }]);
      
      // Update the selected project's funding in local state
      const updatedProjects = projects.map(p => {
        if (p._id === selectedProject._id) {
          return {
            ...p,
            currentFunding: (p.currentFunding || 0) + investmentAmount,
            investors: (p.investors || 0) + 1
          };
        }
        return p;
      });
      
      setProjects(updatedProjects);
      
      // Update user's balance
      if (userData) {
        const updatedUserData = {
          ...userData,
          balance: (userData.balance || 0) - investmentAmount
        };
        setUserData(updatedUserData);
        localStorage.setItem('userData', JSON.stringify(updatedUserData));
      }
      
      // Show success message
      toast({
        title: "Investment successful!",
        description: `You have successfully invested ₹${investmentAmount.toLocaleString()} in ${selectedProject.title}`,
      });
      
      // Reset form
      setInvestmentAmount(0);
      setEquityPercentage(5);
      
      // Close dialog
      setInvestDialogOpen(false);
    } catch (error) {
      console.error('Error processing investment:', error);
      toast({
        title: "Investment failed",
        description: error instanceof Error ? error.message : "There was an error processing your investment. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsInvesting(false);
      setSelectedProject(null);
    }
  };

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || project.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

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
                  {/* <Link
                    href="/dashboard/investor/video-calls"
                    className="flex items-center gap-2 text-lg font-semibold"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Video className="h-5 w-5" />
                    <span>Video Calls</span>
                  </Link> */}
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
                <DropdownMenuItem onClick={() => router.push('/dashboard/investor/settings?tab=profile')}>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push('/dashboard/investor/settings')}>
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
              </Link>
              {/* <Link
                href="/dashboard/investor/video-calls"
                className="flex items-center gap-2 rounded-lg px-3 py-2 hover:bg-muted"
              >
                <Video className="h-5 w-5" />
                <span>Video Calls</span>
              </Link> */}
              <Link
                href="/dashboard/investor/settings"
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
                  <div className="text-2xl font-bold">
                    ₹{investments.reduce((sum, inv) => sum + (inv.amountInvested || 0), 0).toLocaleString()}
                  </div>
                  <p className="text-xs text-gray-500">Across {investments.length} projects</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Current Returns</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    ₹{investments.reduce((sum, inv) => sum + (inv.returnToDate || 0), 0).toLocaleString()}
                  </div>
                  <p className="text-xs text-gray-500">
                    {investments.length > 0 
                      ? `${((investments.reduce((sum, inv) => sum + (inv.returnToDate || 0), 0) / 
                          Math.max(investments.reduce((sum, inv) => sum + (inv.amountInvested || 0), 0), 1)) * 100).toFixed(1)}% average ROI`
                      : 'No investments yet'}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Available Balance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    ₹{(userData.balance || 0).toLocaleString()}
                  </div>
                  <p className="text-xs text-gray-500">Ready to invest</p>
                </CardContent>
              </Card>
            </div>
            <div className="mt-6">
              <Tabs defaultValue="discover">
                <TabsList>
                  <TabsTrigger value="discover">Discover Projects</TabsTrigger>
                  <TabsTrigger value="investments">My Investments</TabsTrigger>
                  {/* <TabsTrigger value="calls">Video Calls</TabsTrigger> */}
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
                        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                          <SelectTrigger className="w-full md:w-40">
                            <SelectValue placeholder="Category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Categories</SelectItem>
                            <SelectItem value="Technology">Technology</SelectItem>
                            <SelectItem value="Health">Health</SelectItem>
                            <SelectItem value="Sustainability">Sustainability</SelectItem>
                            <SelectItem value="Education">Education</SelectItem>
                            <SelectItem value="Agriculture">Agriculture</SelectItem>
                          </SelectContent>
                        </Select>
                        <Button variant="outline" size="icon">
                          <Filter className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                  {isLoading ? (
                    <div className="text-center py-8">Loading projects...</div>
                  ) : filteredProjects.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-gray-500">No projects found matching your criteria</p>
                    </div>
                  ) : (
                  <div className="grid gap-4">
                      {filteredProjects.map((project) => (
                        <Card key={project._id}>
                        <CardHeader>
                          <div className="flex flex-col md:flex-row justify-between md:items-start gap-2">
                            <div>
                              <div className="flex items-center gap-2">
                                <CardTitle>{project.title}</CardTitle>
                                  {project.matchScore && (
                                <Badge variant="secondary" className="ml-2">
                                  {project.matchScore}% Match
                                </Badge>
                                  )}
                              </div>
                              <CardDescription>{project.description}</CardDescription>
                            </div>
                            <div className="flex items-center gap-1 text-sm">
                              <Avatar className="h-6 w-6">
                                  <AvatarFallback>{project.entrepreneur?.name?.charAt(0) || 'U'}</AvatarFallback>
                              </Avatar>
                                <span>{project.entrepreneur?.name || 'Unknown'}</span>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            <div>
                              <div className="flex justify-between text-sm mb-1">
                                <span>Funding Progress</span>
                                <span>
                                    ₹{(project.currentFunding || 0).toLocaleString()} of ₹{(project.fundingGoal || 0).toLocaleString()}
                                </span>
                              </div>
                                <Progress value={((project.currentFunding || 0) / (project.fundingGoal || 1)) * 100} />
                            </div>
                            <div className="flex flex-wrap justify-between text-sm gap-y-2">
                              <div>
                                  <span className="text-gray-500">Category:</span> {project.category || 'Uncategorized'}
                              </div>
                              <div>
                                  <span className="text-gray-500">Investors:</span> {project.investors || 0}
                              </div>
                              <div>
                                  <span className="text-gray-500">Created:</span> {project.createdAt ? new Date(project.createdAt).toLocaleDateString() : 'N/A'}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                        <CardFooter className="flex justify-end gap-2">
                            <Button variant="outline" size="sm" onClick={() => handleContactClick(project)}>
                              Contact
                            </Button>
                            <Button size="sm" onClick={() => handleInvestClick(project)}>
                              Invest
                            </Button>
                            <Button size="sm" onClick={() => handleViewDetailsClick(project)}>
                              View Details
                            </Button>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                  )}
                </TabsContent>
                <TabsContent value="investments" className="mt-4 space-y-4">
                  <h2 className="text-xl font-semibold">My Investments</h2>
                  {investments.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-gray-500">You haven't made any investments yet</p>
                    </div>
                  ) : (
                  <div className="grid gap-4">
                      {investments.map((investment) => (
                        <Card key={investment._id}>
                        <CardHeader>
                          <div className="flex flex-col md:flex-row justify-between md:items-start gap-2">
                            <div>
                                <CardTitle>{investment.project.title}</CardTitle>
                                <CardDescription>Invested on {new Date(investment.investedDate).toLocaleDateString()}</CardDescription>
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
                                <p className="text-lg font-semibold">₹{(investment.amountInvested || 0).toLocaleString()}</p>
                            </div>
                            <div className="space-y-1">
                              <p className="text-sm text-gray-500">Equity Percentage</p>
                                <p className="text-lg font-semibold">{investment.equityPercentage || 0}%</p>
                            </div>
                            <div className="space-y-1">
                              <p className="text-sm text-gray-500">Return to Date</p>
                                <p className="text-lg font-semibold">₹{(investment.returnToDate || 0).toLocaleString()}</p>
                            </div>
                          </div>
                          <div className="mt-4 flex items-center text-sm">
                            <Avatar className="h-6 w-6 mr-2">
                                <AvatarFallback>{investment.project?.entrepreneur?.name?.charAt(0) || 'U'}</AvatarFallback>
                            </Avatar>
                              <span>Entrepreneur: {investment.project?.entrepreneur?.name || 'Unknown'}</span>
                          </div>
                        </CardContent>
                        <CardFooter className="flex justify-end gap-2">
                            <Button variant="outline" size="sm" onClick={() => handleContactClick({
                              _id: investment.project._id,
                              title: investment.project.title,
                              entrepreneur: investment.project.entrepreneur,
                              description: "",
                              category: "",
                              fundingGoal: 0,
                              currentFunding: 0,
                              investors: 0,
                              approved: false,
                              createdAt: "",
                            })}>
                              Contact Entrepreneur
                            </Button>
                            <Button size="sm" onClick={() => handleViewDetailsClick({
                              _id: investment.project._id,
                              title: investment.project.title,
                              entrepreneur: investment.project.entrepreneur,
                              description: "",
                              category: "",
                              fundingGoal: 0,
                              currentFunding: 0,
                              investors: 0,
                              approved: false,
                              createdAt: "",
                            })}>
                              View Details
                            </Button>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                  )}
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </main>
      </div>
      {selectedProject && (
        <ContactDialog
          isOpen={contactDialogOpen}
          onClose={() => {
            setContactDialogOpen(false)
            setSelectedProject(null)
          }}
          entrepreneurName={selectedProject.entrepreneur?.name || 'Unknown'}
          projectId={selectedProject._id}
          projectTitle={selectedProject.title}
        />
      )}
      {detailsProject && (
        <ProjectDetailsDialog
          isOpen={detailsDialogOpen}
          onClose={() => {
            setDetailsDialogOpen(false)
            setDetailsProject(null)
          }}
          project={detailsProject}
        />
      )}
      <Dialog open={investDialogOpen} onOpenChange={setInvestDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Invest in {selectedProject?.title}</DialogTitle>
            <DialogDescription>
              Enter the amount you want to invest and the equity percentage you expect in return.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="investment-amount">Investment Amount (₹)</Label>
              <Input
                id="investment-amount"
                type="number"
                min={1000}
                step={1000}
                placeholder="Enter amount"
                value={investmentAmount || ''}
                onChange={(e) => setInvestmentAmount(Number(e.target.value))}
              />
              <p className="text-xs text-gray-500">Minimum investment: ₹1,000</p>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="equity-percentage">Equity Percentage (%)</Label>
              <Input
                id="equity-percentage"
                type="number"
                min={0.1}
                max={100}
                step={0.1}
                placeholder="Enter percentage"
                value={equityPercentage || ''}
                onChange={(e) => setEquityPercentage(Number(e.target.value))}
              />
              <p className="text-xs text-gray-500">
                Proposed equity stake in the company
              </p>
            </div>
            
            {selectedProject && (
              <div className="text-sm text-gray-500 border-t pt-2">
                <p>Project Goal: ₹{(selectedProject.fundingGoal || 0).toLocaleString()}</p>
                <p>Current Funding: ₹{(selectedProject.currentFunding || 0).toLocaleString()} ({((selectedProject.currentFunding || 0) / (selectedProject.fundingGoal || 1) * 100).toFixed(1)}%)</p>
                <p className="font-medium mt-2">Your available balance: ₹{(userData?.balance || 0).toLocaleString()}</p>
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setInvestDialogOpen(false)}
              disabled={isInvesting}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleInvestmentSubmit}
              disabled={isInvesting || investmentAmount <= 0 || investmentAmount > (userData?.balance || 0)}
            >
              {isInvesting ? "Processing..." : "Invest Now"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
