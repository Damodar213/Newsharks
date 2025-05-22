"use client"

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/lib/AuthContext";
import Link from "next/link";
import {
  Bell,
  LogOut,
  Menu,
  MessageSquare,
  Settings,
  TrendingUp,
  User,
  Video,
  Wallet,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Video as VideoIcon, Send, Search } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";

interface Message {
  _id: string;
  content: string;
  sender: {
    _id: string;
    name: string;
    role: string;
  };
  receiver: {
    _id: string;
    name: string;
    role: string;
  };
  read: boolean;
  createdAt: string;
  project?: {
    _id: string;
    title: string;
  };
}

interface Conversation {
  _id: string;
  participants: Array<{
    _id: string;
    name: string;
    role: string;
  }>;
  project: {
    _id: string;
    title: string;
  };
  lastMessage?: Message;
  unreadCount: number;
}

export default function InvestorMessages() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, loading } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreatingConversation, setIsCreatingConversation] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const [allMessages, setAllMessages] = useState<Message[]>([]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUserData = localStorage.getItem("userData");
      if (storedUserData) setUserData(JSON.parse(storedUserData));
    }
  }, []);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      fetchConversations();
    }
  }, [user]);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (selectedConversation) {
      fetchMessages(selectedConversation._id);
      interval = setInterval(() => {
        fetchMessages(selectedConversation._id);
      }, 2000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [selectedConversation]);

  useEffect(() => {
    const projectId = searchParams.get('project');
    if (projectId && user && !isCreatingConversation) {
      createOrFindConversation(projectId);
    }
  }, [searchParams, user, isCreatingConversation]);

  // Fetch all messages for the investor (sent and received)
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (user?._id) {
      const fetchMsgs = () => {
        fetch(`/api/messages?receiverId=${user._id}`)
          .then(res => res.json())
          .then(data => {
            if (data.success) setAllMessages(data.messages)
          })
      };
      fetchMsgs();
      interval = setInterval(fetchMsgs, 2000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [user]);

  const handleLogout = () => {
    localStorage.removeItem("userData");
    router.push("/login");
  };

  const createOrFindConversation = async (projectId: string) => {
    try {
      setIsCreatingConversation(true);
      // First, fetch the project details to get the entrepreneur's ID
      const projectResponse = await fetch(`/api/projects/${projectId}`);
      const projectData = await projectResponse.json();
      
      if (!projectData.success) {
        throw new Error('Failed to fetch project details');
      }

      const entrepreneurId = projectData.project.entrepreneur._id;

      // Create a new conversation
      const response = await fetch('/api/messages/conversations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          participants: [user?._id, entrepreneurId],
          project: projectId,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setSelectedConversation(data.conversation);
        // Remove the project parameter from the URL
        router.replace('/dashboard/investor/messages');
      } else {
        throw new Error(data.error || 'Failed to create conversation');
      }
    } catch (error) {
      console.error('Error creating conversation:', error);
      toast({
        title: 'Error',
        description: 'Failed to start conversation. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsCreatingConversation(false);
    }
  };

  const fetchConversations = async () => {
    try {
      const response = await fetch(`/api/messages/conversations?userId=${user?._id}`);
      const data = await response.json();
      if (data.success) {
        setConversations(data.conversations);
      }
    } catch (error) {
      console.error("Error fetching conversations:", error);
    }
  };

  const fetchMessages = async (conversationId: string) => {
    try {
      setLoadingMessages(true);
      const response = await fetch(`/api/messages?conversationId=${conversationId}`);
      const data = await response.json();
      if (data.success) {
        setMessages(data.messages);
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
    } finally {
      setLoadingMessages(false);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation) return;

    try {
      const response = await fetch("/api/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          conversationId: selectedConversation._id,
          content: newMessage,
          sender: user?._id,
          receiver: selectedConversation.participants.find(p => p._id !== user?._id)?._id,
          project: selectedConversation.project._id,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setMessages([...messages, data.message]);
        setNewMessage("");
        fetchConversations(); // Refresh conversations to update last message
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const startVideoCall = () => {
    if (!selectedConversation) return;
    router.push(`/dashboard/investor/video-call/${selectedConversation._id}`);
  };

  const filteredConversations = conversations.filter(conv => 
    conv.participants.some(p => p.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
    conv.project.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading || isCreatingConversation) {
    return <div>Loading...</div>;
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
              <span className="text-xl font-bold hidden md:inline-block">NEW SHARKS</span>
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Avatar>
                    <AvatarFallback>{userData?.name?.charAt(0) || "I"}</AvatarFallback>
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
              <h2 className="text-lg font-semibold">{userData?.name || "Investor"}</h2>
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
                className="flex items-center gap-2 rounded-lg bg-primary/10 px-3 py-2 text-primary"
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
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
              <div>
                <h1 className="text-2xl font-bold">Messages</h1>
                <p className="text-gray-500">Communicate with entrepreneurs in your projects</p>
              </div>
              <div className="w-full md:w-64">
                <Input
                  type="search"
                  placeholder="Search conversations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            {selectedConversation ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Conversations List */}
                <div className="md:col-span-1 space-y-4">
                  <div className="flex items-center space-x-2">
                    <Search className="w-4 h-4 text-gray-500" />
                    <Input
                      placeholder="Search conversations..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="flex-1"
                    />
                  </div>
                  <div className="space-y-2">
                    {filteredConversations.map((conversation) => (
                      <Card
                        key={conversation._id}
                        className={`p-4 cursor-pointer hover:bg-gray-50 ${
                          selectedConversation?._id === conversation._id ? "bg-gray-50" : ""
                        }`}
                        onClick={() => setSelectedConversation(conversation)}
                      >
                        <div className="flex items-center gap-2">
                          <Avatar>
                            <AvatarFallback>
                              {conversation.participants
                                .find(p => p._id !== user?._id)
                                ?.name.split(" ")
                                .map(n => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">
                              {conversation.participants.find(p => p._id !== user?._id)?.name}
                            </p>
                            <p className="text-xs text-gray-500 truncate">
                              {conversation.project.title}
                            </p>
                          </div>
                          {conversation.unreadCount > 0 && (
                            <div className="bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                              {conversation.unreadCount}
                            </div>
                          )}
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
                {/* Chat Area */}
                <div className="md:col-span-2">
                  <div className="flex flex-col h-[600px]">
                    {/* Chat Header */}
                    <div className="flex items-center justify-between p-4 border-b">
                      <div className="flex items-center space-x-3">
                        <Avatar>
                          <AvatarFallback>
                            {selectedConversation.participants
                              .find(p => p._id !== user?._id)
                              ?.name.split(" ")
                              .map(n => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-medium">
                            {selectedConversation.participants.find(p => p._id !== user?._id)?.name}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {selectedConversation.project.title}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={startVideoCall}
                        className="flex items-center space-x-2"
                      >
                        <VideoIcon className="w-4 h-4" />
                        <span>Start Video Call</span>
                      </Button>
                    </div>
                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                      {loadingMessages ? (
                        <div>Loading messages...</div>
                      ) : (
                        messages.map((message) => (
                          <div
                            key={message._id}
                            className={`flex ${
                              message.sender._id === user?._id ? "justify-end" : "justify-start"
                            }`}
                          >
                            <div
                              className={`max-w-[70%] rounded-lg p-3 ${
                                message.sender._id === user?._id
                                  ? "bg-blue-500 text-white"
                                  : "bg-gray-100"
                              }`}
                            >
                              <p>{message.content}</p>
                              <p className="text-xs mt-1 opacity-70">
                                {new Date(message.createdAt).toLocaleTimeString()}
                              </p>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                    {/* Message Input */}
                    <div className="p-4 border-t">
                      <div className="flex space-x-2">
                        <Input
                          placeholder="Type your message..."
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                        />
                        <Button onClick={sendMessage}>
                          <Send className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid gap-4">
                {allMessages.length === 0 ? (
                  <div className="text-center py-12">
                    <MessageSquare className="mx-auto h-12 w-12 text-gray-300" />
                    <h3 className="mt-4 text-lg font-medium">No messages found</h3>
                    <p className="mt-1 text-gray-500">You don't have any messages yet</p>
                  </div>
                ) : (
                  allMessages.map((message) => (
                    <Card key={message._id}>
                      <CardHeader className="pb-2">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-10 w-10">
                            <AvatarFallback>
                              {message.sender?.name
                                ? message.sender.name
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")
                                : "?"}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <CardTitle className="text-base">{message.sender?.name || "Unknown"}</CardTitle>
                            <CardDescription className="text-xs">
                              {new Date(message.createdAt).toLocaleString()}
                            </CardDescription>
                          </div>
                          {!message.read && (
                            <Badge variant="secondary" className="ml-auto">
                              New
                            </Badge>
                          )}
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm mb-2">{message.content}</p>
                        <p className="text-xs text-gray-500">
                          Project: {message.project?.title || "N/A"}
                        </p>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
