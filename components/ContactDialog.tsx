"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"

interface ContactDialogProps {
  isOpen: boolean
  onClose: () => void
  entrepreneurName: string
  projectId: string
  projectTitle: string
}

export function ContactDialog({
  isOpen,
  onClose,
  entrepreneurName,
  projectId,
  projectTitle,
}: ContactDialogProps) {
  const [message, setMessage] = useState("")
  const [isSending, setIsSending] = useState(false)

  const handleSend = async () => {
    if (!message.trim()) {
      toast({
        title: "Error",
        description: "Please enter a message",
        variant: "destructive",
      })
      return
    }

    setIsSending(true)
    try {
      // 1. Get current user (investor)
      const userData = localStorage.getItem("userData")
      const investor = userData ? JSON.parse(userData) : null
      if (!investor) throw new Error("User not logged in")

      // 2. Fetch project to get entrepreneur's user ID
      const projectRes = await fetch(`/api/projects/${projectId}`)
      const projectData = await projectRes.json()
      if (!projectData.success) throw new Error("Project not found")
      const entrepreneurId = projectData.project.entrepreneur._id

      // 3. Create or find conversation
      const convRes = await fetch("/api/messages/conversations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          participants: [investor._id, entrepreneurId],
          project: projectId,
        }),
      })
      const convData = await convRes.json()
      if (!convData.success) throw new Error("Failed to create/find conversation")
      const conversationId = convData.conversation._id

      // 4. Send the message
      const response = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conversationId,
          content: message,
          sender: investor._id,
          receiver: entrepreneurId,
          project: projectId,
        }),
      })
      if (!response.ok) {
        throw new Error("Failed to send message")
      }
      toast({
        title: "Success",
        description: "Message sent successfully",
      })
      setMessage("")
      onClose()
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to send message. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSending(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Contact {entrepreneurName}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="text-sm text-gray-500">
            Project: {projectTitle}
          </div>
          <Textarea
            placeholder="Type your message here..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="min-h-[150px]"
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSend} disabled={isSending}>
            {isSending ? "Sending..." : "Send Message"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

interface ReplyDialogProps {
  isOpen: boolean
  onClose: () => void
  recipientName: string
  conversationId: string
  projectId: string
  recipientId: string
}

export function ReplyDialog({
  isOpen,
  onClose,
  recipientName,
  conversationId,
  projectId,
  recipientId,
}: ReplyDialogProps) {
  const [message, setMessage] = useState("")
  const [isSending, setIsSending] = useState(false)

  const handleSend = async () => {
    if (!message.trim()) {
      toast({
        title: "Error",
        description: "Please enter a message",
        variant: "destructive",
      })
      return
    }

    setIsSending(true)
    try {
      const userData = localStorage.getItem("userData")
      const sender = userData ? JSON.parse(userData) : null
      if (!sender) throw new Error("User not logged in")

      const response = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conversationId,
          content: message,
          sender: sender._id,
          receiver: recipientId,
          project: projectId,
        }),
      })
      if (!response.ok) {
        throw new Error("Failed to send message")
      }
      toast({
        title: "Success",
        description: "Reply sent successfully",
      })
      setMessage("")
      onClose()
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to send reply. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSending(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Reply to {recipientName}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <Textarea
            placeholder="Type your reply here..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="min-h-[150px]"
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSend} disabled={isSending}>
            {isSending ? "Sending..." : "Send Reply"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 