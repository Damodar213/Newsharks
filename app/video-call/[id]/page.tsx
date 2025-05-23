"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import {
  ArrowLeft,
  Camera,
  CameraOff,
  Maximize,
  Mic,
  MicOff,
  MonitorSmartphone,
  Phone,
  TrendingUp,
  Users,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { toast } from "@/components/ui/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { WebRTCService, ChatMessage } from "@/lib/webrtc"
import { useCallback } from "react"

// Mock call data
const mockCallData = {
  id: "123456",
  title: "SmartGarden - IoT Plant Care System",
  entrepreneur: {
    name: "John Doe",
    avatar: "JD",
    role: "Entrepreneur",
  },
  investor: {
    name: "Alex Smith",
    avatar: "AS",
    role: "Investor",
  },
  scheduledTime: "November 18, 2023 - 2:30 PM",
  duration: "45 minutes",
  projectDescription:
    "SmartGarden is an IoT-based plant care system that uses sensors and AI to automate watering, lighting, and nutrient delivery for indoor plants.",
  fundingGoal: 25000,
  equityOffering: "10%",
}

export default function VideoCallPage() {
  const router = useRouter()
  const params = useParams()
  const callId = params.id as string

  const [isMuted, setIsMuted] = useState(false)
  const [isVideoOn, setIsVideoOn] = useState(true)
  const [isFullScreen, setIsFullScreen] = useState(false)
  const [isCallActive, setIsCallActive] = useState(false)
  const [isScreenSharing, setIsScreenSharing] = useState(false)
  const [participantCount, setParticipantCount] = useState(1) // Start with just self
  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [connectionEstablished, setConnectionEstablished] = useState(false)
  const [isAudioEnabled, setIsAudioEnabled] = useState(true)
  const [isVideoEnabled, setIsVideoEnabled] = useState(true)
  const [userName, setUserName] = useState("")
  const [userRole, setUserRole] = useState<"entrepreneur" | "investor">("entrepreneur")

  const localVideoRef = useRef<HTMLVideoElement>(null)
  const remoteVideoRef = useRef<HTMLVideoElement>(null)
  const fullScreenRef = useRef<HTMLDivElement>(null)
  const chatContainerRef = useRef<HTMLDivElement>(null)
  const webRTCRef = useRef<WebRTCService | null>(null)

  // Initialize WebRTC when component mounts
  useEffect(() => {
    const initializeWebRTC = async () => {
      try {
        if (!localVideoRef.current) return;
        
        // Get user info from localStorage first
        const storedUserName = localStorage.getItem("userName") || "User"
        const storedUserRole = localStorage.getItem("userRole") as "entrepreneur" | "investor" || "entrepreneur"
        setUserName(storedUserName)
        setUserRole(storedUserRole)
        
        // Create WebRTC service instance with the user name
        webRTCRef.current = new WebRTCService(storedUserName);
        
        // Set up callbacks
        webRTCRef.current.setOnPeerConnected((peerId, stream) => {
          console.log('Peer connected with video:', peerId);
          
          // Connect remote video if available
          if (remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = stream;
          }
          
          // Update participant count
          setParticipantCount(prev => prev + 1);
          
          // Show connected toast
          toast({
            title: "Participant Joined",
            description: `A new participant has joined the call.`,
          });
          
          // Set call to active
          setIsCallActive(true);
        });
        
        webRTCRef.current.setOnPeerDisconnected((peerId) => {
          console.log('Peer disconnected:', peerId);
          
          // Update participant count
          setParticipantCount(prev => Math.max(1, prev - 1));
          
          // Show disconnected toast
          toast({
            title: "Participant Left",
            description: `A participant has left the call.`,
          });
        });
        
        webRTCRef.current.setOnChatMessageReceived((message) => {
          console.log("Chat message received", message)
          setMessages(prev => [...prev, message])
        });
        
        // Initialize connection using room ID from URL
        await webRTCRef.current.initialize(callId, localVideoRef.current);
        
        // If no one joins within 10 seconds, show "waiting" notification
        setTimeout(() => {
          if (participantCount === 1) {
            toast({
              title: "Waiting for others",
              description: "Share the URL with others to join this call.",
            });
          }
        }, 10000);

        setConnectionEstablished(true)
      } catch (err) {
        console.error("Error initializing WebRTC:", err);
        toast({
          title: "Camera Access Error",
          description: "Could not access your camera or microphone. Please check permissions.",
          variant: "destructive",
        });
      }
    };

    initializeWebRTC();

    // Clean up when component unmounts
    return () => {
      if (webRTCRef.current) {
        webRTCRef.current.leaveRoom();
      }
    };
  }, [callId]);

  // Scroll to bottom of chat when messages change
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
    }
  }, [messages])

  const toggleMute = useCallback(() => {
    if (webRTCRef.current) {
      webRTCRef.current.toggleAudio(!isMuted);
      setIsMuted(!isMuted);
    }
  }, [isMuted]);

  const toggleVideo = useCallback(() => {
    if (webRTCRef.current) {
      webRTCRef.current.toggleVideo(!isVideoOn);
      setIsVideoOn(!isVideoOn);
    }
  }, [isVideoOn]);

  const toggleFullScreen = () => {
    if (!document.fullscreenElement && fullScreenRef.current) {
      fullScreenRef.current.requestFullscreen().catch((err) => {
        console.error(`Error attempting to enable full-screen mode: ${err.message}`)
      })
      setIsFullScreen(true)
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen()
        setIsFullScreen(false)
      }
    }
  }

  const toggleScreenSharing = useCallback(async () => {
    if (webRTCRef.current) {
      try {
        await webRTCRef.current.shareScreen(!isScreenSharing);
        setIsScreenSharing(!isScreenSharing);
        
        if (!isScreenSharing) {
          toast({
            title: "Screen Sharing Started",
            description: "You are now sharing your screen",
          });
        } else {
          toast({
            title: "Screen Sharing Stopped",
            description: "You have stopped sharing your screen",
          });
        }
      } catch (error) {
        console.error('Error toggling screen share:', error);
        toast({
          title: "Screen Sharing Error",
          description: error instanceof Error ? error.message : "Could not toggle screen sharing.",
          variant: "destructive",
        });
      }
    }
  }, [isScreenSharing]);

  const endCall = useCallback(() => {
    // Disconnect WebRTC
    if (webRTCRef.current) {
      webRTCRef.current.leaveRoom();
    }

    toast({
      title: "Call Ended",
      description: "The video call has ended",
    });

    // Redirect back to dashboard
    router.push("/dashboard/entrepreneur");
  }, [router]);

  const sendMessage = () => {
    if (message.trim() && webRTCRef.current) {
      webRTCRef.current.sendChatMessage(message)
      setMessage("")
    }
  }

  // Handle enter key in chat input
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <div className="flex min-h-screen flex-col" ref={fullScreenRef}>
      <header className="border-b bg-white dark:bg-gray-950">
        <div className="container flex h-16 items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/dashboard/entrepreneur">
                <ArrowLeft className="h-5 w-5" />
                <span className="sr-only">Back to Dashboard</span>
              </Link>
            </Button>
            <Link href="/" className="flex items-center gap-2">
              <TrendingUp className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold">NEW SHARKS</span>
            </Link>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-sm font-medium">Call ID: {callId}</div>
            <Button variant="outline" size="sm" className="gap-1" onClick={toggleFullScreen}>
              <Maximize className="h-4 w-4" />
              <span className="hidden sm:inline">{isFullScreen ? "Exit Fullscreen" : "Fullscreen"}</span>
            </Button>
          </div>
        </div>
      </header>
      <main className="flex-1 overflow-hidden">
        <div className="grid h-full md:grid-cols-[1fr_300px]">
          {/* Video Call Area */}
          <div className="relative flex flex-col bg-gray-900 p-4">
            <div className="relative flex-1 rounded-lg bg-black">
              {/* Remote Video (Main) */}
              <video
                ref={remoteVideoRef}
                className="h-full w-full rounded-lg object-cover"
                autoPlay
                playsInline
              ></video>

              {/* Call Status Overlay */}
              {!isCallActive && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-white">
                    <div className="mb-4 flex justify-center">
                      <div className="relative">
                        <div className="absolute -inset-1 animate-ping rounded-full bg-primary/50"></div>
                        <div className="relative rounded-full bg-primary p-4">
                          <Phone className="h-6 w-6" />
                        </div>
                      </div>
                    </div>
                    <h2 className="text-xl font-semibold">Connecting...</h2>
                    <p className="text-gray-300">Waiting for others to join</p>
                  </div>
                </div>
              )}

              {/* Local Video (Small) */}
              <div className="absolute bottom-4 right-4 h-36 w-64 overflow-hidden rounded-lg border-2 border-gray-800 bg-black shadow-lg md:h-48 md:w-80">
                <video ref={localVideoRef} className="h-full w-full object-cover" autoPlay playsInline muted></video>
                {!isVideoOn && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-800 bg-opacity-80">
                    <div className="text-center text-white">
                      <CameraOff className="mx-auto h-8 w-8" />
                      <p className="mt-2 text-sm">Camera Off</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Call Controls */}
              <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 transform items-center gap-2 rounded-full bg-gray-800 bg-opacity-80 p-2">
                <Button
                  variant={isMuted ? "destructive" : "secondary"}
                  size="icon"
                  className="rounded-full"
                  onClick={toggleMute}
                >
                  {isMuted ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
                </Button>
                <Button
                  variant={isVideoOn ? "secondary" : "destructive"}
                  size="icon"
                  className="rounded-full"
                  onClick={toggleVideo}
                >
                  {isVideoOn ? <Camera className="h-5 w-5" /> : <CameraOff className="h-5 w-5" />}
                </Button>
                <Button
                  variant={isScreenSharing ? "destructive" : "secondary"}
                  size="icon"
                  className="rounded-full"
                  onClick={toggleScreenSharing}
                >
                  <MonitorSmartphone className="h-5 w-5" />
                </Button>
                <Button variant="destructive" size="icon" className="rounded-full" onClick={endCall}>
                  <Phone className="h-5 w-5 rotate-135 transform" />
                </Button>
              </div>

              {/* Participants */}
              <div className="absolute left-4 top-4 flex items-center gap-2 rounded-full bg-gray-800 bg-opacity-80 px-3 py-1.5 text-white">
                <Users className="h-4 w-4" />
                <span className="text-sm">{participantCount} Participants</span>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="flex h-[calc(100vh-4rem)] flex-col border-l bg-white dark:bg-gray-950">
            <Tabs defaultValue="info" className="h-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="info">Call Info</TabsTrigger>
                <TabsTrigger value="chat">Chat</TabsTrigger>
              </TabsList>
              <TabsContent value="info" className="flex-1 overflow-auto p-4">
                <div className="space-y-4">
                  <div>
                    <h2 className="text-xl font-bold">{mockCallData.title}</h2>
                    <p className="text-sm text-gray-500">{mockCallData.scheduledTime}</p>
                  </div>

                  <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarFallback>{mockCallData.entrepreneur.avatar}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{mockCallData.entrepreneur.name}</p>
                        <p className="text-sm text-gray-500">{mockCallData.entrepreneur.role}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarFallback>{mockCallData.investor.avatar}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{mockCallData.investor.name}</p>
                        <p className="text-sm text-gray-500">{mockCallData.investor.role}</p>
                      </div>
                    </div>
                  </div>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Project Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm">
                      <div>
                        <p className="font-medium">Description</p>
                        <p className="text-gray-500">{mockCallData.projectDescription}</p>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <p className="font-medium">Funding Goal</p>
                          <p className="text-gray-500">₹{mockCallData.fundingGoal.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="font-medium">Equity Offering</p>
                          <p className="text-gray-500">{mockCallData.equityOffering}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Call Notes</CardTitle>
                      <CardDescription>Take notes during your call</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Textarea placeholder="Type your notes here..." className="min-h-[100px]" />
                    </CardContent>
                    <CardFooter>
                      <Button size="sm" className="w-full">
                        Save Notes
                      </Button>
                    </CardFooter>
                  </Card>
                </div>
              </TabsContent>
              <TabsContent value="chat" className="flex h-full flex-col">
                <div className="flex-1 overflow-y-auto p-4">
                  <div className="space-y-4">
                    {messages.map((msg, index) => (
                      <div key={index} className={`flex ${msg.isUser ? "justify-end" : "justify-start"}`}>
                        <div
                          className={`max-w-[80%] rounded-lg p-3 ${
                            msg.isUser
                              ? "bg-primary text-primary-foreground"
                              : "bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-100"
                          }`}
                        >
                          <div className="mb-1 text-xs font-medium">
                            {msg.sender} • {msg.time}
                          </div>
                          <p>{msg.text}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="border-t p-4">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Type a message..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyDown={handleKeyDown}
                    />
                    <Button onClick={sendMessage}>Send</Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
    </div>
  )
}
