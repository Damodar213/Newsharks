"use client"

import Link from "next/link"
import { Bell, LightbulbIcon, LogOut, Menu, MessageSquare, Settings, TrendingUp, User, Video } from "lucide-react"
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
import { Input } from "@/components/ui/input"
import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { ReplyDialog } from "@/components/ContactDialog"

export default function EntrepreneurMessagesPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [user, setUser] = useState<any>(null)
  const [messages, setMessages] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [replyDialogOpen, setReplyDialogOpen] = useState(false)
  const [replyMessage, setReplyMessage] = useState<any | null>(null)
  const [replyConversationId, setReplyConversationId] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    if (typeof window !== "undefined") {
      const userData = localStorage.getItem("userData")
      if (userData) setUser(JSON.parse(userData))
    }
  }, [])

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (user?._id) {
      setLoading(true);
      const fetchMsgs = () => {
        fetch(`/api/messages?receiverId=${user._id}`)
          .then(res => res.json())
          .then(data => {
            if (data.success) setMessages(data.messages)
            setLoading(false)
          })
      };
      fetchMsgs();
      interval = setInterval(fetchMsgs, 2000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [user]);

  // Ensure correct conversationId for ReplyDialog
  useEffect(() => {
    const fetchConversationId = async () => {
      if (replyMessage && !replyMessage.conversation && user?._id && replyMessage.sender?._id && replyMessage.project?._id) {
        // Find or create the conversation between entrepreneur and sender for this project
        const res = await fetch("/api/messages/conversations", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            participants: [user._id, replyMessage.sender._id],
            project: replyMessage.project._id,
          }),
        });
        const data = await res.json();
        if (data.success) {
          setReplyConversationId(data.conversation._id);
        }
      } else if (replyMessage && replyMessage.conversation) {
        setReplyConversationId(replyMessage.conversation);
      } else {
        setReplyConversationId(null);
      }
    };
    fetchConversationId();
  }, [replyMessage, user]);

  const handleLogout = () => {
    localStorage.removeItem("userData")
    router.push("/login")
  }

  const filteredMessages = searchQuery
    ? messages.filter(
        (message) =>
          message.sender?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          message.content?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          message.project?.title?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : messages

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
              <h2 className="text-lg font-semibold">{user?.name || "Entrepreneur"}</h2>
              <p className="text-sm text-gray-500">{user?.role || "entrepreneur"}</p>
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
                className="flex items-center gap-2 rounded-lg bg-primary/10 px-3 py-2 text-primary"
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
                <p className="text-gray-500">Communicate with investors interested in your projects</p>
              </div>
              <div className="w-full md:w-64">
                <Input
                  type="search"
                  placeholder="Search messages..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <div className="grid gap-4">
              {loading ? (
                <div>Loading...</div>
              ) : filteredMessages.length === 0 ? (
                <div className="text-center py-12">
                  <MessageSquare className="mx-auto h-12 w-12 text-gray-300" />
                  <h3 className="mt-4 text-lg font-medium">No messages found</h3>
                  <p className="mt-1 text-gray-500">
                    {searchQuery ? "Try a different search term" : "You don't have any messages yet"}
                  </p>
                </div>
              ) : (
                filteredMessages.map((message) => (
                  <Card key={message._id}>
                    <CardHeader className="pb-2">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback>
                            {message.sender?.name
                              ? message.sender.name
                                  .split(" ")
                                  .map((n: string) => n[0])
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
                    <CardFooter className="flex justify-end gap-2">
                      <Button variant="outline" size="sm">
                        Schedule Call
                      </Button>
                      <Button size="sm" onClick={() => { setReplyMessage(message); setReplyDialogOpen(true); }}>
                        Reply
                      </Button>
                    </CardFooter>
                  </Card>
                ))
              )}
            </div>
            {replyMessage && replyConversationId && (
              <ReplyDialog
                isOpen={replyDialogOpen}
                onClose={() => { setReplyDialogOpen(false); setReplyMessage(null); setReplyConversationId(null); }}
                recipientName={replyMessage.sender?.name || "Unknown"}
                conversationId={replyConversationId}
                projectId={replyMessage.project?._id || replyMessage.project}
                recipientId={replyMessage.sender?._id}
              />
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
