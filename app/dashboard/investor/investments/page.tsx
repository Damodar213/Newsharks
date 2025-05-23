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
  Plus,
  ArrowRight
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
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

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
    description?: string;
    category?: string;
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

export default function InvestorInvestmentsPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [userData, setUserData] = useState<any>(null)
  const [investments, setInvestments] = useState<Investment[]>([])
  const [featuredProjects, setFeaturedProjects] = useState<Project[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [isLoading, setIsLoading] = useState(true)
  const [investDialogOpen, setInvestDialogOpen] = useState(false)
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [investmentAmount, setInvestmentAmount] = useState<number>(0)
  const [equityPercentage, setEquityPercentage] = useState<number>(0)
  const [isInvesting, setIsInvesting] = useState(false)
  const router = useRouter()

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
        } else {
          fetchInvestments(parsedUserData);
          fetchProjects();
        }
      } catch (error) {
        console.error("Error parsing user data:", error);
        router.push('/login');
      }
    } else {
      // Redirect to login if not logged in
      toast({
        title: "Login required",
        description: "Please log in to view investments",
        variant: "destructive",
      });
      router.push('/login');
    }
  }, [router]);

  const fetchInvestments = async (user: any) => {
    try {
      setIsLoading(true);
      // In a real app, you'd make an API call here
      // For now, we'll use mock data similar to the dashboard
      
      const mockInvestments: Investment[] = [
        {
          _id: "inv1",
          project: {
            _id: "proj1",
            title: "SmartGarden - IoT Plant Care System",
            entrepreneur: {
              name: "John Doe",
              email: "john@example.com"
            }
          },
          amountInvested: 250000,
          equityPercentage: 5,
          status: "profitable",
          returnToDate: 12500,
          investedDate: new Date(2023, 3, 15).toISOString()
        },
        {
          _id: "inv2",
          project: {
            _id: "proj2",
            title: "EcoPackage - Sustainable Packaging Solution",
            entrepreneur: {
              name: "Emma Rodriguez",
              email: "emma@example.com"
            }
          },
          amountInvested: 150000,
          equityPercentage: 3,
          status: "active",
          returnToDate: 5000,
          investedDate: new Date(2023, 6, 22).toISOString()
        },
      ];
      
      setInvestments(mockInvestments);
    } catch (error) {
      console.error('Error fetching investments:', error);
      toast({
        title: "Error",
        description: "Failed to fetch investments",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchProjects = async () => {
    try {
      // In a real app, you'd make an API call here
      // For now, we'll use mock data
      const mockProjects: Project[] = [
        {
          _id: "proj3",
          title: "HealthTrack - Wellness Monitoring App",
          description: "Mobile application for tracking health metrics and providing personalized wellness recommendations.",
          category: "Health",
          fundingGoal: 300000,
          currentFunding: 125000,
          investors: 2,
          entrepreneur: {
            name: "Michael Chen",
            email: "michael@example.com"
          },
          approved: true,
          createdAt: new Date(2023, 7, 10).toISOString(),
          matchScore: 85
        },
        {
          _id: "proj4",
          title: "EduTech - Online Learning Platform",
          description: "Accessible education platform focusing on skill development for underserved communities.",
          category: "Education",
          fundingGoal: 250000,
          currentFunding: 75000,
          investors: 1,
          entrepreneur: {
            name: "Sarah Johnson",
            email: "sarah@example.com"
          },
          approved: true,
          createdAt: new Date(2023, 8, 5).toISOString(),
          matchScore: 78
        },
        {
          _id: "proj5",
          title: "AgroTech - Smart Farming Solutions",
          description: "IoT-based system for optimizing irrigation, fertilization, and pest control in agriculture.",
          category: "Agriculture",
          fundingGoal: 350000,
          currentFunding: 100000,
          investors: 2,
          entrepreneur: {
            name: "Raj Patel",
            email: "raj@example.com"
          },
          approved: true,
          createdAt: new Date(2023, 8, 15).toISOString(),
          matchScore: 92
        }
      ];
      
      setFeaturedProjects(mockProjects);
    } catch (error) {
      console.error('Error fetching projects:', error);
      toast({
        title: "Error",
        description: "Failed to fetch investment opportunities",
        variant: "destructive"
      });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('userData');
    router.push('/login');
  };

  const handleInvestClick = (project: Project) => {
    setSelectedProject(project);
    // Calculate a suggested equity percentage based on the proposed investment
    // This is a simplified calculation for demonstration
    const suggestedEquity = 5; // 5% equity as default suggestion
    setEquityPercentage(suggestedEquity);
    setInvestDialogOpen(true);
  };

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
      
      // In a real app, you'd make an API call to process the investment
      // For now, we'll simulate a successful investment
      
      // Create a new investment object
      const newInvestment: Investment = {
        _id: `inv${Date.now()}`, // Generate a temporary ID
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
      };
      
      // Add the new investment to the list
      setInvestments(prev => [...prev, newInvestment]);
      
      // Update the selected project's funding
      const updatedProjects = featuredProjects.map(p => {
        if (p._id === selectedProject._id) {
          return {
            ...p,
            currentFunding: (p.currentFunding || 0) + investmentAmount,
            investors: (p.investors || 0) + 1
          };
        }
        return p;
      });
      
      setFeaturedProjects(updatedProjects);
      
      // Update user's balance (in a real app, this would be done on the server)
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
        description: "There was an error processing your investment. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsInvesting(false);
      setSelectedProject(null);
    }
  };

  const filteredProjects = featuredProjects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || project.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

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
                className="flex items-center gap-2 rounded-lg bg-primary/10 px-3 py-2 text-primary"
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
                className="flex items-center gap-2 rounded-lg px-3 py-2 hover:bg-muted"
              >
                <Video className="h-5 w-5" />
                <span>Video Calls</span>
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
              <h1 className="text-2xl font-bold">My Investments</h1>
              <p className="text-gray-500">Track your investments and discover new opportunities</p>
            </div>
            
            {/* Investment Overview */}
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
                    ₹{(userData.balance || 1000000).toLocaleString()}
                  </div>
                  <p className="text-xs text-gray-500">Ready to invest</p>
                </CardContent>
              </Card>
            </div>
            
            {/* Investment Tabs */}
            <div className="mt-6">
              <Tabs defaultValue="current">
                <TabsList>
                  <TabsTrigger value="current">Current Investments</TabsTrigger>
                  <TabsTrigger value="opportunities">Investment Opportunities</TabsTrigger>
                </TabsList>
                
                {/* Current Investments Tab */}
                <TabsContent value="current" className="mt-4 space-y-4">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <h2 className="text-xl font-semibold">Current Investments</h2>
                  </div>
                  
                  {investments.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-gray-500">You haven't made any investments yet</p>
                      <Button 
                        className="mt-4"
                        onClick={() => {
                          // Use the setAttribute approach instead of click
                          const opportunitiesTab = document.querySelector('[data-value="opportunities"]');
                          if (opportunitiesTab instanceof HTMLElement) {
                            opportunitiesTab.click();
                          }
                        }}
                      >
                        Find Investment Opportunities
                      </Button>
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
                                <AvatarFallback>{investment.project.entrepreneur.name.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <span>Entrepreneur: {investment.project.entrepreneur.name}</span>
                            </div>
                          </CardContent>
                          <CardFooter className="flex justify-end gap-2">
                            <Button variant="outline" size="sm">
                              Contact Entrepreneur
                            </Button>
                            <Button size="sm">
                              View Details
                            </Button>
                          </CardFooter>
                        </Card>
                      ))}
                    </div>
                  )}
                </TabsContent>
                
                {/* Investment Opportunities Tab */}
                <TabsContent value="opportunities" className="mt-4 space-y-4">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <h2 className="text-xl font-semibold">Investment Opportunities</h2>
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
                  
                  {filteredProjects.length === 0 ? (
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
                                  <AvatarFallback>{project.entrepreneur.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <span>{project.entrepreneur.name}</span>
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
                            <Button variant="outline" size="sm">
                              View Details
                            </Button>
                            <Button size="sm" onClick={() => handleInvestClick(project)}>
                              <Plus className="mr-1 h-4 w-4" /> Invest
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
      
      {/* Investment Dialog */}
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
                <p className="font-medium mt-2">Your available balance: ₹{(userData.balance || 0).toLocaleString()}</p>
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
              disabled={isInvesting || investmentAmount <= 0 || investmentAmount > (userData.balance || 0)}
            >
              {isInvesting ? "Processing..." : "Invest Now"} <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 