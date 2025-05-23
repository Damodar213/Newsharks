"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import {
  ArrowLeft,
  LogOut,
  MessageSquare,
  Plus,
  Settings,
  Share2,
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
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/components/ui/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

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
  business_plan?: string;
  financials?: {
    revenue: number;
    expenses: number;
    profit: number;
  };
  team?: {
    name: string;
    role: string;
  }[];
}

interface Investment {
  _id: string;
  projectId: string;
  amountInvested: number;
  equityPercentage: number;
  status: string;
  returnToDate: number;
  investedDate: string;
}

export default function InvestmentDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [userData, setUserData] = useState<any>(null)
  const [project, setProject] = useState<Project | null>(null)
  const [myInvestments, setMyInvestments] = useState<Investment[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [investDialogOpen, setInvestDialogOpen] = useState(false)
  const [investmentAmount, setInvestmentAmount] = useState<number>(0)
  const [equityPercentage, setEquityPercentage] = useState<number>(5)
  const [isInvesting, setIsInvesting] = useState(false)
  
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
          fetchProjectData();
        }
      } catch (error) {
        console.error("Error parsing user data:", error);
        router.push('/login');
      }
    } else {
      // Redirect to login if not logged in
      toast({
        title: "Login required",
        description: "Please log in to view investment details",
        variant: "destructive",
      });
      router.push('/login');
    }
  }, [router]);
  
  const fetchProjectData = async () => {
    setIsLoading(true);
    
    try {
      // In a real app, we'd fetch the project details from an API
      // For now, we'll use mock data
      
      const mockProject: Project = {
        _id: params.id as string,
        title: "HealthTrack - Wellness Monitoring App",
        description: "Mobile application for tracking health metrics and providing personalized wellness recommendations. The app uses AI to analyze user data and provide tailored health insights.",
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
        matchScore: 85,
        business_plan: "HealthTrack aims to revolutionize personal wellness by combining wearable data with AI to provide actionable health insights. The app will include features for tracking physical activity, nutrition, sleep patterns, and mental wellness. The monetization strategy includes a freemium model with premium subscription options.",
        financials: {
          revenue: 50000,
          expenses: 75000,
          profit: -25000
        },
        team: [
          { name: "Michael Chen", role: "Founder & CEO" },
          { name: "Sarah Wong", role: "CTO" },
          { name: "David Patel", role: "Lead Developer" }
        ]
      };
      
      setProject(mockProject);
      
      // Mock my investments in this project
      const mockInvestments: Investment[] = [
        {
          _id: "inv1",
          projectId: params.id as string,
          amountInvested: 75000,
          equityPercentage: 3,
          status: "active",
          returnToDate: 0,
          investedDate: new Date(2023, 8, 15).toISOString()
        }
      ];
      
      setMyInvestments(mockInvestments);
      
    } catch (error) {
      console.error('Error fetching project data:', error);
      toast({
        title: "Error",
        description: "Failed to fetch project details",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleLogout = () => {
    localStorage.removeItem('userData');
    router.push('/login');
  };
  
  const handleInvestClick = () => {
    // Default equity percentage is 5%
    setEquityPercentage(5);
    setInvestDialogOpen(true);
  };
  
  const handleInvestmentSubmit = async () => {
    if (!project) return;
    
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
        _id: `inv${Date.now()}`,
        projectId: project._id,
        amountInvested: investmentAmount,
        equityPercentage: equityPercentage,
        status: "active",
        returnToDate: 0,
        investedDate: new Date().toISOString()
      };
      
      // Add the new investment
      setMyInvestments(prev => [...prev, newInvestment]);
      
      // Update the project funding
      if (project) {
        const updatedProject = {
          ...project,
          currentFunding: (project.currentFunding || 0) + investmentAmount
        };
        setProject(updatedProject);
      }
      
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
        description: `You have successfully invested ₹${investmentAmount.toLocaleString()} in ${project.title}`,
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
    }
  };
  
  const handleShareProject = () => {
    // Generate shareable URL
    const shareUrl = `${window.location.origin}/dashboard/investor/investments/${project?._id}`;
    
    // Copy to clipboard
    navigator.clipboard.writeText(shareUrl).then(() => {
      toast({
        title: "Link copied!",
        description: "Project link has been copied to clipboard"
      });
    });
  };
  
  if (isLoading || !project) {
    return <div className="flex min-h-screen items-center justify-center">Loading...</div>
  }
  
  // Calculate total amount invested by this user
  const totalInvested = myInvestments.reduce((sum, inv) => sum + inv.amountInvested, 0);
  // Calculate total equity owned by this user
  const totalEquity = myInvestments.reduce((sum, inv) => sum + inv.equityPercentage, 0);
  
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b">
        <div className="container flex h-16 items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/dashboard/investor/investments">
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>
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
                    <AvatarFallback>{userData?.name?.charAt(0) || "U"}</AvatarFallback>
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
      
      <div className="container py-6 px-4 md:px-6">
        {/* Project Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold">{project.title}</h1>
              <Badge variant="outline">{project.category}</Badge>
              {project.matchScore && (
                <Badge variant="secondary">{project.matchScore}% Match</Badge>
              )}
            </div>
            <p className="text-muted-foreground mt-1">Created by {project.entrepreneur.name}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleShareProject}
              className="flex items-center gap-2"
            >
              <Share2 className="h-4 w-4" /> Share
            </Button>
            <Button 
              size="sm"
              className="flex items-center gap-2"
              onClick={handleInvestClick}
            >
              <Plus className="h-4 w-4" /> Invest More
            </Button>
          </div>
        </div>
        
        {/* Investment Summary */}
        <div className="grid gap-6 md:grid-cols-3 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Your Investment</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹{totalInvested.toLocaleString()}</div>
              <p className="text-xs text-gray-500">
                Across {myInvestments.length} transaction{myInvestments.length !== 1 ? 's' : ''}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Your Equity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalEquity}%</div>
              <p className="text-xs text-gray-500">Ownership stake</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Available Balance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹{(userData?.balance || 0).toLocaleString()}</div>
              <p className="text-xs text-gray-500">Ready to invest</p>
            </CardContent>
          </Card>
        </div>
        
        {/* Project Details and Investment History */}
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-6">
            <Tabs defaultValue="overview">
              <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="business-plan">Business Plan</TabsTrigger>
                <TabsTrigger value="team">Team</TabsTrigger>
                <TabsTrigger value="financials">Financials</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="space-y-4 mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Project Overview</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <p>{project.description}</p>
                      
                      <div>
                        <h3 className="font-medium mb-2">Funding Progress</h3>
                        <div className="flex justify-between text-sm mb-1">
                          <span>₹{(project.currentFunding || 0).toLocaleString()}</span>
                          <span>₹{(project.fundingGoal || 0).toLocaleString()}</span>
                        </div>
                        <Progress value={((project.currentFunding || 0) / (project.fundingGoal || 1)) * 100} />
                        <p className="text-sm mt-1 text-muted-foreground">
                          {(((project.currentFunding || 0) / (project.fundingGoal || 1)) * 100).toFixed(1)}% funded by {project.investors || 0} investor{project.investors !== 1 ? 's' : ''}
                        </p>
                      </div>
                      
                      <div className="border-t pt-4">
                        <div className="flex flex-wrap gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">Created:</span> {new Date(project.createdAt).toLocaleDateString()}
                          </div>
                          <div>
                            <span className="text-muted-foreground">Category:</span> {project.category}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Contact Entrepreneur</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarFallback>{project.entrepreneur.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{project.entrepreneur.name}</p>
                        <p className="text-sm text-muted-foreground">{project.entrepreneur.email}</p>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <div className="flex gap-2">
                      <Button variant="outline" className="w-full">
                        <MessageSquare className="h-4 w-4 mr-2" /> Message
                      </Button>
                      <Button className="w-full">
                        <Video className="h-4 w-4 mr-2" /> Video Call
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              </TabsContent>
              
              <TabsContent value="business-plan" className="space-y-4 mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Business Plan</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>{project.business_plan || "No business plan information available."}</p>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="team" className="space-y-4 mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Team Members</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {project.team?.length ? (
                      <div className="divide-y">
                        {project.team.map((member, index) => (
                          <div key={index} className="py-4 first:pt-0 last:pb-0 flex items-center gap-3">
                            <Avatar>
                              <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{member.name}</p>
                              <p className="text-sm text-muted-foreground">{member.role}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p>No team information available.</p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="financials" className="space-y-4 mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Financial Information</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {project.financials ? (
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="border rounded p-4">
                            <p className="text-sm text-muted-foreground">Revenue</p>
                            <p className="text-xl font-bold">₹{project.financials.revenue.toLocaleString()}</p>
                          </div>
                          <div className="border rounded p-4">
                            <p className="text-sm text-muted-foreground">Expenses</p>
                            <p className="text-xl font-bold">₹{project.financials.expenses.toLocaleString()}</p>
                          </div>
                          <div className="border rounded p-4">
                            <p className="text-sm text-muted-foreground">Profit</p>
                            <p className={`text-xl font-bold ${project.financials.profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                              ₹{project.financials.profit.toLocaleString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <p>No financial information available.</p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
          
          {/* Investment History */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Your Investment History</CardTitle>
                <CardDescription>History of your investments in this project</CardDescription>
              </CardHeader>
              <CardContent>
                {myInvestments.length === 0 ? (
                  <p className="text-muted-foreground">No investments yet</p>
                ) : (
                  <div className="space-y-4 divide-y">
                    {myInvestments.map((inv) => (
                      <div key={inv._id} className="pt-4 first:pt-0">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium">₹{inv.amountInvested.toLocaleString()}</p>
                            <p className="text-sm text-muted-foreground">{inv.equityPercentage}% equity</p>
                          </div>
                          <Badge variant={inv.status === "profitable" ? "default" : "outline"}>
                            {inv.status}
                          </Badge>
                        </div>
                        <p className="text-xs mt-1">Invested on {new Date(inv.investedDate).toLocaleDateString()}</p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <Button className="w-full" onClick={handleInvestClick}>
                  <Plus className="h-4 w-4 mr-2" /> Invest More
                </Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Project Documents</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between items-center p-2 border rounded-md">
                    <span>Business Plan.pdf</span>
                    <Button variant="ghost" size="sm">View</Button>
                  </div>
                  <div className="flex justify-between items-center p-2 border rounded-md">
                    <span>Financial Projections.xlsx</span>
                    <Button variant="ghost" size="sm">View</Button>
                  </div>
                  <div className="flex justify-between items-center p-2 border rounded-md">
                    <span>Pitch Deck.pdf</span>
                    <Button variant="ghost" size="sm">View</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      {/* Investment Dialog */}
      <Dialog open={investDialogOpen} onOpenChange={setInvestDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Invest in {project?.title}</DialogTitle>
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
              <p className="text-xs text-muted-foreground">Minimum investment: ₹1,000</p>
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
              <p className="text-xs text-muted-foreground">
                Proposed equity stake in the company
              </p>
            </div>
            
            <div className="text-sm text-muted-foreground border-t pt-2">
              <p>Project Goal: ₹{(project.fundingGoal || 0).toLocaleString()}</p>
              <p>Current Funding: ₹{(project.currentFunding || 0).toLocaleString()} ({((project.currentFunding || 0) / (project.fundingGoal || 1) * 100).toFixed(1)}%)</p>
              <p>Your existing investment: ₹{totalInvested.toLocaleString()} ({totalEquity}% equity)</p>
              <p className="font-medium mt-2">Your available balance: ₹{(userData?.balance || 0).toLocaleString()}</p>
            </div>
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